/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
// 工具函数
var Util = {
  $: function ( selector, type ) {
    return type ? document.querySelectorAll( selector ) : document.querySelector( selector );
  },
  bind: function ( ele, type, handle ) {
    if ( ele.addEventListener ) {
      ele.addEventListener( type, handle, false );
    } else if ( ele.attachEvent ) {
      ele.attachEvent( "on" + type, handle );
    } else {
      ele[ "on" + type ] = handle;
    }
  }
}

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}
var Map = {
  "day": '日',
  "week": '周',
  "month": '月'
};

var Map_Width = {
  "day": '6px',
  "week": '30px',
  "month": '100px'
}

/**
 * 渲染图表
 */
function renderChart( data ) {
  var chartWrap  = Util.$(".aqi-chart-wrap");
  chartWrap.innerHTML = "";
  var columnArea = document.createElement( "div" ),
      dataArea   = document.createElement( "div" ),
      title      = document.createElement( "p" ),
      columnStr  = dataStr = "";

  columnArea.className = "column";
  dataArea.className   = "date";
  title.className      = "title";
  title.innerHTML      = pageState.nowSelectCity + "地区01-03月份" + Map[pageState.nowGraTime]+ "空气质量状况";

  chartWrap.appendChild( title );
  chartWrap.appendChild( columnArea );
  chartWrap.appendChild( dataArea );

  for ( var i in data ) {
    if ( data.hasOwnProperty( i ) ) {
      columnStr += '<div class="column-line" data-tip="日期：' + i + "\n空气质量：" + data[i] + '" style="height:' + data[i] + 'px; width:' + Map_Width[ pageState.nowGraTime ] + '; background: ' + randomColor() + '"></div>';
      dataStr += '<div class="date-line">' + formatDate( i ).day + '</div>';
    }
  }

  bindEvent();
  columnArea.innerHTML = columnStr;
  //dataArea.innerHTML = dataStr;
}

// 事件绑定
function bindEvent() {
  var chartWrap  = Util.$(".aqi-chart-wrap");
  Util.bind( chartWrap, 'mouseover', function ( e ) {
    var target = e.target || e.srcElement;
    if ( !Util.$(".tip", true ).length ) {
      var tip = document.createElement("div");
      tip.className = "tip";
      tip.style.display = "none";
      chartWrap.appendChild( tip );
    };

    var tip = Util.$(".tip");
    if ( e.target.classList.toString().indexOf("column-line") > -1 ) {
      tip.style.display = "block";
      tip.innerHTML = target.dataset.tip;
      tip.style.top = e.pageY - tip.offsetHeight - 10 + "px";
      tip.style.left = e.pageX - ( tip.offsetWidth / 2 ) + "px";
    } else {
      tip.style.display = "none";
    }
  })
}

function formatDate( date ) {
  var dateArr = date.split("-");
  return {
    year: dateArr[0],
    month: dateArr[1],
    day: dateArr[2]
  }
}

/**
 * 随机生成颜色
 * 生成RGB颜色
 */
function randomColor() {
  return 'rgb(' + getRandom() + ',' + getRandom() + ',' + getRandom() + ')';
}
// 获取颜色随机数
function getRandom() {
  return Math.ceil(Math.random() * 254)
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange( e ) {
  // 确定是否选项发生了变化
  var flag = false, j = 0, sum = 0, count = {}, week = 0;
  if ( e.target.value !== pageState.nowGraTime ) {
    flag = true;
    pageState.nowGraTime = e.target.value;
  }
  if ( flag ) renderChart( chartData[ pageState.nowGraTime ] );

}

/**
 * select发生变化时的处理函数
 */
function citySelectChange( e ) {
  // 确定是否选项发生了变化
  var flag = false, chartData;
  if ( e.target.value !== pageState.nowSelectCity ) {
    flag = true;
    pageState.nowSelectCity = e.target.value;
  }
  // 设置对应数据
  if ( flag ) {
    initAqiChartData();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var oRadio = Util.$( "#form-gra-time input[type='radio']", true ),
      len = oRadio.length;

  for (var i = 0; i < len; i++) {
    Util.bind( oRadio[i], 'click', graTimeChange );
    // 设置初始显示周期值
    if ( oRadio[i].checked ) pageState.nowGraTime = oRadio[i].value;
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var oSelect  = Util.$( "#city-select" ), citys = "";
  for ( var city in aqiSourceData ) {
    if ( aqiSourceData.hasOwnProperty( city ) ) {
      citys += "<option>" + city + "</option>";
    }
  }
  oSelect.innerHTML = citys;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  Util.bind( oSelect, "change", citySelectChange );
  // 设置初始城市
  pageState.nowSelectCity = oSelect.value;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var j = i = weekCounter = monthCounter = weekSum = monthSum = 0,
      week = month = 1, count = {day: {}, week: {}, month: {}};

  chartData = aqiSourceData[ pageState.nowSelectCity ];

  // 统计总数
  for ( var date in chartData ) {
    if ( chartData.hasOwnProperty( date ) ) {
      i++;
      count.day[ date ] = chartData[ date ];
    }
  }
  // 数据过滤
  for ( var date in chartData ) {
    if ( chartData.hasOwnProperty( date ) ) {
      j++, weekCounter++, monthCounter++;
      weekSum  += parseInt( chartData[ date ] );
      monthSum += parseInt( chartData[ date ] );
      // 计算整星期
      if ( j % 7 === 0 ) {
        count.week[ "第" + week++ + "周" ] = Math.ceil( weekSum / weekCounter );
        weekSum = 0;
        weekCounter = 0;
      }
      // 计算整月份
      if ( monthCounter === 31 ) {
        count.month[ "第" + month++ + "月" ] = Math.ceil( monthSum / monthCounter );
        monthSum = 0;
        monthCounter = 0;
      }
      // 如果不满7天
      if ( j % 7 !== 0 && Math.ceil( i / 7 ) === Math.ceil( j / 7 ) ) {
        count.week[ "第" + week + "周" ] = Math.ceil( weekSum / weekCounter );
      }
      // 如果不满31天
      if ( j % 31 !== 0 && Math.ceil( i / 31 ) === Math.ceil( j / 31 ) ) {
        count.month[ "第" + month + "月" ] = Math.ceil( monthSum / monthCounter );
      }
    }
  }
  chartData = count;
  // 渲染图表
  renderChart( chartData[ pageState.nowGraTime ] );
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload = function () {
  init();
}
