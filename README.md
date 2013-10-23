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
</body>
```

### choropleth.settings ###
Choropleth settings is a json object which tells the map where to get data. The default values are :

`settings : {datasource:'',sctg : '00' , mode : '00' , orig_or_dest : 'dest_fips' , fips : '27137'}`

Each individual setting is passed as in a POST request to the datasource url to specify what data it should return.See `data/get/getCountytoNation.php' to see how its parsed.

##### settings.datasource #####
 
The datasource is the URL of the page which provides data. If it remains unset the map will load blank. 
example

```javascript
choropleth.settings.datasource = 'http://vis.availabs.org/t2/data/get/getCountyToNation.php'
choropleth.init('map');
```

Because all of the rest of the settings are default this will load a map import flows for county 27137 (St Louis County Minnesota), for all commodities, for all modes of transportation. 


##### settings.sctg #####

sctg sets the commidty code that is queried for. Must be a two character sting.

|Value| Meaning| 
|----:|:----------------|
|"00"|All Commodities|
|"01"| Live animals/fish|
|"02"| Cereal grains|
|"03"| Other ag prods.|
|"04"| Animal feed|
|"05"| Meat/seafood|
|"06"| Milled grain prods.|
|"07"| Other foodstuffs|
|"08"| Alcoholic beverages|
|"09"| Tobacco prods.|
|"10"| Building stone|
|"11"| Natural sands|
|"12"| Gravel|
|"13"| Nonmetallic minerals|
|"14"| Metallic ores|
|"15"| Coal|
|"16"| Crude petroleum|
|"18"| Gasoline|
|"19"| Fuel oils|
|"20"| Basic chemicals|
|"21"| Pharmaceuticals|
|"22"| Fertilizers|
|"23"| Chemical prods.|
|"24"| Plastics/rubber|
|"25"| Logs|
|"26"| Wood prods.|
|"27"| Newsprint/paper|
|"28"| Paper articles|
|"29"| Printed prods.|
|"30"| Textiles/leather|
|"31"| Nonmetal min. prods.|
|"32"| Base metals|
|"33"| Articles-base metal|
|"34"| Machinery|
|"35"| Electronics|
|"36"| Motorized vehicles|
|"37"| Transport equip.|
|"38"| Precision instruments|
|"39"| Furniture|
|"40"| Misc. mfg. prods.|
|"41"| Waste/scrap|
|"43"| Mixed freight|
|"99"| Unknown|

##### settings.mode #####

mode sets the mode of transportation that is queried for. Must be a two character sting.

|Value| Meaning| 
|-----:|:------|
|"00"|All Modes|
|"1"|Truck|
|"2"|Rail|
|"3"|Water|
|"5"|Air|
|"6"|Pipeline|
|"7"|Other/Unkown|

##### settings.orig_or_dest #####
|Value| Meaning| 
|-----------:|:-----------|
|"dest_fips"| Import Flows|
|"orig_fips"| Export Flows|

##### settings.fips ##### 

This specifies which county is being queried for. This setting will also make that county appear in red on the map.


## Data Source Data Format ##
The data source is accessed with the following call:
```javascript
		$.ajax({url:choropleth.settings.datasource, 
			type : 'POST',
			data:choropleth.settings,
			dataType:'json',
			async:false
		})
```
The data source must return a JSON object of the following format:

```json
{
    "flow": {
        "orig_fips": {
            "orig_fips": "27137",
            "total": "37924.7",
            "truck_total": "9571.13",
            "rail_total": "17596.5",
            "water_total": "2414.25",
            "air_total": "8272.47",
            "pipeline_total": "39.0653",
            "other_total": "31.2147"
        },
        "dest_fips": {
            "orig_fips": "27137",
            "total": "6522.69",
            "truck_total": "5992.76",
            "rail_total": "318.412",
            "water_total": "3.22513",
            "air_total": "87.5901",
            "pipeline_total": "64.7942",
            "other_total": "55.8819"
        }
    },
    "map": [
        {
            "orig": "27137",
            "tons": "710.5506406377215"
        },
        {
            "orig": "55031",
            "tons": "195.67821738555554"
        },
        ...
    ]
}
```