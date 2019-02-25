// Draw Table
function drawTable($target) {
    var appliances_initial = power_appliance[0].split(" "); 
    i=0;
    while(appliances_initial[i] == "") {
        i++;
        appliances_initial = power_appliance[i].split(" ");
    }
    var powerSum = 0;
    for (i=0; i<appliances_initial.length; i++) {
        powerSum = powerSum + appl_power_map[appliances_initial[i]];
    }

    $($target+" > tbody").remove(); // delete tbody and under all

    // fill the data
    var applTable = $($target);
    for (i=0; i<appliances_initial.length; i++) {
        if (appliances_initial[0] == "") 
            break;

        applTable
        .append($('<tbody>'))
        .append($('<tr class="success">')
            .append($('<td>').text(appl_id_map[appliances_initial[i]]))
            .append($('<td>').text(appl_name_map[appliances_initial[i]]))
            .append($('<td>').text(appl_power_map[appliances_initial[i]]))
            .append($('<td>').text((appl_power_map[appliances_initial[i]]/powerSum*100).toFixed(0)))
        );
    }       
}
// Flot Chart Dynamic Chart
function drawDynamicChart() {
    $(function() {         
        var container = $("#flot-moving-line-chart");

        var predata = new Array(300);

        for(var i = 0; i<300; i++)
        {
            predata[i] = power_watt[300-i-1]; 
        }
        
        function getPowerData() {
            //push predata to res, just use 180 element
            var res = [];
            for (var i = 0; i < 300; i++) {
                res.push([i, predata[i]]);
            }
            
            return res; 
        }

        series = [{
            data: getPowerData(),
            lines: {
                fill: true
            }
        }];

        //

        var plot = $.plot(container, series, {
            grid: {
                backgroundColor: "#292D36"
            },
            xaxis: {
                tickFormatter: function() {
                    return "";
                },
                color: '#ffffff'

            },
            yaxis: {
                min: 0,
                color: '#ffffff',
                font: {size: 15, color: '#ffffff'},
                axisLabel: 'Watt',
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                axisLabelPadding: 5,
                axisLabelColour: '#ffffff'
            }
        });
        series[0].data = getPowerData();
        plot.setData(series);            
        plot.draw();
    });
}


// Flot Pie Chart with Tooltips
function drawPieChart() {
	$(function() {
	    var plotObj = $.plot($("#flot-pie-chart"), pie_data, {
	        series: {
	            pie: {
	                show: true
	            }
	        },
	        grid: {
	            hoverable: true
	        },
	        
	        tooltip: true,
	        tooltipOpts: {
	            content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
	            shifts: {
	                x: 20,
	                y: 0
	            },
	            defaultTheme: true
	        },
	        legend: {
	            labelFormatter: function(label, series) {
	                return '<div style="color: #fff; font-size: 1.0em">'+label+': '+Math.round(series.percent)+'%'+'</div>';
	            }
	        }
	    });

        $("#total_power").text("어제 사용량 : " + (total_power/1000).toFixed(2) + "kW");
	});
}




function drawLineChart() {
    var options = {
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: {
            hoverable: true, //IMPORTANT! this is needed for tooltip to work
            backgroundColor: '#292D36'
        },
        xaxis: {
            color: '#ffffff',
            font: {size: 15, color: '#ffffff'},
            axisLabel: 'hour',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 5,
            axisLabelColour: '#ffffff'
        },
        yaxis: {
            color: '#ffffff',
            //tickSize: 100,
            font: {size: 15, color: '#ffffff'},
            axisLabel: 'Watt/h',
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
            axisLabelPadding: 5,
            axisLabelColour: '#ffffff'
        },
        tooltip: true,
        tooltipOpts: {
            content: "'%s' of %x.1 is %y.4",
            shifts: {
                x: -60,
                y: 25
            },
            defaultTheme: true
        },
        legend: {
            labelFormatter: function(label, series){
                return '<a href="#" style="color: #fff; font-size: 1.0em">'+label+'</a>';
            },
            position: "nw"
        }
    };
    console.log("plot data = ");
    console.dir(line_data);

    var plotObj = $.plot($("#flot-line-chart"), line_data, options);
    /*
    var plotObj = $.plot($("#flot-line-chart"),
        [{data: [[0, 0.5], [2, 0.6], [3, 0.7], [4, 0.4], [5, 0.55]], label:"test"}, {data: [[0, 0.6], [2, 0.7], [3, 0.3], [4, 0.2], [5, 0.7]], label:"test2"}]
        , options);
*/
}