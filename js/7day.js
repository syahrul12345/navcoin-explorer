      
function sevenDayChartData() {
  var answerArr = [];
  var tickinterval = "hour"
  var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
  var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
  var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
  //get current time
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET",proxyUrl+url, false);
  xhr.send();
  dataSat = getData(xhr.responseText) //data is the price of navcoin in sats
  
  xhr.open("GET",proxyUrl+urlBTC,false);
  xhr.send();
  dataBTC = getData(xhr.responseText) //dataBTC is the price of BTC in usd
  dataUSD = []
  var count = 0
  var dataUSD = []
  dataBTC.forEach(function(value) {
    USDprice = value* dataSat[count]
    count++;
    dataUSD.push(USDprice)
  })
  console.log('the usd price is: ')
  console.log(dataUSD)
  return [dataUSD,dataSat];

}

function getData(responseText) {
  var newArray = []
  var myArr = JSON.parse(responseText);
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1;
          //this is the latest time
  var latestTimeStamp = results[lastindex]['T'];
  var dateRe = /T(\d{2})/
  var time = latestTimeStamp.match(dateRe)[1]
          //block below rounds to the nearest 6hour
  if(time > 0 && time < 6) {
    time = 00;
  }else if(time > 6 && time < 12) {
    time = 6
  }else if(time > 12 && time < 18) {
    time = 12
  }else if(time >18 && time < 24) {
    time = 18
  }
  data = getPointsBefore(results,lastindex,time);
  return data;
}

function getPointsBefore(results,lastindex,time) {
    //get the latest price from results which corresponds to the roundedtime
    var stringRe = ''
    if(time < 10) {
      stringRe = 'T('+'0' + parseInt(time) + ')'
    }else {
      stringRe = 'T(' + parseInt(time) + ')'
    }
    re = new RegExp(stringRe)
    var currentDate = results[lastindex]['T']
    var currentTime = 1;
    while(currentTime != time) {
      var currentDate = results[lastindex]['T']
      if(currentDate.match(re) == null ) {
        lastindex--;
      }else {
        currentTime = currentDate.match(re)[1]
      }

      
    }
    //the correct time is now at lastIndex and this will be the updated price; with key of 'C'
    var currentpriceSAT = results[lastindex]['C']
    var priceArray = []
    priceArray.push(currentpriceSAT);
    var count = 0
    var countStop = getCountStop(time)
    while(count != countStop) {
      lastindex -= 6
      priceArray.unshift(results[lastindex]['C'])
      count++;
    }
    return priceArray;
  }

  
function getCountStop(time) {
  if(time == 0) {
    return 25;
  }else if(time == 6) {
    return 26;
  }else if(time == 12) {
    return 27;
  }else if(time == 18) {
    return 28
  }

}

sevenData = sevenDayChartData();
