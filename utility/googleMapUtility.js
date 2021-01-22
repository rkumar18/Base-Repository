var logging                       = require('../logging/logging');


exports.getGoogleStaticMapUrl     = getGoogleStaticMapUrl;
exports.parseReverseGeocodeResult = parseReverseGeocodeResult;

function getGoogleStaticMapUrl(){
  var url = 'https://maps.googleapis.com/maps/api/staticmap?key='+config.get('googleCredentials.apiKey')+'&size=800x400&format=pngg&sensor=false&' +
    'path=color%3a0x0000FF99%7Cweight:7';
  return url;
}

function parseReverseGeocodeResult(apiContext, opts){
  var googleResult = opts.googleResult;
  logging.log(apiContext, {EVENT : "inside parseReverseGeocodeResult", googleResult : googleResult});

  var zeroIndex = '';
  var firstIndex = '';
  if(!googleResult.results || (googleResult.results).length == 0){
    opts.address = '';
    return;
  }
  if(googleResult.results[0]){
    zeroIndex = googleResult.results[0].formatted_address;
  }
  if(googleResult.results[1]){
    firstIndex = googleResult.results[1].formatted_address;
  }

  var zeroIndexArray = zeroIndex.split(',');
  var searchWord = '';
  if(zeroIndexArray[0]){
    searchWord = zeroIndexArray[0].trim().toLowerCase();
  }
  if(searchWord == 'unnamed' && firstIndex){
    opts.address = firstIndex;
    return;
  }
  opts.address = zeroIndex;
  return;
}