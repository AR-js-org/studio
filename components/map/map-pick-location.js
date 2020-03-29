

//  This is requires stylesheet css for leaflet can be re-used on different pages
// src: https://leafletjs.com/examples/quick-start/
const leaflet_stylesheet_link = `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>`;

// tile url most likely not to change
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// attribution required for use of open street maps
const openStreetMaps_attribution = "<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>";




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
</style>
`;



const config = [
  {
    id: "001",
    path: "location.html",
    className: ".map-pick-location",
    div: '<div class="map-pick-location"></div>',
    center: [21.2901808, -157.8299651],
    onLoad_zoom: 18,
    attribution_opts: { 
      attribution: openStreetMaps_attribution,
      maxZoom: 18, 
      minZoom: 10 
    }  
  },
  {
    id: "002",
    path: "foobar.html",
    className: ".map-foo-bar",
    div: '<div class="map-foo-bar"></div>',
    center: [21.2901808, -157.8299651],
    onLoad_zoom: 18,
    attribution_opts: { 
      attribution: openStreetMaps_attribution,
      maxZoom: 18, 
      minZoom: 10 
    }  
  }
]



// filter config array returning by uri path name for ex. location.html => {} config for this page
// if you want to use the map on a different page for ex. differentpage.html => {} config for this page
function returnPageConfig(path){ 
  return templateConfig = config.filter(e => {
    return e.path === path
  })[0];
}


function reUseMapComponent(path){

  let templateConfig = returnPageConfig(path); // => {} with config for setting the innerHTML
  // map_styles can remain static as we can add new styles to the constant declared above as dev continues
  // leaflet_stylesheet_link will remain the same
  // templateConfig.div is sourced from the config array so we can add new objects in the array for different pages
  const MapTemplate = `
  ${map_styles}
  ${leaflet_stylesheet_link}
  ${templateConfig.div} `;

  return MapTemplate;
}



function invokeMapConfig(shadow, path) {
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
    layerGroup.clearLayers();
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;
    let marker = L.marker([lat, lng]).addTo(layerGroup); // adds marker to the map
    updateLatLngInput(lat,lng); // updates the input fields above the map to reflect the chosen coordinates
  })
}



function updateLatLngInput(lat,lng){
  document.getElementById("latitude").value = lat.toString();
  document.getElementById("longitude").value = lng.toString();

}



class MapPickLocation extends HTMLElement {
    constructor() {
        super();

        this.path = "location.html";

        let shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = reUseMapComponent(this.path);
    }

    connectedCallback() {
      invokeMapConfig(this.shadowRoot,this.path);
    }
}



customElements.define('map-pick-location', MapPickLocation);











