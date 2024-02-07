const express = require('express');
const { configureMiddleware } = require('../serverConfig');

// describe('configureMiddleware', () => {
//   it('should configure middleware', () => {
//     const app = express();
//     jest.spyOn(app, 'use'); // app.use 함수에 대한 Jest spy 생성
//     configureMiddleware(app);
//     expect(app.use).toHaveBeenCalled();
//   });
// });

jest.mock('express', () => {
  const express = jest.requireActual('express');
  return {
    ...express,
    use: jest.fn(),
  };
});


describe('configureMiddleware', () => {
  it('should configure middleware', () => {
    const app = require('express'); // 여기서는 require로 사용
    configureMiddleware(app);
    expect(app.use).toHaveBeenCalled();
  });
});