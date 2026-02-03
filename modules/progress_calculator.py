# modules/progress_calculator.py

# 진행률 계산 및 거북이 위치 로직 전담 클래스
class ProgressCalculator:

    def calculate_completion_rate(self, tasks):
        """
        할 일 목록을 기반으로 달성률을 계산합니다.

        Args:
            tasks (list): 할 일 딕셔너리 리스트
                        예) [{'id': '1', 'content': '공부', 'is_done': True}, ...]

        Returns:
            int: 달성률 (0 ~ 100)
        """
        # 할 일이 없으면 달성률은 0%
        if not tasks:
            return 0

        # 완료된 항목 개수 계산
        completed_count = sum(1 for task in tasks if task.get('is_done'))

        # 퍼센트 계산 후 정수 반환
        return int((completed_count / len(tasks)) * 100)

    def get_turtle_position(self, completion_rate):
        """
        달성률을 기반으로 거북이의 x좌표(left %)를 계산합니다.

        Args:
            completion_rate (int): 현재 달성률 (0 ~ 100)

        Returns:
            int: CSS left 속성에 사용할 퍼센트 값
        """
        # 현재는 달성률과 동일하게 이동
        # 추후 최대 이동 제한, 곡선 이동 로직 등이 추가될 수 있음
        return completion_rate