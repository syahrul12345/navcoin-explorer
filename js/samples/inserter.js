var value = ['Febuary','March','April','May','June','July','August','September','October','November','December','January']
//february,"","",March
function inserter2(value) {
	//insert 2 blank spaces
	var stopIndex = 34;
	var currentIndex = 1;
	while(currentIndex < stopIndex) {
		value.splice(currentIndex,0,"","")
		currentIndex += 3;
	}
	return value;

}

console.log(inserter2(value))

