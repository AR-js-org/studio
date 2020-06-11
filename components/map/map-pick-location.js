let map;
let layerGroup;
let shadow;
let array = [];
let markerId = [];

var numberIcon = L.divIcon({
    className: "number-icon",
    shadowSize: [20, 30], // size of the shadow
    iconAnchor: [20, 40],
    shadowAnchor: [4, 30],  // the same for the shadow
    popupAnchor: [0, -30],
    html: "1"
});

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


function updateMyLocationMarker(lat, lng) {
    array.push({
        id: 'mylocation',
        coords: [lat, lng],
        lat: lat,
        lng: lng
    })
    map.panTo(new L.LatLng(lat, lng)); // will pan map to make the center of map the newly located coords
    array.map(e => {

        L.marker(e.coords).addTo(layerGroup);
    })
}

function updateMarker() {
    let key = "id";
    const unique = [...new Map(array.map(item =>
        [item[key], item])).values()];
    layerGroup.clearLayers();

    map.panTo(new L.LatLng(unique[0].lat, unique[0].lng)); // will pan map to make the center of map the newly located coords
    unique.map((e, i) => {
        L.marker(e.coords, {
            icon: L.divIcon({
                className: "number-icon",
                shadowSize: [20, 30], // size of the shadow
                iconAnchor: [20, 40],
                shadowAnchor: [4, 30],  // the same for the shadow
                popupAnchor: [0, -30],
                html: window.locationNumber,
            })
        }).addTo(layerGroup);

    })
}

function updateLatLngValue(lat, lng) {
    document.getElementById("latitude").value = lat.toString();
    document.getElementById("longitude").value = lng.toString();
}

function check_lat_lon(e) {
    let regex_lat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    let regex_lng = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    let lat = document.getElementById(`latitude${e.target.name}`).value;
    let lng = document.getElementById(`longitude${e.target.name}`).value;

    let validLat = regex_lat.test(lat); // 21.2908
    let validLng = regex_lng.test(lng); // -157.8305

    // only fire invalid coords if length on both is not 0
    if (lat.length !== 0 && lng.length !== 0) {
        if (validLat && validLng) {
            array.push({
                id: e.target.name,
                coords: [lat, lng],
                lat: lat,
                lng: lng
            })
            updateMarker();

        }
        else {
            updateLatLngInnerHtmlInvalidCoords()
        }
    }
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
    return buttonUseMyLocation;
}
// let x = `<input class="text-input" type="text" id="latitude" onblur="check_lat_lon()" name="latitude" />`;
function createInput(name, i) {
    let coordInput = document.createElement('input');
    coordInput.className = "text-input coordinates-inputs";
    coordInput.type = 'text';
    coordInput.id = `${name}${i}`;
    coordInput.name = i;
    coordInput.addEventListener('blur', check_lat_lon)
    return coordInput;
}


function deleteCoords(e) {
    let id = e.target.id;
    let lat = document.getElementById(`latitude${id}`);
    lat.remove();
    let lng = document.getElementById(`longitude${id}`);
    lng.remove();
    document.getElementById(id).remove();
    e.target.remove();

    if (lat.value.length !== 0 && lng.value.length !== 0) {
        let arr = array.filter(e => e.id !== id);
        array = arr;
        layerGroup.clearLayers();
        updateMarker();
        window.locationNumber = window.locationNumber - 1;
    }
}


