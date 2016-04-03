/**
 * 基础工具库
 * 把常用的方法集中在这里
 */
var Util = {
  // 匹配元素
  $: function ( selector, context ) {
    ele = context || document;
    return ele.querySelector( selector );
  },
  // 去除所有空格
  trim: function ( obj ) {
    var reg_trim = /\s+/g;
    return obj.replace( reg_trim, '');
  },
  // 创建元素
  creEle: function ( ele ) {
    return document.createElement( ele );
  },
  // 是否为空对象
  isEmptyObject: function ( obj ) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  },
  clear: function ( ele ) { ele.innerHTML = "" }
};

/**
 * 验证工具
 * 该验证方法很不灵活，暂时也没想到其他的
 * 在多看一下别人的代码吧
 */
var validate = function ( obj ) {

  // 中英文正则
  var reg_str = /^[A-Za-z\u4e00-\u9fa5]*$/g;
  // 数字正则
  var reg_num = /^\d*$/g;

  return {
    notNull: function () {
      if ( obj.length === 0 ) {
        showMsg("内容不能为空！");
        return false;
      }
      return true;
    },
    str: function () {
      if ( !this.notNull( obj ) ) return;
      if ( !reg_str.test( obj )) {
        showMsg("城市必须是中英文字符！");
        return false;
      }
      return true;
    },
    num: function () {
      if ( !this.notNull( obj ) ) return;
      if ( !reg_num.test( obj )) {
        showMsg("空气质量必须为数字！");
        return false;
      }
      return true;
    }
  };
};

/**
 * 错误提示区
 * 可在此自定义弹窗组件
 */
function showMsg( msg ) {
  alert( msg );
  console.log( msg );
}

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};


/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
  var sCity    = Util.trim( Util.$("#aqi-city-input").value ),
      iQuality = Util.trim( Util.$("#aqi-value-input").value ),
      setData  = function () {
        aqiData[ sCity ] = parseInt( iQuality );
        return aqiData;
      };
  // 表单验证，成功后插入内容
  validate( sCity ).str() && validate( iQuality ).num() && setData();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
  var oTable   = Util.$("#aqi-table");
  // 清空表格
  Util.clear( oTable );
  // 如果数据不为空，则显示标题
  if ( !Util.isEmptyObject( aqiData ) ) {
    var _tr = Util.creEle("tr");
    _tr.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>";
    oTable.appendChild( _tr );
  }
  // 循环数据，输出内容
  for ( var city in aqiData ) {
    if (aqiData.hasOwnProperty(city)) {
      var tr = Util.creEle("tr");
      tr.innerHTML = "<td>" + city + "</td>"
                   + "<td>" + aqiData[city] + "</td>"
                   + "<td><button>删除</button></td>";
      oTable.appendChild( tr );
    }
  }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle( e ) {
  if ( e.target.nodeName.toLowerCase() === 'button') {
    // 利用冒泡路径来处理的，和DOM紧密联系在一起了
    if ( e.path[2].nodeName.toLowerCase() === 'tr') {
      var tr = e.path[2];
      var value = Util.trim( tr.firstChild.innerHTML );
      delete aqiData[value];
    }
  }
  renderAqiList();
}

function init() {
  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var oBtn   = Util.$("#add-btn"),
      oTable = Util.$("#aqi-table");
  oBtn.addEventListener( 'click', addBtnHandle, false );
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  oTable.addEventListener( 'click', delBtnHandle, false );
}

window.onload = function () {
  init();
}
