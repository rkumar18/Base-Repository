// let async           = require('async');
// let Promise         = require('bluebird');

// let userServices = require('./../user/services/userServices'); //UPDATE PATH TO USERS MODULE


// exports.socketInitialize = function (httpsServer) {
//     console.log('start socketInitialize');
//     let socketIO = require('socket.io').listen(httpsServer);

//     process.on('socket',  function (data) {
//         console.log("\n\n\n\n\n\n\n\n --------------------------------\n\n\n\n\n\n\n", data)
//         socketIO.to(data.socket_id).emit('status_change', JSON.stringify(data));
//     });

//     socketIO.on('connection', function (socket) {
//         if(!config.get('socketAllowedOrigin').includes(socket.request.headers.origin)){
//             socket.conn.close();
//         }

//         socket.on('message', function (data) {
//             console.log("connect with new user 1 ", data)

//             if(!data.access_token){
//                 return;
//             }
//             console.log("connect with new user 0 ")

//             Promise.coroutine(function* () {
//                 console.log("connect with new user")
//                 let userDetails =  yield userServices.getUserDetails({}, {access_token: data.access_token});
//                 console.log("USERDETAILS>>>",userDetails)
//                 if(!userDetails.length){
//                     return;
//                 }
//                 userDetails = userDetails[0];
//                 console.log("connect with new user", userDetails.user_id + config.get('quoteIdPrefix') + socket.id);
//                 module.exports.insert_into_redis_users(userDetails.user_id + config.get('quoteIdPrefix') + socket.id, socket.id);
//                 module.exports.insert_into_redis_customers(userDetails.user_id + config.get('quoteIdPrefix') + socket.id, socket.id);
//             })().then((data) => {
//             }, (error) => {
//                 console.log(error);
//             });
//         });

//         socket.on('disconnect', function (data) {
//             socket.conn.close();
//             module.exports.deleting_from_redis_users(socket.id);
//             module.exports.deleting_from_redis_customers(socket.id);
//         });

//         socket.on('disconnect_user', function (data) {
//             console.log("rfvejrkfjehrfbkenrfkj");
//             socket.conn.close();
//             module.exports.deleting_from_redis_users(socket.id);
//             module.exports.deleting_from_redis_customers(socket.id);
//         });
//     });
//     console.log('end socketInitialize');
// };