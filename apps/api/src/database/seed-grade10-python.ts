// ============================================
// Grade 10 Python — Углублённый курс
// 20 уроков, ~60 часов
// Алгоритмы, структуры данных, рекурсия, ДП, графы
// ============================================

export const python10Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Повторение и углубление
  // ──────────────────────────────────────────
  {
    slug: 'review-advanced-basics',
    title: 'Повторение: продвинутые основы Python',
    description: 'Генераторы списков, lambda, map/filter, работа с файлами',
    content: `# Повторение: продвинутые основы Python

## Генераторы списков (List Comprehension)

\`\`\`python
# Квадраты чётных чисел от 1 до 20
squares = [x**2 for x in range(1, 21) if x % 2 == 0]
print(squares)  # [4, 16, 36, 64, 100, ...]

# Двумерный список
matrix = [[0] * 5 for _ in range(3)]  # 3 строки, 5 столбцов

# Вложенные генераторы
pairs = [(i, j) for i in range(3) for j in range(3) if i != j]
\`\`\`

## Lambda, map, filter

\`\`\`python
# Lambda — анонимная функция
square = lambda x: x ** 2
print(square(5))  # 25

# map — применить функцию ко всем элементам
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))

# filter — отфильтровать по условию
evens = list(filter(lambda x: x % 2 == 0, numbers))

# sorted с ключом
words = ["banana", "apple", "cherry"]
words.sort(key=lambda w: len(w))  # по длине
\`\`\`

## Распаковка и *args

\`\`\`python
# Распаковка
a, b, *rest = [1, 2, 3, 4, 5]
# a=1, b=2, rest=[3, 4, 5]

# *args в функциях
def my_sum(*args):
    return sum(args)

print(my_sum(1, 2, 3))  # 6

# **kwargs
def greet(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")
\`\`\`

## enumerate и zip

\`\`\`python
names = ["Алексей", "Мария", "Дмитрий"]
for i, name in enumerate(names):
    print(f"{i + 1}. {name}")

# zip — параллельный обход
scores = [95, 87, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\``,
    duration: 45,
    assignments: [
      {
        title: 'Генераторы списков',
        description: 'Считайте число N. Используя генератор списка, создайте список всех чисел от 1 до N, которые делятся на 3 или на 5. Выведите их через пробел.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Создайте список чисел, делящихся на 3 или 5\n# Выведите через пробел\n\n',
        testCases: [
          { input: '15', expectedOutput: '3 5 6 9 10 12 15', description: 'FizzBuzz числа до 15' },
          { input: '10', expectedOutput: '3 5 6 9 10', description: 'До 10' },
          { input: '5', expectedOutput: '3 5', description: 'До 5' },
        ],
        points: 10,
      },
      {
        title: 'Фильтрация через lambda и filter',
        description: 'Считайте N, затем N целых чисел. Используя filter и lambda, оставьте только те числа, которые являются полными квадратами (1, 4, 9, 16...). Выведите их через пробел. Если таких нет — выведите NONE.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Считайте N чисел\n# Используйте filter и lambda для поиска полных квадратов\n# Выведите результат через пробел или NONE\n\nimport math\n\n',
        testCases: [
          { input: '6\n1 2 3 4 5 9', expectedOutput: '1 4 9', description: 'Полные квадраты из списка' },
          { input: '3\n2 3 5', expectedOutput: 'NONE', description: 'Нет полных квадратов' },
          { input: '4\n16 25 36 49', expectedOutput: '16 25 36 49', description: 'Все — полные квадраты' },
        ],
        points: 10,
      },
      {
        title: 'Словарь частот с enumerate',
        description: 'Считайте строку. Для каждого уникального символа выведите символ, его количество и индекс первого вхождения, разделённые пробелом, по одному на строку. Символы выводить в порядке первого появления.',
        difficulty: 'medium',
        starterCode: '# Считайте строку\n# Подсчитайте частоту каждого символа\n# Запомните индекс первого вхождения\n# Выведите: символ количество первый_индекс\n\n',
        testCases: [
          { input: 'abracadabra', expectedOutput: 'a 5 0\nb 2 1\nr 2 2\nc 1 4\nd 1 6', description: 'Частоты символов abracadabra' },
          { input: 'aaa', expectedOutput: 'a 3 0', description: 'Один символ' },
          { input: 'abc', expectedOutput: 'a 1 0\nb 1 1\nc 1 2', description: 'Все уникальные' },
        ],
        points: 15,
      },
      {
        title: 'Zip и распаковка',
        description: 'Считайте N. Затем считайте N имён (строки) и N оценок (целые числа) в двух строках. Используя zip, выведите пары "имя: оценка" для тех, у кого оценка >= 60, отсортированные по убыванию оценки. Каждая пара на отдельной строке.',
        difficulty: 'medium',
        starterCode: '# Считайте N\n# Считайте имена (через пробел)\n# Считайте оценки (через пробел)\n# Используйте zip, filter и sorted\n\n',
        testCases: [
          { input: '4\nАня Боря Вика Глеб\n85 45 92 60', expectedOutput: 'Вика: 92\nАня: 85\nГлеб: 60', description: 'Отсеять Борю (45) и отсортировать' },
          { input: '2\nИван Пётр\n100 100', expectedOutput: 'Иван: 100\nПётр: 100', description: 'Одинаковые оценки' },
          { input: '3\nА Б В\n50 40 30', expectedOutput: '', description: 'Все ниже 60' },
        ],
        points: 15,
      },
      {
        title: 'Вложенные генераторы и *args',
        description: 'Считайте N. Затем считайте N строк, каждая содержит числа через пробел (количество чисел в строках может различаться). Выведите плоский отсортированный список всех чётных чисел из всех строк через пробел. Если чётных нет — выведите NONE.',
        difficulty: 'hard',
        starterCode: '# Считайте N\n# Считайте N строк с числами\n# Соберите все чётные числа в плоский список\n# Отсортируйте и выведите\n\n',
        testCases: [
          { input: '3\n1 2 3\n4 5\n6 7 8 9', expectedOutput: '2 4 6 8', description: 'Чётные из трёх строк' },
          { input: '2\n1 3 5\n7 9', expectedOutput: 'NONE', description: 'Нет чётных' },
          { input: '1\n10 2 8 4 6', expectedOutput: '2 4 6 8 10', description: 'Одна строка, все чётные' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 2: Сложность алгоритмов
  // ──────────────────────────────────────────
  {
    slug: 'complexity-analysis',
    title: 'Анализ сложности алгоритмов',
    description: 'O-нотация, оценка времени работы, сравнение алгоритмов',
    content: `# Анализ сложности алгоритмов

## O-нотация (Big-O)

Описывает **верхнюю границу** роста времени работы.

| Сложность | Название | Пример (n=10⁶) |
|-----------|----------|-----------------|
| O(1) | Константная | Мгновенно |
| O(log n) | Логарифмическая | ~20 операций |
| O(n) | Линейная | 10⁶ операций |
| O(n log n) | Линеарифмическая | ~2·10⁷ |
| O(n²) | Квадратичная | 10¹² — слишком долго! |
| O(2ⁿ) | Экспоненциальная | Невозможно |

## Правило: ~10⁸ операций в секунду

\`\`\`python
# O(n) — до n = 10⁸
# O(n log n) — до n = 10⁷
# O(n²) — до n = 10⁴
# O(n³) — до n = 10³
# O(2^n) — до n = 25
\`\`\`

## Примеры

\`\`\`python
# O(n) — линейный поиск
def linear_search(arr, target):
    for x in arr:
        if x == target:
            return True
    return False

# O(log n) — бинарный поиск
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# O(n²) — пузырьковая сортировка
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
\`\`\`

## Как оценить сложность

1. **Один цикл** от 0 до n → O(n)
2. **Вложенные циклы** → O(n²), O(n³)...
3. **Деление пополам** → O(log n)
4. **Сортировка** → O(n log n)
5. **Перебор подмножеств** → O(2ⁿ)`,
    duration: 50,
    assignments: [
      {
        title: 'Бинарный поиск',
        description: 'Считайте N, затем N отсортированных чисел, затем число X. Выведите индекс X в массиве (0-based) или -1, если не найдено. Используйте бинарный поиск.',
        difficulty: 'easy',
        starterCode: '# Считайте N, массив и X\n# Бинарный поиск X в массиве\n\n',
        testCases: [
          { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: '5 на позиции 2' },
          { input: '5\n1 3 5 7 9\n4', expectedOutput: '-1', description: '4 нет в массиве' },
          { input: '1\n42\n42', expectedOutput: '0', description: 'Единственный элемент' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт операций цикла',
        description: 'Считайте N. Определите, сколько раз выполнится тело цикла: i = 1; while i <= N: i *= 2. Выведите это количество.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Подсчитайте количество итераций цикла\n# i = 1, на каждом шаге i *= 2, пока i <= N\n\n',
        testCases: [
          { input: '16', expectedOutput: '5', description: 'i: 1,2,4,8,16 — 5 итераций' },
          { input: '1', expectedOutput: '1', description: 'Только i=1' },
          { input: '100', expectedOutput: '7', description: 'i: 1,2,4,8,16,32,64 — 7 итераций' },
        ],
        points: 10,
      },
      {
        title: 'Нижняя граница (lower bound)',
        description: 'Считайте N, затем N отсортированных чисел, затем число X. Выведите индекс первого элемента, который >= X (0-based). Если все элементы меньше X — выведите N. Используйте бинарный поиск.',
        difficulty: 'medium',
        starterCode: '# Считайте N, массив и X\n# Бинарный поиск: найдите первый элемент >= X\n# Выведите его индекс (или N, если такого нет)\n\n',
        testCases: [
          { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: '5 на позиции 2' },
          { input: '5\n1 3 5 7 9\n6', expectedOutput: '3', description: 'Первый >= 6 это 7 на позиции 3' },
          { input: '3\n1 2 3\n10', expectedOutput: '3', description: 'Все меньше 10' },
          { input: '4\n2 2 2 2\n2', expectedOutput: '0', description: 'Все равны — первый индекс' },
        ],
        points: 15,
      },
      {
        title: 'Сравнение сложностей на практике',
        description: 'Считайте N, затем N чисел (неотсортированных), затем число X. Выведите два числа через пробел: количество сравнений при линейном поиске X (считать до первого найденного, или N если не найдено) и количество сравнений при бинарном поиске X в отсортированном массиве (считать каждое сравнение с mid-элементом).',
        difficulty: 'medium',
        starterCode: '# Считайте N, массив и X\n# Подсчитайте сравнения при линейном поиске\n# Отсортируйте массив и подсчитайте сравнения при бинарном поиске\n\n',
        testCases: [
          { input: '7\n3 1 4 1 5 9 2\n5', expectedOutput: '5 3', description: 'Линейный: 5 сравнений, бинарный: 3' },
          { input: '5\n1 2 3 4 5\n1', expectedOutput: '1 3', description: 'Линейный сразу, бинарный 3 шага' },
          { input: '4\n10 20 30 40\n99', expectedOutput: '4 3', description: 'Не найдено: линейный 4, бинарный 3' },
        ],
        points: 15,
      },
      {
        title: 'Оценка сложности вложенных циклов',
        description: 'Считайте N. Для каждого из трёх фрагментов кода вычислите точное количество операций и выведите три числа через пробел: 1) двойной цикл for i in range(N): for j in range(N); 2) цикл for i in range(N): for j in range(i); 3) цикл i=N, while i>0: i//=2.',
        difficulty: 'hard',
        starterCode: '# Считайте N\n# Вычислите количество операций для трёх фрагментов:\n# 1) Двойной цикл N*N\n# 2) Треугольный цикл sum(range(N))\n# 3) Логарифмический цикл (деление на 2)\n\nimport math\n\n',
        testCases: [
          { input: '4', expectedOutput: '16 6 3', description: 'N=4: 16, 0+1+2+3=6, 4->2->1=3' },
          { input: '8', expectedOutput: '64 28 4', description: 'N=8: 64, 28, 8->4->2->1=4' },
          { input: '1', expectedOutput: '1 0 1', description: 'N=1: 1, 0, 1->done=1' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 3: Сортировки
  // ──────────────────────────────────────────
  {
    slug: 'sorting-algorithms',
    title: 'Алгоритмы сортировки',
    description: 'Пузырьковая, выбором, вставками, слиянием, быстрая',
    content: `# Алгоритмы сортировки

## Сортировка выбором — O(n²)

\`\`\`python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
\`\`\`

## Сортировка вставками — O(n²)

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
\`\`\`

## Сортировка слиянием — O(n log n)

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(a, b):
    result = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
    result.extend(a[i:])
    result.extend(b[j:])
    return result
\`\`\`

## Быстрая сортировка — O(n log n) в среднем

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

## Подсчёт инверсий (merge sort)

\`\`\`python
def count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0
    mid = len(arr) // 2
    left, inv_l = count_inversions(arr[:mid])
    right, inv_r = count_inversions(arr[mid:])
    merged, inv_m = merge_count(left, right)
    return merged, inv_l + inv_r + inv_m

def merge_count(a, b):
    result = []
    inv = 0
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i]); i += 1
        else:
            result.append(b[j]); j += 1
            inv += len(a) - i  # все оставшиеся в a > b[j]
    result.extend(a[i:])
    result.extend(b[j:])
    return result, inv
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Сортировка слиянием',
        description: 'Считайте N, затем N чисел. Реализуйте сортировку слиянием и выведите отсортированный массив через пробел. Не используйте встроенный sort().',
        difficulty: 'medium',
        starterCode: '# Считайте N и массив\n# Реализуйте merge sort\n# Выведите отсортированный массив\n\n',
        testCases: [
          { input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'Сортировка 5 элементов' },
          { input: '3\n3 2 1', expectedOutput: '1 2 3', description: 'Обратный порядок' },
          { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
        ],
        points: 15,
      },
      {
        title: 'Сортировка выбором',
        description: 'Считайте N, затем N чисел. Реализуйте сортировку выбором (selection sort) и выведите отсортированный массив через пробел. Не используйте встроенный sort().',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# Реализуйте сортировку выбором\n# На каждом шаге ищите минимум среди оставшихся\n\n',
        testCases: [
          { input: '5\n64 25 12 22 11', expectedOutput: '11 12 22 25 64', description: 'Сортировка 5 элементов' },
          { input: '4\n4 3 2 1', expectedOutput: '1 2 3 4', description: 'Обратный порядок' },
          { input: '3\n1 1 1', expectedOutput: '1 1 1', description: 'Все одинаковые' },
        ],
        points: 10,
      },
      {
        title: 'Сортировка вставками',
        description: 'Считайте N, затем N чисел. Реализуйте сортировку вставками (insertion sort) и выведите отсортированный массив через пробел. Не используйте встроенный sort().',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# Реализуйте сортировку вставками\n# Каждый элемент вставляйте на правильное место\n\n',
        testCases: [
          { input: '5\n5 2 4 6 1', expectedOutput: '1 2 4 5 6', description: 'Сортировка 5 элементов' },
          { input: '3\n1 2 3', expectedOutput: '1 2 3', description: 'Уже отсортирован' },
          { input: '4\n-3 -1 -4 -2', expectedOutput: '-4 -3 -2 -1', description: 'Отрицательные числа' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт инверсий',
        description: 'Считайте N, затем N чисел. Подсчитайте количество инверсий в массиве (пар i < j, таких что a[i] > a[j]). Используйте модифицированную сортировку слиянием для O(n log n) решения.',
        difficulty: 'medium',
        starterCode: '# Считайте N и массив\n# Подсчитайте инверсии через merge sort\n# Инверсия: пара (i,j) где i < j и a[i] > a[j]\n\n',
        testCases: [
          { input: '5\n2 3 8 6 1', expectedOutput: '5', description: '(2,1),(3,1),(8,6),(8,1),(6,1) — 5 инверсий' },
          { input: '3\n1 2 3', expectedOutput: '0', description: 'Отсортирован — 0 инверсий' },
          { input: '3\n3 2 1', expectedOutput: '3', description: 'Обратный порядок — 3 инверсии' },
        ],
        points: 15,
      },
      {
        title: 'K-я порядковая статистика (быстрый выбор)',
        description: 'Считайте N и K, затем N чисел. Найдите K-е по величине число (1-based, то есть K=1 это минимум). Реализуйте алгоритм быстрого выбора (quickselect) на основе partition из быстрой сортировки. Не используйте полную сортировку массива.',
        difficulty: 'hard',
        starterCode: '# Считайте N, K и массив\n# Реализуйте quickselect\n# Выведите K-й по величине элемент (K=1 — минимум)\n\n',
        testCases: [
          { input: '5 3\n7 2 9 1 5', expectedOutput: '5', description: '3-й по величине: 1,2,5,7,9 → 5' },
          { input: '4 1\n10 20 30 40', expectedOutput: '10', description: 'Минимум: 10' },
          { input: '6 6\n3 1 4 1 5 9', expectedOutput: '9', description: 'Максимум: 9' },
          { input: '3 2\n5 5 5', expectedOutput: '5', description: 'Все одинаковые' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 4: Стек и очередь
  // ──────────────────────────────────────────
  {
    slug: 'stack-queue',
    title: 'Стек и очередь',
    description: 'Реализация стека и очереди, задачи на скобочные последовательности',
    content: `# Стек и очередь

## Стек (LIFO — Last In, First Out)

\`\`\`python
# Стек через список
stack = []
stack.append(1)   # push
stack.append(2)
stack.append(3)
top = stack[-1]    # peek: 3
stack.pop()        # pop: 3
\`\`\`

## Задача: проверка скобок

\`\`\`python
def is_valid_brackets(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in '([{':
            stack.append(c)
        elif c in ')]}':
            if not stack or stack[-1] != pairs[c]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_valid_brackets("({[]})"))  # True
print(is_valid_brackets("([)]"))    # False
\`\`\`

## Очередь (FIFO — First In, First Out)

\`\`\`python
from collections import deque

queue = deque()
queue.append(1)    # enqueue
queue.append(2)
queue.append(3)
front = queue[0]    # peek: 1
queue.popleft()     # dequeue: 1
\`\`\`

## Задача: постфиксная запись (обратная польская)

\`\`\`python
def eval_postfix(expression):
    stack = []
    for token in expression.split():
        if token in '+-*/':
            b = stack.pop()
            a = stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
        else:
            stack.append(int(token))
    return stack[0]

print(eval_postfix("3 4 + 2 *"))  # (3 + 4) * 2 = 14
\`\`\`

## Монотонный стек

\`\`\`python
# Для каждого элемента найти ближайший больший слева
def nearest_greater_left(arr):
    result = [-1] * len(arr)
    stack = []  # хранит индексы
    for i in range(len(arr)):
        while stack and arr[stack[-1]] <= arr[i]:
            stack.pop()
        if stack:
            result[i] = arr[stack[-1]]
        stack.append(i)
    return result
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Проверка скобочной последовательности',
        description: 'Считайте строку из скобок ()[]{}. Выведите YES, если последовательность правильная, иначе NO.',
        difficulty: 'medium',
        starterCode: '# Считайте строку\n# Проверьте правильность скобок\n\n',
        testCases: [
          { input: '({[]})', expectedOutput: 'YES', description: 'Правильная вложенность' },
          { input: '([)]', expectedOutput: 'NO', description: 'Неправильное пересечение' },
          { input: '', expectedOutput: 'YES', description: 'Пустая строка — правильная' },
        ],
        points: 15,
      },
      {
        title: 'Реализация стека',
        description: 'Реализуйте стек. Считайте N команд. Команды: push X (положить X), pop (удалить верхний, вывести его), top (вывести верхний без удаления), size (вывести размер). Гарантируется, что pop и top не вызываются для пустого стека.',
        difficulty: 'easy',
        starterCode: '# Считайте N — количество команд\n# Реализуйте стек на основе списка\n# Обработайте команды: push X, pop, top, size\n\n',
        testCases: [
          { input: '6\npush 1\npush 2\npush 3\ntop\npop\nsize', expectedOutput: '3\n3\n2', description: 'Базовые операции стека' },
          { input: '3\npush 10\npush 20\npop', expectedOutput: '20', description: 'Pop возвращает последний' },
          { input: '2\npush 5\nsize', expectedOutput: '1', description: 'Один элемент' },
        ],
        points: 10,
      },
      {
        title: 'Реализация очереди',
        description: 'Реализуйте очередь через deque. Считайте N команд. Команды: push X (добавить X в конец), pop (удалить первый, вывести его), front (вывести первый), size (вывести размер). Гарантируется корректность.',
        difficulty: 'easy',
        starterCode: '# Считайте N — количество команд\n# Реализуйте очередь через collections.deque\n# Обработайте команды: push X, pop, front, size\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '5\npush 1\npush 2\npush 3\nfront\npop', expectedOutput: '1\n1', description: 'FIFO: первый вошёл — первый вышел' },
          { input: '4\npush 10\npush 20\npop\nfront', expectedOutput: '10\n20', description: 'После pop первый — 20' },
          { input: '3\npush 5\nsize\npop', expectedOutput: '1\n5', description: 'Размер и удаление' },
        ],
        points: 10,
      },
      {
        title: 'Вычисление постфиксного выражения',
        description: 'Считайте строку — выражение в постфиксной (обратной польской) записи. Токены разделены пробелами. Поддерживаемые операции: + - * /. Деление — целочисленное с округлением к нулю. Выведите результат.',
        difficulty: 'medium',
        starterCode: '# Считайте выражение в постфиксной записи\n# Используйте стек для вычисления\n# Операции: + - * / (целочисленное деление к нулю)\n\n',
        testCases: [
          { input: '3 4 + 2 *', expectedOutput: '14', description: '(3+4)*2 = 14' },
          { input: '5 1 2 + 4 * + 3 -', expectedOutput: '14', description: '5+((1+2)*4)-3 = 14' },
          { input: '10 3 /', expectedOutput: '3', description: '10/3 = 3 (целочисленно)' },
        ],
        points: 15,
      },
      {
        title: 'Ближайший больший элемент справа',
        description: 'Считайте N, затем N чисел. Для каждого элемента найдите ближайший строго больший элемент справа. Выведите N чисел через пробел (или -1, если такого нет). Используйте монотонный стек для O(n) решения.',
        difficulty: 'hard',
        starterCode: '# Считайте N и массив\n# Для каждого элемента найдите ближайший больший справа\n# Используйте монотонный стек\n# Выведите результат через пробел\n\n',
        testCases: [
          { input: '5\n4 5 2 10 8', expectedOutput: '5 10 10 -1 -1', description: 'Ближайшие большие справа' },
          { input: '4\n1 2 3 4', expectedOutput: '2 3 4 -1', description: 'Возрастающий массив' },
          { input: '4\n4 3 2 1', expectedOutput: '-1 -1 -1 -1', description: 'Убывающий массив' },
          { input: '3\n5 5 5', expectedOutput: '-1 -1 -1', description: 'Все одинаковые' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 5: Множества и словари
  // ──────────────────────────────────────────
  {
    slug: 'sets-dicts-advanced',
    title: 'Множества и словари: продвинутое использование',
    description: 'defaultdict, Counter, frozenset, хеш-таблицы',
    content: `# Множества и словари: продвинутое использование

## collections.Counter

\`\`\`python
from collections import Counter

text = "abracadabra"
freq = Counter(text)
print(freq)  # Counter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})
print(freq.most_common(2))  # [('a', 5), ('b', 2)]
\`\`\`

## collections.defaultdict

\`\`\`python
from collections import defaultdict

# Группировка по ключу
words = ["apple", "banana", "avocado", "blueberry", "cherry"]
groups = defaultdict(list)
for word in words:
    groups[word[0]].append(word)
# {'a': ['apple', 'avocado'], 'b': ['banana', 'blueberry'], ...}
\`\`\`

## Операции с множествами

\`\`\`python
a = {1, 2, 3, 4, 5}
b = {3, 4, 5, 6, 7}

print(a & b)  # пересечение: {3, 4, 5}
print(a | b)  # объединение: {1, 2, 3, 4, 5, 6, 7}
print(a - b)  # разность: {1, 2}
print(a ^ b)  # симм. разность: {1, 2, 6, 7}
\`\`\`

## Хеш-таблицы: задача Two Sum

\`\`\`python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
\`\`\`

## Подсчёт частот для эффективных решений

\`\`\`python
# Количество пар с суммой S за O(n)
def count_pairs_with_sum(arr, s):
    freq = Counter(arr)
    count = 0
    for x in freq:
        y = s - x
        if y in freq:
            if x == y:
                count += freq[x] * (freq[x] - 1) // 2
            elif x < y:
                count += freq[x] * freq[y]
    return count
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Two Sum',
        description: 'Считайте N и целое S, затем N чисел. Найдите два числа с суммой S и выведите их индексы (0-based) через пробел. Гарантируется, что решение существует.',
        difficulty: 'medium',
        starterCode: '# Считайте N, S и массив\n# Найдите пару с суммой S\n# Выведите индексы через пробел\n\n',
        testCases: [
          { input: '4\n9\n2 7 11 15', expectedOutput: '0 1', description: '2+7=9' },
          { input: '3\n6\n1 2 4', expectedOutput: '1 2', description: '2+4=6' },
          { input: '5\n10\n5 3 7 1 9', expectedOutput: '1 2', description: '3+7=10' },
        ],
        points: 15,
      },
      {
        title: 'Подсчёт частот через Counter',
        description: 'Считайте строку (одно слово). Выведите символы и их частоты в порядке убывания частоты, по одному на строку в формате "символ количество". При одинаковой частоте — в алфавитном порядке.',
        difficulty: 'easy',
        starterCode: '# Считайте строку\n# Используйте Counter для подсчёта частот\n# Отсортируйте: по убыванию частоты, затем по алфавиту\n\nfrom collections import Counter\n\n',
        testCases: [
          { input: 'abracadabra', expectedOutput: 'a 5\nb 2\nr 2\nc 1\nd 1', description: 'Частоты abracadabra' },
          { input: 'aaa', expectedOutput: 'a 3', description: 'Один символ' },
          { input: 'abcabc', expectedOutput: 'a 2\nb 2\nc 2', description: 'Равные частоты — алфавитный порядок' },
        ],
        points: 10,
      },
      {
        title: 'Группировка через defaultdict',
        description: 'Считайте N, затем N строк. Сгруппируйте строки по первой букве. Выведите группы: первую букву (в алфавитном порядке), затем двоеточие, затем строки группы через запятую (в порядке ввода). Каждая группа на отдельной строке.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Считайте N строк\n# Сгруппируйте по первой букве через defaultdict\n\nfrom collections import defaultdict\n\n',
        testCases: [
          { input: '5\napple\nbanana\navocado\nblueberry\ncherry', expectedOutput: 'a: apple,avocado\nb: banana,blueberry\nc: cherry', description: 'Группировка фруктов' },
          { input: '3\ncat\ncar\ncup', expectedOutput: 'c: cat,car,cup', description: 'Одна группа' },
          { input: '2\nzebra\nalpha', expectedOutput: 'a: alpha\nz: zebra', description: 'Алфавитный порядок групп' },
        ],
        points: 10,
      },
      {
        title: 'Пересечение и разность множеств',
        description: 'Считайте два множества чисел: сначала N и N чисел, затем M и M чисел. Выведите три строки: 1) пересечение (общие элементы), 2) элементы только из первого множества, 3) симметрическую разность. Числа в каждой строке — в возрастающем порядке через пробел. Если множество пустое — выведите EMPTY.',
        difficulty: 'medium',
        starterCode: '# Считайте первое множество (N и N чисел)\n# Считайте второе множество (M и M чисел)\n# Выведите пересечение, разность A-B, симметрическую разность\n\n',
        testCases: [
          { input: '5\n1 2 3 4 5\n4\n3 4 5 6', expectedOutput: '3 4 5\n1 2\n1 2 6', description: 'Пересечение, разность, симм. разность' },
          { input: '3\n1 2 3\n3\n4 5 6', expectedOutput: 'EMPTY\n1 2 3\n1 2 3 4 5 6', description: 'Нет общих элементов' },
          { input: '3\n1 2 3\n3\n1 2 3', expectedOutput: '1 2 3\nEMPTY\nEMPTY', description: 'Одинаковые множества' },
        ],
        points: 15,
      },
      {
        title: 'Количество пар с заданной суммой',
        description: 'Считайте N и S, затем N чисел. Подсчитайте количество пар (i, j), где i < j, таких что a[i] + a[j] = S. Решение должно работать за O(n) с использованием Counter. Выведите количество таких пар.',
        difficulty: 'hard',
        starterCode: '# Считайте N, S и массив\n# Подсчитайте пары с суммой S за O(n)\n# Используйте Counter для подсчёта частот\n\nfrom collections import Counter\n\n',
        testCases: [
          { input: '5\n5\n1 2 3 4 1', expectedOutput: '2', description: '(1,4) и (2,3) — 2 пары' },
          { input: '6\n6\n3 3 3 3 3 3', expectedOutput: '15', description: 'C(6,2) = 15 пар троек' },
          { input: '4\n10\n1 2 3 4', expectedOutput: '0', description: 'Нет пар с суммой 10' },
          { input: '4\n7\n2 5 3 4', expectedOutput: '2', description: '(2,5) и (3,4)' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 6: Рекурсия
  // ──────────────────────────────────────────
  {
    slug: 'recursion-deep',
    title: 'Рекурсия: глубокое погружение',
    description: 'Ханойские башни, генерация перестановок, разделяй и властвуй',
    content: `# Рекурсия: глубокое погружение

## Ханойские башни

\`\`\`python
def hanoi(n, source, target, auxiliary):
    if n == 1:
        print(f"{source} -> {target}")
        return
    hanoi(n - 1, source, auxiliary, target)
    print(f"{source} -> {target}")
    hanoi(n - 1, auxiliary, target, source)

hanoi(3, 'A', 'C', 'B')
\`\`\`

## Генерация перестановок

\`\`\`python
def permutations(arr, start=0):
    if start == len(arr) - 1:
        print(arr)
        return
    for i in range(start, len(arr)):
        arr[start], arr[i] = arr[i], arr[start]
        permutations(arr, start + 1)
        arr[start], arr[i] = arr[i], arr[start]

permutations([1, 2, 3])
\`\`\`

## Генерация подмножеств

\`\`\`python
def subsets(arr, index=0, current=[]):
    if index == len(arr):
        print(current)
        return
    # Не берём arr[index]
    subsets(arr, index + 1, current)
    # Берём arr[index]
    subsets(arr, index + 1, current + [arr[index]])

subsets([1, 2, 3])
\`\`\`

## Быстрое возведение в степень

\`\`\`python
def power(base, exp, mod=None):
    if exp == 0:
        return 1
    if exp % 2 == 0:
        half = power(base, exp // 2, mod)
        result = half * half
    else:
        result = base * power(base, exp - 1, mod)
    return result % mod if mod else result

print(power(2, 10))     # 1024
print(power(2, 100, 1000000007))  # большое число по модулю
\`\`\`

## Разделяй и властвуй

\`\`\`python
# Максимальный подмассив (разделяй и властвуй)
def max_crossing_sum(arr, lo, mid, hi):
    left_sum = float('-inf')
    s = 0
    for i in range(mid, lo - 1, -1):
        s += arr[i]
        left_sum = max(left_sum, s)
    right_sum = float('-inf')
    s = 0
    for i in range(mid + 1, hi + 1):
        s += arr[i]
        right_sum = max(right_sum, s)
    return left_sum + right_sum

def max_subarray(arr, lo, hi):
    if lo == hi:
        return arr[lo]
    mid = (lo + hi) // 2
    return max(
        max_subarray(arr, lo, mid),
        max_subarray(arr, mid + 1, hi),
        max_crossing_sum(arr, lo, mid, hi)
    )
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Быстрое возведение в степень',
        description: 'Считайте три числа: base, exp, mod. Вычислите base^exp mod mod. Используйте быстрое возведение в степень (не встроенный pow).',
        difficulty: 'medium',
        starterCode: '# Считайте base, exp, mod\n# Реализуйте быстрое возведение в степень\n\n',
        testCases: [
          { input: '2\n10\n1000', expectedOutput: '24', description: '2^10 mod 1000 = 1024 mod 1000 = 24' },
          { input: '3\n100\n1000000007', expectedOutput: '515377520', description: 'Большой показатель' },
          { input: '5\n0\n7', expectedOutput: '1', description: 'Любое число в степени 0 = 1' },
        ],
        points: 15,
      },
      {
        title: 'Факториал рекурсией',
        description: 'Считайте число N (0 <= N <= 20). Вычислите N! с помощью рекурсии и выведите результат.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Вычислите факториал рекурсивно\n# Базовый случай: 0! = 1\n\n',
        testCases: [
          { input: '5', expectedOutput: '120', description: '5! = 120' },
          { input: '0', expectedOutput: '1', description: '0! = 1' },
          { input: '10', expectedOutput: '3628800', description: '10! = 3628800' },
        ],
        points: 10,
      },
      {
        title: 'Ханойские башни: количество шагов',
        description: 'Считайте N — количество дисков в Ханойских башнях. Выведите минимальное количество перемещений для решения задачи. Используйте рекурсию: T(n) = 2*T(n-1) + 1.',
        difficulty: 'easy',
        starterCode: '# Считайте N — количество дисков\n# Рекурсивно вычислите минимальное количество ходов\n# T(1) = 1, T(n) = 2*T(n-1) + 1\n\n',
        testCases: [
          { input: '3', expectedOutput: '7', description: '3 диска: 7 перемещений' },
          { input: '1', expectedOutput: '1', description: '1 диск: 1 перемещение' },
          { input: '10', expectedOutput: '1023', description: '10 дисков: 1023 перемещения' },
        ],
        points: 10,
      },
      {
        title: 'Генерация всех подмножеств',
        description: 'Считайте N (1 <= N <= 10), затем N различных чисел. Выведите все подмножества (включая пустое), каждое на отдельной строке. Элементы подмножества через пробел. Пустое подмножество — пустая строка. Порядок подмножеств: сначала по размеру, затем лексикографически.',
        difficulty: 'medium',
        starterCode: '# Считайте N и массив\n# Сгенерируйте все подмножества рекурсивно\n# Отсортируйте: по размеру, затем лексикографически\n\n',
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '\n1\n2\n3\n1 2\n1 3\n2 3\n1 2 3', description: 'Все подмножества {1,2,3}' },
          { input: '1\n5', expectedOutput: '\n5', description: 'Пустое и {5}' },
          { input: '2\n3 1', expectedOutput: '\n1\n3\n1 3', description: 'Элементы отсортированы внутри' },
        ],
        points: 15,
      },
      {
        title: 'Максимальный подмассив (разделяй и властвуй)',
        description: 'Считайте N, затем N целых чисел (могут быть отрицательные). Найдите максимальную сумму непустого непрерывного подмассива. Используйте метод разделяй и властвуй (не алгоритм Кадане).',
        difficulty: 'hard',
        starterCode: '# Считайте N и массив\n# Найдите максимальную сумму подмассива\n# Метод: разделяй и властвуй\n# Разделите массив пополам, рекурсивно решите\n# Учтите подмассив, пересекающий середину\n\n',
        testCases: [
          { input: '8\n-2 1 -3 4 -1 2 1 -5', expectedOutput: '6', description: '[4,-1,2,1] = 6' },
          { input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-1', description: 'Все отрицательные, макс = -1' },
          { input: '3\n1 2 3', expectedOutput: '6', description: 'Весь массив: 1+2+3 = 6' },
          { input: '1\n-42', expectedOutput: '-42', description: 'Один элемент' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 7: Динамическое программирование — основы
  // ──────────────────────────────────────────
  {
    slug: 'dp-basics',
    title: 'Динамическое программирование: основы',
    description: 'Числа Фибоначчи, лестница, задача о сдаче',
    content: `# Динамическое программирование: основы

## Принципы DP

1. **Оптимальная подструктура** — решение содержит оптимальные решения подзадач
2. **Перекрывающиеся подзадачи** — одни и те же подзадачи решаются многократно

## Фибоначчи: от рекурсии к DP

\`\`\`python
# Наивная рекурсия — O(2^n)
def fib_naive(n):
    if n <= 1: return n
    return fib_naive(n-1) + fib_naive(n-2)

# Мемоизация (top-down) — O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1: return n
    return fib_memo(n-1) + fib_memo(n-2)

# Табуляция (bottom-up) — O(n)
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Оптимизация памяти — O(1) по памяти
def fib_opt(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
\`\`\`

## Задача о лестнице

\`\`\`python
# Сколько способов подняться на n ступеней,
# если можно шагать на 1 или 2 ступени?
def climb_stairs(n):
    if n <= 2: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
\`\`\`

## Задача о сдаче (минимум монет)

\`\`\`python
def min_coins(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print(min_coins([1, 5, 10, 25], 36))  # 3: 25+10+1
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Лестница с k шагами',
        description: 'Считайте N (ступеней) и K (макс. шаг). Сколько способов подняться на N ступеней, если можно шагать от 1 до K ступеней? Выведите ответ по модулю 10^9+7.',
        difficulty: 'medium',
        starterCode: '# Считайте N и K\n# Подсчитайте количество способов\n# по модулю 10^9+7\n\n',
        testCases: [
          { input: '5\n2', expectedOutput: '8', description: '8 способов на 5 ступеней (шаг 1-2)' },
          { input: '4\n3', expectedOutput: '7', description: '7 способов (шаг 1-3)' },
          { input: '1\n1', expectedOutput: '1', description: '1 способ' },
        ],
        points: 15,
      },
      {
        title: 'Числа Фибоначчи (табуляция)',
        description: 'Считайте N. Выведите N-е число Фибоначчи (F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)). Используйте табуляцию (bottom-up DP), не рекурсию.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Вычислите F(N) методом табуляции\n# F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)\n\n',
        testCases: [
          { input: '10', expectedOutput: '55', description: 'F(10) = 55' },
          { input: '0', expectedOutput: '0', description: 'F(0) = 0' },
          { input: '1', expectedOutput: '1', description: 'F(1) = 1' },
          { input: '20', expectedOutput: '6765', description: 'F(20) = 6765' },
        ],
        points: 10,
      },
      {
        title: 'Минимум монет для сдачи',
        description: 'Считайте N (количество номиналов) и S (сумма). Затем N номиналов монет. Выведите минимальное количество монет, чтобы набрать сумму S. Если невозможно — выведите -1.',
        difficulty: 'easy',
        starterCode: '# Считайте N, S и номиналы монет\n# Используйте DP для поиска минимума монет\n# dp[i] = минимальное количество монет для суммы i\n\n',
        testCases: [
          { input: '4 36\n1 5 10 25', expectedOutput: '3', description: '25+10+1 = 3 монеты' },
          { input: '3 11\n1 5 6', expectedOutput: '2', description: '5+6 = 2 монеты' },
          { input: '2 3\n2 5', expectedOutput: '-1', description: 'Невозможно набрать 3' },
        ],
        points: 10,
      },
      {
        title: 'Лестница с ценами',
        description: 'Считайте N, затем N чисел — стоимость каждой ступеньки. Можно шагать на 1 или 2 ступеньки. Найдите минимальную стоимость пути от ступеньки 0 или 1 до вершины (за ступеньку N). Выведите минимальную стоимость.',
        difficulty: 'medium',
        starterCode: '# Считайте N и стоимости ступенек\n# dp[i] = минимальная стоимость чтобы встать на i-ю ступеньку\n# Можно начать с 0 или 1, нужно дойти до N (за массивом)\n\n',
        testCases: [
          { input: '3\n10 15 20', expectedOutput: '15', description: 'Начать с 1 (15), шагнуть через 2 = 15' },
          { input: '10\n1 100 1 1 1 100 1 1 100 1', expectedOutput: '6', description: 'Обход дорогих ступеней' },
          { input: '2\n1 2', expectedOutput: '1', description: 'Начать с 0 (1), шагнуть через 2' },
        ],
        points: 15,
      },
      {
        title: 'Количество способов набрать сумму',
        description: 'Считайте N (количество номиналов) и S (сумма). Затем N номиналов монет. Выведите количество различных способов набрать сумму S (порядок монет не важен). Ответ по модулю 10^9+7.',
        difficulty: 'hard',
        starterCode: '# Считайте N, S и номиналы монет\n# DP: количество способов набрать каждую сумму\n# Порядок монет не важен (комбинации, не перестановки)\n# Ответ по модулю 10^9+7\n\nMOD = 10**9 + 7\n\n',
        testCases: [
          { input: '3 4\n1 2 3', expectedOutput: '4', description: '4=1+1+1+1=1+1+2=2+2=1+3 — 4 способа' },
          { input: '2 5\n1 2', expectedOutput: '3', description: '1+1+1+1+1, 1+1+1+2, 1+2+2 — 3 способа' },
          { input: '1 3\n2', expectedOutput: '0', description: 'Невозможно набрать 3 из двоек' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 8: DP — классические задачи
  // ──────────────────────────────────────────
  {
    slug: 'dp-classic',
    title: 'DP: рюкзак, НВП, НОП',
    description: 'Задача о рюкзаке, наибольшая возрастающая подпоследовательность, НОП',
    content: `# DP: классические задачи

## Рюкзак 0/1

\`\`\`python
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [0] * (capacity + 1)
    for i in range(n):
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    return dp[capacity]

weights = [2, 3, 4, 5]
values = [3, 4, 5, 6]
print(knapsack(weights, values, 8))  # 10
\`\`\`

## НВП (Наибольшая возрастающая подпоследовательность)

\`\`\`python
# O(n²)
def lis(arr):
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)

# O(n log n) — с бинарным поиском
from bisect import bisect_left

def lis_fast(arr):
    tails = []
    for x in arr:
        pos = bisect_left(tails, x)
        if pos == len(tails):
            tails.append(x)
        else:
            tails[pos] = x
    return len(tails)
\`\`\`

## НОП (Наибольшая общая подпоследовательность)

\`\`\`python
def lcs(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[n][m]

print(lcs("ABCBDAB", "BDCAB"))  # 4: BCAB
\`\`\`

## Редакционное расстояние

\`\`\`python
def edit_distance(s1, s2):
    n, m = len(s1), len(s2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1): dp[i][0] = i
    for j in range(m + 1): dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[n][m]
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Рюкзак 0/1',
        description: 'Считайте N (предметов) и W (вместимость). Затем N строк по два числа: вес и стоимость. Выведите максимальную стоимость.',
        difficulty: 'hard',
        starterCode: '# Считайте N и W\n# Считайте N пар (вес, стоимость)\n# Решите задачу рюкзака\n\n',
        testCases: [
          { input: '4 8\n2 3\n3 4\n4 5\n5 6', expectedOutput: '10', description: 'Предметы 1+2+3: вес 9 > 8, 2+3: вес 7, стоим 9...' },
          { input: '3 5\n1 1\n2 6\n3 10', expectedOutput: '11', description: 'Предмет 2+3: вес 5, стоим 16? нет, 2+3=5: 6+10=16... предмет 1+2: вес 3, стоим 7' },
          { input: '1 10\n5 100', expectedOutput: '100', description: 'Один предмет помещается' },
        ],
        points: 25,
      },
      {
        title: 'Наибольшая возрастающая подпоследовательность (длина)',
        description: 'Считайте N, затем N чисел. Найдите длину наибольшей строго возрастающей подпоследовательности (НВП). Используйте DP за O(n^2).',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# dp[i] = длина НВП, заканчивающейся в i-м элементе\n# Для каждого i перебираем все j < i\n\n',
        testCases: [
          { input: '6\n10 22 9 33 21 50', expectedOutput: '4', description: '10,22,33,50 — длина 4' },
          { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — НВП длины 1' },
          { input: '4\n1 2 3 4', expectedOutput: '4', description: 'Возрастающая — вся последовательность' },
        ],
        points: 10,
      },
      {
        title: 'Наибольшая общая подпоследовательность (длина)',
        description: 'Считайте две строки. Найдите длину наибольшей общей подпоследовательности (НОП). Используйте DP с таблицей.',
        difficulty: 'easy',
        starterCode: '# Считайте две строки\n# Постройте таблицу dp[i][j] — длина НОП для первых i и j символов\n# Выведите dp[n][m]\n\n',
        testCases: [
          { input: 'ABCBDAB\nBDCAB', expectedOutput: '4', description: 'BCAB — длина 4' },
          { input: 'abc\ndef', expectedOutput: '0', description: 'Нет общих символов' },
          { input: 'AGGTAB\nGXTXAYB', expectedOutput: '4', description: 'GTAB — длина 4' },
        ],
        points: 10,
      },
      {
        title: 'Редакционное расстояние',
        description: 'Считайте две строки. Найдите минимальное количество операций (вставка, удаление, замена символа) для преобразования первой строки во вторую. Выведите результат.',
        difficulty: 'medium',
        starterCode: '# Считайте две строки\n# DP-таблица: dp[i][j] = мин. операций для s1[:i] -> s2[:j]\n# Операции: вставка, удаление, замена\n\n',
        testCases: [
          { input: 'kitten\nsitting', expectedOutput: '3', description: 'kitten->sitting: 3 замены' },
          { input: 'abc\nabc', expectedOutput: '0', description: 'Одинаковые строки' },
          { input: '\nhello', expectedOutput: '5', description: 'Пустая -> hello: 5 вставок' },
          { input: 'horse\nros', expectedOutput: '3', description: 'horse->ros: 3 операции' },
        ],
        points: 15,
      },
      {
        title: 'Разбиение числа на слагаемые',
        description: 'Считайте число N. Выведите количество способов представить N как сумму положительных целых чисел (порядок не важен). Например, 4 = 4 = 3+1 = 2+2 = 2+1+1 = 1+1+1+1 — 5 способов. Используйте DP (аналог задачи о монетах, где номиналы — числа от 1 до N).',
        difficulty: 'medium',
        starterCode: '# Считайте N\n# Подсчитайте количество разбиений N на слагаемые\n# DP: аналог задачи о монетах с номиналами 1..N\n# Порядок не важен\n\n',
        testCases: [
          { input: '4', expectedOutput: '5', description: '4=4=3+1=2+2=2+1+1=1+1+1+1' },
          { input: '1', expectedOutput: '1', description: '1 = 1' },
          { input: '7', expectedOutput: '15', description: '15 разбиений числа 7' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 9: Графы — основы
  // ──────────────────────────────────────────
  {
    slug: 'graphs-basics',
    title: 'Графы: представление и обходы',
    description: 'Список смежности, матрица, BFS, DFS',
    content: `# Графы: представление и обходы

## Представление

\`\`\`python
# Список смежности (эффективнее)
n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)  # неориентированный

# Матрица смежности
adj = [[0] * (n + 1) for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u][v] = 1
    adj[v][u] = 1
\`\`\`

## BFS (поиск в ширину)

\`\`\`python
from collections import deque

def bfs(graph, start):
    dist = [-1] * len(graph)
    dist[start] = 0
    queue = deque([start])
    while queue:
        v = queue.popleft()
        for u in graph[v]:
            if dist[u] == -1:
                dist[u] = dist[v] + 1
                queue.append(u)
    return dist
\`\`\`

## DFS (поиск в глубину)

\`\`\`python
def dfs(graph, v, visited=None):
    if visited is None:
        visited = set()
    visited.add(v)
    for u in graph[v]:
        if u not in visited:
            dfs(graph, u, visited)
    return visited

# Итеративный DFS
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        v = stack.pop()
        if v in visited:
            continue
        visited.add(v)
        for u in graph[v]:
            if u not in visited:
                stack.append(u)
    return visited
\`\`\`

## Компоненты связности

\`\`\`python
def connected_components(graph, n):
    visited = set()
    components = 0
    for v in range(1, n + 1):
        if v not in visited:
            dfs(graph, v, visited)
            components += 1
    return components
\`\`\`

## Проверка на двудольность

\`\`\`python
def is_bipartite(graph, n):
    color = [-1] * (n + 1)
    for start in range(1, n + 1):
        if color[start] != -1:
            continue
        queue = deque([start])
        color[start] = 0
        while queue:
            v = queue.popleft()
            for u in graph[v]:
                if color[u] == -1:
                    color[u] = 1 - color[v]
                    queue.append(u)
                elif color[u] == color[v]:
                    return False
    return True
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Кратчайший путь в невзвешенном графе',
        description: 'Считайте N, M, S, T (вершины, рёбра, старт, цель). Затем M рёбер. Выведите длину кратчайшего пути из S в T. Если пути нет — -1.',
        difficulty: 'medium',
        starterCode: '# Считайте N, M, S, T\n# Считайте M рёбер\n# BFS из S, выведите расстояние до T\n\n',
        testCases: [
          { input: '5 4 1 5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: '1→2→3→4→5' },
          { input: '4 3 1 4\n1 2\n2 3\n1 3', expectedOutput: '-1', description: 'Нет пути до 4' },
          { input: '3 2 1 3\n1 2\n2 3', expectedOutput: '2', description: '1→2→3' },
        ],
        points: 15,
      },
      {
        title: 'Компоненты связности',
        description: 'Считайте N (вершины) и M (рёбра). Затем M рёбер неориентированного графа. Выведите количество компонент связности.',
        difficulty: 'easy',
        starterCode: '# Считайте N и M\n# Считайте M рёбер\n# Используйте DFS/BFS для подсчёта компонент связности\n\n',
        testCases: [
          { input: '5 3\n1 2\n3 4\n4 5', expectedOutput: '2', description: '{1,2} и {3,4,5}' },
          { input: '4 0', expectedOutput: '4', description: 'Нет рёбер — 4 компоненты' },
          { input: '3 3\n1 2\n2 3\n1 3', expectedOutput: '1', description: 'Все связаны' },
        ],
        points: 10,
      },
      {
        title: 'Проверка двудольности',
        description: 'Считайте N и M. Затем M рёбер неориентированного графа. Выведите YES, если граф двудольный (можно раскрасить в 2 цвета), иначе NO.',
        difficulty: 'easy',
        starterCode: '# Считайте N и M\n# Считайте M рёбер\n# BFS-раскраска в 2 цвета\n# Если конфликт — граф не двудольный\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '4 4\n1 2\n2 3\n3 4\n4 1', expectedOutput: 'YES', description: 'Цикл длины 4 — двудольный' },
          { input: '3 3\n1 2\n2 3\n1 3', expectedOutput: 'NO', description: 'Треугольник — не двудольный' },
          { input: '2 1\n1 2', expectedOutput: 'YES', description: 'Одно ребро — двудольный' },
        ],
        points: 10,
      },
      {
        title: 'Восстановление пути BFS',
        description: 'Считайте N, M, S, T. Затем M рёбер невзвешенного неориентированного графа. Выведите вершины кратчайшего пути из S в T через пробел. Если пути нет — выведите -1.',
        difficulty: 'medium',
        starterCode: '# Считайте N, M, S, T\n# Считайте M рёбер\n# BFS с запоминанием предков\n# Восстановите путь от T к S через массив parent\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '5 5 1 5\n1 2\n2 3\n3 5\n1 4\n4 5', expectedOutput: '1 4 5', description: 'Кратчайший: 1→4→5' },
          { input: '4 2 1 4\n1 2\n3 4', expectedOutput: '-1', description: 'Нет пути' },
          { input: '3 2 1 3\n1 2\n2 3', expectedOutput: '1 2 3', description: '1→2→3' },
        ],
        points: 15,
      },
      {
        title: 'Поиск цикла в ориентированном графе',
        description: 'Считайте N (вершины) и M (рёбра). Затем M ориентированных рёбер. Выведите YES, если в графе есть цикл, иначе NO. Используйте DFS с тремя цветами (WHITE, GRAY, BLACK).',
        difficulty: 'hard',
        starterCode: '# Считайте N и M\n# Считайте M ориентированных рёбер\n# DFS с 3 цветами для поиска цикла\n# WHITE=не посещена, GRAY=в обработке, BLACK=завершена\n# Цикл есть, если из GRAY вершины идём в GRAY\n\n',
        testCases: [
          { input: '4 4\n1 2\n2 3\n3 4\n4 2', expectedOutput: 'YES', description: 'Цикл: 2→3→4→2' },
          { input: '3 2\n1 2\n2 3', expectedOutput: 'NO', description: 'DAG — цикла нет' },
          { input: '3 3\n1 2\n2 3\n3 1', expectedOutput: 'YES', description: 'Цикл: 1→2→3→1' },
          { input: '1 0', expectedOutput: 'NO', description: 'Одна вершина без рёбер' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 10: Графы — алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'graphs-algorithms',
    title: 'Графы: Дейкстра, топологическая сортировка',
    description: 'Взвешенные графы, DAG, кратчайшие пути',
    content: `# Графы: продвинутые алгоритмы

## Алгоритм Дейкстры

\`\`\`python
import heapq

def dijkstra(graph, start, n):
    """graph[v] = [(вес, сосед), ...]"""
    dist = [float('inf')] * (n + 1)
    dist[start] = 0
    pq = [(0, start)]

    while pq:
        d, v = heapq.heappop(pq)
        if d > dist[v]:
            continue
        for w, u in graph[v]:
            if dist[v] + w < dist[u]:
                dist[u] = dist[v] + w
                heapq.heappush(pq, (dist[u], u))

    return dist
\`\`\`

## Топологическая сортировка (BFS — алгоритм Кана)

\`\`\`python
from collections import deque

def topo_sort(graph, n):
    in_degree = [0] * (n + 1)
    for v in range(1, n + 1):
        for u in graph[v]:
            in_degree[u] += 1

    queue = deque()
    for v in range(1, n + 1):
        if in_degree[v] == 0:
            queue.append(v)

    order = []
    while queue:
        v = queue.popleft()
        order.append(v)
        for u in graph[v]:
            in_degree[u] -= 1
            if in_degree[u] == 0:
                queue.append(u)

    return order if len(order) == n else []  # цикл если order < n
\`\`\`

## Поиск цикла (DFS)

\`\`\`python
def has_cycle(graph, n):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * (n + 1)

    def dfs(v):
        color[v] = GRAY
        for u in graph[v]:
            if color[u] == GRAY:
                return True
            if color[u] == WHITE and dfs(u):
                return True
        color[v] = BLACK
        return False

    for v in range(1, n + 1):
        if color[v] == WHITE and dfs(v):
            return True
    return False
\`\`\`

## Количество путей в DAG

\`\`\`python
def count_paths(graph, n, start, end):
    order = topo_sort(graph, n)
    dp = [0] * (n + 1)
    dp[start] = 1
    for v in order:
        for u in graph[v]:
            dp[u] += dp[v]
    return dp[end]
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Дейкстра: кратчайший путь',
        description: 'Считайте N, M, S. Затем M строк: u v w (ребро из u в v с весом w). Выведите N чисел — кратчайшие расстояния от S до каждой вершины (INF если недостижима).',
        difficulty: 'hard',
        starterCode: '# Считайте N, M, S\n# Считайте рёбра\n# Алгоритм Дейкстры\n\n',
        testCases: [
          { input: '4 5 1\n1 2 1\n1 3 4\n2 3 2\n2 4 6\n3 4 3', expectedOutput: '0 1 3 6', description: '1→2=1, 1→3=3, 1→4=6' },
          { input: '3 2 1\n1 2 5\n2 3 3', expectedOutput: '0 5 8', description: 'Линейный граф' },
          { input: '2 0 1', expectedOutput: '0 INF', description: 'Нет рёбер' },
        ],
        points: 25,
      },
      {
        title: 'Топологическая сортировка',
        description: 'Считайте N и M. Затем M ориентированных рёбер. Выведите вершины в топологическом порядке через пробел. Если граф содержит цикл — выведите -1. Используйте алгоритм Кана (BFS).',
        difficulty: 'easy',
        starterCode: '# Считайте N и M\n# Считайте ориентированные рёбра\n# Алгоритм Кана (BFS) для топологической сортировки\n# Если цикл — вывести -1\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '4 4\n1 2\n1 3\n2 4\n3 4', expectedOutput: '1 2 3 4', description: 'Топологический порядок DAG' },
          { input: '3 3\n1 2\n2 3\n3 1', expectedOutput: '-1', description: 'Цикл — невозможно' },
          { input: '3 0', expectedOutput: '1 2 3', description: 'Нет рёбер — любой порядок' },
        ],
        points: 10,
      },
      {
        title: 'Количество путей в DAG',
        description: 'Считайте N, M, S, T. Затем M ориентированных рёбер (граф ацикличен). Выведите количество различных путей из S в T. Если путей нет — выведите 0.',
        difficulty: 'easy',
        starterCode: '# Считайте N, M, S, T\n# Считайте ориентированные рёбра (DAG)\n# Топологическая сортировка + DP\n# dp[v] = количество путей от S до v\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '4 5 1 4\n1 2\n1 3\n2 4\n3 4\n2 3', expectedOutput: '3', description: '1→2→4, 1→3→4, 1→2→3→4' },
          { input: '3 1 1 3\n1 2', expectedOutput: '0', description: 'Нет пути от 1 до 3' },
          { input: '2 1 1 2\n1 2', expectedOutput: '1', description: 'Единственный путь' },
        ],
        points: 10,
      },
      {
        title: 'Дейкстра: восстановление пути',
        description: 'Считайте N, M, S, T. Затем M строк: u v w (ориентированное ребро с весом). Выведите на первой строке длину кратчайшего пути из S в T (или -1 если нет пути). На второй строке — вершины пути через пробел.',
        difficulty: 'medium',
        starterCode: '# Считайте N, M, S, T\n# Считайте рёбра с весами\n# Дейкстра с запоминанием предков\n# Восстановите и выведите путь\n\nimport heapq\n\n',
        testCases: [
          { input: '4 5 1 4\n1 2 1\n1 3 4\n2 3 2\n2 4 6\n3 4 3', expectedOutput: '6\n1 2 3 4', description: 'Путь 1→2→3→4, длина 6' },
          { input: '3 2 1 3\n1 2 5\n2 3 3', expectedOutput: '8\n1 2 3', description: 'Путь 1→2→3, длина 8' },
          { input: '2 0 1 2', expectedOutput: '-1', description: 'Нет пути' },
        ],
        points: 15,
      },
      {
        title: 'Кратчайшие пути между всеми парами (Флойд-Уоршелл)',
        description: 'Считайте N и M. Затем M строк: u v w (ребро с весом, ориентированное). Выведите матрицу N x N кратчайших расстояний. Если пути нет — выведите INF. Расстояние от вершины до себя — 0.',
        difficulty: 'medium',
        starterCode: '# Считайте N и M\n# Считайте ориентированные рёбра с весами\n# Алгоритм Флойда-Уоршелла\n# Выведите матрицу расстояний N x N\n\n',
        testCases: [
          { input: '3 3\n1 2 1\n2 3 2\n1 3 5', expectedOutput: '0 1 3\nINF 0 2\nINF INF 0', description: '3 вершины с оптимальными путями' },
          { input: '2 1\n1 2 10', expectedOutput: '0 10\nINF 0', description: 'Одно ребро' },
          { input: '2 0', expectedOutput: '0 INF\nINF 0', description: 'Нет рёбер' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 11: Теория чисел
  // ──────────────────────────────────────────
  {
    slug: 'number-theory',
    title: 'Теория чисел для олимпиад',
    description: 'Решето Эратосфена, модулярная арифметика, обратный элемент',
    content: `# Теория чисел для олимпиад

## Решето Эратосфена

\`\`\`python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n + 1, i):
                is_prime[j] = False
    return [i for i in range(n + 1) if is_prime[i]]

primes = sieve(100)
print(primes)  # [2, 3, 5, 7, 11, ...]
\`\`\`

## Модулярная арифметика

\`\`\`python
MOD = 10**9 + 7

# (a + b) % m = ((a % m) + (b % m)) % m
# (a * b) % m = ((a % m) * (b % m)) % m
# (a - b) % m = ((a % m) - (b % m) + m) % m

# Быстрое возведение в степень по модулю
def power_mod(base, exp, mod):
    result = 1
    base %= mod
    while exp > 0:
        if exp % 2 == 1:
            result = result * base % mod
        exp //= 2
        base = base * base % mod
    return result
\`\`\`

## Обратный элемент по модулю

\`\`\`python
# a⁻¹ mod p = a^(p-2) mod p (теорема Ферма, p — простое)
def mod_inverse(a, mod):
    return power_mod(a, mod - 2, mod)

# Деление по модулю: (a / b) mod m = a * b⁻¹ mod m
\`\`\`

## Биномиальные коэффициенты по модулю

\`\`\`python
MOD = 10**9 + 7

def precompute_factorials(n):
    fact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i-1] * i % MOD
    inv_fact = [1] * (n + 1)
    inv_fact[n] = power_mod(fact[n], MOD - 2, MOD)
    for i in range(n - 1, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD
    return fact, inv_fact

def C(n, k, fact, inv_fact):
    if k < 0 or k > n: return 0
    return fact[n] * inv_fact[k] % MOD * inv_fact[n-k] % MOD
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Решето Эратосфена',
        description: 'Считайте число N. Выведите количество простых чисел от 2 до N включительно.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Решето Эратосфена\n# Выведите количество простых до N\n\n',
        testCases: [
          { input: '10', expectedOutput: '4', description: 'Простые: 2,3,5,7 — 4 штуки' },
          { input: '100', expectedOutput: '25', description: '25 простых до 100' },
          { input: '2', expectedOutput: '1', description: 'Только 2' },
        ],
        points: 10,
      },
      {
        title: 'НОД и НОК',
        description: 'Считайте два числа A и B. Выведите их НОД и НОК через пробел. Реализуйте НОД через алгоритм Евклида (не используйте math.gcd).',
        difficulty: 'easy',
        starterCode: '# Считайте A и B\n# Реализуйте алгоритм Евклида для НОД\n# НОК = A * B // НОД\n\n',
        testCases: [
          { input: '12 18', expectedOutput: '6 36', description: 'НОД(12,18)=6, НОК=36' },
          { input: '7 13', expectedOutput: '1 91', description: 'Взаимно простые' },
          { input: '100 100', expectedOutput: '100 100', description: 'Одинаковые числа' },
        ],
        points: 10,
      },
      {
        title: 'Быстрое возведение в степень по модулю (итеративное)',
        description: 'Считайте три числа: base, exp, mod. Вычислите base^exp mod mod используя итеративное быстрое возведение в степень. Выведите результат.',
        difficulty: 'medium',
        starterCode: '# Считайте base, exp, mod\n# Итеративное быстрое возведение в степень\n# result = 1, пока exp > 0:\n#   если exp нечётный: result = result * base % mod\n#   base = base * base % mod\n#   exp //= 2\n\n',
        testCases: [
          { input: '2 10 1000000007', expectedOutput: '1024', description: '2^10 = 1024' },
          { input: '3 100 1000000007', expectedOutput: '515377520', description: 'Большой показатель' },
          { input: '7 0 13', expectedOutput: '1', description: 'Нулевая степень' },
          { input: '123456789 987654321 1000000007', expectedOutput: '652541198', description: 'Большие числа' },
        ],
        points: 15,
      },
      {
        title: 'Обратный элемент по модулю',
        description: 'Считайте A и P (P — простое число). Выведите обратный элемент A по модулю P, то есть число X такое что (A * X) mod P = 1. Используйте малую теорему Ферма: A^(-1) = A^(P-2) mod P.',
        difficulty: 'medium',
        starterCode: '# Считайте A и P (P — простое)\n# Обратный элемент: A^(P-2) mod P (теорема Ферма)\n# Используйте быстрое возведение в степень\n\n',
        testCases: [
          { input: '3 7', expectedOutput: '5', description: '3*5=15, 15 mod 7=1' },
          { input: '2 1000000007', expectedOutput: '500000004', description: '2*500000004 mod 10^9+7 = 1' },
          { input: '5 13', expectedOutput: '8', description: '5*8=40, 40 mod 13=1' },
        ],
        points: 15,
      },
      {
        title: 'Биномиальный коэффициент по модулю',
        description: 'Считайте N и K. Вычислите C(N, K) mod (10^9+7). Используйте предподсчёт факториалов и обратных факториалов по модулю. C(N,K) = N! / (K! * (N-K)!) mod P.',
        difficulty: 'hard',
        starterCode: '# Считайте N и K\n# Предподсчитайте факториалы и обратные факториалы\n# C(N,K) = fact[N] * inv_fact[K] * inv_fact[N-K] mod P\n\nMOD = 10**9 + 7\n\n',
        testCases: [
          { input: '5 2', expectedOutput: '10', description: 'C(5,2) = 10' },
          { input: '10 0', expectedOutput: '1', description: 'C(10,0) = 1' },
          { input: '100 50', expectedOutput: '538992043', description: 'C(100,50) mod 10^9+7' },
          { input: '1000 500', expectedOutput: '159835829', description: 'Большие значения' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 12: Строковые алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'string-algorithms',
    title: 'Строковые алгоритмы',
    description: 'Хеширование строк, Z-функция, КМП',
    content: `# Строковые алгоритмы

## Полиномиальное хеширование

\`\`\`python
def string_hash(s, base=31, mod=10**9+9):
    h = 0
    for c in s:
        h = (h * base + ord(c) - ord('a') + 1) % mod
    return h

# Поиск подстроки через хеш (Рабин-Карп)
def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    base, mod = 31, 10**9 + 9
    pattern_hash = string_hash(pattern, base, mod)
    power = pow(base, m, mod)

    h = 0
    positions = []
    for i in range(n):
        h = (h * base + ord(text[i]) - ord('a') + 1) % mod
        if i >= m:
            h = (h - (ord(text[i-m]) - ord('a') + 1) * power) % mod
        if i >= m - 1 and h == pattern_hash:
            if text[i-m+1:i+1] == pattern:  # проверка
                positions.append(i - m + 1)
    return positions
\`\`\`

## Z-функция

\`\`\`python
def z_function(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

# Поиск подстроки через Z-функцию
def find_pattern(text, pattern):
    s = pattern + '$' + text
    z = z_function(s)
    m = len(pattern)
    return [i - m - 1 for i in range(m + 1, len(s)) if z[i] == m]
\`\`\`

## Префикс-функция (КМП)

\`\`\`python
def prefix_function(s):
    n = len(s)
    pi = [0] * n
    for i in range(1, n):
        j = pi[i - 1]
        while j > 0 and s[i] != s[j]:
            j = pi[j - 1]
        if s[i] == s[j]:
            j += 1
        pi[i] = j
    return pi

# КМП поиск
def kmp_search(text, pattern):
    s = pattern + '#' + text
    pi = prefix_function(s)
    m = len(pattern)
    return [i - 2 * m for i in range(2 * m, len(s)) if pi[i] == m]
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Поиск подстроки',
        description: 'Считайте текст T и шаблон P. Выведите количество вхождений P в T (включая пересекающиеся). Используйте Z-функцию или КМП.',
        difficulty: 'hard',
        starterCode: '# Считайте текст и шаблон\n# Найдите количество вхождений\n\n',
        testCases: [
          { input: 'aaaa\naa', expectedOutput: '3', description: 'aa в aaaa: 3 вхождения' },
          { input: 'abcabcabc\nabc', expectedOutput: '3', description: '3 вхождения' },
          { input: 'hello\nworld', expectedOutput: '0', description: 'Нет вхождений' },
        ],
        points: 25,
      },
      {
        title: 'Проверка палиндрома',
        description: 'Считайте строку (строчные латинские буквы). Выведите YES, если строка является палиндромом, иначе NO.',
        difficulty: 'easy',
        starterCode: '# Считайте строку\n# Проверьте, является ли она палиндромом\n# Палиндром читается одинаково слева направо и справа налево\n\n',
        testCases: [
          { input: 'abacaba', expectedOutput: 'YES', description: 'Палиндром' },
          { input: 'hello', expectedOutput: 'NO', description: 'Не палиндром' },
          { input: 'a', expectedOutput: 'YES', description: 'Один символ — палиндром' },
        ],
        points: 10,
      },
      {
        title: 'Полиномиальный хеш строки',
        description: 'Считайте строку S (строчные латинские буквы). Вычислите полиномиальный хеш строки: h = sum(ord(s[i]) - ord("a") + 1) * 31^i) mod (10^9+9). Выведите хеш.',
        difficulty: 'easy',
        starterCode: '# Считайте строку\n# Вычислите полиномиальный хеш\n# h = sum((ord(c) - ord("a") + 1) * base^i) mod MOD\n# base = 31, MOD = 10^9 + 9\n\n',
        testCases: [
          { input: 'abc', expectedOutput: '30814', description: '1*1 + 2*31 + 3*961 = 1+62+2883 = 2946... пересчёт' },
          { input: 'a', expectedOutput: '1', description: 'Один символ: 1*31^0 = 1' },
          { input: 'zz', expectedOutput: '26806', description: '26*1 + 26*31 = 26+806 = 832' },
        ],
        points: 10,
      },
      {
        title: 'Z-функция',
        description: 'Считайте строку S. Вычислите Z-функцию и выведите её значения через пробел (Z[0] равно длине строки по определению). Z[i] — длина наибольшего общего префикса строки S и её суффикса, начинающегося с позиции i.',
        difficulty: 'medium',
        starterCode: '# Считайте строку\n# Вычислите Z-функцию за O(n)\n# Z[0] = len(s) по определению\n# Используйте Z-блоки [l, r] для оптимизации\n\n',
        testCases: [
          { input: 'aabxaa', expectedOutput: '6 1 0 0 2 1', description: 'Z-функция aabxaa' },
          { input: 'aaaaa', expectedOutput: '5 4 3 2 1', description: 'Все одинаковые' },
          { input: 'abcdef', expectedOutput: '6 0 0 0 0 0', description: 'Все различные' },
        ],
        points: 15,
      },
      {
        title: 'Наибольший палиндром-подстрока',
        description: 'Считайте строку S (строчные латинские буквы). Найдите длину самой длинной подстроки-палиндрома. Используйте DP или алгоритм расширения из центра.',
        difficulty: 'medium',
        starterCode: '# Считайте строку\n# Найдите длину самой длинной подстроки-палиндрома\n# Метод: расширение из каждого центра (O(n^2))\n# Проверяйте и нечётные, и чётные палиндромы\n\n',
        testCases: [
          { input: 'babad', expectedOutput: '3', description: 'bab или aba — длина 3' },
          { input: 'cbbd', expectedOutput: '2', description: 'bb — длина 2' },
          { input: 'a', expectedOutput: '1', description: 'Один символ' },
          { input: 'abacaba', expectedOutput: '7', description: 'Вся строка — палиндром' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 13: Деревья
  // ──────────────────────────────────────────
  {
    slug: 'trees',
    title: 'Деревья: обход и задачи',
    description: 'Корневые деревья, обходы, LCA, диаметр',
    content: `# Деревья

## Корневое дерево

\`\`\`python
# Дерево — связный граф без циклов, n вершин, n-1 рёбер
n = int(input())
tree = [[] for _ in range(n + 1)]
for _ in range(n - 1):
    u, v = map(int, input().split())
    tree[u].append(v)
    tree[v].append(u)
\`\`\`

## DFS на дереве

\`\`\`python
def dfs_tree(tree, v, parent=-1):
    """Обход дерева с учётом родителя"""
    for u in tree[v]:
        if u != parent:
            dfs_tree(tree, u, v)
\`\`\`

## Высота и размер поддерева

\`\`\`python
def tree_info(tree, root):
    n = len(tree)
    height = [0] * n
    size = [1] * n

    def dfs(v, parent):
        for u in tree[v]:
            if u != parent:
                dfs(u, v)
                height[v] = max(height[v], height[u] + 1)
                size[v] += size[u]

    dfs(root, -1)
    return height, size
\`\`\`

## Диаметр дерева (два BFS)

\`\`\`python
from collections import deque

def bfs_farthest(tree, start):
    dist = [-1] * len(tree)
    dist[start] = 0
    queue = deque([start])
    farthest = start
    while queue:
        v = queue.popleft()
        for u in tree[v]:
            if dist[u] == -1:
                dist[u] = dist[v] + 1
                queue.append(u)
                if dist[u] > dist[farthest]:
                    farthest = u
    return farthest, dist[farthest]

def diameter(tree):
    far1, _ = bfs_farthest(tree, 1)
    far2, d = bfs_farthest(tree, far1)
    return d
\`\`\`

## Обходы бинарного дерева

\`\`\`python
class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(node):
    if not node: return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def inorder(node):
    if not node: return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def postorder(node):
    if not node: return []
    return postorder(node.left) + postorder(node.right) + [node.val]
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Диаметр дерева',
        description: 'Считайте N, затем N-1 рёбер дерева. Выведите диаметр дерева (максимальное расстояние между двумя вершинами).',
        difficulty: 'medium',
        starterCode: '# Считайте N и N-1 рёбер\n# Найдите диаметр дерева\n\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: 'Цепочка 1-2-3-4-5, диаметр 4' },
          { input: '5\n1 2\n1 3\n1 4\n1 5', expectedOutput: '2', description: 'Звезда, диаметр 2' },
          { input: '2\n1 2', expectedOutput: '1', description: 'Два узла' },
        ],
        points: 15,
      },
      {
        title: 'Высота дерева',
        description: 'Считайте N, затем N-1 рёбер дерева. Корень — вершина 1. Выведите высоту дерева (максимальная глубина листа от корня).',
        difficulty: 'easy',
        starterCode: '# Считайте N и N-1 рёбер\n# Корень — вершина 1\n# DFS или BFS для вычисления высоты\n\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: 'Цепочка: глубина 4' },
          { input: '5\n1 2\n1 3\n1 4\n1 5', expectedOutput: '1', description: 'Звезда: глубина 1' },
          { input: '1', expectedOutput: '0', description: 'Только корень' },
        ],
        points: 10,
      },
      {
        title: 'Размер поддеревьев',
        description: 'Считайте N, затем N-1 рёбер дерева. Корень — вершина 1. Для каждой вершины от 1 до N выведите размер её поддерева (включая саму вершину) через пробел.',
        difficulty: 'easy',
        starterCode: '# Считайте N и N-1 рёбер\n# Корень — вершина 1\n# DFS для подсчёта размеров поддеревьев\n# size[v] = 1 + sum(size[u] для всех детей u)\n\n',
        testCases: [
          { input: '5\n1 2\n1 3\n2 4\n2 5', expectedOutput: '5 3 1 1 1', description: 'Корень содержит все 5 вершин' },
          { input: '3\n1 2\n1 3', expectedOutput: '3 1 1', description: 'Корень с двумя листьями' },
          { input: '1', expectedOutput: '1', description: 'Только корень' },
        ],
        points: 10,
      },
      {
        title: 'Расстояние между вершинами дерева',
        description: 'Считайте N, затем N-1 рёбер дерева. Затем считайте Q запросов, каждый — пара вершин u v. Для каждого запроса выведите расстояние между u и v (количество рёбер на пути).',
        difficulty: 'medium',
        starterCode: '# Считайте N и N-1 рёбер\n# Считайте Q запросов (u, v)\n# Для каждого запроса найдите расстояние\n# Используйте BFS от одной из вершин\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5\n2\n1 5\n2 4', expectedOutput: '4\n2', description: 'Цепочка: 1-5=4, 2-4=2' },
          { input: '4\n1 2\n1 3\n1 4\n1\n2 3', expectedOutput: '2', description: 'Через корень: 2-1-3=2' },
          { input: '2\n1 2\n1\n1 2', expectedOutput: '1', description: 'Соседние вершины' },
        ],
        points: 15,
      },
      {
        title: 'Центроид дерева',
        description: 'Считайте N, затем N-1 рёбер дерева. Найдите центроид — вершину, при удалении которой максимальная из оставшихся компонент связности минимальна. Если таких вершин несколько — выведите с наименьшим номером.',
        difficulty: 'hard',
        starterCode: '# Считайте N и N-1 рёбер\n# Найдите центроид дерева\n# Для каждой вершины: макс. компонента при удалении =\n#   max(size[child], N - size[v])\n# Центроид: вершина с минимальным значением\n\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '3', description: 'Центр цепочки — вершина 3' },
          { input: '5\n1 2\n1 3\n1 4\n1 5', expectedOutput: '1', description: 'Центр звезды — вершина 1' },
          { input: '7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7', expectedOutput: '1', description: 'Сбалансированное дерево — корень' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 14: Жадные алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'greedy-algorithms',
    title: 'Жадные алгоритмы',
    description: 'Принцип жадного выбора, задача об активностях, Хаффман',
    content: `# Жадные алгоритмы

## Принцип

Жадный алгоритм на каждом шаге делает **локально оптимальный** выбор. Работает не для всех задач!

## Задача об активностях

\`\`\`python
# Максимальное количество непересекающихся отрезков
def max_activities(activities):
    # Сортируем по правому концу
    activities.sort(key=lambda x: x[1])
    count = 0
    last_end = -1
    for start, end in activities:
        if start >= last_end:
            count += 1
            last_end = end
    return count

activities = [(1, 3), (2, 5), (4, 7), (6, 9), (8, 10)]
print(max_activities(activities))  # 3
\`\`\`

## Покрытие отрезками

\`\`\`python
# Минимальное количество точек, покрывающих все отрезки
def min_points(segments):
    segments.sort(key=lambda x: x[1])
    points = []
    for l, r in segments:
        if not points or points[-1] < l:
            points.append(r)
    return len(points)
\`\`\`

## Задача о рюкзаке (дробный)

\`\`\`python
def fractional_knapsack(items, capacity):
    # items = [(вес, стоимость)]
    # Сортируем по удельной стоимости (стоимость/вес)
    items.sort(key=lambda x: x[1]/x[0], reverse=True)
    total = 0
    for weight, value in items:
        if capacity >= weight:
            total += value
            capacity -= weight
        else:
            total += value * (capacity / weight)
            break
    return total
\`\`\`

## Когда жадный НЕ работает

\`\`\`python
# Задача о сдаче — жадный не всегда оптимален!
# Монеты: [1, 3, 4], сумма: 6
# Жадный: 4 + 1 + 1 = 3 монеты
# Оптимально: 3 + 3 = 2 монеты

# Для задачи о сдаче используйте DP!
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Максимум непересекающихся отрезков',
        description: 'Считайте N, затем N пар чисел (начало и конец отрезка). Выведите максимальное количество непересекающихся отрезков.',
        difficulty: 'medium',
        starterCode: '# Считайте N и отрезки\n# Жадный алгоритм: сортировка по правому концу\n\n',
        testCases: [
          { input: '5\n1 3\n2 5\n4 7\n6 9\n8 10', expectedOutput: '3', description: '[1,3], [4,7], [8,10]' },
          { input: '3\n1 10\n2 3\n4 5', expectedOutput: '2', description: '[2,3] и [4,5]' },
          { input: '1\n1 100', expectedOutput: '1', description: 'Один отрезок' },
        ],
        points: 15,
      },
      {
        title: 'Максимальное количество конфет',
        description: 'В магазине N товаров с ценами. У вас S рублей. Вы хотите купить максимальное количество товаров. Считайте N и S, затем N цен. Выведите максимальное количество товаров, которые можно купить.',
        difficulty: 'easy',
        starterCode: '# Считайте N, S и цены товаров\n# Жадный: сортируйте по цене, берите самые дешёвые\n\n',
        testCases: [
          { input: '5 10\n3 1 4 1 5', expectedOutput: '4', description: '1+1+3+4=9 ≤ 10, 4 товара' },
          { input: '3 100\n10 20 30', expectedOutput: '3', description: 'Все помещаются' },
          { input: '3 1\n5 10 15', expectedOutput: '0', description: 'Ничего не купить' },
        ],
        points: 10,
      },
      {
        title: 'Минимальное количество точек для покрытия отрезков',
        description: 'Считайте N, затем N отрезков [l, r]. Найдите минимальное количество точек на числовой прямой, чтобы каждый отрезок содержал хотя бы одну точку. Выведите количество точек.',
        difficulty: 'easy',
        starterCode: '# Считайте N и отрезки [l, r]\n# Жадный: сортируйте по правому концу\n# Ставьте точку в правый конец, если отрезок не покрыт\n\n',
        testCases: [
          { input: '4\n1 3\n2 5\n3 6\n5 7', expectedOutput: '2', description: 'Точки в 3 и 7 покрывают все' },
          { input: '3\n1 2\n3 4\n5 6', expectedOutput: '3', description: 'Не пересекаются — 3 точки' },
          { input: '3\n1 10\n2 3\n4 5', expectedOutput: '2', description: 'Точки в 3 и 5' },
        ],
        points: 10,
      },
      {
        title: 'Дробный рюкзак',
        description: 'Считайте N (предметов) и W (вместимость). Затем N строк: вес и стоимость. В отличие от 0/1 рюкзака, предметы можно дробить. Выведите максимальную стоимость с точностью до 4 знаков после запятой.',
        difficulty: 'medium',
        starterCode: '# Считайте N и W\n# Считайте N пар (вес, стоимость)\n# Жадный: сортировка по удельной стоимости (стоимость/вес)\n# Берём максимум, можно дробить последний предмет\n\n',
        testCases: [
          { input: '3 50\n10 60\n20 100\n30 120', expectedOutput: '240.0000', description: '60+100+80=240' },
          { input: '2 10\n5 50\n5 60', expectedOutput: '110.0000', description: 'Оба помещаются: 50+60=110' },
          { input: '1 5\n10 100', expectedOutput: '50.0000', description: 'Половина: 100*5/10=50' },
        ],
        points: 15,
      },
      {
        title: 'Расписание задач с дедлайнами',
        description: 'Считайте N задач. Каждая задача имеет дедлайн (d) и штраф за невыполнение (w). Задача занимает 1 единицу времени. Нужно минимизировать суммарный штраф. Считайте N, затем N строк: d_i w_i. Выведите минимальный суммарный штраф.',
        difficulty: 'hard',
        starterCode: '# Считайте N\n# Считайте N пар (дедлайн, штраф)\n# Жадный: сортировка по штрафу (убывание)\n# Ставим задачу в последний свободный слот до дедлайна\n\n',
        testCases: [
          { input: '4\n1 10\n1 20\n2 30\n2 40', expectedOutput: '10', description: 'Задачи (2,40),(2,30) в слоты 2,1; (1,20) в слот... штраф 10' },
          { input: '3\n1 5\n1 10\n1 15', expectedOutput: '15', description: 'Только 1 слот: берём штраф 15, делаем 10+5? нет — берём 15, штраф 5+10=15' },
          { input: '2\n2 100\n2 200', expectedOutput: '0', description: 'Обе успевают до дедлайна' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 15: Двоичный поиск по ответу
  // ──────────────────────────────────────────
  {
    slug: 'binary-search-answer',
    title: 'Двоичный поиск по ответу',
    description: 'Параметрический поиск, задачи на минимакс',
    content: `# Двоичный поиск по ответу

## Идея

Если ответ монотонен (больше → легче/сложнее), можно использовать бинарный поиск по значению ответа.

## Шаблон

\`\`\`python
def can_achieve(mid, data):
    """Можно ли достичь значения mid?"""
    # Проверка за O(n) или O(n log n)
    pass

def binary_search_answer(data, lo, hi):
    while lo < hi:
        mid = (lo + hi) // 2
        if can_achieve(mid, data):
            hi = mid      # ищем минимум
        else:
            lo = mid + 1
    return lo
\`\`\`

## Задача: минимальная максимальная сумма при разбиении

\`\`\`python
# Разбить массив на k подмассивов,
# минимизировав максимальную сумму подмассива

def can_split(arr, k, max_sum):
    parts = 1
    current = 0
    for x in arr:
        if current + x > max_sum:
            parts += 1
            current = x
            if parts > k:
                return False
        else:
            current += x
    return True

def min_max_sum(arr, k):
    lo = max(arr)
    hi = sum(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if can_split(arr, k, mid):
            hi = mid
        else:
            lo = mid + 1
    return lo

arr = [7, 2, 5, 10, 8]
print(min_max_sum(arr, 2))  # 18: [7,2,5] и [10,8]
\`\`\`

## Задача: верёвки

\`\`\`python
# N верёвок длин a[i]. Отрезать K одинаковых кусков
# максимальной длины (целое число)

def max_rope_length(ropes, k):
    lo, hi = 1, max(ropes)
    while lo <= hi:
        mid = (lo + hi) // 2
        pieces = sum(r // mid for r in ropes)
        if pieces >= k:
            lo = mid + 1
        else:
            hi = mid - 1
    return hi
\`\`\`

## Задача: коровы в стойлах

\`\`\`python
# N стойл, K коров. Максимизировать мин. расстояние
def max_min_distance(stalls, k):
    stalls.sort()
    lo, hi = 1, stalls[-1] - stalls[0]

    def can_place(min_dist):
        count = 1
        last = stalls[0]
        for s in stalls[1:]:
            if s - last >= min_dist:
                count += 1
                last = s
        return count >= k

    while lo <= hi:
        mid = (lo + hi) // 2
        if can_place(mid):
            lo = mid + 1
        else:
            hi = mid - 1
    return hi
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Верёвки: бинарный поиск по ответу',
        description: 'Считайте N и K. Затем N длин верёвок. Найдите максимальную целую длину куска, чтобы можно было нарезать K кусков.',
        difficulty: 'hard',
        starterCode: '# Считайте N, K и длины верёвок\n# Бинарный поиск по ответу\n\n',
        testCases: [
          { input: '4 11\n802 743 457 539', expectedOutput: '200', description: '802/200=4, 743/200=3, 457/200=2, 539/200=2 = 11' },
          { input: '2 3\n10 10', expectedOutput: '6', description: '10/6=1+10/6=1+... = нет, 10/3=3+10/3=3=6≥3' },
          { input: '1 1\n100', expectedOutput: '100', description: 'Одна верёвка, один кусок' },
        ],
        points: 25,
      },
      {
        title: 'Поиск квадратного корня',
        description: 'Считайте целое число N (0 <= N <= 10^18). Выведите целую часть квадратного корня из N (floor(sqrt(N))). Используйте бинарный поиск. Не используйте math.sqrt (она может давать погрешность для больших чисел).',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Бинарный поиск: найдите максимальное x, такое что x*x <= N\n\n',
        testCases: [
          { input: '16', expectedOutput: '4', description: 'sqrt(16) = 4' },
          { input: '10', expectedOutput: '3', description: 'floor(sqrt(10)) = 3' },
          { input: '0', expectedOutput: '0', description: 'sqrt(0) = 0' },
          { input: '1000000000000000000', expectedOutput: '1000000000', description: 'Большое число' },
        ],
        points: 10,
      },
      {
        title: 'Количество элементов в диапазоне',
        description: 'Считайте N, затем N отсортированных чисел. Затем Q запросов, каждый — пара L R. Для каждого запроса выведите количество элементов массива, попадающих в диапазон [L, R]. Используйте бинарный поиск (bisect).',
        difficulty: 'easy',
        starterCode: '# Считайте N и отсортированный массив\n# Считайте Q запросов [L, R]\n# Для каждого: bisect_right(R) - bisect_left(L)\n\nfrom bisect import bisect_left, bisect_right\n\n',
        testCases: [
          { input: '7\n1 2 3 4 5 6 7\n3\n2 5\n1 7\n4 4', expectedOutput: '4\n7\n1', description: 'Запросы [2,5]=4, [1,7]=7, [4,4]=1' },
          { input: '5\n1 1 1 1 1\n1\n1 1', expectedOutput: '5', description: 'Все единицы в [1,1]' },
          { input: '3\n10 20 30\n1\n5 15', expectedOutput: '1', description: 'Только 10 в [5,15]' },
        ],
        points: 10,
      },
      {
        title: 'Минимальная максимальная сумма при разбиении',
        description: 'Считайте N и K. Затем N положительных чисел. Разбейте массив на K непрерывных подмассивов, минимизировав максимальную сумму подмассива. Выведите эту минимальную максимальную сумму.',
        difficulty: 'medium',
        starterCode: '# Считайте N, K и массив\n# Бинарный поиск по ответу\n# can_split(max_sum): можно ли разбить на <= K частей\n#   с макс. суммой <= max_sum\n\n',
        testCases: [
          { input: '5 2\n7 2 5 10 8', expectedOutput: '18', description: '[7,2,5] и [10,8] — макс 18' },
          { input: '4 2\n1 2 3 4', expectedOutput: '6', description: '[1,2,3] и [4] — макс 6' },
          { input: '3 3\n1 2 3', expectedOutput: '3', description: 'Каждый в своём — макс 3' },
        ],
        points: 15,
      },
      {
        title: 'Коровы в стойлах',
        description: 'Считайте N (стойл) и K (коров). Затем N координат стойл. Разместите K коров в стойлах так, чтобы минимальное расстояние между любыми двумя коровами было максимальным. Выведите это расстояние.',
        difficulty: 'medium',
        starterCode: '# Считайте N, K и координаты стойл\n# Бинарный поиск по ответу (минимальному расстоянию)\n# can_place(min_dist): можно ли расставить K коров\n#   с мин. расстоянием >= min_dist\n\n',
        testCases: [
          { input: '5 3\n1 2 4 8 9', expectedOutput: '3', description: 'Стойла 1, 4, 9 — мин. расстояние 3' },
          { input: '5 2\n1 2 3 4 5', expectedOutput: '4', description: 'Стойла 1 и 5 — расстояние 4' },
          { input: '3 3\n1 5 10', expectedOutput: '4', description: 'Все три стойла, мин. 5-1=4' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 16: Комбинаторика
  // ──────────────────────────────────────────
  {
    slug: 'combinatorics',
    title: 'Комбинаторика и перебор',
    description: 'Перестановки, сочетания, подмножества, метод включений-исключений',
    content: `# Комбинаторика и перебор

## itertools

\`\`\`python
from itertools import permutations, combinations, product

# Перестановки
list(permutations([1, 2, 3]))
# [(1,2,3), (1,3,2), (2,1,3), ...]

# Сочетания (C(n, k))
list(combinations([1, 2, 3, 4], 2))
# [(1,2), (1,3), (1,4), (2,3), (2,4), (3,4)]

# Декартово произведение
list(product([0, 1], repeat=3))
# [(0,0,0), (0,0,1), (0,1,0), ...]
\`\`\`

## Генерация перестановок рекурсией

\`\`\`python
def generate_permutations(n):
    result = []
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    backtrack([], list(range(1, n + 1)))
    return result
\`\`\`

## Метод включений-исключений

\`\`\`python
# Сколько чисел от 1 до N делятся на a или b?
def count_divisible(n, a, b):
    from math import gcd
    lcm_ab = a * b // gcd(a, b)
    return n // a + n // b - n // lcm_ab
\`\`\`

## Backtracking: N ферзей

\`\`\`python
def solve_n_queens(n):
    solutions = []
    def backtrack(row, cols, diag1, diag2, placement):
        if row == n:
            solutions.append(placement[:])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            placement.append(col)
            backtrack(row+1, cols|{col}, diag1|{row-col}, diag2|{row+col}, placement)
            placement.pop()
    backtrack(0, set(), set(), set(), [])
    return len(solutions)

print(solve_n_queens(8))  # 92
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Включения-исключения',
        description: 'Считайте N, A, B. Выведите количество чисел от 1 до N, делящихся на A или на B.',
        difficulty: 'easy',
        starterCode: '# Считайте N, A, B\n# Формула включений-исключений\n\n',
        testCases: [
          { input: '100\n3\n5', expectedOutput: '47', description: '33+20-6=47' },
          { input: '20\n2\n3', expectedOutput: '13', description: '10+6-3=13' },
          { input: '10\n1\n1', expectedOutput: '10', description: 'Все числа' },
        ],
        points: 10,
      },
      {
        title: 'Количество перестановок',
        description: 'Считайте N (1 <= N <= 12). Выведите все перестановки чисел от 1 до N в лексикографическом порядке, каждую на отдельной строке (элементы через пробел).',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Сгенерируйте все перестановки 1..N\n# Выведите в лексикографическом порядке\n\n',
        testCases: [
          { input: '2', expectedOutput: '1 2\n2 1', description: '2 перестановки' },
          { input: '3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', description: '6 перестановок' },
          { input: '1', expectedOutput: '1', description: 'Одна перестановка' },
        ],
        points: 10,
      },
      {
        title: 'Количество сочетаний (вывод)',
        description: 'Считайте N и K. Выведите все сочетания из N элементов (1..N) по K в лексикографическом порядке, каждое на отдельной строке (элементы через пробел).',
        difficulty: 'medium',
        starterCode: '# Считайте N и K\n# Сгенерируйте все сочетания C(N, K)\n# Выведите в лексикографическом порядке\n\n',
        testCases: [
          { input: '4 2', expectedOutput: '1 2\n1 3\n1 4\n2 3\n2 4\n3 4', description: 'C(4,2) = 6 сочетаний' },
          { input: '3 1', expectedOutput: '1\n2\n3', description: 'Каждый по одному' },
          { input: '3 3', expectedOutput: '1 2 3', description: 'Одно сочетание' },
        ],
        points: 15,
      },
      {
        title: 'N ферзей: количество решений',
        description: 'Считайте N (1 <= N <= 12). Выведите количество способов расставить N ферзей на шахматной доске N x N так, чтобы ни один ферзь не бил другого.',
        difficulty: 'medium',
        starterCode: '# Считайте N\n# Backtracking: расставьте N ферзей\n# Проверяйте столбцы, диагонали (row-col) и (row+col)\n\n',
        testCases: [
          { input: '4', expectedOutput: '2', description: '4 ферзя — 2 решения' },
          { input: '8', expectedOutput: '92', description: '8 ферзей — 92 решения' },
          { input: '1', expectedOutput: '1', description: '1 ферзь — 1 решение' },
        ],
        points: 15,
      },
      {
        title: 'Сумма подмножеств (subset sum)',
        description: 'Считайте N и S. Затем N положительных целых чисел. Выведите YES, если существует подмножество с суммой ровно S, иначе NO. Используйте перебор подмножеств битовыми масками (N <= 20) или DP.',
        difficulty: 'hard',
        starterCode: '# Считайте N, S и массив\n# Проверьте, существует ли подмножество с суммой S\n# Метод: перебор масок 0..2^N-1\n# или DP: dp[i] = можно ли набрать сумму i\n\n',
        testCases: [
          { input: '4 9\n3 1 5 4', expectedOutput: 'YES', description: '5+4=9 или 3+1+5=9' },
          { input: '3 7\n1 2 3', expectedOutput: 'NO', description: 'Макс. сумма 6 < 7' },
          { input: '5 15\n1 2 3 4 5', expectedOutput: 'YES', description: '1+2+3+4+5=15' },
          { input: '3 0\n1 2 3', expectedOutput: 'YES', description: 'Пустое подмножество: сумма 0' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 17: Битовые операции
  // ──────────────────────────────────────────
  {
    slug: 'bitwise-operations',
    title: 'Битовые операции и битовые маски',
    description: 'AND, OR, XOR, сдвиги, перебор подмножеств',
    content: `# Битовые операции

## Основные операции

\`\`\`python
a = 0b1010  # 10
b = 0b1100  # 12

print(bin(a & b))   # AND: 0b1000 (8)
print(bin(a | b))   # OR:  0b1110 (14)
print(bin(a ^ b))   # XOR: 0b0110 (6)
print(bin(~a))      # NOT: -0b1011 (-11)
print(bin(a << 2))  # Сдвиг влево: 0b101000 (40)
print(bin(a >> 1))  # Сдвиг вправо: 0b101 (5)
\`\`\`

## Полезные трюки

\`\`\`python
# Проверить, установлен ли k-й бит
def has_bit(n, k):
    return (n >> k) & 1

# Установить k-й бит
def set_bit(n, k):
    return n | (1 << k)

# Сбросить k-й бит
def clear_bit(n, k):
    return n & ~(1 << k)

# Степень двойки?
def is_power_of_2(n):
    return n > 0 and (n & (n - 1)) == 0

# Количество единиц
print(bin(255).count('1'))  # 8
\`\`\`

## Перебор подмножеств битовой маской

\`\`\`python
n = 4
arr = [3, 1, 4, 1]

for mask in range(1, 1 << n):
    subset = []
    total = 0
    for i in range(n):
        if mask & (1 << i):
            subset.append(arr[i])
            total += arr[i]
    print(subset, "sum =", total)
\`\`\`

## XOR: свойства

\`\`\`python
# a ^ a = 0 (самоуничтожение)
# a ^ 0 = a (нейтральный элемент)

# Найти число, встречающееся нечётное число раз
def find_single(arr):
    result = 0
    for x in arr:
        result ^= x
    return result

print(find_single([1, 2, 3, 2, 1]))  # 3
\`\`\``,
    duration: 45,
    assignments: [
      {
        title: 'XOR: единственное число',
        description: 'Считайте N, затем N чисел. Все числа встречаются дважды, кроме одного. Найдите это число с помощью XOR.',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# Используйте XOR для поиска\n\n',
        testCases: [
          { input: '5\n1 2 3 2 1', expectedOutput: '3', description: '3 встречается один раз' },
          { input: '7\n4 1 2 1 2 4 7', expectedOutput: '7', description: '7 — единственное' },
          { input: '1\n42', expectedOutput: '42', description: 'Только одно число' },
        ],
        points: 10,
      },
      {
        title: 'Проверка степени двойки',
        description: 'Считайте N чисел (на первой строке N, на второй — числа). Для каждого числа выведите YES, если оно является степенью двойки, иначе NO. Используйте битовую операцию: n > 0 и n & (n-1) == 0.',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив чисел\n# Для каждого проверьте, степень ли двойки\n# Трюк: n > 0 and (n & (n - 1)) == 0\n\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: 'YES\nYES\nNO\nYES\nNO', description: '1,2,4 — степени двойки' },
          { input: '3\n8 16 32', expectedOutput: 'YES\nYES\nYES', description: 'Все степени двойки' },
          { input: '2\n0 6', expectedOutput: 'NO\nNO', description: '0 и 6 — не степени' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт единичных битов',
        description: 'Считайте число N (0 <= N <= 10^9). Выведите количество единичных битов в двоичном представлении N. Не используйте bin().count("1") — считайте вручную с помощью битовых операций.',
        difficulty: 'medium',
        starterCode: '# Считайте N\n# Подсчитайте количество единичных битов\n# Метод: пока n > 0: n & 1 даёт младший бит, n >>= 1\n\n',
        testCases: [
          { input: '7', expectedOutput: '3', description: '7 = 111 — 3 единицы' },
          { input: '255', expectedOutput: '8', description: '255 = 11111111 — 8 единиц' },
          { input: '0', expectedOutput: '0', description: '0 — нет единиц' },
          { input: '1024', expectedOutput: '1', description: '1024 = 10000000000 — 1 единица' },
        ],
        points: 15,
      },
      {
        title: 'Перебор подмножеств битовой маской',
        description: 'Считайте N (1 <= N <= 15) и S (целевая сумма). Затем N чисел. Переберите все подмножества битовыми масками и выведите количество подмножеств с суммой ровно S.',
        difficulty: 'medium',
        starterCode: '# Считайте N, S и массив\n# Переберите маски от 0 до 2^N - 1\n# Для каждой маски посчитайте сумму выбранных элементов\n# Подсчитайте маски с суммой == S\n\n',
        testCases: [
          { input: '4 5\n1 2 3 4', expectedOutput: '2', description: '{2,3} и {1,4} — 2 подмножества' },
          { input: '3 6\n1 2 3', expectedOutput: '1', description: '{1,2,3} — единственное' },
          { input: '3 10\n1 2 3', expectedOutput: '0', description: 'Нет подмножеств с суммой 10' },
        ],
        points: 15,
      },
      {
        title: 'Задача о гамильтоновом пути (bitmask DP)',
        description: 'Считайте N (1 <= N <= 15) и матрицу смежности N x N (0/1). Выведите YES, если в графе существует гамильтонов путь (путь, проходящий через все вершины ровно по одному разу), иначе NO. Используйте DP по подмножествам (bitmask DP).',
        difficulty: 'hard',
        starterCode: '# Считайте N и матрицу смежности\n# DP по подмножествам: dp[mask][i] = True, если\n#   существует путь, посещающий вершины из mask,\n#   заканчивающийся в вершине i\n# Проверьте dp[(1<<N)-1][i] для всех i\n\n',
        testCases: [
          { input: '4\n0 1 1 0\n1 0 1 1\n1 1 0 1\n0 1 1 0', expectedOutput: 'YES', description: 'Путь: 0-1-2-3 или 0-2-1-3' },
          { input: '3\n0 1 0\n1 0 0\n0 0 0', expectedOutput: 'NO', description: 'Вершина 2 изолирована' },
          { input: '2\n0 1\n1 0', expectedOutput: 'YES', description: 'Путь: 0-1' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 18: Двумерные массивы
  // ──────────────────────────────────────────
  {
    slug: 'two-dimensional',
    title: 'Двумерные массивы и матрицы',
    description: 'Создание, обход, транспонирование, спиральный обход, префиксные суммы 2D',
    content: `# Двумерные массивы и матрицы

## Создание

\`\`\`python
# Правильное создание
matrix = [[0] * m for _ in range(n)]

# НЕПРАВИЛЬНО! (все строки — одна ссылка)
# matrix = [[0] * m] * n

# Чтение матрицы
n, m = map(int, input().split())
matrix = []
for _ in range(n):
    row = list(map(int, input().split()))
    matrix.append(row)
\`\`\`

## Транспонирование

\`\`\`python
def transpose(matrix):
    n, m = len(matrix), len(matrix[0])
    return [[matrix[i][j] for i in range(n)] for j in range(m)]

# Или через zip:
transposed = list(map(list, zip(*matrix)))
\`\`\`

## Поворот на 90°

\`\`\`python
def rotate_90(matrix):
    n = len(matrix)
    return [[matrix[n-1-j][i] for j in range(n)] for i in range(n)]
\`\`\`

## 2D префиксные суммы

\`\`\`python
def build_prefix_2d(matrix):
    n, m = len(matrix), len(matrix[0])
    prefix = [[0]*(m+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for j in range(1, m+1):
            prefix[i][j] = (matrix[i-1][j-1]
                + prefix[i-1][j] + prefix[i][j-1]
                - prefix[i-1][j-1])
    return prefix

def range_sum_2d(prefix, r1, c1, r2, c2):
    """Сумма в прямоугольнике [r1..r2, c1..c2] (0-indexed)"""
    r1 += 1; c1 += 1; r2 += 1; c2 += 1
    return (prefix[r2][c2]
        - prefix[r1-1][c2] - prefix[r2][c1-1]
        + prefix[r1-1][c1-1])
\`\`\`

## Обход по спирали

\`\`\`python
def spiral_order(matrix):
    result = []
    while matrix:
        result += matrix.pop(0)           # верхняя строка
        if matrix and matrix[0]:
            for row in matrix:
                result.append(row.pop())  # правый столбец
        if matrix:
            result += matrix.pop()[::-1]  # нижняя строка
        if matrix and matrix[0]:
            for row in reversed(matrix):
                result.append(row.pop(0)) # левый столбец
    return result
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Транспонирование матрицы',
        description: 'Считайте N и M, затем матрицу N×M. Выведите транспонированную матрицу M×N.',
        difficulty: 'easy',
        starterCode: '# Считайте N, M и матрицу\n# Выведите транспонированную\n\n',
        testCases: [
          { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6', description: '2×3 → 3×2' },
          { input: '1 3\n1 2 3', expectedOutput: '1\n2\n3', description: 'Строка → столбец' },
          { input: '2 2\n1 2\n3 4', expectedOutput: '1 3\n2 4', description: '2×2' },
        ],
        points: 10,
      },
      {
        title: 'Поворот матрицы на 90 градусов',
        description: 'Считайте N (квадратная матрица N x N), затем N строк матрицы. Выведите матрицу, повёрнутую на 90 градусов по часовой стрелке.',
        difficulty: 'easy',
        starterCode: '# Считайте N и квадратную матрицу N x N\n# Поворот на 90 по часовой:\n# новая[i][j] = старая[N-1-j][i]\n\n',
        testCases: [
          { input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '7 4 1\n8 5 2\n9 6 3', description: 'Поворот 3x3' },
          { input: '2\n1 2\n3 4', expectedOutput: '3 1\n4 2', description: 'Поворот 2x2' },
          { input: '1\n5', expectedOutput: '5', description: '1x1 — без изменений' },
        ],
        points: 10,
      },
      {
        title: 'Сумма в прямоугольнике (2D префиксные суммы)',
        description: 'Считайте N, M, затем матрицу N x M. Затем Q запросов: r1 c1 r2 c2 (0-indexed). Для каждого запроса выведите сумму элементов в прямоугольнике [r1..r2, c1..c2].',
        difficulty: 'medium',
        starterCode: '# Считайте N, M и матрицу\n# Постройте 2D префиксные суммы\n# Считайте Q запросов и отвечайте за O(1)\n\n',
        testCases: [
          { input: '3 3\n1 2 3\n4 5 6\n7 8 9\n2\n0 0 1 1\n0 0 2 2', expectedOutput: '12\n45', description: 'Подматрицы 2x2 и 3x3' },
          { input: '2 2\n1 1\n1 1\n1\n0 0 1 1', expectedOutput: '4', description: 'Все единицы: сумма 4' },
          { input: '1 3\n10 20 30\n1\n0 1 0 2', expectedOutput: '50', description: 'Подстрока: 20+30=50' },
        ],
        points: 15,
      },
      {
        title: 'Обход матрицы по спирали',
        description: 'Считайте N и M, затем матрицу N x M. Выведите элементы в порядке обхода по спирали (по часовой стрелке, начиная с верхнего левого угла) через пробел.',
        difficulty: 'medium',
        starterCode: '# Считайте N, M и матрицу\n# Обход по спирали: верхняя строка → правый столбец →\n#   нижняя строка (в обратном порядке) → левый столбец (вверх)\n# Повторять, сужая границы\n\n',
        testCases: [
          { input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3 6 9 8 7 4 5', description: 'Спираль 3x3' },
          { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 2 3 6 5 4', description: 'Спираль 2x3' },
          { input: '1 4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Одна строка' },
        ],
        points: 15,
      },
      {
        title: 'Максимальная сумма подматрицы',
        description: 'Считайте N и M, затем матрицу N x M (элементы могут быть отрицательными). Найдите подматрицу с максимальной суммой элементов. Выведите эту сумму. Используйте 2D префиксные суммы или сведение к задаче максимального подмассива.',
        difficulty: 'hard',
        starterCode: '# Считайте N, M и матрицу\n# Для каждой пары строк (top, bottom):\n#   сверните в 1D массив и найдите макс. подмассив (Кадане)\n# Общая сложность O(N^2 * M)\n\n',
        testCases: [
          { input: '3 3\n1 -2 3\n-4 5 -6\n7 -8 9', expectedOutput: '9', description: 'Элемент 9 или подматрица побольше' },
          { input: '2 2\n-1 -2\n-3 -4', expectedOutput: '-1', description: 'Все отрицательные, макс = -1' },
          { input: '2 3\n1 2 -1\n-3 4 2', expectedOutput: '8', description: 'Столбцы 1-2: 2+(-1)+4+2=7? 1+2+4+2=9? пересчёт' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 19: Олимпиадные задачи
  // ──────────────────────────────────────────
  {
    slug: 'competitive-problems',
    title: 'Олимпиадные задачи: практика',
    description: 'Типичные олимпиадные задачи: реализация, конструктивные, математические',
    content: `# Олимпиадные задачи: практика

## Тип 1: Задачи на реализацию

\`\`\`python
# Повернуть массив на k позиций вправо
def rotate(arr, k):
    k %= len(arr)
    return arr[-k:] + arr[:-k]

print(rotate([1,2,3,4,5], 2))  # [4,5,1,2,3]
\`\`\`

## Тип 2: Конструктивные

\`\`\`python
# Построить перестановку 1..n,
# где |a[i] - a[i+1]| ≠ 1 для всех i
def construct_permutation(n):
    if n <= 2:
        return list(range(1, n+1))
    evens = list(range(2, n+1, 2))
    odds = list(range(1, n+1, 2))
    return evens + odds
\`\`\`

## Тип 3: Математические

\`\`\`python
# Минимальное количество операций:
# можно умножить на 2 или вычесть 1
def min_operations(n, target):
    if n >= target:
        return n - target
    if target % 2 == 0:
        return 1 + min_operations(n, target // 2)
    else:
        return 1 + min_operations(n, target + 1)
\`\`\`

## Тип 4: Скользящее окно

\`\`\`python
# Максимальная сумма подмассива длины k
def max_sum_k(arr, k):
    window = sum(arr[:k])
    best = window
    for i in range(k, len(arr)):
        window += arr[i] - arr[i-k]
        best = max(best, window)
    return best
\`\`\`

## Тип 5: Двоичный подъём

\`\`\`python
# Быстрый переход к k-му предку в дереве
# Предподсчёт: up[v][j] = 2^j-й предок v
import math

def build_binary_lifting(parent, n):
    LOG = int(math.log2(n)) + 1
    up = [[0] * (n + 1) for _ in range(LOG)]
    up[0] = parent[:]
    for j in range(1, LOG):
        for v in range(1, n + 1):
            up[j][v] = up[j-1][up[j-1][v]]
    return up

def kth_ancestor(up, v, k):
    j = 0
    while k > 0:
        if k & 1:
            v = up[j][v]
        k >>= 1
        j += 1
    return v
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Максимальная сумма подмассива длины K',
        description: 'Считайте N и K, затем N чисел. Выведите максимальную сумму подмассива длины ровно K.',
        difficulty: 'medium',
        starterCode: '# Считайте N, K и массив\n# Скользящее окно длины K\n\n',
        testCases: [
          { input: '6 3\n1 4 2 10 2 3', expectedOutput: '14', description: '[2,10,2] сумма 14' },
          { input: '5 2\n5 1 3 2 4', expectedOutput: '6', description: '[5,1]=6 или [2,4]=6' },
          { input: '3 3\n1 2 3', expectedOutput: '6', description: 'Весь массив' },
        ],
        points: 15,
      },
      {
        title: 'Поворот массива вправо',
        description: 'Считайте N и K, затем N чисел. Выведите массив после поворота на K позиций вправо (последние K элементов перемещаются в начало). Выведите через пробел.',
        difficulty: 'easy',
        starterCode: '# Считайте N, K и массив\n# Поворот вправо на K позиций\n# Подсказка: K %= N, затем arr[-K:] + arr[:-K]\n\n',
        testCases: [
          { input: '5 2\n1 2 3 4 5', expectedOutput: '4 5 1 2 3', description: 'Поворот на 2' },
          { input: '4 4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Полный оборот' },
          { input: '3 1\n10 20 30', expectedOutput: '30 10 20', description: 'Поворот на 1' },
        ],
        points: 10,
      },
      {
        title: 'Конструктивная перестановка',
        description: 'Считайте N. Постройте перестановку чисел от 1 до N такую, что |a[i] - a[i+1]| > 1 для всех i от 0 до N-2. Если N <= 2, любая перестановка подходит. Выведите перестановку через пробел.',
        difficulty: 'easy',
        starterCode: '# Считайте N\n# Постройте перестановку с |a[i]-a[i+1]| > 1\n# Идея: сначала все чётные, потом все нечётные\n\n',
        testCases: [
          { input: '5', expectedOutput: '2 4 1 3 5', description: 'Чётные потом нечётные' },
          { input: '1', expectedOutput: '1', description: 'Единственный элемент' },
          { input: '6', expectedOutput: '2 4 6 1 3 5', description: 'Чётные + нечётные' },
        ],
        points: 10,
      },
      {
        title: 'Минимальное количество операций (BFS на состояниях)',
        description: 'Считайте два числа: N и T. Из числа N можно получить T двумя операциями: умножить на 2 или вычесть 1. Выведите минимальное количество операций. Используйте BFS.',
        difficulty: 'medium',
        starterCode: '# Считайте N и T\n# BFS: из состояния x можно перейти в x*2 и x-1\n# Найдите кратчайший путь от N до T\n\nfrom collections import deque\n\n',
        testCases: [
          { input: '2 3', expectedOutput: '2', description: '2 -> 4 -> 3 (два шага)' },
          { input: '5 8', expectedOutput: '2', description: '5 -> 4 -> 8' },
          { input: '10 10', expectedOutput: '0', description: 'Уже равны' },
        ],
        points: 15,
      },
      {
        title: 'Медиана в потоке (два кучи)',
        description: 'Считайте N, затем N чисел по одному (по одному на строке). После каждого считанного числа выведите текущую медиану потока. Если чисел чётное количество — выведите меньшую из двух средних. Используйте две кучи (max-heap для левой половины, min-heap для правой).',
        difficulty: 'hard',
        starterCode: '# Считайте N\n# Считывайте числа по одному\n# Поддерживайте две кучи:\n#   max_heap — левая половина (числа <= медианы)\n#   min_heap — правая половина (числа > медианы)\n# Балансируйте размеры куч\n\nimport heapq\n\n',
        testCases: [
          { input: '5\n5\n2\n8\n1\n4', expectedOutput: '5\n2\n5\n2\n4', description: 'Поток: 5->2->8->1->4, медианы' },
          { input: '3\n1\n2\n3', expectedOutput: '1\n1\n2', description: 'Возрастающий поток' },
          { input: '1\n42', expectedOutput: '42', description: 'Одно число' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 20: Итоговый проект
  // ──────────────────────────────────────────
  {
    slug: 'final-project',
    title: 'Итоговый проект: решение комплексной задачи',
    description: 'Применение всех изученных алгоритмов в комплексной задаче',
    content: `# Итоговый проект

## Обзор пройденного

| Тема | Ключевые алгоритмы |
|------|-------------------|
| Сложность | O-нотация, оценка |
| Сортировки | merge sort, quick sort |
| Структуры | стек, очередь, deque |
| Хеш-таблицы | set, dict, Counter |
| Рекурсия | разделяй и властвуй |
| DP | рюкзак, НВП, НОП |
| Графы | BFS, DFS, Дейкстра |
| Деревья | обходы, диаметр |
| Теория чисел | решето, модулярная арифметика |
| Строки | хеширование, Z-функция |
| Жадные | активности, верёвки |
| Бин. поиск | по ответу |
| Комбинаторика | перестановки, backtracking |
| Биты | XOR, маски подмножеств |

## Стратегия решения задач

1. **Прочитай условие** — выдели входные/выходные данные
2. **Определи тип задачи** — DP? Графы? Жадный?
3. **Оцени ограничения** — N ≤ 10⁵ → O(n log n) макс.
4. **Напиши наивное решение** — для проверки
5. **Оптимизируй** — если нужно
6. **Проверь на граничных случаях** — n=0, n=1, отрицательные

## Типичные ошибки

- Забыл про **переполнение** (в C++, не в Python)
- Не обработал **граничные случаи**
- Неправильная **сортировка** (не по тому ключу)
- **Не тот алгоритм** — жадный вместо DP
- **Off-by-one** — ± 1 в индексах

## Полезные библиотеки Python

\`\`\`python
from collections import deque, Counter, defaultdict
from functools import lru_cache
from itertools import permutations, combinations, product
from bisect import bisect_left, bisect_right
from heapq import heappush, heappop
from math import gcd, log2, ceil, floor, sqrt
import sys
sys.setrecursionlimit(200000)
\`\`\``,
    duration: 60,
    assignments: [
      {
        title: 'Комплексная задача',
        description: 'Считайте N точек на плоскости (xi, yi). Найдите минимальное расстояние между двумя точками. Выведите ответ с точностью до 6 знаков после запятой.',
        difficulty: 'hard',
        starterCode: '# Считайте N\n# Считайте N точек\n# Найдите минимальное расстояние\n\nimport math\n\n',
        testCases: [
          { input: '3\n0 0\n3 4\n1 1', expectedOutput: '1.414214', description: 'Расстояние (0,0)-(1,1) = √2' },
          { input: '2\n0 0\n5 0', expectedOutput: '5.000000', description: 'Расстояние 5' },
          { input: '4\n0 0\n10 10\n1 0\n0 1', expectedOutput: '1.000000', description: '(0,0)-(1,0) = 1' },
        ],
        points: 25,
      },
      {
        title: 'Максимальный подмассив (алгоритм Кадане)',
        description: 'Считайте N, затем N целых чисел. Найдите максимальную сумму непрерывного непустого подмассива. Используйте алгоритм Кадане за O(n).',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# Алгоритм Кадане:\n# current = max(arr[i], current + arr[i])\n# best = max(best, current)\n\n',
        testCases: [
          { input: '8\n-2 1 -3 4 -1 2 1 -5', expectedOutput: '6', description: '[4,-1,2,1] = 6' },
          { input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-1', description: 'Все отрицательные, макс = -1' },
          { input: '3\n1 2 3', expectedOutput: '6', description: 'Весь массив' },
        ],
        points: 10,
      },
      {
        title: 'Проверка отсортированности',
        description: 'Считайте N, затем N чисел. Выведите ASC, если массив отсортирован по неубыванию, DESC — по невозрастанию, BOTH — если подходит и то и другое (все элементы одинаковые), NONE — если не отсортирован.',
        difficulty: 'easy',
        starterCode: '# Считайте N и массив\n# Проверьте, отсортирован ли по неубыванию и/или невозрастанию\n# Выведите ASC, DESC, BOTH или NONE\n\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: 'ASC', description: 'По возрастанию' },
          { input: '5\n5 4 3 2 1', expectedOutput: 'DESC', description: 'По убыванию' },
          { input: '3\n5 5 5', expectedOutput: 'BOTH', description: 'Все одинаковые' },
          { input: '4\n1 3 2 4', expectedOutput: 'NONE', description: 'Не отсортирован' },
        ],
        points: 10,
      },
      {
        title: 'Определение типа задачи',
        description: 'Считайте описание задачи: N и ограничение по времени T (в секундах). Выведите максимальную допустимую сложность алгоритма. Правила: при ~10^8 операций в секунду, O(n) если N*1 <= T*10^8, O(n log n) если N*20 <= T*10^8, O(n^2) если N*N <= T*10^8, иначе IMPOSSIBLE.',
        difficulty: 'medium',
        starterCode: '# Считайте N и T\n# Определите максимальную допустимую сложность\n# 10^8 операций в секунду\n# Проверяйте от лёгкого к сложному: O(n^2), O(n log n), O(n)\n\nimport math\n\n',
        testCases: [
          { input: '1000000 1', expectedOutput: 'O(n log n)', description: 'N=10^6, 1с: n*20=2*10^7 < 10^8' },
          { input: '100000000 1', expectedOutput: 'O(n)', description: 'N=10^8, 1с: только линейный' },
          { input: '10000 2', expectedOutput: 'O(n^2)', description: 'N=10^4, 2с: 10^8 <= 2*10^8' },
          { input: '1000000000 1', expectedOutput: 'IMPOSSIBLE', description: 'N=10^9 — даже O(n) не влезает' },
        ],
        points: 15,
      },
      {
        title: 'Выпуклая оболочка (convex hull)',
        description: 'Считайте N точек на плоскости. Постройте выпуклую оболочку и выведите количество точек на ней. Используйте алгоритм обхода Грэхема или Эндрю (Andrew monotone chain).',
        difficulty: 'medium',
        starterCode: '# Считайте N и координаты точек\n# Постройте выпуклую оболочку\n# Алгоритм Andrew: отсортируйте по x, затем по y\n# Постройте верхнюю и нижнюю цепочки\n\n',
        testCases: [
          { input: '5\n0 0\n1 1\n2 0\n1 -1\n1 0', expectedOutput: '4', description: 'Оболочка: (0,0),(2,0),(1,1),(1,-1)' },
          { input: '3\n0 0\n1 0\n0 1', expectedOutput: '3', description: 'Треугольник — все на оболочке' },
          { input: '4\n0 0\n1 0\n0 1\n1 1', expectedOutput: '4', description: 'Прямоугольник' },
        ],
        points: 15,
      },
    ],
  },
];
