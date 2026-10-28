/**
 * Facility map page (Leaflet + OpenStreetMap tiles), rendered inside an
 * <iframe srcdoc> on the web and a WebView in the app.
 * IDENTICAL in maternalert-web (src/services/mapHtml.ts) and
 * maternalert-fe (services/mapHtml.ts).
 *
 * Free: no API key. OpenStreetMap's tile policy allows light use like this
 * with visible attribution. If traffic grows, change TILE_URL to a hosted
 * provider (e.g. MapTiler or Stadia free tiers) — nothing else changes.
 *
 * Google's terms forbid showing Google Places results on a non-Google map,
 * so callers must pass only non-Google results here.
 *
 * Messages:  map -> host  {type:"select", id}
 *            host -> map  {type:"focus", id}
 */

export interface MapPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  kind?: "hospital" | "clinic" | "other";
  distance?: string | null;
}

export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildMapHtml(opts: {
  points: MapPoint[];
  me?: { lat: number; lng: number } | null;
  dark?: boolean;
}): string {
  // JSON inside <script>: escape "<" so a facility name can't close the tag.
  const data = JSON.stringify({
    points: opts.points.map((p) => ({ ...p, name: esc(p.name) })),
    me: opts.me ?? null,
  }).replace(/</g, "\\u003c");
  const bg = opts.dark ? "#13261E" : "#F4EFE8";
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<style>
html,body,#map{margin:0;height:100%;background:${bg};font-family:Outfit,system-ui,sans-serif}
.leaflet-popup-content{margin:10px 12px;font-size:14px;line-height:1.35;color:#0F241C}
.leaflet-popup-content b{display:block;font-size:15px;margin-bottom:2px}
.leaflet-container a.ma-dir{display:inline-block;margin-top:6px;color:#0A5C43;font-weight:600}
#msg{position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center;padding:16px;color:#5B6B64;font-size:14px}
</style></head><body><div id="map"></div><div id="msg">Map couldn't load. The list below still works.</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
(function(){
  var D=${data};
  function send(m){var s=JSON.stringify(m);try{if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(s)}else{window.parent.postMessage(s,"*")}}catch(e){}}
  if(!window.L){document.getElementById("msg").style.display="flex";return;}
  var map=L.map("map",{zoomControl:true,attributionControl:true});
  L.tileLayer(${JSON.stringify(TILE_URL)},{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(map);
  var markers={},bounds=[];
  D.points.forEach(function(p){
    var hosp=p.kind==="hospital";
    var m=L.circleMarker([p.lat,p.lng],{radius:hosp?9:7,color:"#FFFFFF",weight:2,fillColor:hosp?"#0E7C5A":"#B45309",fillOpacity:1});
    var dir="https://www.google.com/maps/dir/?api=1&destination="+p.lat+","+p.lng;
    m.bindPopup("<b>"+p.name+"</b>"+(hosp?"Hospital":"Clinic")+(p.distance?" · "+p.distance:"")+"<br><a class='ma-dir' href='"+dir+"' target='_blank' rel='noopener'>Directions</a>",{autoPanPaddingTopLeft:[56,12],autoPanPaddingBottomRight:[12,24]});
    m.on("click",function(){send({type:"select",id:p.id})});
    m.addTo(map);markers[p.id]=m;bounds.push([p.lat,p.lng]);
  });
  if(D.me){
    L.circleMarker([D.me.lat,D.me.lng],{radius:7,color:"#FFFFFF",weight:3,fillColor:"#2563EB",fillOpacity:1}).bindTooltip("You are here").addTo(map);
    // Only frame "you" with the results when you're near them (a town search
    // elsewhere shouldn't zoom out to the whole country).
    var near=D.points.some(function(p){return map.distance([p.lat,p.lng],[D.me.lat,D.me.lng])<30000});
    if(near||!D.points.length){bounds.push([D.me.lat,D.me.lng])}
  }
  function fit(){
    map.invalidateSize();
    if(bounds.length>1){map.fitBounds(bounds,{padding:[28,28],maxZoom:16})}
    else if(bounds.length===1){map.setView(bounds[0],15)}
    else{map.setView([6.6018,3.3515],12)} // Ikeja
  }
  fit();
  // The frame can be laid out after this script runs; refit once it has a size.
  var fitted=false;
  window.addEventListener("load",function(){fit();fitted=true});
  window.addEventListener("resize",function(){if(!fitted){fit()}else{map.invalidateSize()}});
  function onMsg(e){try{var m=typeof e.data==="string"?JSON.parse(e.data):e.data;if(m&&m.type==="focus"&&markers[m.id]){var mk=markers[m.id];map.setView(mk.getLatLng(),Math.max(map.getZoom(),15));mk.openPopup();}}catch(err){}}
  window.addEventListener("message",onMsg);document.addEventListener("message",onMsg);
})();
</script></body></html>`;
}
