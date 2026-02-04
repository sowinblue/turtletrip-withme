document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.real-checkbox').forEach(checkbox => {
        const todoItem = checkbox.closest('.todo-item');

        // 🔹 초기 상태 반영 (중요)
        if (checkbox.checked) {
            todoItem.classList.add('completed');
        }

        // 🔹 체크 변경 시 토글
        checkbox.addEventListener('change', () => {
            todoItem.classList.toggle('completed', checkbox.checked);
        });
    });
});