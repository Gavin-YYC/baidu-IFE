window.onload = function () {
  var btns = document.querySelector(".btns");
  var root = document.querySelector(".root");
  var speed = document.querySelector(".speed").value;
  // 初始化walkMan
  var walkNode = new walkMan();
  // 事件绑定
  btns.addEventListener( 'click', function ( e ) {
    var target = e.target;
    var type   = target.dataset.type;
    target.nodeName.toLowerCase() === 'a' && !walkNode.isWalking && walkNode[ type ]( root ).animate( speed );
  }, false );
}

// walkMan组件
var walkMan = function () {
  this.nodes = [];
  this.isWalking = false;
}

walkMan.prototype = {
  // 先序
  // DLR 先访问根节点，遍历左子节点、最后遍历右子节点
  preOrder: function ( root ) {
    this.nodes.push( root );
    root.firstElementChild && this.preOrder( root.firstElementChild );
    root.lastElementChild  && this.preOrder( root.lastElementChild );
    return this;
  },

  // 中序
  // LDR，先访问左子节点，在遍历根节点，最后遍历右子节点
  inOrder: function ( root ) {
    root.firstElementChild && this.preOrder( root.firstElementChild );
    this.nodes.push( root );
    root.lastElementChild  && this.preOrder( root.lastElementChild );
    return this;
  },

  // 后序
  // LRD，先遍历左子节点，在遍历右子节点，最后访问根节点
  postOrder: function ( root ) {
    root.firstElementChild && this.preOrder( root.firstElementChild );
    root.lastElementChild  && this.preOrder( root.lastElementChild );
    this.nodes.push( root );
    return this;
  },

  // 清除样式操作
  clear: function () {
    var nodes = this.nodes;
    for (var i = 0, len = nodes.length; i < len; i++) {
      nodes[i].style.background = "#fff";
    }
  },

  // 动画方法
  // 策略：当前项改变颜色，如果项数大于等于2，则让上一个的红色消失
  animate: function ( speed ) {
    var nodes = this.nodes,
        speed = speed || 500,
        timer = null;
        i     = 0;
    this.clear();
    // 防止多个动画同时出现
    if ( !this.isWalking ) {
      this.isWalking = true;
      clearInterval( timer );
      timer = setInterval(function () {
        // 动画结束后进行清理
        if ( i >= nodes.length - 1 ) {
          this.nodes = [];
          this.isWalking = false;
          clearInterval( timer );
          timer = null;
        }
        nodes[i++].style.background = "red";
        if ( i >= 2 ) nodes[i-2].style.background = "#fff";
      }.bind( this ), speed );
    }
  },
  constructor: walkMan
}
