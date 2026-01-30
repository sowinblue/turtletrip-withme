


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
    

# def save_user_progress():


# 실행 및 결과 확인
result = get_user_progress()
print(result)