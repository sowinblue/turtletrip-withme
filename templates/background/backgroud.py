import os

class SeaController:
    def __init__(self):
        # data.js가 저장될 경로 (Flask의 static 폴더 권장)
        self.DATA_FILE = "static/data.js"
        
    def calculate_and_push(self, progress):
        """
        입력받은 progress(0~100)를 바탕으로 시각 효과 수치를 계산하여 JS 파일로 저장합니다.
        """
        # 1. 안전 장치 (0~100 범위 고정)
        progress = max(0, min(100, progress))
        
        # 2. 시각 효과 계산
        # 0%일 때 0.2(어두움), 100%일 때 1.0(정상)
        brightness = round(0.2 + (progress / 100) * 0.8, 2)
        
        # 0%일 때 200deg(보라/심해색), 100%일 때 0deg(정상 파란색)
        hue = int((100 - progress) * 2)
        
        # 배경 오프셋 (JS 내부에서 직접 계산하도록 넘겨만 줌)
        offset = -progress 
        
        # 3. JS 함수 호출 형태의 문자열 생성
        js_code = f"updateEnv({progress}, {offset}, {brightness}, {hue});"
        
        # 4. 파일 쓰기
        try:
            with open(self.DATA_FILE, "w", encoding="utf-8") as f:
                f.write(js_code)
            print(f"🌊 [환경 동기화] {progress}% | 밝기: {brightness} | 색조: {hue}deg")
        except Exception as e:
            print(f"❌ 파일 쓰기 오류: {e}")

if __name__ == "__main__":
    c = SeaController()
    print("=== 바다 배경 컨트롤러 실행됨 (종료: q) ===")
    while True:
        val = input("현재 달성률을 입력하세요 (0-100): ").strip()
        if val.lower() == 'q':
            break
        if val.isdigit():
            c.calculate_and_push(int(val))
        else:
            print("숫자만 입력해 주세요.")