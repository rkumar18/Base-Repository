

var Promise                            = require('bluebird');
 var fs                                = Promise.promisifyAll(require('fs'));

exports.replaceText                   = replaceText;
exports.removeLineBreakCharacters     = removeLineBreakCharacters;
exports.replaceText                   = replaceText;
exports.filterPhoneNo                 = filterPhoneNo;
exports.millisecondsToDuration        = millisecondsToDuration;
exports.getUserNameFromEmail          = getUserNameFromEmail;
exports.generateRandomStringAndNumbers= generateRandomStringAndNumbers;
exports.checkIfFileExists             = checkIfFileExists;

function checkIfFileExists(path){
  return new Promise((resolve, reject) => {
    fs.exists(path, function(data){
     resolve(data)
    })
  })
}

//adding replaceAll function in string object
String.prototype.replaceAll = function (target, replacement) {
  return this.split(target).join(replacement);
};

function removeLineBreakCharacters(string) {
  string = string.replace(/(\r\n|\n|\r)/gm, " ");
  return string;
}

function replaceText(msg, data) {
  data.forEach(function (d) {
    msg = msg.replaceAll(d.inp, d.data);
  });
  return msg;
}

function filterPhoneNo(phone, removeCharacter, replaceComma){
  removeCharacter = removeCharacter || [];
  if(phone){
    phone = phone.toString();
    phone = phone.replaceAll(" ", "");
    phone = phone.replaceAll("(", "");
    phone = phone.replaceAll(")", "");
    phone = phone.replaceAll("-", "");
    phone = phone.replaceAll("undefined", "");
    phone = phone.replaceAll("_", "");
    if(replaceComma) {
      phone = phone.replaceAll(",", "");
    }
    removeCharacter.forEach(function (ch) {
      phone = phone.replaceAll(ch, "");
    })
  }
  return phone;
}

function millisecondsToDuration(milliseconds) {
  var temp = Math.floor(milliseconds / 1000);

  function numberEnding(number) {
    return (number > 1) ? 's, ' : ', ';
  }

  var days  =  Math.floor(temp / 86400);
  var hours =  Math.floor((temp % 86400) / 3600);
  var minutes = Math.floor((temp % 3600) / 60);
  var seconds = temp % 60;
  var str = "";

  if (days) {
    str += days + " day"+ numberEnding(days);
  }
  if (hours) {
    str += hours + " hour"+ numberEnding(hours);
  }
  if (minutes) {
    str += minutes + " minute"+ numberEnding(minutes);
  }
  if (seconds) {
    str += seconds + " second"+ numberEnding(seconds);
  }
  if (!str.length){
    str+="less than a second  ";
  }
  return str.slice(0,-2);
}

function getUserNameFromEmail (email) {
  if (!email || !email.toString().includes("@")) {
    return;
  }
  email = email.toString();
  email = email.slice(0, email.indexOf("@"));
  var specialCharacterIndex = email.length - 1;
  var specialCharacterRegex = /[^A-Za-z0-9]/;
  return email.split(specialCharacterRegex)[0];
}



function generateRandomStringAndNumbers(appendTime) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  if(appendTime) text += new Date().getTime();
  return text;
}