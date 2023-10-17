import chai, { expect } from "chai"
import { createHash, isValidPassword } from "../src/utils.js"

const assert = chai.expect

describe("Authentication and Users DTO Testing", function() {

    it("The service should perform an effective password hashing", async function() {
        const passwordLogin = "1234"
        const effectiveHash = /(?=[A-Za-z0-9@#$%/^.,{}&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
        const passwordHash = await createHash(passwordLogin)
        expect(effectiveHash.test(passwordHash)).to.be.equal(true)
    })

    it("The performed hashing should be effectively compared with the original password", async function() {
        const passwordLogin = "1234"
        const passwordHash = await createHash(passwordLogin)
        const mockUser = {
            email: "pepe@email.com",
            password: passwordHash
        }
        const result = await isValidPassword(mockUser, passwordLogin)
        expect(result).to.be.equal(true)
    })

    it("If the hashed password is altered, it should fail the original password comparison.", async function() {
        const passwordLogin = "1234"
        const passwordHash = await createHash(passwordLogin)
        const mockUser = {
            email: "pepe@email.com",
            password: passwordHash + "asdads"
        }
        const result = await isValidPassword(mockUser, passwordLogin)
        expect(result).to.be.equal(false)
    })
})
