

data = {
    "tasks": [
        {
            "id": "init-1",
            "content": "샘플 할 일",
            "is_done": False
        },
        {
            "id": "overhead",
            "content": "오버플로우 발생시키기",
            "is_done": True
        },
        {
            "id": "readygo",
            "content": "집갈 준비하기",
            "is_done": False
        },{
            "id": "rendering",
            "content": "렌더링",
            "is_done": True
        },
        
        
    ]
}

is_done_list = [task.get('is_done') for task in data.get('tasks', [])] # is_done 값만 뽑아오기

count = 0
for completed in is_done_list:
    if completed == True:
        count += 1
        
result = count / len(is_done_list) * 100
print(f'{result}%')