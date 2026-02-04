class TurtleAnimation {
    constructor() {
        console.log("🐢 거북이 조종: 시스템 점검 시작...");

        // 1. HTML에서 필요한 요소들을 수집합니다.
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
            this.init();
        }
    }

    init() {
        // ✅ 체크박스 이벤트 감지
        this.attachCheckboxListeners();

        // ✅ 할일 추가 폼 감지
        this.attachFormListener();

        // ✅ 삭제 버튼 감지
        this.attachDeleteListeners();
    }

    // 체크박스 변경 감지
    attachCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.real-checkbox');
        
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', async (e) => { //!todo : 체크박스 'change' 이벤트 발생 시 이 함수 자동 실행
                const taskId = e.target.getAttribute('data-id');

                try {
                    // 서버에 상태 저장
                    await fetch(`/toggle_todo/${taskId}`);

                    // 🔥 진행률 갱신
                    await this.refreshProgress();

                } catch (error) {
                    console.error("체크박스 처리 중 오류:", error);
                }
            });
        });

        if (checkboxes.length > 0) {
            console.log(`✅ ${checkboxes.length}개의 체크박스 감지 완료`);
        }
    }

    // 할일 추가 폼 감지
    attachFormListener() {
        const form = document.querySelector('form[action="/update_todo"]');
        
        if (form) {
            form.addEventListener('submit', async (e) => { //!todo : 추가 submit 이벤트 발생 시 이 함수 자동 실행
                // 폼 제출 후 페이지가 새로고침되므로
                // 서버에서 redirect하면 자동으로 갱신됨
                // 하지만 만약 AJAX로 처리하고 싶다면 아래 주석 해제
                
                /*
                e.preventDefault(); // 새로고침 방지
                
                const formData = new FormData(form);
                
                try {
                    await fetch('/update_todo', {
                        method: 'POST',
                        body: formData
                    });
                    
                    // 폼 초기화
                    form.reset();
                    
                    // 진행률 갱신
                    await this.refreshProgress();
                    
                    // 할일 목록도 새로 불러와야 함 (추가 작업 필요)
                    location.reload();
                    
                } catch (error) {
                    console.error("할일 추가 중 오류:", error);
                }
                */
            });
            
            console.log("✅ 할일 추가 폼 감지 완료");
        }
    }

    // 삭제 버튼 감지
    attachDeleteListeners() { 
        const deleteForms = document.querySelectorAll('form[action^="/delete_todo/"]');
        
        deleteForms.forEach((form) => { //todo : '삭제'로 form submit 이벤트 발생 시 이 함수 자동 실행
            form.addEventListener('submit', async (e) => {
                // 서버에서 redirect하므로 자동 새로고침됨
                // AJAX로 처리하려면 주석 해제
                
                /*
                e.preventDefault();
                
                try {
                    await fetch(form.action, {
                        method: 'POST'
                    });
                    
                    await this.refreshProgress();
                    location.reload();
                    
                } catch (error) {
                    console.error("할일 삭제 중 오류:", error);
                }
                */
            });
        });

        if (deleteForms.length > 0) {
            console.log(`✅ ${deleteForms.length}개의 삭제 버튼 감지 완료`);
        }
    }

    // 🔥 진행률 갱신 핵심 함수
    async refreshProgress() {
        try {
            const response = await fetch('/api/progress');
            const data = await response.json(); // 서버가 보낸 진행률 값을 받아옴

            // 🌟 주의: 서버에서 반환하는 키가 'rate'임! //todo const percent = data.progress -> data.rate로 변경
            const percent = data.rate || 0;

            // UI 업데이트
            this.updateUI(percent);

        } catch (error) {
            console.error("진행률 가져오기 실패:", error);
        }
    }

    // 화면을 실제로 움직이는 함수
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
        if (this.progressText) {
            this.progressText.textContent = percent + "%";
        }
    } 
}

// 4. HTML 문서가 다 읽히면 거북이 조종사를 소환합니다.
document.addEventListener('DOMContentLoaded', () => {
    new TurtleAnimation();
});