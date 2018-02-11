      
function getSixMonthData() {
  var answerArr = [];
  var tickinterval = "day"
  var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
  var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
  var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
  //get current time
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  //get data in sats
  xhr.open("GET",url, false);
  xhr.send();
  dataSat = getData(xhr.responseText) //data is the price of navcoin in sats
  //get data of BTC prices in USD
  xhr.open("GET",urlBTC,false);
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
  
  return [dataUSD,dataSat];
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
    //find 
    
    var currentDate = results[lastindex]['T']
    var dateRe = /(\d{2})(?=T)/
    var exactDateArr = roundTime(currentDate.match(dateRe)[1]);
    var startDate = exactDateArr[0]
    var offset = exactDateArr[1]
    // i only want dates on the 1st(25points before),5(26points before),10(27 points before),15,20,25 so 5 points per month,
    //6 months, so its a total of 5months x5 (25) + current month 
    lastindex -= offset;
    var currentpriceSAT = results[lastindex]['C']
    var priceArray = []
    priceArray.push(currentpriceSAT);
    if(startDate == 1) {
      additionalPoints = 0
    }else {
      startDate2 = startDate;
      additionalPoints = startDate2 / 5
    }
    var totalPoints = 25 + additionalPoints;
    var count = 0
    var countStop = totalPoints;
    while(count < countStop) {
      lastindex -= 5;
      priceArray.unshift(results[lastindex]['C'])
      count++;
    }
    return priceArray;
  }
function roundTime(time) {
  var count = 0;
  if(time > 1 && time < 5) {
    count = time - 1
    time = 1
    return [time,count];
  }else if(time > 5 && time <10) {
    count = time - 5
    time = 5
    return [time,count];
  }else if(time > 10 && time <15) {
    count = time - 10
    time = 10
    return [time,count];
  }else if(time > 15 && time <20) {
    count = time - 15
    time = 15
    return [time,count];
  }else if(time > 20 && time <25) {
    count = time - 20
    time = 20
    return [time,count];
  }else if(time > 25) {
    count = time - 25
    time = 25
    return [time,count];
  }else {
    return [time,count]
  }
}
sixMData = getSixMonthData();
console.log(sixMData)
