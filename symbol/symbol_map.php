<!-- mbostock’s block #5349951
Ohio State Plane (N)
April 10, 2013
Open in a new window.
The counties of Ohio, generated via the us-atlas and using the Ohio State Plane North projection, part of the State Plane Coordinate System.

index.html#
 -->
<!DOCTYPE html>

<meta charset="utf-8">
<title>Symbol Map</title>

<style>
@import url(../resources/css/chord_chart.css);

.county {
  fill: #eee;
  z-index:-1;
}

.county:hover {
  fill: orange;
}

.county-border {
  fill: none;
  stroke: #777;
  pointer-events: none;
}

path.arc {
  pointer-events: none;
  fill: none;
  stroke: #000;
  display: none;
}

path.cell {
  fill: none;
  pointer-events: all;
}

circle {
  fill: steelblue;
  fill-opacity: .8;
  stroke: #fff;
}

#cells.voronoi path.cell {
  stroke: brown;
}


#cells g.lines path.arc {
  display: inherit;
}



#data{
  position:absolute;
  top:400px;
  right:100px;
}

</style>

<body>


</style>

 <header>
  <a href="/tredis/" rel="author">AVAIL Labs Tredis Demo</a>
  <aside>May 16, 2013</aside>
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
Granularity
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
<br>
<input type="checkbox" id="voronoi"> <label for="voronoi">show Voronoi</label>
 <h2>
      <span>Minnesota Counties</span>
    </h2>
</aside>
<div id="container">
  <div id="data" >

</div>

<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
<script src="../resources/js/d3.v3.min.js"></script>
<script src="../resources/js/topojson.v1.min.js"></script>
<script>

var  county_names = [];
d3.json('../data/us-county-names.json', function(error, counties){
    county_names = counties;});

function getCentroid(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node(),
        // use the native SVG interface to get the bounding box
        bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}
