function csvJSON(csv) {
  var lines = csv.split("\r\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return JSON.stringify(result);
}
function animateValue(id, start, end, duration) {
  var range = end - start;
  var current = start;
  var increment = end > start ? 1 : -1;
  var stepTime = Math.abs(Math.floor(duration / range));
  var obj = document.getElementById(id);
  var timer = setInterval(function () {
    current += increment;
    obj.innerHTML = current;
    if (current == end) {
      clearInterval(timer);
    }
  }, stepTime);
}
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

function Inc(obj) {
  var elem = obj.elem;
  var input = elem.nodeName.toLowerCase() === "input" ? true : false;
  var value = parseFloat(elem.getAttribute("data-inc-value")) || 0;
  var duration = parseInt(elem.getAttribute("data-inc-duration")) || 0;
  var delay = parseInt(elem.getAttribute("data-inc-delay")) || 0;
  var decimal = (obj.decimal > 2 ? 2 : obj.decimal) || 0;
  var currency = obj.currency || "";
  var speed = (obj.speed < 30 ? 30 : obj.speed) || 30;
  var count = 0;
  var increment = value / (duration / speed);
  var interval = null;
  var regex = /\B(?=(\d{3})+(?!\d))/g;
  var run = function () {
    count += increment;
    if (count < value) {
      input
        ? (elem.value =
          currency +
          count
            .toFixed(decimal)
            .toString()
            .replace(regex, ","))
        : (elem.innerHTML =
          currency +
          count
            .toFixed(decimal)
            .toString()
            .replace(regex, ","));
    } else {
      clearInterval(interval);
      input
        ? (elem.value =
          currency +
          value
            .toFixed(decimal)
            .toString()
            .replace(regex, ","))
        : (elem.innerHTML =
          currency +
          value
            .toFixed(decimal)
            .toString()
            .replace(regex, ","));
    }
  };
  setTimeout(
    function () {
      interval = setInterval(run.bind(this), speed);
    }.bind(this),
    delay
  );
  this.reset = function () {
    clearInterval(interval);
    value = parseFloat(elem.getAttribute("data-inc-value")) || 0;
    duration = parseInt(elem.getAttribute("data-inc-duration")) || 0;
    increment = value / (duration / speed);
    delay = parseInt(elem.getAttribute("data-inc-delay")) || 0;
    count = 0;
    interval = setInterval(run, speed);
  }.bind(this);
} // Inc

function getCurrentFiscalYear() {
  //get current date
  var today = new Date();
  //get current month
  var curMonth = today.getMonth();
  var fiscalYr = "";
  if (curMonth > 6) {
    //
    fiscalYr = (today.getFullYear() + 1).toString();
  } else {
    fiscalYr = today.getFullYear().toString();
  }
  fisEnd = new Date(fiscalYr, 6, 1);
  fisStart = new Date(fiscalYr - 1, 6, 1);
  var datedif = Math.floor(
    (Date.UTC(fisEnd.getFullYear(), fisEnd.getMonth(), fisEnd.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
    (1000 * 60 * 60 * 24)
  );
  return [{ "FiscalYear": fiscalYr, "DaysLeft": datedif, "PercenDaysLeft": Math.floor((datedif / 365) * 100) }];
}

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
