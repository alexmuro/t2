<?php
$county_fips = $_POST['county_fips'];
$state_fips = $_POST['state_fips']; 

include '../config/db.php'; 
$test = new db();

$inscon = $test->connect();
$sql = "CREATE TABLE `MN_$fips` (
`mode` varchar(45) DEFAULT NULL,
`orig_fips` varchar(45) DEFAULT NULL,
`dest_fips` varchar(45) DEFAULT NULL,
`sctg2` varchar(45) DEFAULT NULL,
`all_tons` float DEFAULT NULL,
`orig_state` varchar(45) DEFAULT NULL,
`orig_county` varchar(45) DEFAULT NULL,
`dest_state` varchar(45) DEFAULT NULL,
`dest_county` varchar(45) DEFAULT NULL,
KEY `orig` (`orig_fips`),
KEY `dest` (`dest_fips`),
KEY `orig-state` (`orig_state`),
KEY `dest-state` (`dest_state`),
KEY `mode` (`mode`),
KEY `scgt` (`sctg2`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1";
mysql_query($sql) or die($sql." ".mysql_error());
$sql ="insert into `".$state_fips."_".$fips."` select * from MN_All_Flows where orig_fips = $fips or dest_fips = $fips";
mysql_query($sql) or die($sql." ".mysql_error());
	
echo json_encode("table ".$state_fips."_".$fips." created.");
?>