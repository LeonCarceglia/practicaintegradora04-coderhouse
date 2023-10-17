import Assert from "assert"
import supertest from "supertest"

const assert = Assert.strict
const requester = supertest("http://localhost:3000/")

describe("Testing for the Carts router", () => {

    beforeEach(async function() {
        this.timeout(50000)
    })

    it("The endpoint GET /api/carts should return an array of carts", async function() {
        const result = await requester.get("api/carts/")
        assert.strictEqual(Array.isArray(result._body.data), true)
    })

    it("The endpoint GET /api/carts/:id should return an object of type cart", async function() {
        const result = await requester.get("api/carts/64ef6f27991904d111d492be")
        assert.ok(result._body.data._id)
    })
    
    it("The endpoint DELETE /api/carts/:id should delete all the products in the car", async function() {
        const result = await requester.delete("api/carts/64f07de8fabcc9243926583e")
        assert.strictEqual(result.status, 204)
    })
})