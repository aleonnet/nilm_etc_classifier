<?php

$request_date				= $_REQUEST['request_date'];

$host		="127.0.0.1"; 	// hostname 
$username	="mlroot"; 		// username 
$password	="12347890"; 		// password 
$db_name	="power-log"; 		// database 

$con=mysql_connect("$host", "$username", "$password")or die("cannot connect"); 
mysql_select_db("$db_name")or die("cannot select DB");

$sql = "SELECT `initial`, `power` FROM `appliance-info`";
$result = mysql_query($sql);

$appliance_list	= array();
while($row = mysql_fetch_row($result))
{
	$appliance_list[] =$row;
	echo $appliacne_list[count($appliance_list)-1];	
}

$json = array();

$i=0;
foreach ($appliance_list as $appliance)
{
	$sql = "SELECT COUNT(*) FROM `ref-power-log` WHERE `appliance` LIKE '%".$appliance[0]."%' AND `date`=\""
	.$request_date."\""; 
	
	$result = mysql_query($sql);
	
	if(mysql_num_rows($result))
	{		
		while($row=mysql_fetch_row($result))
		{				
			$json[$i]["initial"] = $appliance[0];
			$json[$i]["watt"] =(float)$row[0]*(float)$appliance[1]/60.0;	
			$i++;	
			/*
			$json[$appliance[0]]=(float)$row[0]*(float)$appliance[1]/60.0;
			echo " appliance[0] = ".$appliance[0];
			echo " appliance[1] = ".$appliance[1]."</br>";
			*/
		}
	}
	
}
mysql_close($db_name);
echo json_encode($json); 
// please refer to our PHP JSON encode function tutorial for learning json_encode function in detail 
?>
