import request from 'supertest';
import app from '../server.js';
import { connectDB, closeDB, clearDB } from './testSetup.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

describe('Protected Routes', () => {
  let wardenToken, rcToken, studentToken;

  beforeAll(async () => {
    await connectDB();
    
    // Create test users
    const warden = await User.create({
      userName: 'warden',
      password: 'password123',
      role: 'warden'
    });
    
    const rc = await User.create({
      userName: 'rc',
      password: 'password123',
      role: 'RC'
    });
    
    const student = await User.create({
      userName: 'student',
      password: 'password123',
      role: 'student'
    });

    // Generate tokens
    wardenToken = jwt.sign({ id: warden._id }, process.env.JWT_SECRET);
    rcToken = jwt.sign({ id: rc._id }, process.env.JWT_SECRET);
    studentToken = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => await closeDB());

  describe('GET /api/admission', () => {
    it('should allow warden to access admissions', async () => {
      const res = await request(app)
        .get('/api/admission')
        .set('Authorization', `Bearer ${wardenToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should allow RC to access admissions', async () => {
      const res = await request(app)
        .get('/api/admission')
        .set('Authorization', `Bearer ${rcToken}`);

      expect(res.statusCode).toBe(200);
    });

    it('should not allow student to access admissions', async () => {
      const res = await request(app)
        .get('/api/admission')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/admission', () => {
    it('should allow warden to create admission', async () => {
      const res = await request(app)
        .post('/api/admission')
        .set('Authorization', `Bearer ${wardenToken}`)
        .send({
          // Add your admission data here
        });

      expect(res.statusCode).toBe(201);
    });

    it('should not allow RC to create admission', async () => {
      const res = await request(app)
        .post('/api/admission')
        .set('Authorization', `Bearer ${rcToken}`)
        .send({
          // Add your admission data here
        });

      expect(res.statusCode).toBe(403);
    });
  });
});