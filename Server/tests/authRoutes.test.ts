import request from "supertest";
import { app } from "../server";
import { supabase } from "../config/supabaseBucket";

describe("Authentication Routes", () => {
const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    role: "student",
};

  beforeAll(async () => {
    await supabase.from("users").delete().eq("email", testUser.email);
  });

  afterAll(async () => {
    await supabase.from("users").delete().eq("email", testUser.email);
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/register")
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it("should not allow duplicate user registration", async () => {
      const response = await request(app)
        .post("/register")
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User with this email already exists");
    });
  });

  describe("POST /login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.email).toBe(testUser.email);
    });

    it("should not login with invalid credentials", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should not login with a non-existent user", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "nonexistentuser@example.com",
          password: "password123",
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});