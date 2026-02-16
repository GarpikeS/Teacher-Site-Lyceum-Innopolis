import { db } from '../config/database';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { python10Lessons } from './seed-grade10-python';
import { cpp10Lessons } from './seed-grade10-cpp';
import { python11Lessons } from './seed-grade11-python';
import { cpp11Lessons } from './seed-grade11-cpp';
import { infosec78Lessons } from './seed-infosec78';
import { infosec910Lessons } from './seed-infosec910';
import { infosec11Lessons } from './seed-infosec11';

// ============================================
// Seed Data for Code Learning Platform
// 6 courses (7/10/11 grade), lessons, assignments, test cases
// ============================================

async function seed() {
  logger.info('Starting database seeding...');

  try {
    // ============================================
    // 1. USERS
    // ============================================
    const passwordHash = await bcrypt.hash('Bambuk24', 10);

    const usersResult = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, is_email_verified)
      VALUES
        ('sivaevva@admin.ru', $1, 'admin', 'Владислав', 'Сиваев', true)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
      RETURNING id, email, role`,
      [passwordHash]
    );

    const users = usersResult.rows;
    const teacher = users[0]; // admin has teacher privileges
    const students: any[] = [];

    logger.info(`Created ${users.length} users`);

    // ============================================
    // 2. COURSES
    // ============================================
    const coursesResult = await db.query(
      `INSERT INTO courses (slug, title, description, language, level, order_index, estimated_hours, is_published, created_by, grade)
      VALUES
        ('python-7-advanced', 'Python для 7 класса', 'Углублённый курс программирования на Python. Изучение основ алгоритмизации, работа с данными, функции и основы ООП.', 'python', 'advanced', 1, 40, true, $1, 7),
        ('cpp-7-advanced', 'C++ для 7 класса', 'Углублённый курс программирования на C++. Изучение синтаксиса, работа с памятью, структуры данных и основы ООП.', 'cpp', 'advanced', 2, 45, true, $1, 7),
        ('python-10-advanced', 'Python для 10 класса', 'Углублённый курс: алгоритмы, структуры данных, рекурсия, ДП, графы. Подготовка к олимпиадам и проектная работа.', 'python', 'advanced', 3, 60, true, $1, 10),
        ('cpp-10-advanced', 'C++ для 10 класса', 'Углублённый курс: указатели, STL, алгоритмы, структуры данных, шаблоны. Подготовка к олимпиадам.', 'cpp', 'advanced', 4, 65, true, $1, 10),
        ('python-11-ege', 'Python для 11 класса (ЕГЭ)', 'Подготовка к ЕГЭ по информатике на Python. Разбор заданий 6, 12, 14, 16, 17, 23-27. Продвинутые алгоритмы.', 'python', 'advanced', 5, 70, true, $1, 11),
        ('cpp-11-ege', 'C++ для 11 класса (ЕГЭ)', 'Подготовка к ЕГЭ по информатике на C++. Разбор заданий 6, 12, 14, 16, 17, 24-27. Продвинутые алгоритмы.', 'cpp', 'advanced', 6, 70, true, $1, 11),
        ('infosec-78', 'Информационная безопасность 7-8 класс', 'Криптография, стеганография, веб-безопасность и форензика. Олимпиадный уровень для 7-8 классов.', 'python', 'advanced', 7, 50, true, $1, 7),
        ('infosec-910', 'Информационная безопасность 9-10 класс', 'RSA, сетевая безопасность, форензика, reverse engineering и CTF. Олимпиадный уровень для 9-10 классов.', 'python', 'advanced', 8, 60, true, $1, 9),
        ('infosec-11', 'Информационная безопасность 11 класс', 'Продвинутая криптография, веб-эксплуатация, бинарная эксплуатация, OSINT и подготовка к CTF.', 'python', 'advanced', 9, 70, true, $1, 11)
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
      RETURNING id, slug`,
      [teacher.id]
    );

    const pythonCourse = coursesResult.rows[0];
    const cppCourse = coursesResult.rows[1];
    const python10Course = coursesResult.rows[2];
    const cpp10Course = coursesResult.rows[3];
    const python11Course = coursesResult.rows[4];
    const cpp11Course = coursesResult.rows[5];
    const infosec78Course = coursesResult.rows[6];
    const infosec910Course = coursesResult.rows[7];
    const infosec11Course = coursesResult.rows[8];

    logger.info('Created 9 courses');

    // ============================================
    // 3. PYTHON LESSONS (20)
    // ============================================
    const pythonLessons = [
      {
        slug: 'variables-and-types',
        title: 'Переменные и типы данных',
        description: 'Знакомство с переменными, числами, строками и логическими значениями в Python',
        content: `# Переменные и типы данных в Python

## Что такое переменная?

Переменная — это именованная область памяти, в которой хранится значение. В Python переменные создаются при первом присваивании.

\`\`\`python
name = "Алексей"
age = 13
height = 1.65
is_student = True
\`\`\`

## Основные типы данных

| Тип | Описание | Пример |
|-----|----------|--------|
| \`int\` | Целое число | \`42\` |
| \`float\` | Дробное число | \`3.14\` |
| \`str\` | Строка | \`"Привет"\` |
| \`bool\` | Логическое значение | \`True\` / \`False\` |

## Функция type()

Чтобы узнать тип переменной, используйте функцию \`type()\`:

\`\`\`python
x = 42
print(type(x))  # <class 'int'>
\`\`\`

## Преобразование типов

\`\`\`python
# Строка в число
num = int("42")

# Число в строку
text = str(100)

# Целое в дробное
pi = float(3)
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Работа с переменными',
          description: 'Создайте переменные разных типов и выведите их значения и типы.',
          difficulty: 'easy',
          starterCode: '# Создайте переменные:\n# name (строка с вашим именем)\n# age (целое число — ваш возраст)\n# grade (дробное число — ваша средняя оценка)\n# Выведите каждую переменную\n\n',
          testCases: [
            { input: '', expectedOutput: '', description: 'Программа выводит 3 значения' }
          ],
          points: 10,
        },
      },
      {
        slug: 'input-output',
        title: 'Ввод и вывод данных',
        description: 'Функции print() и input(), форматирование строк',
        content: `# Ввод и вывод данных

## Функция print()

\`\`\`python
print("Привет, мир!")
print("Имя:", "Алексей")
print(f"Мне {13} лет")
\`\`\`

## Функция input()

\`\`\`python
name = input("Как тебя зовут? ")
print(f"Привет, {name}!")
\`\`\`

## f-строки (форматирование)

\`\`\`python
name = "Алексей"
age = 13
print(f"Меня зовут {name}, мне {age} лет")
\`\`\`

## Разделитель и конец строки

\`\`\`python
print("a", "b", "c", sep="-")  # a-b-c
print("Привет", end=" ")
print("мир")  # Привет мир
\`\`\``,
        duration: 25,
        assignment: {
          title: 'Приветствие пользователя',
          description: 'Напишите программу, которая считывает имя и возраст, затем выводит приветствие.',
          difficulty: 'easy',
          starterCode: '# Считайте имя пользователя\n# Считайте возраст\n# Выведите: "Привет, <имя>! Тебе <возраст> лет."\n\n',
          testCases: [
            { input: 'Алексей\n13', expectedOutput: 'Привет, Алексей! Тебе 13 лет.', description: 'Имя Алексей, возраст 13' },
            { input: 'Мария\n14', expectedOutput: 'Привет, Мария! Тебе 14 лет.', description: 'Имя Мария, возраст 14' },
          ],
          points: 10,
        },
      },
      {
        slug: 'arithmetic',
        title: 'Арифметические операции',
        description: 'Математические операции, приоритеты, целочисленное деление и остаток',
        content: `# Арифметические операции

## Основные операции

| Операция | Оператор | Пример |
|----------|----------|--------|
| Сложение | \`+\` | \`5 + 3 = 8\` |
| Вычитание | \`-\` | \`5 - 3 = 2\` |
| Умножение | \`*\` | \`5 * 3 = 15\` |
| Деление | \`/\` | \`7 / 2 = 3.5\` |
| Целочисленное деление | \`//\` | \`7 // 2 = 3\` |
| Остаток от деления | \`%\` | \`7 % 2 = 1\` |
| Возведение в степень | \`**\` | \`2 ** 3 = 8\` |

## Приоритет операций

1. \`**\` (степень)
2. \`*\`, \`/\`, \`//\`, \`%\`
3. \`+\`, \`-\`

Скобки меняют порядок: \`(2 + 3) * 4 = 20\`

## Составное присваивание

\`\`\`python
x = 10
x += 5   # x = 15
x -= 3   # x = 12
x *= 2   # x = 24
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Калькулятор',
          description: 'Напишите программу, которая считывает два числа и выводит результат всех арифметических операций.',
          difficulty: 'easy',
          starterCode: '# Считайте два числа a и b\n# Выведите:\n# a + b = результат\n# a - b = результат\n# a * b = результат\n# a / b = результат\n\n',
          testCases: [
            { input: '10\n3', expectedOutput: '10 + 3 = 13\n10 - 3 = 7\n10 * 3 = 30\n10 / 3 = 3.3333333333333335', description: '10 и 3' },
          ],
          points: 10,
        },
      },
      {
        slug: 'strings',
        title: 'Строки',
        description: 'Работа со строками: индексация, срезы, основные методы',
        content: `# Строки в Python

## Создание строк

\`\`\`python
s1 = 'Одинарные кавычки'
s2 = "Двойные кавычки"
s3 = """Многострочная
строка"""
\`\`\`

## Индексация

\`\`\`python
s = "Python"
print(s[0])   # P
print(s[-1])  # n
\`\`\`

## Срезы

\`\`\`python
s = "Hello, World!"
print(s[0:5])   # Hello
print(s[7:])    # World!
print(s[::-1])  # !dlroW ,olleH
\`\`\`

## Полезные методы

\`\`\`python
s = "Hello, World!"
print(s.upper())        # HELLO, WORLD!
print(s.lower())        # hello, world!
print(s.replace("World", "Python"))  # Hello, Python!
print(len(s))           # 13
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Обработка строк',
          description: 'Напишите программу, которая считывает строку и выводит её длину, первый и последний символы, строку в верхнем регистре.',
          difficulty: 'easy',
          starterCode: '# Считайте строку\n# Выведите:\n# Длина: <число>\n# Первый символ: <символ>\n# Последний символ: <символ>\n# Верхний регистр: <строка>\n\n',
          testCases: [
            { input: 'Python', expectedOutput: 'Длина: 6\nПервый символ: P\nПоследний символ: n\nВерхний регистр: PYTHON', description: 'Строка Python' },
          ],
          points: 10,
        },
      },
      {
        slug: 'conditionals',
        title: 'Условные конструкции (if/else)',
        description: 'Операторы сравнения, логические операторы, условные ветвления',
        content: `# Условные конструкции

## if / elif / else

\`\`\`python
age = int(input("Возраст: "))

if age < 7:
    print("Дошкольник")
elif age < 18:
    print("Школьник")
else:
    print("Взрослый")
\`\`\`

## Операторы сравнения

| Оператор | Значение |
|----------|----------|
| \`==\` | Равно |
| \`!=\` | Не равно |
| \`<\`, \`>\` | Меньше, больше |
| \`<=\`, \`>=\` | Меньше или равно, больше или равно |

## Логические операторы

\`\`\`python
if age >= 7 and age <= 17:
    print("Школьник")

if grade == 5 or grade == 4:
    print("Хорошо!")

if not is_absent:
    print("Присутствует")
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Определение оценки',
          description: 'Напишите программу, которая по баллам (0-100) выводит оценку: 90-100 = "5", 70-89 = "4", 50-69 = "3", ниже 50 = "2".',
          difficulty: 'easy',
          starterCode: '# Считайте количество баллов\n# Выведите оценку\n\n',
          testCases: [
            { input: '95', expectedOutput: '5', description: '95 баллов = 5' },
            { input: '75', expectedOutput: '4', description: '75 баллов = 4' },
            { input: '55', expectedOutput: '3', description: '55 баллов = 3' },
            { input: '30', expectedOutput: '2', description: '30 баллов = 2' },
          ],
          points: 10,
        },
      },
      {
        slug: 'while-loops',
        title: 'Цикл while',
        description: 'Цикл с условием, break, continue, бесконечные циклы',
        content: `# Цикл while

## Основной синтаксис

\`\`\`python
count = 1
while count <= 5:
    print(count)
    count += 1
\`\`\`

## break и continue

\`\`\`python
# break — выход из цикла
while True:
    answer = input("Введите 'выход': ")
    if answer == "выход":
        break

# continue — пропуск итерации
i = 0
while i < 10:
    i += 1
    if i % 2 == 0:
        continue
    print(i)  # Только нечётные
\`\`\`

## Сумма чисел

\`\`\`python
total = 0
n = int(input("Сколько чисел? "))
i = 0
while i < n:
    num = int(input())
    total += num
    i += 1
print("Сумма:", total)
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Сумма до нуля',
          description: 'Напишите программу, которая считывает числа до тех пор, пока не введён 0, и выводит их сумму.',
          difficulty: 'medium',
          starterCode: '# Считывайте числа, пока не введён 0\n# Выведите сумму всех введённых чисел (без 0)\n\n',
          testCases: [
            { input: '5\n3\n-2\n0', expectedOutput: '6', description: '5 + 3 + (-2) = 6' },
            { input: '10\n20\n30\n0', expectedOutput: '60', description: '10 + 20 + 30 = 60' },
          ],
          points: 15,
        },
      },
      {
        slug: 'for-loops',
        title: 'Цикл for',
        description: 'Цикл for, функция range(), перебор элементов',
        content: `# Цикл for

## range()

\`\`\`python
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):    # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8
    print(i)
\`\`\`

## Перебор строки

\`\`\`python
for char in "Python":
    print(char)
\`\`\`

## Вложенные циклы

\`\`\`python
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} * {j} = {i * j}")
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Таблица умножения',
          description: 'Напишите программу, которая считывает число N и выводит таблицу умножения для числа N (от 1 до 10).',
          difficulty: 'easy',
          starterCode: '# Считайте число N\n# Выведите таблицу умножения N\n# Формат: N * i = результат\n\n',
          testCases: [
            { input: '5', expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50', description: 'Таблица для 5' },
          ],
          points: 10,
        },
      },
      {
        slug: 'lists',
        title: 'Списки',
        description: 'Создание списков, индексация, методы append, insert, remove, sort',
        content: `# Списки в Python

## Создание

\`\`\`python
numbers = [1, 2, 3, 4, 5]
names = ["Алексей", "Мария", "Дмитрий"]
mixed = [1, "hello", True, 3.14]
empty = []
\`\`\`

## Основные операции

\`\`\`python
nums = [10, 20, 30]
nums.append(40)       # [10, 20, 30, 40]
nums.insert(1, 15)    # [10, 15, 20, 30, 40]
nums.remove(20)       # [10, 15, 30, 40]
last = nums.pop()     # 40, nums = [10, 15, 30]
nums.sort()           # [10, 15, 30]
print(len(nums))      # 3
\`\`\`

## Перебор списка

\`\`\`python
for item in nums:
    print(item)

for i, item in enumerate(nums):
    print(f"{i}: {item}")
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Работа со списком',
          description: 'Считайте N чисел, сохраните в список, выведите сумму, максимум, минимум и среднее.',
          difficulty: 'medium',
          starterCode: '# Считайте N — количество чисел\n# Считайте N чисел и сохраните в список\n# Выведите:\n# Сумма: <число>\n# Максимум: <число>\n# Минимум: <число>\n# Среднее: <число>\n\n',
          testCases: [
            { input: '5\n10\n20\n30\n40\n50', expectedOutput: 'Сумма: 150\nМаксимум: 50\nМинимум: 10\nСреднее: 30.0', description: '5 чисел' },
          ],
          points: 15,
        },
      },
      {
        slug: 'tuples-sets',
        title: 'Кортежи и множества',
        description: 'Неизменяемые кортежи, уникальные множества, операции с ними',
        content: `# Кортежи и множества

## Кортежи (tuple)

Неизменяемый упорядоченный набор:

\`\`\`python
point = (3, 5)
colors = ("red", "green", "blue")
x, y = point  # Распаковка
print(len(colors))  # 3
\`\`\`

## Множества (set)

Неупорядоченный набор уникальных элементов:

\`\`\`python
s = {1, 2, 3, 2, 1}  # {1, 2, 3}
s.add(4)
s.discard(2)

a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)  # Объединение: {1, 2, 3, 4}
print(a & b)  # Пересечение: {2, 3}
print(a - b)  # Разность: {1}
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Уникальные элементы',
          description: 'Считайте N чисел и выведите количество уникальных чисел и сами уникальные числа в отсортированном порядке.',
          difficulty: 'medium',
          starterCode: '# Считайте N\n# Считайте N чисел\n# Выведите количество уникальных\n# Выведите уникальные числа через пробел (отсортированные)\n\n',
          testCases: [
            { input: '7\n1\n2\n3\n2\n1\n4\n3', expectedOutput: '4\n1 2 3 4', description: '7 чисел, 4 уникальных' },
          ],
          points: 15,
        },
      },
      {
        slug: 'dictionaries',
        title: 'Словари',
        description: 'Пары ключ-значение, методы keys, values, items, get',
        content: `# Словари (dict)

## Создание

\`\`\`python
student = {
    "name": "Алексей",
    "age": 13,
    "grade": 7
}
\`\`\`

## Доступ к данным

\`\`\`python
print(student["name"])        # Алексей
print(student.get("email", "нет"))  # нет

student["email"] = "alex@mail.ru"  # Добавить
del student["age"]                  # Удалить
\`\`\`

## Перебор

\`\`\`python
for key in student:
    print(key, student[key])

for key, value in student.items():
    print(f"{key}: {value}")
\`\`\`

## Методы

\`\`\`python
print(student.keys())    # Все ключи
print(student.values())  # Все значения
print("name" in student) # True
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Подсчёт слов',
          description: 'Считайте строку текста и выведите количество вхождений каждого слова в алфавитном порядке.',
          difficulty: 'medium',
          starterCode: '# Считайте строку\n# Подсчитайте количество каждого слова\n# Выведите в формате: слово: количество\n# В алфавитном порядке\n\n',
          testCases: [
            { input: 'one two one three two one', expectedOutput: 'one: 3\nthree: 1\ntwo: 2', description: 'Подсчёт слов' },
          ],
          points: 15,
        },
      },
      {
        slug: 'functions-basics',
        title: 'Функции',
        description: 'Определение функций, вызов, параметры, return',
        content: `# Функции

## Определение и вызов

\`\`\`python
def greet(name):
    print(f"Привет, {name}!")

greet("Алексей")  # Привет, Алексей!
\`\`\`

## return

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)  # 8
\`\`\`

## Значения по умолчанию

\`\`\`python
def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Мария"))           # Привет, Мария!
print(greet("Мария", "Здравствуй"))  # Здравствуй, Мария!
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Функции для вычислений',
          description: 'Напишите функцию is_prime(n), которая проверяет, является ли число простым. Считайте число и выведите "YES" или "NO".',
          difficulty: 'medium',
          starterCode: 'def is_prime(n):\n    # Ваш код здесь\n    pass\n\nn = int(input())\nprint("YES" if is_prime(n) else "NO")\n',
          testCases: [
            { input: '7', expectedOutput: 'YES', description: '7 — простое' },
            { input: '12', expectedOutput: 'NO', description: '12 — не простое' },
            { input: '2', expectedOutput: 'YES', description: '2 — простое' },
            { input: '1', expectedOutput: 'NO', description: '1 — не простое' },
          ],
          points: 15,
        },
      },
      {
        slug: 'function-params',
        title: 'Параметры и возврат',
        description: 'Позиционные и именованные аргументы, *args, множественный return',
        content: `# Параметры и возврат

## Позиционные и именованные аргументы

\`\`\`python
def info(name, age, city="Москва"):
    print(f"{name}, {age} лет, {city}")

info("Алексей", 13)
info("Мария", 14, city="Санкт-Петербург")
\`\`\`

## *args — произвольное число аргументов

\`\`\`python
def total(*numbers):
    return sum(numbers)

print(total(1, 2, 3))    # 6
print(total(10, 20))     # 30
\`\`\`

## Множественный return

\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

lo, hi = min_max([3, 1, 4, 1, 5])
print(lo, hi)  # 1 5
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Статистика списка',
          description: 'Напишите функцию stats(numbers), которая возвращает минимум, максимум и среднее. Считайте числа и выведите результат.',
          difficulty: 'medium',
          starterCode: 'def stats(numbers):\n    # Верните (min, max, average)\n    pass\n\nn = int(input())\nnums = [int(input()) for _ in range(n)]\nmin_val, max_val, avg = stats(nums)\nprint(f"{min_val} {max_val} {avg}")\n',
          testCases: [
            { input: '4\n10\n20\n30\n40', expectedOutput: '10 40 25.0', description: '4 числа' },
          ],
          points: 15,
        },
      },
      {
        slug: 'string-methods',
        title: 'Методы строк',
        description: 'split, join, strip, find, replace, startswith, endswith, isdigit',
        content: `# Методы строк

## Разделение и объединение

\`\`\`python
text = "Python - отличный язык"
words = text.split()         # ["Python", "-", "отличный", "язык"]
parts = "a,b,c".split(",")  # ["a", "b", "c"]

joined = " ".join(["Hello", "World"])  # "Hello World"
\`\`\`

## Поиск и замена

\`\`\`python
s = "Hello, World!"
print(s.find("World"))   # 7
print(s.replace("World", "Python"))  # Hello, Python!
print(s.count("l"))      # 3
\`\`\`

## Проверки

\`\`\`python
"123".isdigit()      # True
"abc".isalpha()      # True
"Hello".startswith("He")  # True
"file.py".endswith(".py") # True
\`\`\`

## Очистка

\`\`\`python
"  hello  ".strip()   # "hello"
"  hello  ".lstrip()  # "hello  "
"  hello  ".rstrip()  # "  hello"
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Обработка текста',
          description: 'Считайте строку. Выведите количество слов, самое длинное слово и строку с заглавными первыми буквами.',
          difficulty: 'medium',
          starterCode: '# Считайте строку\n# Выведите количество слов\n# Выведите самое длинное слово\n# Выведите строку с заглавными первыми буквами (title case)\n\n',
          testCases: [
            { input: 'hello beautiful world', expectedOutput: '3\nbeautiful\nHello Beautiful World', description: 'Три слова' },
          ],
          points: 15,
        },
      },
      {
        slug: 'list-comprehensions',
        title: 'Генераторы списков',
        description: 'List comprehensions, фильтрация, вложенные генераторы',
        content: `# Генераторы списков (List Comprehensions)

## Базовый синтаксис

\`\`\`python
# Обычный способ
squares = []
for x in range(10):
    squares.append(x ** 2)

# Генератор
squares = [x ** 2 for x in range(10)]
\`\`\`

## С условием (фильтрация)

\`\`\`python
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## С преобразованием

\`\`\`python
words = ["hello", "world"]
upper = [w.upper() for w in words]
# ["HELLO", "WORLD"]
\`\`\`

## Вложенные

\`\`\`python
matrix = [[1, 2, 3], [4, 5, 6]]
flat = [x for row in matrix for x in row]
# [1, 2, 3, 4, 5, 6]
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Фильтрация и преобразование',
          description: 'Считайте N чисел. Используя генератор списков, выведите только чётные числа, возведённые в квадрат, через пробел.',
          difficulty: 'medium',
          starterCode: '# Считайте N\n# Считайте N чисел\n# Выведите чётные числа, возведённые в квадрат\n\n',
          testCases: [
            { input: '6\n1\n2\n3\n4\n5\n6', expectedOutput: '4 16 36', description: 'Чётные 2,4,6 -> 4,16,36' },
          ],
          points: 15,
        },
      },
      {
        slug: 'file-operations',
        title: 'Работа с файлами (теория)',
        description: 'Открытие, чтение и запись файлов, контекстный менеджер with',
        content: `# Работа с файлами

## Открытие и чтение

\`\`\`python
# Чтение всего файла
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# Построчное чтение
with open("data.txt", "r") as f:
    for line in f:
        print(line.strip())
\`\`\`

## Запись

\`\`\`python
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Привет, мир!\\n")
    f.write("Вторая строка\\n")

# Дозапись
with open("output.txt", "a") as f:
    f.write("Третья строка\\n")
\`\`\`

## Режимы открытия

| Режим | Описание |
|-------|----------|
| \`"r"\` | Чтение (по умолчанию) |
| \`"w"\` | Запись (перезапись) |
| \`"a"\` | Дозапись |
| \`"r+"\` | Чтение и запись |

> **Примечание:** В песочнице работа с файлами ограничена в целях безопасности.`,
        duration: 25,
        assignment: {
          title: 'Обработка данных',
          description: 'Считайте N строк формата "имя оценка". Выведите среднюю оценку и имя лучшего ученика.',
          difficulty: 'medium',
          starterCode: '# Считайте N\n# Считайте N строк "имя оценка"\n# Выведите среднюю оценку (с 1 знаком после запятой)\n# Выведите имя с наивысшей оценкой\n\n',
          testCases: [
            { input: '3\nАлексей 85\nМария 92\nДмитрий 78', expectedOutput: '85.0\nМария', description: 'Три ученика' },
          ],
          points: 15,
        },
      },
      {
        slug: 'error-handling',
        title: 'Обработка ошибок',
        description: 'try/except, типы исключений, finally, raise',
        content: `# Обработка ошибок

## try / except

\`\`\`python
try:
    num = int(input("Число: "))
    result = 10 / num
    print(result)
except ValueError:
    print("Это не число!")
except ZeroDivisionError:
    print("На ноль делить нельзя!")
\`\`\`

## Общий except

\`\`\`python
try:
    # опасный код
    pass
except Exception as e:
    print(f"Ошибка: {e}")
\`\`\`

## finally

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Ошибка деления")
finally:
    print("Это выполнится всегда")
\`\`\`

## raise

\`\`\`python
def check_age(age):
    if age < 0:
        raise ValueError("Возраст не может быть отрицательным")
    return age
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Безопасный ввод',
          description: 'Напишите программу, которая считывает числа до тех пор, пока не будет введено корректное целое число, затем выводит его.',
          difficulty: 'medium',
          starterCode: '# Считывайте ввод в цикле\n# Если ввод не число — выведите "Ошибка! Введите число."\n# Если число корректно — выведите его и завершите\n\n',
          testCases: [
            { input: 'abc\n12.5\n42', expectedOutput: 'Ошибка! Введите число.\nОшибка! Введите число.\n42', description: 'Два некорректных, потом 42' },
          ],
          points: 15,
        },
      },
      {
        slug: 'modules',
        title: 'Модули',
        description: 'import, from...import, стандартные модули math, random',
        content: `# Модули

## Импорт

\`\`\`python
import math
print(math.pi)        # 3.14159...
print(math.sqrt(16))  # 4.0

from math import ceil, floor
print(ceil(3.2))   # 4
print(floor(3.8))  # 3
\`\`\`

## Модуль random

\`\`\`python
import random
print(random.randint(1, 100))   # Случайное число от 1 до 100
print(random.choice(["a", "b", "c"]))  # Случайный элемент
random.shuffle(my_list)          # Перемешать список
\`\`\`

## Модуль math

\`\`\`python
import math
math.pi          # 3.14159...
math.e           # 2.71828...
math.sqrt(x)     # Квадратный корень
math.pow(x, y)   # x в степени y
math.factorial(5) # 120
math.gcd(12, 8)  # 4
\`\`\``,
        duration: 25,
        assignment: {
          title: 'Математические вычисления',
          description: 'Используя модуль math, считайте радиус круга и выведите его площадь (округлённую до 2 знаков) и длину окружности.',
          difficulty: 'easy',
          starterCode: 'import math\n\n# Считайте радиус\n# Выведите площадь (round до 2 знаков)\n# Выведите длину окружности (round до 2 знаков)\n\n',
          testCases: [
            { input: '5', expectedOutput: '78.54\n31.42', description: 'Радиус 5' },
            { input: '10', expectedOutput: '314.16\n62.83', description: 'Радиус 10' },
          ],
          points: 10,
        },
      },
      {
        slug: 'oop-basics',
        title: 'Основы ООП',
        description: 'Классы, объекты, атрибуты, методы, __init__',
        content: `# Основы объектно-ориентированного программирования

## Что такое класс?

Класс — это шаблон для создания объектов. Объект — это экземпляр класса.

\`\`\`python
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def bark(self):
        print(f"{self.name} говорит: Гав!")

    def info(self):
        return f"{self.name} ({self.breed})"

# Создание объектов
dog1 = Dog("Бобик", "Лабрадор")
dog2 = Dog("Рекс", "Овчарка")

dog1.bark()       # Бобик говорит: Гав!
print(dog2.info())  # Рекс (Овчарка)
\`\`\`

## __init__ — конструктор

Метод \`__init__\` вызывается при создании объекта. \`self\` — ссылка на сам объект.

## Атрибуты

\`\`\`python
print(dog1.name)  # Бобик
dog1.name = "Барбос"  # Изменить атрибут
\`\`\``,
        duration: 40,
        assignment: {
          title: 'Класс Student',
          description: 'Создайте класс Student с атрибутами name и grades (список). Добавьте метод average(), который возвращает среднюю оценку.',
          difficulty: 'medium',
          starterCode: 'class Student:\n    def __init__(self, name, grades):\n        # Ваш код\n        pass\n\n    def average(self):\n        # Ваш код\n        pass\n\nname = input()\ngrades = list(map(int, input().split()))\ns = Student(name, grades)\nprint(f"{s.name}: {s.average()}")\n',
          testCases: [
            { input: 'Алексей\n5 4 5 3 4', expectedOutput: 'Алексей: 4.2', description: 'Средняя 4.2' },
            { input: 'Мария\n5 5 5 5', expectedOutput: 'Мария: 5.0', description: 'Средняя 5.0' },
          ],
          points: 20,
        },
      },
      {
        slug: 'classes-and-methods',
        title: 'Классы и методы',
        description: 'Наследование, методы __str__, __repr__, инкапсуляция',
        content: `# Классы и методы

## Наследование

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Мяу!"

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Гав!"

animals = [Cat("Мурка"), Dog("Бобик")]
for a in animals:
    print(a.speak())
\`\`\`

## __str__

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 5)
print(p)  # Point(3, 5)
\`\`\`

## Инкапсуляция

\`\`\`python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance  # Защищённый атрибут

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount

    def get_balance(self):
        return self._balance
\`\`\``,
        duration: 40,
        assignment: {
          title: 'Иерархия фигур',
          description: 'Создайте базовый класс Shape с методом area(). Создайте наследников Rectangle и Circle. Считайте данные и выведите площади.',
          difficulty: 'hard',
          starterCode: 'import math\n\nclass Shape:\n    def area(self):\n        pass\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        # Ваш код\n        pass\n\n    def area(self):\n        # Ваш код\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        # Ваш код\n        pass\n\n    def area(self):\n        # Ваш код\n        pass\n\n# Считайте ширину и высоту прямоугольника\nw, h = map(float, input().split())\n# Считайте радиус круга\nr = float(input())\n\nrect = Rectangle(w, h)\ncirc = Circle(r)\nprint(round(rect.area(), 2))\nprint(round(circ.area(), 2))\n',
          testCases: [
            { input: '5 3\n4', expectedOutput: '15.0\n50.27', description: 'Прямоугольник 5x3 и круг r=4' },
          ],
          points: 20,
        },
      },
      {
        slug: 'final-project-python',
        title: 'Финальный проект',
        description: 'Консольная игра "Угадай число" с использованием всех изученных концепций',
        content: `# Финальный проект: Консольная игра

## Задание

Создайте программу "Угадай число", которая:

1. Генерирует случайное число от 1 до 100
2. Даёт пользователю N попыток (считать N)
3. После каждой попытки подсказывает "больше" или "меньше"
4. Выводит результат: угадал или нет
5. Показывает количество использованных попыток

## Пример работы

\`\`\`
Загаданное число от 1 до 100
Попыток: 7
Ваша попытка: 50
Больше!
Ваша попытка: 75
Меньше!
Ваша попытка: 63
Правильно! Вы угадали за 3 попытки.
\`\`\`

## Подсказки

- Используйте \`random.randint()\`
- Используйте цикл \`while\` или \`for\`
- Обработайте ошибки ввода с \`try/except\`
- Используйте функции для организации кода`,
        duration: 45,
        assignment: {
          title: 'Угадай число',
          description: 'Реализуйте игру "Угадай число". Программа загадывает число, пользователь пытается угадать. Для тестирования: считайте загаданное число и попытки.',
          difficulty: 'hard',
          starterCode: '# Для тестирования: считайте загаданное число и попытки\ntarget = int(input())\nattempts_str = input().split()\nattempts = [int(x) for x in attempts_str]\n\nfor attempt in attempts:\n    if attempt == target:\n        print("Угадал!")\n        break\n    elif attempt < target:\n        print("Больше!")\n    else:\n        print("Меньше!")\nelse:\n    print("Не угадал!")\n',
          testCases: [
            { input: '42\n50 25 42', expectedOutput: 'Меньше!\nБольше!\nУгадал!', description: 'Угадал за 3 попытки' },
            { input: '77\n50 90', expectedOutput: 'Больше!\nМеньше!', description: 'Не угадал' },
          ],
          points: 25,
        },
      },
    ];

    // ============================================
    // 4. C++ LESSONS (20)
    // ============================================
    const cppLessons = [
      {
        slug: 'hello-world',
        title: 'Hello World и настройка',
        description: 'Первая программа на C++, структура программы, компиляция',
        content: `# Первая программа на C++

## Структура программы

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

## Основные элементы

- \`#include <iostream>\` — подключение библиотеки ввода/вывода
- \`using namespace std;\` — использование стандартного пространства имён
- \`int main()\` — главная функция, точка входа
- \`cout\` — вывод на экран
- \`endl\` — перенос строки
- \`return 0;\` — успешное завершение`,
        duration: 25,
        assignment: {
          title: 'Hello World',
          description: 'Напишите программу, которая выводит "Hello, World!" на экран.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Ваш код здесь\n    return 0;\n}\n',
          testCases: [
            { input: '', expectedOutput: 'Hello, World!', description: 'Вывод Hello, World!' },
          ],
          points: 5,
        },
      },
      {
        slug: 'variables-types',
        title: 'Переменные и типы',
        description: 'int, double, char, string, bool — объявление и инициализация',
        content: `# Переменные и типы данных C++

## Основные типы

\`\`\`cpp
int age = 13;           // Целое число
double height = 1.65;   // Дробное число
char grade = 'A';       // Символ
string name = "Алексей"; // Строка
bool isStudent = true;   // Логическое значение
\`\`\`

## Размеры типов

| Тип | Размер | Диапазон |
|-----|--------|----------|
| \`int\` | 4 байта | ±2 млрд |
| \`long long\` | 8 байт | ±9 * 10^18 |
| \`double\` | 8 байт | ±1.7 * 10^308 |
| \`char\` | 1 байт | -128..127 |
| \`bool\` | 1 байт | true/false |

## const

\`\`\`cpp
const double PI = 3.14159;
// PI = 3; // Ошибка!
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Переменные',
          description: 'Объявите переменные разных типов и выведите их.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Объявите переменные name (string), age (int), grade (double)\n    // Считайте их и выведите в формате:\n    // Имя: <name>\n    // Возраст: <age>\n    // Оценка: <grade>\n    return 0;\n}\n',
          testCases: [
            { input: 'Алексей\n13\n4.5', expectedOutput: 'Имя: Алексей\nВозраст: 13\nОценка: 4.5', description: 'Ввод и вывод' },
          ],
          points: 10,
        },
      },
      {
        slug: 'io-cin-cout',
        title: 'Ввод и вывод (cin/cout)',
        description: 'cin, cout, getline, форматирование вывода',
        content: `# Ввод и вывод

## cout — вывод

\`\`\`cpp
cout << "Привет!" << endl;
cout << "a = " << a << ", b = " << b << endl;
\`\`\`

## cin — ввод

\`\`\`cpp
int n;
cin >> n;

string name;
cin >> name;  // Считывает до пробела
\`\`\`

## getline — строка с пробелами

\`\`\`cpp
string fullName;
getline(cin, fullName);
\`\`\`

## Форматирование

\`\`\`cpp
#include <iomanip>
double pi = 3.14159265;
cout << fixed << setprecision(2) << pi << endl;  // 3.14
\`\`\``,
        duration: 25,
        assignment: {
          title: 'Ввод и вывод',
          description: 'Считайте имя и возраст, выведите приветствие.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Считайте имя и возраст\n    // Выведите: Привет, <имя>! Тебе <возраст> лет.\n    return 0;\n}\n',
          testCases: [
            { input: 'Алексей\n13', expectedOutput: 'Привет, Алексей! Тебе 13 лет.', description: 'Приветствие' },
          ],
          points: 10,
        },
      },
      {
        slug: 'arithmetic-cpp',
        title: 'Арифметика',
        description: 'Арифметические операции, приоритеты, целочисленное и вещественное деление',
        content: `# Арифметика в C++

## Операции

\`\`\`cpp
int a = 10, b = 3;
cout << a + b << endl;   // 13
cout << a - b << endl;   // 7
cout << a * b << endl;   // 30
cout << a / b << endl;   // 3 (целочисленное!)
cout << a % b << endl;   // 1 (остаток)
\`\`\`

## Вещественное деление

\`\`\`cpp
double result = (double)a / b;  // 3.333...
// или
double result = 1.0 * a / b;
\`\`\`

## Составное присваивание

\`\`\`cpp
int x = 10;
x += 5;   // x = 15
x -= 3;   // x = 12
x *= 2;   // x = 24
x /= 4;   // x = 6
x++;      // x = 7
x--;      // x = 6
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Калькулятор C++',
          description: 'Считайте два числа a и b, выведите результаты всех операций.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Выведите результаты: +, -, *, /, %\n    return 0;\n}\n',
          testCases: [
            { input: '10 3', expectedOutput: '13\n7\n30\n3\n1', description: '10 и 3' },
          ],
          points: 10,
        },
      },
      {
        slug: 'conditionals-cpp',
        title: 'Условные конструкции',
        description: 'if, else if, else, тернарный оператор',
        content: `# Условные конструкции в C++

## if / else if / else

\`\`\`cpp
int score;
cin >> score;

if (score >= 90) {
    cout << "5" << endl;
} else if (score >= 70) {
    cout << "4" << endl;
} else if (score >= 50) {
    cout << "3" << endl;
} else {
    cout << "2" << endl;
}
\`\`\`

## Операторы сравнения

\`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`

## Логические операторы

\`&&\` (и), \`||\` (или), \`!\` (не)

## Тернарный оператор

\`\`\`cpp
string result = (score >= 50) ? "Сдал" : "Не сдал";
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Оценка по баллам',
          description: 'Считайте баллы (0-100), выведите оценку: 90-100=5, 70-89=4, 50-69=3, <50=2.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int score;\n    cin >> score;\n    // Выведите оценку\n    return 0;\n}\n',
          testCases: [
            { input: '95', expectedOutput: '5', description: '95 = 5' },
            { input: '75', expectedOutput: '4', description: '75 = 4' },
            { input: '55', expectedOutput: '3', description: '55 = 3' },
            { input: '30', expectedOutput: '2', description: '30 = 2' },
          ],
          points: 10,
        },
      },
      {
        slug: 'switch-case',
        title: 'Switch/Case',
        description: 'Множественный выбор с помощью switch, break, default',
        content: `# Switch/Case

## Синтаксис

\`\`\`cpp
int day;
cin >> day;

switch (day) {
    case 1:
        cout << "Понедельник" << endl;
        break;
    case 2:
        cout << "Вторник" << endl;
        break;
    case 3:
        cout << "Среда" << endl;
        break;
    default:
        cout << "Другой день" << endl;
}
\`\`\`

## Важно

- **break** — прерывает выполнение switch
- Без break выполнение "проваливается" в следующий case
- **default** — блок по умолчанию`,
        duration: 25,
        assignment: {
          title: 'День недели',
          description: 'Считайте номер дня (1-7), выведите название дня недели. Для некорректного — "Ошибка".',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int day;\n    cin >> day;\n    // Используйте switch/case\n    return 0;\n}\n',
          testCases: [
            { input: '1', expectedOutput: 'Понедельник', description: 'День 1' },
            { input: '5', expectedOutput: 'Пятница', description: 'День 5' },
            { input: '7', expectedOutput: 'Воскресенье', description: 'День 7' },
            { input: '9', expectedOutput: 'Ошибка', description: 'Некорректный' },
          ],
          points: 10,
        },
      },
      {
        slug: 'while-loops-cpp',
        title: 'Цикл while',
        description: 'while, do-while, break, continue',
        content: `# Цикл while

## while

\`\`\`cpp
int i = 1;
while (i <= 5) {
    cout << i << " ";
    i++;
}
// 1 2 3 4 5
\`\`\`

## do-while

Выполняется хотя бы один раз:

\`\`\`cpp
int num;
do {
    cout << "Введите положительное число: ";
    cin >> num;
} while (num <= 0);
\`\`\`

## break и continue

\`\`\`cpp
while (true) {
    int x;
    cin >> x;
    if (x == 0) break;       // Выход
    if (x < 0) continue;     // Пропуск
    cout << x << endl;
}
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Сумма до нуля',
          description: 'Считывайте числа, пока не введён 0. Выведите сумму.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Считывайте числа до 0\n    // Выведите сумму\n    return 0;\n}\n',
          testCases: [
            { input: '5\n3\n-2\n0', expectedOutput: '6', description: '5+3-2=6' },
            { input: '10\n20\n30\n0', expectedOutput: '60', description: '10+20+30=60' },
          ],
          points: 15,
        },
      },
      {
        slug: 'for-loops-cpp',
        title: 'Цикл for',
        description: 'Цикл for, вложенные циклы, range-based for',
        content: `# Цикл for

## Синтаксис

\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
// 0 1 2 3 4
\`\`\`

## С шагом

\`\`\`cpp
for (int i = 0; i <= 20; i += 2) {
    cout << i << " ";
}
// 0 2 4 6 8 10 12 14 16 18 20
\`\`\`

## Вложенные циклы

\`\`\`cpp
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        cout << i * j << " ";
    }
    cout << endl;
}
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Таблица умножения',
          description: 'Считайте число N, выведите таблицу умножения для N (1-10).',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выведите таблицу N * i = результат\n    return 0;\n}\n',
          testCases: [
            { input: '5', expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50', description: 'Таблица для 5' },
          ],
          points: 10,
        },
      },
      {
        slug: 'arrays-cpp',
        title: 'Массивы',
        description: 'Статические массивы, индексация, перебор, поиск min/max',
        content: `# Массивы

## Объявление

\`\`\`cpp
int arr[5] = {10, 20, 30, 40, 50};
int zeros[100] = {};  // Все нули
\`\`\`

## Доступ

\`\`\`cpp
cout << arr[0] << endl;  // 10
arr[2] = 99;             // Изменить
\`\`\`

## Перебор

\`\`\`cpp
int n;
cin >> n;
int arr[100];
for (int i = 0; i < n; i++) {
    cin >> arr[i];
}

// Поиск максимума
int maxVal = arr[0];
for (int i = 1; i < n; i++) {
    if (arr[i] > maxVal) {
        maxVal = arr[i];
    }
}
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Работа с массивом',
          description: 'Считайте N чисел в массив, выведите сумму, максимум и минимум.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    // Считайте массив и выведите сумму, макс, мин\n    return 0;\n}\n',
          testCases: [
            { input: '5\n10 20 30 40 50', expectedOutput: '150\n50\n10', description: '5 чисел' },
          ],
          points: 15,
        },
      },
      {
        slug: 'strings-cpp',
        title: 'Строки',
        description: 'string, методы length, substr, find, сравнение строк',
        content: `# Строки в C++

## string

\`\`\`cpp
#include <string>

string s = "Hello";
cout << s.length() << endl;  // 5
cout << s[0] << endl;        // H

s += ", World!";  // Конкатенация
\`\`\`

## Методы

\`\`\`cpp
string s = "Hello, World!";
cout << s.substr(0, 5) << endl;     // Hello
cout << s.find("World") << endl;     // 7
cout << s.find("xyz") << endl;       // string::npos

s.replace(7, 5, "C++");             // "Hello, C++!"
\`\`\`

## Сравнение

\`\`\`cpp
string a = "abc", b = "xyz";
if (a == b) cout << "Равны";
if (a < b)  cout << "a меньше";  // Лексикографически
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Обработка строк',
          description: 'Считайте строку, выведите её длину, первый и последний символы.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Выведите длину, первый символ, последний символ\n    return 0;\n}\n',
          testCases: [
            { input: 'Hello', expectedOutput: '5\nH\no', description: 'Строка Hello' },
          ],
          points: 10,
        },
      },
      {
        slug: 'functions-cpp',
        title: 'Функции',
        description: 'Объявление функций, параметры, возвращаемые значения, прототипы',
        content: `# Функции в C++

## Объявление

\`\`\`cpp
int add(int a, int b) {
    return a + b;
}

void greet(string name) {
    cout << "Привет, " << name << "!" << endl;
}

int main() {
    cout << add(3, 5) << endl;  // 8
    greet("Алексей");
    return 0;
}
\`\`\`

## Передача по значению и ссылке

\`\`\`cpp
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(x, y);
    cout << x << " " << y;  // 10 5
}
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Функция is_prime',
          description: 'Напишите функцию isPrime(n), которая проверяет простоту числа. Считайте число и выведите YES или NO.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\nbool isPrime(int n) {\n    // Ваш код\n    return false;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << (isPrime(n) ? "YES" : "NO") << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '7', expectedOutput: 'YES', description: '7 — простое' },
            { input: '12', expectedOutput: 'NO', description: '12 — не простое' },
            { input: '2', expectedOutput: 'YES', description: '2 — простое' },
          ],
          points: 15,
        },
      },
      {
        slug: 'function-overloading',
        title: 'Перегрузка функций',
        description: 'Перегрузка функций, значения по умолчанию',
        content: `# Перегрузка функций

## Одно имя — разные параметры

\`\`\`cpp
int area(int side) {
    return side * side;  // Квадрат
}

int area(int width, int height) {
    return width * height;  // Прямоугольник
}

double area(double radius) {
    return 3.14159 * radius * radius;  // Круг
}

int main() {
    cout << area(5) << endl;       // 25
    cout << area(4, 6) << endl;    // 24
    cout << area(3.0) << endl;     // 28.27
}
\`\`\`

## Значения по умолчанию

\`\`\`cpp
void greet(string name, string greeting = "Привет") {
    cout << greeting << ", " << name << "!" << endl;
}

greet("Алексей");              // Привет, Алексей!
greet("Мария", "Здравствуй");  // Здравствуй, Мария!
\`\`\``,
        duration: 25,
        assignment: {
          title: 'Перегрузка area',
          description: 'Создайте перегруженные функции area для квадрата (1 параметр) и прямоугольника (2 параметра). Считайте данные и выведите площади.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\n// Ваши функции area\n\nint main() {\n    int side;\n    cin >> side;\n    cout << area(side) << endl;\n\n    int w, h;\n    cin >> w >> h;\n    cout << area(w, h) << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5\n4 6', expectedOutput: '25\n24', description: 'Квадрат 5 и прямоугольник 4x6' },
          ],
          points: 15,
        },
      },
      {
        slug: 'pointers-intro',
        title: 'Указатели (введение)',
        description: 'Адреса, указатели, разыменование, nullptr',
        content: `# Указатели

## Что такое указатель?

Указатель — переменная, хранящая адрес другой переменной.

\`\`\`cpp
int x = 42;
int *ptr = &x;   // ptr хранит адрес x

cout << x << endl;      // 42
cout << &x << endl;     // Адрес x (напр. 0x7fff...)
cout << ptr << endl;    // Тот же адрес
cout << *ptr << endl;   // 42 (разыменование)
\`\`\`

## Изменение через указатель

\`\`\`cpp
*ptr = 100;
cout << x << endl;  // 100 (x изменился!)
\`\`\`

## nullptr

\`\`\`cpp
int *p = nullptr;  // Указатель никуда не указывает
if (p != nullptr) {
    cout << *p << endl;
}
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Обмен через указатели',
          description: 'Напишите функцию swapPtr(int *a, int *b), которая обменивает значения через указатели.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\nvoid swapPtr(int *a, int *b) {\n    // Ваш код\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    swapPtr(&a, &b);\n    cout << a << " " << b << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5 10', expectedOutput: '10 5', description: 'Обмен 5 и 10' },
            { input: '42 7', expectedOutput: '7 42', description: 'Обмен 42 и 7' },
          ],
          points: 15,
        },
      },
      {
        slug: 'references-cpp',
        title: 'Ссылки',
        description: 'Ссылки как псевдонимы, передача по ссылке, const-ссылки',
        content: `# Ссылки

## Что такое ссылка?

Ссылка — это псевдоним (альтернативное имя) для переменной.

\`\`\`cpp
int x = 42;
int &ref = x;   // ref — ссылка на x

cout << ref << endl;  // 42
ref = 100;
cout << x << endl;    // 100
\`\`\`

## Передача по ссылке

\`\`\`cpp
void increment(int &n) {
    n++;
}

int x = 5;
increment(x);
cout << x << endl;  // 6
\`\`\`

## const ссылки

\`\`\`cpp
void print(const string &s) {
    cout << s << endl;
    // s = "test";  // Ошибка! Нельзя менять
}
\`\`\``,
        duration: 25,
        assignment: {
          title: 'Передача по ссылке',
          description: 'Напишите функцию multiplyBy2(int &n), которая удваивает число по ссылке. Считайте число, вызовите функцию 3 раза, выведите результат.',
          difficulty: 'easy',
          starterCode: '#include <iostream>\nusing namespace std;\n\nvoid multiplyBy2(int &n) {\n    // Ваш код\n}\n\nint main() {\n    int n;\n    cin >> n;\n    multiplyBy2(n);\n    multiplyBy2(n);\n    multiplyBy2(n);\n    cout << n << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5', expectedOutput: '40', description: '5 * 2 * 2 * 2 = 40' },
            { input: '3', expectedOutput: '24', description: '3 * 2 * 2 * 2 = 24' },
          ],
          points: 10,
        },
      },
      {
        slug: 'structs-cpp',
        title: 'Структуры',
        description: 'struct, инициализация, доступ к полям, массивы структур',
        content: `# Структуры (struct)

## Объявление

\`\`\`cpp
struct Student {
    string name;
    int age;
    double grade;
};

int main() {
    Student s1;
    s1.name = "Алексей";
    s1.age = 13;
    s1.grade = 4.5;

    // Или сразу
    Student s2 = {"Мария", 14, 4.8};
}
\`\`\`

## Массив структур

\`\`\`cpp
Student students[30];
int n;
cin >> n;
for (int i = 0; i < n; i++) {
    cin >> students[i].name >> students[i].grade;
}
\`\`\`

## Функции со структурами

\`\`\`cpp
void printStudent(const Student &s) {
    cout << s.name << ": " << s.grade << endl;
}
\`\`\``,
        duration: 30,
        assignment: {
          title: 'Структура Point',
          description: 'Создайте структуру Point (x, y). Считайте две точки и выведите расстояние между ними.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nstruct Point {\n    double x, y;\n};\n\nint main() {\n    Point p1, p2;\n    cin >> p1.x >> p1.y >> p2.x >> p2.y;\n    // Выведите расстояние с 2 знаками\n    return 0;\n}\n',
          testCases: [
            { input: '0 0 3 4', expectedOutput: '5.00', description: 'Расстояние (0,0)-(3,4) = 5' },
          ],
          points: 15,
        },
      },
      {
        slug: 'vectors-cpp',
        title: 'Векторы',
        description: 'vector — динамический массив, push_back, size, at, итерация',
        content: `# Векторы (vector)

## Зачем вектор?

В отличие от массива, вектор может менять размер.

\`\`\`cpp
#include <vector>

vector<int> nums;           // Пустой вектор
vector<int> v(5, 0);        // 5 нулей
vector<int> v2 = {1, 2, 3}; // Инициализация
\`\`\`

## Операции

\`\`\`cpp
nums.push_back(10);    // Добавить в конец
nums.push_back(20);
nums.pop_back();       // Удалить последний
cout << nums.size();   // Размер
cout << nums[0];       // Доступ по индексу
\`\`\`

## Перебор

\`\`\`cpp
for (int i = 0; i < nums.size(); i++) {
    cout << nums[i] << " ";
}

// Range-based for
for (int x : nums) {
    cout << x << " ";
}
\`\`\`

## Сортировка

\`\`\`cpp
#include <algorithm>
sort(nums.begin(), nums.end());
\`\`\``,
        duration: 35,
        assignment: {
          title: 'Работа с вектором',
          description: 'Считайте N чисел в вектор, отсортируйте и выведите.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте числа, отсортируйте, выведите через пробел\n    return 0;\n}\n',
          testCases: [
            { input: '5\n3 1 4 1 5', expectedOutput: '1 1 3 4 5', description: 'Сортировка 5 чисел' },
          ],
          points: 15,
        },
      },
      {
        slug: 'sorting-searching',
        title: 'Сортировка и поиск',
        description: 'Bubble sort, binary search, стандартные алгоритмы',
        content: `# Сортировка и поиск

## Пузырьковая сортировка

\`\`\`cpp
void bubbleSort(vector<int> &arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}
\`\`\`

## Бинарный поиск

\`\`\`cpp
int binarySearch(vector<int> &arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;  // Не найдено
}
\`\`\`

## STL алгоритмы

\`\`\`cpp
#include <algorithm>
sort(v.begin(), v.end());
reverse(v.begin(), v.end());
auto it = find(v.begin(), v.end(), 42);
int cnt = count(v.begin(), v.end(), 42);
\`\`\``,
        duration: 40,
        assignment: {
          title: 'Бинарный поиск',
          description: 'Считайте отсортированный массив и число для поиска. Выведите индекс или -1.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int> &arr, int target) {\n    // Ваш код\n    return -1;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target;\n    cin >> target;\n    cout << binarySearch(arr, target) << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: 'Найден на позиции 2' },
            { input: '5\n1 3 5 7 9\n4', expectedOutput: '-1', description: 'Не найден' },
          ],
          points: 20,
        },
      },
      {
        slug: 'oop-basics-cpp',
        title: 'Основы ООП',
        description: 'class, конструкторы, деструкторы, public/private',
        content: `# ООП в C++

## Класс

\`\`\`cpp
class Dog {
private:
    string name;
    string breed;

public:
    Dog(string n, string b) : name(n), breed(b) {}

    void bark() {
        cout << name << " говорит: Гав!" << endl;
    }

    string getName() { return name; }
};

int main() {
    Dog d("Бобик", "Лабрадор");
    d.bark();
}
\`\`\`

## Модификаторы доступа

- **public** — доступно везде
- **private** — только внутри класса
- **protected** — в классе и наследниках

## Конструктор и деструктор

\`\`\`cpp
class Timer {
public:
    Timer() { cout << "Создан" << endl; }
    ~Timer() { cout << "Уничтожен" << endl; }
};
\`\`\``,
        duration: 40,
        assignment: {
          title: 'Класс Rectangle',
          description: 'Создайте класс Rectangle с приватными полями width, height, публичными методами area() и perimeter(). Считайте данные и выведите площадь и периметр.',
          difficulty: 'medium',
          starterCode: '#include <iostream>\nusing namespace std;\n\nclass Rectangle {\n    // Ваш код\n};\n\nint main() {\n    int w, h;\n    cin >> w >> h;\n    Rectangle r(w, h);\n    cout << r.area() << endl;\n    cout << r.perimeter() << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5 3', expectedOutput: '15\n16', description: '5x3: area=15, perimeter=16' },
          ],
          points: 20,
        },
      },
      {
        slug: 'classes-methods-cpp',
        title: 'Классы и методы',
        description: 'Наследование, виртуальные методы, полиморфизм',
        content: `# Наследование и полиморфизм

## Наследование

\`\`\`cpp
class Shape {
public:
    virtual double area() = 0;  // Чисто виртуальный метод
    virtual ~Shape() {}
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() override {
        return 3.14159 * radius * radius;
    }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() override {
        return w * h;
    }
};
\`\`\`

## Полиморфизм

\`\`\`cpp
void printArea(Shape &s) {
    cout << "Площадь: " << s.area() << endl;
}

Circle c(5);
Rectangle r(4, 6);
printArea(c);  // Площадь: 78.54
printArea(r);  // Площадь: 24
\`\`\``,
        duration: 45,
        assignment: {
          title: 'Иерархия фигур',
          description: 'Создайте базовый класс Shape с виртуальным area(). Реализуйте Circle и Rectangle. Считайте данные и выведите площади.',
          difficulty: 'hard',
          starterCode: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() = 0;\n    virtual ~Shape() {}\n};\n\n// Ваши классы Circle и Rectangle\n\nint main() {\n    double w, h;\n    cin >> w >> h;\n    double r;\n    cin >> r;\n\n    Rectangle rect(w, h);\n    Circle circ(r);\n    cout << fixed;\n    cout.precision(2);\n    cout << rect.area() << endl;\n    cout << circ.area() << endl;\n    return 0;\n}\n',
          testCases: [
            { input: '5 3\n4', expectedOutput: '15.00\n50.27', description: 'Прямоугольник 5x3 и круг r=4' },
          ],
          points: 25,
        },
      },
      {
        slug: 'final-project-cpp',
        title: 'Финальный проект',
        description: 'Консольная программа с использованием классов, функций и массивов',
        content: `# Финальный проект C++

## Задание

Создайте программу "Журнал оценок":

1. Структура/класс Student (имя, массив оценок)
2. Функции: добавить ученика, добавить оценку, вычислить среднюю
3. Вывод списка учеников с оценками

## Пример

\`\`\`
Введите количество учеников: 2
Имя: Алексей
Оценки (через пробел): 5 4 5 3
Имя: Мария
Оценки (через пробел): 5 5 4 5

Журнал:
Алексей: 5 4 5 3 (средняя: 4.25)
Мария: 5 5 4 5 (средняя: 4.75)
Лучший ученик: Мария
\`\`\``,
        duration: 45,
        assignment: {
          title: 'Журнал оценок',
          description: 'Считайте учеников и их оценки, выведите средние и лучшего ученика.',
          difficulty: 'hard',
          starterCode: '#include <iostream>\n#include <vector>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nstruct Student {\n    string name;\n    vector<int> grades;\n\n    double average() {\n        // Ваш код\n        return 0;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    vector<Student> students(n);\n\n    for (int i = 0; i < n; i++) {\n        cin >> students[i].name;\n        int m;\n        cin >> m;\n        students[i].grades.resize(m);\n        for (int j = 0; j < m; j++) {\n            cin >> students[i].grades[j];\n        }\n    }\n\n    // Найдите лучшего ученика и выведите результаты\n    return 0;\n}\n',
          testCases: [
            { input: '2\nАлексей\n4\n5 4 5 3\nМария\n4\n5 5 4 5', expectedOutput: 'Алексей: 4.25\nМария: 4.75\nЛучший: Мария', description: '2 ученика' },
          ],
          points: 25,
        },
      },
    ];

    // ============================================
    // INSERT LESSONS AND ASSIGNMENTS
    // ============================================

    const insertLesson = async (
      courseId: string,
      lesson: any,
      orderIndex: number
    ) => {
      const lessonResult = await db.query(
        `INSERT INTO lessons (course_id, slug, title, description, content, order_index, duration_minutes, is_published, ege_topic, ege_task_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9)
        ON CONFLICT (course_id, slug) DO UPDATE SET title = EXCLUDED.title
        RETURNING id`,
        [courseId, lesson.slug, lesson.title, lesson.description, lesson.content, orderIndex, lesson.duration, lesson.egeTopic || null, lesson.egeTaskNumber || null]
      );

      const lessonId = lessonResult.rows[0].id;

      // Support both single assignment and multiple assignments
      const assignments = lesson.assignments || (lesson.assignment ? [lesson.assignment] : []);
      for (let ai = 0; ai < assignments.length; ai++) {
        const a = assignments[ai];
        await db.query(
          `INSERT INTO assignments (lesson_id, title, description, assignment_type, difficulty, starter_code, test_cases, validation_type, points, order_index, is_published, ege_task_number)
          VALUES ($1, $2, $3, 'code', $4, $5, $6, 'automatic', $7, $8, true, $9)
          ON CONFLICT DO NOTHING`,
          [
            lessonId,
            a.title,
            a.description,
            a.difficulty,
            a.starterCode,
            JSON.stringify(a.testCases),
            a.points,
            ai + 1,
            a.egeTaskNumber || null,
          ]
        );
      }

      return lessonId;
    };

    // Insert 7th grade Python lessons
    for (let i = 0; i < pythonLessons.length; i++) {
      await insertLesson(pythonCourse.id, pythonLessons[i], i + 1);
    }
    logger.info(`Created ${pythonLessons.length} Python 7 lessons`);

    // Insert 7th grade C++ lessons
    for (let i = 0; i < cppLessons.length; i++) {
      await insertLesson(cppCourse.id, cppLessons[i], i + 1);
    }
    logger.info(`Created ${cppLessons.length} C++ 7 lessons`);

    // Insert 10th grade Python lessons
    for (let i = 0; i < python10Lessons.length; i++) {
      await insertLesson(python10Course.id, python10Lessons[i], i + 1);
    }
    logger.info(`Created ${python10Lessons.length} Python 10 lessons`);

    // Insert 10th grade C++ lessons
    for (let i = 0; i < cpp10Lessons.length; i++) {
      await insertLesson(cpp10Course.id, cpp10Lessons[i], i + 1);
    }
    logger.info(`Created ${cpp10Lessons.length} C++ 10 lessons`);

    // Insert 11th grade Python lessons (EGE)
    for (let i = 0; i < python11Lessons.length; i++) {
      await insertLesson(python11Course.id, python11Lessons[i], i + 1);
    }
    logger.info(`Created ${python11Lessons.length} Python 11 (EGE) lessons`);

    // Insert 11th grade C++ lessons (EGE)
    for (let i = 0; i < cpp11Lessons.length; i++) {
      await insertLesson(cpp11Course.id, cpp11Lessons[i], i + 1);
    }
    logger.info(`Created ${cpp11Lessons.length} C++ 11 (EGE) lessons`);

    // Insert Infosec 7-8 lessons
    for (let i = 0; i < infosec78Lessons.length; i++) {
      await insertLesson(infosec78Course.id, infosec78Lessons[i], i + 1);
    }
    logger.info(`Created ${infosec78Lessons.length} Infosec 7-8 lessons`);

    // Insert Infosec 9-10 lessons
    for (let i = 0; i < infosec910Lessons.length; i++) {
      await insertLesson(infosec910Course.id, infosec910Lessons[i], i + 1);
    }
    logger.info(`Created ${infosec910Lessons.length} Infosec 9-10 lessons`);

    // Insert Infosec 11 lessons
    for (let i = 0; i < infosec11Lessons.length; i++) {
      await insertLesson(infosec11Course.id, infosec11Lessons[i], i + 1);
    }
    logger.info(`Created ${infosec11Lessons.length} Infosec 11 lessons`);

    // ============================================
    // 5. CREATE CLASS AND ENROLL STUDENTS
    // ============================================
    if (teacher) {
      const classesResult = await db.query(
        `INSERT INTO classes (name, description, teacher_id, academic_year, is_active)
        VALUES
          ('7А класс', 'Углублённое программирование — 7 класс', $1, '2025-2026', true),
          ('10А класс', 'Углублённое программирование — 10 класс', $1, '2025-2026', true),
          ('11А класс', 'Подготовка к ЕГЭ — 11 класс', $1, '2025-2026', true)
        ON CONFLICT DO NOTHING
        RETURNING id`,
        [teacher.id]
      );
      logger.info(`Created ${classesResult.rows.length} classes`);
    }

    // ============================================
    // ACHIEVEMENTS
    // ============================================
    await db.query(
      `INSERT INTO achievements (slug, title, description, icon_url, badge_color, criteria, points, is_active)
      VALUES
        ('first-lesson', 'Первый шаг', 'Пройдите свой первый урок', '📖', '#3b82f6', '{"type":"lessons_completed","count":1}', 10, true),
        ('five-lessons', 'Прилежный ученик', 'Пройдите 5 уроков', '📚', '#8b5cf6', '{"type":"lessons_completed","count":5}', 25, true),
        ('ten-lessons', 'Книжный червь', 'Пройдите 10 уроков', '🎓', '#6366f1', '{"type":"lessons_completed","count":10}', 50, true),
        ('twenty-lessons', 'Мастер знаний', 'Пройдите 20 уроков', '🏅', '#f59e0b', '{"type":"lessons_completed","count":20}', 100, true),
        ('first-assignment', 'Решатель задач', 'Решите первое задание', '💡', '#22c55e', '{"type":"assignments_completed","count":1}', 10, true),
        ('five-assignments', 'Программист', 'Решите 5 заданий', '💻', '#10b981', '{"type":"assignments_completed","count":5}', 25, true),
        ('ten-assignments', 'Кодер', 'Решите 10 заданий', '⚡', '#14b8a6', '{"type":"assignments_completed","count":10}', 50, true),
        ('first-perfect', 'Перфекционист', 'Получите максимальный балл за задание', '⭐', '#eab308', '{"type":"perfect_score","count":1}', 30, true),
        ('five-perfect', 'Отличник', 'Получите максимальный балл 5 раз', '🌟', '#f97316', '{"type":"perfect_score","count":5}', 75, true),
        ('course-complete', 'Выпускник', 'Завершите курс целиком', '🎉', '#ec4899', '{"type":"course_completed","count":1}', 100, true),
        ('streak-3', 'Трёхдневный марафон', 'Занимайтесь 3 дня подряд', '🔥', '#ef4444', '{"type":"streak_days","count":3}', 20, true),
        ('streak-7', 'Недельный марафон', 'Занимайтесь 7 дней подряд', '🔥', '#dc2626', '{"type":"streak_days","count":7}', 50, true)
      ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title`
    );
    logger.info('Created 12 achievements');

    logger.info('Database seeding completed successfully!');
    logger.info('Summary:');
    logger.info(`  - Users: ${users.length} (admin/teacher)`);
    logger.info(`  - Courses: 9 (Python + C++ for grades 7, 10, 11 + Infosec for 7-8, 9-10, 11)`);
    logger.info(`  - 7 grade: ${pythonLessons.length} Python + ${cppLessons.length} C++ lessons`);
    logger.info(`  - 10 grade: ${python10Lessons.length} Python + ${cpp10Lessons.length} C++ lessons`);
    logger.info(`  - 11 grade (EGE): ${python11Lessons.length} Python + ${cpp11Lessons.length} C++ lessons`);
    logger.info(`  - Infosec 7-8: ${infosec78Lessons.length} lessons`);
    logger.info(`  - Infosec 9-10: ${infosec910Lessons.length} lessons`);
    logger.info(`  - Infosec 11: ${infosec11Lessons.length} lessons`);
    logger.info('  - Each lesson has 3-4 assignments with test cases');
    logger.info('  - Achievements: 12');
    logger.info('');
    logger.info('Account: sivaevva@admin.ru (admin)');

  } catch (error) {
    logger.error('Seeding failed', { error });
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    logger.info('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    logger.error('Seed failed', { error });
    process.exit(1);
  });
