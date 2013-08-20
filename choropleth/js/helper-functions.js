
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
    
    	$('#data').html('<h3>Top Trade Destinations<br> by Mode &amp; Commodity</h3>');
        $('#data').append("<table><thead><tr><td>Rank</td><td>County</td><td>Tons</td></tr></thead>");
     
        $.each(data,function(d,v){
            if(d <20){
          
            	$('#data').append("<tr><td>"+(d*1+1)+"&nbsp;&nbsp;</td><td>"+countName(v.orig)+"&nbsp;&nbsp;</td><td> "+(v.tons*1).toFixed(2)+"</td></tr>");
          
            }
        });
     
        $('#data').append("</table>");
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