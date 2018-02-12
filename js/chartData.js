      
function pingDailyData() {
    var answerArr = [];
    var tickinterval = "day"
    var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
    var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
    var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
    //get current time
    //var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();
    xhr.open("GET",proxyUrl + url, false);
    xhr.send();
    var satResponse = xhr.responseText; //price of nav in sat

    xhr.open("GET",proxyUrl + urlBTC,false);
    xhr.send();
    var btcResponse = xhr.responseText;//price of BTC in sat
    return [satResponse,btcResponse]
}
function pingHourlyData() {
    var answerArr = [];
    var tickinterval = "hour"
    var proxyUrl = "https://enigmatic-coast-36437.herokuapp.com/"
    var url = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`
    var urlBTC = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=USDT-BTC&tickInterval=${tickinterval}`
    
    //for 24h our 7day we will ask fr the same one
    var xhr = new XMLHttpRequest();
    //get data in sats
    xhr.open("GET",proxyUrl + url, false);
    xhr.send();
    var satResponse = xhr.responseText; //price of nav in sat

    xhr.open("GET",proxyUrl + urlBTC,false);
    xhr.send();
    var btcResponse = xhr.responseText;//price of BTC in sat
    
    //convert dataSats into dataUSD
    return[satResponse,btcResponse]
}



onmessage = function(e) {
  console.log(e.data)
  if(e.data === "START") {
    console.log("messaged received from main thread to trigger API pull-request")
    var dailyData = pingDailyData();
    var hourlyData = pingHourlyData();
    postMessage([dailyData,hourlyData],[])
  }
  
}

 