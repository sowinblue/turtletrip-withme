from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask(__name__) #__name__으로 내 위치를 알려(코드가 실행되는 위치) Flask 를 사용

#리펙토링
class DataManager: 
    def __init__(self, file_path='tasks.json'): # json 파일명을 변수에 넣음(편하게 쓰려고)
        self.file_path = file_path # 기본값으로 file_path(tasks.json)을 쓰겠다.

    #* 1. JSON 파일 읽기 - 파일 있으면 반환 없으면 {"tasks": []}
    def get_user_progress(self):
        try: #* 일단 하고싶은거 해라
            with open(self.file_path, 'r', encoding='utf-8') as f: # with 블록이 끝나면 f(통로)도 사라짐
            # 파일 열고(읽을 파일명, 모드(읽기), 글자 형식_안 깨지게(utf-8))
            # f를 꼽으면 연 파일을 '찾을 때' 어딨는지 알려주고, 데이터를 꺼내올 수 있게 도와줌(통로임)
                return json.load(f)
                # f(통로)로 내용을 예쁘게 가져옴(json안에 있는 도구인 load로)
                #read(읽기)+decode(변환) == load(읽고 변환해서 {} & []에 넣어줌) 같은 느낌

        except FileNotFoundError: #* 파일이 없으면 딱 잡아냄. "어어 너 파일 없네??"
            return {"tasks": []} # 반환

    #* 2. JSON 파일 데이터저장
    def save_tasks(self, data): # data(JSON에 쓸 내용) 입력 받기
        
        with open(self.file_path, 'w', encoding='utf-8') as f:
        # tasks.json 파일 열어서 write 모드로 - w 모드는 기존 내용 전부 삭제 후 다시 씀.

            json.dump(data, f, ensure_ascii=False, indent=4)
            # 입력한'data'를 JSON 문자열로 바꿔서 JSON 파일에 저장(던짐)
            # ensure_ascii=False를 써야 한글이 깨지지 않고 저장됨.
            # indent=4를 주면 파일이 예쁘게 정렬됨.
