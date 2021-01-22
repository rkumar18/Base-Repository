module.exports =  (io,socket)=>{
  socket.on("onlineResturant", function(data) {
    try {
      if(data && data.resturantId){
        console.log("connection resturant id:",data.resturantId,socket.id);
        io.to(socket.id).emit("onlineResturantOk", { status: 200 });
        socket.join(data.resturantId);
      }
    } catch (error) {
      console.log(error);
    }
  });
}