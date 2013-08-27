
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
	
