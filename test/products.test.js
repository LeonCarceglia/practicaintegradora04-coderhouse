import Assert from "assert"
import supertest from "supertest"

const assert = Assert.strict
const requester = supertest("http://localhost:3000/")

describe("Testing for the Products router", () => {

    beforeEach(async function() {
        this.timeout(50000)
    })

    it("The endpoint GET /api/products should return an array of products", async function() {
        const result = await requester.get("api/products/")
        assert.strictEqual(Array.isArray(result._body.data.docs), true)

    })

    it("The endpoint GET /api/products/:id should return an object of type product", async function() {
        const result = await requester.get("api/products/650da1cec92db0fa75ec603b")
        assert.ok(result._body.data.title)
    })

    it("The endpoint POST /api/products/mockingproducts should return an array of random generated products", async function() {
        const result = await requester.post("api/products/mockingproducts")
        assert.strictEqual(Array.isArray(result._body.data), true)
    })
})
