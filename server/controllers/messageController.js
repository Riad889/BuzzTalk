const Chat = require("../models/chatSchema");
const MessageSchema = require("../models/messageSchema");

const sendMessage = async (req, res) => {
  //console.log(req.body)
  const { content, chatId, sender } = req.body;
  if (!content || !chatId || !sender) {
    return res.sendStatus(400);
  } else {
    var newMessage = {
      sender: sender,
      content: content,
      chat: chatId,
    };
    try {
      const result = await MessageSchema.create(newMessage);
      const finalChat = await MessageSchema.findById(result._id).populate(
        "chat"
      );
      if (finalChat) {
        return res.status(200).json(finalChat);
      } else {
        return res.status(403).json({ message: "No message is created" });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const fetchAllMessages = async (req, res) => {
  const { ownerId, frdId, chatId } = req.query;
  try {
    const result = await MessageSchema.find({ chat: chatId });
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMessage, fetchAllMessages };
