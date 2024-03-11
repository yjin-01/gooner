# ⚽️ Gooner
### Arsenal 팬 앱
Arsenal팀에 관한 정보, 경기 일정, 경기 결과 등을 확인 할 수 있는 앱

<br/>
<br/>

# 🛠 기술 스택
- Node.js, Express, MySQL, RestAPI
- AWS EC2, AWS RDS

<br/>
<br/>

# 👩🏻‍💻 기능 구현
-  ### 개인
  -  #### 프로젝트 설계 및 설정
      - AWS EC2 설정, AWS RDS 설정
        1) 보안 그룹 설정
           - 특정 IP가 아닌 다른 IP에서 접속하는 것을 막기 위해
        2) Swap Memory 설정
           - 프리티어를 사용시, RAM의 용량이 적어 지연이 발생하는 경우를 대비하기 위해
      
      - 프로젝트 구조 설계 및 세팅
        1) 환경 분리
           - dev 환경과 prodution 환경 분리를 통해 dev에서는 테스트성의 코드 등 실험적인 코드나 테스트가 있기 때문에

        2) DBCP(Database Connection Pool) 설계
           - 매번 사용자가 요청을 할 때마다 드라이버를 로드하고 커넥션 객체를 생성하여 연결하고 종료하기 때문에 매우 비효율적임. => 도입 배경
            
      
  -  #### API 구현
      - 스케줄러 API
      - 상대 전적 API

 - ### 공통 구현
  - Database
    - 정규화를 기반으로 한 ERD 모델링
  
  - Swagger

<br/>
<br/>

# 회고

# 🔗 시스템 아키텍쳐
<img wide="100%"  src ="https://github.com/yjin-01/gooner/blob/main/public/Gooner-back.png?raw=true">

<br/>
<br/>

# 🔎 DB ERD
<img wide="100%"  src ="https://github.com/yjin-01/gooner/blob/main/public/Gooner-erd.png?raw=true">

