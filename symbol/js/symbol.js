var symbol = {
	map : '../data/MN_Counties.topojson',
	counties : {},
    svg : {},
    g 	: {},
    states : {}, 
    circles : {},
    cells : {},
    arc: {},
    quantize: {},
    locationByCounty : {},
    width: 700,
    height : 740,
    positions : [],
    hubs : [],
	drawMap : function(flow_data,orig_or_dest){
		

		var projection = d3.geo.conicConformal()
		    .parallels([39 + 26 / 60, 41 + 42 / 60])
		    .rotate([93 + 45 / 60, -40 - 20 / 60])
		    .translate([symbol.width / 2, symbol.height / 2]);

		var path = d3.geo.path()
		    .projection(projection);

		symbol.svg = d3.select("body").append("svg:svg")
		    .attr("width", symbol.width)
		    .attr("height", symbol.height);

		symbol.states = symbol.svg.append("svg:g")
		    .attr("id", "states");

		symbol.circles = symbol.svg.append("svg:g")
		    .attr("id", "circles");

		symbol.cells = symbol.svg.append("svg:g")
		    .attr("id", "cells");

		d3.json(symbol.map, function(error, oh) {
		  symbol.counties = topojson.feature(oh, oh.objects.counties);

			projection
			      .scale(1)
			      .translate([0, 0]);

			var b = path.bounds(symbol.counties),
			    s = .95 / Math.max((b[1][0] - b[0][0]) / symbol.width, (b[1][1] - b[0][1]) / symbol.height),
			    t = [(symbol.width - s * (b[1][0] + b[0][0])) / 2, (symbol.height - s * (b[1][1] + b[0][1])) / 2];

			projection
			    .scale(s)
			    .translate(t);

			symbol.states.selectAll("path")
			    .data(symbol.counties.features)
			    .enter().append("svg:path")
			      	.attr("class", "county")
			      	.attr("d", path)
			    .append("title")
			      	.text(function(d) { d.name });

			symbol.svg.append("path")
			    .datum(topojson.mesh(oh, oh.objects.counties, function(a, b) { return a !== b; }))
			    .attr("class", "county-border")
			    .attr("d", path);

			symbol.arc = d3.geo.greatArc()
      			.source(function(d) { return symbol.locationByCounty[d.source]; })
			    .target(function(d) { return symbol.locationByCounty[d.target]; });

			symbol.svg.selectAll("path")
			    .each(function(d){
			    	latlong = getCentroid(d3.select(this));
			    	symbol.positions.push(latlong);
			      	hub = {};
			      	hub['id'] = d.id;
			      	if(typeof d.properties != 'undefined'){
			      	  	hub['name'] = d.properties.name;
			      	}
			      	hub['latitude'] = latlong[0];
			      	hub['longitude'] = latlong[1];
			      	symbol.locationByCounty[d.id] = latlong; 
			      	symbol.hubs.push(hub);
			    });
			    
			var linksByOrigin = {},
      		countByOrig = {},
      		countByDest = {};


		var maxFlow = 0;
	  	flow_data.forEach(function(flow) {
		    if(flow.tons > maxFlow){
		      maxFlow = flow.tons;
		    }
		    if(flow.tons > 3){
		        
		        var origin = flow.orig,
		        destination = flow.dest,
		        links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
		        links.push({source: origin, target: destination, tons:flow.tons});
		        countByOrig[origin] = (countByOrig[origin] || 0) + flow.tons*1;
		        countByDest[destination] = (countByDest[destination] || 0) + flow.tons*1;
		    }
  		});
  		symbol.quantize = d3.scale.sqrt()
				.domain([0,maxFlow])
				.range([0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]);

		

		//console.log(symbol.quantize.quantiles());

		//console.log('maxflow:'+maxFlow);
		var polygons = d3.geom.voronoi(symbol.positions);

		symbol.g = symbol.cells.selectAll("g")
		    .data(symbol.hubs)
		    .enter().append("svg:g").attr("class",function(d){return "county_" + d.id});

		symbol.g.append("svg:path")
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
	          	$.ajax({url:url, type:'POST',
	          		data: { sctg:commodity,mode:mode,granularity:granularity,orig_or_dest:orig_or_dest,fips:fips },
	          		dataType:'json',async:true, 
	          		beforeSend: function(){$('#data').html("Loading data for "+countName(fips));}
				})
		            .done(function(data) {
		                  drawTable(data); })
		                .fail(function(data) { console.log(data.responseText) });
		        d3.select("h2 span").html(d.name);
		        display = [];


		        $.each(linksByOrigin[d.id],function(d,v){
		          display.push([v.target,v.tons*1]);
		        });
		        display.sort(sortMultiDimensional);

		    });

			symbol.g.selectAll("path.arc")
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
			            linequantize = d3.scale.sqrt()
							.domain([0,max])
							.range([0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]);

			            if(isNaN(linequantize(d.tons))) {return 1;}
			            else{return linequantize(d.tons);}
			          }            
		        })
		      	.attr("class", "arc")
		      	.attr("d", function(d) { 
		      	
			      	path = d3.geo.path()
			      		.projection(null);
			        	return path(symbol.arc(d)); });

					 divisor = 6;
					 if(maxFlow/15  > divisor){
					    divisor = maxFlow/15;
		 		}
		 	symbol.circles.selectAll("circle")
		      .data(symbol.hubs)
		    .enter().append("svg:circle")
			    .attr("cx", function(d, i) { return symbol.positions[i][0]; })
			    .attr("cy", function(d, i) { return symbol.positions[i][1]; })
			    .attr("r", function(d, i) {
			    	
			    	//console.log(  symbol.quantize(countByDest[d.id]*1) ) ;
			    	if(isNaN(symbol.quantize(countByDest[d.id]*1))){ return 1;}
			    	else { return symbol.quantize(countByDest[d.id]*1)}
			      	// if(orig_or_dest == 'orig_fips'){

			      	// 	return Math.sqrt(countByOrig[d.id]/divisor) || 1; 
			      	// }
			      	// 	else{ 
			      	// 		return Math.sqrt(countByDest[d.id]/7) || 1;
			      	// } 
			    })
		      .sort(function(a, b) { return countByOrig[b.id] - countByOrig[a.id]; });
		      
		    d3.select("input[type=checkbox]").on("change", function() {
		     symbol.cells.classed("voronoi", this.checked);
		    });

		});
		

		
	},
	updateData : function(flow_data,orig_or_dest){

		var linksByOrigin = {},
      		countByOrig = {},
      		countByDest = {};


		var maxFlow = 0;
	  	flow_data.forEach(function(flow) {
		    if(flow.tons > maxFlow){
		      maxFlow = flow.tons;
		    }
		    if(flow.tons > 3){
		        
		        var origin = flow.orig,
		        destination = flow.dest,
		        links = linksByOrigin[origin] || (linksByOrigin[origin] = []);
		        links.push({source: origin, target: destination, tons:flow.tons});
		        countByOrig[origin] = (countByOrig[origin] || 0) + flow.tons*1;
		        countByDest[destination] = (countByDest[destination] || 0) + flow.tons*1;
		    }
  		});
  		symbol.quantize = d3.scale.sqrt()
				.domain([0,maxFlow])
				.range([0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]);

	  	symbol.circles.selectAll("circle")
	  		.transition().duration(2000)
	  		.attr("r", function(d, i) {
	  			
	  			if(isNaN(symbol.quantize(countByDest[d.id]*1))){ return 1;}
			   	else { return symbol.quantize(countByDest[d.id]*1)}

	  		})
		    .sort(function(a, b) { return countByOrig[b.id] - countByOrig[a.id]; });

		symbol.g.selectAll("path.arc")
			.transition().duration(500)
			.style("stroke-width", function(d){
			        //console.log(linksByOrigin[d.source])
			        var max = 0;
			            for(var tons in linksByOrigin[d.source]){
			            //console.log(linksByOrigin[d.source][source].tons)
			            if (linksByOrigin[d.source][tons].tons > max){
			              max = linksByOrigin[d.source][tons].tons

			              //console.log(i,"spaaace", max)

			            }
			            linequantize = d3.scale.sqrt()
							.domain([0,max])
							.range([0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30]);

			            if(isNaN(linequantize(d.tons))) {return 1;}
			            else{return linequantize(d.tons);
			          }            
		        })
	}
}