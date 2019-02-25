<?php
	$host 		="localhost"; 		// hostname 
	$username	="mlroot"; 				// username 
	$password	="12347890"; 			// password 
	$db_name	="power-log"; 			// database 

	$conn=mysqli_connect($host, $username, $password, $db_name) or die("Error " . mysqli_error($conn));
	if (mysqli_connect_errno()) {
		echo "fail" . mysqli_connect_error();
	} 
	//$sql = "SELECT * FROM `power-log` ORDER BY `id` DESC"; 
	$sql = "SELECT * FROM `time_measure` ORDER BY `id` DESC LIMIT 1"; 
	//$sql="SELECT * FROM `power-log` ORDER BY 'id' desc";
	$result = mysqli_query($conn, $sql);
	$outp = "[";
	while($row = mysqli_fetch_array($result)) 
	{
		if ($outp != "[") {$outp .= ",";}
		$outp .= '{"id":"'  . $row["id"] . '",';
		$outp .= '"time":"'    . $row["time"]  . '"}';
	}
	$outp .="]";
	mysqli_close($conn);
	echo($outp);
?>