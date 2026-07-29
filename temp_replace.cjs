const fs = require('fs');
const file = 'src/components/MapView.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('import tt from "@tomtom-international/web-sdk-maps";', 'import maplibregl from "maplibre-gl";');
content = content.replace('import "@tomtom-international/web-sdk-maps/dist/maps.css";', 'import "maplibre-gl/dist/maplibre-gl.css";');
content = content.replace(/tt\.Map/g, 'maplibregl.Map');
content = content.replace(/tt\.Marker/g, 'maplibregl.Marker');
content = content.replace(/tt\.Popup/g, 'maplibregl.Popup');
content = content.replace(/tt\.LngLatBounds/g, 'maplibregl.LngLatBounds');
content = content.replace(/tt\.NavigationControl/g, 'maplibregl.NavigationControl');
content = content.replace(/tt\.map\(\{([\s\S]*?)\}\);/, (match, p1) => {
  let newProps = p1.replace(/key:\s*TOMTOM_API_KEY,/, '');
  return 'new maplibregl.Map({' + newProps + '        style: `https://api.tomtom.com/map/1/tile/basic/main/style/main.json?key=${TOMTOM_API_KEY}`\n      });';
});
fs.writeFileSync(file, content);
