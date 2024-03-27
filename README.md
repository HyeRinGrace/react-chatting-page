# Project
: 개인프로젝트

---

### ✅ URL : https://rins-study-chat.vercel.app/login
### ✅ 설명 : 즐겨찾기, 이미지 보내기, 프로필변경, 로그아웃 등으로 이루어진 실시간으로 채팅이 가능한 채팅 웹사이트

---


### 코드,변수 컨벤션

- 코드는 최대한 함수형으로 작성
- 변수명은 최대한 알아보기 쉽게 작성 직관성을 높이기 위해


### 사용 스킬

-  Vue, react-hook-form, react-router-dom, md5,firebase, bootstrap

### Problems

- firebase 초기 세팅 및 각각의 채팅창으로 마운트될 때, 아이콘이 바로 보이지 않는 문제
  
### Solution

- firebase docs 정독 후 초기 세팅 진행, useEffect를 통해 채팅룸 id가 변경될때 마운트 진행 + 마운트 될 때 메세지 배열 초기화
