var tredis = {
	county_data : {},
	quantize : {},
	threshold : {}, 
	rateById:d3.map(),
	settings : {sctg : '00' , mode : "00" , orig_or_dest : 'dest_fips' , fips : 27137},
	svg:{},
	g:{},
	ll:5,
	legend_domain:[],
	brewer:['YlGn','YlGnBu','GnBu','BuGn','PuBuGn','PuBu','BuPu','RdPu','PuRd','OrRd','YlOrRd','YlOrBr','Purples','Blues','Greens','Oranges','Reds','Greys','PuOr','BrBG','PRGn','PiYG','RdBu','RdGy','RdYlBu','Spectral','RdYlGn','Accent','Dark2','Paired','Pastel1','Pastel2','Set1','Set2','Set3'],
	brewer_index:1,
	init : function() {
		
		toggles.init();
		
		loader.push(tredis.loadData);
		loader.push(tredis.drawMap);
		loader.run();
	},

	loadData : function() {

		$.ajax({url:'../data/get/getCountyToNation.php', 
				type : 'POST',
				data:tredis.settings,
				dataType:'json',
				async:false
		})
		.done(function(data) { 

			tredis.data = data;

			var max = 0;
			var ton_domain = [];

			data.map.forEach(function(d) { 
				
				tredis.rateById.set((d.orig)*1, +d.tons*1000);
				if( d.tons > max ) {
				
				  max = d.tons;
				
				}
					
				ton_domain.push(d.tons);

			})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			tredis.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll]);

			tredis.legend_domain =tredis.quantize.quantiles();

			tredis.threshold = d3.scale.threshold()
				.domain(tredis.legend_domain)
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll])
		})
		.fail(function(data) { console.log(data.responseText) });
		
		loader.run();
	
	},

	drawMap : function() {

		var map = new L.Map("viz", {
			center: [37.8, -96.9],
			zoom: 4
		})
		//.addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/998/256/{z}/{x}/{y}.png"));

		queue()
			.defer(d3.json, "../data/us-counties.json")
			.await(ready);

			
		function ready(error, us) {
			
			tredis.svg = d3.select(map.getPanes().overlayPane).append("svg"),
			tredis.g = tredis.svg.append("g").attr("class", "leaflet-zoom-hide counties");

			var bounds = [[-174.756436222, 17.467543002],[-66.949091003, 69.002433285]];
			path = d3.geo.path().projection(project);

	
			feature=tredis.g.selectAll("path")
				.data(topojson.feature(us, us.objects.counties).features)
			.enter().append("path")
				.attr("class", function(d) { if(d.id == tredis.settings.fips){ return 'selected';}else{ return 'county'} })
				.attr("d", path)
				.attr("fill",function(d){ if(!isNaN(tredis.rateById.get(d.id))){return tredis.threshold(tredis.rateById.get(d.id));}else{return '#fff';} })
				.on("mouseover", function(d) { d3.select("#hover").html('County: '+countName(d.id)+'<br>Tons: '+(tredis.rateById.get(d.id)/1000).toFixed(2)); });

			// svg.append("path")
			//   .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			//   .attr("class", "states")
			//   .attr("d", path);
			  
			map.on("viewreset", reset);
			reset();
			tredis.setLegend();
			// Reposition the SVG to cover the features.
			function reset() {
				
				var bottomLeft = project(bounds[0]),
					topRight = project(bounds[1]);
					
				tredis.svg.attr("width", topRight[0] - bottomLeft[0])
					.attr("height", bottomLeft[1] - topRight[1])
					.style("margin-left", bottomLeft[0] + "px")
					.style("margin-top", topRight[1] + "px");

				  tredis.g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

				  feature.attr("d", path);

			}

			function project(x) {
				
				var point = map.latLngToLayerPoint(new L.LatLng(x[1], x[0]));
				return [point.x, point.y];
			}
		}
		
		
		loader.run();
	},
	updateData : function(data) {

		tredis.data = data;

		var max = 0;
		var ton_domain = [];

		data.map.forEach(function(d) { 
			
			tredis.rateById.set((d.orig)*1, +d.tons*1000);
			if( d.tons > max ) {
			
			  max = d.tons;
			
			}
				
			ton_domain.push(d.tons);

		})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			tredis.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll]);
			

			tredis.legend_domain = tredis.quantize.quantiles();
			tredis.threshold = d3.scale.threshold()
				.domain(tredis.legend_domain)
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll])

			tredis.setLegend();
		
	},
	updateMap : function() {


		tredis.g.selectAll("path")
			.transition().duration(2000)
			.attr("class", function(d) { if(d.id == tredis.settings.fips){ return 'selected';}else{ return 'county'} })
			.attr("fill",function(d){ if(!isNaN(tredis.rateById.get(d.id))){return tredis.threshold(tredis.rateById.get(d.id));}else{return '#fff';} })
			//.on("mouseover", function(d) { d3.select("#hover").html('County: '+d.id+'<br>Tons: '+(tredis.rateById.get(d.id)/1000).toFixed(2)); });
	},
	setLegend : function(){
		var legendText = '<hr><h3>Tons Traded</h3><ul id="tangle-legend">';
		var prev = 0;
		var numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"];
		tredis.threshold.domain().forEach(function(d,i){
			
			if(i == 0){
			
				legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll][i]+'"></rect></svg><span>&lt;= <span data-var="'+numbers[i]+'" class="TKAdjustableNumber" data-step="0.01" data-min=0 data-format="%.2f"></span> tons</span></li>'
			
			}
			else{
			
				legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll][i]+'"></rect></svg><span><span data-var="'+numbers[i-1]+'" class="TKAdjustableNumber" data-step="0.1" data-min=0 data-format="%.2f"></span> - <span data-var="'+numbers[i]+'" class="TKAdjustableNumber" data-step="0.01" data-min=0 data-format="%.2f"></span> tons</span></li>';
			
			}		
		})
		
		legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll][tredis.threshold.domain().length]+'"></rect></svg><span>&gt; <span data-var="'+numbers[tredis.threshold.domain().length-1]+'" class="TKAdjustableNumber" data-step="0.1" data-min=0 data-max=1000 data-format="%.2f"></span> tons</span></li>'
			
		legendText +="</ul>";
		$("#legend-output").html(legendText);
		setUpTangle();
		loader.run();

	},
	updateLegend : function(){

		var max = 0;
		var ton_domain = [];

		tredis.data.map.forEach(function(d) { 
			
			tredis.rateById.set((d.orig)*1, +d.tons*1000);
			if( d.tons > max ) {
			
			  max = d.tons;
			
			}
				
			ton_domain.push(d.tons);

		})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			tredis.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll]);

				tredis.legend_domain = tredis.quantize.quantiles();
			
			tredis.threshold = d3.scale.threshold()
				.domain(tredis.quantize.quantiles())
				.range(colorbrewer[tredis.brewer[tredis.brewer_index]][tredis.ll])

		
			tredis.setLegend();
	}
}
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var toggles = {

	init : function() {

		$("#legend h2 a").on("click", function() {
			$(this).toggleClass("closed");
			$("#legend-detail").slideToggle(300);
			return false;
		});

	}

};
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
var loader = { 
	queue: [],
	push: function(fn, scope, params) { 
		this.queue.push(function(){ fn.apply(scope||window, params||[]); }); 
	},
	run: function() { 
		if (this.queue.length) this.queue.shift().call(); 
	}
};
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
$(window).resize(function() {
	$("#viz svg").width($(window).width());
	$("#viz svg").height($(window).height());
});