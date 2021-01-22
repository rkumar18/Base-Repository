let crypto                      = require('crypto');
let handlebars                  = require('handlebars');
let Promise                     = require("bluebird")

let commonConfig                = require('../lib/constants/constants')
let algorithm                   = 'aes-256-ctr';
let secret_key                  = 'abcd1234abcd';

// let commonConfig = require('./../modules/config/common_config');

exports.encrypt = function(text){
  let cipher = crypto.createCipher(algorithm,secret_key);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

exports.generateRandomStringAndNumbers = function () {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

exports.generateAccessToken = function(input, userID) {
  let string;
  let string2 = '';
  if (userID) {
    string = userID + ".";
  }
  if (input) {
    string2 += input;
  }
  string2 += module.exports.generateRandomStringAndNumbers() + new Date().getTime();
  string = module.exports.encrypt(string2);
  return string;
};

exports.createSearchString = function(searchVar, columnsArray){
  let searchString = ``
  if(columnsArray.length){
    searchString+= `AND ( `;
    for(let i=0; i<columnsArray.length; i++){
      searchString+= i? ` OR `:``
      searchString+= columnsArray[i] + ` LIKE `+ '"%' + searchVar + '%"';
    }
    searchString+=' ) '
  }
  return searchString;
}

exports.getRoles = (userType, roleToFind)=>{
  let role = commonConfig.mappings.peek_user_role
  let roles = []
  while (role>0){
    if (userType / role >= 1) {
      if (roleToFind){
        if (role == roleToFind) 
          return true
      } else 
        roles.push(role)
      userType -= role
    }
    role = Math.floor(role/2)
  }
  if (roleToFind) 
    return false
  return roles
}

exports.makeCaseWhenQuery = (conditionKey, updateArray) => {
  let helperObj = {}, multUpdateString = []
  for (let updateObj of updateArray) {
    for (let key of Object.keys(updateObj)) {
      if (key != conditionKey) {
        if (!helperObj[key])
          helperObj[key] = `(CASE `
        helperObj[key] += ` WHEN ${conditionKey} = ${updateObj[conditionKey]} THEN "${updateObj[key]}" `
      }
    }
  }
  for (let key of Object.keys(helperObj)){
    multUpdateString.push(`${key} =  ${helperObj[key]} END) `)
  }
}

exports.makeMultiInsertQuery = (tableName, conditionKey, updateArray, universalObject, upSert = false) => {
  let keyList = [], valueList = [], values, upSertList = [], value_to_push
  let query_string = `INSERT INTO \`${tableName}\` ( `
  let flag = true
  for (let updateObj of updateArray) {
    values= []
    updateObj = {...updateObj, ...universalObject}  
    for (let key of Object.keys(updateObj)) {
      if (flag)
        keyList.push(key)
      value_to_push = (typeof updateObj[key] == "object") ? JSON.stringify(updateObj[key]) : updateObj[key]
      values.push(value_to_push)
      if (upSert && conditionKey!=key && flag)
        upSertList.push(`${key} = VALUES(${key})`)
    }
    flag =false
    valueList.push(values)
  }

  query_string += keyList.join(", ") +  " ) VALUES ? "
  if (upSertList.length)
    query_string += " ON DUPLICATE KEY UPDATE " + upSertList.join(", ")
  return [query_string, valueList]
}
