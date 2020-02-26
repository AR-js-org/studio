let radioState = ""

/* Update global radioState based on which Onclick is called from */
function radioOnclick(self) {
  radioState = self.getAttribute('id')
  console.log(radioState)
}

/* 
Redirects user based on the radioState.
If the radioState is not selected, displays an error.
*/
function startBuildingOnclick() {
  if (radioState == "marker") {
    window.location.href = "/pages/marker.html"
  } else if (radioState == "location") {
    window.location.href = "/pages/location.html"
  } else {
    // Display error message
  }
}