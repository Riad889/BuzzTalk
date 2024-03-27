const Chat = require("../models/chatSchema");
const User = require("../models/userSchema");

const accessChat = async (req, res) => {
  const { userID } = req.body;
  const { ownerID } = req.body;
  //console.log(req.body)
  if (!userID) {
    console.log("No userId params");
    return res.sendStatus(404);
  } else {
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: ownerID } } },
        { users: { $elemMatch: { $eq: userID } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    //console.log(isChat);
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [ownerID, userID],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        return res.status(200).send(fullChat);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

const fetchChats = async (req, res) => {
  const { userId } = req.query;

  try {
    await Chat.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        //console.log(results)
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        if (results) {
          return res.status(200).json({ data: results });
        } else {
          return res.status(404).json({ message: "Something is wrong" });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(403).json({ message: "Please fill all the field" });
  } else {
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(401).send("Need more than 2 users");
    } else {
      users.push(req.user);
      try {
        const groupChat = await Chat.create({
          chatName: req.body.name,
          users: users,
          isGroupChat: true,
          groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

        return res.status(200).json(fullGroupChat);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
};

const renameGroupChat = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    return res.status(202).json(updatedChat);
  } else {
    return res.status(403).json({ message: "No updation done here" });
  }
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(402).json({ message: "Chat not found" });
    } else {
      return res.status(200).json(added);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(402).json({ message: "Chat not found" });
    } else {
      return res.status(200).json(removed);
    }
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};
