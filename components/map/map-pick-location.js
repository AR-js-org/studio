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
                <button id="baseem" class="set-location-button" disabled>Set Location</button>
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





let map;
let layerGroup;
let shadow;



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




function updateMarker(map, lat, lng, layerGroup) {
    map.panTo(new L.LatLng(lat, lng)); // will pan map to make the center of map the newly located coords
    layerGroup.clearLayers(); // if updated again - clear previous markers from layergroup
    L.marker([lat, lng]).addTo(layerGroup); // adds marker to the map
}

function updateLatLngValue(lat, lng) {
    document.getElementById("latitude").value = lat.toString();
    document.getElementById("longitude").value = lng.toString();
}


function check_lat_lon(){
  let regex_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
  let regex_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
  let lat = document.getElementById(`latitude`).value;
  let lng = document.getElementById(`longitude`).value;
  let validLat = regex_lat.test(lat); // 21.2908
  let validLng = regex_lng.test(lng); // -157.8305

  // only fire invalid coords if length on both is not 0
  if(lat.length !== 0 && lng.length !==0){
    if(validLat && validLng) {
      updateMarker(map, lat, lng, layerGroup);
      updateLatLngValue(lat, lng)
      updateLatLngInnerHtml(lat, lng);
    } 
    else {
      updateLatLngInnerHtmlInvalidCoords()
    }
  }
}

function updateLatLngInnerHtml(lat, lng) {
    shadow.querySelector('.set-location-button').disabled = false;
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `Location is set to: <b>${lat.toString()}, ${lng.toString()}!</b>`;

}

function updateLatLngInnerHtmlDenied(msg) {
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `${msg}: if this was a mistake you can allow location for this page only by clicking the little 🔒left of the url`;
}

function updateLatLngInnerHtmlInvalidCoords() {
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `Try to enter valid coordinates for example: 21.2908, -157.8305`;
}



function createButtonUseMyLocation(){
    let buttonUseMyLocation = document.createElement('button');
        buttonUseMyLocation.innerHTML = `${defineLocationSvg} Use my location`;
        buttonUseMyLocation.className = "use-my-location-button";
        buttonUseMyLocation.style = `
        background-color: white;
        color: black;
        margin-left: 2px`;
    return buttonUseMyLocation;
}


class MapPickLocation extends HTMLElement {
    constructor() {
        super();

        this.lat;
        this.lng;
        this.path = "location.html";
        this.mapConfig = returnPageConfig(this.path);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = reUseMapComponent(this.path);
        this.mapRoot = this.shadow.querySelector(this.mapConfig.className);



        
    }
    connectedCallback() {
        shadow = this.shadow;
        this.createMap();

        let setLocationButton = this.shadowRoot.querySelector('.set-location-button');
        setLocationButton.addEventListener("click", (e) => {
            let lat = document.getElementById(`latitude`).value;
            let lng = document.getElementById(`longitude`).value;
            alert(`progress to next screen, ${lat}, ${lng}`);
        })

    }

    createMap(){
        map = L.map(this.mapRoot).setView(this.mapConfig.center, this.mapConfig.onLoad_zoom);
        layerGroup = L.layerGroup().addTo(map);
        L.tileLayer(tile_url, this.mapConfig.attribution_opts).addTo(map);
        map.on('click', function(e) { // => {} that contains the coordinates
     
            updateMarker(map, e.latlng.lat, e.latlng.lng, layerGroup);
            updateLatLngValue(e.latlng.lat, e.latlng.lng);
            updateLatLngInnerHtml(e.latlng.lat, e.latlng.lng)
        })

        let leafletControlAttribution = shadow.querySelector(".leaflet-control-attribution");
        let buttonUseMyLocation = createButtonUseMyLocation();
        leafletControlAttribution.appendChild(buttonUseMyLocation);

        buttonUseMyLocation.addEventListener("click", function(e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) { 
                    updateLatLngInnerHtml("Locating", "....");
                    updateMarker(map, position.coords.latitude, position.coords.longitude, layerGroup);
                    updateLatLngValue(position.coords.latitude, position.coords.longitude);
                    updateLatLngInnerHtml(position.coords.latitude, position.coords.longitude)
                },
                    function(error) {
                        if (error.code == error.PERMISSION_DENIED) {
                            updateLatLngInnerHtmlDenied(error.message);
                            // if permission on browser has been set to default deny of position - will provide basic steps to adjust for this url
                        }
                    });
            }
            else {
                updateLatLngInnerHtmlDenied("Geolocation is not supported by this browser.");
                // this seems to be an unlikely problem according to MDN - all browser support this:
                // src: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
            }
        })
    }




 





}


customElements.define('map-pick-location', MapPickLocation);
