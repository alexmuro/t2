var choropleth = {
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
		loader.push(choropleth.loadData);
		loader.push(choropleth.drawMap);
		loader.run();
	},

	loadData : function() {

		$.ajax({url:'../data/get/getCountyToNation.php', 
				type : 'POST',
				data:choropleth.settings,
				dataType:'json',
				async:false
		})
		.done(function(data) { 

			choropleth.data = data;

			var max = 0;
			var ton_domain = [];

			data.map.forEach(function(d) { 
				
				choropleth.rateById.set((d.orig)*1, +d.tons*1000);
				if( d.tons > max ) {
				
				  max = d.tons;
				
				}
					
				ton_domain.push(d.tons);

			})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			choropleth.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll]);

			choropleth.legend_domain =choropleth.quantize.quantiles();

			choropleth.threshold = d3.scale.threshold()
				.domain(choropleth.legend_domain)
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll])
		})
		.fail(function(data) { console.log(data.responseText) });
		
		loader.run();
	
	},

	drawMap : function() {

		var map = new L.Map("viz", {
			center: [37.8, -96.9],
			zoom: 4
		})
		.addLayer(new L.TileLayer("http://{s}.tile.cloudmade.com/117aaa97872a451db8e036485c9f464b/998/256/{z}/{x}/{y}.png"));

		queue()
			.defer(d3.json, "../data/us-counties.json")
			.await(ready);

			
		function ready(error, us) {
			
			choropleth.svg = d3.select(map.getPanes().overlayPane).append("svg"),
			choropleth.g = choropleth.svg.append("g").attr("class", "leaflet-zoom-hide counties");

			var bounds = [[-174.756436222, 17.467543002],[-66.949091003, 69.002433285]];
			path = d3.geo.path().projection(project);

	
			feature=choropleth.g.selectAll("path")
				.data(topojson.feature(us, us.objects.counties).features)
			.enter().append("path")
				.attr("class", function(d) { if(d.id == choropleth.settings.fips){ return 'selected';}else{ return 'county'} })
				.attr("d", path)
				.attr("fill",function(d){ if(!isNaN(choropleth.rateById.get(d.id))){return choropleth.threshold(choropleth.rateById.get(d.id));}else{return '#fff';} })
				.on("mouseover", function(d) { d3.select("#hover").html('County: '+countName(d.id)+'<br>Tons: '+(choropleth.rateById.get(d.id)/1000).toFixed(2)); });

			// svg.append("path")
			//   .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			//   .attr("class", "states")
			//   .attr("d", path);
			  
			map.on("viewreset", reset);
			reset();
			choropleth.setLegend();
			// Reposition the SVG to cover the features.
			function reset() {
				
				var bottomLeft = project(bounds[0]),
					topRight = project(bounds[1]);
					
				choropleth.svg.attr("width", topRight[0] - bottomLeft[0])
					.attr("height", bottomLeft[1] - topRight[1])
					.style("margin-left", bottomLeft[0] + "px")
					.style("margin-top", topRight[1] + "px");

				  choropleth.g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")");

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

		choropleth.data = data;

		var max = 0;
		var ton_domain = [];

		data.map.forEach(function(d) { 
			
			choropleth.rateById.set((d.orig)*1, +d.tons*1000);
			if( d.tons > max ) {
			
			  max = d.tons;
			
			}
				
			ton_domain.push(d.tons);

		})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			choropleth.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll]);
			

			choropleth.legend_domain = choropleth.quantize.quantiles();
			choropleth.threshold = d3.scale.threshold()
				.domain(choropleth.legend_domain)
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll])

			choropleth.setLegend();
		
	},
	updateMap : function() {


		choropleth.g.selectAll("path")
			.transition().duration(2000)
			.attr("class", function(d) { if(d.id == choropleth.settings.fips){ return 'selected';}else{ return 'county'} })
			.attr("fill",function(d){ if(!isNaN(choropleth.rateById.get(d.id))){return choropleth.threshold(choropleth.rateById.get(d.id));}else{return '#fff';} })
			//.on("mouseover", function(d) { d3.select("#hover").html('County: '+d.id+'<br>Tons: '+(choropleth.rateById.get(d.id)/1000).toFixed(2)); });
	},
	setLegend : function(){
		var legendText = '<hr><h3>Tons Traded</h3><ul id="tangle-legend">';
		var prev = 0;
		var numbers = ["zero","one","two","three","four","five","six","seven","eight","nine"];
		choropleth.threshold.domain().forEach(function(d,i){
			
			if(i == 0){
			
				legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll][i]+'"></rect></svg><span>&lt;= <span data-var="'+numbers[i]+'" class="TKAdjustableNumber" data-step="0.01" data-min=0 data-format="%.2f"></span> tons</span></li>'
			
			}
			else{
			
				legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll][i]+'"></rect></svg><span><span data-var="'+numbers[i-1]+'" class="TKAdjustableNumber" data-step="0.1" data-min=0 data-format="%.2f"></span> - <span data-var="'+numbers[i]+'" class="TKAdjustableNumber" data-step="0.01" data-min=0 data-format="%.2f"></span> tons</span></li>';
			
			}		
		})
		
		legendText += '<li><svg width="20" height="20"><rect width="300" height="100" fill="'+colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll][choropleth.threshold.domain().length]+'"></rect></svg><span>&gt; <span data-var="'+numbers[choropleth.threshold.domain().length-1]+'" class="TKAdjustableNumber" data-step="0.1" data-min=0 data-max=1000 data-format="%.2f"></span> tons</span></li>'
			
		legendText +="</ul>";
		$("#legend-output").html(legendText);
		choropleth.setUpTangle();
		loader.run();

	},
	updateLegend : function(){

		var max = 0;
		var ton_domain = [];

		choropleth.data.map.forEach(function(d) { 
			
			choropleth.rateById.set((d.orig)*1, +d.tons*1000);
			if( d.tons > max ) {
			
			  max = d.tons;
			
			}
				
			ton_domain.push(d.tons);

		})
			max = ton_domain[0];
			if(max < 100){max = 100;}

			choropleth.quantize = d3.scale.quantile()
				.domain([0,(max*3)])
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll]);

				choropleth.legend_domain = choropleth.quantize.quantiles();
			
			choropleth.threshold = d3.scale.threshold()
				.domain(choropleth.quantize.quantiles())
				.range(colorbrewer[choropleth.brewer[choropleth.brewer_index]][choropleth.ll])

		
			choropleth.setLegend();
	},
	setUpTangle: function  () {

    var element = document.getElementById("tangle-legend");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.legendDomain = choropleth.legend_domain;
            this.zero = (choropleth.legend_domain[0]/1000).toFixed(2)*1;
            this.one = (choropleth.legend_domain[1]/1000).toFixed(2)*1;
            this.two = (choropleth.legend_domain[2]/1000).toFixed(2)*1;
            this.three = (choropleth.legend_domain[3]/1000).toFixed(2)*1;
            this.four = (choropleth.legend_domain[4]/1000).toFixed(2)*1;
            this.five = (choropleth.legend_domain[5]/1000).toFixed(2)*1;
            this.six = (choropleth.legend_domain[6]/1000).toFixed(2)*1;
            this.seven = (choropleth.legend_domain[7]/1000).toFixed(2)*1;
            this.eight = (choropleth.legend_domain[8]/1000).toFixed(2)*1;
            this.nine = (choropleth.legend_domain[9]/1000).toFixed(2)*1;
            

        },
        update: function () {
            //
            var inputs = [this.zero,this.one,this.two,this.three,this.four,this.five,this.six,this.seven,this.eight,this.nine];
            var new_domain = [];
            inputs.forEach(function(d){

                if(!isNaN(d)){
                    new_domain.push(d*1000);
                }
            });
           
            choropleth.threshold.domain(new_domain);
            choropleth.updateMap();
        }
    });
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
// Helper Functions
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------
function drawFlowTable(data){
	
	    $('#county_data').html('<h3>'+$("#county_select").find(":selected").text()+' Totals by Mode </h3>');
	    $('#county_data').append('<strong>Export Flows</strong><br>');
	    $('#county_data').append('All Modes : '+number_format((1*data['orig_fips']['total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Truck : '+number_format((1*data['orig_fips']['truck_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Rail : '+number_format((1*data['orig_fips']['rail_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Water : '+number_format((1*data['orig_fips']['water_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Pipeline : '+number_format((1*data['orig_fips']['pipeline_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Other/Unkown : '+number_format((1*data['orig_fips']['other_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('<br>');
	    $('#county_data').append('<strong>Import Flows</strong><br>');
	    $('#county_data').append('All Modes : '+number_format((1*data['dest_fips']['total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Truck : '+number_format((1*data['dest_fips']['truck_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Rail : '+number_format((1*data['dest_fips']['rail_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Water : '+number_format((1*data['dest_fips']['water_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Pipeline : '+number_format((1*data['dest_fips']['pipeline_total']).toFixed(2))+' tons<br>');
	    $('#county_data').append('Other/Unkown : '+number_format((1*data['dest_fips']['other_total']).toFixed(2))+' tons<br>');    
  	
  	}

	function drawTable(data){
    
    	var tbl_body= "<table id='dynTable'><thead><tr><th>Rank</th><th>Fips</th><th>County</th><th>Tons</th></tr></thead><tbody>";
     
        $.each(data,function(d,v){
            if(d < 100){
            	tbl_body += "<tr><td>"+(d*1+1)+"</td><td>"+v.orig+"</td><td>"+countName(v.orig)+"</td><td> "+(v.tons*1).toFixed(2)+"</td></tr>";
            }
        });
     
        tbl_body += "</tbody></table><br><br>";
        $("#data").html(tbl_body);

        var $table = $('#dynTable');
        $table.dataTable({
	       	"bPaginate": true,
	       	"numSorting": [[ 0, "asc" ]],
	       	"aoColumns": [null,null,null,null],
	       	"sDom": 'T<"clear">lfrtip',
	       	"oTableTools": {
	            "sSwfPath": "../resources/swf/copy_csv_xls_pdf.swf"
	        }
	        
    	});

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

	/*
   Utility function: populates the <FORM> with the SVG data
   and the requested output format, and submits the form.
*/
function submit_download_form(output_format)
{
	console.log('submitted');
	// Get the d3js SVG element
	var tmp = $(".leaflet-overlay-pane");
	var svg = $(".leaflet-overlay-pane svg");
	// Extract the data as SVG text string
	var svg_xml = (new XMLSerializer).serializeToString(svg);

	// Submit the <FORM> to the server.
	// The result will be an attachment file to download.
	var form = document.getElementById("svgform");
	form['output_format'].value = output_format;
	form['data'].value = svg_xml ;
	form.submit();
}
	

