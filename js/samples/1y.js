      
function getOneYearData() {
  var answerArr = [];
  var tickinterval = "day"
  var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
  var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
  var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
  //get current time
  //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  //get data in sats
  xhr.open("GET",proxyUrl+url, false);
  xhr.send();
  var dataSat = getData(xhr.responseText) //data is the price of navcoin in sats
  //get data of BTC prices in USD
  xhr.open("GET",proxyUrl+urlBTC,false);
  xhr.send();
  var dataBTC = getData(xhr.responseText) //dataBTC is the price of BTC in usd
  
  //convert dataSats into dataUSD
  var dataUSD = []
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

function getData1y(responseText) {
  var newArray = []
  var myArr = JSON.parse(responseText);
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1;
          //this is the latest time
  data = getPointsBefore(results,lastindex);
  return data;
}



function getPointsBefore1y(results,lastindex) {
    //get the latest price from results which corresponds to the roundedtime

    //the correct time is now at lastIndex and this will be the updated price; with key of 'C'
    //find 
    
    var currentDate = results[lastindex]['T']
    var dateRe = /(\d{2})(?=T)/
    var exactDateArr = roundTime(currentDate.match(dateRe)[1]);
    var startDate = exactDateArr[0]
    var offset = exactDateArr[1]
    // i only want dates on the 1st(25points before),5(26points before),10(27 points before),15,20,25 so 5 points per month,
    //6 months, so its a total of 11months x5 (55) + current month 
    
    var lastindex -= offset;
    var currentpriceSAT = results[lastindex]['C']
    var priceArray = []
    priceArray.push(currentpriceSAT);
    if(startDate == 1) {
      additionalPoints = 0
    }else {
      startDate2 = startDate;
      additionalPoints = startDate2 / 5
    }
    var totalPoints = 55 + additionalPoints;
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

function oneYearSplicer(data) {
  var dataLength = data.length;
  //splice the first 55 points
  var first55 = data.slice(0,55);
  var currentPoints = data.slice(55)
  var newArr = []
  for(var i=0;i<=50;i+=5) {
    var currentGroup = first55.slice(i,i+5);  // i = 0 (0,1,2,3,4) i = 5 (5,6,7,8,9).   i=50 (50,51,52,53,54)
    var currentGroupShort = [currentGroup[0],currentGroup[2],currentGroup[4]]
    newArr = newArr.concat(currentGroupShort)

  }
  newArr = newArr.concat(currentPoints);
  return newArr;

}

function getSixMonth(type,oneYearData) {
  if(type == "USD") {
    return oneYearData[0].slice(30);
  }else {
    return oneYearData[1].slice(30);
  }
}




var oneYearData = getOneYearData();
var onYearUSD = oneYearSplicer(oneYearData[0])
var oneYearBTC = oneYearSplicer(oneYearData[1])
var sixMonthUSD = ("USD",oneYearData)
var sixMonthBTC = ("BTC",oneYearData)

//end of 1y script




