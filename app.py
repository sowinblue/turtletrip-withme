from flask import Flask, render_template    #flask를 사용해서 웹 서버를 만들겠다
import json #json 파일을 읽기 위해 사용

app = Flask(__name__)  #flask 앱 생성(웹서버 본체)

# tasks.json 파일을 읽어오는 함수
def get_user_progress():
    try:
        # 1. JSON 파일 읽기
        with open('tasks.json', 'r', encoding='utf-8') as f:
            #파일 안의 내용을 파이썬에서 쓸 수 있게 반환
            return json.load(f)
    except FileNotFoundError:
        # 파일이 없을 경우를 대비
        return{"tasks": []}
    

#메인페이지("/") 접속시 실행되는 함수
@app.route('/')
def index():
    # tasks.json 데이터 가져오기
    data = get_user_progress()

    # 데이터가 잘 읽혔는지 터미널에서 확인하기
    print("현재 tasks.json 데이터:", data)

    #index.html 파일을 화면에 보여줌
    return render_template("index.html")

# 이 파일을 직접 실행했을 때만 서버 실행
if __name__ == '__main__':
    # 서버 실행(코드 수정 시 자동 반영)
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)