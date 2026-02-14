// ============================================
// Grade 11 Python — ЕГЭ по информатике
// 25 уроков, ~70 часов
// Задания ЕГЭ: 6, 12, 14, 16, 17, 23–27
// ============================================

export const python11Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Введение в ЕГЭ
  // ──────────────────────────────────────────
  {
    slug: 'ege-intro',
    title: 'Введение в ЕГЭ по информатике',
    description: 'Структура экзамена, типы заданий, стратегия подготовки',
    content: `# Введение в ЕГЭ по информатике

## Структура экзамена

ЕГЭ по информатике состоит из **27 заданий**. Все задания выполняются на компьютере.

| Блок | Задания | Тематика |
|------|---------|----------|
| Информация и кодирование | 1–4 | Системы счисления, кодирование |
| Алгоритмизация | 5–8 | Исполнители, анализ алгоритмов |
| Логика | 9–10 | Логические выражения |
| Сети и базы данных | 11–13 | IP-адресация, таблицы, запросы |
| Системы счисления | 14 | Позиционные системы |
| Графы | 15 | Поиск путей |
| Рекурсия | 16 | Рекурсивные алгоритмы |
| Обработка данных | 17 | Работа с файлами |
| Робот-исполнитель | 18–21 | Программирование исполнителя |
| Динамическое программирование | 22 | Параллельные процессы |
| Логические уравнения | 23 | Системы логических уравнений |
| Строки | 24 | Обработка символьных строк |
| Целые числа | 25 | Делители, остатки, разряды |
| Сортировка и поиск | 26 | Эффективная обработка данных |
| Сложная задача | 27 | Комплексное программирование |

## Наш курс

В этом курсе мы сосредоточимся на **программных заданиях**, которые решаются на Python:

- **Задание 6** — анализ алгоритмов (исполнители)
- **Задание 12** — алгоритмы обработки информации
- **Задание 14** — системы счисления
- **Задание 16** — рекурсия
- **Задание 17** — обработка файлов с данными
- **Задания 23–27** — программирование

## Базовый шаблон решения задач ЕГЭ

\`\`\`python
# Чтение данных
n = int(input())
data = list(map(int, input().split()))

# Обработка
result = 0
for x in data:
    if x % 2 == 0:
        result += x

# Вывод ответа
print(result)
\`\`\`

## Советы по экзамену

1. **Читайте условие дважды** — ошибки чаще всего из-за невнимательности
2. **Проверяйте на примерах** — всегда проверяйте решение на данных из условия
3. **Следите за типами данных** — \`int\` vs \`float\`, переполнение
4. **Используйте Python** — он проще для большинства заданий ЕГЭ`,
    duration: 45,
    egeTopic: 'Введение',
    egeTaskNumber: null,
    assignment: {
      title: 'Базовая обработка данных',
      description: 'Считайте число N, затем N целых чисел. Выведите сумму чётных и количество нечётных чисел через пробел.',
      difficulty: 'easy',
      starterCode: '# Считайте N\n# Считайте N чисел\n# Найдите сумму чётных и количество нечётных\n# Выведите два числа через пробел\n\n',
      testCases: [
        { input: '5\n1 2 3 4 5', expectedOutput: '6 3', description: 'Сумма чётных 2+4=6, нечётных 3 штуки' },
        { input: '4\n2 4 6 8', expectedOutput: '20 0', description: 'Все чётные, нечётных нет' },
        { input: '3\n1 3 5', expectedOutput: '0 3', description: 'Все нечётные' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 2: Задание 6 — Исполнители (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege6-executors-basics',
    title: 'Задание 6: Анализ алгоритмов — исполнители',
    description: 'Моделирование работы исполнителей с командами преобразования чисел',
    content: `# Задание 6: Анализ алгоритмов — исполнители

## Суть задания

Дан исполнитель с набором команд, преобразующих число. Нужно определить, какое число получится после выполнения программы, или найти начальное число.

## Типичные исполнители

### Исполнитель «Калькулятор»

Команды:
- **Прибавь 1** — увеличивает число на 1
- **Умножь на 2** — умножает число на 2

\`\`\`python
# Моделирование: программа "1221" начиная с числа 3
x = 3
# Команда 1 → прибавь 1
x += 1  # x = 4
# Команда 2 → умножь на 2
x *= 2  # x = 8
# Команда 2 → умножь на 2
x *= 2  # x = 16
# Команда 1 → прибавь 1
x += 1  # x = 17
print(x)  # Ответ: 17
\`\`\`

### Исполнитель «Удвоитель»

Команды:
- **Прибавь 1** — увеличивает число на 1
- **Умножь на 3** — умножает число на 3

\`\`\`python
def executor(start, program):
    x = start
    for cmd in program:
        if cmd == '1':
            x += 1
        elif cmd == '2':
            x *= 3
    return x

print(executor(1, '12121'))  # 1→2→6→7→21→22
\`\`\`

## Подсчёт количества программ

Часто нужно найти **количество программ**, переводящих число A в число B.

\`\`\`python
# Сколько программ переводят число 2 в число 20?
# Команды: +1, *2

from functools import lru_cache

@lru_cache(maxsize=None)
def count_programs(current, target):
    if current == target:
        return 1
    if current > target:
        return 0
    # Пробуем обе команды
    return count_programs(current + 1, target) + count_programs(current * 2, target)

print(count_programs(2, 20))
\`\`\`

## Обратный ход (от результата к началу)

Иногда эффективнее идти **от конца к началу**:

\`\`\`python
# Найти начальное число, если программа "2121" даёт результат 47
# Команды: +3, *2

def find_start(program, result):
    x = result
    for cmd in reversed(program):
        if cmd == '1':
            x -= 3
        elif cmd == '2':
            x //= 2  # обратная операция к *2
    return x

print(find_start('2121', 47))
\`\`\``,
    duration: 50,
    egeTopic: 'Анализ алгоритмов',
    egeTaskNumber: 6,
    assignment: {
      title: 'Исполнитель: подсчёт программ',
      description: 'Исполнитель имеет две команды: 1 — прибавь 1, 2 — умножь на 2. Сколько различных программ переводят число A в число B? Считайте A и B (A < B ≤ 50).',
      difficulty: 'medium',
      starterCode: '# Считайте A и B\n# Подсчитайте количество программ,\n# переводящих A в B\n# Команды: +1, *2\n\n',
      testCases: [
        { input: '2\n10', expectedOutput: '4', description: 'Из 2 в 10: 4 программы' },
        { input: '1\n8', expectedOutput: '10', description: 'Из 1 в 8: 10 программ' },
        { input: '3\n20', expectedOutput: '18', description: 'Из 3 в 20: 18 программ' },
      ],
      points: 15,
      egeTaskNumber: 6,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 3: Задание 6 — Исполнители (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege6-executors-advanced',
    title: 'Задание 6: Исполнители — продвинутые задачи',
    description: 'BFS/DFS для поиска кратчайшей программы, исполнители с ограничениями',
    content: `# Задание 6: Исполнители — продвинутые задачи

## Кратчайшая программа (BFS)

Найти программу **минимальной длины**, переводящую A в B:

\`\`\`python
from collections import deque

def shortest_program(a, b):
    """Кратчайшая программа: +1 или *2"""
    queue = deque([(a, "")])
    visited = {a}

    while queue:
        current, program = queue.popleft()
        if current == b:
            return len(program)

        for cmd, next_val in [("1", current + 1), ("2", current * 2)]:
            if next_val <= b and next_val not in visited:
                visited.add(next_val)
                queue.append((next_val, program + cmd))

    return -1  # невозможно

a, b = int(input()), int(input())
print(shortest_program(a, b))
\`\`\`

## Исполнитель с тремя командами

\`\`\`python
# Команды: +1, *2, *3
# Количество программ из A в B

def count_programs_3cmd(a, b):
    # dp[i] = количество способов получить число i
    dp = [0] * (b + 1)
    dp[a] = 1

    for i in range(a, b):
        if dp[i] == 0:
            continue
        if i + 1 <= b:
            dp[i + 1] += dp[i]
        if i * 2 <= b:
            dp[i * 2] += dp[i]
        if i * 3 <= b:
            dp[i * 3] += dp[i]

    return dp[b]
\`\`\`

## Исполнитель с ограничениями

В некоторых задачах определённые числа **запрещены** (исполнитель не может в них попадать).

\`\`\`python
def count_with_forbidden(a, b, forbidden):
    """Подсчёт программ с запрещёнными числами"""
    dp = [0] * (b + 1)
    dp[a] = 1

    for i in range(a, b):
        if dp[i] == 0 or i in forbidden:
            continue
        if i + 1 <= b and (i + 1) not in forbidden:
            dp[i + 1] += dp[i]
        if i * 2 <= b and (i * 2) not in forbidden:
            dp[i * 2] += dp[i]

    return dp[b]

# Пример: из 2 в 20, запрещены 5, 10, 15
print(count_with_forbidden(2, 20, {5, 10, 15}))
\`\`\`

## Динамическое программирование vs рекурсия

| Подход | Плюсы | Минусы |
|--------|-------|--------|
| Рекурсия + \`lru_cache\` | Просто написать | Может быть медленнее |
| DP (массив) | Быстрее, нет лимита стека | Нужно больше памяти |
| BFS | Находит кратчайший путь | Сложнее реализовать |`,
    duration: 50,
    egeTopic: 'Анализ алгоритмов',
    egeTaskNumber: 6,
    assignment: {
      title: 'Кратчайшая программа исполнителя',
      description: 'Исполнитель имеет три команды: +1, +3, *2. Найдите длину кратчайшей программы, переводящей число A в число B. Считайте A и B (A < B ≤ 1000).',
      difficulty: 'medium',
      starterCode: '# Считайте A и B\n# Найдите длину кратчайшей программы\n# Команды: +1, +3, *2\n# Используйте BFS или DP\n\n',
      testCases: [
        { input: '1\n10', expectedOutput: '4', description: '1→2→4→7→10 (длина 4)' },
        { input: '1\n100', expectedOutput: '8', description: 'Из 1 в 100 за 8 шагов' },
        { input: '5\n30', expectedOutput: '4', description: 'Из 5 в 30 за 4 шага' },
      ],
      points: 15,
      egeTaskNumber: 6,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 4: Задание 12 — Алгоритмы обработки
  // ──────────────────────────────────────────
  {
    slug: 'ege12-algorithms',
    title: 'Задание 12: Алгоритмы обработки информации',
    description: 'Анализ алгоритмов с циклами и ветвлениями, трассировка программ',
    content: `# Задание 12: Алгоритмы обработки информации

## Суть задания

Дана программа (на псевдокоде или Python). Нужно определить результат работы программы для заданных входных данных или найти входные данные, дающие определённый результат.

## Трассировка программы

\`\`\`python
# Определите, что выведет программа
s = 0
n = 1
while s <= 365:
    s += n
    n += 2
print(n)
\`\`\`

Трассировка:

| Шаг | s | n | s <= 365? |
|-----|---|---|-----------|
| 0 | 0 | 1 | Да |
| 1 | 1 | 3 | Да |
| 2 | 4 | 5 | Да |
| ... | ... | ... | ... |
| 19 | 361 | 39 | Да |
| 20 | 400 | 41 | Нет → выход |

Ответ: **41**

## Автоматизация трассировки

\`\`\`python
# Вместо ручной трассировки — запустите код!
s = 0
n = 1
while s <= 365:
    s += n
    n += 2
print(n)  # 41
\`\`\`

## Типичные паттерны задания 12

### Паттерн 1: Цикл с условием

\`\`\`python
# Наименьшее n, при котором f(n) > X
n = 1
while n * n + 3 * n <= 1000:
    n += 1
print(n)
\`\`\`

### Паттерн 2: Обработка цифр числа

\`\`\`python
# Сумма цифр числа
n = int(input())
s = 0
while n > 0:
    s += n % 10
    n //= 10
print(s)
\`\`\`

### Паттерн 3: Преобразование числа

\`\`\`python
# Перевод в двоичную систему
n = int(input())
result = ''
while n > 0:
    result = str(n % 2) + result
    n //= 2
print(result)
\`\`\`

## Поиск входных данных

Если нужно найти входное значение по результату — перебор:

\`\`\`python
# Найти x, при котором программа выводит 120
for x in range(1, 1000):
    # Моделируем программу
    s = 0
    n = x
    while n > 0:
        s += n % 10
        n //= 10
    if s == 120:
        print(x)
        break
\`\`\``,
    duration: 45,
    egeTopic: 'Алгоритмы обработки информации',
    egeTaskNumber: 12,
    assignment: {
      title: 'Трассировка алгоритма',
      description: 'Считайте целое число N. Определите, что выведет следующий алгоритм:\ns = 0\nk = 0\nwhile N > 0:\n    d = N % 10\n    if d % 2 == 0:\n        s += d\n    else:\n        k += 1\n    N //= 10\nprint(s, k)\n\nВыведите два числа через пробел: сумму чётных цифр и количество нечётных цифр.',
      difficulty: 'easy',
      starterCode: 'N = int(input())\ns = 0\nk = 0\n# Реализуйте алгоритм из условия\n\n',
      testCases: [
        { input: '123456', expectedOutput: '12 3', description: 'Чётные: 2+4+6=12, нечётные: 1,3,5 → 3 штуки' },
        { input: '2468', expectedOutput: '20 0', description: 'Все цифры чётные: 2+4+6+8=20' },
        { input: '13579', expectedOutput: '0 5', description: 'Все цифры нечётные' },
      ],
      points: 10,
      egeTaskNumber: 12,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 5: Задание 12 — Продвинутый анализ
  // ──────────────────────────────────────────
  {
    slug: 'ege12-advanced-analysis',
    title: 'Задание 12: Продвинутый анализ алгоритмов',
    description: 'Вложенные циклы, алгоритмы с массивами, поиск значений перебором',
    content: `# Задание 12: Продвинутый анализ алгоритмов

## Вложенные циклы

\`\`\`python
# Сколько пар (i, j) удовлетворяют условию?
count = 0
for i in range(1, 100):
    for j in range(i + 1, 100):
        if (i + j) % 7 == 0 and (i * j) % 3 == 0:
            count += 1
print(count)
\`\`\`

## Алгоритмы Евклида

\`\`\`python
# Алгоритм Евклида — НОД
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# Подсчёт шагов алгоритма Евклида
def gcd_steps(a, b):
    steps = 0
    while b:
        a, b = b, a % b
        steps += 1
    return steps

# Найти пару (a, b), a < b <= 100,
# для которой алгоритм Евклида делает max шагов
max_steps = 0
best_pair = (0, 0)
for a in range(1, 101):
    for b in range(a + 1, 101):
        s = gcd_steps(a, b)
        if s > max_steps:
            max_steps = s
            best_pair = (a, b)

print(best_pair, max_steps)
\`\`\`

## Перебор с условиями

\`\`\`python
# Сколько натуральных чисел от 1 до N
# имеют ровно 3 делителя?
n = int(input())
count = 0
for x in range(1, n + 1):
    divisors = 0
    for d in range(1, x + 1):
        if x % d == 0:
            divisors += 1
    if divisors == 3:
        count += 1
print(count)
\`\`\`

## Обратная задача — поиск входа по выходу

\`\`\`python
# Программа получает N и выводит результат.
# Для какого наименьшего N результат > 1000?
def program(n):
    s = 0
    for i in range(1, n + 1):
        if i % 3 == 0 or i % 5 == 0:
            s += i
    return s

n = 1
while program(n) <= 1000:
    n += 1
print(n)
\`\`\`

## Побитовые операции

\`\`\`python
# Сколько единиц в двоичной записи числа?
def count_bits(n):
    count = 0
    while n > 0:
        count += n & 1
        n >>= 1
    return count

# Или встроенным методом:
print(bin(255).count('1'))  # 8
\`\`\``,
    duration: 50,
    egeTopic: 'Алгоритмы обработки информации',
    egeTaskNumber: 12,
    assignment: {
      title: 'Подсчёт шагов алгоритма Евклида',
      description: 'Считайте два натуральных числа A и B. Определите, сколько шагов делает алгоритм Евклида (с остатками) для нахождения НОД(A, B). Один шаг — одна операция a, b = b, a % b.',
      difficulty: 'medium',
      starterCode: '# Считайте A и B\n# Подсчитайте количество шагов\n# алгоритма Евклида\n\n',
      testCases: [
        { input: '12\n8', expectedOutput: '3', description: '12,8 → 8,4 → 4,0 → 3 шага' },
        { input: '100\n75', expectedOutput: '3', description: '100,75 → 75,25 → 25,0 → 3 шага' },
        { input: '17\n13', expectedOutput: '3', description: '17,13 → 13,4 → 4,1 → 1,0 — 3 шага' },
      ],
      points: 15,
      egeTaskNumber: 12,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 6: Задание 14 — Системы счисления (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege14-number-systems-basics',
    title: 'Задание 14: Системы счисления — основы',
    description: 'Перевод между системами счисления, арифметика в разных основаниях',
    content: `# Задание 14: Системы счисления — основы

## Позиционные системы счисления

Число в системе с основанием **b**:

\`(dₙdₙ₋₁...d₁d₀)ᵦ = dₙ·bⁿ + dₙ₋₁·bⁿ⁻¹ + ... + d₁·b + d₀\`

## Перевод из системы b в десятичную

\`\`\`python
# Встроенная функция
print(int('1010', 2))    # 10  (из двоичной)
print(int('1A', 16))     # 26  (из шестнадцатеричной)
print(int('77', 8))      # 63  (из восьмеричной)

# Вручную
def to_decimal(s, base):
    result = 0
    for digit in s:
        if digit.isdigit():
            d = int(digit)
        else:
            d = ord(digit.upper()) - ord('A') + 10
        result = result * base + d
    return result

print(to_decimal('1A3', 16))  # 419
\`\`\`

## Перевод из десятичной в систему b

\`\`\`python
# Встроенные функции
print(bin(42))   # 0b101010
print(oct(42))   # 0o52
print(hex(42))   # 0x2a

# Универсальная функция
def from_decimal(n, base):
    if n == 0:
        return '0'
    digits = '0123456789ABCDEF'
    result = ''
    while n > 0:
        result = digits[n % base] + result
        n //= base
    return result

print(from_decimal(255, 16))  # FF
print(from_decimal(100, 2))   # 1100100
print(from_decimal(100, 3))   # 10201
\`\`\`

## Свойства степеней двойки

\`\`\`python
# 2^n в двоичной — это 1 и n нулей
# 2^10 = 1024 = 10000000000₂

# Проверка: является ли число степенью двойки?
def is_power_of_2(n):
    return n > 0 and (n & (n - 1)) == 0
\`\`\`

## Подсчёт цифр в записи числа

\`\`\`python
# Сколько цифр в записи числа N в системе с основанием b?
def digit_count(n, base):
    if n == 0:
        return 1
    count = 0
    while n > 0:
        count += 1
        n //= base
    return count

print(digit_count(255, 2))   # 8 (11111111)
print(digit_count(1000, 10)) # 4
\`\`\``,
    duration: 45,
    egeTopic: 'Системы счисления',
    egeTaskNumber: 14,
    assignment: {
      title: 'Перевод между системами счисления',
      description: 'Считайте число N в десятичной системе и основание B. Выведите запись числа N в системе счисления с основанием B (используйте заглавные буквы для цифр > 9).',
      difficulty: 'easy',
      starterCode: '# Считайте N и B\n# Переведите N в систему с основанием B\n# Выведите результат\n\n',
      testCases: [
        { input: '255\n16', expectedOutput: 'FF', description: '255 в 16-ричной = FF' },
        { input: '100\n2', expectedOutput: '1100100', description: '100 в двоичной' },
        { input: '42\n8', expectedOutput: '52', description: '42 в восьмеричной' },
      ],
      points: 10,
      egeTaskNumber: 14,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 7: Задание 14 — Системы счисления (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege14-number-systems-advanced',
    title: 'Задание 14: Системы счисления — задачи ЕГЭ',
    description: 'Уравнения в разных системах, поиск основания, подсчёт единиц',
    content: `# Задание 14: Системы счисления — задачи ЕГЭ

## Тип 1: Найти основание системы

> Запись числа 63 в системе с основанием b равна 120. Найдите b.

\`\`\`python
# 120_b = 1·b² + 2·b + 0 = b² + 2b = 63
# b² + 2b - 63 = 0
# Решение перебором:
for b in range(2, 100):
    if b * b + 2 * b == 63:
        print(b)  # 7
        break
\`\`\`

## Тип 2: Сколько единиц в двоичной записи

> Сколько единиц в двоичной записи числа 4^20 + 2^14 - 7?

\`\`\`python
n = 4**20 + 2**14 - 7
print(bin(n).count('1'))
\`\`\`

## Тип 3: Арифметика в разных системах

> Найдите значение выражения 101011₂ + 2A₁₆ в десятичной системе.

\`\`\`python
a = int('101011', 2)   # 43
b = int('2A', 16)       # 42
print(a + b)            # 85
\`\`\`

## Тип 4: Найти число по условиям в разных системах

\`\`\`python
# Найти наибольшее число, которое:
# - в двоичной записи имеет ровно 5 единиц
# - в восьмеричной записи имеет ровно 3 цифры
# (т.е. 64 <= n <= 511)

best = 0
for n in range(64, 512):
    if bin(n).count('1') == 5:
        best = n
print(best)  # 496 = 111110000₂ = 760₈
\`\`\`

## Тип 5: Операции с разрядами

\`\`\`python
# Найти число, которое при записи в системе
# с основанием 4 является палиндромом
# и имеет ровно 5 разрядов (от 256 до 1023)

def to_base(n, base):
    digits = []
    while n > 0:
        digits.append(n % base)
        n //= base
    return digits[::-1]

def is_palindrome(digits):
    return digits == digits[::-1]

for n in range(256, 1024):
    d = to_base(n, 4)
    if len(d) == 5 and is_palindrome(d):
        print(n, d)
\`\`\`

## Быстрые трюки

\`\`\`python
# Количество цифр числа N в системе b:
import math
digits = math.floor(math.log(n, b)) + 1 if n > 0 else 1

# Последняя цифра N в системе b:
last_digit = n % b

# Предпоследняя цифра N в системе b:
second_last = (n // b) % b
\`\`\``,
    duration: 50,
    egeTopic: 'Системы счисления',
    egeTaskNumber: 14,
    assignment: {
      title: 'Поиск основания системы счисления',
      description: 'Считайте десятичное число N и его запись S в неизвестной системе счисления (строку из цифр 0-9). Найдите основание B этой системы (2 ≤ B ≤ 36). Если подходящего основания нет, выведите -1.',
      difficulty: 'medium',
      starterCode: '# Считайте N (десятичное) и S (запись в неизвестной системе)\n# Найдите основание B, в котором S = N\n\n',
      testCases: [
        { input: '63\n120', expectedOutput: '7', description: '120 в системе 7 = 1·49 + 2·7 + 0 = 63' },
        { input: '255\n11111111', expectedOutput: '2', description: '11111111 в двоичной = 255' },
        { input: '100\n144', expectedOutput: '8', description: '144 в восьмеричной = 100' },
      ],
      points: 15,
      egeTaskNumber: 14,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 8: Задание 16 — Рекурсия (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege16-recursion-basics',
    title: 'Задание 16: Рекурсия — основы',
    description: 'Рекурсивные функции, стек вызовов, базовый случай',
    content: `# Задание 16: Рекурсия — основы

## Что такое рекурсия?

Рекурсия — это вызов функцией **самой себя**. Каждая рекурсивная функция имеет:
1. **Базовый случай** — условие остановки
2. **Рекурсивный случай** — вызов самой себя с изменёнными параметрами

\`\`\`python
def factorial(n):
    if n <= 1:        # базовый случай
        return 1
    return n * factorial(n - 1)  # рекурсивный случай

print(factorial(5))  # 120
\`\`\`

## Стек вызовов

\`\`\`
factorial(5)
  → 5 * factorial(4)
    → 4 * factorial(3)
      → 3 * factorial(2)
        → 2 * factorial(1)
          → 1  (базовый случай)
        → 2 * 1 = 2
      → 3 * 2 = 6
    → 4 * 6 = 24
  → 5 * 24 = 120
\`\`\`

## Типичные рекурсивные задачи ЕГЭ

### Задача: Определить результат вызова

\`\`\`python
def f(n):
    if n <= 1:
        return 1
    if n % 2 == 0:
        return f(n // 2)
    else:
        return f(n - 1) + 1

# Что выведет f(12)?
# f(12) → f(6) → f(3) → f(2) + 1 → f(1) + 1 → 1 + 1 = 2 → 2 + 1 = 3
print(f(12))  # 3 - но проверим!
\`\`\`

### Числа Фибоначчи

\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# Сколько раз вызывается fib при вычислении fib(5)?
call_count = 0
def fib_counted(n):
    global call_count
    call_count += 1
    if n <= 1:
        return n
    return fib_counted(n - 1) + fib_counted(n - 2)

fib_counted(5)
print(call_count)  # 15 вызовов!
\`\`\`

### Сумма цифр (рекурсивно)

\`\`\`python
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

print(digit_sum(12345))  # 15
\`\`\`

## Двойная рекурсия

\`\`\`python
def g(n):
    if n <= 0:
        return 0
    return g(n - 1) + g(n - 2) + n

# Дерево вызовов растёт экспоненциально!
# Для n=4: g(4) = g(3) + g(2) + 4
#           g(3) = g(2) + g(1) + 3
#           g(2) = g(1) + g(0) + 2
#           g(1) = g(0) + g(-1) + 1
#           g(0) = 0, g(-1) = 0
\`\`\`

## Как решать на ЕГЭ

1. **Запустите программу** — это быстрее, чем ручная трассировка
2. Если нужна ручная трассировка — стройте **дерево вызовов**
3. Подсчёт вызовов — добавьте глобальный счётчик`,
    duration: 50,
    egeTopic: 'Рекурсивные алгоритмы',
    egeTaskNumber: 16,
    assignment: {
      title: 'Подсчёт вызовов рекурсивной функции',
      description: 'Считайте число N. Дана рекурсивная функция:\ndef f(n):\n    if n <= 1:\n        return 1\n    return f(n - 1) + f(n // 2)\n\nОпределите, сколько раз будет вызвана функция f при вычислении f(N) (включая первый вызов).',
      difficulty: 'medium',
      starterCode: '# Считайте N\n# Подсчитайте количество вызовов f(N)\n\n',
      testCases: [
        { input: '1', expectedOutput: '1', description: 'f(1) — 1 вызов (базовый случай)' },
        { input: '4', expectedOutput: '9', description: 'f(4) порождает 9 вызовов' },
        { input: '7', expectedOutput: '25', description: 'f(7) порождает 25 вызовов' },
      ],
      points: 15,
      egeTaskNumber: 16,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 9: Задание 16 — Рекурсия (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege16-recursion-advanced',
    title: 'Задание 16: Рекурсия — продвинутые задачи',
    description: 'Мемоизация, взаимная рекурсия, восстановление функции по дереву вызовов',
    content: `# Задание 16: Рекурсия — продвинутые задачи

## Мемоизация

Рекурсия может быть **медленной** из-за повторных вычислений. Мемоизация сохраняет результаты:

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(100))  # Мгновенно! Без мемоизации — зависнет
\`\`\`

## Взаимная рекурсия

Две функции вызывают **друг друга**:

\`\`\`python
def f(n):
    if n <= 0:
        return 1
    return f(n - 1) + g(n - 1)

def g(n):
    if n <= 0:
        return 0
    return g(n - 1) + f(n - 2)

print(f(5))  # Требуется трассировка обеих функций
\`\`\`

## Анализ рекурсии: что выводит функция?

\`\`\`python
# Задача: определите вывод
def f(n):
    if n > 0:
        f(n - 2)
        print(n, end=' ')
        f(n - 1)

f(4)
# Трассировка:
# f(4) → f(2), print(4), f(3)
# f(2) → f(0), print(2), f(1)
# f(0) → ничего
# f(1) → f(-1), print(1), f(0) → print(1)
# f(3) → f(1), print(3), f(2)
# Итого: 2 1 4 1 3 2 1
\`\`\`

## Определить наибольшее/наименьшее значение

\`\`\`python
# При каком наименьшем n значение f(n) > 1000?
@lru_cache(maxsize=None)
def f(n):
    if n <= 2:
        return n
    return f(n - 1) + 2 * f(n - 2) + f(n - 3)

n = 1
while f(n) <= 1000:
    n += 1
print(n)
\`\`\`

## Рекурсия и строки

\`\`\`python
def build_string(n):
    if n == 0:
        return 'A'
    if n == 1:
        return 'B'
    return build_string(n - 1) + build_string(n - 2)

print(build_string(5))
# B + A = BA
# BA + B = BAB
# BAB + BA = BABBA
# BABBA + BAB = BABBABAB
print(len(build_string(5)))  # Связь с числами Фибоначчи!
\`\`\``,
    duration: 50,
    egeTopic: 'Рекурсивные алгоритмы',
    egeTaskNumber: 16,
    assignment: {
      title: 'Рекурсия с мемоизацией',
      description: 'Считайте число N. Дана рекурсивная функция:\ndef f(n):\n    if n <= 2:\n        return n\n    return f(n - 1) + 2 * f(n - 2)\n\nВыведите значение f(N). Используйте мемоизацию для больших N.',
      difficulty: 'medium',
      starterCode: '# Считайте N\n# Вычислите f(N) с мемоизацией\n\n',
      testCases: [
        { input: '5', expectedOutput: '16', description: 'f(5) = f(4) + 2*f(3) = 8 + 8 = 16' },
        { input: '3', expectedOutput: '4', description: 'f(3) = f(2) + 2*f(1) = 2 + 2 = 4' },
        { input: '10', expectedOutput: '512', description: 'f(10) = 2^9 = 512' },
      ],
      points: 15,
      egeTaskNumber: 16,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 10: Задание 17 — Обработка файлов (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege17-file-processing-basics',
    title: 'Задание 17: Обработка числовых данных',
    description: 'Чтение данных, поиск максимума/минимума, фильтрация и агрегация',
    content: `# Задание 17: Обработка числовых данных

## Суть задания

Дан файл с числами. Нужно найти определённое значение: максимум, количество, сумму — с условиями.

## Чтение данных

\`\`\`python
# На ЕГЭ данные обычно читаются из файла
# В нашей среде — из стандартного ввода

# Формат 1: N чисел, каждое на отдельной строке
n = int(input())
numbers = []
for _ in range(n):
    numbers.append(int(input()))

# Формат 2: N чисел в одной строке
n = int(input())
numbers = list(map(int, input().split()))

# Формат 3: Пары чисел
n = int(input())
pairs = []
for _ in range(n):
    a, b = map(int, input().split())
    pairs.append((a, b))
\`\`\`

## Типичные задачи

### Максимум из чётных

\`\`\`python
n = int(input())
max_even = None
for _ in range(n):
    x = int(input())
    if x % 2 == 0:
        if max_even is None or x > max_even:
            max_even = x
print(max_even)
\`\`\`

### Пара с максимальным произведением

\`\`\`python
n = int(input())
numbers = []
for _ in range(n):
    numbers.append(int(input()))

# Нужно найти два числа с макс. произведением
# Это или два максимальных положительных,
# или два минимальных отрицательных
numbers.sort()
option1 = numbers[0] * numbers[1]           # два наименьших
option2 = numbers[-1] * numbers[-2]         # два наибольших
print(max(option1, option2))
\`\`\`

### Количество пар с заданным свойством

\`\`\`python
n = int(input())
numbers = []
for _ in range(n):
    numbers.append(int(input()))

# Сколько пар (i, j), i < j, таких что сумма делится на 3?
count = 0
for i in range(n):
    for j in range(i + 1, n):
        if (numbers[i] + numbers[j]) % 3 == 0:
            count += 1
print(count)
\`\`\`

## Оптимизация: группировка по остаткам

\`\`\`python
# Тот же подсчёт пар, но за O(n)!
n = int(input())
remainders = [0, 0, 0]  # count по остаткам 0, 1, 2
for _ in range(n):
    x = int(input())
    remainders[x % 3] += 1

# Пары: (0,0), (1,2)
r0, r1, r2 = remainders
count = r0 * (r0 - 1) // 2 + r1 * r2
print(count)
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка числовых данных',
    egeTaskNumber: 17,
    assignment: {
      title: 'Максимум среди делящихся на заданное число',
      description: 'Считайте числа N и K. Затем считайте N целых чисел. Выведите максимальное число среди тех, которые делятся на K. Гарантируется, что такое число есть.',
      difficulty: 'easy',
      starterCode: '# Считайте N и K\n# Считайте N чисел\n# Найдите максимум среди делящихся на K\n\n',
      testCases: [
        { input: '5 3\n7 9 12 5 6', expectedOutput: '12', description: 'Делятся на 3: 9, 12, 6. Макс = 12' },
        { input: '4 5\n10 25 7 15', expectedOutput: '25', description: 'Делятся на 5: 10, 25, 15. Макс = 25' },
        { input: '3 2\n4 8 6', expectedOutput: '8', description: 'Все делятся на 2, макс = 8' },
      ],
      points: 10,
      egeTaskNumber: 17,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 11: Задание 17 — Обработка файлов (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege17-file-processing-advanced',
    title: 'Задание 17: Обработка данных — последовательности',
    description: 'Скользящее окно, поиск подпоследовательностей, потоковая обработка',
    content: `# Задание 17: Обработка данных — последовательности

## Потоковая обработка (без хранения всех данных)

Для больших файлов важно **не хранить все данные в памяти**:

\`\`\`python
n = int(input())
max_val = float('-inf')
min_val = float('inf')
total = 0

for _ in range(n):
    x = int(input())
    max_val = max(max_val, x)
    min_val = min(min_val, x)
    total += x

print(f"Max: {max_val}, Min: {min_val}, Avg: {total / n}")
\`\`\`

## Два максимума / два минимума

\`\`\`python
n = int(input())
max1 = max2 = float('-inf')

for _ in range(n):
    x = int(input())
    if x > max1:
        max2 = max1
        max1 = x
    elif x > max2:
        max2 = x

print(max1, max2)
\`\`\`

## Поиск с предыдущим элементом

\`\`\`python
# Найти максимальную разность между соседними элементами
n = int(input())
prev = int(input())
max_diff = 0

for _ in range(n - 1):
    curr = int(input())
    max_diff = max(max_diff, abs(curr - prev))
    prev = curr

print(max_diff)
\`\`\`

## Пары чисел: задача с двумя столбцами

\`\`\`python
# Файл содержит пары (день, температура)
# Найти день с максимальной температурой
n = int(input())
best_day = -1
best_temp = float('-inf')

for _ in range(n):
    day, temp = map(int, input().split())
    if temp > best_temp:
        best_temp = temp
        best_day = day

print(best_day)
\`\`\`

## Условная агрегация

\`\`\`python
# Найти среднее арифметическое чисел,
# которые больше предыдущего
n = int(input())
prev = int(input())
total = 0
count = 0

for _ in range(n - 1):
    curr = int(input())
    if curr > prev:
        total += curr
        count += 1
    prev = curr

if count > 0:
    print(total / count)
else:
    print(0)
\`\`\`

## Подсчёт серий

\`\`\`python
# Найти длину самой длинной серии одинаковых чисел
n = int(input())
prev = int(input())
current_len = 1
max_len = 1

for _ in range(n - 1):
    curr = int(input())
    if curr == prev:
        current_len += 1
        max_len = max(max_len, current_len)
    else:
        current_len = 1
    prev = curr

print(max_len)
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка числовых данных',
    egeTaskNumber: 17,
    assignment: {
      title: 'Максимальная разность соседних элементов',
      description: 'Считайте число N, затем N целых чисел (по одному на строке). Найдите максимальную абсолютную разность между соседними элементами последовательности.',
      difficulty: 'medium',
      starterCode: '# Считайте N\n# Считайте N чисел\n# Найдите макс. разность соседних\n\n',
      testCases: [
        { input: '5\n1\n5\n3\n8\n2', expectedOutput: '6', description: '|8-2|=6 — максимальная разность' },
        { input: '3\n10\n10\n10', expectedOutput: '0', description: 'Все одинаковые, разность 0' },
        { input: '4\n1\n100\n2\n99', expectedOutput: '99', description: '|1-100|=99' },
      ],
      points: 15,
      egeTaskNumber: 17,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 12: Задание 23 — Логические уравнения
  // ──────────────────────────────────────────
  {
    slug: 'ege23-logic-equations',
    title: 'Задание 23: Системы логических уравнений',
    description: 'Перебор значений логических переменных, подсчёт решений',
    content: `# Задание 23: Системы логических уравнений

## Суть задания

Дана система логических уравнений с переменными x₁, x₂, ..., xₙ. Найти количество решений.

## Логические операции в Python

\`\`\`python
# Основные операции
a and b    # конъюнкция (И)
a or b     # дизъюнкция (ИЛИ)
not a      # отрицание (НЕ)

# Импликация: a → b  ≡  (not a) or b
def implies(a, b):
    return (not a) or b

# Эквивалентность: a ↔ b  ≡  a == b
def equiv(a, b):
    return a == b

# Исключающее ИЛИ: a ⊕ b  ≡  a != b
def xor(a, b):
    return a != b
\`\`\`

## Полный перебор

\`\`\`python
# Сколько решений у системы?
# (x1 ∨ x2) ∧ (x2 → x3) ∧ (¬x3 ∨ x1) = 1

count = 0
for x1 in [False, True]:
    for x2 in [False, True]:
        for x3 in [False, True]:
            eq1 = x1 or x2
            eq2 = (not x2) or x3
            eq3 = (not x3) or x1
            if eq1 and eq2 and eq3:
                count += 1
print(count)  # количество решений
\`\`\`

## Перебор с itertools

\`\`\`python
from itertools import product

n = 5  # количество переменных
count = 0
for values in product([False, True], repeat=n):
    x = list(values)
    # Проверяем систему уравнений
    ok = True
    for i in range(n - 1):
        # Пример: (xi → xi+1) = 1
        if not ((not x[i]) or x[i + 1]):
            ok = False
            break
    if ok:
        count += 1
print(count)
\`\`\`

## Типичные системы

### Система с импликацией

\`\`\`python
# (x1 → x2) ∧ (x2 → x3) ∧ ... ∧ (xn-1 → xn) = 1
# Это значит: x1 ≤ x2 ≤ ... ≤ xn
# Решение: n + 1 (ровно одна позиция перехода 0→1)
n = int(input())
print(n + 1)
\`\`\`

### Система с дизъюнкцией соседей

\`\`\`python
# (x1 ∨ x2) ∧ (x2 ∨ x3) ∧ ... ∧ (xn-1 ∨ xn) = 1
# Нет двух соседних нулей
# Решения — числа Фибоначчи!
from functools import lru_cache

@lru_cache(maxsize=None)
def solve(i, prev):
    if i > n:
        return 1
    count = solve(i + 1, True)  # xi = True
    if prev:  # xi = False только если предыдущий True
        count += solve(i + 1, False)
    return count

n = int(input())
print(solve(1, True))
\`\`\``,
    duration: 55,
    egeTopic: 'Логические уравнения',
    egeTaskNumber: 23,
    assignment: {
      title: 'Подсчёт решений системы логических уравнений',
      description: 'Считайте число N (2 ≤ N ≤ 20). Найдите количество решений системы: (x₁ ∨ x₂) ∧ (x₂ ∨ x₃) ∧ ... ∧ (xₙ₋₁ ∨ xₙ) = 1. То есть среди любых двух соседних переменных хотя бы одна должна быть истинной.',
      difficulty: 'medium',
      starterCode: '# Считайте N\n# Подсчитайте решения системы:\n# (x1 ∨ x2) ∧ (x2 ∨ x3) ∧ ... ∧ (xn-1 ∨ xn) = 1\n\n',
      testCases: [
        { input: '2', expectedOutput: '3', description: '(0,1), (1,0), (1,1) — 3 решения' },
        { input: '3', expectedOutput: '5', description: '5 решений (числа Фибоначчи + 2)' },
        { input: '5', expectedOutput: '13', description: '13 решений' },
      ],
      points: 15,
      egeTaskNumber: 23,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 13: Задание 23 — Продвинутые системы
  // ──────────────────────────────────────────
  {
    slug: 'ege23-logic-advanced',
    title: 'Задание 23: Логические уравнения — продвинутые',
    description: 'Системы с импликацией, эквивалентностью, XOR, оптимизация через DP',
    content: `# Задание 23: Продвинутые логические уравнения

## Система с импликацией и отрицанием

\`\`\`python
from itertools import product

# (x1 → x2) ∧ (¬x2 → x3) ∧ (x3 → ¬x4) ∧ ... = 1
n = int(input())
count = 0

for vals in product([0, 1], repeat=n):
    ok = True
    for i in range(n - 1):
        a, b = vals[i], vals[i + 1]
        # Чередование: чётные → обычная импликация,
        # нечётные → с отрицанием
        if i % 2 == 0:
            if a == 1 and b == 0:  # a → b нарушено
                ok = False
                break
        else:
            if a == 0 and b == 0:  # ¬a → b нарушено
                ok = False
                break
    if ok:
        count += 1
print(count)
\`\`\`

## Оптимизация через DP

Для N > 20 перебор слишком медленный. Используем DP:

\`\`\`python
# (xi ∨ xi+1) = 1 для всех i
# dp[i][val] = количество способов задать x1..xi,
# где xi = val

n = int(input())
dp = [[0, 0] for _ in range(n + 1)]
dp[1][0] = 1  # x1 = False
dp[1][1] = 1  # x1 = True

for i in range(2, n + 1):
    # xi = True: предыдущий может быть любым
    dp[i][1] = dp[i - 1][0] + dp[i - 1][1]
    # xi = False: предыдущий должен быть True (xi-1 ∨ xi)
    dp[i][0] = dp[i - 1][1]

print(dp[n][0] + dp[n][1])
\`\`\`

## Битовые маски для ускорения

\`\`\`python
# Для систем с парами переменных
# можно кодировать состояние битами
n = int(input())
count = 0

for mask in range(1 << n):
    ok = True
    for i in range(n - 1):
        xi = (mask >> i) & 1
        xi1 = (mask >> (i + 1)) & 1
        if not (xi or xi1):  # xi ∨ xi+1 = 0
            ok = False
            break
    if ok:
        count += 1
print(count)
\`\`\`

## Системы с тремя переменными в уравнении

\`\`\`python
# (x1 ∨ x2 ∨ x3) ∧ (x2 ∨ x3 ∨ x4) ∧ ... = 1
# Нет трёх подряд нулей

from functools import lru_cache

n = int(input())

@lru_cache(maxsize=None)
def dp(i, prev1, prev2):
    """i — текущая позиция, prev1 и prev2 — два предыдущих"""
    if i > n:
        return 1
    count = dp(i + 1, 1, prev1)  # xi = 1
    # xi = 0 допустимо, если не создаёт 3 нуля подряд
    if prev1 == 1 or prev2 == 1:
        count += dp(i + 1, 0, prev1)
    return count

# Первые два можно задать свободно
total = 0
for a in [0, 1]:
    for b in [0, 1]:
        total += dp(3, b, a)
print(total)
\`\`\``,
    duration: 55,
    egeTopic: 'Логические уравнения',
    egeTaskNumber: 23,
    assignment: {
      title: 'Система с импликацией (DP)',
      description: 'Считайте число N (2 ≤ N ≤ 40). Найдите количество решений системы: (x₁ → x₂) ∧ (x₂ → x₃) ∧ ... ∧ (xₙ₋₁ → xₙ) = 1. Используйте динамическое программирование.',
      difficulty: 'medium',
      starterCode: '# Считайте N\n# Подсчитайте решения системы импликаций\n# (x1 → x2) ∧ (x2 → x3) ∧ ... = 1\n\n',
      testCases: [
        { input: '2', expectedOutput: '3', description: '(0,0), (0,1), (1,1) — 3 решения' },
        { input: '5', expectedOutput: '6', description: 'N+1 = 6 решений' },
        { input: '10', expectedOutput: '11', description: 'Всегда N+1' },
      ],
      points: 15,
      egeTaskNumber: 23,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 14: Задание 24 — Обработка строк (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege24-strings-basics',
    title: 'Задание 24: Обработка строк — основы',
    description: 'Поиск подстрок, подсчёт символов, обработка текстовых файлов',
    content: `# Задание 24: Обработка строк

## Суть задания

Дана строка или текстовый файл. Нужно найти/подсчитать подстроки с определёнными свойствами.

## Базовые операции со строками

\`\`\`python
s = "Информатика"

# Длина
print(len(s))          # 11

# Доступ по индексу
print(s[0])            # И
print(s[-1])           # а

# Срезы
print(s[0:6])          # Информ
print(s[::-1])         # акитамрофнИ

# Поиск
print(s.find("мат"))   # 5 (индекс начала)
print(s.count("а"))    # 2

# Проверки
print("форм" in s)     # True
print(s.startswith("Ин")) # True
\`\`\`

## Подсчёт вхождений подстроки

\`\`\`python
s = input()
pattern = input()

# Метод 1: встроенный count (непересекающиеся)
print(s.count(pattern))

# Метод 2: все вхождения (в т.ч. пересекающиеся)
count = 0
for i in range(len(s) - len(pattern) + 1):
    if s[i:i + len(pattern)] == pattern:
        count += 1
print(count)
\`\`\`

## Поиск максимальной подстроки

\`\`\`python
# Найти длину самой длинной подстроки
# без повторяющихся символов
s = input()
max_len = 0
for i in range(len(s)):
    seen = set()
    j = i
    while j < len(s) and s[j] not in seen:
        seen.add(s[j])
        j += 1
    max_len = max(max_len, j - i)
print(max_len)
\`\`\`

## Анализ символов

\`\`\`python
s = input()

# Подсчёт каждого символа
freq = {}
for c in s:
    freq[c] = freq.get(c, 0) + 1

# Самый частый символ
most_common = max(freq, key=freq.get)
print(most_common, freq[most_common])
\`\`\`

## Замена и трансформация

\`\`\`python
s = input()

# Замена символов
print(s.replace('а', 'о'))

# Удаление гласных
vowels = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ'
result = ''.join(c for c in s if c not in vowels)
print(result)
\`\`\``,
    duration: 45,
    egeTopic: 'Обработка символьных строк',
    egeTaskNumber: 24,
    assignment: {
      title: 'Подсчёт пересекающихся вхождений',
      description: 'Считайте строку S и подстроку P. Выведите количество вхождений P в S, включая пересекающиеся.',
      difficulty: 'easy',
      starterCode: '# Считайте строку S и подстроку P\n# Подсчитайте все вхождения P в S\n# (включая пересекающиеся)\n\n',
      testCases: [
        { input: 'aaaa\naa', expectedOutput: '3', description: 'aa в aaaa: позиции 0,1,2 — 3 вхождения' },
        { input: 'abcabc\nabc', expectedOutput: '2', description: 'abc встречается 2 раза' },
        { input: 'ababab\nab', expectedOutput: '3', description: 'ab на позициях 0,2,4' },
      ],
      points: 10,
      egeTaskNumber: 24,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 15: Задание 24 — Строки (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege24-strings-advanced',
    title: 'Задание 24: Строки — задачи ЕГЭ',
    description: 'Палиндромы, анаграммы, автоматы для поиска паттернов',
    content: `# Задание 24: Строки — задачи ЕГЭ

## Палиндромы

\`\`\`python
def is_palindrome(s):
    return s == s[::-1]

# Найти все палиндромные подстроки
s = input()
palindromes = set()
for i in range(len(s)):
    for j in range(i + 1, len(s) + 1):
        sub = s[i:j]
        if is_palindrome(sub) and len(sub) >= 2:
            palindromes.add(sub)
print(len(palindromes))
\`\`\`

## Задача: подстроки без определённых символов

\`\`\`python
# Найти количество подстрок длины K,
# не содержащих символ c
s = input()
k = int(input())
c = input()

count = 0
for i in range(len(s) - k + 1):
    sub = s[i:i + k]
    if c not in sub:
        count += 1
print(count)
\`\`\`

## Задача: найти строку по шаблону

\`\`\`python
# Подсчитать строки из {a, b, c} длины n,
# содержащие подстроку "abc"
from itertools import product

n = int(input())
count = 0
for chars in product('abc', repeat=n):
    s = ''.join(chars)
    if 'abc' in s:
        count += 1
print(count)
\`\`\`

## Конечные автоматы для поиска

\`\`\`python
# Подсчёт строк из {0, 1} длины n,
# содержащих подстроку "010"
# Используем автомат (DP по состояниям)

n = int(input())

# Состояния: сколько символов "010" уже совпало
# 0: ничего, 1: совпал "0", 2: совпало "01", 3: совпало "010" (найдено!)

dp = [[0] * 4 for _ in range(n + 1)]
dp[0][0] = 1

for i in range(n):
    for state in range(3):  # состояние 3 = уже нашли
        if dp[i][state] == 0:
            continue
        for ch in '01':
            # Определяем новое состояние
            pattern = "010"
            matched = pattern[:state] + ch
            # Находим наибольший суффикс matched, который является префиксом pattern
            new_state = min(state + 1, 3)
            # Упрощённая логика для "010":
            if state == 0:
                new_state = 1 if ch == '0' else 0
            elif state == 1:
                new_state = 2 if ch == '1' else 1
            elif state == 2:
                new_state = 3 if ch == '0' else 0

            if new_state >= 3:
                new_state = 3
            dp[i + 1][new_state] += dp[i][state]

    # Состояние 3 переносится
    dp[i + 1][3] += dp[i][3] * 2  # можно добавить любой символ

print(dp[n][3])
\`\`\`

## Хеширование строк

\`\`\`python
# Быстрое сравнение подстрок через хеш
def string_hash(s):
    h = 0
    for c in s:
        h = h * 31 + ord(c)
    return h

# Для задач ЕГЭ обычно достаточно
# простого сравнения срезами
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка символьных строк',
    egeTaskNumber: 24,
    assignment: {
      title: 'Количество уникальных подстрок заданной длины',
      description: 'Считайте строку S и число K. Выведите количество различных подстрок строки S длины K.',
      difficulty: 'medium',
      starterCode: '# Считайте строку S и число K\n# Найдите количество различных подстрок длины K\n\n',
      testCases: [
        { input: 'abcabc\n3', expectedOutput: '3', description: 'abc, bca, cab — 3 различных' },
        { input: 'aaaa\n2', expectedOutput: '1', description: 'Только "aa"' },
        { input: 'abcdef\n1', expectedOutput: '6', description: 'Все символы различны' },
      ],
      points: 15,
      egeTaskNumber: 24,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 16: Задание 25 — Целые числа (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege25-integers-basics',
    title: 'Задание 25: Обработка целых чисел — делители',
    description: 'Делители числа, простые числа, НОД, НОК',
    content: `# Задание 25: Обработка целых чисел — делители

## Суть задания

Работа с делителями, простыми числами, цифрами числа. Часто нужно найти числа с определёнными свойствами.

## Нахождение делителей

\`\`\`python
def divisors(n):
    """Все делители числа n"""
    result = []
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            result.append(i)
            if i != n // i:
                result.append(n // i)
    return sorted(result)

print(divisors(36))  # [1, 2, 3, 4, 6, 9, 12, 18, 36]
\`\`\`

## Количество делителей

\`\`\`python
def count_divisors(n):
    count = 0
    for i in range(1, int(n**0.5) + 1):
        if n % i == 0:
            count += 1
            if i != n // i:
                count += 1
    return count

# Числа с ровно 4 делителями до 100
for n in range(1, 101):
    if count_divisors(n) == 4:
        print(n, end=' ')
# 6 8 10 14 15 21 22 ...
\`\`\`

## Проверка на простоту

\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True

# Сумма простых чисел до N
n = int(input())
print(sum(x for x in range(2, n + 1) if is_prime(x)))
\`\`\`

## Разложение на простые множители

\`\`\`python
def factorize(n):
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors

print(factorize(360))  # [2, 2, 2, 3, 3, 5]
\`\`\`

## НОД и НОК

\`\`\`python
from math import gcd

# НОД (наибольший общий делитель)
print(gcd(12, 18))  # 6

# НОК (наименьшее общее кратное)
def lcm(a, b):
    return a * b // gcd(a, b)

print(lcm(12, 18))  # 36

# НОД нескольких чисел
from functools import reduce
numbers = [12, 18, 24, 36]
print(reduce(gcd, numbers))  # 6
\`\`\`

## Совершенные и дружественные числа

\`\`\`python
def sum_proper_divisors(n):
    """Сумма делителей n, не считая само n"""
    s = 1
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            s += i
            if i != n // i:
                s += n // i
    return s if n > 1 else 0

# Совершенные числа: n == sum_proper_divisors(n)
for n in range(2, 10000):
    if sum_proper_divisors(n) == n:
        print(n)  # 6, 28, 496, 8128
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка целочисленной информации',
    egeTaskNumber: 25,
    assignment: {
      title: 'Числа с заданным количеством делителей',
      description: 'Считайте два числа A и B, затем число K. Выведите количество чисел в диапазоне [A, B], имеющих ровно K делителей.',
      difficulty: 'medium',
      starterCode: '# Считайте A, B и K\n# Подсчитайте числа в [A, B] с ровно K делителями\n\n',
      testCases: [
        { input: '1\n20\n4', expectedOutput: '5', description: 'Числа с 4 делителями: 6,8,10,14,15 — 5 штук' },
        { input: '1\n10\n2', expectedOutput: '4', description: 'Простые: 2,3,5,7 — 4 штуки' },
        { input: '10\n30\n6', expectedOutput: '4', description: '12,18,20,28 имеют 6 делителей' },
      ],
      points: 15,
      egeTaskNumber: 25,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 17: Задание 25 — Целые числа (часть 2)
  // ──────────────────────────────────────────
  {
    slug: 'ege25-integers-advanced',
    title: 'Задание 25: Целые числа — цифры и свойства',
    description: 'Работа с цифрами числа, суммы, произведения, специальные свойства',
    content: `# Задание 25: Целые числа — цифры и свойства

## Извлечение цифр числа

\`\`\`python
def get_digits(n):
    """Список цифр числа"""
    digits = []
    n = abs(n)
    if n == 0:
        return [0]
    while n > 0:
        digits.append(n % 10)
        n //= 10
    return digits[::-1]

print(get_digits(12345))  # [1, 2, 3, 4, 5]

# Альтернатива через строку
digits = [int(c) for c in str(abs(n))]
\`\`\`

## Сумма и произведение цифр

\`\`\`python
def digit_sum(n):
    s = 0
    n = abs(n)
    while n > 0:
        s += n % 10
        n //= 10
    return s

def digit_product(n):
    p = 1
    n = abs(n)
    while n > 0:
        d = n % 10
        if d > 0:
            p *= d
        n //= 10
    return p

print(digit_sum(12345))     # 15
print(digit_product(12345)) # 120
\`\`\`

## Типичные задачи ЕГЭ

### Числа, сумма цифр которых равна заданной

\`\`\`python
# Сколько чисел от A до B имеют сумму цифр S?
a, b = int(input()), int(input())
s = int(input())
count = sum(1 for n in range(a, b + 1) if digit_sum(n) == s)
print(count)
\`\`\`

### Числа без определённых цифр

\`\`\`python
# Сколько чисел от 1 до N не содержат цифру d?
n = int(input())
d = int(input())
count = 0
for x in range(1, n + 1):
    if str(d) not in str(x):
        count += 1
print(count)
\`\`\`

### Максимальное число с условием на цифры

\`\`\`python
# Найти наибольшее число до N,
# у которого все цифры различны
n = int(input())
for x in range(n, 0, -1):
    digits = str(x)
    if len(digits) == len(set(digits)):
        print(x)
        break
\`\`\`

## Числа в разных системах

\`\`\`python
# Найти числа до N, которые являются палиндромами
# одновременно в десятичной и двоичной системах
n = int(input())
for x in range(1, n + 1):
    dec = str(x)
    binary = bin(x)[2:]
    if dec == dec[::-1] and binary == binary[::-1]:
        print(x, binary)
\`\`\`

## Задача: ближайшее число с заданным свойством

\`\`\`python
# Найти ближайшее к N число, делящееся на сумму своих цифр
n = int(input())
for delta in range(0, n):
    for candidate in [n + delta, n - delta]:
        if candidate > 0:
            s = digit_sum(candidate)
            if s > 0 and candidate % s == 0:
                print(candidate)
                exit()
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка целочисленной информации',
    egeTaskNumber: 25,
    assignment: {
      title: 'Числа, делящиеся на сумму своих цифр',
      description: 'Считайте два числа A и B. Выведите количество чисел в диапазоне [A, B], которые делятся на сумму своих цифр.',
      difficulty: 'medium',
      starterCode: '# Считайте A и B\n# Подсчитайте числа в [A, B],\n# делящиеся на сумму своих цифр\n\n',
      testCases: [
        { input: '1\n20', expectedOutput: '13', description: '1-9 (все 9), 10,12,18,20 — итого 13' },
        { input: '100\n110', expectedOutput: '4', description: '100,102,108,110 — 4 числа' },
        { input: '1\n9', expectedOutput: '9', description: 'Все однозначные делятся на себя' },
      ],
      points: 15,
      egeTaskNumber: 25,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 18: Задание 26 — Сортировка и поиск (часть 1)
  // ──────────────────────────────────────────
  {
    slug: 'ege26-sorting-basics',
    title: 'Задание 26: Сортировка и эффективная обработка',
    description: 'Сортировка, бинарный поиск, two pointers',
    content: `# Задание 26: Сортировка и эффективная обработка

## Суть задания

Дан большой набор данных (до 10⁶ элементов). Нужна **эффективная** обработка — наивный O(n²) не пройдёт по времени.

## Встроенная сортировка

\`\`\`python
# Python sort — O(n log n)
a = [3, 1, 4, 1, 5, 9, 2, 6]
a.sort()           # на месте
b = sorted(a)      # новый список

# Сортировка по ключу
pairs = [(3, 'c'), (1, 'a'), (2, 'b')]
pairs.sort(key=lambda x: x[0])     # по первому элементу
pairs.sort(key=lambda x: x[1])     # по второму (строке)
pairs.sort(key=lambda x: -x[0])    # по убыванию
\`\`\`

## Бинарный поиск

\`\`\`python
from bisect import bisect_left, bisect_right

a = [1, 2, 4, 4, 4, 7, 9]

# Найти позицию для вставки
print(bisect_left(a, 4))    # 2 (первая 4)
print(bisect_right(a, 4))   # 5 (после последней 4)

# Количество элементов, равных x
def count_equal(a, x):
    return bisect_right(a, x) - bisect_left(a, x)

print(count_equal(a, 4))    # 3

# Количество элементов < x
def count_less(a, x):
    return bisect_left(a, x)

# Количество элементов в диапазоне [lo, hi]
def count_in_range(a, lo, hi):
    return bisect_right(a, hi) - bisect_left(a, lo)
\`\`\`

## Метод двух указателей

\`\`\`python
# Найти пару с заданной суммой в отсортированном массиве
def two_sum(a, target):
    left, right = 0, len(a) - 1
    while left < right:
        s = a[left] + a[right]
        if s == target:
            return (a[left], a[right])
        elif s < target:
            left += 1
        else:
            right -= 1
    return None

a = sorted([1, 3, 5, 7, 9, 11])
print(two_sum(a, 12))  # (1, 11) или (3, 9) или (5, 7)
\`\`\`

## Задача: количество пар с разностью K

\`\`\`python
# Эффективное решение O(n log n)
n, k = map(int, input().split())
a = sorted(list(map(int, input().split())))

count = 0
j = 0
for i in range(n):
    while j < n and a[j] - a[i] < k:
        j += 1
    if j < n and a[j] - a[i] == k:
        count += 1

print(count)
\`\`\`

## Использование множеств

\`\`\`python
# Найти общие элементы двух массивов
n = int(input())
a = set(map(int, input().split()))
m = int(input())
b = set(map(int, input().split()))

common = a & b  # пересечение — O(min(n, m))
print(len(common))
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'Количество пар с заданной разностью',
      description: 'Считайте числа N и K, затем N целых чисел. Найдите количество пар (i, j), i < j, таких что |a[i] - a[j]| = K. Решение должно работать за O(n log n).',
      difficulty: 'hard',
      starterCode: '# Считайте N, K и массив\n# Найдите количество пар с разностью K\n# Эффективно!\n\n',
      testCases: [
        { input: '5 2\n1 3 5 7 9', expectedOutput: '4', description: 'Пары: (1,3),(3,5),(5,7),(7,9)' },
        { input: '4 0\n1 1 1 1', expectedOutput: '6', description: 'Все пары: C(4,2)=6' },
        { input: '3 10\n1 2 3', expectedOutput: '0', description: 'Нет пар с разностью 10' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 19: Задание 26 — DP и жадные алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'ege26-dp-greedy',
    title: 'Задание 26: Динамическое программирование и жадные алгоритмы',
    description: 'Классические задачи DP, жадные стратегии, оптимизация',
    content: `# Задание 26: DP и жадные алгоритмы

## Динамическое программирование

### Задача о рюкзаке (0/1)

\`\`\`python
# N предметов, рюкзак вместимостью W
# Каждый предмет: вес w[i], стоимость v[i]
n, W = map(int, input().split())
items = []
for _ in range(n):
    w, v = map(int, input().split())
    items.append((w, v))

dp = [0] * (W + 1)
for w, v in items:
    for j in range(W, w - 1, -1):
        dp[j] = max(dp[j], dp[j - w] + v)

print(dp[W])
\`\`\`

### Наибольшая возрастающая подпоследовательность (НВП)

\`\`\`python
# O(n²) решение
n = int(input())
a = list(map(int, input().split()))

dp = [1] * n
for i in range(1, n):
    for j in range(i):
        if a[j] < a[i]:
            dp[i] = max(dp[i], dp[j] + 1)

print(max(dp))
\`\`\`

### Количество путей в таблице

\`\`\`python
# Из (1,1) в (n,m), движение вправо или вниз
n, m = map(int, input().split())
dp = [[0] * (m + 1) for _ in range(n + 1)]
dp[1][1] = 1

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if i == 1 and j == 1:
            continue
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1]

print(dp[n][m])
\`\`\`

## Жадные алгоритмы

### Задача о покрытии отрезками

\`\`\`python
# Дано N отрезков [l, r]. Выбрать минимальное количество,
# покрывающих точку X.
n = int(input())
x = int(input())
segments = []
for _ in range(n):
    l, r = map(int, input().split())
    if l <= x <= r:
        segments.append((l, r))

# Жадно: выбираем отрезок, покрывающий x с макс. правой границей
segments.sort(key=lambda s: -s[1])
print(1 if segments else 0)
\`\`\`

### Задача об активностях

\`\`\`python
# Максимальное количество непересекающихся отрезков
n = int(input())
events = []
for _ in range(n):
    l, r = map(int, input().split())
    events.append((r, l))  # сортируем по правому концу

events.sort()
count = 0
last_end = -1

for end, start in events:
    if start >= last_end:
        count += 1
        last_end = end

print(count)
\`\`\`

## Префиксные суммы

\`\`\`python
# Быстрая сумма на отрезке
n = int(input())
a = list(map(int, input().split()))

# Построение префиксных сумм
prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + a[i]

# Сумма на отрезке [l, r] (0-indexed)
def range_sum(l, r):
    return prefix[r + 1] - prefix[l]

print(range_sum(1, 3))  # a[1] + a[2] + a[3]
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'Наибольшая возрастающая подпоследовательность',
      description: 'Считайте число N, затем N целых чисел. Найдите длину наибольшей строго возрастающей подпоследовательности.',
      difficulty: 'hard',
      starterCode: '# Считайте N и массив\n# Найдите длину наибольшей\n# возрастающей подпоследовательности\n\n',
      testCases: [
        { input: '6\n3 1 4 1 5 9', expectedOutput: '4', description: '1,4,5,9 — длина 4' },
        { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — длина 1' },
        { input: '5\n1 2 3 4 5', expectedOutput: '5', description: 'Уже возрастающая — длина 5' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 20: Задание 26 — Графы
  // ──────────────────────────────────────────
  {
    slug: 'ege26-graphs',
    title: 'Задание 26: Графы — обход и кратчайшие пути',
    description: 'BFS, DFS, алгоритм Дейкстры, компоненты связности',
    content: `# Задание 26: Графы

## Представление графа

\`\`\`python
# Список смежности
n, m = map(int, input().split())  # вершины, рёбра
graph = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)  # для неориентированного
\`\`\`

## BFS — поиск в ширину

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

# Кратчайшее расстояние от вершины 1 до всех остальных
distances = bfs(graph, 1)
\`\`\`

## DFS — поиск в глубину

\`\`\`python
def dfs(graph, v, visited):
    visited.add(v)
    for u in graph[v]:
        if u not in visited:
            dfs(graph, u, visited)

# Компоненты связности
def count_components(graph, n):
    visited = set()
    count = 0
    for v in range(1, n + 1):
        if v not in visited:
            dfs(graph, v, visited)
            count += 1
    return count
\`\`\`

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

## Топологическая сортировка

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

    return order
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'Компоненты связности графа',
      description: 'Считайте N (вершины) и M (рёбра), затем M пар вершин. Выведите количество компонент связности неориентированного графа.',
      difficulty: 'medium',
      starterCode: '# Считайте N и M\n# Считайте M рёбер\n# Найдите количество компонент связности\n\n',
      testCases: [
        { input: '5 3\n1 2\n3 4\n4 5', expectedOutput: '2', description: '{1,2} и {3,4,5} — 2 компоненты' },
        { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1', description: 'Все связаны — 1 компонента' },
        { input: '3 0', expectedOutput: '3', description: 'Нет рёбер — 3 компоненты' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 21: Задание 27 — Введение
  // ──────────────────────────────────────────
  {
    slug: 'ege27-intro',
    title: 'Задание 27: Сложная задача — стратегия решения',
    description: 'Подходы к решению задания 27, анализ условия, выбор алгоритма',
    content: `# Задание 27: Сложная задача — стратегия решения

## Суть задания

Задание 27 — самое сложное в ЕГЭ (**4 балла**). Требуется написать **эффективную** программу. Оценивается:
- **2 балла** — правильное, но неэффективное решение (перебор)
- **4 балла** — правильное и эффективное решение

## Типичные темы задания 27

1. Обработка последовательности с условиями
2. Поиск пар/троек элементов
3. Оптимизация с ограничениями
4. Динамическое программирование

## Стратегия решения

### Шаг 1: Напишите наивное решение (на 2 балла)

\`\`\`python
# Задача: найти пару чисел с максимальным произведением,
# делящимся на K
n, k = map(int, input().split())
a = list(map(int, input().split()))

max_prod = -1
for i in range(n):
    for j in range(i + 1, n):
        prod = a[i] * a[j]
        if prod % k == 0 and prod > max_prod:
            max_prod = prod

print(max_prod)
# O(n²) — получит 2 балла
\`\`\`

### Шаг 2: Оптимизируйте (на 4 балла)

\`\`\`python
# Тот же пример: группируем по остаткам
from math import gcd

n, k = map(int, input().split())
a = list(map(int, input().split()))

# Для каждого остатка r = a[i] % k
# храним максимальный элемент
best = {}

max_prod = -1
for x in a:
    r = x % k
    # Какой остаток нужен у партнёра?
    # x * y % k == 0 ⟺ (r * r2) % k == 0
    for r2 in best:
        if (r * r2) % k == 0:
            max_prod = max(max_prod, x * best[r2])

    if r not in best or x > best[r]:
        best[r] = x

print(max_prod)
# O(n * k) — эффективно при малом k
\`\`\`

## Шаблон решения задания 27

\`\`\`python
# 1. Прочитайте данные
n = int(input())
a = list(map(int, input().split()))

# 2. Наивное решение для проверки
def naive(a):
    # O(n²) или O(n³) перебор
    pass

# 3. Эффективное решение
def efficient(a):
    # Используйте сортировку / DP / хеш-таблицу
    pass

# 4. Проверка на тестах
print(efficient(a))
\`\`\`

## Частые ошибки

1. **Забыли граничные случаи**: пустой массив, один элемент
2. **Переполнение**: используйте Python — нет переполнения!
3. **Неправильный порядок обхода**: убедитесь, что не считаете элемент дважды
4. **Не тот тип сложности**: O(n log n) vs O(n) может быть важно`,
    duration: 45,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Пара с максимальным произведением (наивное решение)',
      description: 'Считайте N и K, затем N натуральных чисел. Найдите максимальное произведение пары чисел из массива, которое делится на K. Гарантируется, что такая пара существует. Допустимо решение O(n²).',
      difficulty: 'medium',
      starterCode: '# Считайте N, K и массив\n# Найдите макс. произведение пары, делящееся на K\n\n',
      testCases: [
        { input: '5 3\n2 3 5 7 6', expectedOutput: '42', description: '7*6=42, делится на 3' },
        { input: '4 2\n1 3 5 4', expectedOutput: '20', description: '5*4=20, делится на 2' },
        { input: '3 5\n5 10 3', expectedOutput: '50', description: '5*10=50, делится на 5' },
      ],
      points: 15,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 22: Задание 27 — Обработка последовательностей
  // ──────────────────────────────────────────
  {
    slug: 'ege27-sequences',
    title: 'Задание 27: Обработка последовательностей',
    description: 'Эффективный поиск пар/троек, группировка по свойствам',
    content: `# Задание 27: Обработка последовательностей

## Задача: два максимума с условием

\`\`\`python
# Найти два числа с макс. суммой,
# дающие при делении на K разные остатки
n, k = map(int, input().split())
a = list(map(int, input().split()))

# Храним максимум для каждого остатка
best = {}
for x in a:
    r = x % k
    if r not in best or x > best[r]:
        best[r] = x

# Перебираем пары остатков
max_sum = -1
remainders = list(best.keys())
for i in range(len(remainders)):
    for j in range(i + 1, len(remainders)):
        max_sum = max(max_sum, best[remainders[i]] + best[remainders[j]])

print(max_sum)
\`\`\`

## Задача: подмассив с максимальной суммой

\`\`\`python
# Алгоритм Кадане — O(n)
n = int(input())
a = list(map(int, input().split()))

max_sum = a[0]
current = a[0]
for i in range(1, n):
    current = max(a[i], current + a[i])
    max_sum = max(max_sum, current)

print(max_sum)
\`\`\`

## Задача: ближайшая пара

\`\`\`python
# Найти минимальную разность между элементами
n = int(input())
a = sorted(list(map(int, input().split())))

min_diff = float('inf')
for i in range(n - 1):
    min_diff = min(min_diff, a[i + 1] - a[i])

print(min_diff)
\`\`\`

## Задача: количество «хороших» подотрезков

\`\`\`python
# Подотрезок хороший, если максимум - минимум <= K
# Метод скользящего окна с deque
from collections import deque

n, k = map(int, input().split())
a = list(map(int, input().split()))

max_q = deque()  # убывающая очередь
min_q = deque()  # возрастающая очередь
count = 0
left = 0

for right in range(n):
    while max_q and a[max_q[-1]] <= a[right]:
        max_q.pop()
    max_q.append(right)

    while min_q and a[min_q[-1]] >= a[right]:
        min_q.pop()
    min_q.append(right)

    while a[max_q[0]] - a[min_q[0]] > k:
        left += 1
        if max_q[0] < left:
            max_q.popleft()
        if min_q[0] < left:
            min_q.popleft()

    count += right - left + 1

print(count)
\`\`\`

## Задача: медиана онлайн

\`\`\`python
import heapq

# Поддержка медианы при добавлении элементов
max_heap = []  # левая половина (инвертированная)
min_heap = []  # правая половина

def add_num(num):
    heapq.heappush(max_heap, -num)
    heapq.heappush(min_heap, -heapq.heappop(max_heap))
    if len(min_heap) > len(max_heap):
        heapq.heappush(max_heap, -heapq.heappop(min_heap))

def get_median():
    if len(max_heap) > len(min_heap):
        return -max_heap[0]
    return (-max_heap[0] + min_heap[0]) / 2
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Подмассив с максимальной суммой',
      description: 'Считайте число N, затем N целых чисел (могут быть отрицательными). Найдите максимальную сумму непустого подмассива (подряд идущих элементов). Решение должно работать за O(n).',
      difficulty: 'hard',
      starterCode: '# Считайте N и массив\n# Найдите макс. сумму подмассива\n# Алгоритм Кадане\n\n',
      testCases: [
        { input: '5\n-2 1 -3 4 -1', expectedOutput: '4', description: 'Подмассив [4] — сумма 4' },
        { input: '6\n-2 1 -3 4 -1 2', expectedOutput: '5', description: '[4,-1,2] — сумма 5' },
        { input: '3\n-1 -2 -3', expectedOutput: '-1', description: 'Все отрицательные, берём -1' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 23: Задание 27 — DP задачи
  // ──────────────────────────────────────────
  {
    slug: 'ege27-dp-problems',
    title: 'Задание 27: Динамическое программирование',
    description: 'Классические DP задачи для задания 27: подпоследовательности, разбиения',
    content: `# Задание 27: Динамическое программирование

## Задача: количество способов разменять сумму

\`\`\`python
# Есть монеты номиналов coins[].
# Сколькими способами можно набрать сумму S?
s = int(input())
coins = list(map(int, input().split()))

dp = [0] * (s + 1)
dp[0] = 1

for coin in coins:
    for j in range(coin, s + 1):
        dp[j] += dp[j - coin]

print(dp[s])
\`\`\`

## Задача: минимальное количество монет

\`\`\`python
s = int(input())
coins = list(map(int, input().split()))

dp = [float('inf')] * (s + 1)
dp[0] = 0

for i in range(1, s + 1):
    for coin in coins:
        if coin <= i and dp[i - coin] + 1 < dp[i]:
            dp[i] = dp[i - coin] + 1

print(dp[s] if dp[s] != float('inf') else -1)
\`\`\`

## Задача: редакционное расстояние

\`\`\`python
# Минимальное число операций для превращения s1 в s2
# Операции: вставка, удаление, замена символа
s1 = input()
s2 = input()
n, m = len(s1), len(s2)

dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(n + 1):
    dp[i][0] = i
for j in range(m + 1):
    dp[0][j] = j

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i - 1] == s2[j - 1]:
            dp[i][j] = dp[i - 1][j - 1]
        else:
            dp[i][j] = 1 + min(
                dp[i - 1][j],      # удаление
                dp[i][j - 1],      # вставка
                dp[i - 1][j - 1]   # замена
            )

print(dp[n][m])
\`\`\`

## Задача: наибольшая общая подпоследовательность (НОП)

\`\`\`python
s1 = input()
s2 = input()
n, m = len(s1), len(s2)

dp = [[0] * (m + 1) for _ in range(n + 1)]

for i in range(1, n + 1):
    for j in range(1, m + 1):
        if s1[i - 1] == s2[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

print(dp[n][m])
\`\`\`

## Задача: разбиение числа на слагаемые

\`\`\`python
# Количество способов представить N как сумму
# натуральных чисел (без учёта порядка)
n = int(input())

dp = [0] * (n + 1)
dp[0] = 1

for i in range(1, n + 1):
    for j in range(i, n + 1):
        dp[j] += dp[j - i]

print(dp[n])
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Размен суммы монетами',
      description: 'Считайте сумму S и набор номиналов монет. Выведите минимальное количество монет для размена суммы S. Если размен невозможен, выведите -1.',
      difficulty: 'hard',
      starterCode: '# Считайте S\n# Считайте номиналы монет\n# Найдите минимальное количество монет\n\n',
      testCases: [
        { input: '11\n1 5 6', expectedOutput: '2', description: '11 = 5 + 6' },
        { input: '15\n1 5 10', expectedOutput: '2', description: '15 = 5 + 10' },
        { input: '3\n2', expectedOutput: '-1', description: '3 нельзя разменять монетами по 2' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 24: Задание 27 — Комплексные задачи
  // ──────────────────────────────────────────
  {
    slug: 'ege27-complex-problems',
    title: 'Задание 27: Комплексные задачи',
    description: 'Задачи, сочетающие несколько алгоритмических приёмов',
    content: `# Задание 27: Комплексные задачи

## Задача: максимальная прибыль

> Даны цены акции за N дней. Можно совершить не более одной сделки (купить и продать). Найти максимальную прибыль.

\`\`\`python
n = int(input())
prices = list(map(int, input().split()))

min_price = prices[0]
max_profit = 0

for i in range(1, n):
    max_profit = max(max_profit, prices[i] - min_price)
    min_price = min(min_price, prices[i])

print(max_profit)
\`\`\`

## Задача: два максимума с чётностью

> Найти максимальную сумму двух элементов массива, имеющих разную чётность.

\`\`\`python
n = int(input())
a = list(map(int, input().split()))

max_even = max_odd = float('-inf')

for x in a:
    if x % 2 == 0:
        max_even = max(max_even, x)
    else:
        max_odd = max(max_odd, x)

if max_even == float('-inf') or max_odd == float('-inf'):
    print(-1)
else:
    print(max_even + max_odd)
\`\`\`

## Задача: тройки с заданным свойством

> Найти количество троек (i, j, k), i < j < k, таких что a[i] < a[j] < a[k].

\`\`\`python
# Эффективное решение O(n²)
n = int(input())
a = list(map(int, input().split()))

count = 0
for j in range(1, n - 1):
    # Считаем элементы меньше a[j] слева
    left = sum(1 for i in range(j) if a[i] < a[j])
    # Считаем элементы больше a[j] справа
    right = sum(1 for k in range(j + 1, n) if a[k] > a[j])
    count += left * right

print(count)
\`\`\`

## Задача: разделение массива

> Разделить массив на два подмассива с минимальной разницей сумм.

\`\`\`python
n = int(input())
a = list(map(int, input().split()))
total = sum(a)

# DP: можно ли набрать сумму s из элементов?
dp = [False] * (total + 1)
dp[0] = True

for x in a:
    for s in range(total, x - 1, -1):
        if dp[s - x]:
            dp[s] = True

# Ищем s ≤ total/2, максимально близкое к total/2
best = 0
for s in range(total // 2 + 1):
    if dp[s]:
        best = s

print(total - 2 * best)
\`\`\`

## Задача: максимальное произведение трёх чисел

\`\`\`python
n = int(input())
a = sorted(list(map(int, input().split())))

# Либо три максимальных, либо два минимальных + максимальный
option1 = a[-1] * a[-2] * a[-3]
option2 = a[0] * a[1] * a[-1]
print(max(option1, option2))
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Максимальная прибыль по акциям',
      description: 'Считайте N, затем N целых чисел — цены акции за N дней. Найдите максимальную прибыль от одной сделки (купить в день i, продать в день j, i < j). Если прибыль невозможна, выведите 0.',
      difficulty: 'medium',
      starterCode: '# Считайте N и цены\n# Найдите максимальную прибыль\n# от одной сделки\n\n',
      testCases: [
        { input: '6\n7 1 5 3 6 4', expectedOutput: '5', description: 'Купить за 1, продать за 6: прибыль 5' },
        { input: '5\n7 6 4 3 1', expectedOutput: '0', description: 'Цены только падают — прибыли нет' },
        { input: '4\n1 2 3 4', expectedOutput: '3', description: 'Купить за 1, продать за 4: прибыль 3' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 25: Итоговая контрольная
  // ──────────────────────────────────────────
  {
    slug: 'ege-final-review',
    title: 'Итоговый практикум: решение вариантов ЕГЭ',
    description: 'Комплексное повторение всех типов заданий, разбор полных вариантов',
    content: `# Итоговый практикум: решение вариантов ЕГЭ

## Чек-лист по заданиям

| Задание | Тема | Ключевой приём |
|---------|------|----------------|
| 6 | Исполнители | DP / BFS подсчёт программ |
| 12 | Анализ алгоритмов | Трассировка / запуск кода |
| 14 | Системы счисления | \`int(s, base)\`, \`bin/oct/hex\` |
| 16 | Рекурсия | Мемоизация, дерево вызовов |
| 17 | Обработка файлов | Потоковая обработка, \`max/min\` |
| 23 | Логические уравнения | DP по состояниям / перебор |
| 24 | Строки | Срезы, \`find\`, \`count\`, множества |
| 25 | Целые числа | Делители, цифры, простые числа |
| 26 | Эффективная обработка | Сортировка, бинпоиск, графы |
| 27 | Сложная задача | DP, два указателя, хеш |

## Шаблоны быстрого решения

### Чтение данных

\`\`\`python
# Одно число
n = int(input())

# Числа в строке
a = list(map(int, input().split()))

# N строк по одному числу
data = [int(input()) for _ in range(n)]

# Пары
pairs = [tuple(map(int, input().split())) for _ in range(n)]
\`\`\`

### Стандартные алгоритмы

\`\`\`python
from functools import lru_cache
from collections import deque, Counter, defaultdict
from itertools import product, combinations
from bisect import bisect_left, bisect_right
from math import gcd, log2
import heapq

# НОД
gcd(a, b)

# Быстрая проверка простоты
def is_prime(n):
    if n < 2: return False
    if n < 4: return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0: return False
        i += 6
    return True

# Факторизация
def factorize(n):
    f = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            f.append(d)
            n //= d
        d += 1
    if n > 1: f.append(n)
    return f

# BFS
def bfs(graph, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        v = q.popleft()
        for u in graph[v]:
            if u not in dist:
                dist[u] = dist[v] + 1
                q.append(u)
    return dist
\`\`\`

## Советы на экзамене

1. **Начинайте с простого** — сначала задания 12, 14, 17
2. **Пишите наивное решение** задания 27 на 2 балла, потом оптимизируйте
3. **Проверяйте на примерах** — запускайте код
4. **Не тратьте больше 15 минут** на одно задание
5. **Используйте Python** — он проще и нет переполнения
6. **Импортируйте** \`lru_cache\`, \`deque\`, \`bisect\` — они разрешены

## Типичные ошибки

- Забыли \`abs()\` при подсчёте разности
- Перепутали \`//\` и \`/\` (целочисленное vs обычное деление)
- Не обработали случай \`n = 0\` или \`n = 1\`
- Забыли, что \`range(a, b)\` не включает \`b\`
- Использовали изменяемый объект как значение по умолчанию`,
    duration: 60,
    egeTopic: 'Повторение',
    egeTaskNumber: null,
    assignment: {
      title: 'Комплексная задача ЕГЭ',
      description: 'Считайте число N, затем N натуральных чисел. Найдите два числа в массиве, произведение которых максимально, при условии что одно из них чётное, а другое нечётное. Выведите это произведение. Если такой пары нет, выведите -1.',
      difficulty: 'hard',
      starterCode: '# Считайте N и массив\n# Найдите макс. произведение пары (чётное * нечётное)\n# Если пары нет — выведите -1\n\n',
      testCases: [
        { input: '5\n3 8 5 2 7', expectedOutput: '56', description: '8*7=56 — макс. произведение чётного и нечётного' },
        { input: '3\n2 4 6', expectedOutput: '-1', description: 'Нет нечётных чисел' },
        { input: '4\n1 10 3 20', expectedOutput: '60', description: '20*3=60' },
      ],
      points: 20,
    },
  },
];
