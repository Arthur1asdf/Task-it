const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const createApp = require("../app");

// mock email
jest.mock("../utils/emailService", () => jest.fn(() => Promise.resolve()));

let app, db, connection;

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri());
  db = connection.db("testdb");

  await db.collection("User").insertOne({
    Username: "user1",
    Email: "user1@example.com",
    Password: "hashed",
  });

  app = createApp(db);
});

afterAll(async () => {
  await connection.close();
});

describe("POST /api/forgot-password", () => {
  it("sends reset email if user exists", async () => {
    const res = await request(app).post("/api/forgot-password").send({
      Email: "user1@example.com",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Check your email/i);
  });

  it("returns 404 for non-existing user", async () => {
    const res = await request(app).post("/api/forgot-password").send({
      Email: "notfound@example.com",
    });

    expect(res.status).toBe(404);
  });
});
