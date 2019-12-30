//Plug ins
Chart.plugins.register({
  afterDraw: function(chartInstance) {
    if (chartInstance.config.options.showDatapoints) {
      var helpers = Chart.helpers;
      var ctx = chartInstance.chart.ctx;
      var fontColor = helpers.getValueOrDefault(
        chartInstance.config.options.showDatapoints.fontColor,
        chartInstance.config.options.defaultFontColor
      );

      // render the value of the chart above the bar
      ctx.font = Chart.helpers.fontString(
        Chart.defaults.global.defaultFontSize,
        "normal",
        Chart.defaults.global.defaultFontFamily
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = fontColor;

      chartInstance.data.datasets.forEach(function(dataset) {
        for (var i = 0; i < dataset.data.length; i++) {
          var model =
            dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
          var scaleMax =
            dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale
              .maxHeight;
          var yPos =
            (scaleMax - model.y) / scaleMax >= 0.93
              ? model.y + 20
              : model.y - 5;
          ctx.fillText(dataset.data[i], model.x, yPos);
        }
      });
    }
  }
});
Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;
      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || "proxima-nova";
      var txt = centerConfig.text;
      var color = centerConfig.color || "#000";
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;
      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;
      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = chart.innerRadius * 2;
      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);
      //Set font settings to draw it correctly.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;
      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});
//Strategic Goal Charts
function drawGoalCharts() {
  var url =
    "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide";
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var dataIndex = data[0].safety;
      var indexLabel = ["", "Safety Index"];
      var config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("zero-fatalities-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);
      dataIndex = data[0].mobility;
      indexLabel = ["", "Mobility Index"];
      config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("optimize-mobility-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);
      dataIndex = data[0].infrastructure;
      indexLabel = ["", "Infrastructure Index"];
      config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("preserve-infrastructure-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);


      //From here on down draw historical charts.
      url =
        "https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year";
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          var zfData = [];
          var omData = [];
          var piData = [];
          var years = [];
          for (var i = 0; i < j.length; i++) {
            zfData.push(parseInt(j[i]["avg_safety"]));
            omData.push(parseInt(j[i]["avg_mobility"]));
            piData.push(parseInt(j[i]["avg_infrastructure"]));
            years.push(j[i]["year"]);
          }
          // var zfLineChart = document.getElementById("zero-fatalities-line-chart");
          // var omLineChart = document.getElementById("optimize-mobility-line-chart");
          // var piLineChart = document.getElementById("preserve-infrastructure-line-chart");
          Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
          Chart.defaults.global.defaultFontSize = 14;
          Chart.defaults.global.defaultFontColor = "#000";
          var linechartData = {
            labels: years,
            datasets: [
              {
                label: "Safety Index",
                data: zfData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          var chartOptions = {
            responsive: true,
            animation: {
              duration: 3000,
              animateScale: true,
              animateRotate: true,
              easing: "easeOutCirc",
              onComplete: function() {
                var chartInstance = this.chart,
                  ctx = chartInstance.ctx;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
                    var data = dataset.data[index];
                    ctx.fillText(data, bar._model.x, bar._model.y + 20);
                  });
                });
              }
            },
            legend: {
              display: false
            },
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: 100
                  }
                }
              ]
            },
            tooltips: {
              enabled: false
            }
          };
          var ctx = document.getElementById("zero-fatalities-line-chart");
          new Chart(ctx, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });
          //redefine data
          linechartData = {
            labels: years,
            datasets: [
              {
                label: "Mobility Index",
                data: omData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          ctx = document.getElementById("optimize-mobility-line-chart");
          new Chart(ctx, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });
          //redefine data
          linechartData = {
            labels: years,
            datasets: [
              {
                label: "Infrastructure Index",
                data: piData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          ctx = document.getElementById("preserve-infrastructure-line-chart");
          new Chart(ctx, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });
        })
        .catch(function(err) {
          console.log(
            "(*_*) if you see me there is with the second fetch..." + err
          );
        });
    })
    .catch(function(err) {
      console.log("{*_*} if you see me there is problem..." + err);
    });
}

