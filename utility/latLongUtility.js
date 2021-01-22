

exports.isValidLng                = isValidLng;
exports.isValidLat                = isValidLat;
exports.isValidPoints             = isValidPoints;

function isValidLng(point) {
  var regex = /^[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)$/g;
  var isValid = regex.test(point);
  return (isValid);
}

function isValidLat(point) {
  var regex = /^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/g;
  var isValid = regex.test(point);
  return (isValid);
}

function isValidPoints(points) {
  var regex = /^([-+]?)([\d]{1,2})(((\.)(\d+)(,)))(\s*)(([-+]?)([\d]{1,3})((\.)(\d+))?)$/g;
  var isValid = regex.test(points);
  return (isValid);
}