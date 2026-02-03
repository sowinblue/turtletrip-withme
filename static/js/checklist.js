document.addEventListener('DOMContentLoaded', () => {
    // ... 기존 1번(HTMX), 2번(refreshProgress) 로직 유지 ...

    // 3. 더보기 메뉴 토글 함수 (전역 함수로 선언)
    window.toggleMenu = function(menuId) {
        // 모든 메뉴를 일단 닫기 (다른 메뉴가 열려있을 수 있으므로)
        document.querySelectorAll('.todo-menu').forEach(menu => {
            if (menu.id !== menuId) menu.style.display = 'none';
        });

        // 선택한 메뉴 토글
        const targetMenu = document.getElementById(menuId);
        if (targetMenu.style.display === 'none' || targetMenu.style.display === '') {
            targetMenu.style.display = 'block';
        } else {
            targetMenu.style.display = 'none';
        }
    };

    // 4. 메뉴 밖 클릭 시 닫기
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.more-menu-wrapper')) {
            document.querySelectorAll('.todo-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });

    // 2. 진행률 갱신 함수 (progress_calculator.py의 결과값을 받아오는 API 호출)
    async function refreshProgress() {
        const res = await fetch('/api/tasks/progress');
        const data = await res.json();
        // turtle.js에 정의된 함수를 호출하거나 직접 업데이트
        if (window.updateProgress) {
            window.updateProgress(data.percent);
        }
    }
});

// 더보기 메뉴 밖을 클릭하면 닫히게 하는 등의 보조 로직 추가 가능