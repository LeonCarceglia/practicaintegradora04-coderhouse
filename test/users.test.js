import mongoose from "mongoose"
import Users from "../src/dao/manager/db/users.js"
import Assert from "assert"
import userModel from "../src/dao/models/user.js"
import config from "../src/config/config.js"

const MONGO_URL = config.MONGODB_URL
const assert = Assert.strict

describe("Testing for the Users dao class", () => {

    before(async function() {
        await mongoose.connect(MONGO_URL)
        this.usersDao = new Users()
    })

    beforeEach(async function() {
        await userModel.deleteMany()
        this.timeout(50000)
    })

    it("The get method of the Users class should retrieve users in array format", async function() {
        const result = await this.usersDao.getUsers()
        console.log(result)
        assert.strictEqual(Array.isArray(result), true)
    })

    it("The dao should successfully add a user to the database", async function() {
        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "pepe@mail.com",
            password: "1234"
        }
        const result = await this.usersDao.createUser(mockUser)
        assert.ok(result._id)
    })

    it("The dao can retrieve a user by email", async function() {
        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: "pepe@mail.com",
            password: "1234"
        }
        const result = await this.usersDao.createUser(mockUser)
        const userDB = await this.usersDao.existUser(result.email)
        assert.strictEqual(typeof userDB, 'object')
    })
})
