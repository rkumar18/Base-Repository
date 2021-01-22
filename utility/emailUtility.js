
exports.validateEmailContentKeys                       = validateEmailContentKeys;
exports.getEmailsFromString                            = getEmailsFromString;

function validateEmailContentKeys (emailFields, requiredEmailFields) {
    //always send requiredEmailFields as array, and emailFields as JSON object
    if (emailFields && Array.prototype.isPrototypeOf(requiredEmailFields)) {
        for (var i = 0; i < requiredEmailFields.length; i++) {

            if (!emailFields.hasOwnProperty(requiredEmailFields[i])
                || !Array.prototype.isPrototypeOf(emailFields[requiredEmailFields[i]])
                || emailFields[requiredEmailFields[i]].length == 0) {
                return false;
            }
        }
        //valid email
        return true;
    }
    else {
        return false;
    }
};

function getEmailsFromString (string) {
    var regex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;
    var emails = string.match(regex);
    return emails;
}