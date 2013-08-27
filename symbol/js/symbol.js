var symbol = {
	map : 'MN_Counties.topojson',
	counties : {},
	linksByOrigin : {},
    countByOrig : {},
    countByDest : {},
    locationByCounty : {},
    svg : {},
    states : {}, 
    circles : {},
    cells : {},
	drawmap : function(){
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

		symbol.svg = d3.select("body").append("svg:svg")
		    .attr("width", width)
		    .attr("height", height);

		symbol.states = svg.append("svg:g")
		    .attr("id", "states");

		symbol.circles = svg.append("svg:g")
		    .attr("id", "circles");

		symbol.cells = svg.append("svg:g")
		    .attr("id", "cells");

		d3.json(symbol.map, function(error, oh) {
		  symbol.counties = topojson.feature(oh, oh.objects.counties);

			projection
			      .scale(1)
			      .translate([0, 0]);

			var b = path.bounds(symbol.counties),
			    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

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

		}
	},
	drawData : function(flow_data){

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


	}
}