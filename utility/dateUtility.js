

exports.formatDate                       = formatDate;
exports.addDay                           = addDay;

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

function addDay(date) {
  var newDate = new Date(date);
  newDate.setTime(newDate.getTime() + 86400000); // add a date
  return new Date(newDate).toDateString();
}