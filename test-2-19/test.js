window.onload = function () {
  // 添加bind方法，用于setInterval中绑定this
  Function.prototype.bind = Function.prototype.bind || function( context ){
    var self = this, arg = Array.prototype.slice.call( arguments );
    return function(){
      return self.apply( context, arg.slice( 1 ) );
    }
  }
  var Test_18 = {
    // 事件行为
    action: [],
    // 队列
    queue : [],
    // 排序镜像
    snapshot: [],
    // 定时器
    timer: null,
    // 排序速度
    speed: 50,
    // 工具库
    Util: {
      $: function ( selector ) {
        return document.querySelector( selector );
      },
      trim: function ( value ) {
        return value.replace(/\s+/g, "");
      }
    },
    // 事件绑定
    bindEvent: function () {
      var that  = this;
      var $btns = this.Util.$(".btns");
      $btns.addEventListener( 'click', function ( e ) {
        var target = e.target;
        if ( target.nodeName.toLowerCase() == 'a' ) {
          that.setAction( target );
          that.manageQueue();
        };
        if ( target.nodeName.toLowerCase() == 'span' ) {
          that.setAction( target );
          that.actionRouter();
        };
        e.preventDefault();
      }, false);
    },

    // 冒泡排序动作相关路由
    // 根据相应动作执行相应方法
    actionRouter: function () {
      var that   = this;
      var action = that.action;
      var btn    = this.Util.$(".stop");
      switch ( action ) {
        case "random":
          that.randomNumber();
          that.render();
          clearInterval( that.timer );
          break;
        case "bubbleSort":
          that.sortLine();
          btn.style.display = "block";
          clearInterval( that.timer );
          that.timer = setInterval( that.paintingChart.bind(that), that.speed );
          break;
        case "stopSort":
          that.stopSort();
          break;
        case "nextSort":
          that.next();
          break;
        case "empty":
          that.empty();
          break;
        default:
          console.log("default");
      }
    },

    // 停止排序
    // 继续排序
    stopSort: function () {
      var now = this.snapshot;
      var btn = this.Util.$(".stop");
      if ( btn.className.indexOf("stoped") >= 0 ) {
        btn.classList.remove("stoped");
        btn.innerHTML = "停止";
        this.timer = setInterval( this.paintingChart.bind(this), this.speed );
      } else {
        btn.classList.add("stoped");
        btn.innerHTML = "开始";
        clearInterval( this.timer );
      }
    },

    // 下一步
    next: function () {
      var next   = this.Util.$(".next");
      clearInterval( this.timer );
      this.timer = setTimeout( this.paintingChart.bind(this), this.speed );
    },

    // 情况
    empty: function () {
      this.queue = [];
      this.render();
    },

    randomNumber: function ( num, max, min ) {
      // 随机生成60个10-100之间的整数。
      var num = num || 60, max = max || 100 , min = min || 10;
      var queue = [];
      for (var i = 0; i < num; i++) {
        var r = parseInt( Math.random() * ( max - min ) + min );
        queue.push( r );
      }
      this.queue = queue;
    },

    // 队列管理
    // 如果是进对，需要进行数据检验
    // 如果是出队，则不进行数据检验
    manageQueue: function () {
      var that   = this;
      var $input = this.Util.$(".input input"),
          value  = this.Util.trim($input.value),
          check  = true;
      if ( this.action === 'pop' || this.action === 'shift' ) check = false;
      if ( check && this.checkInput( value ) || !check ) {
        that.queue[ that.action ]( value );
        that.render();
      }
      if ( check ) $input.focus();
    },

    // 渲染内容
    // 如果传入参数，则按照该参数进行渲染
    // 如果没有传入参数，则取this.queue中的数据
    // 数字和图表同步渲染
    render: function ( arr ) {
      if ( arr ) this.queue = arr;
      var $wrap  = this.Util.$(".wrap-main"),
          $chart = this.Util.$(".chart-main"),
          cube   = chart = "",
          queue  = this.queue,
          len    = queue.length;
      for (var i = 0; i < len; i++) {
        cube += '<div class="cube">' + queue[i] + '</div>';
        chart += '<div class="line" title="' + queue[i] + '" style="height:' + parseInt(queue[i]) * 3 + 'px; left:' + i * 12 + 'px; background-color:red"></div>';
      }
      $wrap.innerHTML = cube;
      $chart.innerHTML = chart;
    },

    randomColor: function () {
      return "#" + Math.random().toString(16).substring(2,8);
    },

    // 输入检测
    checkInput: function ( value ) {
      var passed = true;
      if ( !value ) {
        alert("请输入10-100之间的数字！");
        passed = false;
      }
      // 数字验证
      if ( parseInt(value) < 10 || parseInt(value) > 100 ) {
        alert("输入数字不合法：10-100之间！");
        passed = false;
      }
      // 如果队列的长度大于60，提示错误
      if ( this.queue.length >= 60 ) {
        alert("队列长度超过60，无法输入");
        passed = false;
      }
      return passed;
    },

    // 获取操作队列的自定义动作
    setAction: function ( ele ) {
      if ( !ele ) return;
      var data = ele.dataset.action || null;
      if ( !data ) return;
      this.action = [];
      this.action = data;
    },

    //冒泡排序
    sortLine: function () {
      var that = this,
          ine = document.querySelectorAll(".line"),
          data = this.queue,
          len  = data.length,
          temp = 0,
          bigArr = [];
      // 冒泡排序的方法是：前后两个对比，小的在前，大的在后。
      while ( len ) {
        for (var i = 0; i < len - 1; i++) {
          if ( data[i] > data[i+1] ) {
            temp = data[i];
            data[i] = data[i+1];
            data[i+1] = temp;
          }
          // 记录每次排序的快照，用于后期展示
          bigArr.push( JSON.parse( JSON.stringify( data ) ) );
        }
        len--;
      }
      this.snapshot = bigArr;
    },
    // 绘制排序时的图表
    paintingChart: function () {
      var arr = this.snapshot;
      var firstArr = arr.shift();
      this.render( firstArr );
    },

    // 初始化方法
    init: function () {
      this.bindEvent();
      // 初始化数据并渲染
      this.randomNumber( 60 );
      this.render();
    }
  };

  // 初始化
  Test_18.init();
}
