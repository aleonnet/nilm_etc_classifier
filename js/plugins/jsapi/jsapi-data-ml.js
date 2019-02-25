function drawStackedBarGraph() {
	google.load("visualization", "1", {packages:["corechart"]});
	google.setOnLoadCallback(loadStackedBarData);
	//line below in english
	//['요일', 'Cooker', 'Toaster', 'Microwave', 'Refrigerator', 'Dish Washer', 'washing machine', 'Rice Cooker', 'kettle', 'monitor', 'pc', { role: 'annotation' } ],
	function loadStackedBarData() {
	    console.log("loadStackedBarData");
	    $(document).ready(function() {
	        jQuery.ajax({        
	            type:"GET",        
	            url:"sql/data_stacked_histogram_chart.php?request_date="+realtime,        
	            dataType:"JSON",         
	            success : function(data) {  
	                var rows = Array();
	                rows[0] = Array();
	                var i;

	                rows[0][0] = "kind";
	                for(i=0; i<data[0].length; i++) {
	                	rows[0][i+1] = appl_name_map[data[0][i].initial];
	                }

	                for(i=0; i<data.length; i++) {
	                    var j;
	                    var appliance=data[i];
	                    rows[i+1] = Array();
	                    rows[i+1][0] = days[i];

	                    for (j=0; j<appliance.length; j++) {
	                        rows[i+1][j+1] = Math.ceil(appliance[j].watt);
	                    }
	                }

	                stacked_bar_data = rows; 
	                drawChart();   
	            }        
	        });
	    });
	}

	function drawChart() {
		var data = google.visualization.arrayToDataTable(stacked_bar_data);
		console.log("bar data = " + stacked_bar_data);

	  var options = {
	      hAxis: {
	      	title:'Watt',
	      	titleTextStyle: {color: '#ffffff'},
	        textStyle: {
	            color: '#ffffff'
	        }
	      },
	      vAxis: {
	        textStyle: {
	            color: '#ffffff'                
	        }
	      },
	      legend: { position: 'top', maxLines: 3 },
	      bar: { groupWidth: '75%' },
	      isStacked: true,
	      backgroundColor: '#363A43',
	      legend: {
	          textStyle: {
	              color: '#ffffff'
	          },
	          position: 'bottom',
	          alignment: 'center'
	      }
	  };

	    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
	    chart.draw(data, options);
	}
}
