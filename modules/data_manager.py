from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__) #__name__으로 내 위치를 알려(코드가 실행되는 위치) Flask 를 사용

#리펙토링
class DataManager: 
    def __init__(self, file_path='tasks.json'): # json 파일명을 변수에 넣음(편하게 쓰려고)
        self.file_path = file_path # 기본값으로 file_path(tasks.json)을 쓰겠다.

    #* 1. JSON 파일 읽기 - 파일 있으면 반환 없으면 {"tasks": []}
    def get_user_progress(self):
        # 파일이 아예 존재하지 않는 경우를 먼저 체크한다.
        if not os.path.exists(self.file_path):
            initial_data = {"tasks": [],"rate": 0}
            self.save_tasks(initial_data)
            return initial_data
        
        try: #* 일단 하고싶은거 해라
            with open(self.file_path, 'r', encoding='utf-8') as f:
                # json.load(f)를 시도한다.
                data = json.load(f)
                
                # 파일은 있는데 내용이 None이거나 tasks 키가 없는 경우 방어
                if not data or 'tasks' not in data:
                    return {"tasks": [], "rate": 0}
                return data

        except (json.JSONDecodeError, ValueError, KeyError):
            # 🔹 [핵심] JSON 파일이 깨졌을 때 발생하는 에러를 잡아낸다.
            # 파일은 있지만 내용이 꼬였을 경우(Extra data 등), 
            # 에러를 뿜지 않고 빈 데이터를 반환하여 앱이 죽지 않게 책임진다.
            print(f"경고: {self.file_path} 파일이 손상되었습니다. 초기화합니다.")
            backup_data = {"tasks":[], "rate": 0}
            self.save_tasks(backup_data)
            return backup_data


    #* 2. JSON 파일 데이터저장
    def save_tasks(self, data): # data(JSON에 쓸 내용) 입력 받기
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
        # tasks.json 파일 열어서 write 모드로 - w 모드는 기존 내용 전부 삭제 후 다시 씀.
            json.dump(data, f, ensure_ascii=False, indent=4)
            # 입력한'data'를 JSON 문자열로 바꿔서 JSON 파일에 저장(던짐)
            # ensure_ascii=False를 써야 한글이 깨지지 않고 저장됨.
            # indent=4를 주면 파일이 예쁘게 정렬됨.

    
    #* 3. 특정 할 일 수정하기
    def update_task(self, task_id, new_content):
        data = self.get_user_progress()
        
        # 🛡️ 추가: 데이터 구조가 비정상적일 때 서버 터짐 방지
        if not data or 'tasks' not in data:
            print("로그: 데이터 형식이 잘못되어 수정을 중단합니다.")
            return False
        
        is_updated=False
        for task in data['tasks']:
            # 🛡️ 보강: .get('id')를 써서 'id' 키가 없어도 에러 안 나게 함
            if task.get('id') == task_id:
                task['content'] = new_content
                is_updated = True  # 내용 변경
                break

        # 🛡️ 추가: 실제로 수정된 게 있을 때만 저장 실행
        if is_updated:
            self.save_tasks(data)
            return True
        return False