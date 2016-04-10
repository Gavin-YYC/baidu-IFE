window.onload = function () {
  var Test_18 = {
    // 事件行为
    action: [],
    // 队列
    queue : [],
    // 工具库
    Util: {
      $: function ( selector ) {
        return document.querySelector( selector );
      },
      trim: function ( value ) {
        return value.replace(/(^\s*)|(\s*$)/g, "");
      },
      inArry: function ( ele, arr ) {
        for (var i = 0; i < arr.length; i++) {
          if ( arr[i] === ele ) {
            return true;
          }
        }
        return false;
      }
    },
    // 事件绑定
    bindEvent: function () {
      var that  = this;
      var $btns = this.Util.$(".btns");
      var $searchBtn = this.Util.$(".search_btn");

      $btns.addEventListener( 'click', function ( e ) {
        var target = e.target;
        if ( target.nodeName.toLowerCase() !== 'a' ) return;
        var action = that.getAction( target );
        that.manageQueue();
        e.preventDefault();
      }, false);
      $searchBtn.addEventListener( 'click', function ( e ) {
        var indexArr = that.search();
        that.render( indexArr );
      })
    },

    // 搜索
    search: function () {
      var $search = this.Util.$(".search");
      var value   = $search.value;
      var queue   = this.queue;
      var len     = queue.length;
      var indexArr= [];

      for (var i = 0; i < len; i++) {
        if ( queue[i].indexOf( value ) != -1 ) {
          indexArr.push( i );
        }
      }
      return indexArr;
    },

    // 队列管理
    // 入队返回长度
    // 出队返回出的字符
    manageQueue: function () {
      var $input = this.Util.$(".input textarea"),
          value  = this.Util.trim($input.value),
          check = true,
          dequeue = null;

      // 输入过滤
      newValue = this.valueFilter( value );
      if ( this.action === 'pop' || this.action === 'shift' ) check = false;
      // 入队操作
      if ( check && newValue ) {
        for (var i = 0; i < newValue.length; i++) {
          this.queue[ this.action ]( newValue[i] );
        }
      }
      // 出队操作
      if ( !check ) {
        if ( this.queue.length ) {
          dequeue = this.queue[ this.action ]();
          alert( dequeue );
        };
      };
      // 重新渲染
      this.render();
      $input.focus();
    },

    // 字符串过滤
    valueFilter: function ( value ) {
      var reg = /,|，|、| +|\r+|\n+|\t+/g;
      value = value.replace( reg, ",");
      var arr = value.split(",");
      var len = arr.length;
      var newArr = [];
      for (var i = 0; i < len; i++) {
        if ( arr[i] && arr[i] !== '') {
          newArr.push( arr[i] );
        }
      };
      return newArr;
    },
    // 渲染内容
    render: function ( indexArr ) {
      var $wrap  = this.Util.$(".wrap-main"),
          html   = "",
          queue  = this.queue,
          len    = queue.length;

      $wrap.innerHTML = "";

      for (var i = 0; i < len; i++) {
        if ( indexArr ) {
          if ( this.Util.inArry( i, indexArr )) {
            html += '<div class="cube" style="background:red">' + queue[i] + '</div>';
          } else {
            html += '<div class="cube">' + queue[i] + '</div>';
          }
        } else {
          html += '<div class="cube">' + queue[i] + '</div>';
        }
      }
      $wrap.innerHTML = html;
    },

    // 获取操作队列的自定义动作
    getAction: function ( ele ) {
      if ( !ele ) return;
      var data = ele.dataset.action || null;
      if ( !data ) return;
      this.action = [];
      this.action = data;
    },

    init: function () {
      this.bindEvent();
    }
  };

  Test_18.init();
}
