# 🐢 TurtleTrip (터틀트립)

> 체크리스트를 완료할수록 거북이가 바다로 돌아가는 여정을 떠나는 게이미피케이션 기반 To-Do 애플리케이션

![Version](https://img.shields.io/badge/version-1.0-blue)
![Python](https://img.shields.io/badge/python-3.x-blue)
![Flask](https://img.shields.io/badge/flask-3.1.2-green)

---

## 📋 프로젝트 개요

**TurtleTrip**은 단순한 할 일 관리를 넘어, 사용자의 성취를 거북이의 여정으로 시각화하여 재미와 지속 가능성을 제공하는 생산성 애플리케이션입니다.

### 핵심 컨셉
- 체크리스트 진행률 = 거북이의 여정 진행도
- 할 일을 완료할수록 거북이가 육지에서 바다로 이동
- 실시간 진행률 업데이트 및 시각적 피드백

---

## ✨ 주요 기능

### 1. 체크리스트 관리 (CRUD)
- ✅ 할 일 추가
- ✅ 할 일 완료/미완료 토글 (새로고침 없이 실시간 반영)
- ✅ 할 일 수정
- ✅ 할 일 삭제

### 2. 진행률 시각화
- 📊 실시간 진행률 계산: (완료된 항목 / 전체 항목) × 100
- 📈 프로그레스 바 애니메이션
- 🐢 거북이 캐릭터의 귀여운 이동

### 3. 거북이 인터랙션
- 🎯 진행률 증가 시 점프 애니메이션
- 🎉 100% 달성 시 완주 축하 연출
- 💬 상태에 따른 시각적 피드백

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Backend** | Python 3.x, Flask 3.1.2 |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Data** | JSON 파일 기반 저장 |
| **Design** | CSS Animations, Responsive Layout |

---

## 📁 프로젝트 구조

```
turtletrip/
├── app.py                      # Flask 메인 애플리케이션
├── tasks.json                  # 할 일 데이터 저장소
├── requirements.txt            # Python 의존성 목록
├── README.md                   # 프로젝트 소개

├── modules/                    # 비즈니스 로직 모듈
│   ├── data_manager.py         # JSON 입출력 관리
│   ├── progress_calculator.py  # 진행률 계산
│   └── task_validator.py       # 입력값 검증
│
├── templates/                  # HTML 템플릿
│   ├── index.html              # 메인 페이지
│   ├── edit.html               # 할 일 수정 페이지
│   └── background/             # 배경 HTML, css, python 파일
│       ├── background.py       
│       ├── background.css      
│       └── background.html     
│
└── static/                     # 정적 파일
    ├── css/
    │   ├── style.css           # 전역 스타일
    │   ├── turtle.css          # 거북이 애니메이션
    │   └── checklist.css       # 체크리스트 UI
    │
    ├── js/
    │   ├── main.js             # 메인 로직 (비동기 처리)
    │   ├── turtle.js           # 거북이 애니메이션 제어
    │   └── checklist.js        # 체크리스트 인터랙션
    │
    └── images/
        └── turtle/             # 거북이 이미지 리소스
        └── background/         # 배경 소속 이미지
```

---

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/your-team/turtletrip.git
cd turtletrip
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 애플리케이션 실행
```bash
python app.py
```

### 4. 브라우저 접속
```
http://localhost:5000
```

---

## 📖 사용 방법

1. **할 일 추가**
   - 하단 입력창에 할 일을 입력하고 '추가' 버튼 클릭

2. **할 일 완료 체크**
   - 체크박스 클릭 시 즉시 진행률 업데이트
   - 거북이가 자동으로 이동하며 점프 애니메이션 실행

3. **할 일 수정**
   - 할 일 옆 ⋮ 버튼 클릭 → '수정' 선택
   - 내용 수정 후 '저장' 버튼 클릭

4. **할 일 삭제**
   - 할 일 옆 ⋮ 버튼 클릭 → '삭제' 버튼 클릭

5. **100% 달성**
   - 모든 할 일 완료 시 거북이가 바다에 도착하며 축하 연출 표시

---

## 🎨 주요 특징

### 비동기 실시간 업데이트
- 페이지 새로고침 없이 체크박스 상태 변경
- `async/await` 기반의 안정적인 서버 통신

### 반응형 애니메이션
- CSS transition을 활용한 부드러운 거북이 이동
- 진행률 증가 시 점프 애니메이션 자동 실행
- 100% 달성 시 특별 축하 연출

### 모듈화된 코드 구조
- 역할별로 분리된 Python 모듈
- 기능별로 분리된 JavaScript 파일
- CSS 파일 분리로 유지보수성 향상

---

## 🧪 테스트 시나리오

- [x] 할 일 추가 → 정상적으로 목록에 표시
- [x] 체크박스 클릭 → 새로고침 없이 완료 표시
- [x] 진행률 바 → 즉시 업데이트
- [x] 거북이 → 부드럽게 이동
- [x] 수정 버튼 → edit 페이지로 이동
- [x] 수정 저장 → 메인으로 돌아옴
- [x] 삭제 버튼 → 정상 삭제
- [x] 100% 달성 → 축하 연출 표시

---

## 👥 팀 구성

김노현, 김수빈, 박지수 손예진, 송우인

---

## 📝 개발 일지

### 2월 2일 (1일차)
- 프로젝트 초기 설정 및 기본 구조 구축
- JSON 데이터 구조 설계
- 체크리스트 CRUD 기본 기능 구현

### 2월 3일 (2일차)
- 진행률 계산 로직 구현
- 거북이 이동 애니메이션 구현
- 프로그레스 바 UI 개발

### 2월 4일 (3일차)
- 비동기 통신으로 실시간 업데이트 구현
- 점프 애니메이션 및 완주 연출 추가
- 할 일 수정 기능 완성

### 2월 5일 (4일차)
- 주요 버그 수정 (6가지 오류 해결)
- main.js 리팩토링 (160줄 → 80줄)
- CSS/JS 파일 중복 정리
- 최종 테스트 완료

---

## 🐛 알려진 이슈 및 해결

### 해결 완료
- ✅ HTML 구조 오류 (닫히지 않은 div 태그)
- ✅ 체크박스 이벤트 충돌 (HTML vs JavaScript)
- ✅ 라우팅 함수명 불일치
- ✅ JavaScript 실행 순서 문제
- ✅ API 응답 형식 불일치
- ✅ 잘못된 엔드포인트 호출
- ✅ SS 파일 중복 제거 작업

### 진행 중
- 
---

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

## 🔗 참고 자료

- [Flask 공식 문서](https://flask.palletsprojects.com/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [CSS Animations Guide](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations)

---

## 📧 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해 주세요.

---
