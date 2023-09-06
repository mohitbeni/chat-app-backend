const chatModel = require('../Models/chatModel')

//createChat
const createChat = async (req, resp) => {
  const { firstId, secondId } = req.body

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    })

    if (chat) {
      return resp.status(200).json(chat)
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    })

    const response = await newChat.save()
    resp.status(200).json(response)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

//findUserChats
const findUserChats = async (req, resp) => {
  const userId = req.params.userId
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    })

    resp.status(200).json(chats)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

//findChat

const findChat = async (req, resp) => {
  const { firstId, secondId } = req.params
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    })

    resp.status(200).json(chat)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

module.exports = { createChat, findUserChats, findChat }
