module.exports =  (io,socket)=>{
  socket.on("onlineDriver", function(data) {
    try {
      if(data && data.driverId){
        console.log("connection driver id:",data.driverId,socket.id);
        io.to(socket.id).emit("onlineDriverOk", { status: 200 });
        socket.join(data.driverId);
      }
    } catch (error) {
      console.log(error);
    }
  });
}