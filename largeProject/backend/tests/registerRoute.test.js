const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");
const createApp = require("../app");

// mock the email service
jest.mock("../utils/emailService", () => jest.fn(() => Promise.resolve()));

let app, db, connection;

beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  connection = await MongoClient.connect(mongoServer.getUri());
  db = connection.db("testdb");
  app = createApp(db);
});

afterAll(async () => {
  await connection.close();
});

describe("POST /api/register", () => {
  it("registers a user successfully", async () => {
    const res = await request(app).post("/api/register").send({
      Username: "tester",
      Email: "test@example.com",
      Password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/User registered successfully/i);
  });

  it("returns 400 if fields are missing", async () => {
    const res = await request(app).post("/api/register").send({
      Email: "incomplete@example.com",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/fill in all fields/i);
  });
});
