// 工具库
// $: 获取DOM
// trim: 去掉字符串前后空格
// inArray: 某一数组中是否存在某一元素
// 不兼容IE8
// 如果要兼容IE8，只要替换该工具库即可
var Util = {
  $: function ( selector ) {
    return document.querySelector( selector );
  },
  trim: function ( value ) {
    return value.replace(/(^\s*)|(\s*$)/g, "");
  },
  inArray: function ( ele, arr ) {
    for (var i = 0; i < arr.length; i++) {
      if ( arr[i] === ele ) {
        return i;
      }
    }
    return -1;
  },
  bind: function ( ele, type, handle ) {
    if ( ele.addEventListener ) {
      ele.addEventListener( type, handle, false );
    } else if ( ele.attachEvent ) {
      ele.attachEvent( "on" + type, handle );
    } else {
      ele[ "on" + type] = handle;
    }
  },
  hasClass: function ( ele, cls ) {
    var classList = ele.classList;
    return classList.contains( cls) ? true : false;
  }
};

// Tags 组件
// 接收参数：el：组件主容器
//         autoComplete： 是否自动完成
//         maxTagsNum:    Tags最大数量
var Tags = function ( options ) {
  this.action = [];
  this.queue  = [];
  this.tagDiv = null;
  this.cls    = options.el;
  this.el     = Util.$( this.cls ); // el: class
  this.isAuto = options.autoComplete; //是否激活自动完成
  this.maxTagsNum = options.maxTagsNum || 10;

  this.init();
}

Tags.prototype = {

  // init
  // 初始化方法
  init: function () {
    this.initTagListDiv();
    this.bindEvent();
  },

  // bindEvent
  // 统一事件绑定
  // 如果是自动完成，则监听keyup事件，否则监听click事件
  // 如果是自动完成，执行add方法，否则执行批量add方法
  bindEvent: function () {
    var self   = this;
    var type   = this.isAuto ? 'keyup' : 'click';
    var handle = this.isAuto ? 'add'   : 'batchAdd';
    Util.bind( this.el, type, function ( e ) {
      e.preventDefault();
      var target = e.target || e.srcElement;
      self[ handle ]( target, e.which );
    } );
    Util.bind( this.el, 'click', function ( e ) {
      var target = e.target || e.srcElement;
      self.remove( target );
    });
  },

  // AutoComplete
  // Tag 自动完成
  add: function ( ele, code ) {
    var value = Util.trim( ele.value );
    var flag = true;
    if ( this._isBreak( code ) ) {
      if ( code === 188 ) value = value.substr( 0, value.length - 1 );  // 如果输入"," 则先去掉该分隔符
      if ( this.has( value ) ) flag = false;
      if ( flag ) this._manageQueue( value ).render();
      ele.value = "";
    }
  },

  // batchAdd
  // 批量添加
  batchAdd: function ( ele ) {
    var reg = /^btn$/;
    var area = Util.$(this.cls + " textarea");
    var value;
    if ( !this.isAuto && reg.test( ele.className ) ) {
      value = this.valueFilter( area.value );
      this._manageQueue( value ).render();
    }
  },

  // initTagListDiv
  // 初始化tag-list
  initTagListDiv: function () {
    this.tagDiv = document.createElement("div");
    this.tagDiv.className = "tag-list";
    this.el.appendChild( this.tagDiv );
  },

  // remove
  // 移除一个tag
  remove: function ( ele ) {
    var cls = ele.className;
    var value = ele.innerHTML;
    var index = Util.inArray( value, this.queue );
    if ( cls === 'tag' ) {
      if ( index + 1 ) {
        this.queue.splice( index, 1 );
        this.render();
      }
    }
  },

  // has
  // tag是否重复
  has: function ( value ) {
    return Util.inArray( value, this.queue ) >=0 ? true : false;
  },

  // render
  // 渲染操作
  render: function () {
    var queue = this.queue;
    var len   = queue.length;
    var html  = "";
    for (var i = 0; i < len; i++) {
      html += '<span class="tag">' + queue[i] + '</span>';
    }
    this.tagDiv.innerHTML = html;
    return this;
  },

  // _manageQueue
  // 队列管理
  _manageQueue: function ( value ) {
    if ( Object.prototype.toString.call( value ) === "[object Array]" ) {
      for (var i = 0; i < value.length; i++) {
        if ( this.queue.length >= this.maxTagsNum ) this.queue.shift();
        this.queue.push( value[i] );
      }
    } else {
      if ( this.queue.length >= this.maxTagsNum ) this.queue.shift();
      this.queue.push( value );
    }
    return this;
  },

  // _isBreak
  // 是否是断点
  // 匹配keycode，32是空格、188是逗号，13是回车
  _isBreak: function ( code ) {
    var reg   = new RegExp( '32|188|13' );
    return reg.test( code ) ? true : false;
  },

  // valueFilter
  // 字符串过滤
  // 自动去重
  valueFilter: function ( value ) {
    var reg = /,|，|、| +|\r+|\n+|\t+/g;
    value = value.replace( reg, ",");
    var arr = value.split(",");
    var len = arr.length;
    var newArr = [];
    for (var i = 0; i < len; i++) {
      arr[i] && arr[i] !== '' &&
      // 添加的数据是否自身重复
      Util.inArray( arr[i], newArr ) < 0 &&
      // 添加的数据是否与this.queue重复
      Util.inArray( arr[i], this.queue ) < 0 &&
      // 都不重复，则添加进newArr
      newArr.push( arr[i] );
    };
    return newArr;
  },
  constructor: Tags
}
