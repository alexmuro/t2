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


  
  function sortMultiDimensional(a,b)
  {
    // for instance, this will sort the array using the second element    
    return ((a[1] < b[1]) ? -1 : ((a[1] > b[1]) ? 1 : 0));
  }
