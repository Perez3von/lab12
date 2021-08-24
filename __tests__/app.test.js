require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns todos', async() => {

      const expectation = [
        {
          id:1,
          completed:false, 
          todo:'avoid dishes',
          user_id: 1
        },
        {
          id:2,
          completed:false, 
          todo:'skip gym',
          user_id: 1
        },
        {
          id:3,
          completed:false,
          todo:'not take shower',
          user_id: 1
        }
      ];
      

      const data = await fakeRequest(app)
        .get('/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('returns todo by id', async() => {

      const expectation = {
        id:1,
        completed:false, 
        todo:'avoid dishes',
        user_id: 1
      };
      

      const data = await fakeRequest(app)
        .get('/todos/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });










  });
});
