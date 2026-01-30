


##### 손예진 태스크 #####
# for 유저1의 할 일 목록을 순회:
#     if is_completed가 true일 경우:
#         is_completed_count += 1

import json

def get_user_progress():
    try:
        # 1. JSON 파일 읽기
        with open('tasks.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

            return data

    except FileNotFoundError:
        return "파일을 찾을 수 없습니다."
    

# def save_user_progress(): # 할일 저장용 함수 -html에서 사용자에게 사용자가 입력한 할일 받아오기


# C: 할일 만들기
# R: 조회하기 (HTML 화면)
# U: 할일 수정 기능 (버튼 어디에?)
# D: 할일 삭제 기능 (버튼 어디에?2)

from flask import Flask
app = Flask(__name__)
@app.route('/')
def home():
	return "<h1>Flask 서버가 정상적으로 실행 중입니다!</h1>"
if __name__ == '__main__':
	app.run(debug=True)