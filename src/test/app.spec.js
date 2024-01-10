const request = require('supertest');
const app = require('../app');
const mocha = require('mocha');

describe('GET /', () => {
  it('response', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Test Case 1 Success')
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