//Chart for individual goal pages
//Preserve Infrastructure Charts
function drawPICharts() {
  var url =
    "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide";
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      //********** hard coded data, change when table available **********
      // var dataIndex = data[0].infrastructure
      var dataIndex = 90.5 ;

      var indexLabel = ["", "Infrastructure Index"];
      var config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("pi-goalpage-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);


      //Second fetch for historical line charts
      url =
        "https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year";
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          //********** hard coded data, change when table available **********
          // var piData = [];
          var piData = [89.4, 89.4, 89.8, 90, 90.1, 90.4, 90.5];

          var years = [];
          for (var i = 0; i < j.length; i++) {
            piData.push(parseInt(j[i]["avg_infrastructure"]));
            years.push(j[i]["year"]);
          }
          var piLineChart = document.getElementById("pi-line-chart");
          Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
          Chart.defaults.global.defaultFontSize = 14;
          var linechartData = {
            labels: years,
            datasets: [
              {
                label: "Infrastructure Index",
                data: piData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          var chartOptions = {
            responsive: true,
            animation: {
              duration: 3000,
              animateScale: true,
              animateRotate: true,
              easing: "easeOutCirc",
              onComplete: function() {
                var chartInstance = this.chart,
                  ctx = chartInstance.ctx;

                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
                    var data = dataset.data[index];
                    ctx.fillText(data, bar._model.x, bar._model.y + 20);
                  });
                });
              }
            },
            legend: {
              display: false
            },
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: 100
                  }
                }
              ]
            }
          };
          new Chart(piLineChart, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });

          //Third fetch for stacked KPI Charts charts
          url =
            "/wadocuments/data/strategic_direction/Preserve_Infrastructure/Graph_1_Infrastructure_Performance_Measures.json";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["ATMS"]),
                parseFloat(j[0]["BRIDGES"]),
                parseFloat(j[0]["PAVEMENT"]),
                parseFloat(j[0]["SIGNALS"])
              ];
              var targetRem = [
                100 - parseFloat(j[0]["ATMS"]),
                100 - parseFloat(j[0]["BRIDGES"]),
                100 - parseFloat(j[0]["PAVEMENT"]),
                100 - parseFloat(j[0]["SIGNALS"])
              ];

              var kpiChartData = {
                labels: [
                  [["ATMS"],["9%"]],
                  [["Bridges"],["38%"]],
                  [["Pavements"],["36%"]],
                  [["Signals"],["17%"]]
                ],
                datasets: [
                  {
                    label: "Target Met",
                    data: targetMet,
                    backgroundColor: "#5b87c6"
                  },
                  {
                    label: "Target Remaining",
                    data: targetRem,
                    backgroundColor: "#eb7523"
                  }
                ]
              };
              var piKPIChart = document.getElementById("pi-kpi-chart");
              new Chart(piKPIChart, {
                type: "bar",
                data: kpiChartData,
                options: {
                  scales: {
                    xAxes: [{ stacked: true,ticks: { fontSize: 9,autoSkip: false, maxRotation: 0}  }],
                    yAxes: [{ stacked: true }]
                  },
                  responsive: true,
                  animation: {
                    duration: 3000,
                    animateScale: true,
                    animateRotate: true,
                    easing: "easeOutCirc"
                  },
                  maintainAspectRatio: false,
                  legend: {
                    display: false,
                    position: "bottom",
                    labels: {
                      boxWidth: 20
                    }
                  }
                }
              });
            })
            .catch(function(err) {
              console.log(
                "(*_*) if you see me there is with the third fetch..." + err
              );
            });
        })
        .catch(function(err) {
          console.log(
            "(*_*) if you see me there is with the second fetch..." + err
          );
        });
    })
    .catch(function(err) {
      console.log(
        "{*_*} if you see me there is problem in preserve infrastructure chart..." +
          err
      );
    });
}

//Strategic Direction Peformance Measure charts
//Preserve infrastructure//Infrastructure Metrics Chart,Page specific excecute on page

//Pavement pltly Chart
//With Forcasted Numbers
function pavementPlotlyChartLV2() {
  var todaydate = new Date();
  var year = todaydate.getFullYear();
  fetch(
    "https://dashboard.udot.utah.gov/resource/hyep-ccu9.json?$where=year<=" +
      year
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array();
      var good = new Array();
      var poor = new Array();
      var fair = new Array();
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["year"]));
        good.push(parseFloat(j[i]["good"]));
        poor.push(parseFloat(j[i]["poor"]));
        fair.push(parseFloat(j[i]["fair"]));
      }

      //********** hard coded data, change when table available **********
      // var trace1 = {
      //   x: x,
      //   y: good,
      //   name: "% Good: IRI < 95 in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(40, 167, 69)" }
      // };
      // var trace3 = {
      //   x: x,
      //   y: fair,
      //   name: "% Fair: IRI {95,170} in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(255, 193, 7)" }
      // };
      // var trace5 = {
      //   x: x,
      //   y: poor,
      //   name: "% Poor: IRI > 170 in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(220, 53, 69)" }
      // };
      var trace1 = {
        x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
        y: [18, 18.69, 19.74, 23, 25.83, 31.61, 30],
        name: "% Good: IRI < 95 in/mi",
        type: "bar",
        marker: { color: "rgb(40, 167, 69)" }
      };
      var trace3 = {
          x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
          y: [56, 56.72, 59.51, 57.5, 55.53, 51.96, 54.9],
        name: "% Fair: IRI {95,170} in/mi",
        type: "bar",
        marker: { color: "rgb(255, 193, 7)" }
      };
      var trace5 = {
        x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
        y: [26, 24.59, 20.75, 19.5, 18.64, 16.43, 15.10],
        name: "% Poor: IRI > 170 in/mi",
        type: "bar",
        marker: { color: "rgb(220, 53, 69)" }
      };

      var data = [trace1, trace3, trace5];
      var layout = {
        title: "Low Volume Pavement",
        barmode: "stack",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 80,
            x1: 1,
            y1: 80,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        legend: {
          showlegend: true,
          legend: { orientation: "h" },
          y: -0.5,
          x: 0.3
        },
        xaxis: {
          autotick: false,
          tickfont: { size: 10 }
        }
      };
      Plotly.newPlot("pavementPlotlyChartLV", data, layout, { responsive: true });
    });
}


