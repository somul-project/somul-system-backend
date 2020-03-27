# 서버 도커라이징 하는 방법
```
TAG={Docker Tag} ./dockerbuild.sh
```
- staging 인 경우 tag를 staging으로 명시
- prod 인 경우 특정 version 명으로 태그를 명시하고, latest 라는 이름으로 태그를 중복으로 명시해야 함.

# 서버 도커 컨테이너 실행
```
sudo docker run -d -v {env_path}:/somul-server/.env somul/backend:{tag}
```
- ubuntu 18.04 환경에서 배포를 권장.
- 도커 설치는 다음 url 참고 (https://blog.cosmosfarm.com/archives/248/%EC%9A%B0%EB%B6%84%ED%88%AC-18-04-%EB%8F%84%EC%BB%A4-docker-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95/)
- staging 인 경우 tag를 staging으로 명시


# 호스트 머신에서 실행
```
// (0) .env 파일 추가
yarn start
```

# 코드 구조 설명 (src)
- server: 서버 시작 코드
- api: 서버 API 코드들
  - auth: auth 관련 API
  - graphql: database 쿼리관련 API
- common: 공통으로 사용하는 모듈 및 변수 모음
- database: database 관련 코드
- test: 유닛 테스트 코드
