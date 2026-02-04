
class SeaController:
    def __init__(self):
        self.DATA_FILE = "data.js"
        
    def calculate_and_push(self, progress):
        # 100일 때 원본 복귀
        brightness = round(0.2 + (progress / 100) * 0.8, 2)
        hue = int((100 - progress) * 2)
        
        # 속도 조절: 0%일 때 60초(매우 느림) -> 100%일 때 30초(적당히 빠름)
        # 이 값을 키울수록 전체적으로 더 느려집니다.
        speed = round(60.0 - (progress / 100) * 30.0, 1)
        
        js_code = f"updateEnv({progress}, {brightness}, {hue}, {speed});"
        
        with open(self.DATA_FILE, "w", encoding="utf-8") as f:
            f.write(js_code)
        print(f"-> [전달] {progress}% | B:{brightness} | H:{hue} | Speed:{speed}s")

if __name__ == "__main__":
    c = SeaController()
    while True:
        try:
            val = input("달성률 입력 (0-100): ")
            if val.lower() == 'q': break
            c.calculate_and_push(int(val))
        except: pass