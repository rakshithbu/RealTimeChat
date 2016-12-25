"use strict";
module.exports = (io,rooms)=>{
   var chatRooms = io.of("/roomList").on('connection',(socket)=>{
       console.log("Conection established on server");
       socket.emit('roomUpdate',JSON.stringify(rooms));

       socket.on('newRoom',(data)=>{
           rooms.push(data);
           socket.broadcast.emit('roomUpdate',JSON.stringify(rooms));
           socket.emit('roomUpdate',JSON.stringify(rooms));
       })
   });

    var messages = io.of("/messages").on('connection',(socket)=>{
        console.log("Conection established on server");

        socket.on('joinRoom',(data)=>{
          socket.userName = data.userName;
          socket.userPic= data.userPic;
            socket.join(data.roomNumber);
        });

        socket.on('newMessage',(data)=>{
            socket.broadcast.to(data.roomNumber).emit('messageFeed',JSON.stringify(data));
        });

    });
}