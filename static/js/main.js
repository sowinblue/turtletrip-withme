/**
 * 🐢 거북이 할 일 관리 - 메인 로직
 * 역할:
 * - 체크박스 변경 감지
 * - 서버에 상태 저장
 * - 진행률 가져오기
 * - 거북이 업데이트
 */

// 전역 변수로 이전 진행률 저장
let previousRate = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 초기값 세팅
    const initialRateElem = document.querySelector('.progress-text');
    if (initialRateElem) {
        previousRate = parseInt(initialRateElem.textContent) || 0;
    }
    console.log("✅ main.js 로드 완료");

    // 모든 체크박스 선택
    const checkboxes = document.querySelectorAll('.real-checkbox');

    checkboxes.forEach(checkbox => {
        const todoItem = checkbox.closest('.todo-item');

        // 초기 상태 반영
        if (checkbox.checked) {
            todoItem.classList.add('completed');
        }

        // 체크박스 변경 이벤트
        checkbox.addEventListener('change', async (event) => {
            // 기본 동작 차단 (혹시 모를 form submit 방지)
            event.preventDefault();

            const taskId = checkbox.getAttribute('data-id');
            const isChecked = checkbox.checked;

            console.log(`📝 체크박스 변경: Task ID ${taskId}, 상태: ${isChecked}`);

            // 즉각적인 UI 반영
            todoItem.classList.toggle('completed', isChecked);

            try {
                // Step 1: 서버에 상태 저장
                const toggleResponse = await fetch(`/toggle_todo/${taskId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!toggleResponse.ok) {
                    throw new Error('상태 변경 실패');
                }

                const result = await toggleResponse.json();
                const rate = result.new_rate;

                console.log(`📊 최신 진행률 수신: ${rate}%`);

                // Step 2: 진행률 UI 업데이트
                updateProgressUI(rate);

                // Step 3: 배경 동적 업데이트
                const brightness = 0.2 + (rate / 100) * 0.8;
                const hue = (100 - rate) * 2;
                const speed = 60.0 - (rate / 100) * 30.0;

                if (typeof window.updateEnv === 'function') {
                    window.updateEnv(rate, brightness, hue, speed);
                    console.log(`🌌 배경 업데이트: B:${brightness.toFixed(2)} H:${hue} S:${speed.toFixed(1)}`);
                } else {
                    console.warn("⚠️ window.updateEnv 함수를 찾을 수 없습니다.");
                }

                // Step 4: 거북이 업데이트 및 이벤트 트리거 전송
                if (typeof window.updateTurtle === 'function') {
                    // 이벤트 발생 조건 정의 (나중에 서버 데이터와 연동 가능)
                    const isEventTriggered =
                        ((previousRate < 50) && (rate >= 50)) ||
                        ((previousRate < 100) && (rate >= 100));

                    window.updateTurtle(rate, isEventTriggered);
                    console.log(`🐢 거북이 업데이트 완료 ( 이벤트 여부: ${isEventTriggered})`);
                } else {
                    console.warn("⚠️ window.updateTurtle 함수를 찾을 수 없습니다.");
                }

                // [필수 추가] 다음 비교를 위해 현재 값을 previousRate에 저장
                previousRate = rate;

            } catch (error) {
                console.error("❌ 오류 발생:", error);

                // 실패 시 UI 복구
                checkbox.checked = !isChecked;
                todoItem.classList.toggle('completed', !isChecked);
            }
        });
    });
});


/**
 * 진행률 UI 업데이트 함수 (수정본)
 */
function updateProgressUI(rate) {
    const progressBar = document.querySelector('#turtle-progress-bar');
    if (progressBar) {
        // 1. 바의 너비 변경
        progressBar.style.width = `${rate}%`;
        // 2. [수정] 바 '내부'에 있는 텍스트만 찾아서 변경
        const barText = progressBar.querySelector('.progress-text');
        if (barText) barText.textContent = `${rate}%`;
    }

    // 3. [추가] 말풍선(bubble) 안에 있는 텍스트도 별도로 찾아서 변경
    const bubbleText = document.querySelector('.progress-bubble .progress-text');
    if (bubbleText) bubbleText.textContent = `${rate}%`;

    console.log(`📈 진행률 UI 업데이트: ${rate}%`);
}