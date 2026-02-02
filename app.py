from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask(__name__)

# tasks.json 파일을 읽어오는 함수
def get_user_progress():
    try:
        with open('tasks.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"user1": [], "user2": []}

# 데이터 저장 함수
def save_user_progress(data):
    """
    tasks.json 파일에 데이터를 저장하는 함수
    """
    pass


# user1의 달성률 계산 메서드
def calculate_completion_rate(user_id='user1'):
    """
    특정 사용자의 할 일 달성률을 계산하는 함수
    
    Args:
        user_id: 사용자 ID (기본값: 'user1')
    
    Returns:
        달성률 (0~100 사이의 정수)
    """
    data = get_user_progress()
    tasks = data.get(user_id, [])
    
    # 할 일이 없으면 0% 반환
    if not tasks:
            return 0
        
    # 완료된 할 일 개수 세기
    completed_tasks = [task for task in tasks if task.get('is_completed', False)]
    
    # 달성률 계산 (소수점 반올림)
    completion_rate = round((len(completed_tasks) / len(tasks)) * 100)
    
    return completion_rate


# 메인페이지
@app.route('/')
def index():
    data = get_user_progress()
    print("현재 tasks.json 데이터:", data)
    
    # user1의 할 일 목록을 HTML로 전달
    user_tasks = data.get('user1', [])
    
    # 달성률 계산
    completion_rate = calculate_completion_rate('user1')
    
    return render_template("index.html", tasks=user_tasks, completion_rate=completion_rate)

# 할 일 추가
@app.route('/add_todo', methods=['POST'])
def add_todo():
    '''
    할 일 추가 로직 함수 내역
    '''
    return redirect(url_for('index'))

# 할 일 완료 상태 토글
@app.route('/toggle_todo/<int:task_id>', methods=['POST'])
def toggle_todo(task_id):
    data = get_user_progress()
    
    # 해당 ID의 할 일 찾기
    for task in data.get('user1', []):
        if task['id'] == task_id:
            task['is_completed'] = not task['is_completed']
            # TODO: save_user_progress(data) 호출 필요
            print(f"[토글됨] ID {task_id}: {task['is_completed']}")
            break
    
    return redirect(url_for('index'))

# 할 일 삭제
@app.route('/delete_todo/<int:task_id>', methods=['POST'])
def delete_todo(task_id):
    
    '''
        해당 ID의 할 일 삭제 함수
    '''
    print(f"[삭제됨] ID {task_id}")
    
    return redirect(url_for('index'))

# 기존 update_todo는 참고용으로 남겨둠
@app.route('/update_todo', methods=['POST'])
def update_todo():
    content = request.form.get('todo_content')
    is_done = request.form.get('is_done') == 'done'
    
    print(f"할 일: {content}, 완료 여부: {is_done}")
    
    return "데이터를 잘 받았어요!"

if __name__ == '__main__':
    app.run(debug=True)