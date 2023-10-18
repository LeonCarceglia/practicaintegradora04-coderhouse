import CustomRouter from "./router.js"
import userController from "../controllers/users.controller.js"

export default class UserRouter extends CustomRouter {
    init() {
        
        this.put("/premium/:uid", ["USER", "PREMIUM"], userController.premium)

        this.post("/:uid/documents",["PUBLIC","USER", "PREMIUM", "ADMIN"], this.configureUploadMiddleware(), userController.uploadDocuments)
    }
}