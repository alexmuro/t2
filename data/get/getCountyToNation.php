<?php
	$commodity =$_POST['sctg'];
	$mode = $_POST['mode'];
	$fips = $_POST['fips'];
	$orig_or_dest = $_POST['orig_or_dest'];
	
	$opposite = 'dest_fips';

	if($orig_or_dest == 'orig_fips'){
		$opposite = 'dest_fips';
	}else{
		$opposite = 'orig_fips';
	}

	$comm_clause = '';
	if($commodity != '00')
	{
		$comm_clause = " and sctg2 = '$commodity' ";
	}

	$mode_clause = '';
	if($mode != '00')
	{
		$mode_clause = " and mode = '$mode' ";
	}


	include '../../config/db.php'; 
	$test = new db();

	$colors=array('#E41A1C','#FFFF33','#FF7F00','#999999','#984EA3','#377EB8','#4DAF4A','#F781BF');

	$inscon = $test->connect();
	$sql = "select $opposite,sum(all_tons) as all_tons from MN_$fips where $orig_or_dest = $fips $comm_clause $mode_clause group by $opposite order by all_tons desc ";
	
	$csv = array();
	
	$i = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){

		$csvrow['orig'] = $row[$opposite];
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
	
	$output = array();
	$output['flow'] = $flow;
	$output['map'] = $csv; 
	echo json_encode($output);
?>