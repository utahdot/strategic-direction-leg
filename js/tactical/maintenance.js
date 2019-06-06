function loadDraw(region) {
  var corsanyWhere = "https://cors-anywhere.herokuapp.com/";
  var gsheets = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2DK_5guFPdrRmfFGlh3hXz0l82g2i-XqSsqwl6ZtE8ZgTBIkYGNKn4xmLhYQ9krjU-BJyDxjmC0ZT/pub?output=csv";
  fetch(
    gsheets
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      var data = JSON.parse(csvJSON(data));
      if (region !== "0") {
        var canvWrapper = document.getElementById("regionBarWrapper");
        var oldCanv = document.getElementById('regionBar');
        var newCanv = document.createElement('canvas');
        newCanv.id = "regionBar";
        canvWrapper.replaceChild(newCanv,oldCanv);
        data = data.filter(val => { return val.UDOT_REGION === region });
      }
      document.getElementById("budget").innerHTML = 0;
      console.log(data);
      var budget = 0;
      var expend = 0;
      var currFis = getCurrentFiscalYear();
      var table = "<table class='table'><tr><th>Region</th><th>Budget</th><th>Expenditures</th><th>Difference</th></tr>"
      for (var x = 0; x < data.length; x++) {
        if (data[x]["FISCAL_YEAR"] === currFis[0]["FiscalYear"]) {
          budget += parseFloat(data[x]["BUDGET"]);
          expend += parseFloat(data[x]["EXPENDITURES"]);
          table += `<tr><td>${data[x]["UDOT_REGION"]}</td><td>${formatter.format(data[x]["BUDGET"])}</td><td>${formatter.format(data[x]["EXPENDITURES"])}</td>`;
          table += `<td>${formatter.format(parseFloat(data[x]["BUDGET"]) - parseFloat(data[x]["EXPENDITURES"]))}</td></tr>`;
        } else {
          budget = 0;
          expend = 0;
        }
      }
      table += "<table>"
      document.getElementById('regionTable').innerHTML = table;
      var expendProj = Math.round(((expend / (365 - currFis[0]["DaysLeft"])) * currFis[0]["DaysLeft"]) + expend);
      var budgetPercent = parseInt(parseFloat(expend / budget) * 100);
      animateValue("budgetPercent", 0, budgetPercent, 3000);
      document.getElementById("budgetProgress").setAttribute("aria-valuenow", budgetPercent);
      document.getElementById("budgetProgress").setAttribute("style", "width:" + budgetPercent + "%");
      var elem = document.getElementById("budget");
      elem.setAttribute("data-inc-value", budget);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      });
      elem = document.getElementById("expend");
      elem.setAttribute("data-inc-value", expend);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      })
      elem = document.getElementById("expendProj");
      elem.setAttribute("data-inc-value", expendProj);
      new Inc({
        elem: elem,
        speed: 90,
        decimal: 0,
        currency: '$'
      })
      if (expendProj <= budget) {
        document.getElementById("indicator").setAttribute("class", "fas fa-angle-down fa-3x text-success")
      } else if (expendProj > budget) {
        document.getElementById("indicator").setAttribute("class", "fas fa-angle-up fa-3x text-warning")
      }
      var fisYears = [];
      var budgetArr = [];
      var expendArr = [];
      var budgetSum = 0;
      var expendSum = 0;
      for (var x = 0; x < data.length; x++) {
        if (region !== "0") {
          fisYears.push(data[x]["FISCAL_YEAR"]);
          budgetArr.push(parseFloat(data[x]["BUDGET"]));
          expendArr.push(parseFloat(data[x]["EXPENDITURES"]));
        } else {
          budgetSum += parseFloat(data[x]["BUDGET"]);
          expendSum += parseFloat(data[x]["EXPENDITURES"]);
          if (data[x]["UDOT_REGION"] == "4") {
            fisYears.push(data[x]["FISCAL_YEAR"]);
            budgetArr.push(budgetSum);
            budgetSum = 0;
            expendArr.push(expendSum);
            expendSum = 0;
          }

        }
      }
      var budgetData = {
        label: "Budget",
        data: budgetArr,
        backgroundColor: 'rgba(0,99,1332,0.6)',
        borderWidth: 0,
        yAxisId: 'y-axis-budget'
      }
      var expedData = {
        label: "Expenditures",
        data: expendArr,
        backgroundColor: 'rgba(99,132,0,0.6)',
        borderWidth: 0,
        yAxisId: 'y-axis-expend'
      }

      var barData = {
        labels: fisYears,
        datasets: [budgetData, expedData]
      }

      var ctx = document.getElementById("regionBar");
      var maintenanceBarChart = new Chart(ctx, {
        type: 'bar',
        data: barData,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
}