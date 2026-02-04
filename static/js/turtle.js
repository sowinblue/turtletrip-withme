class TurtleAnimation {
    constructor() {
        console.log("🐢 거북이 조종: 시스템 점검 시작...");

        // 1. HTML에서 필요한 요소들을 수집합니다.
        this.turtleContainer = document.querySelector('.turtle_container');
        this.progressBar = document.querySelector('#turtle-progress-bar');
        this.progressText = document.querySelector('.progress-text');
        this.turtleImg = document.querySelector('#turtle_img');
        this.moveline = document.querySelector('.turtle_moveline-section');

        // 2. 이전 진행률 저장 (점프 트리거용)
        this.previousRate = 0;

        // 4. 요소들이 잘 있는지 확인 (안정성 체크)
        this.checkElements();
    }

    checkElements() {
        if (!this.turtleContainer) console.error("❌ 거북이를 찾을 수 없어요!");
        if (!this.progressBar) console.error("❌ 상태바를 찾을 수 없어요!");
        if (!this.turtleImg) console.error("❌ 거북이 이미지를 찾을 수 없어요!");

        if (this.turtleContainer && this.progressBar) {
            console.log("✅ 모든 요소 준비 완료! 이제 명령을 기다립니다.");
        }
    }

    // ============================================
    // 1~2시간: 점프 애니메이션
    // ============================================
    triggerJump() {
        if (!this.turtleImg) return; // ! 예외 처리: 터틀 이미지가 없을 때 그냥 리턴

        // 점프 클래스 추가
        this.turtleImg.classList.add('jump-animation');

        // 애니메이션 끝나면 클래스 제거 (재사용 가능하도록)
        setTimeout(() => {
            this.turtleImg.classList.remove('jump-animation');
        }, 600); // 애니메이션 지속 시간과 동일

        console.log("🐰 거북이 점프!");
    }

    // ============================================
    // 화면을 실제로 움직이는 함수
    // ============================================
    updateUI(percent) {
        console.log(`현재 진행률: ${percent}% - 거북이 이동 중...`);

        // 1. 거북이 위치 반영
        if (this.turtleContainer) {
            this.turtleContainer.style.left = percent + "%";
        }

        // 2. 상태바 너비 반영
        if (this.progressBar) {
            this.progressBar.style.width = percent + "%";
        }

        // 3. 상태바 안의 텍스트 숫자 변경
        const textNode = document.querySelector('.progress-text');
        if (textNode) {
            textNode.textContent = percent + "%";
        }

        // ============================================
        // 4. 점프 애니메이션 트리거 (rate 증가 시)
        // ============================================
        if (percent > this.previousRate && percent < 100) {
            this.triggerJump();
        }

        // 현재 값을 이전 값으로 저장
        this.previousRate = percent;
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