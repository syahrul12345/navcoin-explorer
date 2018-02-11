      
function getTwentyFourHourData() {
  var answerArr = [];
  var tickinterval = "hour"
  var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
  var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
  var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
  //get current time
  
  var xhr = new XMLHttpRequest();
  //get data in sats
  xhr.open("GET",proxyUrl + url, false);
  xhr.send();
  dataSat = getData(xhr.responseText) //data is the price of navcoin in sats
  //get data of BTC prices in USD
  xhr.open("GET",proxyUrl + urlBTC,false);
  xhr.send();
  dataBTC = getData(xhr.responseText) //dataBTC is the price of BTC in usd
  
  //convert dataSats into dataUSD
  dataUSD = []
  var count = 0
  var dataUSD = []
  dataBTC.forEach(function(value) {
    USDprice = value* dataSat[count]
    count++;
    dataUSD.push(USDprice)
  })

  //getTimeRange
  dataTimeRange = getTime(xhr.responseText)

  //we correct the time according to the client

  var offset = new Date().getTimezoneOffset();
  var correctedTimeRange = []
  dataTimeRange.forEach(function(value) {
      var correctTime = getCorrectedTime(value,offset)
      correctedTimeRange.push(correctTime)
    })
  
  return [correctedTimeRange,dataUSD,dataSat];
}

function getCorrectedTime(value,offset) {
    var corrector = 1
    if(offset < 0) {
      corrector = -1 //make it positive 
    }
    var hoursFull = Math.floor(offset/60 * corrector) * corrector
    //if hoursFull is negative, means i am behind , so i want to plus that hours to Bittrex time
    var correctedTime = value - hoursFull
    if(correctedTime < 0) {
      correctedTime = 24 + correctedTime
    }else if(correctedTime > 24) {
      correctedTime =correctedTime -24
    }

    return correctedTime
}

function getTime(responseText) {

  var timeArr = []
  var timeRe = /T(\d{2})/
  var myArr = JSON.parse(responseText)
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1
  var currentTime = results[lastindex]['T'].match(timeRe)[1]
  timeArr.push(currentTime)
  var count = 0
  var countStop=23;
  var timeRe = /T(\d{2})/
  while(count < countStop) {
      lastindex --;
      timeArr.unshift(results[lastindex]['T'].match(timeRe)[1])
      count++;
    }
  return timeArr;

}

function getData(responseText) {
  var newArray = []
  var myArr = JSON.parse(responseText);
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1;
          //this is the latest time
  data = getPointsBefore(results,lastindex);
  return data;
}

function getPointsBefore(results,lastindex) {
    //get the latest price from results which corresponds to the roundedtime

    //the correct time is now at lastIndex and this will be the updated price; with key of 'C'
    var currentpriceSAT = results[lastindex]['C']
    var priceArray = []
    var timeRe = /(T)(\d{2})/
    priceArray.push(currentpriceSAT);
    var count = 0
    var countStop=23;
    while(count < countStop) {
      lastindex --;
      priceArray.unshift(results[lastindex]['C'])
      count++;
    }
    return priceArray;
  }

  

twentyFourHourData = getTwentyFourHourData();
