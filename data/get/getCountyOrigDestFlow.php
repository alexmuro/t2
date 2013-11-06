<?php
	header('Access-Control-Allow-Origin: *'); 

	$commodity =$_POST['sctg'];
	$mode = $_POST['mode'];
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

	$inscon = $test->connect();
	$sql = "SELECT distinct orig_fips,dest_fips, sum(all_tons) as all_tons FROM MN_Flows where orig_state = '27' and dest_state = '27' $comm_clause $mode_clause group by $opposite,$orig_or_dest order by all_tons desc";
	//echo $sql;
	$csv = array();
	
	$i = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){

		$csvrow['orig'] = $row['orig_fips'];
		$csvrow['dest'] = $row['dest_fips'];
		$csvrow['tons'] = $row['all_tons'];
		$csv[] = $csvrow;

	}

	echo json_encode($csv);
?>