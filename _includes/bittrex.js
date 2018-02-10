
//possible tickintervals are "oneMin", "fiveMin", "thirtyMin", "hour" and "day"


// for  7 days, i will want a total of 5 points per day by the hour for that day @ 12 am, 6am , 12 pm , 6pm and the day starts at 12am
// so its like day1: 12am,6am,12pm,6pm day2: 12am,6am,12pm,6pm
//for current day aka day 7; just get 12am for simplicity thus a total of 28 pounds, we get hte last 28 pounts for 
			
var tickinterval = "hour"
var url7days = `https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName=BTC-NAV&tickInterval=${tickinterval}`

//get current time

var date = new Date(Date.now());



var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var newArray = []
        var myArr = JSON.parse(this.responseText);
        var arrayLength = myArr["result"].length;
        var lastindex = arrayLength-1;
        for(var i = lastindex-30;i<arrayLength;i++) {
        	newArray.push(myArr["result"][i])
        	
        }
        console.log(newArray)
    }
};
xhr.open("GET", url7days, true);
xhr.send();
// For 3 years, i will want 6 points for each year, so a total of 18 points.


// same for 1 year, i will want a total of 3 points per month a total ox 12x3;


// for 6 months, i will want a total of  2 points per 6 months;


