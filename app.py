from flask import Flask, render_template, request, redirect, url_for, jsonify
from modules.data_manager import DataManager
from modules.task_validator import TaskValidator
from modules.progress_calculator import ProgressCalculator
import uuid # 고유 ID 생성을 위해 사용

app = Flask(__name__) #__name__으로 내 위치를 알려(코드가 실행되는 위치) flask 를 사용

#클래스를 변수 안에 넣어서 실체(인스턴스)를 만듦(이제 편하게 쓰면 됨)
dm = DataManager() 
tv = TaskValidator()
pc = ProgressCalculator()

# 메인페이지("/") 접속시 실행되는 함수
@app.route('/')
def index():
    # tasks.json 데이터 가져오기
    data = dm.get_user_progress()

    # 데이터가 잘 읽혔는지 터미널에서 확인하기
    print("현재 tasks.json 데이터:", data)

    tasks = data.get('tasks', [])
    calculation_rate = pc.calculate_completion_rate(tasks)
    
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
@app.route('/toggle_todo/<task_id>', methods=['POST'])
def toggle_todo(task_id):
    # 1. 데이터 가져오기
    data = dm.get_user_progress()

    # 2. 해당 ID의 체크 상태 반전
    for task in data['tasks']:
        if task['id'] == task_id:
            task['is_done'] = not task['is_done'] # 상태 뒤집기
            break

    # 3. 변경된 데이터 저장
    dm.save_tasks(data)

    # 4. [개선] 저장 직후 최신 진행률을 바로 계산
    new_rate = pc.calculate_completion_rate(data['tasks'])

    # 5. [개선] 결과와 진행률을 한 번에 반환
    return jsonify({"success": True, "new_rate": new_rate})

# 할 일 삭제
@app.route('/delete_todo/<task_id>',methods=['POST'])
def delete_todo(task_id):
    data = dm.get_user_progress()
    data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
    dm.save_tasks(data)
    return redirect(url_for('index'))



# 할 일 수정 로직 (POST 방식)
@app.route('/edit_todo/<task_id>', methods=['GET', 'POST'])
def edit_todo(task_id):
    if request.method == 'POST':
    # 1. 수정된 내용 가져오기
        new_content = request.form.get('content')
        
        # 2. 빈 값 검사 (유효성 검사기 활용)
        if not tv.is_valid(new_content):
            # 만약 비어있다면 수정하지 않고 메인으로 돌아가거나 에러 처리
            return redirect(url_for('index'))

        # 3. 데이터 업데이트 호출
        dm.update_task(task_id, new_content)
        
        print(f"ID {task_id}의 내용이 '{new_content}'로 수정되었습니다.")
        
        # 4. 수정 완료 후 메인 페이지로 이동
        return redirect(url_for('index'))
        
    else:
        # 1. 기존 데이터 가져오기
        data = dm.get_user_progress()
        
        # 2. 리스트에서 수정하려는 task 찾기
        task = next((t for t in data['tasks'] if t['id'] == task_id), None)
        
        # 3. 만약 해당 id의 task가 없으면 메인으로 튕겨내기
        if task is None:
            return redirect(url_for('index'))
        
        # 4. 찾은 task 데이터를 edit.html에 전달하며 페이지 띄우기
        return render_template("edit.html", task=task)

@app.route('/api/progress')
def get_progress():
    """
    프론트엔드(JavaScript)에서 fetch로 호출하는 API
    반환 형식:
        { "rate": 50 }

    turtle.js에서 이 값을 받아 거북이 위치를 업데이트합니다.
    """
    data = dm.get_user_progress()
    tasks = data.get('tasks', [])

    # 진행률 계산은 모듈에 위임
    rate = pc.calculate_completion_rate(tasks)

    return jsonify({"rate": rate})

@app.route('/background') #sb 24_배경에 접속하면 이 함수를 실행해라.
def background():
    return render_template('background/background.html') #templates폴더 안에 있는 html문법을 찾아옴. 
    # 파이썬 코드 안에 있는 변수값을 html의 빈칸_{{flask문법}}에 끼워넣어줌

# 이 파일을 직접 실행했을 때만 서버 실행
if __name__ == '__main__':
    # 서버 실행(코드 수정 시 자동 반영)
    app.run(debug=True)  #디버그 모드로 서버 실행(코드 수정시 자동 재시작)

