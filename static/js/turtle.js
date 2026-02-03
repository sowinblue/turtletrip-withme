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
        this.checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', async (e) => {
                // e.target이 체크박스이므로, HTML에 설정된 데이터 정보를 가져옵니다.
                // HTML의 input에 data-id="{{ task.id }}"가 있어야 합니다!
                const taskId = e.target.getAttribute('data-id');

                try {
                    // 1. 체크 상태를 서버에 저장 (새로고침 방지)
                    // 팀원의 API 구조에 따라 /toggle_todo/${taskId} 등으로 호출
                    await fetch(`/toggle_todo/${taskId}`, { method: 'POST' });

                    // 2. /api/progress를 호출하여 계산된 최신 진행률 가져오기 (B 작업 핵심)
                    const response = await fetch('/api/progress');
                    const data = await response.json(); // { "progress": 75 } 형태 가정

                    // 3. UI 갱신 함수 호출
                    this.updateUI(data.progress);

                } catch (error) {
                    console.error("데이터 연동 중 오류가 발생했습니다:", error);
                }
            });
        });
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
document.addEventListener('DOMContentLoaded', () => {
    new TurtleAnimation();
});