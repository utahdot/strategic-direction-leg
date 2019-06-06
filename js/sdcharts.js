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
      var dataIndex = data[0].infrastructure;
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
          var piData = [];
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
            "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?$select=pavement,bridges,atms,signals&entity=Statewide";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["atms"]),
                parseFloat(j[0]["bridges"]),
                parseFloat(j[0]["pavement"]),
                parseFloat(j[0]["signals"])
              ];
              var kpiChartData = {
                labels: [
                  [["ATMS"],[" 9%"]],
                  [["Bridges"],["38%"]],
                  [["Pavements"],["36%"]],
                  [["Signals"],["17%"]]
                ],
                datasets: [
                  {
                    label: "Target Met",
                    data: targetMet,
                    backgroundColor: "#5b87c6"
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
function pavementPlotlyChart2() {
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
      var trace1 = {
        x: x,
        y: good,
        name: "% Good: IRI < 95 in/mi",
        type: "bar",
        marker: { color: "rgb(40, 167, 69)" }
      };
      var trace3 = {
        x: x,
        y: fair,
        name: "% Fair: IRI {95,170} in/mi",
        type: "bar",
        marker: { color: "rgb(255, 193, 7)" }
      };
      var trace5 = {
        x: x,
        y: poor,
        name: "% Poor: IRI > 170 in/mi",
        type: "bar",
        marker: { color: "rgb(220, 53, 69)" }
      };
      var data = [trace1, trace3, trace5];
      var layout = {
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
      Plotly.newPlot("pavementPlotlyChart", data, layout, { responsive: true });
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
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85",
          "Target: 85"
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
            y0: 85,
            x1: 1,
            y1: 85,
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
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80",
          "Target: 80"
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
            y0: 80,
            x1: 1,
            y1: 80,
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
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75",
          "Target: 75"
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
            y0: 75,
            x1: 1,
            y1: 75,
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
  fetch("https://dashboard.udot.utah.gov/resource/59ex-6nx9.json?$order=year")
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var y = new Array(); //This will house data but will be reset after each loop
      for (var i = 0; i < j.length; i++) {
        x.push(parseInt(j[i]["year"]));
        y.push(parseFloat(j[i]["percent_operational"]));
      }
      var operational = {
        x: x,
        y: y,
        mode: "lines+markers",
        name: "% of ATMS Devices in Operation",
        text: ["Target: 90"],
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
//Signal Condition Bart Stacked Chart
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
            y0: 95,
            x1: 1,
            y1: 95,
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
        .getElementById("zf-goalpage-doughut-chart")
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
            piData.push(parseInt(j[i]["avg_safety"]));
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
            "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?$select=tf_index,tsi_index,tc_index,if_index,ii_index,ed_index&entity=Statewide";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["ed_index"]),
                parseFloat(j[0]["if_index"]),
                parseFloat(j[0]["ii_index"]),
                parseFloat(j[0]["tc_index"]),
                parseFloat(j[0]["tf_index"]),
                parseFloat(j[0]["tsi_index"])
              ];
              var kpiChartData = {
                labels: [
                  [["UDOT"],["Equip"],["Dam: 5%"]],
                  [["UDOT"],["Fatal"],["Inj 28%"]],
                  [["UDOT"], ["Inj: 10%"]],
                  [["Traffic"], ["Crashes: 8%"]],
                  [["Traffic"],["Fatals: 29%"]],
                  [["Traffic"],["Inj: 20%"]]
                ],
                datasets: [
                  {
                    data: targetMet,
                    backgroundColor: "#5b87c6"
                  }
                ]
              };
              var zfKPIChart = document.getElementById("zf-kpi-chart");
              new Chart(zfKPIChart, {
                type: "bar",
                data: kpiChartData,
                options: {
                  scales: {
                    xAxes: [{ stacked: true, ticks: { fontSize: 9,autoSkip: false, maxRotation: 0} }],
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
//zero fatalities performance measure chart
function zeroFatalitiesPM(region) {
  fetch(
    "https://dashboard.udot.utah.gov/resource/4yir-8226.json?$order=year&$where=region='" +
      region +
      "'"
  )
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var fat = new Array(); //This will house data but will be reset after each loop
      var fatT = new Array(); //This will house data but will be reset after each loop
      var inj = new Array(); //This will house data but will be reset after each loop
      var injT = new Array(); //This will house data but will be reset after each loop
      var cra = new Array(); //This will house data but will be reset after each loop
      var craT = new Array(); //This will house data but will be reset after each loop
      for (var i = 0; i < j.length; i++) {
        if (
          j[i]["category"] === "Fatalities" &&
          parseInt(j[i]["year"]) > 2010
        ) {
          x.push(parseInt(j[i]["year"]));
          fat.push(parseInt(j[i]["actual"]));
          fatT.push(parseInt(j[i]["target"]));
        } else if (
          j[i]["category"] === "Injuries" &&
          parseInt(j[i]["year"]) > 2010
        ) {
          inj.push(parseInt(j[i]["actual"]));
          injT.push(parseInt(j[i]["target"]));
        } else if (
          j[i]["category"] === "Crashes" &&
          parseInt(j[i]["year"]) > 2010
        ) {
          cra.push(parseInt(j[i]["actual"]));
          craT.push(parseInt(j[i]["target"]));
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
      Plotly.newPlot("trafficInjuries", data, layout);
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
      Plotly.newPlot("trafficCrashes", data, layout);
      //refetch different query and hope that it works and plot internal fatalities
      fetch(
        "https://dashboard.udot.utah.gov/resource/cd7e-zhau.json?$select=statewide,year"
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          x = [];
          fat = []; //recyle variables as much as possible
          for (var i = 0; i < j.length; i++) {
            x.push(parseInt(j[i]["year"]));
            fat.push(parseInt(j[i]["statewide"]));
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
          //refetch different query and hope that it works and plot internal injuries and equipment damage
          var url = "https://dashboard.udot.utah.gov/resource/jvx4-hyvf.json";
          fetch(
            url +
              "?$select=sorting_order,damage_rate,damage_target,injury_rate,injury_target&$where=sorting_order>201710&$order=sorting_order asc"
          )
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              x = [];
              fat = []; //recycle variables, use for rate
              fatT = []; //use for target
              inj = [];
              injT = [];
              for (var i = 0; i < j.length; i++) {
                //Damage and injury rates are not available after the 15th of each month for the past month if both are zero for loop skips.
                //This is temporary measure till more fixed soluing is investigated.
                if (
                  parseFloat(j[i]["damage_rate"]) == 0 &&
                  parseFloat(j[i]["injury_rate"]) == 0
                ) {
                  continue;
                }
                x.push(j[i]["sorting_order"]);
                fat.push(parseFloat(j[i]["damage_rate"]));
                fatT.push(parseFloat(j[i]["damage_target"]));
                inj.push(parseFloat(j[i]["injury_rate"]));
                injT.push(parseFloat(j[i]["injury_target"]));
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
              //Draw Damage Rate Plat
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
                    max: 100,
                    maxRotation: 0,
                    autoSkip: false
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
            "https://dashboard.udot.utah.gov/resource/rqv9-ry2j.json?$select=delay,reliability,mode_split,snow&entity=Statewide";
          fetch(url)
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              var targetMet = [
                parseFloat(j[0]["delay"]),
                parseFloat(j[0]["reliability"]),
                parseFloat(j[0]["mode_split"]),
                parseFloat(j[0]["snow"])
              ];
              var targetRem = [
                100 - parseFloat(j[0]["delay"]),
                100 - parseFloat(j[0]["reliability"]),
                100 - parseFloat(j[0]["mode_split"]),
                100 - parseFloat(j[0]["snow"])
              ];
              var kpiChartData = {
                labels: [
                  [["Delay"],["30%"]],
                  [["Reliability"],["35%"]],
                  [["Mode"],["Split 11%"]],
                  [["Snow"],["Removal 24%"]]
                ],
                datasets: [
                  {
                    label: "Target Met",
                    data: targetMet,
                    backgroundColor: "#5b87c6"
                  }
                ]
              };
              var omKPIChart = document.getElementById("om-kpi-chart");
              new Chart(omKPIChart, {
                type: "bar",
                data: kpiChartData,
                options: {
                  scales: {
                    xAxes: [{ stacked: true, ticks: { fontSize: 10, maxRotation: 0, autoSkip: false } }],
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
//Optimize mobility Peformance Charts
function optimizeMobilityCharts() {
  //fetach and draw delay
  //var delayUrl = "https://dashboard.udot.utah.gov/resource/whr3-7dxf.json?$select=i_15_delay,total,date&$where=not(month=%22Year%22)and%20not(sequence=55)&$order=sequence";
  var delayUrl =
    "https://dashboard.udot.utah.gov/resource/thgc-uvda.json?$select=date,delay_hours,month_target&$where=entity=%27Statewide%27and%20year%20%3E=2016";
  fetch(delayUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(j) {
      var x = new Array(); //This will contain years in chart
      var y = new Array(); //This will house data but will be reset after each loop
      var z = new Array();
      for (var i = 0; i < j.length; i++) {
        x.push(dateBreaker(j[i]["date"]));
        y.push(parseInt(j[i]["delay_hours"]));
        z.push(parseInt(j[i]["month_target"]));
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
      //var relUrl = "https://dashboard.udot.utah.gov/resource/mfvh-usiw.json?$select=reliability_score,season,target&$where=year%20%3E%202014&$order=sequence";
      var relUrl =
        "https://dashboard.udot.utah.gov/resource/kxg8-qy3e.json?$select=date,reliability_measure,target&$where=entity=%27Statewide%27and%20year%3E=2016";
      fetch(relUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(j) {
          x = [];
          y = [];
          z = [];
          for (var i = 0; i < j.length; i++) {
            x.push(dateBreaker(j[i]["date"]));
            y.push(parseInt(j[i]["reliability_measure"]));
            z.push(parseInt(j[i]["target"]));
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
          fetch("https://dashboard.udot.utah.gov/resource/nc2g-cvvu.json")
            .then(function(response) {
              return response.json();
            })
            .then(function(j) {
              x = [];
              y = [];
              z = [];
              for (var i = 0; i < j.length; i++) {
                x.push(j[i]["year"]);
                y.push(parseInt(j[i]["auto_trips_state"]));
                z.push(parseInt(j[i]["transit_trips_state"]));
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
