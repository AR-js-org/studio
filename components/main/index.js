window.onload = () => {
    [...document.querySelectorAll('input')].forEach((input) => input.checked = false);
};

/* Update start building anchor href location based on radioState */
function radioOnclick(self) {
    const radioState = self.getAttribute('id')
    let startBuilding = document.getElementById("start-building")

    if (radioState == "marker") {
        startBuilding.href = "pages/marker.html"
    } else if (radioState == "location") {
        startBuilding.href = "pages/location.html"
    } else {
        // Display error message
    }
}

function anchorOnclick(self) {
    const href = self.getAttribute('href')
    if (!href) {
        document.querySelector('.missing-href').style.visibility = 'visible';
        return false;
    }

}

