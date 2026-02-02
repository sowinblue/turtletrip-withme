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

# TODO: 데이터 저장 함수 (팀원이 작성 예정)
def save_user_progress(data):
    """
    tasks.json 파일에 데이터를 저장하는 함수
    현재는 구현 대기 중
    """
    pass  # 나중에 구현될 예정

# 메인페이지
@app.route('/')
def index():
    data = get_user_progress()
    print("현재 tasks.json 데이터:", data)
    
    # user1의 할 일 목록을 HTML로 전달
    user_tasks = data.get('user1', [])
    return render_template("index.html", tasks=user_tasks)

# 할 일 추가
@app.route('/add_todo', methods=['POST'])
def add_todo():
    content = request.form.get('todo_content')
    
    if content and content.strip():  # 내용이 비어있지 않은 경우만
        data = get_user_progress()
        
        # 새 할 일의 ID 생성 (기존 ID 중 최댓값 + 1)
        existing_ids = [task['id'] for task in data.get('user1', [])]
        new_id = max(existing_ids) + 1 if existing_ids else 1
        
        # 새 할 일 추가
        new_task = {
            "id": new_id,
            "content": content.strip(),
            "is_completed": False
        }
        
        if 'user1' not in data:
            data['user1'] = []
        data['user1'].append(new_task)
        
        # TODO: save_user_progress(data) 호출 필요
        print(f"[추가됨] {new_task}")  # 임시로 콘솔에 출력
    
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
    data = get_user_progress()
    
    # 해당 ID의 할 일 삭제
    if 'user1' in data:
        data['user1'] = [task for task in data['user1'] if task['id'] != task_id]
        # TODO: save_user_progress(data) 호출 필요
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