// High Volume HV
function pavementPlotlyChartHV2() {
  var todaydate = new Date();
  var year = todaydate.getFullYear();
  fetch(
    "https://dashboard.udot.utah.gov/resource/hyep-ccu9.json?$where=year<=" +
      year
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array();
      var good = new Array();
      var poor = new Array();
      var fair = new Array();
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["year"]));
        good.push(parseFloat(j[i]["good"]));
        poor.push(parseFloat(j[i]["poor"]));
        fair.push(parseFloat(j[i]["fair"]));
      }
      //********** hard coded data, change when table available **********
      // var trace1 = {
      //   x: x,
      //   y: good,
      //   name: "% Good: IRI < 95 in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(40, 167, 69)" }
      // };
      // var trace3 = {
      //   x: x,
      //   y: fair,
      //   name: "% Fair: IRI {95,170} in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(255, 193, 7)" }
      // };
      // var trace5 = {
      //   x: x,
      //   y: poor,
      //   name: "% Poor: IRI > 170 in/mi",
      //   type: "bar",
      //   marker: { color: "rgb(220, 53, 69)" }
      // };
      var trace1 = {
        x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
        y: [60, 59.43, 61.89, 61.50, 61.26, 63.4, 62.03],
        name: "% Good: IRI < 95 in/mi",
        type: "bar",
        marker: { color: "rgb(40, 167, 69)" }
      };
      var trace3 = {
          x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
          y: [34.0, 34.48, 32.52, 33.0, 33.61, 31.99, 33.43],
        name: "% Fair: IRI {95,170} in/mi",
        type: "bar",
        marker: { color: "rgb(255, 193, 7)" }
      };
      var trace5 = {
        x: [2013, 2014, 2015, 2016, 2017, 2018, 2019],
        y: [6, 6.09, 5.59, 5.5, 5.13, 4.61, 4.54],
        name: "% Poor: IRI > 170 in/mi",
        type: "bar",
        marker: { color: "rgb(220, 53, 69)" }
      };

      var data = [trace1, trace3, trace5];
      var layout = {
        title: "High Volume Pavement",
        barmode: "stack",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 95,
            x1: 1,
            y1: 95,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        legend: {
          showlegend: true,
          legend: { orientation: "h" },
          y: -0.5,
          x: 0.3
        },
        xaxis: {
          autotick: false,
          tickfont: { size: 10 }
        }
      };
      // console.log(data);
      Plotly.newPlot("pavementPlotlyChartHV", data, layout, { responsive: true });
    });
}



//Bridge Plotly Charts
function bridgeConditionChart() {
  fetch(
    "https://dashboard.udot.utah.gov/resource/ujbw-qqsi.json?$order=bhi_year"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var y = new Array(); //This will house data but will be reset after each loop
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["bhi_year"]));
        y.push(parseFloat(j[i]["nhs_inv_avg"]));
      }
      var nhs = {
        x: x,
        y: y,
        type: "bar",
        name: "Average BHI of NHS Bridges",
        text: [
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100"
        ],
        marker: {
          color: "#f1c232"
        }
      };
      var data = [nhs];
      var layout = {
        title: "NHS BHI",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 100,
            x1: 1,
            y1: 100,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        yaxis: { range: [50, 100] },
        xaxis: {
          autotick: false,
          tickfont: { size: 10 }
        }
      };
      Plotly.newPlot("nhsBridgeCondition", data, layout, { responsive: true });
      y = [];
      for (var i = 0; i < j.length; i++) {
        y.push(parseFloat(j[i]["state_inv_avg"]));
      }
      var state = {
        x: x,
        y: y,
        name: "Average BHI of State Bridges",
        text: [
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100"
        ],
        type: "bar",
        marker: {
          color: "#0b5394"
        }
      };
      data = [];
      data = [state];
      layout = [];
      layout = {
        title: "State BHI",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 100,
            x1: 1,
            y1: 100,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        yaxis: { range: [50, 100] },
        xaxis: { autotick: false, tickfont: { size: 10 } }
      };
      Plotly.newPlot("stateBridgeCondition", data, layout, {
        responsive: true
      });
      y = [];
      for (var i = 0; i < j.length; i++) {
        y.push(parseFloat(j[i]["loc_combined_avg"]));
      }
      var local = {
        x: x,
        y: y,
        name: "Average BHI of State Bridges",
        text: [
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100",
            "Target: 100"
        ],
        type: "bar",
        marker: {
          color: "#76a5af"
        }
      };
      data = [];
      data = [local];
      layout = [];
      layout = {
        title: "Local Governments BHI",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 100,
            x1: 1,
            y1: 100,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        yaxis: { range: [50, 100] },
        xaxis: { autotick: false, tickfont: { size: 10 } }
      };
      Plotly.newPlot("lgBridgeCondition", data, layout, { responsive: true });
    });
}

//Operational ATMS charts
function atmsOperationalChart() {
  // fetch("UDOT_Reliability_HERE_2018_TOC_Routes.csv.json?$order=year")
  fetch("/wadocuments/data/strategic_direction/Preserve_Infrastructure/Graph_9_ATMS.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var y = new Array(); //This will house data but will be reset after each loop
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["MY_YEAR"]));
        y.push(parseFloat(j[i]["PCT_OPERATIONAL"]));
      }
      var operational = {
        x: x,
        y: y,
        mode: "lines+markers",
        name: "% of ATMS Devices in Operation",
        text: ["Target: 100"],
        type: "scatter",
        line: { shape: "spline" }
      };
      var data = [operational];
      var layout = {
        legend: {
          orientation: "h",
          y: -0.5,
          x: 0.3
        },
        xaxis: { autotick: false, tickfont: { size: 10 } }
      };
      Plotly.newPlot("atmsOperationalChart", data, layout, {
        responsive: true
      });
    });
}

