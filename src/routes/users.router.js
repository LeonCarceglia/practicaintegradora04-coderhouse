import CustomRouter from "./router.js"
import userController from "../controllers/users.controller.js"

export default class UserRouter extends CustomRouter {
    init() {
        
        this.put("/premium/:uid", ["USER", "PREMIUM", "ADMIN"], userController.premium)

        this.post("/:uid/documents",["USER", "PREMIUM", "ADMIN"], "documents", userController.uploadDocuments)
    }
}