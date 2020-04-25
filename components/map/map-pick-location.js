//  This is requires stylesheet css for leaflet can be re-used on different pages
// src: https://leafletjs.com/examples/quick-start/
const leaflet_stylesheet_link = `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""/>`;

// tile url most likely not to change
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// attribution required for use of open street maps
const openStreetMaps_attribution = "<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>";


const defineLocationSvg = `
  <?xml version="1.0" ?>
  <svg class="svg-define-location" height="15" viewBox="0 0 48 48" width="15" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h48v48h-48z" fill="none"/><path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm17.88 6c-.92-8.34-7.54-14.96-15.88-15.88v-4.12h-4v4.12c-8.34.92-14.96 7.54-15.88 15.88h-4.12v4h4.12c.92 8.34 7.54 14.96 15.88 15.88v4.12h4v-4.12c8.34-.92 14.96-7.54 15.88-15.88h4.12v-4h-4.12zm-17.88 16c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z"/>
  </svg>`

// styles to hold classnames for the main map and additional maps
const map_styles = `
    <style>
    .map-pick-location{
    height: 380px;
    width: 800px;
    }
    .map-foo-bar {
    height: 100px;
    width: 200px;
    }
    .use-my-location-button {
    display: inline-block;
    font-family: Chakra Petch;
    font-style: normal;
    height: 2.5em;
    border: none;
    border: 1px solid grey;
    box-sizing: border-box;
    text-decoration: none;
    color: black;
    }
    .set-location-button {
    display: inline-block;
    font-family: Chakra Petch;
    font-style: normal;
    font-weight: 600;
    font-size: 1em;
    line-height: 1.5em;
    height: 3.5em;
    border: none;
    border: 1.5px solid black;
    box-sizing: border-box;
    box-shadow: 10px 10px 0px black;
    border-radius: 10px;
    padding: 1em 1.25em;
    margin-top: 1.875em;
    text-decoration: none;
    color: black;
    }
    .svg-define-location {
    padding-top: 0.3em;

    }
    .location-set-display {
    visibility: hidden;
    padding-top: 0;
    }
    </style>`;


const config = [
    {
        id: "001",
        path: "location.html",
        className: ".map-pick-location",
        elem: `<div id="map-container">
                <div class="map-pick-location"></div>
                <button class="set-location-button" disabled>Set Location</button>
                <p id="location-set-display" class="location-set-display">
                User denied Geolocation: if this was a mistake you can allow location for this page only by clicking the little 🔒left of the url
                </p>
                </div>`,
        center: [21.2901808, -157.8299651],
        onLoad_zoom: 18,
        attribution_opts: {
            attribution: openStreetMaps_attribution,
            maxZoom: 18,
        }
    },
    {
        id: "002",
        path: "foobar.html",
        className: ".map-pick-location",
        elem: `<div id="map-container">
            <div class="map-pick-location"></div>
            <button class="set-location-button" disabled>Set Location</button>
            <p id="location-set-display" class="location-set-display">
            User denied Geolocation: if this was a mistake you can allow location for this page only by clicking the little 🔒left of the url
            </p>
            </div>`,
        center: [21.2901808, -157.8299651],
        onLoad_zoom: 18,
        attribution_opts: {
            attribution: openStreetMaps_attribution,
            maxZoom: 18,
        }
    },
]

// filter config array returning by uri path name for ex. location.html => {} config for this page
// if you want to use the map on a different page for ex. differentpage.html => {} config for this page
function returnPageConfig(path) {
    return templateConfig = config.filter(e => {
        return e.path === path
    })[0];
}

function reUseMapComponent(path) {
    let templateConfig = returnPageConfig(path); // => {} with config for setting the innerHTML
    // map_styles can remain static as we can add new styles to the constant declared above as dev continues
    // leaflet_stylesheet_link will remain the same
    // templateConfig.div is sourced from the config array so we can add new objects in the array for different pages
    const MapTemplate = `
        ${map_styles}
        ${leaflet_stylesheet_link}
        ${templateConfig.elem} `;
    return MapTemplate;
}

