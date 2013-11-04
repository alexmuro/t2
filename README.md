EDR Commodity Flow Visualizations
=================================
These tools support so-called “modern” browsers, which generally means everything except IE8 and below.

Choropleth Maps
----------------
To use choropleth maps simply include choropleth.0.1.0.min.js in your project along with its dependencies.

### Dependencies ###
d3js - Javascript Visualization & Mapping Library

topojson - Geographic Data Storage and Simplification

tangle + tanglekit - Interactive Documents Engine

dataTables - Table generation and Download

All dependencies can be found in the resources folder.
See `examples/choropleth/choropleth-template.html` for an html template for choropleth maps.


##Gettings Started##

 This template is all the code required for creating a choropleth map. The template includes no css for page formatting so it can be easily integrated with any stylesheet. To view the AVAIL styled choropleth map take a look in the /choropleth folder for page layout and css.


```html
<html>
<head>
    <!-- Meta Data -->  
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="description" content="description">
    <meta name="keywords" content="keywords">

    <!-- Cascading Style Sheets -->
    <link rel="stylesheet" href="../../resources/css/choropleth.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="../../resources/css/leaflet.css" />
    <link rel="stylesheet" href="../../resources/css/TangleKit.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="../../resources/css/jquery.dataTables.css" />  

    <!-- Javascript Includes -->
    <script type="text/javascript" src="../../resources/js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../../resources/js/d3.v3.min.js"></script>  
    <script type="text/javascript" src="../../resources/js/leaflet.js"></script>
    <script type="text/javascript" src="../../resources/js/queue.v1.min.js"></script>
    <script type="text/javascript" src="../../resources/js/topojson.v1.min.js"></script>
    <script type="text/javascript" src="../../resources/js/colorbrewer.js"></script>
    <script type="text/javascript" src="../../resources/js/tangle.min.js"></script>
    <script type="text/javascript" src='../../resources/js/jquery.dataTables.min.js'></script>
    <script type="text/javascript" src='../../resources/js/TableTools.min.js'></script>
    <script type="text/javascript" src="http://canvg.googlecode.com/svn/trunk/canvg.js"></script> 

    
    <script type="text/javascript" src="../../resources/src/choropleth.js"></script>

    <title>Choropleth Simple</title>
</head>
<body>
    <div style="width:901px;margin:0 auto;">Choropleth Containers
        <div id="map" style="width:900px;height:600px;"></div>
        <div id="county_select"></div>
        <div id="mode_select"></div>
        <div id="commodity_select"></div>
        <div id="orig_or_dest_select"></div>
        <div id="hover"></div>
        <div id="legend"></div>
    </div>
    
<script>
$(function(){ // on page load
    var countyList = ['23001','23003','23005','23007','23009','23011','23013','23015','23017','23019','23021','23023','23025','23027','23029','23031'];
    choropleth.settings.fips = '23001';
    choropleth.settings.datasource = 'http://vis.availabs.org/t2/data/get/getCountyToNation_ME.php';
    choropleth.init('map',countyList);
})
</script>
</body>
</html>
```


### choropleth.init(container,counties) ###

To create a blank choropleth map, pass the element ID to its constructor and the list of counties you wish to be able to visualize.


### choropleth.settings ###
Choropleth settings is a JSON object which tells the map where to get data. The default values are :

`settings : {datasource:'',sctg : '00' , mode : '00' , orig_or_dest : 'dest_fips' , fips : '27137'}`

before initializing the maps you must at least set choropleth.settings.datasource as in the example above.

Each individual setting is passed in a POST request to the datasource url to specify what data it should return.See `data/get/getCountytoNation.php' to see how its parsed.

##### settings.datasource #####
 
The datasource is the URL of the page which provides data. If it remains unset the map will load blank. 
example

```javascript
choropleth.settings.datasource = 'http://vis.availabs.org/t2/data/get/getCountyToNation.php'
choropleth.init('map');
```

Because all of the rest of the settings are default this will load a map of import flows for county 27137 (St Louis County Minnesota), for all commodities, for all modes of transportation. 


##### settings.sctg #####

sctg sets the commidty code that is queried for. Must be a two character string.

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

mode sets the mode of transportation that is queried for. 

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

##### Container Naming Conflicts #####
 
  As you can see in the example a number of aspects of the choropleth map need their own div containers to be rendered onto the page. These are the default element ids that are used as containers:

  ```
    legendContainer:'legend',
    countySelectContainer:'county_select',
    commoditySelectContainer:'commodity_select',
    modeSelectContainer:'mode_select',
    origOrDestSelectContainer:'orig_or_dest_select',
    flowTableContainer:'flow_data',
