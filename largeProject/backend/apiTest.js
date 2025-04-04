const request = require("supertest");
const app = require("./testApi");
const Critter = require("./models/critter");
const Post = require("./models/post");
const User = require("./models/user");

jest.mock("./models/critter");

describe("POST /api/searchcritters", () => {
  it("should return search results", async () => {
    const mockCritters = [{ crittername: "cat" }, { crittername: "dog" }];
    Critter.find.mockResolvedValue(mockCritters);

    const response = await request(app).post("/api/searchcritters").send({ search: "cat", jwtToken: "token" }).expect(200);

    expect(Critter.find).toHaveBeenCalledWith({ crittername: { $regex: "cat.*", $options: "r" } });
    expect(response.body).toEqual({ _ret: mockCritters });
  });
});

describe("DELETE /api/deletepost", () => {
  it("should return 400 if post not found", async () => {
    jest.spyOn(Post, "findByIdAndDelete").mockResolvedValueOnce(null);

    const response = await request(app).delete("/api/deletepost").send({ PostsId: "fake-id" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("no post found");
  });

  it("should return 200 if post deleted successfully", async () => {
    const deletedPost = { _id: "fake-id", title: "Test post", content: "Test content" };
    jest.spyOn(Post, "findByIdAndDelete").mockResolvedValueOnce(deletedPost);

    const response = await request(app).delete("/api/deletepost").send({ PostsId: "fake-id" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post deleted.");
  });
});

describe("POST /api/searchposts", () => {
  it("should return matching posts", async () => {
    const matchingPosts = [
      { _id: "1", crittername: "test critter 1", content: "Test content 1" },
      { _id: "2", crittername: "test critter 2", content: "Test content 2" },
    ];
    jest.spyOn(Post, "find").mockResolvedValueOnce(matchingPosts);

    const response = await request(app).post("/api/searchposts").send({ search: "test", jwtToken: "fake-token" });

    expect(response.status).toBe(200);
    expect(response.body._ret).toEqual(matchingPosts);
  });
});

describe("GET /api/getUsername/:id", () => {
  it("should return the username of an existing user", async () => {
    const existingUser = { _id: "1", username: "testuser" };
    jest.spyOn(User, "findOne").mockResolvedValueOnce(existingUser);

    const response = await request(app).get("/api/getUsername/1");

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(existingUser.username);
  });

  it("should return an error message if user with given ID not found", async () => {
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);

    const response = await request(app).get("/api/getUsername/2");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found with that ID");
  });
});

describe("GET /api/datejoined/:id", () => {
  it("should return the date joined for an existing user", async () => {
    const existingUser = { _id: "1", createdAt: new Date("2022-01-01T00:00:00Z") };
    jest.spyOn(User, "findById").mockResolvedValueOnce(existingUser);

    const response = await request(app).get("/api/datejoined/1");

    expect(response.status).toBe(200);
    expect(response.body.dateJoined).toBe(existingUser.createdAt.toISOString());
  });

  it("should return an error message if user with given ID not found", async () => {
    jest.spyOn(User, "findById").mockResolvedValueOnce(null);

    const response = await request(app).get("/api/datejoined/2");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Information not found");
  });
  test;
});
