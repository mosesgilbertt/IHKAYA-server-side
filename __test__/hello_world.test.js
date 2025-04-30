const { describe, test } = require("@jest/globals");
const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  test("mengembalikan pesan yang sesuai", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello World!" });
  });
});
