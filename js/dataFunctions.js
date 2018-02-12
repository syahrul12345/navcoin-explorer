function getData(type,pingResult) {
  //we dont want to keep calling for every request
  if(type == 1 || type == 6 || type == 3) {
    
    var dataSat = getData1y(pingResult[0])
    var dataBTC = getData1y(pingResult[1])
    var dataUSD = []
    var count = 0;
    dataBTC.forEach(function(value) {
      USDprice = value* dataSat[count]
      count++;
      dataUSD.push(USDprice)
      }) 
    if(type == 1) {
      var onYearUSD = oneYearSplicer(dataUSD)
      var oneYearBTC = oneYearSplicer(dataSat)
      //getTimeRange
      return [onYearUSD,oneYearBTC];

    }else if(type == 6) {
      var sixMonthUSD = getSixMonth(dataUSD)
      var sixMonthBTC = getSixMonth(dataSat)
      return [sixMonthUSD,sixMonthBTC]
    }
    
  }else {    
    if(type == 24) {
      var dataSat = getData24h(pingResult[0]);
      var dataBTC = getData24h(pingResult[1]);

      dataUSD = []
      var count = 0
      var dataUSD = []
      dataBTC.forEach(function(value) {
        USDprice = value* dataSat[count]
        count++;
        dataUSD.push(USDprice)
      })

      dataTimeRange = getTime(pingResult[0])
      //we correct the time according to the client
      var offset = new Date().getTimezoneOffset();
      var correctedTimeRange = []
      dataTimeRange.forEach(function(value) {
          var correctTime = getCorrectedTime(value,offset)
          correctedTimeRange.push(correctTime)
        })
      
      return [correctedTimeRange,dataUSD,dataSat];
      }else if(type == 7){
          var dataSat = getData7d(pingResult[0])
          var dataBTC = getData7d(pingResult[1])

          var dataUSD = []
          var count = 0
          var dataUSD = []
          dataBTC.forEach(function(value) {
            USDprice = value* dataSat[count]
            count++;
            dataUSD.push(USDprice)
          })
          return [dataUSD,dataSat];
      }
    }
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

function getData24h(responseText) {
  var newArray = []
  var myArr = JSON.parse(responseText);
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1;
          //this is the latest time
  data = getPointsBefore24h(results,lastindex);
  return data;
}

function getPointsBefore24h(results,lastindex) {
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

function getData7d(responseText) {
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
  data = getPointsBefore7d(results,lastindex,time);
  return data;
}

function getPointsBefore7d(results,lastindex,time) {
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

function getData1y(responseText) {
  var newArray = []
  var myArr = JSON.parse(responseText);
  var results = myArr["result"]
  var arrayLength = results.length;
  var lastindex = arrayLength-1;
          //this is the latest time
  data = getPointsBefore1y(results,lastindex);
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
    
    var lastindex = lastindex - offset;
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

function getSixMonth(data) {
  var ans = data.slice(30)
  return ans
}