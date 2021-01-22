

const { ObjectID } = require('mongodb');

exports.find = function (apiContext, collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).find(criteria, options).toArray(function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "find", msg: { criteria, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "find", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};

exports.findOne = function (apiContext, collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).findOne(criteria, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "findOne", msg: { criteria, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "findOne", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};

exports.insertOne = function (apiContext, collectionName, insertData, options) {
    return new Promise((resolve, reject) => {
        database.collection(collectionName).insertOne(insertData, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "insertOne", msg: { insertData, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "insertOne", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else if (error.code == 11000 && error.keyPattern) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.insertMany = function (apiContext, collectionName, insertDataArray, options) {
    return new Promise((resolve, reject) => {
        database.collection(collectionName).insertMany(insertDataArray, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "insertMany", msg: { insertDataArray, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "insertMany", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.updateOne = function (apiContext, collectionName, criteria, updateData, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        const update = {};
        if (updateData) {
            if (updateData['$push']) {
                update['$push'] = updateData['$push'];
                delete updateData['$push'];
            }
            if (updateData['$pull']) {
                update['$pull'] = updateData['$pull'];
                delete updateData['$pull'];
            }
            update['$set'] = updateData;
        }
        database.collection(collectionName).updateOne(criteria, update, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "updateOne", msg: { criteria, updateData, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "updateOne", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.updateMany = function (apiContext, collectionName, criteria, updateData, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        const update = {};
        if (updateData) {
            if (updateData['$push']) {
                update['$push'] = updateData['$push'];
                delete updateData['$push'];
            }
            if (updateData['$pull']) {
                update['$pull'] = updateData['$pull'];
                delete updateData['$pull'];
            }
            update['$set'] = updateData;
        }
        database.collection(collectionName).updateMany(criteria, update, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "updateMany", msg: { criteria, updateData, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "updateMany", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.deleteOne = function (apiContext, collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).deleteOne(criteria, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "deleteOne", msg: { criteria, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "deleteOne", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.deleteMany = function (apiContext, collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).deleteMany(criteria, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "deleteMany", msg: { criteria, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "deleteMany", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.findOneAndUpdate = function (apiContext, collectionName, criteria, updateData, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        const update = {};
        if (updateData) {
            if (updateData['$push']) {
                update['$push'] = updateData['$push'];
                delete updateData['$push'];
            }
            if (updateData['$pull']) {
                update['$pull'] = updateData['$pull'];
                delete updateData['$pull'];
            }
            update['$set'] = updateData;
        }
        database.collection(collectionName).findOneAndUpdate(criteria, update, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "findOneAndUpdate", msg: { criteria, updateData, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "findOneAndUpdate", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.findOneAndDelete = function (apiContext, collectionName, criteria, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).findOneAndDelete(criteria, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "findOneAndDelete", msg: { criteria, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "findOneAndDelete", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};


exports.findOneAndReplace = function (apiContext, collectionName, criteria, updateData, options) {
    return new Promise((resolve, reject) => {
        if (criteria && criteria.hasOwnProperty('_id') && criteria['_id']) {
            criteria['_id'] = new ObjectID(criteria['_id']);
        }
        database.collection(collectionName).findOneAndUpdate(criteria, updateData, options, function (error, result) {
            if (apiContext && !apiContext.silent)
                logger.info({ context: apiContext.context, event: "findOneAndReplace", msg: { criteria, updateData, options } });
            if (error) {
                logger.error({ context: apiContext.context, event: "findOneAndReplace", msg: error.toString() });
                if (error.errmsg === 'Document failed validation' || error.code == 121) {
                    return reject(error);
                } else {
                    return reject(error);
                }
            }
            resolve(result);
        });
    });
};