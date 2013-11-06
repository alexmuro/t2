EDR Commodity Flow Visualizations
=================================
These tools support so-called “modern” browsers, which generally means everything except IE8 and below.

Symbol Maps
----------------
To use symbol maps simply include symbol.0.1.0.min.js in your project along with its dependencies.

### Dependencies ###
d3js - Javascript Visualization & Mapping Library

topojson - Geographic Data Storage and Simplification

tangle + tanglekit - Interactive Documents Engine

dataTables - Table generation and Download

Queue js - To handle async data loads

All dependencies can be found in the resources folder.
See `examples/symbol/symbol-template.html` for an html template for symbol maps.


##Gettings Started##

 This template is all the code required for creating a symbol map. The template includes no css for page formatting so it can be easily integrated with any stylesheet. To view the AVAIL styled symbol map take a look in the /symbol folder for page layout and css.


```html
<html>
<head>
  <!-- Meta Data -->  
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="description" content="description">
  <meta name="keywords" content="keywords">

  <!-- Cascading Style Sheets -->
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

    
    <script type="text/javascript" src="../../resources/src/symbol.js"></script>

  <title>Symbol Template</title>
</head>
<body>
  <div style="width:901px;margin:0 auto;">
    <div id="map" style="width:900px;height:600px;"></div>
    <div id="mode_select"></div>
    <div id="commodity_select"></div>
    <div id="orig_or_dest_select"></div>
    <div id="info"></div>
    <div id="legend"></div>
    <div id="data"></div>
  </div>
  
<script>
$(function(){ // on page load

  var mn = [27001,27003,27005,27007,27009,27011,27013,27015,27017,27019,27021,27023,27025,27027,27029,27031,27033,27035,27037,27039,27041,27043,27045,27047,27049,27051,27053,27055,27057,27059,27061,27063,27065,27067,27069,27071,27073,27075,27077,27079,27081,27083,27085,27087,27089,27091,27093,27095,27097,27099,27101,27103,27105,27107,27109,27111,27113,27115,27117,27119,27121,27123,27125,27127,27129,27131,27133,27135,27137,27139,27141,27143,27145,27147,27149,27151,27153,27155,27157,27159,27161,27163,27165,27167,27169,27171,27173];
  symbol.settings.datasource = '/t2/data/get/getCountyOrigDestFlow.php';
  symbol.tableDatasource = '/t2/data/get/getSymChart.php';
  symbol.init(mn);
})
</script>
</body>
</html>
```


### symnbol.init(container,counties) ###

To create a blank symbol map, pass the list of counties you wish to be able to visualize.


### symbol.settings ###
Symbol settings is a JSON object which tells the map where to get data. The default values are :

`settings : {datasource:'',sctg : '00' , mode : '00' , orig_or_dest : 'dest_fips'}`

before initializing the maps you must at least set symbol.settings.datasource as in the example above.

Each individual setting is passed in a POST request to the datasource url to specify what data it should return.See `data/get/getCountyOrigDestFlow.php' to see how its parsed.

Additionally you will need a seperate datasource for the text tables. for this you must set symbol.tableDatasource. See `data/get/getSymChart.php' to see how its parsed.

##### settings.datasource #####
 
The datasource is the URL of the page which provides data. If it remains unset the map will load blank. 
example

```javascript
symbol.settings.datasource = 'http://vis.availabs.org/t2/data/get/getCountyOrigDestFlow.php'
symbol.init('map');
```

Because all of the rest of the settings are default this will load a map of import flows for county 27137 (St Louis County Minnesota), for all commodities, for all modes of transportation. 

##### symbol.tableDatasource #####
 
Note, this is not part of settings but a variable belonging directly to the symbol object. The datasource is the URL of the page which provides data. If it remains unset the map will load blank. 
example

```javascript
...
symbol.tableDatasource = '/t2/data/get/getSymChart.php';
symbol.init(mn)
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



##### Container Naming Conflicts #####
 
  As you can see in the example a number of aspects of the symbol map need their own div containers to be rendered onto the page. These are the default element ids that are used as containers:

```
  commoditySelectContainer:'commodity_select',
  modeSelectContainer:'mode_select',
  origOrDestSelectContainer:'orig_or_dest_select',
  flowTableContainer:'data',
  legendContainer:'legend',
  mapContainer:'map',
  infoContainer:'info',
```
 however if you have a naming conflict with one of these containers you can change the contianer name before calling symbol.init() by simply setting the property to a new container name for example

 ```javascript
  symbol.legendContainer = 'legend-display';
```
 The container names refer to the element ID and do not required the jquery style # selector. The matching element for this above example would look like this:

```html
<div id='legend-display'></div>
```


## Data Source Data Format ##
The symbol class accesses the data source with the following call:
```javascript
		$.ajax({url:symbol.settings.datasource, 
			type : 'POST',
			data:symbol.settings,
			dataType:'json',
			async:false
		})
```
however this is done behind the scenes and this isn't required in setting up the maps.

The data source must return a JSON object of the following format:

```json
[
  {
    "orig":"27001",
    "dest":"27001",
    "tons":"100.21730166327356"
  },
  {
    "orig":"27001",
    "dest":"27003",
    "tons":"7.64786575049914"
  },
  ...
] 

```

 The distinct list of origins in the data must be equal to the counties input array passed to symbol.init(). For each origin the list of all destinations must be equal to the list of counties passed to symbol.init()

## Table Data Source Format ##

  This datasource takes the same input as the first data source for symbol maps with the addition of a fips code which is determing by a click event:
  ```javascript
  var dataSettings = symbol.settings;
  dataSettings.fips = fips;
  ```
  The data output should be all of the origins or destinations for that fips code based on the settings

  ```json
  [
    {
      "fips":"27137",
      "tons":"710.5506406377215"
    },
    { 
      "fips":"27017",
      "tons":"365.3212150798759"
    },
    ...
  ]
  ```


Data Processing
----------------

 While any data which is returned in the above format will work for generating symbol maps, here is the approach that we took in processing the data that was sent to us for these projects. All sql code has been tested on MySQL mysql Ver 14.14 Distrib 5.5.34 &amp; Ver 14.14 Distrib 5.5.29.

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

#####3 - Create Summary Tables #####

  Symbol maps havet the potential to run on any possible combination of counties and depending on that list the dataset can be quite large. Becuase these tables can have sources across state lines but also have a limited number of destinations compared to the total number of destinations in a state summary table we suggest creating a custom table for each symbol map you want to display. To do that create a table with the same format as in step one and then run the following query for each state that has counties being dispalyed in the county list.


    $sql ="insert into `custom_symbol_table` select dms_orig_fips,dms_dest_fips,dms_mode,sctg2,curval_2010,tons_2010 from state_table where dms_orig_fips in ('27001','55123') or dms_dest_fips in ('27001','55123')";

  In the example above the county list is only 2 counties and would have to be run twice one for MN(27) and one for WI(55). 


Serving the Data
----------------
 
   The script used to serve the data recieves all of the variable in symbol settings as POST variables and uses them to query for the correct commodity, mode and flow direction. See data/get/getCountyOrigDestFlow.php.php for our php code. This being under 50 lines of code should be easy to translate into your server side language of choice





