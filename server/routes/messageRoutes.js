const express=require('express');
const route=express.Router();
const {sendMessage,fetchAllMessages}=require('../controllers/messageController');

route.post('/sendMessage',sendMessage);
route.get('/fetchMessage',fetchAllMessages);


module.exports=route;