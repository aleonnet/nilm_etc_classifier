var realtime_date = new Date();
var realtime_year = realtime_date.getFullYear();
var realtime_month = realtime_date.getMonth();
var realtime_day = realtime_date.getDay();
var realtime = realtime_year + "-" + realtime_month + "-" + realtime_day;

//table data
var appl_id_map = {};
var appl_name_map = {};
var appl_state_map = {};
var appl_power_map = {};

// Chart Variables
var pie_data = Array();
var total_power = 0;
var line_data = Array();
var stacked_bar_data;
var chart_colors = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#66AA00", "#B82E2E", "#DD4477", "#990099", "#CA5651"];
var days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];

realtime = "2013-8-01";
// Load pie chart data

////////////// load appl data
$(document).ready(function() {
    jQuery.ajax({        
        type:"GET",        
        url:"sql/appliance_info.php",        
        dataType:"JSON",   
        success : function(data) {   
              var i;
              for(i = 0; i < data.length; i++) {
                  var initial = data[i].initial;
                  appl_id_map[initial] = data[i].id;
                  appl_name_map[initial] = data[i].name;
                  appl_state_map[initial] = data[i].state;
                  appl_power_map[initial] = parseFloat(data[i].power);       
              }
        }        
    });
});

///////////// Load Pie Chart data
$(document).ready(function() {
    jQuery.ajax({        
        type:"GET",        
        url:"sql/data_pie_chart.php?request_date="+realtime,        
        dataType:"JSON",         
        success : function(data) {  
            var i;
            for(i=0; i<data.length; i++) {
                var row = {label: appl_name_map[data[i].initial], color: chart_colors[i], data: data[i].watt };
                total_power += data[i].watt;
                pie_data.push(row);
            }

            drawPieChart();     
        }        
    });
});

///////////// Load Line Chart data
$(document).ready(function() {
    jQuery.ajax({        
        type:"GET",        
        url:"sql/data_line_chart.php?request_date="+realtime,        
        dataType:"JSON",         
        success : function(data) {  
            var i, j;
            for(i=0; i<data.length; i++) {
                line_data[i] = new Array();
                var row = [];
                for(j=0; j<data[i].length; j++) {
                    row[j] = [parseInt(data[i][j].hour), parseFloat(data[i][j].watt)];                  
                }
                console.log("row data = " + row);
                line_data[i] = {data: row, label: days[i], color: chart_colors[i]};
                //line_data = {data: row, label: days[i]};
            }

            console.log("line data = ");
            console.dir(line_data);
            

            drawLineChart();     
        }        
    });
});

////////// Load stacked bar chart data
drawStackedBarGraph();