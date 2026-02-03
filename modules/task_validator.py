#리펙토링 - 입력값이 비어있는지 확인용
class TaskValidator:
    def is_valid(self, content): # content를 받을것.
        if not content or content.strip() == "": #만약 content가 없거나 비어있으면
            return False # false를 반환
        else :
            return True # True를 반환