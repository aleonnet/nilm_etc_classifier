<?php
$request_date	= $_REQUEST['request_date'];

$host		= "127.0.0.1"; 	// hostname 
$username	= "mlroot"; 		// username 
$password	= "12347890"; 		// password 
$db_name	= "power-log"; 		// database 

$con=mysql_connect($host, $username, $password)or die("cannot connect"); 
mysql_select_db($db_name)or die("cannot select DB");

/* Get Appliance List from DB */
$sql = "SELECT `initial`, `power` FROM `appliance-info`";
$result = mysql_query($sql);

$appliance_list	= array();
while($row = mysql_fetch_row($result))
{
	$appliance_list[] =$row;
	echo $appliacne_list[count($appliance_list)-1];	
}

$json = array();
/* GET Power Usage per appliance */
for ($day = 0; $day < 7; $day++)
{	
	$search_date = date("Y-m-d", strtotime($request_date."-".$day."days"));
	$j=0;		
	$sql = "SELECT HOUR(`time`) AS 'HOUR', AVG(`power`) AS 'POWER'".
		"FROM `ref-power-log` ".
		"WHERE `time` BETWEEN '00:00:00' AND '23:59:59' ". 
		"AND `date`='".$search_date."' ".
		"GROUP BY HOUR(`time`)";				 
	
	$result = mysql_query($sql);	
	if(mysql_num_rows($result))
	{
		while($row=mysql_fetch_row($result))
		{			
			$json[$day][$j]["hour"] = $row[0];
			$json[$day][$j]["watt"] = $row[1];
			$j++;
		}			
	}
}

mysql_close($db_name);
echo json_encode($json); 

?>
