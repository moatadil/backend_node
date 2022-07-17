import mongoose from "mongoose"
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signIn = async (req, res) => {
    const { email, password } = req.body
    // const newPost = new PostMessage(post)
    try {
        const existUser = await User.findOne({ email })
        if (!existUser) return res.status(404).json({ message: "User doesnt exists." })
        const isPasswordCorrect = await bcrypt.compare(password, existUser.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentials' })
        const token = jwt.sign({ email: existUser.email, id: existUser._id }, 'test', { expiresIn: '1h' })
        res.status(200).json({ token: token, result: existUser })
    } catch (error) {
        res.status(500).json({ message: 'SomeThing Went Wrong' })
    }
}
export const signUp = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body
    // const newPost = new PostMessage(post)
    try {
        const existUser = await User.findOne({ email })
        if (existUser) return res.status(400).json({ message: "User Already exists." })
        const isPasswordConfirmed = password === confirmPassword
        if (!isPasswordConfirmed) return res.status(400).json({ message: 'Password Dont match' })
        const hashedPassword = await bcrypt.hash(password, 12)
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' })
        res.status(200).json({ token, result })
    } catch (error) {
        res.status(500).json({ message: 'SomeThing Went Wrong' })
    }
}