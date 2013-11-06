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

	include '../config/db.php'; 
	$test = new db();

	$colors=array('#E41A1C','#FFFF33','#FF7F00','#999999','#984EA3','#377EB8','#4DAF4A','#F781BF');

	$inscon = $test->connect();
	$sql = "SELECT $orig_or_dest,sum(all_tons) as all_tons FROM MN_Flows where orig_state = '27' and dest_state = '27' and $opposite = $fips $comm_clause $mode_clause group by $orig_or_dest order by all_tons desc ";
	
	$csv = array();
	
	$i = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){

		$csvrow['fips'] = $row[$orig_or_dest];
		$csvrow['tons'] = $row['all_tons'];
		$csv[] = $csvrow;

	}

	echo json_encode($csv);
?>