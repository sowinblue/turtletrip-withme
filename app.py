from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import uuid # 고유 ID 생성을 위해 사용
# 진행률 계산 로직 분리를 위한 모듈 import
# (기존 calculate_completion_rate 함수 제거 후 모듈 사용)
from modules.progress_calculator import ProgressCalculator

app = Flask(__name__)

# ProgressCalculator 인스턴스 생성
calculator = ProgressCalculator()


# tasks.json 파일을 읽어오는 함수
def get_user_progress():
    try:
        # 1. JSON 파일 읽기
        with open('tasks.json', 'r', encoding='utf-8') as f:
            # 파일 안의 내용을 파이썬에서 쓸 수 있게 반환
            return json.load(f)
    except FileNotFoundError:
        # 파일이 없을 경우를 대비
        return {"tasks": []}

# tasks.json 파일에 데이터를 저장하는 함수
def save_tasks(data):
    # tasks.json 파일 열어서 write 모드로 - w 모드는 기존 내용 전부 삭제 후 다시 씀.
    with open('tasks.json', 'w', encoding='utf-8') as f:
        # 파이썬 데이터를 JSON 문자열로 바꿔서 파일에 저장
        # ensure_ascii=False를 써야 한글이 깨지지 않고 저장됨.
        # indent=4를 주면 파일이 예쁘게 정렬됨.
        json.dump(data, f, ensure_ascii=False, indent=4)

# User1의달성률 계산 메서드
# → 진행률 계산 책임을 modules/progress_calculator.py 로 이동
# → app.py에는 계산 로직을 두지 않기로 팀 개발계획에서 합의됨

# 메인페이지("/") 접속시 실행되는 함수
@app.route('/')
def index():
    # tasks.json 데이터 가져오기
    data = get_user_progress()

    # 데이터가 잘 읽혔는지 터미널에서 확인하기
    print("현재 tasks.json 데이터:", data)

    # 기존 calculate_completion_rate() 대신
    # ProgressCalculator 모듈을 사용하여 진행률 계산
    tasks = data.get('tasks', [])
    calculation_rate = calculator.calculate_completion_rate(tasks)

    # index.html 파일을 화면에 보여줌 (tasks 데이터를 함께 전달)
    return render_template("index.html", tasks=tasks, rate=calculation_rate)


# 사용자가 보낸 데이터를 받기 (할 일 추가)
@app.route('/update_todo', methods=['POST'])
def update_todo():
    # 1. 텍스트 박스 내용 가져오기
    content = request.form.get('todo_content')
    
    # 입력값이 비어있는지 확인하기
    if not content or content.strip() == "":
        return redirect(url_for('index')) # 그냥 메인으로 돌아감

    # 2. 기존 데이터 가져오기
    data = get_user_progress()
    
    # 3. 고유 ID 생성(uuid 활용)
    # 너무 길면 8자리만 잘라서 쓸 수도 있음.
    task_id = str(uuid.uuid4())[:8]
    
    # 4. 새 데이터 객체 만들기
    new_task = {
        "id": task_id,  # 고유 id 부여
        "content": content, # 내용
        "is_done": False # 처음 만들 땐 무조건 안 한 상태
    }
    
    # 기존 리스트에 추가하고 파일에 저장
    data['tasks'].append(new_task)
    save_tasks(data)
    
    print(f"새로운 할 일이 저장되었습니다: {new_task}") # 터미널에서 확인용
    
    # 저장 후 다시 메인 화면으로 돌아가기
    return redirect(url_for('index'))


# 체크박스 상태 토글 (완료/미완료 변경)
@app.route('/toggle_todo/<task_id>')
def toggle_todo(task_id):
    data = get_user_progress()
    for task in data['tasks']:
        if task['id'] == task_id:
            task['is_done'] = not task['is_done'] # 상태 뒤집기
            break
    save_tasks(data)
    return redirect(url_for('index'))


# 할 일 삭제
@app.route('/delete_todo/<task_id>')
def delete_todo(task_id):
    data = get_user_progress()
    data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
    save_tasks(data)
    return redirect(url_for('index'))

# --- [API] 프론트엔드 연동용: 진행률 조회 ---
@app.route('/api/progress')
def api_get_progress():
    """
    프론트엔드(JavaScript)에서 fetch(AJAX)로 호출하는 API

    반환 예시:
        { "rate": 50 }

    turtle.js에서 이 값을 받아
    거북이 위치 및 프로그레스 바를 업데이트합니다.
    """
    data = get_user_progress()
    tasks = data.get('tasks', [])

    # 진행률 계산은 모듈에 위임
    rate = calculator.calculate_completion_rate(tasks)

    return jsonify({"rate": rate})

