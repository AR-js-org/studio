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
                html: e.number,
            })
        }).addTo(layerGroup);

    })
}

function updateLatLngValue(lat, lng) {
    document.getElementById("latitude").value = lat.toString();
    document.getElementById("longitude").value = lng.toString();
}

function check_lat_lon(e) {
    let lat = document.getElementById(`latitude${e.target.name}`).value;
    let lng = document.getElementById(`longitude${e.target.name}`).value;

    let validLat = !isNaN(lat) && lat >= -90 && lat <= 90;
    let validLng = !isNaN(lng) && lng >= -180 && lng <= 180;

    if (validLat && validLng) {
        array.push({
            id: e.target.name,
            coords: [lat, lng],
            lat: lat,
            lng: lng,
            number: window.locationNumber,
        })
        updateMarker();
        updateLocationParam();
    }
    else {
        updateLatLngInnerHtmlInvalidCoords()
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

function createInput(name, i) {
    let coordInput = document.createElement('input');
    coordInput.className = "text-input coordinates-inputs is-" + name;
    coordInput.type = 'text';
    coordInput.id = `${name}${i}`;
    coordInput.name = i;
    coordInput.title = name + i;
    coordInput.addEventListener('blur', check_lat_lon)
    return coordInput;
}


function deleteCoords(id) {
    const inputTags = [...document.querySelectorAll('.num-tags')];
    if (inputTags.length <= 1) {
        return;
    }

    if (id === 0) {
        return;
    }

    let lat = document.getElementById(`latitude${id}`);
    let lng = document.getElementById(`longitude${id}`);

    if (!lat || !lng) {
        return;
    }

    lat.remove();
    lng.remove();
    document.getElementById(id).remove();

    if (lat.value.length !== 0 && lng.value.length !== 0) {
        let arr = array.filter(e => e.id !== id);
        array = arr;
        layerGroup.clearLayers();
        updateMarker();
    }

    window.locationNumber = window.locationNumber - 1;
    updateLocationParam();
}


function updateLatLngInputs() {
    let numTags = document.getElementsByClassName('input-number-tags');
    let latElems = document.getElementsByClassName('latitude-elements');
    let lngElems = document.getElementsByClassName('longitude-elements');
    let tagCount = document.getElementsByClassName('num-tags').length;
    let count = tagCount + 1;
    let numTag = document.createElement('p');
    numTag.innerHTML = count + '.';
    numTag.className = "num-tags";
    numTag.id = count.toString();

    numTags[0].append(numTag);
    latElems[0].append(createInput('latitude', count))
    lngElems[0].append(createInput('longitude', count))

    window.locationNumber = window.locationNumber + 1;
}

function updateLocationParam() {
    let locations = window.assetParam.locations;
    locations.length = 0;
    let lats = document.querySelectorAll('.is-latitude');
    let lngs = document.querySelectorAll('.is-longitude');
    for (let i = 0, lat, lng; i < lats.length; i++) {
        lat = lats[i].value.trim();
        lng = lngs[i].value.trim();
        if (lat > 0 && lng.length > 0) {
            locations.push({ latitude: parseFloat(lat), longitude: parseFloat(lng) })
        }
    }
    checkUserUploadStatus();
};

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
        addLocation[0].addEventListener('click', function () {
            updateLatLngInputs();
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

            updateLocationParam();
        };

        map = L.map(this.mapRoot).setView(this.mapConfig.center, this.mapConfig.onLoad_zoom);
        layerGroup = L.layerGroup().addTo(map);
        L.tileLayer(tile_url, this.mapConfig.attribution_opts).addTo(map);
        window.locationNumber = 1;
        map.on('click', function (e) { // => {} that contains the coordinates
            array.push({
                id: 'mapclick_' + window.locationNumber,
                coords: [e.latlng.lat, e.latlng.lng],
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                number: window.locationNumber,
            })
            updateMarker();
            editLocationInput(window.locationNumber, e.latlng.lat, e.latlng.lng);
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

        const addCoords = document.createElement('div');
        addCoords.className = 'add-location-container';
        const addCoordsIcon = document.createElement('div');
        addCoordsIcon.className = 'add-location-icon';
        addCoordsIcon.innerHTML = plusSignSvg;

        const addCoordsName = document.createElement('div');
        addCoordsName.className = 'add-location-name';
        addCoordsName.innerHTML = 'Add a location';

        const removeCoords = document.createElement('div');
        removeCoords.className = 'remove-location-container';
        const removeCoordsIcon = document.createElement('div');
        removeCoordsIcon.className = 'remove-location-icon';
        removeCoordsIcon.innerHTML = trashCanSvg;

        const removeCoordsName = document.createElement('div');
        removeCoordsName.className = 'remove-location-name';
        removeCoordsName.innerHTML = 'Remove a location';
        removeCoords.addEventListener('click', () => {
            // remove last added place
            deleteCoords(window.locationNumber);
        })

        latElems.append(latElemLabel); // static
        lngElems.append(lngElemLabel); // static
        coordsParent.append(numTags); // static
        coordsParent.append(latElems); // static
        coordsParent.append(lngElems); // static
        addCoords.append(addCoordsIcon); // static
        addCoords.append(addCoordsName); // static
        removeCoords.append(removeCoordsIcon); // static
        removeCoords.append(removeCoordsName); // static

        const divContainer = document.createElement('div');
        divContainer.className = 'map-buttons-container';
        divContainer.appendChild(addCoords);
        divContainer.appendChild(removeCoords);
        parent.append(divContainer); // static

        let numTag = document.createElement('p');
        numTag.innerHTML = 1 + '.';
        numTag.className = "num-tags";

        numTags.append(numTag);
        latElems.append(createInput('latitude', 1))
        lngElems.append(createInput('longitude', 1))
    }

}

customElements.define('map-pick-location', MapPickLocation);
