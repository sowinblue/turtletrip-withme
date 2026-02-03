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
        // 1. HTMX 이벤트 리스너 (서버 작업 후 갱신)
        document.body.addEventListener('htmx:afterOnLoad', (event) => {
            if (event.detail.target.id.includes('task-') || event.detail.xhr.status === 200) {
                this.refreshProgress();
            }
            
            // 명세: 할 일 추가 후 자동 스크롤
            if (event.detail.requestConfig.verb === 'post' && event.detail.target.classList.contains('todo-list-container')) {
                this.scrollToBottom();
            }
        });
    }

    // 2. 진행률 갱신 함수
    async refreshProgress() {
        try {
            const res = await fetch('/api/tasks/progress');
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

    // 명세: 리스트 하단으로 자동 스크롤
    scrollToBottom() {
        const container = document.querySelector('.todo-list-container');
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
}

// 클래스 인스턴스 생성
new ChecklistInteraction();