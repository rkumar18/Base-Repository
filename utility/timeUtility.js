

exports.convertTimeIntoLocal                   = convertTimeIntoLocal;
exports.timeDifferenceInWords                  = timeDifferenceInWords;


function convertTimeIntoLocal(date, timezone) {
  if (timezone == undefined || date == '0000-00-00 00:00:00') {
    return date;
  } else {
    var newDate = new Date(date), operator = timezone[0], millies = (timezone * 60 * 1000);
    if (operator == "-") {
      newDate.setTime(newDate.getTime() - millies)
    } else {
      newDate.setTime(newDate.getTime() - millies)
    }
    return newDate;
  }
}

function timeDifferenceInWords (gps, available, date1) {
  var time = date1;
  var final;
  var diff;
  if (time < 60) {
    if (time <= 1) {
      time = "1 second ago";
    } else {
      time = time + " seconds ago";
    }
  } else if (time < 3600) {
    diff = parseInt(time / 60);
    if (diff <= 1) {
      time = "1 minute ago";
    } else {
      time = diff + " minutes ago";
    }
  } else if (time < 86400) {
    diff = parseInt(time / 3600);
    if (diff <= 1) {
      time = "1 hour ago";
    } else {
      time = diff + " hours ago";
    }
  } else if (time > 86400) {
    diff = parseInt(time / 86400);
    if (diff <= 1) {
      time = "1 day ago";
    } else {
      time = diff + " days ago";
    }
  }
  final = time;
  if (available) {
    time = time.toString().split(' ago').join('');
    if (gps) {
      if (date1 < 60) {
        if (date1 <= 1) {
          date1 = "1 second ago";
        } else {
          date1 = date1 + " seconds ago";
        }
      } else {
        diff = parseInt(date1 / 60);
        if (diff <= 1) {
          date1 = "1 minute ago";
        } else if (diff < 6) {
          date1 = diff + " minutes ago";
        } else if (diff >= 6 && diff <= 11) {
          date1 = "Poor Connectivity";
        } else if (diff > 11) {
          date1 = "Connection Lost";
        }
      }
    } else {
      date1 = "GPS Turned Off";
    }
    final = date1;
  }
  return final;
}