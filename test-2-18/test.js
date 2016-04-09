window.onload = function () {
  var Test_18 = {
    // 工具库
    Util: {
      $: function ( selector ) {
        return document.querySelector( selector );
      },
      trim: function ( value ) {
        return value.replace(/\s+/g, "");
      }
    },
    // 事件行为
    action: [],
    // 队列
    queue : [],
    // 事件绑定
    bindEvent: function () {
      var that  = this;
      var $btns = this.Util.$(".btns");
      $btns.addEventListener( 'click', function ( e ) {
        var target = e.target;
        if ( target.nodeName.toLowerCase() !== 'a' ) return;
        var action = that.getAction( target );
        that.manageQueue();
        e.preventDefault();
      }, false);
    },

    // 队列管理
    // 入队返回长度
    // 出队返回出的字符
    manageQueue: function () {
      var $input = this.Util.$(".input input"),
          value  = this.Util.trim($input.value),
          check = true,
          dequeue = null;

      if ( this.action === 'pop' || this.action === 'shift' ) check = false;
      if ( check && value || !check) {
        dequeue = this.queue[ this.action ]( value );
        this.render();
      }
      check ? $input.focus() : alert( dequeue );
    },
    // 渲染内容
    render: function () {
      var $wrap  = this.Util.$(".wrap-main"),
          html   = "",
          queue  = this.queue,
          len    = queue.length;
      for (var i = 0; i < len; i++) {
        html += '<div class="cube">' + queue[i] + '</div>';
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
