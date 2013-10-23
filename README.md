EDR Commodity Flow Visualizations
=================================
These tools supports so-called “modern” browsers, which generally means everything except IE8 and below.

Choropleth Maps
----------------
To use choropleth maps simply include chorpleth.0.1.0.min.js in your project along with its dependencies.

### Dependencies ###
d3js - Javascript Visualization & Mapping Library

topojson - Geographic Data Storage and Simplification

tangle + tanglekit - Interactive Documents Engine

dataTables - Table generation and Download

All dependencies can be found in the resources folder.
See `examples/choropleth/choropleth-simple.html` for an html template for choropleth maps.

### choropleth.init(container) ###

To create a blank choropleth map pass the element ID to its constructor.

```html
<body>
<div id="map" style="width:900px;height:600px;margin:0 auto;"></div>
<script>
$(function(){ // on page load
	choropleth.init('map');//load choropleth map in map div
})
</script>
</body>```

### choropleth.dataSettings ###
Choropleth settings is a json object which tells the map where to get data. The default values are :

`settings : {datasource:'',sctg : '00' , mode : "00" , orig_or_dest : 'dest_fips' , fips : 27137}`
