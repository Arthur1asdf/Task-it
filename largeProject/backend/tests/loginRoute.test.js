const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const createApp = require("../app");

let app, db, connection;

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri());
  db = connection.db("testdb");

  // Seed a test user
  const users = db.collection("User");
  const hashedPassword = await bcrypt.hash("testpass", 10);
  await users.insertOne({
    Username: "testuser",
    Email: "test@example.com",
    Password: hashedPassword,
  });

  app = createApp(db, "test_jwt_secret");
});

afterAll(async () => {
  await connection.close();
});

describe("POST /api/login", () => {
  it("logs in with valid credentials", async () => {
    const res = await request(app).post("/api/login").send({
      Username: "testuser",
      Password: "testpass",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.Username).toBe("testuser");
  });

  it("fails with invalid password", async () => {
    const res = await request(app).post("/api/login").send({
      Username: "testuser",
      Password: "wrongpass",
    });

    expect(res.status).toBe(400);
  });
});
