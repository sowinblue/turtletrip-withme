class TurtleAnimation {
    constructor() {
        console.log("🐢 거북이 조종: 시스템 점검 시작...");

        // 1. HTML에서 필요한 요소들을 수집합니다.
        // index.html에 적힌 클래스와 ID를 기준으로 합니다.
        this.turtleContainer = document.querySelector('.turtle_container');
        this.progressBar = document.querySelector('#turtle-progress-bar');
        this.progressText = document.querySelector('.progress-text');
        this.checkboxes = document.querySelectorAll('.real-checkbox');

        // 2. 요소들이 잘 있는지 확인 (안정성 체크)
        this.checkElements();
    }

    checkElements() {
        if (!this.turtleContainer) console.error("❌ 거북이를 찾을 수 없어요!");
        if (!this.progressBar) console.error("❌ 상태바를 찾을 수 없어요!");
        if (this.checkboxes.length === 0) console.warn("⚠️ 체크박스가 하나도 보이지 않아요.");

        if (this.turtleContainer && this.progressBar) {
            console.log("✅ 모든 요소 준비 완료! 이제 명령을 기다립니다.");
            this.init();
        }
    }

    init() {
        // 3. 사용자가 체크박스를 누르는지 지켜보기 시작합니다.
        this.checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                console.log(`${index + 1}번째 할 일이 클릭되었습니다!`);
                // 여기서 나중에 fetch를 호출할 거예요.
            });
        });
    }
}

// 4. HTML 문서가 다 읽히면 거북이 조종사를 소환합니다.
document.addEventListener('DOMContentLoaded', () => {
    new TurtleAnimation();
});