# 이 파일을 직접 실행했을 때만 서버 실행
if __name__ == '__main__':
    # 서버 실행(코드 수정 시 자동 반영)
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)

-------------

from flask import Flask, render_template, request, redirect, url_for
from modules.data_manager import DataManager
from modules.task_validator import TaskValidator
import uuid # 고유 ID 생성을 위해 사용

app = Flask(__name__) #__name__으로 내 위치를 알려(코드가 실행되는 위치) flask 를 사용

#클래스를 변수 안에 넣어서 실체(인스턴스)를 만듦(이제 편하게 쓰면 됨)
dm = DataManager() 
tv = TaskValidator()

# user1의 달성률 계산 함수

"""
할 일 달성률을 계산하는 함수

Returns:
달성률 (0~100 사이의 정수)
"""

def calculate_completion_rate():
    data = dm.get_user_progress() # 클래스 안에서 함수 가져와서 결과값을 data에 넣겠다.
    # get_user_progress() : json 파일이 '존재'하면 안에 든 내용을 가져옴. 없으면 {"tasks": []} 반환
    
    tasks = data['tasks'] # 데이터가 없을 경우 에러 방지(데이터를 가져오는 역할)
    if not tasks: # 데이터가 없을 경우 에러 방지(데이터를 가져오는 역할)
        return 0 # 데이터가 없을 경우 에러 방지(수학적 사고 방지) #수빈

    is_done_list = [task.get('is_done') for task in tasks] # is_done 값만 뽑아오기
    # 체크박스 상태 확인 (체크 안 되면 None이 들어옵니다)

    count = 0
    for completed in is_done_list:
        if completed == True:
            count += 1
            
    # (완료된 개수 / 전체 개수) * 100
    completion_rate = count / len(is_done_list) * 100
    print(f'현재 달성률: {completion_rate}%')
    
    return int(completion_rate) # 소수점 없이 정수로 반환


# 메인페이지("/") 접속시 실행되는 함수
@app.route('/')
def index():
    # tasks.json 데이터 가져오기
    data = dm.get_user_progress()

    # 데이터가 잘 읽혔는지 터미널에서 확인하기
    print("현재 tasks.json 데이터:", data)

    calculation_rate = calculate_completion_rate()
    
    # index.html 파일을 화면에 보여줌 (tasks 데이터를 함께 전달)
    return render_template("index.html", tasks=data['tasks'], rate=calculation_rate)

# 사용자가 보낸 데이터를 받기 (할 일 추가)
@app.route('/update_todo', methods=['POST'])
def update_todo():
    # 1. 텍스트 박스 내용 가져오기
    content = request.form.get('todo_content')
    
    # 입력값이 비어있는지 확인용
    if not tv.is_valid(content): # 만약 입력값 없는게 걸리면 검사 통과 못 하면
        return redirect(url_for('index')) # 쫓아내기


    # 2. 기존 데이터 가져오기
    data = dm.get_user_progress()
    
    # 3. 고유 ID 생성(uuid 활용)
    # 너무 길면 8자리만 잘라서 쓸 수도 있음.
    task_id = str(uuid.uuid4())[:8]
    
    # 4. 새 데이터 객체 만들기
    new_task = {
        "id": task_id,  # 고유 id 부여
        "content": content, # 내용
        "is_done": False # 처음 만들 땐 무조건 안 한 상태
    }
    
    # 기존 리스트에 추가하고 파일에 저장
    data['tasks'].append(new_task)
    dm.save_tasks(data)
    
    print(f"새로운 할 일이 저장되었습니다: {new_task}") # 터미널에서 확인용
    
    # 저장 후 다시 메인 화면으로 돌아가기
    return redirect(url_for('index'))

# 체크박스 상태 토글 (완료/미완료 변경)
@app.route('/toggle_todo/<task_id>')
def toggle_todo(task_id):
    data = dm.get_user_progress()
    for task in data['tasks']:
        if task['id'] == task_id:
            task['is_done'] = not task['is_done'] # 상태 뒤집기
            break
    dm.save_tasks(data)
    return redirect(url_for('index'))

# 할 일 삭제
@app.route('/delete_todo/<task_id>')
def delete_todo(task_id):
    data = dm.get_user_progress()
    data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
    dm.save_tasks(data)
    return redirect(url_for('index'))

# 이 파일을 직접 실행했을 때만 서버 실행
if __name__ == '__main__':
    # 서버 실행(코드 수정 시 자동 반영)
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)