```
 however if you have a naming conflict with one of these containers you can change the contianer name before calling choropleth.init() by simply setting the property to a new container name for example

 ```javascript
  choropleth.legendContainer = 'legend-display';
```
 The container names refer to the element ID and do not required the jquery style # selector. The matching element for this above example would look like this:

```html
<div id='legend-display'></div>
```


## Data Source Data Format ##
The choropleth class accesses the data source with the following call:
```javascript
		$.ajax({url:choropleth.settings.datasource, 
			type : 'POST',
			data:choropleth.settings,
			dataType:'json',
			async:false
		})
```
however this is done behind the scenes and this isn't required in setting up the maps.

The data source must return a JSON object of the following format:

```json
{
    "map": [
        {
            "fips": "27137",
            "tons": "710.5506406377215"
        },
        {
            "fips": "55031",
            "tons": "195.67821738555554"
        },
        ...
    ]
}
```



Data Processing
----------------

 While any data which is returned in the above format will work for generating choropleth maps, here is the approach that we took in processing the data that was sent to us for these projects. All sql code has been tested on MySQL mysql Ver 14.14 Distrib 5.5.34 &amp; Ver 14.14 Distrib 5.5.29.

#####1 - Create a table for the state data. #####
```sql

delimiter $$
CREATE TABLE `tbl_maine_domestic_db` (
  `dms_orig` varchar(45) DEFAULT NULL,
  `dms_orig_fips` varchar(45) DEFAULT NULL,
  `dms_dest` varchar(45) DEFAULT NULL,
  `dms_dest_fips` varchar(45) DEFAULT NULL,
   `dms_mode` varchar(45) DEFAULT NULL,
  `sctg2` varchar(45) DEFAULT NULL,
  `value_2010` float DEFAULT NULL,
  `curval_2010` float DEFAULT NULL,
  `tons_2010` float DEFAULT NULL,
  KEY `orig` (`dms_orig_fips`),
  KEY `dest` (`dms_dest_fips`),
  KEY `orig-dest` (`dms_dest_fips`,`dms_orig_fips`),
  KEY `mode` (`dms_mode`),
  KEY `scgt` (`sctg2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8$$
```

#####2 - Import from CSV using mysqlimport (command line) #####
```BASH
mysqlimport  --ignore-lines=1 --fields-terminated-by=, --fields-enclosed-by=\" --columns='dms_orig,dms_orig_fips,dms_dest,dms_dest_fips,dms_mode,sctg2,value_2010,curval_2010,tons_2010' --local -u root -p tredis tbl_maine_domestic_db.csv\
```
note, the name of the file you are importing MUST be the same as the name of the table you created in step one.

#####3 - Create County Tables #####

  We found on our hardware that querying a single state table for the data needed in the choropleth map was too slow to be usable for this project. To speed up queries we broke out the state table into individual county tables. To do this we create a table formatted exactly the same as the state stable and named with a 5 digit county fips code. Then ran the following query for each table

    $sql ="insert into `".$state_fips.$county_fips."` select dms_orig_fips,dms_dest_fips,dms_mode,sctg2,curval_2010,tons_2010 from tbl_corrected_maine_domestic where dms_orig_fips = $fips or dms_dest_fips = $fips";

  See data/create/createCountyTable.php for the script we used to create all the county tables for a state at once.


Serving the Data
----------------
 
   The script used to serve the data recieves all of the variable in choropleth settings as POST variables and uses them to query the appropriate FIPS table for the correct commodity, mode and flow direction. See data/get/getCountyToNation_ME.php for our php code. This being under 50 lines of code should be easy to translate into your server side language of choice





