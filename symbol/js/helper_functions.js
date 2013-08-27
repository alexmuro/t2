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


function drawTable(data){
    
    var table = '<h3>Top Trade Destinations<br> by Mode &amp; Commodity</h3>';
    table  = "<table id='dynTable'><thead><tr><td>Rank</td><td>County</td><td>Tons</td></tr></thead><tbody>";
    $.each(data,function(d,v){
         if(d <100){
            table += "<tr><td>"+(d*1+1)+"&nbsp;&nbsp;</td><td>"+countName(v.orig*1)+"&nbsp;&nbsp;</td><td> "+(v.tons*1).toFixed(2)+"</td></tr>";
        }
    });
    table += "</tbody></table>";
    $('#data').html(table);
     var $table = $('#dynTable');
        $table.dataTable({
          "bPaginate": true,
          "numSorting": [[ 0, "asc" ]],
          "aoColumns": [null,null,null],
          "sDom": 'T<"clear">lfrtip',
          "oTableTools": {
              "sSwfPath": "../resources/swf/copy_csv_xls_pdf.swf"
          }
          
      });
}

  
  function sortMultiDimensional(a,b)
  {
    // for instance, this will sort the array using the second element    
    return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
  }
