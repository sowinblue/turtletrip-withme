document.addEventListener('DOMContentLoaded', () => {
    // 1. HTMX 이벤트 리스너: 서버 작업이 성공하면 진행률 갱신
    document.body.addEventListener('htmx:afterOnLoad', (event) => {
        // 수정, 삭제, 체크박스 변경 후 진행률을 다시 계산해야 함
        if (event.detail.target.id.includes('task-') || event.detail.xhr.status === 200) {
            refreshProgress();
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