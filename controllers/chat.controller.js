import asyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";

const getChat = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId)
  try {
    await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await user.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email"
        });
        res.status(200).json(results);
      });
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const addChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    let chat = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: { $elemMatch: { $eq: req.user._id } }
        },
        {
          users: { $elemMatch: { $eq: userId } }
        }
      ]
    })
      .populate("users", "-password")
      .populate("latestMessage");
    chat = await user.populate(chat[0], {
      path: "latestMessage.sender",
      select: "name pic email"
    });
    if (chat != undefined) {
      return res.status(200).send(chat);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        return res.status(200).json(FullChat);
      } catch (error) {
        return res.status(400);
        throw new Error(error.message);
      }
    }
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const addGroup = asyncHandler(async (req, res) => {
  const { users } = req.body;
  try {
    users.push(req.user);
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user
    });
    const CreadtedGroupDetails = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(CreadtedGroupDetails);
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const rename = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName
      },
      {
        new: true
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json(updatedChat);
    }
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const removeMember = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId }
      },
      {
        new: true
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json(removed);
    }
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const addMember = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId }
      },
      {
        new: true
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json(added);
    }
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

export {
  getChat,
  addChat,
  addGroup,
  rename,
  removeMember,
  addMember
};
