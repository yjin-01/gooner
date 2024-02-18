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

    // 방 정보
    let room = '';

    // 방참여 요청
    // socket.on('req_join', ({ matchRoom }) => {
    //   room = matchRoom;

    //   socket.join(matchRoom, () => {
    //     io.to(matchRoom).emit('noti_join', {
    //       message: '채팅방에 입장하였습니다.',
    //     });
    //   });
    // });

    // // 채팅방 나가기
    // socket.on('req_leave', ({ matchRoom }) => {
    //   socket.leave(matchRoom);
    //   io.to(matchRoom).emit('noti_leave', {
    //     message: '채팅방을 퇴장하였습니다.',
    //   });
    // });

    // 채팅방에 채팅 요청
    socket.on('req_chatMessage', async (message) => {
      socket.emit('noti_chatMessage', message);
      // let userCurrentRoom = socket.room;
      // io.to(userCurrentRoom).emit('noti_chatMessage', { message });
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
