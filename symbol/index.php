<!DOCTYPE html>
<meta charset="utf-8">
<title>Symbol Map</title>
<head>

    <link type="text/css" rel="stylesheet"  href="css/style.css">
    <script type="text/javascript" src="../resources/js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../resources/js/d3.v3.min.js"></script>
    <script type="text/javascript" src="../resources/js/topojson.v1.min.js"></script>

    <link rel="stylesheet" type="text/css" href="../resources/DataTables-1.9.4/media/css/jquery.dataTables.css" />
    <script src='../resources/DataTables-1.9.4/media/js/jquery.dataTables.min.js'></script>
    <script src='../resources/DataTables-1.9.4/extras/TableTools/media/js/TableTools.min.js'></script>


    
    <script type="text/javascript" src="../data/us-county-names.js"></script>
    <script type="text/javascript" src="js/helper_functions.js"></script>
    <script type="text/javascript" src="js/symbol.js"></script>


</head>
<body>
 <header>
  <a href="/tredis/" rel="author">AVAIL Labs Tredis Demo</a>
  <aside>August 26th, 2013</aside>
</header>


<h1>MN County Flows <span id='heading_commidity'>03</span></h1>

<aside>

<p>
Commodity:
<select id='commodity_select'>
  <option value="00" selected>All Commodities</option>
<option value="01">Live animals/fish</option>
<option value="02">Cereal grains</option>
<option value="03">Other ag prods.</option>
<option value="04">Animal feed</option>
<option value="05">Meat/seafood</option>
<option value="06">Milled grain prods.</option>
<option value="07">Other foodstuffs</option>
<option value="08">Alcoholic beverages</option>
<option value="09">Tobacco prods.</option>
<option value="10">Building stone</option>
<option value="11">Natural sands</option>
<option value="12">Gravel</option>
<option value="13">Nonmetallic minerals</option>
<option value="14">Metallic ores</option>
<option value="15">Coal</option>
<option value="16">Crude petroleum</option>
<option value="18">Gasoline</option>
<option value="19">Fuel oils</option>
<option value="20">Basic chemicals</option>
<option value="21">Pharmaceuticals</option>
<option value="22">Fertilizers</option>
<option value="23">Chemical prods.</option>
<option value="24">Plastics/rubber</option>
<option value="25">Logs</option>
<option value="26">Wood prods.</option>
<option value="27">Newsprint/paper</option>
<option value="28">Paper articles</option>
<option value="29">Printed prods.</option>
<option value="30">Textiles/leather</option>
<option value="31">Nonmetal min. prods.</option>
<option value="32">Base metals</option>
<option value="33">Articles-base metal</option>
<option value="34">Machinery</option>
<option value="35">Electronics</option>
<option value="36">Motorized vehicles</option>
<option value="37">Transport equip.</option>
<option value="38">Precision instruments</option>
<option value="39">Furniture</option>
<option value="40">Misc. mfg. prods.</option>
<option value="41">Waste/scrap</option>
<option value="43">Mixed freight</option>
<option value="99">Unknown</option>
</select>
<br>
Mode:
<select id='mode_select'>
  <option value='00'>All Modes</option>
 <option value='00'>All Modes</option>
  <option value="1">Truck</option>
  <option value="2">Rail</option>
  <option value="3">Water</option>
  <option value="5">Air</option>
  <option value="6">Pipeline</option>
  <option value="7">Other/Unkown</option>git 
</select> <br>
Origin or Destination
<select id ='orig_or_dest'>
  <option value="orig_fips">Outgoing Flows</option>
  <option value="dest_fips">Incoming Flows</option>
</select>
<br>
<!-- Granularity
<select id='granularity_select'>>
  <option value='0'>0</option>
  <option value='1'>1</option>
  <option value='2'>2</option>
  <option value='3' selected>3</option>
  <option value='4'>4</option>
  <option value =" 5"> 5</option>
  <option value ="10">10</option>
  <option value ="15" >15</option>
  <option value ="20">20</option>
  <option value ="25">25</option>
  <option value ="30">30</option>
  <option value ="35">35</option>
  <option value ="40">40</option>
  <option value ="45">45</option>
</select>
 --><br>
<input type="checkbox" id="voronoi"> <label for="voronoi">show Voronoi</label>
 <h2>
      <span>Minnesota Counties</span>
    </h2>
</aside>
<div id="container">
  <div id="data" >

</div>


<script>



var url = '../data/get/getCountyOrigDestFlow.php';
  $.ajax({url:url, type:'POST',data: { sctg:'00',mode:"00",granularity:'3',orig_or_dest:'orig_fips' },dataType:'json',async:true})
    .done(function(data) { 
       $('#heading_commidity').html($("#commodity_select").find(":selected").text());
       symbol.drawMap(data,'orig_fips');
       //symbol.drawData(); 

    })
    .fail(function(data) { console.log(data.responseText) });

$(function(){

  $('select').on("change",function(){

    console.log('hello');
    $.ajax({url:url, type:'POST',data: { sctg:$("#commodity_select").val(),mode:$("#mode_select").val(),granularity:'3',orig_or_dest: $("#orig_or_dest").val() },dataType:'json',async:true})
    .done(function(data) { 
       $('#heading_commidity').html($("#commodity_select").find(":selected").text());
       symbol.updateData(data,'orig_fips');
       //symbol.drawData(); 

    })
    .fail(function(data) { console.log(data.responseText) });

  })

}) 

    
</script>