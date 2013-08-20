<?php
ini_set("memory_limit","1024M");
ini_set('max_execution_time', 300);
include_once('../../config/db.php'); 
include_once('../../geoPHP/geoPHP.inc');
$test = new db();
$inscon = $test->connect();

function wkt_to_json($wkt) {
  $geom = geoPHP::load($wkt,'wkt');
  return $geom->out('json');
}

$sql = "SELECT 
    fips, 
    AsText(shape) as shape 
from
    us_atlas.us_counties as a limit 0,600";

$rs = mysql_query($sql) or die($sql." ".mysql_error());

$output = array();
$output ['type'] = 'FeatureCollection';

while($row = mysql_fetch_array($rs)){

    $properties = array();
    $feature = array();
    $geometry = array();

    
	
    
    $properties['fips'] = $row['fips'];
    
    $feature['type'] = 'Feature';
    $feature['properties'] = $properties;
    $feature['geometry'] = json_decode(wkt_to_json($row['shape']));
  	$output['features'][]=$feature;

}
echo json_encode($output);


function curl_download($Url){
 
    // is cURL installed yet?
    if (!function_exists('curl_init')){
        die('Sorry cURL is not installed!');
    }
 
    // OK cool - then let's create a new cURL resource handle
     $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $Url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $output = curl_exec($ch);

    return $output;
}


?>
