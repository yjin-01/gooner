const uuid = require('uuid');

module.exports = {
  createUUID: () => {
    // ES5
    // 설정 부여가능
    // let options = {
    //     random : ,// 16개의 랜덤 바이트값
    //     rng : // random 변수를 대체할 16개의 랜덤 바이트값을 반환하는 함수
    // }

    /**
     *  v1: 타임스탬프(시간) 기준
     *  v3: MD5 해시 기준
     *  v4: 랜덤값 기반
     *  v5: SHA-1 해시 기준
     */

    const new_uuid = uuid.v4();
    //const new_uuid = uuid.v4(options);

    // uuid 를 생성하면 String 형식으로 ex) 1604b772-adc0-4212-8a90-81186c57f598으로 나옴.
    let user_uuid = new_uuid.split('-');

    // 위의 로직의 이유 보장받는 수의 체계로 변환하기 위해
    return user_uuid[0] + user_uuid[2] + user_uuid[1] + user_uuid[3];
  },
};
