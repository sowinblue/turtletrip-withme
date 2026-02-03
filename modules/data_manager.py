from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask(__name__) #__name__으로 내 위치를 알려(코드가 실행되는 위치) Flask 를 사용

#리펙토링
class DataManager: 
    def __init__(self, file_path='tasks.json'): # json 파일명을 변수에 넣음(편하게 쓰려고)
        self.file_path = file_path # file_path 값 받기 위해 세팅.

    #* 1. JSON 파일 읽기
    def get_user_progress(self): #'json 파일'을 입력하면 읽어서 파이썬에서 쓸 수 있게 반환함.
        try: #* 일단 하고싶은거 해라
            with open(self.file_path, 'r', encoding='utf-8') as f: # with 블록이 끝나면 f라는 별명도 사라짐
            # 파일 열고(읽을 파일명, 모드(읽기), 글자 형식_안 깨지게(utf-8))
            # f라고 별명을 붙이면 연 파일을 '찾을 때' 어딨는지 알려주고, 데이터를 꺼내올 수 있게 도와줌
                return json.load(f) # 파일 안의 내용을 파이썬에서 쓸 수 있게 반환

        except FileNotFoundError: #* 파일이 없으면 딱 잡아냄. "어어 너 파일 없네??"
            return {"tasks": []} # 반환

    #* 2. JSON 파일 데이터저장
    def save_tasks(self, data): # 전에 만든거 꺼내오고(self.file_path) data 받겠다.  
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
        # tasks.json 파일 열어서 write 모드로 - w 모드는 기존 내용 전부 삭제 후 다시 씀.

            json.dump(data, f, ensure_ascii=False, indent=4)
            # 입력한'data'를 JSON 문자열로 바꿔서 JSON 파일에 저장(던짐)
            # ensure_ascii=False를 써야 한글이 깨지지 않고 저장됨.
            # indent=4를 주면 파일이 예쁘게 정렬됨.
