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
        
        // 3. 완주 상태 플래그
        this.isCompleted = false;
        //하트 연출이 진행 중인지 확인하는 isEventRunning 변수
        this.isEventRunning = false;
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
    // [신규] 50% 지점 하트 연출 로직
    // ============================================
    triggerHalfwayEvent(percent) {
        if (this.isEventRunning) return; // 중복 실행 방지
        this.isEventRunning = true;

        console.log("✨ 50% 달성! 하트 연출");

        // 1. 점프 실행 (하트와 동시에 뛰게 함)
        this.triggerJump();

        // 1. 브라우저가 이동(left %) 계산을 끝낸 직후에 점프를 실행하도록 강제함
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.triggerJump(); // 거북이가 이동 중에 폴짝!
            }, 50); // 아주 미세한 간격을 줘서 이동과 충돌 방지
        });

        // 2. 점프해서 공중에 떠 있을 때(약 0.3~0.4초 뒤) 하트가 나타남
        setTimeout(() => {
            if (this.progressText) {
                this.progressText.textContent = "❤️";
                this.progressText.style.fontSize = "16px";
            }
            this.turtleImg.classList.add('turtle-celebration');
            console.log("❤️ 하트 등장!");
        }, 600); 

        // 3. 연출 종료 및 원복
        setTimeout(() => {
            if (this.progressText) {
                this.progressText.textContent = percent + "%";
                this.progressText.style.fontSize = "11px";
            }
            this.turtleImg.classList.remove('turtle-celebration');
            this.isEventRunning = false;
            console.log("🔄 연출 종료 및 정상 복구");
        }, 2000); 
    }




    // ============================================
    // 1~2시간: 점프 애니메이션
    // ============================================
    triggerJump() {
        // ★ wrapper 요소 찾기 (HTML에서 추가한 .turtle-wrapper)
        const turtleWrapper = document.querySelector('.turtle-wrapper');

        if (!turtleWrapper) {
            console.error("❌ turtle-wrapper를 찾을 수 없어요!");
            return;
        }

       // ★ wrapper에 점프 애니메이션 적용
        turtleWrapper.style.transition = 'transform 0.5s ease';
        turtleWrapper.style.transform = 'translateY(-30px)';

        // 0.5초 후 원위치

        setTimeout(() => {
            turtleWrapper.style.transform = 'translateY(0)';
        }, 500);

        // 애니메이션 끝나면 클래스 제거 (재사용 가능하도록)
        //     this.turtleImg.classList.remove('jump-animation');
        // }, 600); // 애니메이션 지속 시간과 동일

        console.log("🐰 거북이 점프!");
    }

    
    // ============================================
    // 2~3시간: 100% 완주 연출
    // ============================================
    triggerCelebration() {
        if (!this.turtleImg || !this.moveline) return;

        console.log("🎉 완주 축하 연출 시작!");

        // 1. 거북이 이미지 변경 (있다면)
        // this.turtleImg.src = "{{ url_for('static', filename='images/turtle/turtle_happy.svg') }}";

        // 2. 거북이에 반짝임 효과 추가
        this.turtleImg.classList.add('turtle-celebration');

        // 3. 축하 텍스트 생성
        const celebrationText = document.createElement('div');
        celebrationText.className = 'celebration-text';
        celebrationText.textContent = '🎉 완주! 🎉';
        this.turtleContainer.appendChild(celebrationText);

        // 완주 상태 플래그 설정
        this.isCompleted = true;
    }
    
    // 완주 연출 해제 (rate < 100일 때)
    removeCelebration() {
        if (!this.turtleImg || !this.moveline) return;

        console.log("🔄 완주 연출 해제 - 기본 상태로 복귀");

        // 1. 거북이 이미지 원래대로 (변경했다면)
        // this.turtleImg.src = "{{ url_for('static', filename='images/turtle/turtle_idle.svg') }}";

        // 2. 반짝임 효과 제거
        this.turtleImg.classList.remove('turtle-celebration');

        // 3. 축하 텍스트 제거
        const celebrationText = this.turtleContainer.querySelector('.celebration-text');
        if (celebrationText) {
            celebrationText.remove();
        }

        // 4. 배경 효과 제거
        const celebrationBg = this.moveline.querySelector('.celebration-background');
        if (celebrationBg) {
            celebrationBg.remove();
        }

        // 완주 상태 플래그 초기화
        this.isCompleted = false;
    }

    // ============================================
    // 화면을 실제로 움직이는 함수
    // ============================================
    updateUI(percent,isEvent) {
        console.log(`현재 진행률: ${percent}% - 거북이 이동 중...`);

        // 1. 거북이 위치 반영
        if (this.turtleContainer) {
            this.turtleContainer.style.left = percent + "%";
        }

        // 2. 상태바 너비 반영
        if (this.progressBar) {
            this.progressBar.style.width = percent + "%";
        }

        //2. [추가] 하트 이벤트 발생 조건 체크
        if ((percent === 50 || isEvent) && !this.isEventRunning) {
        this.triggerHalfwayEvent(percent);
    }

        // 3. [수정] 하트 연출 중이 아닐 때만 기존 로직 실행
    else if (!this.isEventRunning) {
        const textNode = document.querySelector('.progress-text');
        if (textNode) {
            textNode.textContent = percent + "%";
        }

        if (percent > this.previousRate && percent < 100) {
            this.triggerJump();
        }
    }

        // ============================================
        // 5. 완주 연출 트리거 (rate === 100)
        // ============================================
        if (percent === 100 && !this.isCompleted) {
            this.triggerCelebration();
        }

        // ============================================
        // 6. 완주 연출 해제 (rate < 100일 때)
        // ============================================
        if (percent < 100 && this.isCompleted) {
            this.removeCelebration();
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
    window.updateTurtle = function(rate,isEvent) {
        if (turtleAnimation) {
            turtleAnimation.updateUI(rate,isEvent);
        } else {
            console.error("❌ 거북이 애니메이션이 초기화되지 않았습니다.");
        }
    };
    
    console.log("✅ window.updateTurtle() 함수 사용 가능");
});