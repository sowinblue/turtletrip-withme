2월 3일 D(Layout & Theme) 담당 손예진 README.md

💡 팀워크를 위한 가이드
B/D 담당 협업: checklist.js에서 데이터가 변할 때마다 window.updateProgress(percent)를 호출해 주어야 B담당자가 만든 거북이 애니메이션이 작동합니다.

C 담당 데이터: app.py에서 /api/tasks/<id>/edit 경로를 만들고, tasks.json에서 해당 ID를 찾아 edit.html에 넘겨주는 라우트 작성이 필요합니다.

HTMX 도입: index.html 상단에 <script src="https://unpkg.com/htmx.org"></script>를 추가하는 것을 잊지 마세요!