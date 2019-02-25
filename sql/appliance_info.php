<?php
	$host 		="localhost"; 		// hostname 
	$username	="mlroot"; 			// username 
	$password	="12347890"; 		// password 
	$db_name	="power-log"; 		// database 

	$conn=mysqli_connect($host, $username, $password, $db_name) or die("Error " . mysqli_error($conn));
	if (mysqli_connect_errno()) {
		echo "fail" . mysqli_connect_error();
	} 
	$sql="SELECT * FROM `appliance-info`";
	$result = mysqli_query($conn, $sql);
	$outp = "[";
	while($row = mysqli_fetch_array($result)) 
	{
		if ($outp != "[") {$outp .= ",";}
		$outp .= '{"id":"'  . $row["id"] . '",';
		$outp .= '"initial":"'    . $row["initial"]  . '",';
		$outp .= '"name":"'    . $row["name"]  . '",';
		$outp .= '"state":"'   . $row["state"] . '",';
		$outp .= '"power":"'  . $row["power"] . '"}';
	}
	$outp .="]";
	mysqli_close($conn);
	echo($outp);
?>