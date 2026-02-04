/*거북이 css_sb 22*/
.turtle_container {
    position: absolute;
    bottom: 0;
    transition: left 0.5s ease;
    /* 부드러운 이동 */
}



/* sb 수정 24_ 상단 : 거북이 영역 35%비중 */
.turtle-section {
    flex: 0.35;
    background: transparent;
    /* 기존 그라데이션 삭제 또는 투명하게 변경 */
    padding: 20px;
    color: rgb(28, 14, 14);
    position: relative;
    /*나중에 거북이 위치 잡을 때 기준점!*/
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}




/*거북이가 돌아다닐 영역_sb 22*/
.turtle_moveline-section {
    height: 250px;
    /* 배경이 보일 시원한 높이 */
    width: 100%;
    position: relative;
    margin-top: 20px;
    overflow: hidden;
    
}



<html>
        <section class="turtle-section">
            <h2>거북이의 여행 🐢</h2>

            <div class="turtle_moveline-section">
                <iframe src="{{ url_for('background') }}" 
                    style="width: 100%; height: 100%; border: none; position: absolute; top: 0; left: 0; z-index: -1;"></iframe>

                <div class="turtle_container" style="left: {{ rate }}%;">
                    <img id="turtle_img" class="turtle"
                        src="{{ url_for('static', filename='images/turtle/turtle_idle.svg') }}" width="90">
                </div>
            </div>

