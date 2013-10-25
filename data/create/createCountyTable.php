<?php
error_reporting(E_ALL ^ E_DEPRECATED);
include '../config/db.php'; 
$test = new db();

$inscon = $test->connect();

$sql = "select distinct dms_orig_fips from tbl_maine_domestic_db_3 where dms_orig_fips like '55___' ";
$rs = mysql_query($sql) or die($sql." ".mysql_error());

while($row = mysql_fetch_array($rs)){
	$state_fips = substr($row['dms_orig_fips'],0,2);
	$county_fips = substr($row['dms_orig_fips'],2,3);
	$fips = $row['dms_orig_fips'];
	echo $state_fips."_".$fips."<br>";


	$sql = "CREATE TABLE `".$state_fips.$county_fips."` (
	  `dms_orig` varchar(45) DEFAULT NULL,
	  `dms_orig_fips` varchar(45) DEFAULT NULL,
	  `dms_dest` varchar(45) DEFAULT NULL,
	  `dms_dest_fips` varchar(45) DEFAULT NULL,
	   `dms_mode` varchar(45) DEFAULT NULL,
	  `sctg2` varchar(45) DEFAULT NULL,
	  `value_2010` float DEFAULT NULL,
	  `curval_2010` float DEFAULT NULL,
	  `tons_2010` float DEFAULT NULL,
	  KEY `orig` (`dms_orig_fips`),
	  KEY `dest` (`dms_dest_fips`),
	  KEY `orig-dest` (`dms_dest_fips`,`dms_orig_fips`),
	  KEY `mode` (`dms_mode`),
	  KEY `scgt` (`sctg2`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8";
	mysql_query($sql) or die($sql." ".mysql_error());
	$sql ="insert into `".$state_fips.$county_fips."` select * from tbl_maine_domestic_db_3 where dms_orig_fips = $fips or dms_dest_fips = $fips";
	mysql_query($sql) or die($sql." ".mysql_error());
	echo json_encode("table ".$state_fips.$fips." created.");
}

	
echo json_encode("Finished");
?>