const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket' });

  // 처음 연결 시
  io.on('connection', (socket) => {
    // 클라이언트 조회(사용 예정)
    const req = socket.request; // req
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; //ip 추출
    // socket.io는 연결할 때마다 id부여 => id를 통해 특정인에게 메세지 전송 가능
    console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
    socket.broadcast.emit('connection', '연결!!!!');

    // 채팅방 참여하기
    socket.on('join', (room) => {
      socket.join(room, () => {
        app.io.to(room).emit('join', room);
      });
    });

    // 채팅방 나가기
    socket.on('leave', (room) => {
      socket.leave(room, () => {
        app.io.to(room).emit('leave', room);
      });
    });

    socket.on('chatMessage', (room, name, msg) => {
      // 해당 방의 모든 클라이언트에게 채팅 메시지 전송
      app.io.to(room).emit('chatMessage', name, msg);
    });

    //  에러 발생시
    socket.on('error', (error) => {
      console.error(error);
    });

    // 통신 확인
    socket.interval = setInterval(() => {
      console.log('socket');
      socket.emit('news', 'Hello socket.io'); // 보낼때 브라우저에서 socket.on('news')
    }, 3000);

    // close 와 같은 역할
    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
  });
};

// '키 - 값'으로 통신