function updateLatLngInputs(i) {
    let numTags = document.getElementsByClassName('input-number-tags');
    let latElems = document.getElementsByClassName('latitude-elements');
    let lngElems = document.getElementsByClassName('longitude-elements');
    let delCoords = document.getElementsByClassName('delete-coordinates-container');
    let tagCount = document.getElementsByClassName('num-tags').length;
    let count = tagCount + 1;
    let numTag = document.createElement('p');
    numTag.innerHTML = count + '.';
    numTag.className = "num-tags";
    numTag.id = count.toString();

    let delIconDiv = document.createElement('div');
    delIconDiv.className = 'delete-icon-parent';
    delIconDiv.id = count.toString();

    let delIcon = document.createElement('svg');
    delIcon.innerHTML = trashCanSvg;
    delIcon.className = 'hidden-delete-icon';

    delIconDiv.addEventListener('click', deleteCoords)

    numTags[0].append(numTag);
    latElems[0].append(createInput('latitude', count))
    lngElems[0].append(createInput('longitude', count))
    delCoords[0].append(delIconDiv)
    delIconDiv.append(delIcon)
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
        this.addLatLngInputs();

        let addLocation = document.getElementsByClassName('add-location-container');
        addLocation[0].addEventListener('click', function() {
            window.locationNumber = window.locationNumber + 1;
            updateLatLngInputs(window.locationNumber)
        })
    }

    createMap() {
        const editLocationInput = (locationNumber, lat, lng) => {
            if (!locationNumber || !lat || !lng) {
                console.debug('Wrong location values', locationNumber, lat, lng);
                return;
            }

            const latitude = document.querySelector(`.latitude-elements input[name="${locationNumber}"]`);
            latitude.value = lat;

            const longitude = document.querySelector(`.longitude-elements input[name="${locationNumber}"]`);
            longitude.value = lng;
        };

        map = L.map(this.mapRoot).setView(this.mapConfig.center, this.mapConfig.onLoad_zoom);
        layerGroup = L.layerGroup().addTo(map);
        L.tileLayer(tile_url, this.mapConfig.attribution_opts).addTo(map);
        window.locationNumber = 1;
        map.on('click', function(e) { // => {} that contains the coordinates
            array.push({
                id: 'mapclick',
                coords: [e.latlng.lat, e.latlng.lng],
                lat: e.latlng.lat,
                lng: e.latlng.lng
            })
            updateMarker();
            editLocationInput(window.locationNumber, e.latlng.lat, e.latlng.lng);
        })

        let leafletControlAttribution = shadow.querySelector(".leaflet-control-attribution");
        let buttonUseMyLocation = createButtonUseMyLocation();
        leafletControlAttribution.appendChild(buttonUseMyLocation);

        buttonUseMyLocation.addEventListener("click", function(e) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {

                    updateMyLocationMarker(position.coords.latitude, position.coords.longitude);
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


    addLatLngInputs() {
        const parent = document.getElementsByClassName('coordinates-input-wrapper')[0];
        const coordsParent = document.createElement('div');
        coordsParent.className = 'coordinates-input-container';
        parent.append(coordsParent);

        const numTags = document.createElement('div');
        numTags.className = 'input-number-tags';

        const latElems = document.createElement('div');
        latElems.className = 'latitude-elements';

        const lngElems = document.createElement('div');
        lngElems.className = 'longitude-elements';

        const latElemLabel = document.createElement('label');
        latElemLabel.for = 'latitude';
        latElemLabel.innerHTML = 'Latitude:';

        const lngElemLabel = document.createElement('label');
        lngElemLabel.for = 'longitude';
        lngElemLabel.innerHTML = 'Longitude:'

        const delCoords = document.createElement('div');
        delCoords.className = 'delete-coordinates-container';

        const addCoords = document.createElement('div');
        addCoords.className = 'add-location-container';
        const addCoordsIcon = document.createElement('div');
        addCoordsIcon.className = 'add-location-icon';
        addCoordsIcon.innerHTML = plusSignSvg;

        const addCoordsName = document.createElement('div');
        addCoordsName.className = 'add-location-name';
        addCoordsName.innerHTML = 'Add a location';


        latElems.append(latElemLabel); // static
        lngElems.append(lngElemLabel); // static
        coordsParent.append(numTags); // static
        coordsParent.append(latElems); // static
        coordsParent.append(lngElems); // static
        coordsParent.append(delCoords); // static
        parent.append(addCoords); // static
        addCoords.append(addCoordsIcon); // static
        addCoords.append(addCoordsName); // static


        let numTag = document.createElement('p');
        numTag.innerHTML = 1 + '.';
        numTag.className = "num-tags";
        let delIconDiv = document.createElement('div');
        delIconDiv.className = 'delete-icon-parent';
        delIconDiv.id = "1";

        let delIcon = document.createElement('svg');
        delIcon.innerHTML = trashCanSvg;
        delIcon.className = 'hidden-delete-icon';
        delIcon.style.visibility = 'hidden';

        delIconDiv.addEventListener('click', function(e) {
            let item = e.target.id;

        })

        numTags.append(numTag);
        latElems.append(createInput('latitude', 1))
        lngElems.append(createInput('longitude', 1))
        delCoords.append(delIconDiv)
        delIconDiv.append(delIcon)
    }

}

customElements.define('map-pick-location', MapPickLocation);
