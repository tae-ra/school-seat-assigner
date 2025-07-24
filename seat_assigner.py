import random

def assign_seats_all(names):
    random.shuffle(names)
    print("\n전체 랜덤 자리 배정 결과(좌석표):")
    display_seating_chart(names)

def assign_seat_one(names, assigned):
    remaining = [n for n in names if n not in assigned]
    if not remaining:
        print("모든 자리가 이미 배정되었습니다.")
        return
    name = random.choice(remaining)
    assigned.append(name)
    print(f"{len(assigned)}번 자리: {name}")
    # 한 명씩 배정 후 좌석표 출력
    display_seating_chart(assigned, fill_names=names)


def display_seating_chart(assigned, fill_names=None):
    # 좌석표 크기 입력값을 전역변수로 사용
    global ROWS, COLS
    n = ROWS * COLS
    chart = ["" for _ in range(n)]
    if fill_names is None:
        # 전체 랜덤 배정
        for i, name in enumerate(assigned):
            chart[i] = name
    else:
        # 한 명씩 배정
        for i, name in enumerate(assigned):
            chart[i] = name
        for i in range(len(assigned), n):
            chart[i] = "-"
    # 좌석표 출력
    for r in range(ROWS):
        row_str = ""
        for c in range(COLS):
            idx = r * COLS + c
            seat = chart[idx] if idx < len(chart) else "-"
            seat_num = idx + 1
            row_str += f"[{seat_num}:{seat:^6}] "
        print(row_str)
    print()

def main():
    global ROWS, COLS
    n = int(input("전체 인원 수를 입력하세요: "))
    names = []
    for i in range(n):
        name = input(f"{i+1}번 학생 이름: ")
        names.append(name)
    # 좌석표 크기 입력
    while True:
        try:
            ROWS = int(input("좌석표의 행(세로) 개수를 입력하세요: "))
            COLS = int(input("좌석표의 열(가로) 개수를 입력하세요: "))
            if ROWS * COLS < n:
                print("좌석 수가 학생 수보다 적습니다. 다시 입력하세요.")
                continue
            break
        except ValueError:
            print("숫자를 입력하세요.")
    assigned = []
    while True:
        print("\n1. 전체 랜덤 자리 배정")
        print("2. 한 명씩 자리 배정")
        print("3. 종료")
        choice = input("메뉴를 선택하세요: ")
        if choice == '1':
            assign_seats_all(names)
        elif choice == '2':
            assign_seat_one(names, assigned)
        elif choice == '3':
            print("프로그램을 종료합니다.")
            break
        else:
            print("잘못된 입력입니다.")

if __name__ == "__main__":
    main()
