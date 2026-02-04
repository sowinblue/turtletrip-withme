class TurtleAnimation {
    constructor() {
        console.log("🐢 거북이 조종: 시스템 점검 시작...");

        // 1. HTML에서 필요한 요소들을 수집합니다.
        // index.html에 적힌 클래스와 ID를 기준으로 합니다.
        this.turtleContainer = document.querySelector('.turtle_container');
        this.progressBar = document.querySelector('#turtle-progress-bar');
        this.progressText = document.querySelector('.progress-text');

        // 2. 요소들이 잘 있는지 확인 (안정성 체크)
        this.checkElements();
    }

    checkElements() {
        if (!this.turtleContainer) console.error("❌ 거북이를 찾을 수 없어요!");
        if (!this.progressBar) console.error("❌ 상태바를 찾을 수 없어요!");

        if (this.turtleContainer && this.progressBar) {
            console.log("✅ 모든 요소 준비 완료! 이제 명령을 기다립니다.");
        }
    }

    // 화면을 실제로 움직이는 함수
    updateUI(percent) {
        console.log(`현재 진행률: ${percent}% - 거북이 이동 중...`);

        // 1. 거북이 위치 반영
        if (this.turtleContainer) {
            // style.left에 단위를 명확히 붙여줍니다.
            this.turtleContainer.style.left = percent + "%";
        }

        // 2. 상태바 너비 반영
        if (this.progressBar) {
            this.progressBar.style.width = percent + "%";
            
            // 3. 상태바 안의 텍스트 숫자 변경
            // 부모 안에서 찾지 말고 더 확실하게 전체에서 찾아봅니다.
            const textNode = document.querySelector('.progress-text');
            if (textNode) {
                textNode.textContent = percent + "%";
            }
        }
    } 
}

// 4. HTML 문서가 다 읽히면 거북이 조종사를 소환합니다.
let turtleAnimation;

document.addEventListener('DOMContentLoaded', () => {
    turtleAnimation = new TurtleAnimation();
    
    // 전역 함수로 제공 (외부에서 호출 가능)
    window.updateTurtle = function(rate) {
        if (turtleAnimation) {
            turtleAnimation.updateUI(rate);
        } else {
            console.error("❌ 거북이 애니메이션이 초기화되지 않았습니다.");
        }
    };
    
    console.log("✅ window.updateTurtle() 함수 사용 가능");
});