//Signal Condition Bar Stacked Chart
function signalsPlotlyChart() {
  fetch(
    "https://dashboard.udot.utah.gov/resource/cqny-q9v6.json?$select=percent_average_all,percent_good_all,percent_poor_all,year&$order=year"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array();
      var y = new Array();
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["year"]));
        y.push(parseFloat(j[i]["percent_good_all"]));
      }
      var good = {
        x: x,
        y: y,
        name: "%in Good Condition",
        type: "bar",
        marker: { color: "rgb(40, 167, 69)" }
      };
      y = [];
      for (var i = 0; i < j.length; i++) {
        y.push(parseFloat(j[i]["percent_average_all"]));
      }
      var avg = {
        x: x,
        y: y,
        name: "% in Average Condition",
        type: "bar",
        marker: { color: "rgb(255, 193, 7)" }
      };
      y = [];
      for (var i = 0; i < j.length; i++) {
        y.push(parseFloat(j[i]["percent_poor_all"]));
      }
      var poor = {
        x: x,
        y: y,
        name: "% in Poor Condition",
        type: "bar",
        marker: { color: "rgb(220, 53, 69)" }
      };
      var data = [good, avg, poor];
      var layout = {
        barmode: "stack",
        shapes: [
          {
            type: "line",
            xref: "paper",
            x0: 0,
            y0: 100,
            x1: 1,
            y1: 100,
            line: { color: "rgb(255,0,0)", wdith: 4, dash: "dot" }
          }
        ],
        legend: {
          orientation: "h",
          y: -0.5,
          x: 0.3
        },
        xaxis: { autotick: false, tickfont: { size: 10 } }
      };
      Plotly.newPlot("signalsPlotlyChart", data, layout, { responsive: true });
    });
}
//Chart for individual goal pages
//Zero Fatalities
function drawZFCharts() {
  var url =
    "/wadocuments/data/strategic_direction/zero_fatalities/graph_02_donut_chart_overall_statewide_safety_index.json";
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var dataIndex = data[0].safetyindexytd;
      var indexLabel = ["", "Safety Index"];
      var config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("zf-goalpage-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);
      //Second fetch for historical line charts
      url =
        "/wadocuments/data/strategic_direction/zero_fatalities/graph_03_line_chart_historic_statewide_safety_index_by_year.json";
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          var piData = [];
          var years = [];
          for (var i = 0; i < j.length; i++) {
            piData.push(parseInt(j[i]["safetyindex"]));
            years.push(j[i]["year"]);
          }
          var zfLineChart = document.getElementById("zf-line-chart");
          Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
          Chart.defaults.global.defaultFontSize = 14;
          var linechartData = {
            labels: years,
            datasets: [
              {
                label: "Safety Index",
                data: piData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          var chartOptions = {
            responsive: true,
            animation: {
              duration: 3000,
              animateScale: true,
              animateRotate: true,
              easing: "easeOutCirc",
              onComplete: function() {
                var chartInstance = this.chart,
                  ctx = chartInstance.ctx;
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
                    var data = dataset.data[index];
                    ctx.fillText(data, bar._model.x, bar._model.y + 20);
                  });
                });
              }
            },
            legend: {
              display: false
            },
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: 100
                  }
                }
              ]
            }
          };
          new Chart(zfLineChart, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });
          //Third fetch for stacked KPI Charts charts
          url =
            "/wadocuments/data/strategic_direction/zero_fatalities/graph_01_stacked_bar_chart_statewide_safety_score_as_pct_of_weighting.json";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["percenttargetmet"]),
                parseFloat(j[1]["percenttargetmet"]),
                parseFloat(j[2]["percenttargetmet"]),
                parseFloat(j[3]["percenttargetmet"]),
                parseFloat(j[4]["percenttargetmet"]),
                parseFloat(j[5]["percenttargetmet"])
              ];
              var targetRem = [
                100 - parseFloat(j[0]["percenttargetmet"]),
                100 - parseFloat(j[1]["percenttargetmet"]),
                100 - parseFloat(j[2]["percenttargetmet"]),
                100 - parseFloat(j[3]["percenttargetmet"]),
                100 - parseFloat(j[4]["percenttargetmet"]),
                100 - parseFloat(j[5]["percenttargetmet"])
              ];
              var kpiChartData = {
                labels: [
                  j[0]["safetyareaandweighting"],
                  j[1]["safetyareaandweighting"],
                  j[2]["safetyareaandweighting"],
                  j[3]["safetyareaandweighting"],
                  j[4]["safetyareaandweighting"],
                  j[5]["safetyareaandweighting"]
                ],
                datasets: [
                  {
                    label: "Target Met",
                    data: targetMet,
                    backgroundColor: "#5b87c6"
                  },
                  {
                    label: "Target Remaining",
                    data: targetRem,
                    backgroundColor: "#eb7523"
                  }
                ]
              };
              var zfKPIChart = document.getElementById("zf-kpi-chart");
              new Chart(zfKPIChart, {
                type: "bar",
                data: kpiChartData,
                options: {
                  scales: {
                    xAxes: [{ stacked: true, ticks: { fontSize: 9 } }],
                    yAxes: [{ stacked: true }]
                  },
                  responsive: true,
                  animation: {
                    duration: 3000,
                    animateScale: true,
                    animateRotate: true,
                    easing: "easeOutCirc"
                  },
                  maintainAspectRatio: false,
                  legend: {
                    position: "bottom",
                    labels: {
                      boxWidth: 20
                    }
                  }
                }
              });
            })
            .catch(function(err) {
              console.log(
                "(*_*) if you see me there is with the third fetch..." + err
              );
            });
        })
        .catch(function(err) {
          console.log(
            "(*_*) if you see me there is with the second fetch..." + err
          );
        });
    })
    .catch(function(err) {
      console.log(
        "{*_*} if you see me there is problem in preserve infrastructure chart..." +
          err
      );
    });
}
function zeroFatalitiesPM(region) {
  fetch(
    "/wadocuments/data/strategic_direction/zero_fatalities/graph_08_actual_and_target_crashes.json"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var cra = new Array(); //This will house data but will be reset after each loop
      var craT = new Array(); //This will house data but will be reset after each loop
      for (var i = 0; i < j.length; i++) {
        if (parseInt(j[i]["Year"]) > 2010) {
          x.push(parseInt(j[i]["Year"]));
          cra.push(parseInt(j[i]["ActualCrashes"]));
          craT.push(parseInt(j[i]["TargetCrashes"]));
        }
      }
      //Set data for crashes and plot
      actual = [];
      actual = {
        x: x, //xbr = Year
        y: cra, //yvar =data
        mode: "lines+markers",
        name: "Actual Crashes",
        type: "scatter",
        line: { shape: "spline" }
      };
      target = [];
      target = {
        x: x, //xbr = Year
        y: craT, //yvar =data
        mode: "lines+markers",
        name: "Target Crashes",
        type: "scatter",
        line: { shape: "spline" }
      };
      data = [];
      data = [actual, target];
      layout = {
        legend: {
          orientation: "h",
          y: -0.5,
          x: 0.3
        },
        yaxis: { range: [0, 65000] },
        xaxis: {
          autotick: false,
          tickfont: { size: 10, family: "proxima-nova, sans-serif" }
        }
      };
      Plotly.newPlot("trafficCrashes", data, layout);
      fetch(
        "/wadocuments/data/strategic_direction/zero_fatalities/graph_06_actual_and_target_serious_injuries.json"
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          var x = new Array(); //This will contain years in chart
          var inj = new Array(); //This will house data but will be reset after each loop
          var injT = new Array(); //This will house data but will be reset after each loop
          for (var i = 0; i < j.length; i++) {
            if (parseInt(j[i]["Year"]) > 2010) {
              x.push(parseInt(j[i]["Year"]));
              inj.push(parseInt(j[i]["ActualSeriousInjuries"]));
              injT.push(parseInt(j[i]["TargetSeriousInjuries"]));
            }
          }
          actual = [];
          actual = {
            x: x, //xbr = Year
            y: inj, //yvar =data
            mode: "lines+markers",
            name: "Actual Injuries",
            type: "scatter",
            line: { shape: "spline" }
          };
          target = [];
          target = {
            x: x, //xbr = Year
            y: injT, //yvar =data
            mode: "lines+markers",
            name: "Target Injuries",
            type: "scatter",
            line: { shape: "spline" }
          };
          data = [];
          data = [actual, target];
          layout = {
            legend: {
              orientation: "h",
              y: -0.5,
              x: 0.3
            },
            yaxis: { range: [0, 1600] },
            xaxis: {
              autotick: false,
              tickfont: { size: 10, family: "proxima-nova, sans-serif" }
            }
          };
          Plotly.newPlot("trafficInjuries", data, layout);

          fetch(
            "/wadocuments/data/strategic_direction/zero_fatalities/graph_04_actual_and_target_fatalities.json"
          )
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var x = new Array(); //This will contain years in chart
              var fat = new Array(); //This will house data but will be reset after each loop
              var fatT = new Array(); //This will house data but will be reset after each loop
              for (var i = 0; i < j.length; i++) {
                if (parseInt(j[i]["Year"]) > 2010) {
                  x.push(parseInt(j[i]["Year"]));
                  fat.push(parseInt(j[i]["ActualFatalities"]));
                  fatT.push(parseInt(j[i]["TargetFatalities"]));
                }
              }
              var actual = {
                x: x, //xbr = Year
                y: fat, //yvar =data
                mode: "lines+markers",
                name: "Actual Fatalities",
                type: "scatter",
                line: { shape: "spline" }
              };
              var target = {
                x: x, //xbr = Year
                y: fatT, //yvar =data
                mode: "lines+markers",
                name: "Target Fatalities",
                type: "scatter",
                line: { shape: "spline" }
              };
              var data = [actual, target];
              var layout = {
                legend: {
                  orientation: "h",
                  y: -0.5,
                  x: 0.3
                },
                xaxis: {
                  autotick: false,
                  tickfont: { size: 10, family: "proxima-nova, sans-serif" }
                }
              };
              Plotly.newPlot("trafficFatalities", data, layout);
            });
      //refetch different query and hope that it works and plot internal fatalities
      fetch(
        "/wadocuments/data/strategic_direction/zero_fatalities/graph_05_actual_internal_fatalities.json"
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          x = [];
          fat = []; //recyle variables as much as possible
          for (var i = 0; i < j.length; i++) {
            x.push(parseInt(j[i]["Year"]));
            fat.push(parseInt(j[i]["ActualInternalFatalities"]));
          }
          actual = [];
          actual = {
            x: x, //xbr = Year
            y: fat, //yvar =data
            mode: "lines+markers",
            name: "Internal Fatalities",
            type: "scatter",
            line: { shape: "spline" }
          };
          data = [];
          data = [actual];
          layout = {
            legend: {
              orientation: "h",
              y: -0.5,
              x: 0.3
            },
            yaxis: { range: [0, 10] },
            xaxis: {
              autotick: false,
              tickfont: { size: 10, family: "proxima-nova, sans-serif" }
            }
          };
          Plotly.newPlot("internalFatalities", data, layout);

          fetch("/wadocuments/data/strategic_direction/zero_fatalities/graph_09_actual_and_target_equipment_damage.json")
            .then(function(response){
              return response.json();
            })
            .then(function(j) {
              x = [];
              fat = []; //recycle variables, use for rate
              fatT = []; //use for target
              for (var i = 0; i < j.length; i++) {
                if (
                  parseFloat(j[i]["ActualEquipmentDamageRate"]) == 0
                ) {
                  continue;
                }
                x.push(j[i]["YearMonth"]);
                fat.push(parseFloat(j[i]["ActualEquipmentDamageRate"]));
                fatT.push(parseFloat(j[i]["TargetEquipmentDamageRate"]));
              }
              actual = [];
              actual = {
                x: x, //xbr = Year
                y: fat, //yvar =data
                mode: "lines+markers",
                name: "Damage Rate",
                type: "scatter",
                line: { shape: "spline" }
              };
              target = [];
              target = {
                x: x, //xbr = Year
                y: fatT, //yvar =data
                mode: "lines+markers",
                name: "Target",
                type: "scatter",
                line: { shape: "spline" }
              };
              layout = [];
              layout = {
                xaxis: {
                  type: "category",
                  autotick: false,
                  tickfont: { size: 10, family: "proxima-nova, sans-serif" }
                },
                legend: {
                  orientation: "h",
                  y: -0.5,
                  x: 0.3
                }
              };
              data = [];
              data = [actual, target];
              Plotly.newPlot("equipmentDamage", data, layout);
            });

            fetch("/wadocuments/data/strategic_direction/zero_fatalities/graph_07_actual_and_target_internal_injuries.json")
            .then(function(response){
              return response.json();
            })
            .then(function(j) {
              x = [];
              inj = [];
              injT = [];
              for (var i = 0; i < j.length; i++) {
                if (
                  parseFloat(j[i]["InternalInjuryRate"]) == 0
                ) {
                  continue;
                }
                x.push(j[i]["YearMonth"]);
                inj.push(parseFloat(j[i]["InternalInjuryRate"]));
                injT.push(parseFloat(j[i]["InternalInjuryTarget"]));
              }
              layout = [];
              layout = {
                xaxis: {
                  type: "category",
                  autotick: false,
                  tickfont: { size: 10, family: "proxima-nova, sans-serif" }
                },
                legend: {
                  orientation: "h",
                  y: -0.5,
                  x: 0.3
                }
              };
              //Draw Damage Rate Plot
              actual = [];
              actual = {
                x: x, //xbr = Year
                y: inj, //yvar =data
                mode: "lines+markers",
                name: "Injury Rate",
                type: "scatter",
                line: { shape: "spline" }
              };
              target = [];
              target = {
                x: x, //xbr = Year
                y: injT, //yvar =data
                mode: "lines+markers",
                name: "Target",
                type: "scatter",
                line: { shape: "spline" }
              };
              data = [];
              data = [actual, target];
              Plotly.newPlot("injuryRate", data, layout);
            });
        });
    });
  });
}
//Chart for individual goal pages
//Optimize Mobility
function drawOMCharts() {
  var url =
    "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?entity=Statewide";
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var dataIndex = data[0].mobility;
      var indexLabel = ["", "Mobility Index"];
      var config = {
        type: "doughnut",
        data: {
          labels: indexLabel,
          datasets: [
            {
              data: [Math.round((100 - dataIndex) * 10) / 10, dataIndex],
              backgroundColor: ["#d58e61", "#5a87c5"]
            }
          ]
        },
        options: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "proxima-nova, sans-serif"),
          legend: { display: false },
          responsive: true,
          animation: {
            duration: 3000,
            animateScale: true,
            animateRotate: true,
            easing: "easeOutCirc"
          },
          elements: {
            center: {
              text: dataIndex + "%",
              color: "#000000", // Default is #000000
              fontStyle: "proxima-nova, sans-serif", // Default is Arial
              sidePadding: 20 // Defualt is 20 (as a percentage)
            }
          }
        }
      };
      var ctx = document
        .getElementById("om-goalpage-doughut-chart")
        .getContext("2d");
      var myChart = new Chart(ctx, config);
      //Second fetch for historical line charts
      url =
        "https://dashboard.udot.utah.gov/resource/b8iq-pg44.json?$select=year,avg(safety),avg(mobility),avg(infrastructure)&$group=year&$order=year";
      fetch(url)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          var piData = [];
          var years = [];
          for (var i = 0; i < j.length; i++) {
            piData.push(parseInt(j[i]["avg_mobility"]));
            years.push(j[i]["year"]);
          }
          Chart.defaults.global.defaultFontColor = "#000";
          var omLineChart = document.getElementById("om-line-chart");
          Chart.defaults.global.defaultFontFamily = "proxima-nova, sans-serif";
          Chart.defaults.global.defaultFontSize = 14;
          var linechartData = {
            labels: years,
            datasets: [
              {
                label: "Mobility Index",
                data: piData,
                borderColor: "#5a87c5",
                fill: false,
                backgroundColor: "#000"
              }
            ]
          };
          var chartOptions = {
            responsive: true,
            animation: {
              duration: 3000,
              animateScale: true,
              animateRotate: true,
              easing: "easeOutCirc",
              onComplete: function() {
                var chartInstance = this.chart,
                  ctx = chartInstance.ctx;

                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function(bar, index) {
                    var data = dataset.data[index];
                    ctx.fillText(data, bar._model.x, bar._model.y + 20);
                  });
                });
              }
            },
            legend: {
              display: false
            },
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                    steps: 10,
                    stepValue: 5,
                    max: 100
                  }
                }
              ]
            },
            tooltips: {
              enabled: false
            }
          };
          new Chart(omLineChart, {
            type: "line",
            data: linechartData,
            options: chartOptions
          });
          //Third fetch for stacked KPI Charts charts
          url =
            "/wadocuments/data/strategic_direction/Optimize_Mobility/Graph_1_Mobility_Performance_Measures.json";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["DELAY"]),
                parseFloat(j[0]["RELIABILITY"]),
                parseFloat(j[0]["MODE_SPLIT"]),
                parseFloat(j[0]["SNOW"])
              ];
              var targetRem = [
                100 - parseFloat(j[0]["DELAY"]),
                100 - parseFloat(j[0]["RELIABILITY"]),
                100 - parseFloat(j[0]["MODE_SPLIT"]),
                100 - parseFloat(j[0]["SNOW"])
              ];
              var kpiChartData = {
                labels: [
                  "Delay: 30%",
                  "Reliability: 35%",
                  "Mode Split: 11%",
                  "Snow Removal: 24%"
                ],
                datasets: [
                  {
                    label: "Target Met",
                    data: targetMet,
                    backgroundColor: "#5b87c6"
                  },
                  {
                    label: "Target Remaining",
                    data: targetRem,
                    backgroundColor: "#eb7523"
                  }
                ]
              };
              var omKPIChart = document.getElementById("om-kpi-chart");
              new Chart(omKPIChart, {
                type: "bar",
                data: kpiChartData,
                options: {
                  scales: {
                    xAxes: [{ stacked: true, ticks: { fontSize: 10 } }],
                    yAxes: [{ stacked: true }]
                  },
                  responsive: true,
                  animation: {
                    duration: 3000,
                    animateScale: true,
                    animateRotate: true,
                    easing: "easeOutCirc"
                  },
                  maintainAspectRatio: false,
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                      boxWidth: 20
                    }
                  }
                }
              });
            })
            .catch(function(err) {
              console.log(
                "(*_*) if you see me there is with the third fetch..." + err
              );
            });
        })
        .catch(function(err) {
          console.log(
            "(*_*) if you see me there is with the second fetch..." + err
          );
        });
    })
    .catch(function(err) {
      console.log(
        "{*_*} if you see me there is problem in preserve infrastructure chart..." +
          err
      );
    });
}
//Optimize mobility Peformance Charts
function optimizeMobilityCharts() {
  //fetach and draw delay
  var delayUrl =
    "/wadocuments/data/strategic_direction/Optimize_Mobility/Graph_4_Target_Delay.json";
  fetch(delayUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var y = new Array(); //This will house data but will be reset after each loop
      var z = new Array();
      for (var i = 0; i < j.length; i++) {
        x.push(dateBreaker(j[i]["Date"]));
        y.push(parseInt(j[i]["Delay Hours"]));
        z.push(parseInt(j[i]["Month Target"]));
      }
      var trace1 = {
        x: x,
        y: y,
        mode: "lines+markers",
        line: { shape: "spline" },
        type: "scatter",
        name: "Delay"
      };
      var trace2 = {
        x: x,
        y: z,
        mode: "lines+markers",
        line: { shape: "spline" },
        type: "scatter",
        name: "Target"
      };
      var data = [trace1, trace2];
      var layout = {
        xaxis: {
          type: "category"
        }
      };
      Plotly.newPlot("delaygraph", data, layout);
      //Fetch and draw reliability graph
      var relUrl =
        "/wadocuments/data/strategic_direction/Optimize_Mobility/Graph_5_Mobility_Performance_Measures_Reliability.json";
      fetch(relUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          x = [];
          y = [];
          z = [];
          for (var i = 0; i < j.length; i++) {
            x.push(dateBreaker(j[i]["DATA_DATE"]));
            y.push(parseInt(j[i]["RELIABILITY_MEASURE"]));
            z.push(parseInt(j[i]["TARGET"]));
          }
          trace1 = [];
          trace1 = {
            x: x,
            y: y,
            mode: "lines+markers",
            line: { shape: "spline" },
            type: "scatter",
            name: "Reliability"
          };
          trace2 = [];
          trace2 = {
            x: x,
            y: z,
            mode: "lines+markers",
            line: { shape: "spline" },
            type: "scatter",
            name: "Target"
          };
          data = [];
          layout = {
              yaxis: {
                  range: [50, 100]
              }
          }
          data = [trace1, trace2];
          Plotly.newPlot("reliabilitygraph", data, layout);
          //fetch and draw mode slit graph
          fetch("/wadocuments/data/strategic_direction/Optimize_Mobility/Graph_6_Mobility_Performance_Mode_Split.json")
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              x = [];
              y = [];
              z = [];
              for (var i = 0; i < j.length; i++) {
                x.push(j[i]["Year"]);
                y.push(parseInt(j[i]["Auto Trips State"]));
                z.push(parseInt(j[i]["Transit Trips State"]));
              }
              trace1 = [];
              trace1 = {
                x: x,
                y: y,
                type: "bar",
                name: "Auto Person Trips I-15"
              };
              trace2 = [];
              trace2 = {
                x: x,
                y: z,
                type: "bar",
                name: "Transit Person Trips I-15"
              };
              layout = [];
              layout = {
                barmode: "stack",
                xaxis: { type: "category" },
                legend: { orientation: "h", y: -0.5, x: 0.3 }
              };
              data = [];
              data = [trace1, trace2];
              Plotly.newPlot("modeSplit", data, layout);
              //fetch and draw snow and ice carts
              fetch(
                "https://dashboard.udot.utah.gov/resource/mk2b-pz6f.json?$select=performance_1,whichwinter,performance_2,axislabel&$order=customsort"
              )
                .then(function(response) {
                  return response.json();
                })
                .then(function(j) {
                  x = [];
                  y = [];
                  z = [];
                  var values = new Array();
                  var labels = new Array();
                  for (var i = 0; i < j.length; i++) {
                    if (j[i]["whichwinter"] === "CURRENT OVERALL") {
                      values.push(parseInt(j[i]["performance_1"]));
                      labels.push(j[i]["performance_2"]);
                    } else {
                      x.push(threletterMonth(j[i]["axislabel"]));
                      if (j[i]["whichwinter"] === "PREVIOUS WINTER") {
                        z.push(0);
                        y.push(parseFloat(j[i]["performance_1"]));
                      } else if (j[i]["whichwinter"] === "CURRENT WINTER") {
                        y.push(0);
                        z.push(parseFloat(j[i]["performance_1"]));
                      }
                    }
                  }
                  trace1 = [];
                  trace1 = {
                    x: x,
                    y: y,
                    type: "bar",
                    name: "Previous Winter"
                  };
                  trace2 = [];
                  trace2 = {
                    x: x,
                    y: z,
                    type: "bar",
                    name: "Current Winter"
                  };
                  layout = [];
                  layout = {
                    xaxis: { type: "category" },
                    legend: { orientation: "h", y: -0.5, x: 0.3 }
                  };
                  data = [];
                  data = [trace1, trace2];
                  Plotly.newPlot("snowIceBar", data, layout);
                  //Plat pie chart with label and value data
                  data = [];
                  data = [
                    {
                      values: values,
                      labels: labels,
                      type: "pie"
                    }
                  ];
                  layout = [];
                  layout = {
                    height: 400,
                    widht: 400,
                    legend: { orientation: "h", y: -0.5, x: 0.3 }
                  };
                  Plotly.newPlot("snowIcePie", data, layout);
                });
            });
        });
    });
}
//Morris chart for optimize mobility incident management
function incidentManagement() {
  //Possible alternative api https://dashboard.udot.utah.gov/resource/p9qp-qyqk.json
  fetch("https://dashboard.udot.utah.gov/resource/j4uf-jvxd.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var total = 0;
      for (var i = 0; i < j.length; i++) {
        total += parseInt(j[i]["incidents"]);
      }
      Morris.Donut({
        element: "incidentManagement",
        data: [
          { label: "Motor assists", value: parseInt(j[0]["incidents"]) },
          { label: "Crash assists", value: parseInt(j[1]["incidents"]) },
          { label: "Debris removal", value: parseInt(j[2]["incidents"]) },
          { label: "Abandoned vehicles", value: parseInt(j[3]["incidents"]) },
          { label: "Other assists", value: parseInt(j[4]["incidents"]) }
        ],
        formatter: function(y) {
          return y + " : " + Math.round((y / total) * 100) + "%";
        }
      });
    });
}
//Custom Function to extract three letter month from string
function threletterMonth(str) {
  var res =
    str.substring(0, 3) + " " + str.substring(str.length - 4, str.length);
  return res;
}
//Helper functtion dateBreaker (recieved a date string and breaks it into yy-mm m)
function dateBreaker(datestring) {
  var d = new Date(datestring);
  var n = d.getMonth() + 1;
  if (n < 10) {
    n = "0" + n;
  }
  var year = d.getFullYear();
  year = year.toString().substr(-2);
  var month = d.toLocaleString("en-us", { month: "short" });
  return year + "-" + n + " " + month;
}
