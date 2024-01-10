const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}[${label}] ${level}:${message}`;
});

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: 'Gooner' }),
    logFormat,
    //? format: combine() 에서 정의한 timestamp와 label 형식값이 logFormat에 들어가서 정의되게 된다. level이나 message는 콘솔에서 자동 정의
  ),
  // 실제 로그를 어떻게 기록을 한 것인가 정의
  transports: [
    //info 레벨 로그를 저장할 파일 설정(info : 2 보다 높은 error : 0 와 warn :1 로그들도 자동 포함해서 저장)
    new winstonDaily({
      level: 'info', //info 레벨에선
      datePattern: 'YYYY-MM-DD', //파일 날짜 형식
      dirname: logDir, //파일 경로
      filename: `%DATE%.log`, //파일 이름
      maxFiles: 30, //최근 30일치 로그 파일을 남김
      zippedArchive: true,
    }),
    //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일ㅞ부러 따로 빼서 설정)
    new winstonDaily({
      level: 'error', //error 레벨에선
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // /logs/error 하위에 저장
      filename: `%DATE%.error.log`, //에러 로그는 2023-04-13.error.log 형식으로 저장
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug',
      filename: `%DATE.debug.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  //* uncaughtException 발생시 파일 설정
  exceptionHandlers: [
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});
//* Production 환경이 아닌, 개발 환경일 경우 파일 들어가서 일일히 로그 확인하기 번거로우니까 화면에서 바로 찍게 설정 (로그 파일은 여전히 생성됨)
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      ),
    }),
  );
}

module.exports = logger;
