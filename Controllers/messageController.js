const messageModel = require('../Models/messageModel')

//createMessage
const createMessage = async (req, resp) => {
  const { chatId, senderId, text } = req.body
  const message = new messageModel({
    chatId,
    senderId,
    text,
  })

  try {
    const response = await message.save()

    resp.status(200).json(response)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

//getMessages
const getMessages = async (req, resp) => {
  const { chatId } = req.params
  try {
    const messages = await messageModel.find({ chatId })
    resp.status(200).json(messages)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

module.exports = { createMessage, getMessages }
