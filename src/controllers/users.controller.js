import { userService } from "../services/index.js"

const registerUser = async (req, res) => {
  res.send({ status: "success", message: "User created" })
}

const loginUser = async (req, res) => {
  if (!req.user)
    return res.status(400).send({
      status: "failed",
      message: "User or password wrong",
    })
  req.session.user = req.user
  req.logger.info(req.session.user)
  res.send({ status: "success", payload: req.user })
}

const githubCallback = async (req, res) => {
  req.session.user = req.user
  res.redirect("/products")
}

const github = async (req, res) => { }

const updatePass = async (req, res) => {
  const { email, newPassword } = req.body
  const userUpdated = await userService.updatePass(email, newPassword)
  res.send({ status: "success", payload: userUpdated })
}

const premium = async (req, res) => {
  const userRole = await userService.updateRole(req.session.user)
  res.send({ status: userRole[0], payload: userRole[1] })
}

const uploadDocuments = async (req, res) => {
  const uploadedFiles = req.files
  const uid = req.params.uid
  console.log(uploadedFiles)
  const userDocs = await userService.uploadDocs(uid, uploadedFiles)
  res.send({ status: "success", payload: userDocs })
}

export default {
  registerUser,
  loginUser,
  githubCallback,
  github,
  updatePass,
  premium,
  uploadDocuments
}