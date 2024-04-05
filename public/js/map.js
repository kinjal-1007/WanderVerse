maptilersdk.config.apiKey = mapToken;
  const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
  });
console.log(listing.geometry.coordinates);
const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
    `<h4>${listing.title}</h4><p>Exact Location will be provided after booking.</p>`
); 

const marker1 = new maptilersdk.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates) //listing geometry
    .setPopup(popup) 
    .addTo(map);


