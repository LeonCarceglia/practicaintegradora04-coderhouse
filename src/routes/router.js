import { Router } from "express"
import multer from "multer"

export default class CustomRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    getRouter() {
        return this.router
    }

    init() { }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = (payload) =>
            res.status(200).send({ status: "success", payload })
        next()
    }

    handlePolicies = (policies) => {
        return (req, res, next) => {
            const user = req.session.user
            if (policies[0] === "PUBLIC") return next()
            if (!policies.includes(user.role.toUpperCase()))
                return res.status(403).send({ status: "error", error: "Forbidden" })
            next()
        }
    }

    configureUploadMiddleware = () => {
        return (req, res, next) => {
            const fieldName = req.body.profileImage || req.body.productImage
            console.log(req.body)
            if (!fieldName) {
                return res.status(400).send({ status: "error", error: "Invalid field name" })
            }
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    let uploadPath = 'uploads/documents'
                    if (fieldName === 'profileImage') {
                        uploadPath = 'uploads/profiles'
                    } else if (fieldName === 'productImage') {
                        uploadPath = 'uploads/products'
                    }
                    cb(null, uploadPath)
                },
                filename: (req, file, cb) => {
                    cb(null, file.originalname)
                },
            })
            const upload = multer({ storage: storage }).array(fieldName)
            upload(req, res, (error) => {
                if (error) {
                    return res.status(400).send({ status: "error", error: "Error uploading files" })
                }
                next()
            })
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                params[1].status(500).send(error)
            }
        })
    }
}
