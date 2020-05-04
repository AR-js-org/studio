

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

function check_lat_lon() {
    let regex_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    let regex_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    let lat = document.getElementById(`latitude`).value;
    let lng = document.getElementById(`longitude`).value;
    let validLat = regex_lat.test(lat); // 21.2908
    let validLng = regex_lng.test(lng); // -157.8305

    // only fire invalid coords if length on both is not 0
    if (lat.length !== 0 && lng.length !== 0) {
        if (validLat && validLng) {
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
    lat = lat.toFixed(7);
    lng = lng.toFixed(7);

    shadow.querySelector('.set-location-button').disabled = false;
    let x = shadow.querySelector(".location-set-display");
    x.style.visibility = "visible"
    x.innerHTML = `Location is set to: <b>${lat.toString()}, ${lng.toString()}</b>`;
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

function createButtonUseMyLocation() {
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

    createMap() {
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
