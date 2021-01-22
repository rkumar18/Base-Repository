const ses     = require('node-ses');
const Promise = require('bluebird');
const handlebars = require('handlebars');

let sesClient = ses.createClient(config.get('emailCredentials.aws'));

exports.sendEmailToAddress = function(apiContext, emailData, emailAddress){
    emailData.to = emailAddress;
    sesClient.sendEmail(emailData, function (err, data, res) {
        console.log("SEND EMAIL ERROR>>>>", err, emailData, emailAddress);
        console.log("SEND EMAIL DATA>>>>", data);
        console.log("SEND EMAIL RES>>>>>>", res);
        });
}

exports.sendEmailTemplateToAddress = function(apiContext, emailAddress, emailTemplate, emailData){
    emailTemplate.subject = handlebars.compile(emailTemplate.subject)(emailData);
    emailTemplate.message = handlebars.compile(emailTemplate.message)(emailData);
    emailData.to = emailAddress;
    sesClient.sendEmail(emailData, function (err, data, res) {
        console.log("SEND EMAIL TEMPLATE ERROR>>>>", err, emailData, emailAddress);
        console.log("SEND EMAIL TEMPLATE DATA>>>>", data);
        console.log("SEND EMAIL TEMPLATE RES>>>>>>", res);
        });
}