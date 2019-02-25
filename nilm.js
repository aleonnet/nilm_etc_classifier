function printError(err){
    return console.log(err);
}

function data_transfer(table){

    var http = require('http');
    
    var url = require('url'); // 1. 요청한 url을 객체로 만들기 위해 url 모듈사용
    
    var querystring = require('querystring'); // 2. 요청한 url 중에 Query String 을 객체로 만들기 위해 querystring 모듈 사용
    
    var server = http.createServer(function(request,response){ // Client로 부터 값 들어올 때 event drivven
        
        var parsedUrl = url.parse(request.url);
        // 4. 브라우저에서 요청한 주소(클라이언트의 주소)를 parsing 하여 객체화(dictionary 형태) 후 출력
        
        var parsedQuery = querystring.parse(parsedUrl.query,'&','=');
        // 5. 객체화된 url 중에 Query String 부분만 따로 객체화 후 출력
    
//      var newPower_data = new Power_data( parsedQuery ); //새로운 powerdata
        var newPower_data = new table( parsedQuery ); //새로운 powerdata 
        
        newPower_data.save(function(err, data){
            if(err){
                printError(err);
            }
            else{      
                console.log('new Power data Saved!');
                console.log(newPower_data);
            }
        });//9. saving data
        
        
    
        table.find(function(err, power_datas){1
            console.log('-------------------------------READ NEW DATA-----');
            if(err){
                printError(err);
            }
            else{
                console.log(power_datas);
            }
        });  //10. Power_data collection(전체 데이터 가져오기) 
        console.log('\n\n')

    
        response.writeHead(200, {'Content-Type':'text/html'}); 
        //response 객체를 사용해 사용자 측으로 반환값을 넘겨줌  
        response.end('Hello node.js!!');
        
    });
    
    server.listen(8080, function(){
        console.log('Server is running...');
    });
}


// Mongo DB 

// POST & JSON
// Body 안에 Auth key 
// read만 가능한 file하나 만들어서 
// 들어온 auth와 비교 


function connect_db(){
    var mongoose = require('mongoose') //1. mongoose 모듈 가져오기

    mongoose.connect('mongodb://localhost:27017/testDB') //2. testDB setting
    
    var db = mongoose.connection;//3. 연결된 testDB 사용
    
    db.on('error', function(){
       console.log('Connection failed!'); 
    }); //4. 연결 실패 시

    db.once('open', function(){
       console.log('Connected!'); 
    }); //5. 연결 성공 시
    
    
    var power_table = mongoose.Schema(
        {
            machine_label : 'string',
            onoff_state : 'number',
        }); //6. Schema 생성 (튜플 역할. 테이블은 따로 생성하지 않음)

    var Power_table = mongoose.model('Schema', power_table);//7. 정의된 스키마를 객체처럼 사용할 수 있도록 model() 함수로 컴파일


    Power_table.remove({}, function(err){
        if (err) {printError(err);}
        console.log('collection removed')
    }); //Model을 초기화해서 일단은 수행할 때마다 초기화되게 함. 나중에 삭제 
    
    return Power_table;
}


//main

var d3 = require("d3")
var jsdom = require("jsdom/lib/old-api");
var path = require('path');
var express = require("express");
var app = express(); //서버 전체.
var fs = require("fs");
//var jqueryjs = fs.readFileSync("./jquery-3.2.1.min.js").toString();

app.use('/css',express.static(path.join(__dirname + '/css')));
app.use('/js',express.static(path.join(__dirname + '/js')));
app.use('/font-awesome',express.static(path.join(__dirname + '/font-awesome')));
app.use('/picture',express.static(path.join(__dirname + '/picture')));
app.use('/sql',express.static(path.join(__dirname + '/sql')));


app.listen(3303, function(){
	console.log("server start");
});

/*
fs.readFile("index3.html", function(error, data){
	jsdom.env({
		html: data,
		done: function (errors, window){
			var $ = require('jquery')(window);
			$('h1').each(function(){
				var content = $(this).text();
				$(this).text(content + " modified!");
			});
			console.log(window.document)
			console.log(window.document.getElementsByTagName('h1')[0].textContent);
		}
	});
});
*/

app.get('/nilm.html', function(req, res){

	fs.readFile("nilm.html", function(error, data){
		jsdom.env({
			html: data,   // data: HTML 태그 전체 
			//src:[jqueryjs],
			done: function (errors, window){ //window: HTML script 전체
				var $ = require('jquery')(window);
				//d3.select(window.document.getElementById("flot-moving-line-chart"))

				//$(window.document).ready(function(){	
				//	console.log("document ready");
				//});
				
				res.writeHead(200, {"Content-Type":"text/html"});
				res.end(data);
			}
		});
	});	

}); // localhost/nilm.html로.  

