import userModel from "../../models/user.js"
import { createHash, isValidPassword } from "../../../utils.js"

export default class UsersManager {
    constructor() {
    }

    getUsers = () => {
        return userModel.find().lean()
    }

    getUser = (id) => {
        return userModel.findById(id).lean()
    }

    createUser = (user) => {
        return userModel.create(user)
    }

    updateUser = (id, user) => {
        return userModel.findByIdAndUpdate(id, user)
    }

    deleteUser = (id) => {
        return userModel.findByIdAndDelete(id)
    }

    existUser = (email) => {
        return userModel.findOne({ email })
    }

    updatePass = async (email, newPass) => {
        const user = await userModel.findOne({ email })
        if (isValidPassword(user, newPass)) {
            return "Error, password are equals"
        } else {
            const newPassword = createHash(newPass)
            user.password = newPassword
            await user.save()
            return "User updated"
        }
    }

    updateConnection = async (user) => {
        return await userModel.findByIdAndUpdate(user._id, { last_connection: new Date() })
    }

    updateRole = async (user) => {
        const validRoles = ["user", "premium"]
        const requiredDocuments = ["Identification", "Proof of Address", "Bank Statement"]
        if (validRoles.includes(user.role)) {
            if (user.role === "user") {
                const hasAllRequiredDocuments = requiredDocuments.every(docName =>
                    user.documents.some(doc => doc.name === docName)
                )
                if (hasAllRequiredDocuments) {
                    const newRole = "premium"
                    await userModel.findByIdAndUpdate(user._id, { role: newRole })
                    user.role = newRole
                    return ["Role updated successfully", user]
                } else {
                    return ["Error", "The user has not finished processing their documentation"]
                }
            } else {
                return ["Error", "The user is already premium"]
            }
        } else {
            return ["Error", "Invalid role"]
        }
    }

    uploadDocs = async (uid, newFiles) => {
        const user = await userModel.findById(uid)
        user.documents.push(...newFiles.map(file => ({
            name: file.originalname,
            reference: file.filename
        })))
        await user.save()
        return user.documents
    }
}