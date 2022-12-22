import asyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

const getMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .lean()
      .exec();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(400);
    throw new Error(error.message);
  }
});

const addMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400);
    throw new Error("Invalid data passed into request");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId
  };
  try {
    let message = await Message.create(newMessage);
    message = Message.findOne({ _id: message._id })
      .populate("sender", "name pic")
      .populate("chat")
      .lean()
      .exec();
    message = await user.populate(message, {
      path: "chat.users",
      select: "name pic email"
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id
    });
    return res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


export {
  getMessage,
  addMessage
};
