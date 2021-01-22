
// exports.redis_client = {
//     validate_connection: function () {
//       return this.connect(1);
//     },
//     get_keys: function (pattern) {
//       return new Promise((resolve, reject) => {
//             redis_client.keys(pattern, function (error, keys) {
//               if (error) {
//                 logger.error({
//                   context: "Cache Services",
//                   event: "Redis Get Keys Error",
//                   message: "Error in getting keys with pattern > " + pattern
//                 });
//                 return reject(error);
//               } else {
//                 logger.info({
//                   context: "Cache Services",
//                   event: "Redis Get Keys",
//                   message: "Keys for " + pattern + " are " + keys
//                 });
//                 return resolve(keys);
//               }
//             })
//               .catch(() => {
//                 logger.error({
//                   context: "Cache Services",
//                   event: "Redis Get Keys Error",
//                   message: "Unable to validate connection."
//                 });
//                 return reject();
//               });
//       });
  
//     },
//     get_value: function (key) {
//       return new Promise((resolve, reject) => {
//         this.validate_connection()
//           .then(() => {
//             redis_client.get(key, function (error, value) {
//               if (error) {
//                 logger.error({
//                   context: "Cache Services",
//                   event: "Redis Get Value Error",
//                   message: "Error in getting keys with pattern > " + key
//                 });
//                 return reject(error);
//               } else {
//                 logger.info({
//                   context: "Cache Services",
//                   event: "Redis Get Value",
//                   message: "Value for " + key + " is " + value
//                 });
//                 return resolve(value);
//               }
//             });
//           })
//           .catch(() => {
//             logger.error({
//               context: "Cache Services",
//               event: "Redis Get Value Error",
//               message: "Unable to validate connection."
//             });
//             return reject();
//           });
//       });
//     },
//     set_value: function (key, value, timeout) {
//       return new Promise((resolve, reject) => {
//         this.validate_connection()
//           .then(() => {
//             redis_client.set(key, (typeof value === "object" ? JSON.stringify(value) : value));
//             if (timeout) {
//               redis_client.expire(key, timeout);
//             }
//             logger.info({
//               context: "Cache Services",
//               event: "Redis Set Value ",
//               message: "Set " + value + " for " + key + " in redis." + timeout ? " with timeout " + timeout : ""
//             });
//           })
//           .catch(() => {
//             logger.error({
//               context: "Cache Services",
//               event: "Redis Set Value Error",
//               message: "Unable to validate connection."
//             });
//             return reject();
//           });
//       });
//     },
//     delete_key: function (key) {
//       return new Promise((resolve, reject) => {
//         this.validate_connection()
//           .then(() => {
//             logger.info({
//               context: "Cache Services",
//               event: "Redis Delete Value ",
//               message: "Deleted " + key + " from redis."
//             });
//             redis_client.del(key);
//           })
//           .catch(() => {
//             logger.error({
//               context: "Cache Services",
//               event: "Redis Delete Value Error",
//               message: "Unable to validate connection."
//             });
//             return reject();
//           });
//       });
//     }
//   }