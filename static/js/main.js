/**
 * 🐢 거북이 할 일 관리 - 메인 로직
 * 이 파일의 역할:
 * - 체크박스 UI와 서버 상태를 동기화한다
 * - "사용자 클릭 → 서버 반영 → 진행률 계산 → UI 업데이트" 흐름을 강제로 고정한다
 * - 불필요한 새로고침과 화면 깜빡임을 완전히 차단한다
 */

document.addEventListener('DOMContentLoaded', () => {
    // HTML 문서가 모두 로드된 이후에만 JS를 실행하기 위함
    // (DOM 요소를 찾지 못하는 오류 방지)

    // 🔹 모든 할 일 체크박스를 한 번에 선택
    // 이벤트를 개별적으로 분산하지 않고, 통제된 구조로 관리하기 위함
    const checkboxes = document.querySelectorAll('.real-checkbox');
    
    // 각 체크박스마다 동일한 로직 적용
    checkboxes.forEach(checkbox => {

        // 체크박스가 속한 할 일 컨테이너(.todo-item)를 찾는다
        // → 이 체크박스가 "어떤 할 일"인지 알기 위해 필요
        const todoItem = checkbox.closest('.todo-item');
        
        // 🔹 [초기 상태 반영]
        // 서버에서 이미 완료된 할 일은 새로고침 시에도
        // 완료된 스타일(completed 클래스)을 유지해야 한다
        if (checkbox.checked) {
            todoItem.classList.add('completed');
        }

        // 🔹 체크박스 상태가 변경될 때 실행되는 핵심 로직
        checkbox.addEventListener('change', (event) => {

            // 기본 동작 차단
            // - form submit
            // - 페이지 새로고침
            // → SPA 스타일의 UX 유지 목적
            event.preventDefault();
            
            // 실제 비즈니스 로직은 별도 함수로 분리
            // (가독성 + 테스트 + 유지보수성 향상)
            handleTodoToggle(checkbox, todoItem);
        });
    });

    // 🔹 혹시 HTML 구조상 <form>이 존재할 경우를 대비
    // form 제출 자체를 막아 새로고침을 원천 차단
    const todoForm = document.querySelector('#todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', (e) => e.preventDefault());
    }
});


/**
 * 🔹 체크박스 토글 시 고정된 실행 흐름을 담당하는 함수
 * 왜 분리했는가?
 * - 실행 순서를 절대 꼬이게 하지 않기 위해
 * - "UI → 서버 → 계산 → UI" 흐름을 명시적으로 강제하기 위해
 */
function handleTodoToggle(checkbox, todoItem) {

    // 현재 체크 상태(true = 완료, false = 미완료)
    const isCompleted = checkbox.checked;

    // data-id 속성에 저장된 할 일 고유 ID
    // 서버에서 어떤 할 일인지 식별하는 용도
    const todoId = todoItem.dataset.id;

    // [Step 0] 즉각적인 UI 반영
    // 서버 응답을 기다리지 않고 바로 시각적 반응 제공
    // → 사용자 체감 속도 향상
    todoItem.classList.toggle('completed', isCompleted);

    // [Step 1] 서버에 체크 상태 변경 요청
    fetch(`/toggle_todo/${todoId}`, {
        method: 'POST', // 상태 변경이므로 POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: isCompleted }) // 변경된 상태 전달
    })
    .then(response => {
        // 서버 통신 실패 시 이후 흐름 중단
        if (!response.ok) throw new Error('상태 변경 실패');

        // [Step 2] 상태 변경 이후의 "새로운 진행률" 요청
        // 진행률은 서버가 계산하는 단일 진실(Source of Truth)
        return fetch('/api/progress');
    })
    .then(res => res.json())
    .then(data => {

        // 서버에서 계산된 최신 달성률
        const rate = data.rate;
        
        // [Step 3] 진행률 UI 업데이트 (바, 텍스트 등)
        updateProgressUI(rate);
        
        // [Step 4] 거북이 이동
        // 전역 함수가 있을 경우에만 호출 (의존성 안전 처리)
        if (typeof window.updateTurtle === 'function') {
            window.updateTurtle(rate);
        }
    })
    .catch(error => {
        // 네트워크 오류, 서버 오류 등 예외 상황 처리
        console.error('흐름 처리 중 오류 발생:', error);

        // 🔹 실패 시 UI 상태 복구
        // optimistic UI 패턴에 대한 책임 처리
        checkbox.checked = !isCompleted;
        todoItem.classList.toggle('completed', !isCompleted);
    });
}


/**
 * 🔹 진행률 UI 업데이트 전담 함수
 * 역할 분리 이유:
 * - 진행률 계산 ❌
 * - 화면 반영 ⭕
 */
function updateProgressUI(rate) {

    // 진행률 바 width 변경
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        progressBar.style.width = `${rate}%`;
    }

    // 퍼센트 텍스트 변
    const progressText = document.querySelector('.progress-percentage');
    if (progressText) {
        progressText.innerText = `${rate}%`;
    }

    // 거북이 캐릭터 요소
    const turtle = document.querySelector('.turtle-character');
    // 거북이 위치 이동 (CSS left 기반)
    if (turtle) {
        turtle.style.left = `${rate}%`;
    }
}
