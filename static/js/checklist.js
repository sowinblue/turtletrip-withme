class ChecklistInteraction {
    constructor() {
        this.init(); /*클래스가 생성되자마자 실행*/
    }

    init() {
        // DOM 로딩 상태 확인: 로딩 중이면 이벤트 대기, 완료됐으면 바로 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.setupOutsideClick();
            });
        } else { /*이미 html 다 읽은 상태라 즉시 실행*/
            this.setupEventListeners();
            this.setupOutsideClick();
        }
        // HTML에서 onclick="toggleMenu('menu-1')" 형태로 호출 가능하도록 전역 함수로 등록
        window.toggleMenu = (menuId) => this.toggleMenu(menuId);
    }

    setupEventListeners() {
        // HTMX 요청 완료 후 새 콘텐츠가 로드됐을 때 실행 (할 일 추가 후)
        document.body.addEventListener('htmx:afterOnLoad', (event) => {
            console.log("HTMX 응답 확인!", event.detail);
            this.scrollToBottom(); // 새 할 일이 추가되면 자동 스크롤
        });

        // HTMX 요청이 완료됐을 때 실행 (성공/실패 모두 포함)
        document.body.addEventListener('htmx:afterRequest', (event) => {
            console.log("HTMX 요청 완료!", event.detail);
            this.refreshProgress(); // 진행률 업데이트
        });
    }

    // 서버에서 현재 진행률(완료율) 가져와서 화면에 반영
    async refreshProgress() {
        try {
            const res = await fetch('/api/progress');
            const data = await res.json();
            // turtle.js의 updateProgress() 함수 호출 (거북이 애니메이션 업데이트)
            if (window.updateProgress) {
                window.updateProgress(data.percent);
            }
        } catch (error) {
            console.error("Progress update failed:", error);
        }
    }

    // 할 일 항목의 "더보기" 버튼 클릭 시 메뉴 열기/닫기
    toggleMenu(menuId) {
        // 다른 열려있는 메뉴들은 모두 닫기
        document.querySelectorAll('.todo-menu').forEach(menu => {
            if (menu.id !== menuId) menu.style.display = 'none';
        });
        // 클릭한 메뉴는 토글 (열기/닫기)
        const targetMenu = document.getElementById(menuId);
        if (targetMenu) {
            const isHidden = targetMenu.style.display === 'none' || targetMenu.style.display === '';
            targetMenu.style.display = isHidden ? 'flex' : 'none';
        }
    }

    // 메뉴 영역 바깥을 클릭하면 열린 메뉴 자동으로 닫기
    setupOutsideClick() {
        document.addEventListener('click', (event) => {
            // 클릭한 곳이 메뉴 영역이 아니면 모든 메뉴 닫기
            if (!event.target.closest('.more-menu-wrapper')) {
                document.querySelectorAll('.todo-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
            }
        });
    }

    // 할 일 목록 컨테이너를 맨 아래로 스크롤 (새 할 일 추가 시)
    scrollToBottom() {
        console.log("scrollToBottom 호출됨");
        const container = document.querySelector('.todo-list-container');
        if (container) {
            console.log("컨테이너 발견, 스크롤 높이:", container.scrollHeight);
            // 100ms 대기 후 스크롤 (DOM이 완전히 업데이트될 시간 확보)
            setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight, // 컨테이너의 전체 높이만큼 스크롤
                    behavior: 'smooth' // 부드러운 애니메이션
                });
            }, 100);
        } else {
            console.log("컨테이너를 찾을 수 없음");
        }
    }
}

// 클래스 인스턴스 생성 및 초기화 실행
new ChecklistInteraction();