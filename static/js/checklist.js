class ChecklistInteraction {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupOutsideClick();
        });

        // 전역에서 호출할 수 있도록 바인딩 (toggleMenu용)
        window.toggleMenu = (menuId) => this.toggleMenu(menuId);
    }

    setupEventListeners() {
        document.body.addEventListener('htmx:afterOnLoad', (event) => {
            // 1. 진행률 갱신
            if (event.detail.target.id.includes('task-') || event.detail.xhr.status === 200) {
                this.refreshProgress();
            }

            //yj: 2월 3일 명세) 할 일을 추가하면 자동으로 방금 추가한 할 일을 볼 수 있게 맨 아래로 스크롤해주는 기능을 담당하는 부분입니다. 현재 scrollToBottom() 함수가 정상 작동 안하므로 fix 후 테스트해주세요.
            /* 2. 수정된 부분: 조건을 'post' 요청 시로 단순화 */

            if (event.detail.requestConfig.verb === 'post') {
                this.scrollToBottom();
            }
        });
    }
    // 원래 내용//
    //         if (event.detail.requestConfig.verb === 'post' && event.detail.target.classList.contains('todo-list-container')) {
    //             this.scrollToBottom();


    //2. 진행률 갱신 함수
    //todo - yj: 테스트 시나리오 1) 서버 터미널에서 체크박스 해제/체크하는 경우
    //todo - yj: 테스트 시나리오 2) 할일을 추가해 달성률을 갱신하는 경우
    //todo - yj: 두 테스트 시나리오에서 실시간으로 서버 터미널에 진행률 출력되는 것까지 확인했습니다. 거북이 섹션과는 연관 X
    async refreshProgress() {
        try {
            const res = await fetch('/api/progress');
            const data = await res.json();
            if (window.updateProgress) {
                window.updateProgress(data.percent);
            }
        } catch (error) {
            console.error("Progress update failed:", error);
        }
    }

    // 3. 더보기 메뉴 토글
    toggleMenu(menuId) {
        document.querySelectorAll('.todo-menu').forEach(menu => {
            if (menu.id !== menuId) menu.style.display = 'none';
        });

        const targetMenu = document.getElementById(menuId);
        if (targetMenu) {
            const isHidden = targetMenu.style.display === 'none' || targetMenu.style.display === '';
            targetMenu.style.display = isHidden ? 'flex' : 'none';
        }
    }

    // 4. 외부 클릭 시 닫기
    setupOutsideClick() {
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.more-menu-wrapper')) {
                document.querySelectorAll('.todo-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }


    // 수정(sb) - setTimeout
    //todo - yj: 2월 3일 명세) 리스트 하단으로 자동 스크롤해주는 함수입니다.
    scrollToBottom() {
        console.log("동작함")
        const container = document.querySelector('.todo-list-container'); //sb
        if (container) {
            // 브라우저가 리스트를 다 그린 후 실행되도록 0ms 지연
            setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight, // 이제 새로 추가된 높이까지 포함됨!
                    behavior: 'smooth'
                });
            }, 0);
        }
    }
    // 수정전
    // scrollToBottom() {
    //     const container = document.querySelector('.todo-list-container');
    //     if (container) {
    //         container.scrollTo({
    //             top: container.scrollHeight,
    //             behavior: 'smooth'
    //         });
    //     }
    // }
}

// 클래스 인스턴스 생성
new ChecklistInteraction();