app.get('/index2.html', function(req, res){
	fs.readFile("index2.html", function(error, data){
		jsdom.env({
			html: data,
			//src:[jqueryjs],
			done: function (errors, window){
				var $ = require('jquery')(window);
				
				$(window.document).ready(function() {
					console.log("document ready");
					var offset = 0;
					plot();

					function plot() {
						var sin = [],
							cos = [];
						for (var i = 0; i < 12; i += 0.2) {
							sin.push([i, Math.sin(i + offset)]);
							cos.push([i, Math.cos(i + offset)]);
						}

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
								hoverable: true //IMPORTANT! this is needed for tooltip to work
							},
							yaxis: {
								min: -1.2,
								max: 1.2
							},
							tooltip: true,
							tooltipOpts: {
								content: "'%s' of %x.1 is %y.4",
								shifts: {
									x: -60,
									y: 25
								}
							}
						};

						var plotObj = $.plot(window.document.getElementById("test"), [{
								data: sin,
								label: "sin(x)"
							}, {
								data: cos,
								label: "cos(x)"
							}],
							options);
					}
				});

				/*
				
					var m = [20, 20, 30, 20],
					w = 960 - m[1] - m[3],
					h = 500 - m[0] - m[2];

				var x,
					y,
					duration = 15000,
					delay = 5000;

				var color = d3.scaleOrdinal(d3.schemeCategory10);

				var svg = d3.select(window.document.getElementById("flot-moving-line-chart"))
					.append("svg")
					.attr("width", w + m[1] + m[3])
					.attr("height", h + m[0] + m[2])
				    .append("g")
					.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
				
				
				var stocks,
					symbols;

				// A line generator, for the dark stroke.
				var line = d3.line()
					.curve(d3.curveBasis)
					.x(function(d) { return x(d.date); })
					.y(function(d) { return y(d.price); });

				// A line generator, for the dark stroke.
				var axis = d3.line()
					.curve(d3.curveBasis)
					.x(function(d) { return x(d.date); })
					.y(h);

				// A area generator, for the dark stroke.
				var area = d3.area()
					.curve(d3.curveBasis)
					.x(function(d) { return x(d.date); })
					.y1(function(d) { return y(d.price); });

				d3.csv("stocks.csv", function(data) {
				  var parse = d3.timeFormat("%b %Y");

				  // Nest stock values by symbol.
				  symbols = d3.nest()
					  .key(function(d) { return d.symbol; })
					  .entries(stocks = data);

				  // Parse dates and numbers. We assume values are sorted by date.
				  // Also compute the maximum price per symbol, needed for the y-domain.
				  symbols.forEach(function(s) {
					s.values.forEach(function(d) { d.date = parse(d.date); d.price = +d.price; });
					s.maxPrice = d3.max(s.values, function(d) { return d.price; });
					s.sumPrice = d3.sum(s.values, function(d) { return d.price; });
				  });

				  // Sort by maximum price, descending.
				  symbols.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

				  var g = svg.selectAll("g")
					  .data(symbols)
					.enter().append("g")
					  .attr("class", "symbol");

				  setTimeout(lines, duration);
				});

				
				
				function lines() {
					x = d3.scaleLinear().range([0, w - 60]);
					y = d3.scaleLinear().range([h / 4 - 20, 0]);

					// Compute the minimum and maximum date across symbols.
					x.domain([
					d3.min(symbols, function(d) { return d.values[0].date; }),
					d3.max(symbols, function(d) { return d.values[d.values.length - 1].date; })
					]);

					var g = svg.selectAll(".symbol")
					  .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

					g.each(function(d) {
						var e = d3.select(this);

						e.append("path")
							.attr("class", "line");

						e.append("circle")
							.attr("r", 5)
							.style("fill", function(d) { return color(d.key); })
							.style("stroke", "#000")
							.style("stroke-width", "2px");

						e.append("text")
							.attr("x", 12)
							.attr("dy", ".31em")
							.text(d.key);
						});

						function draw(k) {
							g.each(function(d) {
							  var e = d3.select(this);
							  y.domain([0, d.maxPrice]);

							  e.select("path")
								  .attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

							  e.selectAll("circle, text")
								  .data(function(d) { return [d.values[k], d.values[k]]; })
								  .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.price) + ")"; });
							});
						}

						var k = 1, n = symbols[0].values.length;
						d3.timer(function() {
							draw(k);
							if ((k += 2) >= n - 1) {
							  draw(n - 1);
							  setTimeout(horizons, 500);
							  return true;
							}
						});
					}
				*/
				
				/*
				var svg = d3.select(window.document.getElementById("test")).append("svg"),
					margin = {top: 20, right: 20, bottom: 30, left: 40},
					width = +svg.attr("width") - margin.left - margin.right,
					height = +svg.attr("height") - margin.top - margin.bottom;

				var parseDate = d3.timeParse("%b %Y");

				var x = d3.scaleTime().range([0, width]),
					y = d3.scaleLinear().range([height, 0]);

				var xAxis = d3.axisBottom(x),
					yAxis = d3.axisLeft(y);

				var zoom = d3.zoom()
					.scaleExtent([1, 32])
					.translateExtent([[0, 0], [width, height]])
					.extent([[0, 0], [width, height]])
					.on("zoom", zoomed);

				var area = d3.area()
					.curve(d3.curveMonotoneX)
					.x(function(d) { return x(d.date); })
					.y0(height)
					.y1(function(d) { return y(d.price); });

				svg.append("defs").append("clipPath")
					.attr("id", "clip")
				  .append("rect")
					.attr("width", width)
					.attr("height", height);

				var g = svg.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				d3.csv("sp500.csv", type, function(error, data) {
				  if (error) throw error;

				  x.domain(d3.extent(data, function(d) { return d.date; }));
				  y.domain([0, d3.max(data, function(d) { return d.price; })]);

				  g.append("path")
					  .datum(data)
					  .attr("class", "area")
					  .attr("d", area);

				  g.append("g")
					  .attr("class", "axis axis--x")
					  .attr("transform", "translate(0," + height + ")")
					  .call(xAxis);

				  g.append("g")
					  .attr("class", "axis axis--y")
					  .call(yAxis);

				  var d0 = new Date(2003, 0, 1),
					  d1 = new Date(2004, 0, 1);

				  // Gratuitous intro zoom!
				  svg.call(zoom).transition()
					  .duration(1500)
					  .call(zoom.transform, d3.zoomIdentity
						  .scale(width / (x(d1) - x(d0)))
						  .translate(-x(d0), 0));
				});

				
				function zoomed() {
				  var t = d3.event.transform, xt = t.rescaleX(x);
				  g.select(".area").attr("d", area.x(function(d) { return xt(d.date); }));
				  g.select(".axis--x").call(xAxis.scale(xt));
				}

				function type(d) {
				  d.date = parseDate(d.date);
				  d.price = +d.price;
				  return d;
				}
				*/
				res.writeHead(200, {"Content-Type":"text/html"});
				res.end(window.document.documentElement.outerHTML);
			}
		});
	});	
});