function number_format(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function countName(inputId){
  name = '';
  county_names.forEach(function(d){
    if (inputId == d.fips){
      name = d.name;       
    }   
  });
 return name;
}



  // function findMax(data){
  //   var max = 0;
  //   var name;
  //   $.each(data,function(d,v){
  //     if((v.tons*1)>max){
  //       max = (v.tons*1);
  //       name = countName(v.orig);      }
  //   })
  //   return max;
  // };

  // function findShare(data,i){
  //   var max = findMax(data);
  //   var share = 0;    
  //     share = ((i.tons)/max);
  //     width = 8 * share;
  //   console.log(width);
  //  return width;

  // }







  function drawTable(data){
    var table = '<h3>Top Trade Destinations<br> by Mode &amp; Commodity</h3>';
          table  = "<table><thead><tr><td>Rank</td><td>County</td><td>Tons</td></tr></thead>";
          $.each(data,function(d,v){
            if(d <20){
              table += "<tr><td>"+(d*1+1)+"&nbsp;&nbsp;</td><td>"+countName(v.orig*1)+"&nbsp;&nbsp;</td><td> "+(v.tons*1).toFixed(2)+"</td></tr>";
            }
          });
          table += "</table>";
          $('#data').html(table);
  }


function symbol_graph(map,flow_data,orig_or_dest)
{
  var width = 700,
      height = 740,
      positions = [],
      hubs = [];

  var projection = d3.geo.conicConformal()
      .parallels([39 + 26 / 60, 41 + 42 / 60])
      .rotate([93 + 45 / 60, -40 - 20 / 60])
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  d3.select("body").selectAll("svg").remove();


  var svg = d3.select("body").append("svg:svg")
      .attr("width", width)
      .attr("height", height);

  var states = svg.append("svg:g")
      .attr("id", "states");

  var circles = svg.append("svg:g")
      .attr("id", "circles");

  var cells = svg.append("svg:g")
      .attr("id", "cells");

  d3.json(map, function(error, oh) {
  var counties = topojson.feature(oh, oh.objects.counties);

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(counties),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  states.selectAll("path")
      .data(counties.features)
    .enter().append("svg:path")
      .attr("class", "county")
      .attr("d", path)
    .append("title")
      .text(function(d) { d.name });

  svg.append("path")
      .datum(topojson.mesh(oh, oh.objects.counties, function(a, b) { return a !== b; }))
      .attr("class", "county-border")
      .attr("d", path);

  var linksByOrigin = {},
      countByOrig = {},
      countByDest = {},
      locationByCounty = {};
     
  var arc = d3.geo.greatArc()
      .source(function(d) { return locationByCounty[d.source]; })
      .target(function(d) { return locationByCounty[d.target]; });

  svg.selectAll("path")
    .each(function(d){
      latlong = getCentroid(d3.select(this));
      positions.push(latlong);
      hub = {};
      hub['id'] = d.id;
      if(typeof d.properties != 'undefined'){
        hub['name'] = d.properties.name;
      }
      hub['latitude'] = latlong[0];
      hub['longitude'] = latlong[1];
      locationByCounty[d.id] = latlong; 
      hubs.push(hub);
    });
 
  var maxFlow = 0;
  flow_data.forEach(function(flow) {
    if(flow.tons > maxFlow){
      maxFlow = flow.tons;
    }
    if(flow.tons > $("#granularity_select").val()){
        
        var origin = flow.orig,
        destination = flow.dest,
        links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
        links.push({source: origin, target: destination, tons:flow.tons});
        countByOrig[origin] = (countByOrig[origin] || 0) + flow.tons*1;
        countByDest[destination] = (countByDest[destination] || 0) + flow.tons*1;
      }
  });

  //console.log('maxflow:'+maxFlow);
  var polygons = d3.geom.voronoi(positions);

  var g = cells.selectAll("g")
    .data(hubs)
    .enter().append("svg:g").attr("class",function(d){return "county_" + d.id});

  g.append("svg:path")
    .attr("id", function(d){return "county_" + d.id})
    .attr("class", "cell")
    .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
    .on("click", function(d, i) {

        var first = (d3.selectAll(".lines"))
        if(first[0].length != 0){
          var id = first.attr("class").split(" ");
          first.attr("class",id[0]);
        }
        var county = d3.selectAll(".county_"+d.id);
        county.attr("class","county_"+d.id+" lines");
        //$("#county_"+d.id+".parentNode").addClass('lines');
        //console.log($("#county_"+d.id).node().parentNode);

        // $("#county_"+d.id).parent().find('.arc').each(function(){
          
        //   console.log($(this))})
        // console.log($("#county_"+d.id).parent().find('.arc'));
              var url = '../data/get/getSymChart.php';
              commodity = $("#commodity_select").val();
              mode = $("#mode_select").val();
              granularity = $("#granularity_select").val();
              orig_or_dest = $("#orig_or_dest").val();
              fips = d.id;
              $('#heading_commidity').html($("#commodity_select").find(":selected").text());
              $.ajax({url:url, type:'POST',data: { sctg:commodity,mode:mode,granularity:granularity,orig_or_dest:orig_or_dest,fips:fips },dataType:'json',async:true})
                .done(function(data) {
                  drawTable(data); })
                .fail(function(data) { console.log(data.responseText) });
        d3.select("h2 span").html(d.name);
        display = [];
        $.each(linksByOrigin[d.id],function(d,v){
          display.push([v.target,v.tons*1]);
        });
        display.sort(sortMultiDimensional);

        //console.log(display);
    });




  g.selectAll("path.arc")
    .data(function(d) { 
        if(typeof d.id != 'undefined'){
          
         //console.log(d.id,linksByOrigin[d.id])
          return linksByOrigin[d.id] || [];
        }
        else{ return [];} 
      })
    
    .enter().append("svg:path")
      .style("stroke-width", function(d){
        //console.log(linksByOrigin[d.source])
        var max = 0;
            for(var tons in linksByOrigin[d.source]){
            //console.log(linksByOrigin[d.source][source].tons)
            if (linksByOrigin[d.source][tons].tons > max){
              max = linksByOrigin[d.source][tons].tons

              //console.log(i,"spaaace", max)

            }
            return d.tons/(max/2)
          }            
        })

        
        
      .attr("class", "arc")
      .attr("d", function(d) { 
      path = d3.geo.path()
      .projection(null);
        return path(arc(d)); });

 divisor = 6;
 if(maxFlow/15  > divisor){
    divisor = maxFlow/15;
 }

  circles.selectAll("circle")
      .data(hubs)
    .enter().append("svg:circle")
      .attr("cx", function(d, i) { return positions[i][0]; })
      .attr("cy", function(d, i) { return positions[i][1]; })
      .attr("r", function(d, i) { if(orig_or_dest == 'orig_fips'){return Math.sqrt(countByOrig[d.id]/divisor) || 1; }else{ return Math.sqrt(countByDest[d.id]/7) || 1;} })
      .sort(function(a, b) { return countByOrig[b.id] - countByOrig[a.id]; });
      
    d3.select("input[type=checkbox]").on("change", function() {
     cells.classed("voronoi", this.checked);
    });


});






}

var url = '../data/get/getCountyOrigDestFlow.php';
  $.ajax({url:url, type:'POST',data: { sctg:'00',mode:"00",granularity:'3',orig_or_dest:'orig_fips' },dataType:'json',async:true})
    .done(function(data) { 
       $('#heading_commidity').html($("#commodity_select").find(":selected").text());
      symbol_graph("../data/MN_Counties.topojson",data,'orig_fips');  
    })
    .fail(function(data) { console.log(data.responseText) });


      
  
  
  
  function sortMultiDimensional(a,b)
  {
    // for instance, this will sort the array using the second element    
    return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
  }

</script>