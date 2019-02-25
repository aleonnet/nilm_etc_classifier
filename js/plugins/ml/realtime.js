//chart power-log data
var power_id = new Array();
//var power_date = new Array();
var power_time = new Array();
var power_watt = new Array();
var power_appliance = new Array();
var previous_start_time = 0;


function updateRealtime() {
    /////////////// Load power-log data
    $(document).ready(function() {
        jQuery.ajax({        
            type:"GET",        
            url:"sql/power-log.php",        
            dataType:"JSON",         
            success : function(data) {  
                  var i;
                  for(i=0; i< 300; i++) {
                      power_id[i] = parseInt(data[i].id);
                      //power_date[i] = data[i].Date;
                      power_time[i] = data[i].time;
                      power_watt[i] = parseFloat(data[i].watt);
                      power_appliance[i] = data[i].appliance; 
                  }

                  var date = new Date();
                  var dbSeconds = power_time[0].split(":")[2];
                  var curSeconds = date.getSeconds();
                  var resSeconds=0;
                  if (dbSeconds>curSeconds) {
                      resSeconds = curSeconds+60-dbSeconds;
                  } else {
                      resSeconds = curSeconds-dbSeconds;
                  }
                  $("#curTime").text("transaction time : " + resSeconds); //change current time
                  drawTable("#applTable"); 
                  drawDynamicChart();   
                  // console.log("1111111");    
            }        
        });
    });
    // console.log("powor-log data ready");   

    /////////////// to measure the time
    $(document).ready(function() {
        jQuery.ajax({        
            type:"GET",        
            url:"sql/time_measure.php",        
            dataType:"JSON",         
            success : function(data) {  
                  start_time = parseInt(data[0].time);
                  if (previous_start_time != start_time) {
                    var time = new Date();
                    console.log("refresh time: ", time.getTime()-start_time);
                    previous_start_time = start_time;
                  }
                  // console.log("2222222222222222");
            }        
        });
    });
}    