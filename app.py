from flask import Flask, render_template, request   #flask를 사용해서 웹 서버를 만들겠다
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
<<<<<<< HEAD
    return render_template("index.html", todos=data.get("user1", []))
=======
    return render_template("index.html")
>>>>>>> 5d41be769e2c52fdb8113485ed4c7a497d9621ac

# 사용자가 보낸 데이터를 받기 
@app.route('/update_todo', methods=['POST']) # /update_todo는 html에 있습니다!
def update_todo():
    # 1. 텍스트 박스 내용 가져오기
    content = request.form.get('todo_content')

    # 2. 체크박스 상태 확인 (체크 안 되면 None이 들어옵니다)
    is_done = request.form.get('is_done') == 'done'
    
    print(f"할 일: {content}, 완료 여부: {is_done}") # 터미널에서 확인용
    
    return "데이터를 잘 받았어요!" # 나중에는 다시 메인화면으로 보낼 거예요

# 이 파일을 직접 실행했을 때만 서버 실행
if __name__ == '__main__':
    # 서버 실행(코드 수정 시 자동 반영)
<<<<<<< HEAD
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)
=======
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)

>>>>>>> 5d41be769e2c52fdb8113485ed4c7a497d9621ac
