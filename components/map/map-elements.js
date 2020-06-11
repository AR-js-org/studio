//  This is requires stylesheet css for leaflet can be re-used on different pages
// src: https://leafletjs.com/examples/quick-start/
const leaflet_stylesheet_link = `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""/>`;

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

    .svg-define-location {
        padding-top: 0.3em;
    }
    .location-set-display {
        visibility: hidden;
        padding-top: 0;
    }
    .use-my-location-button{
        background-color: white;
        color: black;
        margin-left: 2px;
    }
    .number-icon{
        background-color: blue;
        padding: 9px;
        border-radius: 15%;
        text-align:center;
        color:white;
        font-weight: bold;
        font-size: 15px;
    }
    .leaflet-marker-icon {
        display: flex !important;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: black;
    }

</style>`;


// tile url most likely not to change
const tile_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
// attribution required for use of open street maps
const openStreetMaps_attribution = "<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a>";

const defineLocationSvg = `
  <?xml version="1.0" ?>
  <svg class="svg-define-location" height="15" viewBox="0 0 48 48" width="15" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h48v48h-48z" fill="none"/><path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm17.88 6c-.92-8.34-7.54-14.96-15.88-15.88v-4.12h-4v4.12c-8.34.92-14.96 7.54-15.88 15.88h-4.12v4h4.12c.92 8.34 7.54 14.96 15.88 15.88v4.12h4v-4.12c8.34-.92 14.96-7.54 15.88-15.88h4.12v-4h-4.12zm-17.88 16c-7.73 0-14-6.27-14-14s6.27-14 14-14 14 6.27 14 14-6.27 14-14 14z"/>
  </svg>`


const trashCanSvg = `
<?xml version='1.0' encoding='iso-8859-1'?>
<svg version="1.1"  width="20.20px" height="20.20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 463 463" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 463 463">
  <path d="M375.5,48H295V31.5C295,14.131,280.869,0,263.5,0h-64C182.131,0,168,14.131,168,31.5V48H87.5C65.72,48,48,65.72,48,87.5v24  c0,4.142,3.357,7.5,7.5,7.5H64v288.5c0,10.336,6.71,19.128,16,22.266v9.734c0,12.958,10.542,23.5,23.5,23.5h256  c12.958,0,23.5-10.542,23.5-23.5v-9.734c9.29-3.138,16-11.93,16-22.266V119h8.5c4.143,0,7.5-3.358,7.5-7.5v-24  C415,65.72,397.28,48,375.5,48z M183,31.5c0-9.098,7.402-16.5,16.5-16.5h64c9.098,0,16.5,7.402,16.5,16.5V48h-97V31.5z M79,159.5  c0-4.687,3.813-8.5,8.5-8.5s8.5,3.813,8.5,8.5V416h-8.5c-4.687,0-8.5-3.813-8.5-8.5V159.5z M359.5,448h-256  c-4.687,0-8.5-3.813-8.5-8.5V431h273v8.5C368,444.187,364.187,448,359.5,448z M168,416h-17V159.5c0-4.687,3.813-8.5,8.5-8.5  s8.5,3.813,8.5,8.5V416z M240,416h-17V159.5c0-4.687,3.813-8.5,8.5-8.5s8.5,3.813,8.5,8.5V416z M312,416h-17V159.5  c0-4.687,3.813-8.5,8.5-8.5s8.5,3.813,8.5,8.5V416z M384,407.5c0,4.687-3.813,8.5-8.5,8.5H367V159.5c0-4.687,3.813-8.5,8.5-8.5  s8.5,3.813,8.5,8.5V407.5z M384,137.597c-2.638-1.027-5.503-1.597-8.5-1.597c-12.958,0-23.5,10.542-23.5,23.5V416h-25V159.5  c0-12.958-10.542-23.5-23.5-23.5S280,146.542,280,159.5V416h-25V159.5c0-12.958-10.542-23.5-23.5-23.5S208,146.542,208,159.5V416  h-25V159.5c0-12.958-10.542-23.5-23.5-23.5S136,146.542,136,159.5V416h-25V159.5c0-12.958-10.542-23.5-23.5-23.5  c-2.997,0-5.862,0.57-8.5,1.597V119h305V137.597z M400,104H63V87.5C63,73.991,73.99,63,87.5,63h288c13.51,0,24.5,10.991,24.5,24.5  V104z"/>
</svg>`


const plusSignSvg = `
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   width="20.20px" height="20.20px" viewBox="0 0 38.342 38.342"
   xml:space="preserve">
<g>
  <path d="M19.171,0C8.6,0,0,8.6,0,19.171C0,29.74,8.6,38.342,19.171,38.342c10.569,0,19.171-8.602,19.171-19.171
    C38.342,8.6,29.74,0,19.171,0z M19.171,34.341C10.806,34.341,4,27.533,4,19.17c0-8.365,6.806-15.171,15.171-15.171
    s15.171,6.806,15.171,15.171C34.342,27.533,27.536,34.341,19.171,34.341z M30.855,19.171c0,1.656-1.344,3-3,3h-5.685v5.685
    c0,1.655-1.345,3-3,3c-1.657,0-3-1.345-3-3v-5.685h-5.684c-1.657,0-3-1.344-3-3c0-1.657,1.343-3,3-3h5.684v-5.683
    c0-1.657,1.343-3,3-3c1.655,0,3,1.343,3,3v5.683h5.685C29.512,16.171,30.855,17.514,30.855,19.171z"/>
</svg>`

const config = [
    {
        id: "001",
        path: "location.html",
        className: ".map-pick-location",
        elem: `<div id="map-container">
                <div class="map-pick-location"></div>
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
];
