<?php
	error_reporting(E_ALL ^ E_NOTICE);
	$commodity =$_POST['sctg'];
	$mode = $_POST['mode'];
	$granularity = $_POST['granularity'];
	$granularity = $granularity/100;
	$orig_or_dest = $_POST['orig_or_dest'];
	$opposite = '';

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
	$sql = "SELECT distinct $orig_or_dest, sum(all_tons) as all_tons FROM MN_Flows where
    orig_state = '27' and dest_state = '27' $comm_clause $mode_clause group by $orig_or_dest";
	
	$csv = array();
	$matrix = array();
	
	$total = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){
		$total = ($total + $row['all_tons'])*1;
	}

	$i = 0;
	$rs=mysql_query($sql) or die($sql." ".mysql_error());
	while($row = mysql_fetch_assoc( $rs )){

		$csvrow['name'] = $row[$orig_or_dest];
		$csvrow['sum'] = $row['all_tons']*1;
		$index = number_format ( $i/12 );
		$csvrow['color'] = $colors[$index];
		$csv[] = $csvrow;
		$i++;

		 $sub_sql = "SELECT sum(all_tons) as all_tons FROM MN_Flows WHERE $orig_or_dest = '".$row[$orig_or_dest]."' and dest_state = '27' and sctg2 = '".$commodity."' group by $opposite";
		
		 $sub_rs = mysql_query($sub_sql) or die($sub_sql." ".mysql_error());
		 $matrix_row = array();
		while($sub_row = mysql_fetch_assoc( $sub_rs )){

		 	$trade = ($sub_row['all_tons'] / $total) * 100;

		 	if($trade > $granularity){
		 		$matrix_row[] = $trade*1;
		 	}else{
		 		$matrix_row[] = 0;
		 	}
		 }
		$matrix[] = $matrix_row;
	}
	$data['matrix'] = $matrix;
	$data['csv'] = $csv;
	echo json_encode($data);
?>