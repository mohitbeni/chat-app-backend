const userModel = require('../Models/userModel')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY
  return jwt.sign({ _id }, jwtKey, { expiresIn: '3d' })
}

const registerUser = async (req, resp) => {
  try {
    const { name, email, password } = req.body

    let user = await userModel.findOne({ email })
    if (user) {
      return resp.status(400).json('User with given email already exists')
    }
    if (!name || !email || !password) {
      return resp.status(400).json('All fields are required')
    }
    if (!validator.isEmail(email)) {
      return resp.status(400).json('Email must be a valid email')
    }
    if (!validator.isStrongPassword(password)) {
      return resp.status(400).json('Password must be a strong password')
    }

    user = new userModel({ name, email, password })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    await user.save()

    const token = createToken(user._id)
    resp.status(200).json({ _id: user._id, name, email, token })
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

const loginUser = async (req, resp) => {
  const { email, password } = req.body

  try {
    let user = await userModel.findOne({ email })
    if (!user) {
      return resp.status(400).json('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return resp.status(400).json('Invalid email or password')
    }
    const token = createToken(user._id)
    resp.status(200).json({ _id: user._id, name: user.name, email, token })
  } catch (error) {}
}

const findUser = async (req, resp) => {
  const userId = req.params.userId

  try {
    const user = await userModel.findById(userId)

    resp.status(200).json(user)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

const getUsers = async (req, resp) => {
  try {
    const user = await userModel.find()

    resp.status(200).json(user)
  } catch (error) {
    console.log(error)
    resp.status(500).json(error)
  }
}

module.exports = { registerUser, loginUser, findUser, getUsers }
