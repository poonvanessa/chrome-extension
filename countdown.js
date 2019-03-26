function countDown(elementId, date) {
  var countDownDate = date.getTime();
  
  // Update the count down every 1 second
  var x = setInterval(function() {
  
    // Get todays date and time
    var now = new Date().getTime();
      
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
      
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
    // Output the result in an element with id="demo"
    document.getElementById(elementId).innerHTML = "<h3>" + hours + "h " + minutes + "m " + seconds + "s </h3>";
      
    // If the count down is over, write some text 
    if (distance < 0) {
      clearInterval(x);
      document.getElementById(elementId).innerHTML = "<h4>Why are you still here?</h4>";
    }
  }, 1000);
  
}
