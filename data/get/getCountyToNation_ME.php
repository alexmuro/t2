<?php
	header('Access-Control-Allow-Origin: *'); 
	error_reporting(E_ALL ^ E_DEPRECATED);
	$commodity =$_POST['sctg'];
	$mode = $_POST['mode'];
	$fips = $_POST['fips'];
	$orig_or_dest = $_POST['orig_or_dest'];
	$orig_or_dest = "dms_".$orig_or_dest;
	
	$opposite = 'dms_dest_fips';

	if($orig_or_dest == 'dms_orig_fips'){
		$opposite = 'dms_dest_fips';
	}else{
		$opposite = 'dms_orig_fips';
	}

	$comm_clause = '';
	if($commodity != '00')
	{
		$comm_clause = " and sctg2 = '$commodity' ";
	}

	$mode_clause = '';
	if($mode != '00')
	{
		$mode_clause = " and dms_mode = '$mode' ";
	}

	include '../config/db.php'; 
	$test = new db();
	$inscon = $test->connect();
	$output = array();
	$sql = "select $opposite,sum(tons_2010) as all_tons from `$fips` where $orig_or_dest = '$fips' $comm_clause $mode_clause group by $opposite order by all_tons desc ";
	//$output['sql'] = $sql;
	$csv = array();
	$i = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){

		$orig = $row[$opposite];
		if(strlen($row[$opposite]) == 4){
			//$output['strlen'] 
			$orig = '0'.$row[$opposite];
		}
		$csvrow['orig'] = $orig;
		$csvrow['tons'] = $row['all_tons'];
		$csv[] = $csvrow;

	}
	$flow = array();
	$sql = "select * from counties_orig_fips where orig_fips = $fips";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$row = mysql_fetch_assoc( $rs );
	$flow['orig_fips'] = $row;
	$sql = "select * from counties_dest_fips where orig_fips = $fips";
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	$row = mysql_fetch_assoc( $rs );
	$flow['dest_fips'] = $row;
	
	$output['flow'] = $flow;
	$output['map'] = $csv; 
	echo json_encode($output);
?>