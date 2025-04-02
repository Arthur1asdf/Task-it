const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const createApp = require("../app");

let app, db, connection;

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri());
  db = connection.db("testdb");

  const token = "testtoken123";
  await db.collection("User").insertOne({
    Username: "resetuser",
    Email: "reset@example.com",
    Password: "oldpass",
    resetToken: token,
    resetTokenExpiry: Date.now() + 3600000, // 1 hour
  });

  app = createApp(db);
});

afterAll(async () => {
  await connection.close();
});

describe("POST /api/reset-password/:token", () => {
  it("resets password with valid token", async () => {
    const res = await request(app)
      .post("/api/reset-password/testtoken123")
      .send({ newPassword: "newpass123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Password reset successful/i);
  });

  it("fails with invalid token", async () => {
    const res = await request(app)
      .post("/api/reset-password/badtoken")
      .send({ newPassword: "test" });

    expect(res.status).toBe(400);
  });
});