app.get('/', function(req,res){
	fs.readFile("index3.html", function(error, data){
		jsdom.env({
			html: data,
			src:[jqueryjs],
			done: function (errors, window){
				var $ = require('jquery')(window);
				//$('h1').each(function(){
				//	var content = $(this).text();
				//	$(this).text(content + " modified!");
				//	
				//	
				//});	
				//d3.select(window.document.body).append("div").text("새로운 문장");
				res.writeHead(200, {"Content-Type":"text/html"});
				res.end(window.document.documentElement.outerHTML);
			}
		});
	});
});

/*
d3.select(window.document.body)
.selectAll('div')
.data(data)
.enter()
.append('div')
.attr('class','chart')
.style('height', function(d){
	return d*5 +'px';
})
*/


//var d3 = require("d3"),
//    jsdom = require("jsdom/lib/old-api");

//var document = jsdom.jsdom();
//var svg = d3.select(document.body).append("svg");

//d3.select(document.body).append("div").text("새로운 문장");
//console.log(document.html)

/*
var http = require('http');

var url = require('url'); // 1. 요청한 url을 객체로 만들기 위해 url 모듈사용

var querystring = require('querystring'); // 2. 요청한 url 중에 Query String 을 객체로 만들기 위해 querystring 모듈 사용

var server = http.createServer(function(request,response){ // Client로 부터 값 들어올 때 event drivven
	
	var parsedUrl = url.parse(request.url);
	// 4. 브라우저에서 요청한 주소(클라이언트의 주소)를 parsing 하여 객체화(dictionary 형태) 후 출력
	
	var parsedQuery = querystring.parse(parsedUrl.query,'&','=');
	// 5. 객체화된 url 중에 Query String 부분만 따로 객체화 후 출력

	response.writeHead(200, {'Content-Type':'text/html'}); 
	//response 객체를 사용해 사용자 측으로 반환값을 넘겨줌  
	response.end('Hello node.js!!');
	
});

server.listen(8080, function(){
	console.log('Server is running...');
});
*/



//app.get('/', function(req,res){
//	fs.readFile("index2.html", function(error, data){
//		if(error){
//			console.log(error);
//		}
//		else{
//			res.writeHead(200, {"Content-Type":"text/html"});
//			res.end(data);
//		}
//	});
//});

//var data = [30, 86, 168, 281, 303, 365];

//d3.select(".chart")
// .selectAll("div")
//  .data(data)
//    .enter()
//    .append("div")
//    .style("width", function(d) { return d + "px"; })
//    .text(function(d) { return d; });