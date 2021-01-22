
module.exports =  (io,socket)=>{
  socket.on("onlineAdmin", function(data) {
    try {
      if(data && data.adminId){
        console.log("connection admin id:",data.adminId);
        io.to(socket.id).emit("onlineAdminOk", { status: 200 });
        socket.join(data.adminId);
      }
    } catch (error) {
    }
  });
}