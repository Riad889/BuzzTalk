const express = require("express");
const protect = require("../middleware/authMiddleWar");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");

router.post("/newChat", accessChat);
router.get("/allChats", fetchChats);
router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroupChat);
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);

module.exports = router;
