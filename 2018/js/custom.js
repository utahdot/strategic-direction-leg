//Script calulates the required metrics
//Zero fatalities
(function() {
'use strict';
var definitive_url = 'https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide';
fetch(definitive_url)
  .then(function(response){
	response.json()
	  .then(function(data){
      if(document.getElementById("indexNumZF") !== null) {
        document.getElementById('indexNumZF').innerHTML = data[0].safety;
      }
	  });
  })
  .catch(function(error) {
	console.log('error', error);
  });
})();
//Next
(function() {
'use strict';
var definitive_url = 'https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide';
fetch(definitive_url)
  .then(function(response){
	response.json()
	  .then(function(data){
      if(document.getElementById("indexNumOM") !== null){
          document.getElementById('indexNumOM').innerHTML = data[0].mobility;
      }
	  });
  })
  .catch(function(error) {
	console.log('error', error);
  });
})();
//next
(function() {
'use strict';
var definitive_url = 'https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide';
fetch(definitive_url)
  .then(function(response){
	response.json()
	  .then(function(data){
      if(document.getElementById("indexNumPI") !== null){
          document.getElementById('indexNumPI').innerHTML = data[0].infrastructure;
      }
	  });
  })
  .catch(function(error) {
	console.log('error', error);
  });
})();
//Charts
//ZF Chart using Morris charts
(function() {
'use strict';
fetch("https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year").then(function(response){
    return response.json();
}).then(function(j){
    var zfData = [];
    var omData = [];
    var piData = [];
    for(var i = 0; i < j.length; i++){
        zfData[i] = {"avg_safety":parseFloat(j[i]["avg_safety"]).toFixed(2),"year":j[i]["year"]};
        omData[i] = {"avg_mobility":parseFloat(j[i]["avg_mobility"]).toFixed(2),"year":j[i]["year"]};
        piData[i] = {"avg_infrastructure":parseFloat(j[i]["avg_infrastructure"]).toFixed(2),"year":j[i]["year"]};
    }
    //console.log(zfData);
    if(document.getElementById("piMorrisChart") !== null){
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'piMorrisChart',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: piData,
            // The name of the data record attribute that contains x-values.
            xkey: 'year',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['avg_infrastructure'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Index']
        });
    }
    if(document.getElementById("zfMorrisChart") !== null){
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'zfMorrisChart',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: zfData,
            // The name of the data record attribute that contains x-values.
            xkey: 'year',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['avg_safety'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Index']
        });
    }
    if(document.getElementById("omMorrisChart") !== null){
        new Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'omMorrisChart',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: omData,
            // The name of the data record attribute that contains x-values.
            xkey: 'year',
            // A list of names of data record attributes that contain y-values.
            ykeys: ['avg_mobility'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Index']
        });
    }
});
})();
//Safety Metrics Chart,Page specific excecute on page
function safetyMetricChart(entity){
    var select = "$select=tf_index,tsi_index,tc_index,if_index,ii_index,ed_index&entity=";
    fetch("https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?"+select+entity)
        .then(function(response){
            return response.json();
    }).then(function(j){
        var element = document.getElementById('stacked');
        element.innerHTML = '';
        document.getElementById('filter').innerHTML = entity;
        var data =[
                {x:"Internal Equip Damage",a:parseInt(j[0]["ed_index"]),b:100 - parseInt(j[0]["ed_index"])},
                {x:"Internal Fatalities",a:parseInt(j[0]["if_index"]),b:100 - parseInt(j[0]["if_index"])},
                {x:"Internal Injuries",a:parseInt(j[0]["ii_index"]),b:100 - parseInt(j[0]["ii_index"])},
                {x:"Traffic Crashes",a:parseInt(j[0]["tc_index"]),b:100 - parseInt(j[0]["tc_index"])},
                {x:"Traffic Fatalities",a:parseInt(j[0]["tf_index"]),b:100 - parseInt(j[0]["tf_index"])},
                {x:"Traffic Serious Injuries",a:parseInt(j[0]["tsi_index"]),b:100 - parseInt(j[0]["tsi_index"])}
        ];
        //console.log(data);
        var config = {
            data: data,
            xkey: 'x',
            ykeys: ['a', 'b'],
            labels: ['Target Met', 'Target Remaining'],
            fillOpacity: 0.6,
            hideHover: false,
            behaveLikeLine: true,
            resize: true,
            pointFillColors:['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors:['gray','red'],
            barColors: ["#5b87c6","#eb7523"]
        };
        config.element = 'stacked';
        config.stacked = true;
        Morris.Bar(config);
    });
}
//Mobility Metrics Chart,Page specific excecute on page
function mobilityMetricChart(entity){
    var select = "$select=delay,reliability,mode_split,snow&entity=";
    fetch("https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?"+select+entity)
        .then(function(response){
            return response.json();
    }).then(function(j){
        var element = document.getElementById('stacked2');
        element.innerHTML = '';
        document.getElementById('filter').innerHTML = entity;
        var data =[
                {x:"I-15 Delay",a:parseInt(j[0]["delay"]),b:100 - parseInt(j[0]["delay"])},
                {x:"I-15 Reliability",a:parseInt(j[0]["reliability"]),b:100 - parseInt(j[0]["reliability"])},
                {x:"Mode Split",a:parseInt(j[0]["mode_split"]),b:100 - parseInt(j[0]["mode_split"])},
                {x:"Snow Removal",a:parseInt(j[0]["snow"]),b:100 - parseInt(j[0]["snow"])}
        ];
        //console.log(data);
        var config = {
            data: data,
            xkey: 'x',
            ykeys: ['a', 'b'],
            labels: ['Target Met', 'Target Remaining'],
            fillOpacity: 0.6,
            hideHover: false,
            behaveLikeLine: true,
            resize: true,
            pointFillColors:['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors:['gray','red'],
            barColors: ["#5b87c6","#eb7523"]
        };
        config.element = 'stacked2';
        config.stacked = true;
        Morris.Bar(config);
    });
}
//Infrastructure Metrics Chart,Page specific excecute on page
function infrastructureMetricChart(entity){
    var select = "$select=pavement,bridges,atms,signals&entity=";
    fetch("https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?"+select+entity)
        .then(function(response){
            return response.json();
    }).then(function(j){
        var element = document.getElementById('stacked3');
        element.innerHTML = '';
        document.getElementById('filter').innerHTML = entity;
        var data =[
                {x:"Pavement Condition",a:parseInt(j[0]["pavement"]),b:100 - parseInt(j[0]["pavement"])},
                {x:"Bridge Condition",a:parseInt(j[0]["bridges"]),b:100 - parseInt(j[0]["bridges"])},
                {x:"ATMS",a:parseInt(j[0]["atms"]),b:100 - parseInt(j[0]["atms"])},
                {x:"Traffic Signals",a:parseInt(j[0]["signals"]),b:100 - parseInt(j[0]["signals"])}
        ];
        //console.log(data);
        var config = {
            data: data,
            xkey: 'x',
            ykeys: ['a', 'b'],
            labels: ['Target Met', 'Target Remaining'],
            fillOpacity: 0.6,
            hideHover: false,
            behaveLikeLine: true,
            resize: true,
            pointFillColors:['#ffffff'],
            pointStrokeColors: ['black'],
            lineColors:['gray','red'],
            barColors: ["#5b87c6","#eb7523"]
        };
        config.element = 'stacked3';
        config.stacked = true;
        Morris.Bar(config);
    });
}
//Pavement pltly Chart
function pavementPlotlyChart(){
    fetch("https://dashboard.udot.utah.gov/resource/hyep-ccu9.json")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();
        var y = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            if(parseFloat(j[i]["good"]) !== 0){
                y.push(parseFloat(j[i]["good"]));
            }else {
                y.push(parseFloat(j[i]["forecasted_good"]));
            }
        }
        var good = {
          x:x,
          y:y,
          name: "% Good: IRI < 95 in/mi",
          type: "bar",
          marker: {color: 'rgb(40, 167, 69)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            if(parseFloat(j[i]["fair"]) !== 0){
                y.push(parseFloat(j[i]["fair"]));
            }else {
                y.push(parseFloat(j[i]["forecasted_fair"]));
            }
        }
        var fair = {
            x:x,
            y:y,
            name:"% Fair: IRI {95,170} in/mi",
            type: "bar",
            marker: {color: 'rgb(255, 193, 7)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            if(parseFloat(j[i]["poor"]) !== 0){
                y.push(parseFloat(j[i]["poor"]));
            }else {
                y.push(parseFloat(j[i]["forecasted_poor"]));
            }
        }
        var poor = {
            x:x,
            y:y,
            name:"% Poor: IRI > 170 in/mi",
            type: "bar",
            marker: {color: 'rgb(220, 53, 69)'}
        };
        var data = [good,fair,poor];
        var layout = {barmode:'stack',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:80,
                    x1:1,
                    y1:80,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }
        };
        Plotly.newPlot('pavementPlotlyChart',data,layout);
    });
}
//With Forcasted Numbers
function pavementPlotlyChart2(){
    fetch("https://dashboard.udot.utah.gov/resource/hyep-ccu9.json")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();
        var good = new Array();
        var fgood = new Array();
        var poor = new Array();
        var fpoor = new Array();
        var fair = new Array();
        var ffair = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            good.push(parseFloat(j[i]["good"]));
            fgood.push(parseFloat(j[i]["forecasted_good"]));
            poor.push(parseFloat(j[i]["poor"]));
            fpoor.push(parseFloat(j[i]["forecasted_poor"]));
            fair.push(parseFloat(j[i]["fair"]));
            ffair.push(parseFloat(j[i]["forecasted_fair"]));
        }
        var trace1 = {
          x:x,
          y:good,
          name: "% Good: IRI < 95 in/mi",
          type: "bar",
          marker: {color: 'rgb(40, 167, 69)'}
        };
        var trace2 = {
          x:x,
          y:fgood,
          name: "% Forcasted Good: IRI < 95 in/mi",
          type: "bar",
          marker: {color: 'rgba(40, 167, 69,0.4)'}
        };
        var trace3 = {
            x:x,
            y:fair,
            name:"% Fair: IRI {95,170} in/mi",
            type: "bar",
            marker: {color: 'rgb(255, 193, 7)'}
        };
        var trace4 = {
            x:x,
            y:ffair,
            name:"% Forcasted Fair: IRI {95,170} in/mi",
            type: "bar",
            marker: {color: 'rgba(255, 193, 7, 0.4)'}
        };
        var trace5 = {
            x:x,
            y:poor,
            name:"% Poor: IRI > 170 in/mi",
            type: "bar",
            marker: {color: 'rgb(220, 53, 69)'}
        };
        var trace6 = {
            x:x,
            y:fpoor,
            name:"% Forcasted Poor: IRI > 170 in/mi",
            type: "bar",
            marker: {color: 'rgba(220, 53, 69, 0.4)'}
        };
        var data = [trace1,trace2,trace3,trace4,trace5,trace6];
        var layout = {barmode:'stack',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:80,
                    x1:1,
                    y1:80,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
            legend: {
                showlegend: true,
		              legend: {"orientation": "h"},
                y: -0.5,
                x:0.3
            }
        };
        Plotly.newPlot('pavementPlotlyChart',data,layout);
    });
}
//Bridge Plotly Charts
function bridgeConditionChart(){
    fetch("https://dashboard.udot.utah.gov/resource/ujbw-qqsi.json?$order=bhi_year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var y = new Array(); //This will house data but will be reset after each loop
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["bhi_year"]));
            y.push(parseFloat(j[i]["nhs_inv_avg"]));
        }
        var nhs = {
            x:x,
            y:y,
            type: 'bar',
            name:"Average BHI of NHS Bridges",
            text: ["Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85","Target: 85"],
            marker: {
            color: '#f1c232'
            }
        };
        var data = [nhs];
        var layout = {title: 'NHS BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:85,
                    x1:1,
                    y1:85,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
                yaxis: {range: [50, 100]}
              };
        Plotly.newPlot('nhsBridgeCondition',data,layout);
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["state_inv_avg"]));
        }
        var state = {
            x:x,
            y:y,
            name:"Average BHI of State Bridges",
            text: ["Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80","Target: 80"],
            type: 'bar',
            marker: {
            color: '#0b5394'
          }
        };
        data = [];
        data = [state];
        layout = [];
        layout = {title: 'State BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:80,
                    x1:1,
                    y1:80,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],yaxis: {range: [50, 100]}};
        Plotly.newPlot('stateBridgeCondition',data,layout);
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["loc_combined_avg"]));
        }
        var local = {
            x:x,
            y:y,
            name:"Average BHI of State Bridges",
            text:['Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75','Target: 75'],
            type: 'bar',
            marker: {
            color: '#76a5af'
          }
        };
        data = [];
        data = [local];
        layout = [];
        layout = {title: 'Local Governments BHI',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:75,
                    x1:1,
                    y1:75,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],yaxis: {range: [50, 100]}};
        Plotly.newPlot('lgBridgeCondition',data,layout);
    });
}
//Operational ATMS charts
function atmsOperationalChart(){
    fetch("https://dashboard.udot.utah.gov/resource/59ex-6nx9.json?$order=year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var y = new Array(); //This will house data but will be reset after each loop
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            y.push(parseFloat(j[i]["percent_operational"]));
        }
        var operational = {
            x:x,
            y:y,
            mode: "lines+markers",
            name:"% of ATMS Devices in Operation",
            text:['Target: 90'],
            type: 'scatter',
            line:{shape:'spline'}
        };
        var data = [operational];
        var layout = {
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }};
        Plotly.newPlot('atmsOperationalChart',data,layout);
    });
}
//Signal Condition Bart Stacked Chart
function signalsPlotlyChart(){
    fetch("https://dashboard.udot.utah.gov/resource/cqny-q9v6.json?$select=percent_average_all,percent_good_all,percent_poor_all,year&$order=year")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();
        var y = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            y.push(parseFloat(j[i]["percent_good_all"]));
        }
        var good = {
          x:x,
          y:y,
          name: "%in Good Condition",
          type: "bar",
          marker: {color: 'rgb(40, 167, 69)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["percent_average_all"]));
        }
        var avg = {
            x:x,
            y:y,
            name:"% in Average Condition",
            type: "bar",
            marker: {color: 'rgb(255, 193, 7)'}
        };
        y = [];
        for(var i = 0;i < j.length; i++){
            y.push(parseFloat(j[i]["percent_poor_all"]));
        }
        var poor = {
            x:x,
            y:y,
            name:"% in Poor Condition",
            type: "bar",
            marker: {color: 'rgb(220, 53, 69)'}
        };
        var data = [good,avg,poor];
        var layout = {barmode:'stack',
            shapes:[{
                    type: 'line',
                    xref: 'paper',
                    x0:0,
                    y0:95,
                    x1:1,
                    y1:95,
                    line:{color:'rgb(255,0,0)',wdith:4,dash:'dot'}
                }],
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }
        };
        Plotly.newPlot('signalsPlotlyChart',data,layout);
    });
}
//Zero Fatalities Peformance Measures Chart, This is along a function. When data is remastered region will be implemented
function zeroFatalitiesPM(region){
    fetch("https://dashboard.udot.utah.gov/resource/4yir-8226.json?$order=year&$where=region='"+region+"'")
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var fat = new Array(); //This will house data but will be reset after each loop
        var fatT = new Array(); //This will house data but will be reset after each loop
        var inj = new Array(); //This will house data but will be reset after each loop
        var injT = new Array(); //This will house data but will be reset after each loop
        var cra = new Array(); //This will house data but will be reset after each loop
        var craT = new Array(); //This will house data but will be reset after each loop
        for(var i = 0;i < j.length; i++){
            if(j[i]["category"] === "Fatalities" && parseInt(j[i]["year"]) >2010){
                x.push(parseInt(j[i]["year"]));
                fat.push(parseInt(j[i]["actual"]));
                fatT.push(parseInt(j[i]["target"]));
            }else if(j[i]["category"] === "Injuries" && parseInt(j[i]["year"]) >2010){
                inj.push(parseInt(j[i]["actual"]));
                injT.push(parseInt(j[i]["target"]));
            } else if(j[i]["category"] === "Crashes" && parseInt(j[i]["year"]) >2010){
                cra.push(parseInt(j[i]["actual"]));
                craT.push(parseInt(j[i]["target"]));
            }
        }
        var actual = {
            x:x,//xbr = Year
            y:fat, //yvar =data
            mode: "lines+markers",
            name:"Actual Fatalities",
            type: 'scatter',
            line:{shape:'spline'}
        };
        var target = {
            x:x,//xbr = Year
            y:fatT, //yvar =data
            mode: "lines+markers",
            name:"Target Fatalities",
            type: 'scatter',
            line:{shape:'spline'}
        };
//        var forecast = {
//            x:[2018,2019,2020],//xbr = Year
//            y:[forecastYear(2018,fat,x),forecastYear(2019,fat,x),forecastYear(2020,fat,x)], //yvar =data
//            mode: "lines+markers",
//            name:"Linear Forecast",
//            type: 'scatter',
//            line:{shape:'spline'}
//        };
        var data = [actual,target];
        var layout = {
            legend: {
                'orientation': 'h',
                y: -0.5,
                x:0.3
            }};
        Plotly.newPlot('trafficFatalities',data,layout);
        actual = [];
        actual = {
            x:x,//xbr = Year
            y:inj, //yvar =data
            mode: "lines+markers",
            name:"Actual Injuries",
            type: 'scatter',
            line:{shape:'spline'}
        };
        target =[];
        target = {
            x:x,//xbr = Year
            y:injT, //yvar =data
            mode: "lines+markers",
            name:"Target Injuries",
            type: 'scatter',
            line:{shape:'spline'}
        };
//        forecast = [];
//        forecast = {
//            x:[2018,2019,2020],//xbr = Year
//            y:[forecastYear(2018,inj,x),forecastYear(2019,inj,x),forecastYear(2020,inj,x)], //yvar =data
//            mode: "lines+markers",
//            name:"Linear Forecast",
//            type: 'scatter',
//            line:{shape:'spline'}
//        };
        data = [];
        data = [actual,target];
        Plotly.newPlot('trafficInjuries',data,layout);
        //Set data for crhases and plot
        actual = [];
        actual = {
            x:x,//xbr = Year
            y:cra, //yvar =data
            mode: "lines+markers",
            name:"Actual Injuries",
            type: 'scatter',
            line:{shape:'spline'}
        };
        target =[];
        target = {
            x:x,//xbr = Year
            y:craT, //yvar =data
            mode: "lines+markers",
            name:"Target Injuries",
            type: 'scatter',
            line:{shape:'spline'}
        };
//        forecast = [];
//        forecast = {
//            x:[2018,2019,2020],//xbr = Year
//            y:[forecastYear(2018,cra,x),forecastYear(2019,cra,x),forecastYear(2020,cra,x)], //yvar =data
//            mode: "lines+markers",
//            name:"Linear Forecast",
//            type: 'scatter',
//            line:{shape:'spline'}
//        };
        data = [];
        data = [actual,target];
        Plotly.newPlot('trafficCrashes',data,layout);
        //refetch different query and hope that it works and plot internal fatalities
        fetch("https://dashboard.udot.utah.gov/resource/cd7e-zhau.json?$select=statewide,year")
        .then(function(response){
            return response.json();
        }).then(function(j){
            x=[];
            fat =[]; //recyle variables as much as possible
            for(var i = 0;i < j.length; i++){
            x.push(parseInt(j[i]["year"]));
            fat.push(parseInt(j[i]["statewide"]));
            }
            actual = [];
            actual = {
                x:x,//xbr = Year
                y:fat, //yvar =data
                mode: "lines+markers",
                name:"Internal Fatalities",
                type: 'scatter',
                line:{shape:'spline'}
            };
            data = [];
            data = [actual];
            layout = {
                legend: {
                    'orientation': 'h',
                    y: -0.5,
                    x:0.3
                },yaxis: {range: [0, 10]}};
            Plotly.newPlot('internalFatalities',data,layout);
            //refetch different query and hope that it works and plot internal injuries and equipment damage
            var url = 'https://dashboard.udot.utah.gov/resource/jvx4-hyvf.json';
            fetch(url+"?$select=sorting_order,damage_rate,damage_target,injury_rate,injury_target&$where=sorting_order>201710&$order=sorting_order asc")
            .then(function(response){
                return response.json();
            }).then(function(j){
                x=[];
                fat = [];//recycle variables, use for rate
                fatT = []; //use for target
                inj = [];
                injT = [];
                for(var i = 0;i < j.length; i++){
                    x.push(j[i]["sorting_order"]);
                    fat.push(parseFloat(j[i]["damage_rate"]));
                    fatT.push(parseFloat(j[i]["damage_target"]));
                    inj.push(parseFloat(j[i]["injury_rate"]));
                    injT.push(parseFloat(j[i]["injury_target"]));
                }
                actual =[];
                actual = {
                    x:x,//xbr = Year
                    y:fat, //yvar =data
                    mode: "lines+markers",
                    name:"Damage Rate",
                    type: 'scatter',
                    line:{shape:'spline'}
                };
                target =[];
                target = {
                    x:x,//xbr = Year
                    y:fatT, //yvar =data
                    mode: "lines+markers",
                    name:"Target",
                    type: 'scatter',
                    line:{shape:'spline'}
                };
                layout = [];
                layout = {
                    xaxis:{type:'category'},
                    legend: {
                        'orientation': 'h',
                        y: -0.5,
                        x:0.3
                    }};
                data = [];
                data = [actual,target];
                Plotly.newPlot('equipmentDamage',data,layout);
                //Draw Damage Rate Plat
                actual =[];
                actual = {
                    x:x,//xbr = Year
                    y:inj, //yvar =data
                    mode: "lines+markers",
                    name:"Injury Rate",
                    type: 'scatter',
                    line:{shape:'spline'}
                };
                target =[];
                target = {
                    x:x,//xbr = Year
                    y:injT, //yvar =data
                    mode: "lines+markers",
                    name:"Target",
                    type: 'scatter',
                    line:{shape:'spline'}
                };
                data = [];
                data = [actual,target];
                Plotly.newPlot('injuryRate',data,layout);
                });
        });
    });
}
//Optimize mobility Peformance Charts
function optimizeMobilityCharts(){
    //fetach and draw delay graph
    fetch('https://dashboard.udot.utah.gov/resource/whr3-7dxf.json?$select=i_15_delay,total,date&$where=not(month=%22Year%22)and%20not(sequence=55)&$order=sequence')
        .then(function(response){
            return response.json();
    }).then(function(j){
        var x = new Array();//This will contain years in chart
        var y = new Array(); //This will house data but will be reset after each loop
        var z = new Array();
        for(var i = 0;i < j.length; i++){
            x.push(j[i]["date"]);
            y.push(parseInt(j[i]["i_15_delay"]));
            z.push(parseInt(j[i]["total"]));
        }
        var trace1 = {
            x:x,
            y:y,
            mode: 'lines+markers',
            line: {shape: 'spline'},
            type: 'scatter',
            name:"I-15 Delay Delay"
        };
        var trace2 = {
            x:x,
            y:z,
            mode: 'lines+markers',
            line: {shape: 'spline'},
            type: 'scatter',
            name:"Target"
        };
        var data = [trace1,trace2];
        var layout = {
            xaxis: {
                type: 'category'
              }
            };
        Plotly.newPlot('i15delaygraph',data,layout);
        //Fetch and draw reliability graph
        fetch('https://dashboard.udot.utah.gov/resource/mfvh-usiw.json?$select=reliability_score,season,target&$where=year%20%3E%202014&$order=sequence')
        .then(function(response){
            return response.json();
        }).then(function(j){
            x = [];
            y=[];
            z = [];
            for(var i = 0;i < j.length; i++){
                x.push(j[i]["season"]);
                y.push(parseInt(j[i]["reliability_score"]));
                z.push(parseInt(j[i]["target"]));
            }
            trace1 = [];
            trace1 = {
                x:x,
                y:y,
                mode: 'lines+markers',
                line: {shape: 'spline'},
                type: 'scatter',
                name:"I-15 Reliability"
            };
            trace2 = [];
            trace2 = {
                x:x,
                y:z,
                mode: 'lines+markers',
                line: {shape: 'spline'},
                type: 'scatter',
                name:"Target"
            };
            data =[];
            data = [trace1,trace2];
            Plotly.newPlot('i15reliabilitygraph',data,layout);
            //fetch and draw mode slit graph
            fetch('https://dashboard.udot.utah.gov/resource/nc2g-cvvu.json')
            .then(function(response){
                return response.json();
            }).then(function(j){
                x = [];
                y=[];
                z = [];
                for(var i = 0;i < j.length; i++){
                    x.push(j[i]["year"]);
                    y.push(parseInt(j[i]["auto_trips_state"]));
                    z.push(parseInt(j[i]["transit_trips_state"]));
                }
                trace1 = [];
                trace1 = {
                    x:x,
                    y:y,
                    type: 'bar',
                    name:"Auto Person Trips I-15"
                };
                trace2 = [];
                trace2 = {
                    x:x,
                    y:z,
                    type: 'bar',
                    name:"Transit Person Trips I-15"
                };
                layout = [];
                layout = {barmode: 'stack',xaxis: {type: 'category'},legend: {'orientation': 'h',y: -0.5,x:0.3}};
                data =[];
                data = [trace1,trace2];
                Plotly.newPlot('modeSplit',data,layout);
                //fetch and draw snow and ice carts
                fetch('https://dashboard.udot.utah.gov/resource/mk2b-pz6f.json?$select=performance_1,whichwinter,performance_2,axislabel&$order=customsort')
                .then(function(response){
                    return response.json();
                }).then(function(j){
                    x = [];
                    y=[];
                    z = [];
                    var values = new Array();
                    var labels = new Array();
                    for(var i = 0;i < j.length; i++){
                        if(j[i]["whichwinter"] === "CURRENT OVERALL"){
                            values.push(parseInt(j[i]["performance_1"]));
                            labels.push(j[i]["performance_2"]);
                        } else{
                            x.push(threletterMonth(j[i]["axislabel"]));
                            if(j[i]["whichwinter"] === "PREVIOUS WINTER"){
                                z.push(0);
                                y.push(parseFloat(j[i]["performance_1"]));
                            }else if(j[i]["whichwinter"] === "CURRENT WINTER"){
                                y.push(0);
                                z.push(parseFloat(j[i]["performance_1"]));
                            }
                        }
                    }
                    trace1 = [];
                    trace1 = {
                        x:x,
                        y:y,
                        type: 'bar',
                        name:"Previous Winter"
                    };
                    trace2 = [];
                    trace2 = {
                        x:x,
                        y:z,
                        type: 'bar',
                        name:"Current Winter"
                    };
                    layout = [];
                    layout = {xaxis: {type: 'category'},legend: {'orientation': 'h',y: -0.5,x:0.3}};
                    data =[];
                    data = [trace1,trace2];
                    Plotly.newPlot('snowIceBar',data,layout);
                    //Plat pie chart with label and value data
                    data = [];
                    data = [{
                        values:values,
                        labels:labels,
                        type: 'pie'
                    }];
                    layout = [];
                    layout = {height: 400, widht: 400,legend: {'orientation': 'h',y: -0.5,x:0.3}};
                    Plotly.newPlot('snowIcePie',data,layout);
                });
            });
        });
    });
}
//Function to format long month year to three letter monthyear
function threletterMonth(str) {
    var res = str.substring(0, 3)+" "+str.substring((str.length - 4) , str.length);
    return res;
}
//Forecast Function
function forecastYear(x, ky, kx){
   var i=0, nr=0, dr=0,ax=0,ay=0,a=0,b=0;
   function average(ar) {
          var r=0;
      for (i=0;i<ar.length;i++){
         r = r+ar[i];
      }
      return r/ar.length;
   }
   ax=average(kx);
   ay=average(ky);
   for (i=0;i<kx.length;i++){
      nr = nr + ((kx[i]-ax) * (ky[i]-ay));
      dr = dr + ((kx[i]-ax)*(kx[i]-ax));
   }
  b=nr/dr;
  a=ay-b*ax;
  return (a+b*x);
}
//Mobility - Incident Management Pie Chart
function incidentManagement() {
    //Possible alternative api https://dashboard.udot.utah.gov/resource/p9qp-qyqk.json
    fetch('https://dashboard.udot.utah.gov/resource/j4uf-jvxd.json')
    .then(function(response){
        return response.json();
    }).then(function(j){
      var total = 0;
      for(var i=0; i<j.length; i++){
        total += parseInt(j[i]["incidents"]);
      }
        Morris.Donut({
            element: 'incidentManagement',
            data: [
              {label: "Motor assists", value: parseInt(j[0]["incidents"])},
              {label: "Crash assists", value: parseInt(j[1]["incidents"])},
              {label: "Debris removal", value: parseInt(j[2]["incidents"])},
              {label: "Abandoned vehicles", value: parseInt(j[3]["incidents"])},
              {label: "Other assists", value: parseInt(j[4]["incidents"])}
            ],
            formatter: function (y) { return y+" : "+Math.round((y/total)*100)+"%"}
        });
    });
}
