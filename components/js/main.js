/* Update start building anchor href location based on radioState */
function radioOnclick(self) {
    const radioState = self.getAttribute('id')
    let startBuilding = document.getElementById("start-building")

    if (radioState == "marker") {
        startBuilding.href = BASE_URL + "/pages/marker.html"
    } else if (radioState == "location") {
        startBuilding.href = BASE_URL + "/pages/location.html"
    } else {
        // Display error message
    }
}