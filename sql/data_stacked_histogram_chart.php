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
	foreach ($appliance_list as $appliance)
	{	
		$sql = "SELECT COUNT(*) ".
			"FROM `ref-power-log` ".
			"WHERE `appliance` LIKE '%".$appliance[0]."%' ". 
			"AND `date`='".$search_date."' ";				 
		
		$result = mysql_query($sql);	
		if(mysql_num_rows($result))
		{			
			while($row=mysql_fetch_row($result))
			{			
				$json[$day][$j]["initial"] = $appliance[0];
				$json[$day][$j]["watt"] = (float)$row[0]*(float)$appliance[1]/60.0;
				$j++;
			}
		}
	}
}

mysql_close($db_name);
echo json_encode($json); 

?>
