
import request from 'supertest';
import app from '../server.js';
import { connectDB, closeDB, clearDB } from './testSetup.js';
import User from '../models/userModel.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => await connectDB());
  afterEach(async () => await clearDB());
  afterAll(async () => await closeDB());

  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser',
          password: 'password123',
          role: 'student'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.userName).toBe('testuser');
      expect(res.body.data.role).toBe('student');
    });

    it('should not create user with existing username', async () => {
      await User.create({
        userName: 'testuser',
        password: 'password123',
        role: 'student'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          userName: 'testuser',
          password: 'password123',
          role: 'student'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        userName: 'testuser',
        password: 'password123',
        role: 'student'
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          userName: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          userName: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});