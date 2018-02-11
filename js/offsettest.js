  var corrector = 1
  if(offset < 0) {
    corrector = -1 //make it positive 
  }
  var hoursFull = Math.floor(offset/60 * corrector) * corrector
  //if hoursFull is negative, means i am behind , so i want to plus that hours to Bittrex time
  var correctedTime = value - hoursFull
  console.log(correctedTime)

  if(correctedTime < 0) {
  	correctedTime = 24 + correctedTime
  }else if(correctedTime > 24) {
  	correctedTime =correctedTime -24
  }

  return correctedTime