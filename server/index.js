const express = require("express");
const app = express();
const cors = require("cors");

//const bodyParser=require('body-parser');
const dotenv = require("dotenv");

app.use(cors());
dotenv.config();
app.use(express.json());

// require routes

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoutes");

app.use(userRoute);
app.use(chatRoute);
app.use("/api/msg", messageRoute);

const port = process.env.PORT;

require("./connection/db_connection");

const server = app.listen(port, () => {
  console.log(`server is running ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join room",(room)=>{
    socket.join(room);
    //console.log("user is joined to ",room);
  })

  socket.on("new message",(newMessageReceived)=>{
    //console.log("new message : ",newMessageReceived);
    var chat=newMessageReceived.chat;
    //console.log("sender : ",newMessageReceived.sender)
    if(!chat.users) return console.log("chat.users is not defined");
    chat.users.forEach(user => {

      if(user!==newMessageReceived.sender) {
        socket.in(user).emit("message received",newMessageReceived)
        //console.log("new Message : ",newMessageReceived)
      }
      
     
    });
  })
});