function invokeMapConfig(shadow, path) {
    let lat;
    let lng;
    // shadow is the html dom element
    // path = location.html
    let mapConfig = returnPageConfig(path); // => {} with configurations for location.html
    const mapRoot = shadow.querySelector(mapConfig.className)

    // most of this is from leaflet quickstart guide: https://leafletjs.com/examples/quick-start/
    let map = L.map(mapRoot).setView(mapConfig.center, mapConfig.onLoad_zoom);
    L.tileLayer(tile_url, mapConfig.attribution_opts).addTo(map);
    let layerGroup = L.layerGroup().addTo(map);

    // add a layergroup so each time user clicks a
    // new spot it will clear the previous marker
    map.on('click', function(e) { // => {} that contains the coordinates
        lat = e.latlng.lat;
        lng = e.latlng.lng;
        updateMarker(map, lat, lng, layerGroup); // updates the marker if done by map click
        updateLatLngValue(lat, lng); // updates the input fields above the map to reflect the chosen coordinates
        updateLatLngInnerHtml(shadow, lat, lng);
    })

    let x = shadow.querySelector(".leaflet-control-attribution");
    let buttonUseMyLocation = document.createElement('button');
    buttonUseMyLocation.innerHTML = `${defineLocationSvg} Use my location`;
    buttonUseMyLocation.className = "use-my-location-button";
    buttonUseMyLocation.style = `
    background-color: white;
    color: black;
    margin-left: 2px`
    x.appendChild(buttonUseMyLocation);

    // implementing button to use my location
    buttonUseMyLocation.addEventListener("click", function(e) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) { // => {} two keys {coords: {}, timestamp: string}
                updateLatLngInnerHtml(shadow, "Locating", "...."); // if geo api response is slow - placeholder
                lat = position.coords.latitude;
                lng = position.coords.longitude;
                updateMarker(map, lat, lng, layerGroup); // update the marker if button 'Set Location' clicked
                updateLatLngValue(lat, lng); // updates the input fields above the map to reflect the chosen coordinates
                updateLatLngInnerHtml(shadow, lat, lng);
            },
                function(error) {
                    if (error.code == error.PERMISSION_DENIED) {
                        updateLatLngInnerHtmlDenied(shadow, error.message);
                        // if permission on browser has been set to default deny of position - will provide basic steps to adjust for this url
                    }
                });
        }
        else {
            updateLatLngInnerHtmlDenied(shadow, "Geolocation is not supported by this browser.");
            // this seems to be an unlikely problem according to MDN - all browser support this:
            // src: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
        }
    })
}


function updateMarker(map, lat, lng, layerGroup) {
    map.panTo(new L.LatLng(lat, lng)); // will pan map to make the center of map the newly located coords
    layerGroup.clearLayers(); // if updated again - clear previous markers from layergroup
}

function updateLatLngValue(lat, lng) {
    document.getElementById("latitude").value = lat.toString();
    document.getElementById("longitude").value = lng.toString();
}

function updateLatLngInnerHtml(shadow, lat, lng) {
    shadow.querySelector('.set-location-button').disabled = false;
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `Location is set to: <b>${lat.toString()}, ${lng.toString()}!</b>`;
}

function updateLatLngInnerHtmlDenied(shadow, msg) {
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `${msg}: if this was a mistake you can allow location for this page only by clicking the little 🔒left of the url`;
}


class MapPickLocation extends HTMLElement {
    constructor() {
        super();

        this.path = "location.html";

        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = reUseMapComponent(this.path);
    }

    connectedCallback() {
        invokeMapConfig(this.shadowRoot, this.path);
        let setLocationButton = this.shadowRoot.querySelector('.set-location-button');
        setLocationButton.addEventListener("click", (e) => {
            alert('progress to next screen');
        })
    }
}


customElements.define('map-pick-location', MapPickLocation);
