<p align="center">
  <img src="https://raw.githubusercontent.com/somul-project/somul-system-frontend/master/resources/content-poster.png" width="100" height="100">
</p>

<h1 align="center">5월, 소프트웨어에 물들다 백앤드</h1>
<h4 align="center">5월, 소프트웨어에 물들다 (server.somul.kr) 백앤드 프로젝트입니다.</h4>
                                                                                                
**5월, 소프트웨어에 물들다 홈페이지** 프로젝트는 Node.js로 작성되었습니다.

<br>

## 🛠사전 설치

- ESLint 가 지원되는 에디터 (IntelliJ, VSCode 등)
- Node.js 12.16+
- Yarn 1.22+ (`npm install -g yarn`)

<br>

## 👮‍♀️컨트리뷰트 규칙

**5월, 소프트웨어에 물들다 홈페이지** 프로젝트는 누구나 Contribute 를 할 수 있습니다. 아래의 규칙을 따라주세요!

- master 브랜치 다이렉트 푸시는 절대 허용되지 않으며, 무조건 PR 로부터 머지되어야 합니다.
- 모든 작업은 브랜치를 파서 작업해주시고, 작업이 완료될 경우 PR 을 보내주세요!
  - 브랜치 이름의 규칙은 아래와 같습니다.
    - 작업자이름/변경사항명 (예 : {feature/fix...}/sanghun/fix-padding-for-modal-component)
- 모든 작업에는 테스트 코드가 필요합니다.
- 모든 PR 은 1명 이상 Approve 되어야 머지됩니다.         
- 모든 PR 은 CI 를 통과해야 리뷰를 시작합니다.

<br>

# 서버 도커라이징 하는 방법
```
sudo docker build -t somul/backend:{tag} .
sudo docker push somul/backend:{tag}
```
- staging 인 경우 tag를 staging으로 명시
- prod 인 경우 특정 version 명으로 태그를 명시하고, latest 라는 이름으로 태그를 중복으로 명시해야 함.

# 서버 도커 컨테이너

## 시작
```
// (0) .env.sample를 참고하여 .env 파일 추가
sudo docker run --name somul -p {SERVER PORT}:{SERVER PORT} -d -v {Env Path}:/somul-server/.env somul/backend:{Tag}
```
- ubuntu 18.04 환경에서 배포를 권장.
- 도커 설치는 다음 url 참고 (https://blog.cosmosfarm.com/archives/248/%EC%9A%B0%EB%B6%84%ED%88%AC-18-04-%EB%8F%84%EC%BB%A4-docker-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95/)
- staging 인 경우 tag를 staging으로 명시

## 로그 확인
```
sudo docker logs -f somul
```

## 종료
```
sudo docker rm -f somul
```


# 호스트 머신

## 시작
```
// (0) .env.sample를 참고하여 .env 파일 추가
yarn
yarn start
```

## 유닛 테스트 실행
```
NODE_ENV=sample yarn test
```

## 코드 스타일 검사
```
yarn lint
```


# 코드 구조 설명 (src)
- server: 서버 시작 코드
- api: 서버 API 코드들
  - auth: auth 관련 API
  - graphql: database 쿼리관련 API
- common: 공통으로 사용하는 모듈 및 변수 모음
- database: database 관련 코드
- test: 유닛 테스트 코드

<br>

## 📄 라이선스

**5월, 소프트웨어에 물들다 홈페이지** 프로젝트는 MIT 라이선스를 따르고 있습니다.