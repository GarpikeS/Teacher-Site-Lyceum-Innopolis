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
    const seedPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    if (!process.env.SEED_ADMIN_PASSWORD) {
      logger.warn('SEED_ADMIN_PASSWORD not set, using default. Change it in production!');
    }
    const passwordHash = await bcrypt.hash(seedPassword, 12);

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
        assignments: [
          {
            title: 'Работа с переменными',
            description: 'Создайте переменные разных типов и выведите их значения и типы.',
            difficulty: 'easy',
            starterCode: '# Создайте переменные:\n# name = "Алексей" (строка с именем)\n# age = 13 (целое число — возраст)\n# grade = 4.5 (дробное число — средняя оценка)\n# Выведите каждую переменную через print()\n\n',
            testCases: [
              { input: '', expectedOutput: 'Алексей\n13\n4.5', description: 'Программа выводит имя, возраст и оценку' },
              { input: '', expectedOutput: 'Алексей\n13\n4.5', description: 'Проверка трёх значений' },
            ],
            points: 10,
          },
          {
            title: 'Определение типов',
            description: 'Считайте значение с клавиатуры и выведите его тип: "целое", "дробное" или "строка".',
            difficulty: 'easy',
            starterCode: '# Считайте строку с клавиатуры\n# Определите, что это: целое число, дробное число или строка\n# Выведите: "целое", "дробное" или "строка"\n\nvalue = input()\n# Попробуйте преобразовать в int, затем в float\n# Если не получается — это строка\n\n',
            testCases: [
              { input: '42', expectedOutput: 'целое', description: '42 — целое число' },
              { input: '3.14', expectedOutput: 'дробное', description: '3.14 — дробное число' },
              { input: 'hello', expectedOutput: 'строка', description: 'hello — строка' },
              { input: '-7', expectedOutput: 'целое', description: '-7 — целое число' },
              { input: '0.5', expectedOutput: 'дробное', description: '0.5 — дробное число' },
            ],
            points: 10,
          },
          {
            title: 'Преобразование типов',
            description: 'Считайте два числа (целое и дробное) и выведите результаты преобразований.',
            difficulty: 'medium',
            starterCode: '# Считайте целое число a\n# Считайте дробное число b\n# Выведите:\n# a как дробное (float)\n# b как целое (int)\n# сумму a + b\n# тип суммы (int или float)\n\n',
            testCases: [
              { input: '5\n3.7', expectedOutput: '5.0\n3\n8.7\nfloat', description: 'a=5, b=3.7' },
              { input: '10\n2.5', expectedOutput: '10.0\n2\n12.5\nfloat', description: 'a=10, b=2.5' },
            ],
            points: 15,
          },
          {
            title: 'Обмен переменных',
            description: 'Считайте два значения и поменяйте их местами, затем выведите результат.',
            difficulty: 'medium',
            starterCode: '# Считайте два значения a и b\n# Поменяйте их местами\n# Выведите a и b после обмена (каждое на новой строке)\n\n',
            testCases: [
              { input: '10\n20', expectedOutput: '20\n10', description: 'Обмен 10 и 20' },
              { input: 'hello\nworld', expectedOutput: 'world\nhello', description: 'Обмен строк' },
              { input: '0\n99', expectedOutput: '99\n0', description: 'Обмен 0 и 99' },
            ],
            points: 15,
          },
          {
            title: 'Визитка',
            description: 'Считайте имя, возраст и город. Выведите форматированную визитку с типами всех переменных.',
            difficulty: 'hard',
            starterCode: '# Считайте имя (строка)\n# Считайте возраст (целое число)\n# Считайте город (строка)\n# Выведите визитку:\n# Имя: <имя> (тип: str)\n# Возраст: <возраст> (тип: int)\n# Город: <город> (тип: str)\n# Через <число> лет будет: <возраст + число>\n# (число лет = 5)\n\n',
            testCases: [
              { input: 'Алексей\n13\nМосква', expectedOutput: 'Имя: Алексей (тип: str)\nВозраст: 13 (тип: int)\nГород: Москва (тип: str)\nЧерез 5 лет будет: 18', description: 'Визитка Алексея' },
              { input: 'Мария\n15\nКазань', expectedOutput: 'Имя: Мария (тип: str)\nВозраст: 15 (тип: int)\nГород: Казань (тип: str)\nЧерез 5 лет будет: 20', description: 'Визитка Марии' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Форматированный вывод',
            description: 'Считайте имя, предмет и оценку. Выведите сообщение с использованием f-строки.',
            difficulty: 'easy',
            starterCode: '# Считайте имя ученика\n# Считайте название предмета\n# Считайте оценку\n# Выведите: "Ученик <имя> получил <оценка> по предмету <предмет>."\n\n',
            testCases: [
              { input: 'Алексей\nМатематика\n5', expectedOutput: 'Ученик Алексей получил 5 по предмету Математика.', description: 'Алексей, Математика, 5' },
              { input: 'Мария\nФизика\n4', expectedOutput: 'Ученик Мария получил 4 по предмету Физика.', description: 'Мария, Физика, 4' },
              { input: 'Дмитрий\nИнформатика\n5', expectedOutput: 'Ученик Дмитрий получил 5 по предмету Информатика.', description: 'Дмитрий, Информатика, 5' },
            ],
            points: 10,
          },
          {
            title: 'Разделитель в print',
            description: 'Считайте три слова и выведите их через дефис, используя параметр sep.',
            difficulty: 'medium',
            starterCode: '# Считайте три слова (каждое на новой строке)\n# Выведите их через дефис, используя sep="-"\n# Затем выведите их в обратном порядке через пробел\n\n',
            testCases: [
              { input: 'один\nдва\nтри', expectedOutput: 'один-два-три\nтри два один', description: 'Три слова' },
              { input: 'red\ngreen\nblue', expectedOutput: 'red-green-blue\nblue green red', description: 'Три цвета' },
            ],
            points: 15,
          },
          {
            title: 'Квитанция',
            description: 'Считайте название товара, количество и цену за штуку. Выведите форматированную квитанцию.',
            difficulty: 'medium',
            starterCode: '# Считайте название товара\n# Считайте количество (целое число)\n# Считайте цену за штуку (дробное число)\n# Выведите:\n# Товар: <название>\n# Количество: <число> шт.\n# Цена: <цена> руб.\n# Итого: <количество * цена> руб.\n\n',
            testCases: [
              { input: 'Тетрадь\n3\n45.5', expectedOutput: 'Товар: Тетрадь\nКоличество: 3 шт.\nЦена: 45.5 руб.\nИтого: 136.5 руб.', description: 'Тетрадь 3 шт.' },
              { input: 'Ручка\n10\n25.0', expectedOutput: 'Товар: Ручка\nКоличество: 10 шт.\nЦена: 25.0 руб.\nИтого: 250.0 руб.', description: 'Ручка 10 шт.' },
            ],
            points: 15,
          },
          {
            title: 'Анкета ученика',
            description: 'Считайте данные ученика и выведите красиво отформатированную анкету с рамкой.',
            difficulty: 'hard',
            starterCode: '# Считайте фамилию, имя, класс (число), букву класса\n# Выведите анкету:\n# ====================\n# Фамилия: <фамилия>\n# Имя: <имя>\n# Класс: <число><буква>\n# Email: <имя.фамилия>@school.ru (в нижнем регистре)\n# ====================\n\n',
            testCases: [
              { input: 'Иванов\nАлексей\n7\nА', expectedOutput: '====================\nФамилия: Иванов\nИмя: Алексей\nКласс: 7А\nEmail: алексей.иванов@school.ru\n====================', description: 'Анкета Иванова' },
              { input: 'Петрова\nМария\n8\nБ', expectedOutput: '====================\nФамилия: Петрова\nИмя: Мария\nКласс: 8Б\nEmail: мария.петрова@school.ru\n====================', description: 'Анкета Петровой' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Калькулятор',
            description: 'Напишите программу, которая считывает два числа и выводит результат всех арифметических операций.',
            difficulty: 'easy',
            starterCode: '# Считайте два числа a и b\n# Выведите:\n# a + b = результат\n# a - b = результат\n# a * b = результат\n# a / b = результат\n\n',
            testCases: [
              { input: '10\n3', expectedOutput: '10 + 3 = 13\n10 - 3 = 7\n10 * 3 = 30\n10 / 3 = 3.3333333333333335', description: '10 и 3' },
            ],
            points: 10,
          },
          {
            title: 'Сдача в магазине',
            description: 'Считайте стоимость покупки и сумму оплаты. Выведите сдачу.',
            difficulty: 'easy',
            starterCode: '# Считайте стоимость покупки (целое число)\n# Считайте сумму оплаты (целое число)\n# Выведите сдачу\n\n',
            testCases: [
              { input: '750\n1000', expectedOutput: '250', description: 'Сдача 250' },
              { input: '320\n500', expectedOutput: '180', description: 'Сдача 180' },
              { input: '100\n100', expectedOutput: '0', description: 'Без сдачи' },
            ],
            points: 10,
          },
          {
            title: 'Разбиение на минуты и секунды',
            description: 'Считайте количество секунд. Выведите, сколько это полных минут и оставшихся секунд.',
            difficulty: 'medium',
            starterCode: '# Считайте количество секунд (целое число)\n# Вычислите полные минуты и оставшиеся секунды\n# Используйте // и %\n# Выведите: "<минуты> мин <секунды> сек"\n\n',
            testCases: [
              { input: '125', expectedOutput: '2 мин 5 сек', description: '125 секунд' },
              { input: '60', expectedOutput: '1 мин 0 сек', description: '60 секунд' },
              { input: '3661', expectedOutput: '61 мин 1 сек', description: '3661 секунда' },
              { input: '45', expectedOutput: '0 мин 45 сек', description: '45 секунд' },
            ],
            points: 15,
          },
          {
            title: 'Среднее арифметическое',
            description: 'Считайте три числа и выведите их среднее арифметическое.',
            difficulty: 'medium',
            starterCode: '# Считайте три целых числа\n# Вычислите среднее арифметическое\n# Выведите результат (дробное число)\n\n',
            testCases: [
              { input: '10\n20\n30', expectedOutput: '20.0', description: 'Среднее 10,20,30' },
              { input: '1\n2\n3', expectedOutput: '2.0', description: 'Среднее 1,2,3' },
              { input: '5\n5\n5', expectedOutput: '5.0', description: 'Среднее 5,5,5' },
            ],
            points: 15,
          },
          {
            title: 'Разбиение числа на цифры',
            description: 'Считайте трёхзначное число. Выведите его цифры, их сумму и произведение.',
            difficulty: 'hard',
            starterCode: '# Считайте трёхзначное число\n# Выделите сотни, десятки и единицы\n# Используйте // и %\n# Выведите:\n# Сотни: <число>\n# Десятки: <число>\n# Единицы: <число>\n# Сумма цифр: <число>\n# Произведение цифр: <число>\n\n',
            testCases: [
              { input: '123', expectedOutput: 'Сотни: 1\nДесятки: 2\nЕдиницы: 3\nСумма цифр: 6\nПроизведение цифр: 6', description: 'Число 123' },
              { input: '456', expectedOutput: 'Сотни: 4\nДесятки: 5\nЕдиницы: 6\nСумма цифр: 15\nПроизведение цифр: 120', description: 'Число 456' },
              { input: '901', expectedOutput: 'Сотни: 9\nДесятки: 0\nЕдиницы: 1\nСумма цифр: 10\nПроизведение цифр: 0', description: 'Число 901 с нулём' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Обработка строк',
            description: 'Напишите программу, которая считывает строку и выводит её длину, первый и последний символы, строку в верхнем регистре.',
            difficulty: 'easy',
            starterCode: '# Считайте строку\n# Выведите:\n# Длина: <число>\n# Первый символ: <символ>\n# Последний символ: <символ>\n# Верхний регистр: <строка>\n\n',
            testCases: [
              { input: 'Python', expectedOutput: 'Длина: 6\nПервый символ: P\nПоследний символ: n\nВерхний регистр: PYTHON', description: 'Строка Python' },
            ],
            points: 10,
          },
          {
            title: 'Реверс строки',
            description: 'Считайте строку и выведите её задом наперёд, используя срезы.',
            difficulty: 'easy',
            starterCode: '# Считайте строку\n# Выведите строку в обратном порядке\n# Подсказка: используйте срез [::-1]\n\n',
            testCases: [
              { input: 'hello', expectedOutput: 'olleh', description: 'hello -> olleh' },
              { input: 'Python', expectedOutput: 'nohtyP', description: 'Python -> nohtyP' },
              { input: 'abcde', expectedOutput: 'edcba', description: 'abcde -> edcba' },
            ],
            points: 10,
          },
          {
            title: 'Замена символов',
            description: 'Считайте строку, символ для замены и новый символ. Выведите изменённую строку и количество замен.',
            difficulty: 'medium',
            starterCode: '# Считайте строку\n# Считайте символ, который нужно заменить\n# Считайте символ, на который заменить\n# Выведите изменённую строку\n# Выведите количество замен\n\n',
            testCases: [
              { input: 'hello world\nl\nL', expectedOutput: 'heLLo worLd\n3', description: 'Замена l на L' },
              { input: 'banana\na\no', expectedOutput: 'bonono\n3', description: 'Замена a на o' },
            ],
            points: 15,
          },
          {
            title: 'Подстрока',
            description: 'Считайте строку и два индекса. Выведите подстроку между этими индексами.',
            difficulty: 'medium',
            starterCode: '# Считайте строку\n# Считайте начальный индекс (целое число)\n# Считайте конечный индекс (целое число)\n# Выведите подстроку s[start:end]\n# Выведите длину подстроки\n\n',
            testCases: [
              { input: 'Hello, World!\n0\n5', expectedOutput: 'Hello\n5', description: 'Первые 5 символов' },
              { input: 'Programming\n3\n7', expectedOutput: 'gram\n4', description: 'Символы 3-7' },
              { input: 'Python\n1\n4', expectedOutput: 'yth\n3', description: 'Символы 1-4' },
            ],
            points: 15,
          },
          {
            title: 'Шифр Цезаря (только буквы)',
            description: 'Считайте строку из латинских строчных букв и сдвиг. Зашифруйте строку шифром Цезаря.',
            difficulty: 'hard',
            starterCode: '# Считайте строку (только строчные латинские буквы)\n# Считайте сдвиг (целое число)\n# Зашифруйте каждую букву сдвигом по алфавиту\n# Буквы должны "оборачиваться": z + 1 = a\n# Выведите зашифрованную строку\n\n',
            testCases: [
              { input: 'abc\n1', expectedOutput: 'bcd', description: 'abc сдвиг 1' },
              { input: 'xyz\n3', expectedOutput: 'abc', description: 'xyz сдвиг 3 — оборачивание' },
              { input: 'hello\n5', expectedOutput: 'mjqqt', description: 'hello сдвиг 5' },
              { input: 'python\n0', expectedOutput: 'python', description: 'Нулевой сдвиг' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Чётное или нечётное',
            description: 'Считайте целое число и выведите "чётное" или "нечётное".',
            difficulty: 'easy',
            starterCode: '# Считайте целое число\n# Выведите "чётное" или "нечётное"\n\n',
            testCases: [
              { input: '4', expectedOutput: 'чётное', description: '4 — чётное' },
              { input: '7', expectedOutput: 'нечётное', description: '7 — нечётное' },
              { input: '0', expectedOutput: 'чётное', description: '0 — чётное' },
              { input: '-3', expectedOutput: 'нечётное', description: '-3 — нечётное' },
            ],
            points: 10,
          },
          {
            title: 'Максимум из трёх',
            description: 'Считайте три числа и выведите наибольшее, не используя функцию max().',
            difficulty: 'medium',
            starterCode: '# Считайте три числа a, b, c\n# Найдите наибольшее с помощью if/elif/else\n# Не используйте функцию max()\n# Выведите наибольшее число\n\n',
            testCases: [
              { input: '5\n10\n3', expectedOutput: '10', description: 'Максимум 10' },
              { input: '100\n50\n75', expectedOutput: '100', description: 'Максимум 100' },
              { input: '-1\n-5\n-3', expectedOutput: '-1', description: 'Отрицательные числа' },
              { input: '7\n7\n7', expectedOutput: '7', description: 'Все числа равны' },
            ],
            points: 15,
          },
          {
            title: 'Високосный год',
            description: 'Считайте год и определите, является ли он високосным.',
            difficulty: 'medium',
            starterCode: '# Считайте год (целое число)\n# Год високосный, если:\n# - делится на 4, НО не делится на 100\n# - ИЛИ делится на 400\n# Выведите "Високосный" или "Не високосный"\n\n',
            testCases: [
              { input: '2024', expectedOutput: 'Високосный', description: '2024 — високосный' },
              { input: '2023', expectedOutput: 'Не високосный', description: '2023 — не високосный' },
              { input: '1900', expectedOutput: 'Не високосный', description: '1900 — делится на 100, но не на 400' },
              { input: '2000', expectedOutput: 'Високосный', description: '2000 — делится на 400' },
            ],
            points: 15,
          },
          {
            title: 'Калькулятор с операцией',
            description: 'Считайте два числа и операцию (+, -, *, /). Выведите результат. Обработайте деление на ноль.',
            difficulty: 'hard',
            starterCode: '# Считайте первое число (целое)\n# Считайте операцию (+, -, *, /)\n# Считайте второе число (целое)\n# Выведите результат операции\n# Если деление на 0 — выведите "Ошибка: деление на ноль"\n# Если неизвестная операция — выведите "Неизвестная операция"\n\n',
            testCases: [
              { input: '10\n+\n5', expectedOutput: '15', description: '10 + 5 = 15' },
              { input: '20\n-\n8', expectedOutput: '12', description: '20 - 8 = 12' },
              { input: '6\n*\n7', expectedOutput: '42', description: '6 * 7 = 42' },
              { input: '15\n/\n4', expectedOutput: '3.75', description: '15 / 4 = 3.75' },
              { input: '10\n/\n0', expectedOutput: 'Ошибка: деление на ноль', description: 'Деление на 0' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Обратный отсчёт',
            description: 'Считайте число N и выведите обратный отсчёт от N до 1, используя while.',
            difficulty: 'easy',
            starterCode: '# Считайте число N\n# Выведите числа от N до 1 (каждое на новой строке)\n# Используйте цикл while\n\n',
            testCases: [
              { input: '5', expectedOutput: '5\n4\n3\n2\n1', description: 'Отсчёт от 5' },
              { input: '3', expectedOutput: '3\n2\n1', description: 'Отсчёт от 3' },
              { input: '1', expectedOutput: '1', description: 'Отсчёт от 1' },
            ],
            points: 10,
          },
          {
            title: 'Степень двойки',
            description: 'Считайте число N. Выведите все степени двойки, не превышающие N.',
            difficulty: 'easy',
            starterCode: '# Считайте число N\n# Выведите все степени двойки от 1, не превышающие N\n# Каждое на новой строке\n# Пример: для N=20 -> 1 2 4 8 16\n\n',
            testCases: [
              { input: '20', expectedOutput: '1\n2\n4\n8\n16', description: 'Степени двойки до 20' },
              { input: '100', expectedOutput: '1\n2\n4\n8\n16\n32\n64', description: 'Степени двойки до 100' },
              { input: '1', expectedOutput: '1', description: 'Степени двойки до 1' },
            ],
            points: 10,
          },
          {
            title: 'Факториал',
            description: 'Считайте число N и вычислите N! (факториал) с помощью цикла while.',
            difficulty: 'medium',
            starterCode: '# Считайте число N (неотрицательное целое)\n# Вычислите N! с помощью while\n# 0! = 1, 1! = 1, 5! = 120\n# Выведите результат\n\n',
            testCases: [
              { input: '5', expectedOutput: '120', description: '5! = 120' },
              { input: '0', expectedOutput: '1', description: '0! = 1' },
              { input: '1', expectedOutput: '1', description: '1! = 1' },
              { input: '10', expectedOutput: '3628800', description: '10! = 3628800' },
            ],
            points: 15,
          },
          {
            title: 'Числа Фибоначчи',
            description: 'Считайте число N и выведите первые N чисел Фибоначчи через пробел.',
            difficulty: 'hard',
            starterCode: '# Считайте N\n# Выведите первые N чисел Фибоначчи через пробел\n# Последовательность: 1, 1, 2, 3, 5, 8, 13, ...\n# Каждое следующее = сумма двух предыдущих\n\n',
            testCases: [
              { input: '7', expectedOutput: '1 1 2 3 5 8 13', description: 'Первые 7 чисел Фибоначчи' },
              { input: '1', expectedOutput: '1', description: 'Одно число' },
              { input: '2', expectedOutput: '1 1', description: 'Два числа' },
              { input: '10', expectedOutput: '1 1 2 3 5 8 13 21 34 55', description: 'Первые 10 чисел Фибоначчи' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Таблица умножения',
            description: 'Напишите программу, которая считывает число N и выводит таблицу умножения для числа N (от 1 до 10).',
            difficulty: 'easy',
            starterCode: '# Считайте число N\n# Выведите таблицу умножения N\n# Формат: N * i = результат\n\n',
            testCases: [
              { input: '5', expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50', description: 'Таблица для 5' },
            ],
            points: 10,
          },
          {
            title: 'Сумма чисел от 1 до N',
            description: 'Считайте число N и выведите сумму всех чисел от 1 до N включительно.',
            difficulty: 'easy',
            starterCode: '# Считайте число N\n# Вычислите сумму от 1 до N с помощью цикла for\n# Выведите результат\n\n',
            testCases: [
              { input: '5', expectedOutput: '15', description: '1+2+3+4+5 = 15' },
              { input: '10', expectedOutput: '55', description: 'Сумма от 1 до 10' },
              { input: '1', expectedOutput: '1', description: 'Сумма от 1 до 1' },
              { input: '100', expectedOutput: '5050', description: 'Сумма от 1 до 100' },
            ],
            points: 10,
          },
          {
            title: 'Подсчёт гласных',
            description: 'Считайте строку и подсчитайте количество гласных букв (латинских).',
            difficulty: 'medium',
            starterCode: '# Считайте строку\n# Подсчитайте количество гласных букв (a, e, i, o, u)\n# Учитывайте и строчные, и заглавные\n# Выведите количество\n\n',
            testCases: [
              { input: 'Hello World', expectedOutput: '3', description: 'Hello World — 3 гласных' },
              { input: 'Python', expectedOutput: '1', description: 'Python — 1 гласная' },
              { input: 'AEIOU', expectedOutput: '5', description: 'AEIOU — 5 гласных' },
              { input: 'xyz', expectedOutput: '0', description: 'Нет гласных' },
            ],
            points: 15,
          },
          {
            title: 'Треугольник из звёзд',
            description: 'Считайте число N и выведите прямоугольный треугольник из символов * высотой N.',
            difficulty: 'medium',
            starterCode: '# Считайте число N\n# Выведите треугольник:\n# Строка 1: *\n# Строка 2: **\n# ...\n# Строка N: N звёздочек\n\n',
            testCases: [
              { input: '4', expectedOutput: '*\n**\n***\n****', description: 'Треугольник высотой 4' },
              { input: '1', expectedOutput: '*', description: 'Треугольник высотой 1' },
              { input: '3', expectedOutput: '*\n**\n***', description: 'Треугольник высотой 3' },
            ],
            points: 15,
          },
          {
            title: 'Простые числа в диапазоне',
            description: 'Считайте два числа A и B. Выведите все простые числа в диапазоне [A, B].',
            difficulty: 'hard',
            starterCode: '# Считайте два числа A и B\n# Выведите все простые числа от A до B включительно\n# Каждое на новой строке\n# Простое число делится только на 1 и на себя\n\n',
            testCases: [
              { input: '1\n20', expectedOutput: '2\n3\n5\n7\n11\n13\n17\n19', description: 'Простые от 1 до 20' },
              { input: '10\n30', expectedOutput: '11\n13\n17\n19\n23\n29', description: 'Простые от 10 до 30' },
              { input: '2\n2', expectedOutput: '2', description: 'Одно простое число' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Работа со списком',
            description: 'Считайте N чисел, сохраните в список, выведите сумму, максимум, минимум и среднее.',
            difficulty: 'medium',
            starterCode: '# Считайте N — количество чисел\n# Считайте N чисел и сохраните в список\n# Выведите:\n# Сумма: <число>\n# Максимум: <число>\n# Минимум: <число>\n# Среднее: <число>\n\n',
            testCases: [
              { input: '5\n10\n20\n30\n40\n50', expectedOutput: 'Сумма: 150\nМаксимум: 50\nМинимум: 10\nСреднее: 30.0', description: '5 чисел' },
            ],
            points: 15,
          },
          {
            title: 'Перевернуть список',
            description: 'Считайте N чисел и выведите их в обратном порядке через пробел.',
            difficulty: 'easy',
            starterCode: '# Считайте N\n# Считайте N чисел\n# Выведите их в обратном порядке через пробел\n\n',
            testCases: [
              { input: '5\n1\n2\n3\n4\n5', expectedOutput: '5 4 3 2 1', description: 'Обратный порядок' },
              { input: '3\n10\n20\n30', expectedOutput: '30 20 10', description: 'Три числа' },
            ],
            points: 10,
          },
          {
            title: 'Удалить дубликаты',
            description: 'Считайте N чисел. Выведите список без дубликатов, сохраняя порядок первого появления.',
            difficulty: 'easy',
            starterCode: '# Считайте N\n# Считайте N чисел\n# Удалите дубликаты, сохранив порядок первого появления\n# Выведите результат через пробел\n\n',
            testCases: [
              { input: '7\n1\n2\n3\n2\n1\n4\n3', expectedOutput: '1 2 3 4', description: 'Без дубликатов' },
              { input: '5\n5\n5\n5\n5\n5', expectedOutput: '5', description: 'Все одинаковые' },
              { input: '4\n1\n2\n3\n4', expectedOutput: '1 2 3 4', description: 'Без повторов' },
            ],
            points: 10,
          },
          {
            title: 'Сортировка пузырьком',
            description: 'Считайте N чисел и отсортируйте их методом пузырька (не используя sort). Выведите результат.',
            difficulty: 'medium',
            starterCode: '# Считайте N\n# Считайте N чисел\n# Отсортируйте методом пузырька (без sort())\n# Метод: сравниваем соседние элементы, меняем местами если нужно\n# Выведите отсортированный список через пробел\n\n',
            testCases: [
              { input: '5\n5\n3\n1\n4\n2', expectedOutput: '1 2 3 4 5', description: 'Сортировка 5 чисел' },
              { input: '4\n10\n7\n3\n1', expectedOutput: '1 3 7 10', description: 'Сортировка 4 чисел' },
              { input: '3\n1\n2\n3', expectedOutput: '1 2 3', description: 'Уже отсортировано' },
            ],
            points: 15,
          },
          {
            title: 'Объединение списков',
            description: 'Считайте два отсортированных списка и объедините их в один отсортированный список (merge).',
            difficulty: 'hard',
            starterCode: '# Считайте N1 — размер первого списка\n# Считайте N1 чисел (уже отсортированных)\n# Считайте N2 — размер второго списка\n# Считайте N2 чисел (уже отсортированных)\n# Объедините в один отсортированный список\n# Не используйте sort() — делайте слияние\n# Выведите результат через пробел\n\n',
            testCases: [
              { input: '3\n1\n3\n5\n3\n2\n4\n6', expectedOutput: '1 2 3 4 5 6', description: 'Слияние [1,3,5] и [2,4,6]' },
              { input: '2\n1\n10\n3\n2\n5\n8', expectedOutput: '1 2 5 8 10', description: 'Слияние [1,10] и [2,5,8]' },
              { input: '1\n5\n1\n3', expectedOutput: '3 5', description: 'По одному элементу' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Уникальные элементы',
            description: 'Считайте N чисел и выведите количество уникальных чисел и сами уникальные числа в отсортированном порядке.',
            difficulty: 'medium',
            starterCode: '# Считайте N\n# Считайте N чисел\n# Выведите количество уникальных\n# Выведите уникальные числа через пробел (отсортированные)\n\n',
            testCases: [
              { input: '7\n1\n2\n3\n2\n1\n4\n3', expectedOutput: '4\n1 2 3 4', description: '7 чисел, 4 уникальных' },
            ],
            points: 15,
          },
          {
            title: 'Распаковка кортежа',
            description: 'Считайте координаты точки (x, y) и выведите расстояние от начала координат.',
            difficulty: 'easy',
            starterCode: '# Считайте x и y (целые числа)\n# Создайте кортеж point = (x, y)\n# Распакуйте кортеж\n# Вычислите расстояние: (x**2 + y**2) ** 0.5\n# Выведите расстояние, округлённое до 2 знаков\n\n',
            testCases: [
              { input: '3\n4', expectedOutput: '5.0', description: 'Точка (3,4) — расстояние 5' },
              { input: '0\n0', expectedOutput: '0.0', description: 'Начало координат' },
              { input: '1\n1', expectedOutput: '1.41', description: 'Точка (1,1)' },
            ],
            points: 10,
          },
          {
            title: 'Общие элементы',
            description: 'Считайте два набора чисел и выведите их общие элементы (пересечение) в отсортированном порядке.',
            difficulty: 'easy',
            starterCode: '# Считайте N1, затем N1 чисел\n# Считайте N2, затем N2 чисел\n# Найдите общие элементы (пересечение множеств)\n# Выведите их через пробел в отсортированном порядке\n\n',
            testCases: [
              { input: '4\n1\n2\n3\n4\n3\n3\n4\n5', expectedOutput: '3 4', description: 'Общие: 3, 4' },
              { input: '3\n1\n2\n3\n3\n4\n5\n6', expectedOutput: '', description: 'Нет общих' },
              { input: '2\n5\n10\n2\n5\n10', expectedOutput: '5 10', description: 'Все общие' },
            ],
            points: 10,
          },
          {
            title: 'Симметрическая разность',
            description: 'Считайте два набора чисел. Выведите элементы, которые есть только в одном из наборов.',
            difficulty: 'medium',
            starterCode: '# Считайте N1, затем N1 чисел — первый набор\n# Считайте N2, затем N2 чисел — второй набор\n# Найдите симметрическую разность (элементы, которые есть\n# только в одном из наборов, но не в обоих)\n# Выведите через пробел в отсортированном порядке\n\n',
            testCases: [
              { input: '4\n1\n2\n3\n4\n3\n3\n4\n5', expectedOutput: '1 2 5', description: 'Разность {1,2,3,4} и {3,4,5}' },
              { input: '2\n1\n2\n2\n1\n2', expectedOutput: '', description: 'Одинаковые множества' },
              { input: '3\n10\n20\n30\n2\n40\n50', expectedOutput: '10 20 30 40 50', description: 'Нет пересечения' },
            ],
            points: 15,
          },
          {
            title: 'Анализ оценок класса',
            description: 'Считайте оценки N учеников (кортежи имя+оценка). Используя множества, найдите уникальные оценки и выведите статистику.',
            difficulty: 'hard',
            starterCode: '# Считайте N — количество учеников\n# Считайте N строк формата "имя оценка"\n# Сохраните данные как список кортежей [(имя, оценка), ...]\n# Выведите:\n# Уникальные оценки: <отсортированные через пробел>\n# Количество уникальных: <число>\n# Отличники: <имена с оценкой 5 через запятую, или "нет">\n\n',
            testCases: [
              { input: '5\nАлексей 5\nМария 4\nДмитрий 5\nАнна 3\nИван 4', expectedOutput: 'Уникальные оценки: 3 4 5\nКоличество уникальных: 3\nОтличники: Алексей, Дмитрий', description: '5 учеников' },
              { input: '3\nПётр 4\nОлег 3\nНина 4', expectedOutput: 'Уникальные оценки: 3 4\nКоличество уникальных: 2\nОтличники: нет', description: 'Нет отличников' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Подсчёт слов',
            description: 'Считайте строку текста и выведите количество вхождений каждого слова в алфавитном порядке.',
            difficulty: 'medium',
            starterCode: '# Считайте строку\n# Подсчитайте количество каждого слова\n# Выведите в формате: слово: количество\n# В алфавитном порядке\n\n',
            testCases: [
              { input: 'one two one three two one', expectedOutput: 'one: 3\nthree: 1\ntwo: 2', description: 'Подсчёт слов' },
            ],
            points: 15,
          },
          {
            title: 'Телефонная книга',
            description: 'Считайте N записей "имя номер" и выведите номер по запросу.',
            difficulty: 'easy',
            starterCode: '# Считайте N — количество записей\n# Считайте N строк "имя номер"\n# Считайте имя для поиска\n# Выведите номер или "Не найдено"\n\n',
            testCases: [
              { input: '3\nАлексей 123456\nМария 789012\nДмитрий 345678\nМария', expectedOutput: '789012', description: 'Поиск Марии' },
              { input: '2\nИван 111111\nОлег 222222\nПётр', expectedOutput: 'Не найдено', description: 'Имя не найдено' },
            ],
            points: 10,
          },
          {
            title: 'Частота символов',
            description: 'Считайте строку и выведите частоту каждого символа (кроме пробелов) в порядке первого появления.',
            difficulty: 'easy',
            starterCode: '# Считайте строку\n# Подсчитайте частоту каждого символа (без пробелов)\n# Выведите в порядке первого появления\n# Формат: символ: количество\n\n',
            testCases: [
              { input: 'hello', expectedOutput: 'h: 1\ne: 1\nl: 2\no: 1', description: 'Строка hello' },
              { input: 'aabcc', expectedOutput: 'a: 2\nb: 1\nc: 2', description: 'Строка aabcc' },
            ],
            points: 10,
          },
          {
            title: 'Инвентарь магазина',
            description: 'Считайте операции добавления и продажи товаров. Выведите остатки.',
            difficulty: 'medium',
            starterCode: '# Считайте N — количество операций\n# Каждая операция: "add товар количество" или "sell товар количество"\n# add — добавить товар на склад\n# sell — продать (уменьшить количество, но не ниже 0)\n# Выведите остатки в алфавитном порядке: "товар: количество"\n\n',
            testCases: [
              { input: '5\nadd яблоки 10\nadd бананы 5\nsell яблоки 3\nadd яблоки 2\nsell бананы 10', expectedOutput: 'бананы: 0\nяблоки: 9', description: 'Операции с товарами' },
              { input: '3\nadd молоко 20\nsell молоко 5\nsell молоко 5', expectedOutput: 'молоко: 10', description: 'Один товар' },
            ],
            points: 15,
          },
          {
            title: 'Журнал оценок',
            description: 'Считайте записи об оценках учеников. Выведите средний балл каждого ученика в алфавитном порядке.',
            difficulty: 'hard',
            starterCode: '# Считайте N — количество записей\n# Каждая запись: "имя оценка"\n# Один ученик может иметь несколько оценок\n# Выведите в алфавитном порядке:\n# имя: средний_балл (округлить до 1 знака после запятой)\n\n',
            testCases: [
              { input: '6\nАлексей 5\nМария 4\nАлексей 4\nМария 5\nАлексей 3\nМария 5', expectedOutput: 'Алексей: 4.0\nМария: 4.7', description: 'Три оценки у каждого' },
              { input: '4\nИван 5\nОлег 3\nИван 5\nОлег 4', expectedOutput: 'Иван: 5.0\nОлег: 3.5', description: 'По две оценки' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Площадь прямоугольника',
            description: 'Напишите функцию rectangle_area(a, b), которая возвращает площадь прямоугольника.',
            difficulty: 'easy',
            starterCode: '# Напишите функцию rectangle_area(a, b)\n# Она должна возвращать площадь прямоугольника\ndef rectangle_area(a, b):\n    pass\n\na = int(input())\nb = int(input())\nprint(rectangle_area(a, b))\n',
            testCases: [
              { input: '5\n3', expectedOutput: '15', description: '5 * 3 = 15' },
              { input: '10\n10', expectedOutput: '100', description: '10 * 10 = 100' },
              { input: '1\n7', expectedOutput: '7', description: '1 * 7 = 7' },
            ],
            points: 10,
          },
          {
            title: 'Функция приветствия',
            description: 'Напишите функцию greet с параметром по умолчанию.',
            difficulty: 'easy',
            starterCode: '# Напишите функцию greet(name, greeting="Привет")\n# Она должна возвращать строку "<greeting>, <name>!"\ndef greet(name, greeting="Привет"):\n    pass\n\nname = input()\nprint(greet(name))\nprint(greet(name, "Здравствуй"))\n',
            testCases: [
              { input: 'Алексей', expectedOutput: 'Привет, Алексей!\nЗдравствуй, Алексей!', description: 'Приветствие Алексея' },
              { input: 'Мария', expectedOutput: 'Привет, Мария!\nЗдравствуй, Мария!', description: 'Приветствие Марии' },
            ],
            points: 10,
          },
          {
            title: 'Факториал рекурсией',
            description: 'Напишите рекурсивную функцию factorial(n), которая вычисляет факториал числа.',
            difficulty: 'medium',
            starterCode: '# Напишите рекурсивную функцию factorial(n)\n# Базовый случай: factorial(0) = 1\n# Рекурсия: factorial(n) = n * factorial(n-1)\ndef factorial(n):\n    pass\n\nn = int(input())\nprint(factorial(n))\n',
            testCases: [
              { input: '5', expectedOutput: '120', description: '5! = 120' },
              { input: '0', expectedOutput: '1', description: '0! = 1' },
              { input: '7', expectedOutput: '5040', description: '7! = 5040' },
              { input: '1', expectedOutput: '1', description: '1! = 1' },
            ],
            points: 15,
          },
          {
            title: 'Палиндром',
            description: 'Напишите функцию is_palindrome(s), которая проверяет, является ли строка палиндромом (без учёта регистра и пробелов).',
            difficulty: 'hard',
            starterCode: '# Напишите функцию is_palindrome(s)\n# Палиндром — строка, которая читается одинаково слева направо и справа налево\n# Игнорируйте регистр и пробелы\n# Верните True или False\ndef is_palindrome(s):\n    pass\n\ns = input()\nprint("YES" if is_palindrome(s) else "NO")\n',
            testCases: [
              { input: 'шалаш', expectedOutput: 'YES', description: 'шалаш — палиндром' },
              { input: 'hello', expectedOutput: 'NO', description: 'hello — не палиндром' },
              { input: 'А роза упала на лапу Азора', expectedOutput: 'YES', description: 'Фраза-палиндром' },
              { input: 'abcba', expectedOutput: 'YES', description: 'abcba — палиндром' },
              { input: 'python', expectedOutput: 'NO', description: 'python — не палиндром' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Статистика списка',
            description: 'Напишите функцию stats(numbers), которая возвращает минимум, максимум и среднее. Считайте числа и выведите результат.',
            difficulty: 'medium',
            starterCode: 'def stats(numbers):\n    # Верните (min, max, average)\n    pass\n\nn = int(input())\nnums = [int(input()) for _ in range(n)]\nmin_val, max_val, avg = stats(nums)\nprint(f"{min_val} {max_val} {avg}")\n',
            testCases: [
              { input: '4\n10\n20\n30\n40', expectedOutput: '10 40 25.0', description: '4 числа' },
            ],
            points: 15,
          },
          {
            title: 'Сумма произвольных аргументов',
            description: 'Напишите функцию sum_all(*args), принимающую любое количество чисел и возвращающую их сумму.',
            difficulty: 'easy',
            starterCode: '# Напишите функцию sum_all(*args)\n# Она принимает любое количество чисел\n# Возвращает их сумму\ndef sum_all(*args):\n    pass\n\nnums = list(map(int, input().split()))\nprint(sum_all(*nums))\n',
            testCases: [
              { input: '1 2 3 4 5', expectedOutput: '15', description: 'Сумма 5 чисел' },
              { input: '10 20', expectedOutput: '30', description: 'Сумма 2 чисел' },
              { input: '7', expectedOutput: '7', description: 'Одно число' },
            ],
            points: 10,
          },
          {
            title: 'Степень числа',
            description: 'Напишите функцию power(base, exp=2), которая возводит число в степень (по умолчанию — в квадрат).',
            difficulty: 'easy',
            starterCode: '# Напишите функцию power(base, exp=2)\n# По умолчанию возводит в квадрат\ndef power(base, exp=2):\n    pass\n\nbase = int(input())\nprint(power(base))\nprint(power(base, 3))\n',
            testCases: [
              { input: '5', expectedOutput: '25\n125', description: '5^2=25, 5^3=125' },
              { input: '3', expectedOutput: '9\n27', description: '3^2=9, 3^3=27' },
              { input: '2', expectedOutput: '4\n8', description: '2^2=4, 2^3=8' },
            ],
            points: 10,
          },
          {
            title: 'Применить функцию к списку',
            description: 'Напишите функцию apply_func(numbers, func), которая применяет переданную функцию к каждому элементу списка.',
            difficulty: 'medium',
            starterCode: '# Напишите функцию apply_func(numbers, func)\n# Она применяет func к каждому элементу и возвращает новый список\ndef apply_func(numbers, func):\n    pass\n\nnums = list(map(int, input().split()))\noperation = input()  # "double" или "square"\n\nif operation == "double":\n    result = apply_func(nums, lambda x: x * 2)\nelif operation == "square":\n    result = apply_func(nums, lambda x: x ** 2)\nprint(" ".join(map(str, result)))\n',
            testCases: [
              { input: '1 2 3 4\ndouble', expectedOutput: '2 4 6 8', description: 'Удвоение' },
              { input: '1 2 3 4\nsquare', expectedOutput: '1 4 9 16', description: 'Возведение в квадрат' },
              { input: '5 10\ndouble', expectedOutput: '10 20', description: 'Удвоение двух чисел' },
            ],
            points: 15,
          },
          {
            title: 'Декоратор подсчёта вызовов',
            description: 'Напишите функцию, которая считает количество своих вызовов и выводит результат с номером вызова.',
            difficulty: 'hard',
            starterCode: '# Напишите функцию multiply(a, b), которая:\n# 1. Подсчитывает количество своих вызовов\n# 2. Выводит "Вызов #N: a * b = результат"\n# Используйте атрибут функции для подсчёта: multiply.count\n\ndef multiply(a, b):\n    pass\n\nmultiply.count = 0\n\nn = int(input())\nfor _ in range(n):\n    a, b = map(int, input().split())\n    multiply(a, b)\n',
            testCases: [
              { input: '3\n2 3\n4 5\n6 7', expectedOutput: 'Вызов #1: 2 * 3 = 6\nВызов #2: 4 * 5 = 20\nВызов #3: 6 * 7 = 42', description: 'Три вызова' },
              { input: '2\n10 10\n3 3', expectedOutput: 'Вызов #1: 10 * 10 = 100\nВызов #2: 3 * 3 = 9', description: 'Два вызова' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Обработка текста',
            description: 'Считайте строку. Выведите количество слов, самое длинное слово и строку с заглавными первыми буквами.',
            difficulty: 'medium',
            starterCode: '# Считайте строку\n# Выведите количество слов\n# Выведите самое длинное слово\n# Выведите строку с заглавными первыми буквами (title case)\n\n',
            testCases: [
              { input: 'hello beautiful world', expectedOutput: '3\nbeautiful\nHello Beautiful World', description: 'Три слова' },
            ],
            points: 15,
          },
          {
            title: 'Проверка email',
            description: 'Считайте строку и проверьте, содержит ли она символ @ и точку после @.',
            difficulty: 'easy',
            starterCode: '# Считайте строку (предполагаемый email)\n# Проверьте:\n# 1. Содержит "@"\n# 2. После "@" есть точка\n# Выведите "Корректный" или "Некорректный"\n\n',
            testCases: [
              { input: 'user@mail.ru', expectedOutput: 'Корректный', description: 'Корректный email' },
              { input: 'usermail.ru', expectedOutput: 'Некорректный', description: 'Нет @' },
              { input: 'user@mailru', expectedOutput: 'Некорректный', description: 'Нет точки после @' },
              { input: 'a@b.c', expectedOutput: 'Корректный', description: 'Минимальный email' },
            ],
            points: 10,
          },
          {
            title: 'Подсчёт цифр и букв',
            description: 'Считайте строку и подсчитайте количество цифр и букв в ней.',
            difficulty: 'easy',
            starterCode: '# Считайте строку\n# Подсчитайте количество цифр (isdigit)\n# Подсчитайте количество букв (isalpha)\n# Выведите:\n# Букв: <число>\n# Цифр: <число>\n\n',
            testCases: [
              { input: 'Hello123', expectedOutput: 'Букв: 5\nЦифр: 3', description: 'Hello123' },
              { input: 'abc', expectedOutput: 'Букв: 3\nЦифр: 0', description: 'Только буквы' },
              { input: '12345', expectedOutput: 'Букв: 0\nЦифр: 5', description: 'Только цифры' },
            ],
            points: 10,
          },
          {
            title: 'Замена слов',
            description: 'Считайте текст, слово для поиска и слово для замены. Выведите изменённый текст и количество замен.',
            difficulty: 'medium',
            starterCode: '# Считайте текст\n# Считайте слово для поиска\n# Считайте слово для замены\n# Подсчитайте количество вхождений слова\n# Замените все вхождения\n# Выведите количество замен\n# Выведите изменённый текст\n\n',
            testCases: [
              { input: 'the cat sat on the mat\nthe\na', expectedOutput: '2\na cat sat on a mat', description: 'Замена the на a' },
              { input: 'hello world hello\nhello\nhi', expectedOutput: '2\nhi world hi', description: 'Замена hello на hi' },
            ],
            points: 15,
          },
          {
            title: 'Форматирование текста',
            description: 'Считайте многострочный текст (до пустой строки). Очистите пробелы, сделайте первую букву каждого предложения заглавной.',
            difficulty: 'hard',
            starterCode: '# Считайте строки до пустой строки\n# Объедините в один текст через пробел\n# Очистите лишние пробелы (strip + убрать двойные пробелы)\n# Сделайте первую букву каждого предложения заглавной\n# Предложение заканчивается точкой\n# Выведите результат\n\n',
            testCases: [
              { input: '  hello world. this is python.  \n  learning is fun. \n', expectedOutput: 'Hello world. This is python. Learning is fun.', description: 'Три предложения' },
              { input: 'one. two. three.\n', expectedOutput: 'One. Two. Three.', description: 'Короткие предложения' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Фильтрация и преобразование',
            description: 'Считайте N чисел. Используя генератор списков, выведите только чётные числа, возведённые в квадрат, через пробел.',
            difficulty: 'medium',
            starterCode: '# Считайте N\n# Считайте N чисел\n# Выведите чётные числа, возведённые в квадрат\n\n',
            testCases: [
              { input: '6\n1\n2\n3\n4\n5\n6', expectedOutput: '4 16 36', description: 'Чётные 2,4,6 -> 4,16,36' },
            ],
            points: 15,
          },
          {
            title: 'Квадраты чисел',
            description: 'Считайте N и выведите квадраты чисел от 1 до N через пробел, используя генератор списка.',
            difficulty: 'easy',
            starterCode: '# Считайте N\n# С помощью генератора списка создайте [1, 4, 9, ..., N**2]\n# Выведите через пробел\n\n',
            testCases: [
              { input: '5', expectedOutput: '1 4 9 16 25', description: 'Квадраты от 1 до 5' },
              { input: '3', expectedOutput: '1 4 9', description: 'Квадраты от 1 до 3' },
              { input: '1', expectedOutput: '1', description: 'Один элемент' },
            ],
            points: 10,
          },
          {
            title: 'Длины слов',
            description: 'Считайте строку и выведите длины каждого слова через пробел, используя генератор.',
            difficulty: 'easy',
            starterCode: '# Считайте строку\n# С помощью генератора списка найдите длину каждого слова\n# Выведите длины через пробел\n\n',
            testCases: [
              { input: 'hello beautiful world', expectedOutput: '5 9 5', description: 'Длины трёх слов' },
              { input: 'I am a student', expectedOutput: '1 2 1 7', description: 'Четыре слова' },
            ],
            points: 10,
          },
          {
            title: 'Матрица — сумма строк',
            description: 'Считайте матрицу NxM и выведите сумму каждой строки, используя генераторы.',
            difficulty: 'medium',
            starterCode: '# Считайте N (строки) и M (столбцы)\n# Считайте N строк по M чисел через пробел\n# Используя генератор списка, вычислите сумму каждой строки\n# Выведите суммы через пробел\n\n',
            testCases: [
              { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '6 15', description: 'Матрица 2x3' },
              { input: '3 2\n1 1\n2 2\n3 3', expectedOutput: '2 4 6', description: 'Матрица 3x2' },
            ],
            points: 15,
          },
          {
            title: 'Вложенные генераторы — транспонирование',
            description: 'Считайте матрицу NxM и выведите транспонированную матрицу, используя вложенные генераторы.',
            difficulty: 'hard',
            starterCode: '# Считайте N и M\n# Считайте матрицу NxM\n# Транспонируйте (строки -> столбцы) с помощью генератора\n# Выведите каждую строку транспонированной матрицы\n# (числа через пробел)\n\n',
            testCases: [
              { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6', description: 'Транспонирование 2x3' },
              { input: '3 2\n1 2\n3 4\n5 6', expectedOutput: '1 3 5\n2 4 6', description: 'Транспонирование 3x2' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Обработка данных',
            description: 'Считайте N строк формата "имя оценка". Выведите среднюю оценку и имя лучшего ученика.',
            difficulty: 'medium',
            starterCode: '# Считайте N\n# Считайте N строк "имя оценка"\n# Выведите среднюю оценку (с 1 знаком после запятой)\n# Выведите имя с наивысшей оценкой\n\n',
            testCases: [
              { input: '3\nАлексей 85\nМария 92\nДмитрий 78', expectedOutput: '85.0\nМария', description: 'Три ученика' },
            ],
            points: 15,
          },
          {
            title: 'Подсчёт строк',
            description: 'Считайте строки до пустой строки. Выведите количество строк и количество символов (без пустых строк).',
            difficulty: 'easy',
            starterCode: '# Считывайте строки до пустой строки\n# Подсчитайте количество строк\n# Подсчитайте общее количество символов\n# Выведите:\n# Строк: <число>\n# Символов: <число>\n\n',
            testCases: [
              { input: 'Hello\nWorld\nPython\n', expectedOutput: 'Строк: 3\nСимволов: 16', description: 'Три строки' },
              { input: 'abc\nde\n', expectedOutput: 'Строк: 2\nСимволов: 5', description: 'Две строки' },
            ],
            points: 10,
          },
          {
            title: 'CSV-парсер',
            description: 'Считайте данные в формате CSV (разделитель — запятая). Выведите каждую колонку отдельно.',
            difficulty: 'easy',
            starterCode: '# Считайте N — количество строк\n# Считайте N строк в формате CSV (значения через запятую)\n# Выведите количество столбцов\n# Выведите каждый столбец через пробел (по строкам)\n\n',
            testCases: [
              { input: '3\nАлексей,5,Москва\nМария,4,Казань\nИван,5,Самара', expectedOutput: '3\nАлексей Мария Иван\n5 4 5\nМосква Казань Самара', description: '3 строки, 3 столбца' },
              { input: '2\na,b\nc,d', expectedOutput: '2\na c\nb d', description: '2x2' },
            ],
            points: 10,
          },
          {
            title: 'Формат таблицы',
            description: 'Считайте данные и выведите их в виде отформатированной таблицы с заголовком.',
            difficulty: 'medium',
            starterCode: '# Считайте заголовки через запятую\n# Считайте N — количество строк данных\n# Считайте N строк (значения через запятую)\n# Выведите таблицу:\n# Заголовки и данные разделены символом |\n# Между заголовком и данными — разделитель из дефисов\n\n',
            testCases: [
              { input: 'Имя,Оценка\n2\nАлексей,5\nМария,4', expectedOutput: 'Имя|Оценка\n---|------\nАлексей|5\nМария|4', description: 'Таблица с оценками' },
              { input: 'A,B,C\n1\n1,2,3', expectedOutput: 'A|B|C\n-|-|-\n1|2|3', description: 'Простая таблица' },
            ],
            points: 15,
          },
          {
            title: 'Анализ текста',
            description: 'Считайте текст (строки до пустой). Выведите статистику: слова, предложения, абзацы, самое частое слово.',
            difficulty: 'hard',
            starterCode: '# Считайте строки до пустой строки\n# Выведите:\n# Слов: <число>\n# Предложений: <число> (предложение кончается на . ! или ?)\n# Строк: <число>\n# Самое частое слово: <слово>\n\n',
            testCases: [
              { input: 'Hello world. Hello Python.\nPython is great.\n', expectedOutput: 'Слов: 7\nПредложений: 3\nСтрок: 2\nСамое частое слово: Hello', description: 'Анализ текста' },
              { input: 'One. Two. One.\n', expectedOutput: 'Слов: 3\nПредложений: 3\nСтрок: 1\nСамое частое слово: One.', description: 'Простой текст' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Безопасный ввод',
            description: 'Напишите программу, которая считывает числа до тех пор, пока не будет введено корректное целое число, затем выводит его.',
            difficulty: 'medium',
            starterCode: '# Считывайте ввод в цикле\n# Если ввод не число — выведите "Ошибка! Введите число."\n# Если число корректно — выведите его и завершите\n\n',
            testCases: [
              { input: 'abc\n12.5\n42', expectedOutput: 'Ошибка! Введите число.\nОшибка! Введите число.\n42', description: 'Два некорректных, потом 42' },
            ],
            points: 15,
          },
          {
            title: 'Деление с проверкой',
            description: 'Считайте два числа и выполните деление с обработкой ошибок.',
            difficulty: 'easy',
            starterCode: '# Считайте строку — первое число\n# Считайте строку — второе число\n# Выполните деление с обработкой:\n# ValueError — "Ошибка: не число"\n# ZeroDivisionError — "Ошибка: деление на ноль"\n# Если всё ок — выведите результат (округлить до 2 знаков)\n\n',
            testCases: [
              { input: '10\n3', expectedOutput: '3.33', description: '10 / 3 = 3.33' },
              { input: '10\n0', expectedOutput: 'Ошибка: деление на ноль', description: 'Деление на 0' },
              { input: 'abc\n5', expectedOutput: 'Ошибка: не число', description: 'Не число' },
            ],
            points: 10,
          },
          {
            title: 'Индекс списка',
            description: 'Считайте список и индекс. Обработайте ошибку выхода за границы.',
            difficulty: 'easy',
            starterCode: '# Считайте числа через пробел (список)\n# Считайте индекс\n# Выведите элемент по индексу\n# Если индекс вне диапазона — "Ошибка: индекс вне диапазона"\n# Если индекс не число — "Ошибка: некорректный индекс"\n\n',
            testCases: [
              { input: '10 20 30 40 50\n2', expectedOutput: '30', description: 'Индекс 2 = 30' },
              { input: '10 20 30\n10', expectedOutput: 'Ошибка: индекс вне диапазона', description: 'Индекс 10' },
              { input: '10 20 30\nabc', expectedOutput: 'Ошибка: некорректный индекс', description: 'Нечисловой индекс' },
            ],
            points: 10,
          },
          {
            title: 'Безопасный калькулятор',
            description: 'Реализуйте калькулятор, который обрабатывает все возможные ошибки ввода.',
            difficulty: 'medium',
            starterCode: '# Считайте выражение в формате "число операция число"\n# Поддержите +, -, *, /\n# Обработайте ошибки:\n# - Некорректное число -> "Ошибка: некорректное число"\n# - Деление на 0 -> "Ошибка: деление на ноль"\n# - Неизвестная операция -> "Ошибка: неизвестная операция"\n# При успехе: "Результат: <число>"\n\n',
            testCases: [
              { input: '10 + 5', expectedOutput: 'Результат: 15', description: '10 + 5' },
              { input: '10 / 0', expectedOutput: 'Ошибка: деление на ноль', description: 'Деление на 0' },
              { input: 'abc + 5', expectedOutput: 'Ошибка: некорректное число', description: 'Не число' },
              { input: '10 ^ 5', expectedOutput: 'Ошибка: неизвестная операция', description: 'Неизвестная операция' },
            ],
            points: 15,
          },
          {
            title: 'Валидатор данных',
            description: 'Считайте данные ученика и валидируйте каждое поле с подробными сообщениями об ошибках.',
            difficulty: 'hard',
            starterCode: '# Считайте имя, возраст, оценку\n# Валидация:\n# Имя: не пустое, только буквы -> иначе "Ошибка: некорректное имя"\n# Возраст: целое число от 6 до 18 -> иначе "Ошибка: некорректный возраст"\n# Оценка: число от 1 до 5 -> иначе "Ошибка: некорректная оценка"\n# Если все данные корректны: "<Имя>, <возраст> лет, оценка: <оценка>"\n# Выведите первую найденную ошибку\n\n',
            testCases: [
              { input: 'Алексей\n13\n5', expectedOutput: 'Алексей, 13 лет, оценка: 5', description: 'Всё корректно' },
              { input: '\n13\n5', expectedOutput: 'Ошибка: некорректное имя', description: 'Пустое имя' },
              { input: 'Алексей\n25\n5', expectedOutput: 'Ошибка: некорректный возраст', description: 'Возраст 25' },
              { input: 'Алексей\n13\n6', expectedOutput: 'Ошибка: некорректная оценка', description: 'Оценка 6' },
              { input: 'Алексей\nabc\n5', expectedOutput: 'Ошибка: некорректный возраст', description: 'Возраст не число' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Факториал и НОД',
            description: 'Используя модуль math, вычислите факториал и НОД двух чисел.',
            difficulty: 'easy',
            starterCode: 'import math\n\n# Считайте два числа a и b\n# Выведите:\n# Факториал a: <число>\n# Факториал b: <число>\n# НОД(a, b): <число>\n\n',
            testCases: [
              { input: '5\n3', expectedOutput: 'Факториал 5: 120\nФакториал 3: 6\nНОД(5, 3): 1', description: '5 и 3' },
              { input: '6\n4', expectedOutput: 'Факториал 6: 720\nФакториал 4: 24\nНОД(6, 4): 2', description: '6 и 4' },
              { input: '12\n8', expectedOutput: 'Факториал 12: 479001600\nФакториал 8: 40320\nНОД(12, 8): 4', description: '12 и 8' },
            ],
            points: 10,
          },
          {
            title: 'Округление чисел',
            description: 'Используя math.ceil и math.floor, округлите число вверх и вниз.',
            difficulty: 'medium',
            starterCode: 'import math\n\n# Считайте дробное число\n# Выведите:\n# Вверх: <ceil>\n# Вниз: <floor>\n# Округление: <round>\n# Модуль: <fabs>\n\n',
            testCases: [
              { input: '3.7', expectedOutput: 'Вверх: 4\nВниз: 3\nОкругление: 4\nМодуль: 3.7', description: '3.7' },
              { input: '-2.3', expectedOutput: 'Вверх: -2\nВниз: -3\nОкругление: -2\nМодуль: 2.3', description: '-2.3' },
              { input: '5.0', expectedOutput: 'Вверх: 5\nВниз: 5\nОкругление: 5\nМодуль: 5.0', description: '5.0' },
            ],
            points: 15,
          },
          {
            title: 'Геометрия треугольника',
            description: 'Считайте три стороны треугольника. Используя math, вычислите площадь по формуле Герона.',
            difficulty: 'medium',
            starterCode: 'import math\n\n# Считайте три стороны a, b, c\n# Проверьте, что треугольник существует (a+b>c, a+c>b, b+c>a)\n# Если нет — "Треугольник не существует"\n# Иначе вычислите площадь по формуле Герона:\n# p = (a+b+c)/2\n# S = sqrt(p*(p-a)*(p-b)*(p-c))\n# Выведите площадь, округлённую до 2 знаков\n\n',
            testCases: [
              { input: '3\n4\n5', expectedOutput: '6.0', description: 'Прямоугольный 3-4-5' },
              { input: '5\n5\n5', expectedOutput: '10.83', description: 'Равносторонний' },
              { input: '1\n2\n10', expectedOutput: 'Треугольник не существует', description: 'Не треугольник' },
            ],
            points: 15,
          },
          {
            title: 'Статистический калькулятор',
            description: 'Используя math, вычислите расширенную статистику для набора чисел.',
            difficulty: 'hard',
            starterCode: 'import math\n\n# Считайте N чисел (целых)\n# Выведите:\n# Сумма: <число>\n# Среднее: <округлить до 2>\n# Геометрическое среднее: <округлить до 2>\n# (корень N-й степени из произведения, используйте math.prod и **)\n# Сумма квадратов: <число>\n# Корень из суммы квадратов: <округлить до 2>\n\n',
            testCases: [
              { input: '4\n1\n2\n3\n4', expectedOutput: 'Сумма: 10\nСреднее: 2.5\nГеометрическое среднее: 2.21\nСумма квадратов: 30\nКорень из суммы квадратов: 5.48', description: '4 числа' },
              { input: '3\n2\n4\n8', expectedOutput: 'Сумма: 14\nСреднее: 4.67\nГеометрическое среднее: 4.0\nСумма квадратов: 84\nКорень из суммы квадратов: 9.17', description: '3 числа' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Класс Student',
            description: 'Создайте класс Student с атрибутами name и grades (список). Добавьте метод average(), который возвращает среднюю оценку.',
            difficulty: 'medium',
            starterCode: 'class Student:\n    def __init__(self, name, grades):\n        # Ваш код\n        pass\n\n    def average(self):\n        # Ваш код\n        pass\n\nname = input()\ngrades = list(map(int, input().split()))\ns = Student(name, grades)\nprint(f"{s.name}: {s.average()}")\n',
            testCases: [
              { input: 'Алексей\n5 4 5 3 4', expectedOutput: 'Алексей: 4.2', description: 'Средняя 4.2' },
              { input: 'Мария\n5 5 5 5', expectedOutput: 'Мария: 5.0', description: 'Средняя 5.0' },
            ],
            points: 15,
          },
          {
            title: 'Класс Rectangle',
            description: 'Создайте класс Rectangle с методами area() и perimeter().',
            difficulty: 'easy',
            starterCode: '# Создайте класс Rectangle\n# __init__(self, width, height)\n# area() — возвращает площадь\n# perimeter() — возвращает периметр\n\nclass Rectangle:\n    def __init__(self, width, height):\n        pass\n\n    def area(self):\n        pass\n\n    def perimeter(self):\n        pass\n\nw, h = map(int, input().split())\nr = Rectangle(w, h)\nprint(r.area())\nprint(r.perimeter())\n',
            testCases: [
              { input: '5 3', expectedOutput: '15\n16', description: '5x3: площадь 15, периметр 16' },
              { input: '10 10', expectedOutput: '100\n40', description: '10x10: квадрат' },
              { input: '1 7', expectedOutput: '7\n16', description: '1x7' },
            ],
            points: 10,
          },
          {
            title: 'Класс Counter',
            description: 'Создайте класс Counter со счётчиком, который можно увеличивать и уменьшать.',
            difficulty: 'easy',
            starterCode: '# Создайте класс Counter\n# __init__(self, start=0) — начальное значение\n# increment() — увеличить на 1\n# decrement() — уменьшить на 1 (но не ниже 0)\n# value() — вернуть текущее значение\n\nclass Counter:\n    def __init__(self, start=0):\n        pass\n\n    def increment(self):\n        pass\n\n    def decrement(self):\n        pass\n\n    def value(self):\n        pass\n\nc = Counter()\nn = int(input())\nfor _ in range(n):\n    cmd = input()\n    if cmd == "inc":\n        c.increment()\n    elif cmd == "dec":\n        c.decrement()\nprint(c.value())\n',
            testCases: [
              { input: '5\ninc\ninc\ninc\ndec\ninc', expectedOutput: '3', description: '3 inc + 1 dec + 1 inc = 3' },
              { input: '3\ndec\ndec\ndec', expectedOutput: '0', description: 'Не ниже 0' },
              { input: '2\ninc\ninc', expectedOutput: '2', description: 'Два inc' },
            ],
            points: 10,
          },
          {
            title: 'Класс BankAccount',
            description: 'Создайте класс BankAccount с методами deposit, withdraw и get_balance.',
            difficulty: 'medium',
            starterCode: '# Создайте класс BankAccount\n# __init__(self, owner, balance=0)\n# deposit(amount) — пополнить (только положительные суммы)\n# withdraw(amount) — снять (если достаточно средств)\n# get_balance() — вернуть баланс\n# При ошибке выведите сообщение\n\nclass BankAccount:\n    def __init__(self, owner, balance=0):\n        pass\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n\n    def get_balance(self):\n        pass\n\nowner = input()\naccount = BankAccount(owner)\nn = int(input())\nfor _ in range(n):\n    parts = input().split()\n    cmd = parts[0]\n    amount = int(parts[1])\n    if cmd == "deposit":\n        account.deposit(amount)\n    elif cmd == "withdraw":\n        account.withdraw(amount)\nprint(f"{owner}: {account.get_balance()}")\n',
            testCases: [
              { input: 'Алексей\n4\ndeposit 1000\nwithdraw 300\ndeposit 500\nwithdraw 200', expectedOutput: 'Алексей: 1000', description: 'Обычные операции' },
              { input: 'Мария\n3\ndeposit 500\nwithdraw 600\nwithdraw 100', expectedOutput: 'Мария: 400', description: 'Попытка снять больше баланса' },
            ],
            points: 15,
          },
          {
            title: 'Класс TodoList',
            description: 'Создайте класс TodoList для управления списком задач с приоритетами.',
            difficulty: 'hard',
            starterCode: '# Создайте класс TodoList\n# __init__(self) — пустой список задач\n# add(task, priority) — добавить задачу (priority: 1-3, где 1 — высший)\n# done(task) — отметить задачу выполненной (удалить)\n# show() — вывести невыполненные задачи, отсортированные по приоритету\n# Формат вывода: "[приоритет] задача"\n\nclass TodoList:\n    def __init__(self):\n        pass\n\n    def add(self, task, priority):\n        pass\n\n    def done(self, task):\n        pass\n\n    def show(self):\n        pass\n\ntodo = TodoList()\nn = int(input())\nfor _ in range(n):\n    line = input().split(maxsplit=1)\n    cmd = line[0]\n    if cmd == "add":\n        parts = line[1].rsplit(" ", 1)\n        todo.add(parts[0], int(parts[1]))\n    elif cmd == "done":\n        todo.done(line[1])\n    elif cmd == "show":\n        todo.show()\n',
            testCases: [
              { input: '6\nadd Купить молоко 2\nadd Сделать уроки 1\nadd Погулять 3\nshow\ndone Сделать уроки\nshow', expectedOutput: '[1] Сделать уроки\n[2] Купить молоко\n[3] Погулять\n[2] Купить молоко\n[3] Погулять', description: 'Добавление, показ, удаление' },
              { input: '4\nadd Задача1 1\nadd Задача2 1\ndone Задача1\nshow', expectedOutput: '[1] Задача2', description: 'Одинаковые приоритеты' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Иерархия фигур',
            description: 'Создайте базовый класс Shape с методом area(). Создайте наследников Rectangle и Circle. Считайте данные и выведите площади.',
            difficulty: 'hard',
            starterCode: 'import math\n\nclass Shape:\n    def area(self):\n        pass\n\nclass Rectangle(Shape):\n    def __init__(self, width, height):\n        # Ваш код\n        pass\n\n    def area(self):\n        # Ваш код\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        # Ваш код\n        pass\n\n    def area(self):\n        # Ваш код\n        pass\n\n# Считайте ширину и высоту прямоугольника\nw, h = map(float, input().split())\n# Считайте радиус круга\nr = float(input())\n\nrect = Rectangle(w, h)\ncirc = Circle(r)\nprint(round(rect.area(), 2))\nprint(round(circ.area(), 2))\n',
            testCases: [
              { input: '5 3\n4', expectedOutput: '15.0\n50.27', description: 'Прямоугольник 5x3 и круг r=4' },
            ],
            points: 25,
          },
          {
            title: 'Класс Point с __str__',
            description: 'Создайте класс Point с методом __str__ и методом расстояния до другой точки.',
            difficulty: 'easy',
            starterCode: '# Создайте класс Point(x, y)\n# __str__ — возвращает "Point(x, y)"\n# distance_to(other) — расстояние до другой точки\n\nclass Point:\n    def __init__(self, x, y):\n        pass\n\n    def __str__(self):\n        pass\n\n    def distance_to(self, other):\n        pass\n\nx1, y1 = map(int, input().split())\nx2, y2 = map(int, input().split())\np1 = Point(x1, y1)\np2 = Point(x2, y2)\nprint(p1)\nprint(p2)\nprint(round(p1.distance_to(p2), 2))\n',
            testCases: [
              { input: '0 0\n3 4', expectedOutput: 'Point(0, 0)\nPoint(3, 4)\n5.0', description: 'Расстояние 5' },
              { input: '1 1\n4 5', expectedOutput: 'Point(1, 1)\nPoint(4, 5)\n5.0', description: 'Расстояние 5' },
              { input: '0 0\n0 0', expectedOutput: 'Point(0, 0)\nPoint(0, 0)\n0.0', description: 'Одна точка' },
            ],
            points: 10,
          },
          {
            title: 'Наследование: Animal',
            description: 'Создайте иерархию классов Animal -> Cat, Dog с переопределением метода speak().',
            difficulty: 'easy',
            starterCode: '# Создайте базовый класс Animal(name)\n# Метод speak() возвращает "..."\n# Класс Cat(Animal): speak() возвращает "<name>: Мяу!"\n# Класс Dog(Animal): speak() возвращает "<name>: Гав!"\n\nclass Animal:\n    def __init__(self, name):\n        pass\n    def speak(self):\n        pass\n\nclass Cat(Animal):\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        pass\n\nn = int(input())\nfor _ in range(n):\n    kind, name = input().split()\n    if kind == "cat":\n        a = Cat(name)\n    else:\n        a = Dog(name)\n    print(a.speak())\n',
            testCases: [
              { input: '3\ncat Мурка\ndog Бобик\ncat Пушок', expectedOutput: 'Мурка: Мяу!\nБобик: Гав!\nПушок: Мяу!', description: 'Три животных' },
              { input: '2\ndog Рекс\ndog Шарик', expectedOutput: 'Рекс: Гав!\nШарик: Гав!', description: 'Две собаки' },
            ],
            points: 10,
          },
          {
            title: 'Стек на классе',
            description: 'Реализуйте класс Stack с методами push, pop, peek, is_empty и __str__.',
            difficulty: 'medium',
            starterCode: '# Реализуйте класс Stack\n# push(item) — добавить элемент на вершину\n# pop() — удалить и вернуть верхний элемент (или "Стек пуст")\n# peek() — вернуть верхний элемент без удаления\n# is_empty() — True/False\n# __str__() — элементы через пробел (от дна к вершине)\n\nclass Stack:\n    def __init__(self):\n        pass\n\n    def push(self, item):\n        pass\n\n    def pop(self):\n        pass\n\n    def peek(self):\n        pass\n\n    def is_empty(self):\n        pass\n\n    def __str__(self):\n        pass\n\ns = Stack()\nn = int(input())\nfor _ in range(n):\n    parts = input().split(maxsplit=1)\n    cmd = parts[0]\n    if cmd == "push":\n        s.push(parts[1])\n    elif cmd == "pop":\n        print(s.pop())\n    elif cmd == "peek":\n        print(s.peek())\n    elif cmd == "show":\n        print(s)\n',
            testCases: [
              { input: '7\npush A\npush B\npush C\npeek\npop\nshow\npop', expectedOutput: 'C\nC\nA B\nB', description: 'Push A,B,C -> peek, pop, show, pop' },
              { input: '3\npop\npush X\npeek', expectedOutput: 'Стек пуст\nX', description: 'Pop из пустого, push, peek' },
            ],
            points: 15,
          },
          {
            title: 'Система сотрудников',
            description: 'Создайте иерархию Employee -> Manager -> Director с инкапсуляцией и __str__.',
            difficulty: 'hard',
            starterCode: 'class Employee:\n    def __init__(self, name, salary):\n        # Защищённые атрибуты _name, _salary\n        pass\n\n    def get_salary(self):\n        pass\n\n    def __str__(self):\n        # "Сотрудник: <name>, зарплата: <salary>"\n        pass\n\nclass Manager(Employee):\n    def __init__(self, name, salary, department):\n        # + _department\n        pass\n\n    def __str__(self):\n        # "Менеджер: <name>, отдел: <dept>, зарплата: <salary>"\n        pass\n\nclass Director(Manager):\n    def __init__(self, name, salary, department, bonus):\n        # + _bonus\n        pass\n\n    def get_salary(self):\n        # salary + bonus\n        pass\n\n    def __str__(self):\n        # "Директор: <name>, отдел: <dept>, зарплата: <salary+bonus>"\n        pass\n\nn = int(input())\nfor _ in range(n):\n    parts = input().split(",")\n    role = parts[0].strip()\n    if role == "employee":\n        e = Employee(parts[1].strip(), int(parts[2].strip()))\n    elif role == "manager":\n        e = Manager(parts[1].strip(), int(parts[2].strip()), parts[3].strip())\n    elif role == "director":\n        e = Director(parts[1].strip(), int(parts[2].strip()), parts[3].strip(), int(parts[4].strip()))\n    print(e)\n    print(f"Итого: {e.get_salary()}")\n',
            testCases: [
              { input: '3\nemployee, Иван, 50000\nmanager, Мария, 70000, IT\ndirector, Алексей, 100000, IT, 50000', expectedOutput: 'Сотрудник: Иван, зарплата: 50000\nИтого: 50000\nМенеджер: Мария, отдел: IT, зарплата: 70000\nИтого: 70000\nДиректор: Алексей, отдел: IT, зарплата: 150000\nИтого: 150000', description: 'Три роли' },
              { input: '1\ndirector, Пётр, 80000, HR, 20000', expectedOutput: 'Директор: Пётр, отдел: HR, зарплата: 100000\nИтого: 100000', description: 'Один директор' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Реверс строки с функцией',
            description: 'Напишите функцию reverse_string, которая переворачивает строку без использования [::-1].',
            difficulty: 'easy',
            starterCode: '# Напишите функцию reverse_string(s)\n# Переверните строку без использования среза [::-1]\n# Используйте цикл\n\ndef reverse_string(s):\n    pass\n\ns = input()\nprint(reverse_string(s))\n',
            testCases: [
              { input: 'hello', expectedOutput: 'olleh', description: 'hello -> olleh' },
              { input: 'Python', expectedOutput: 'nohtyP', description: 'Python -> nohtyP' },
              { input: 'a', expectedOutput: 'a', description: 'Один символ' },
            ],
            points: 10,
          },
          {
            title: 'Частотный анализ',
            description: 'Считайте текст и выведите топ-3 самых частых слов с количеством вхождений.',
            difficulty: 'easy',
            starterCode: '# Считайте строку текста\n# Разбейте на слова (привести к нижнему регистру)\n# Подсчитайте частоту каждого слова\n# Выведите топ-3 самых частых слова\n# Формат: "слово: количество"\n# При равной частоте — в алфавитном порядке\n\n',
            testCases: [
              { input: 'the cat sat on the mat the cat', expectedOutput: 'the: 3\ncat: 2\nmat: 1', description: 'Топ-3 слов' },
              { input: 'a b a b c a', expectedOutput: 'a: 3\nb: 2\nc: 1', description: 'a, b, c' },
            ],
            points: 10,
          },
          {
            title: 'Менеджер контактов',
            description: 'Реализуйте простой менеджер контактов с использованием словаря и функций.',
            difficulty: 'medium',
            starterCode: '# Менеджер контактов\n# Команды:\n# add имя телефон — добавить контакт\n# find имя — найти контакт (вывести телефон или "Не найден")\n# delete имя — удалить контакт\n# list — вывести все контакты в алфавитном порядке\n\ncontacts = {}\n\nn = int(input())\nfor _ in range(n):\n    parts = input().split(maxsplit=2)\n    cmd = parts[0]\n    if cmd == "add":\n        contacts[parts[1]] = parts[2]\n    elif cmd == "find":\n        print(contacts.get(parts[1], "Не найден"))\n    elif cmd == "delete":\n        contacts.pop(parts[1], None)\n    elif cmd == "list":\n        for name in sorted(contacts):\n            print(f"{name}: {contacts[name]}")\n',
            testCases: [
              { input: '6\nadd Алексей 123456\nadd Мария 789012\nfind Алексей\ndelete Алексей\nfind Алексей\nlist', expectedOutput: '123456\nНе найден\nМария: 789012', description: 'Добавление, поиск, удаление' },
              { input: '4\nadd Б 222\nadd А 111\nadd В 333\nlist', expectedOutput: 'А: 111\nБ: 222\nВ: 333', description: 'Сортировка по алфавиту' },
            ],
            points: 15,
          },
          {
            title: 'Класс GameCharacter',
            description: 'Создайте класс игрового персонажа с HP, атакой, защитой и системой боя.',
            difficulty: 'medium',
            starterCode: 'class GameCharacter:\n    def __init__(self, name, hp, attack, defense):\n        # Ваш код: сохраните атрибуты\n        # max_hp = hp (для ограничения лечения)\n        pass\n\n    def take_damage(self, damage):\n        # Урон = damage - defense (минимум 1)\n        # HP не может быть меньше 0\n        pass\n\n    def heal(self, amount):\n        # Лечение, HP не может превысить max_hp\n        pass\n\n    def is_alive(self):\n        pass\n\n    def __str__(self):\n        # "<name>: <hp>/<max_hp> HP"\n        pass\n\n# Считайте данные двух персонажей\nname1, hp1, atk1, def1 = input().split(",")\np1 = GameCharacter(name1.strip(), int(hp1), int(atk1), int(def1))\nname2, hp2, atk2, def2 = input().split(",")\np2 = GameCharacter(name2.strip(), int(hp2), int(atk2), int(def2))\n\n# Бой: персонажи атакуют по очереди, пока один не падёт\nwhile p1.is_alive() and p2.is_alive():\n    p2.take_damage(p1.attack)\n    if p2.is_alive():\n        p1.take_damage(p2.attack)\n\nprint(p1)\nprint(p2)\nif p1.is_alive():\n    print(f"Победитель: {p1.name}")\nelse:\n    print(f"Победитель: {p2.name}")\n',
            testCases: [
              { input: 'Воин, 100, 20, 5\nМаг, 80, 25, 3', expectedOutput: 'Воин: 25/100 HP\nМаг: 0/80 HP\nПобедитель: Воин', description: 'Воин vs Маг' },
              { input: 'Рыцарь, 50, 10, 8\nЛучник, 40, 15, 2', expectedOutput: 'Рыцарь: 8/50 HP\nЛучник: 0/40 HP\nПобедитель: Рыцарь', description: 'Рыцарь vs Лучник' },
            ],
            points: 15,
          },
        ],
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
        assignments: [
          {
            title: 'Hello World',
            description: 'Напишите программу, которая выводит "Hello, World!" на экран.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Ваш код здесь\n    return 0;\n}\n',
            testCases: [
              { input: '', expectedOutput: 'Hello, World!', description: 'Вывод Hello, World!' },
            ],
            points: 10,
          },
          {
            title: 'Приветствие по имени',
            description: 'Напишите программу, которая считывает имя и выводит "Привет, <имя>!".',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Считайте имя\n    // Выведите: Привет, <имя>!\n    return 0;\n}\n',
            testCases: [
              { input: 'Алексей', expectedOutput: 'Привет, Алексей!', description: 'Имя Алексей' },
              { input: 'Мария', expectedOutput: 'Привет, Мария!', description: 'Имя Мария' },
              { input: 'World', expectedOutput: 'Привет, World!', description: 'Имя World' },
            ],
            points: 10,
          },
          {
            title: 'Три строки вывода',
            description: 'Напишите программу, которая выводит три строки: "Я учу C++", "C++ — мощный язык", "Начнём!".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Выведите три строки, каждую на новой строке\n    return 0;\n}\n',
            testCases: [
              { input: '', expectedOutput: 'Я учу C++\nC++ — мощный язык\nНачнём!', description: 'Три строки вывода' },
            ],
            points: 15,
          },
          {
            title: 'Рамка из символов',
            description: 'Считайте слово и выведите его в рамке из звёздочек. Например, для "Hi": "****", "* Hi *", "****".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string word;\n    cin >> word;\n    // Постройте рамку из * вокруг слова\n    // Формат: звёздочки, * слово *, звёздочки\n    return 0;\n}\n',
            testCases: [
              { input: 'Hi', expectedOutput: '******\n* Hi *\n******', description: 'Слово Hi' },
              { input: 'Hello', expectedOutput: '*********\n* Hello *\n*********', description: 'Слово Hello' },
              { input: 'A', expectedOutput: '*****\n* A *\n*****', description: 'Одна буква' },
            ],
            points: 15,
          },
          {
            title: 'ASCII-арт треугольник',
            description: 'Считайте число N (1-5) и выведите прямоугольный треугольник из символов * высотой N строк.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выведите треугольник из *\n    // Строка 1: *\n    // Строка 2: **\n    // ...\n    // Строка N: N звёздочек\n    return 0;\n}\n',
            testCases: [
              { input: '3', expectedOutput: '*\n**\n***', description: 'Треугольник высотой 3' },
              { input: '5', expectedOutput: '*\n**\n***\n****\n*****', description: 'Треугольник высотой 5' },
              { input: '1', expectedOutput: '*', description: 'Треугольник высотой 1' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Переменные',
            description: 'Объявите переменные разных типов и выведите их.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Объявите переменные name (string), age (int), grade (double)\n    // Считайте их и выведите в формате:\n    // Имя: <name>\n    // Возраст: <age>\n    // Оценка: <grade>\n    return 0;\n}\n',
            testCases: [
              { input: 'Алексей\n13\n4.5', expectedOutput: 'Имя: Алексей\nВозраст: 13\nОценка: 4.5', description: 'Ввод и вывод' },
            ],
            points: 10,
          },
          {
            title: 'Обмен переменных',
            description: 'Считайте два целых числа a и b. Обменяйте их значения и выведите результат.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Обменяйте значения a и b\n    // Выведите a и b через пробел\n    return 0;\n}\n',
            testCases: [
              { input: '5 10', expectedOutput: '10 5', description: 'Обмен 5 и 10' },
              { input: '0 42', expectedOutput: '42 0', description: 'Обмен 0 и 42' },
              { input: '-3 7', expectedOutput: '7 -3', description: 'Обмен отрицательного и положительного' },
            ],
            points: 10,
          },
          {
            title: 'Размер переменных',
            description: 'Выведите размеры типов int, double, char и bool (в байтах), каждый на новой строке.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Используйте sizeof() для определения размера типов\n    // Выведите: sizeof(int), sizeof(double), sizeof(char), sizeof(bool)\n    return 0;\n}\n',
            testCases: [
              { input: '', expectedOutput: '4\n8\n1\n1', description: 'Стандартные размеры типов' },
            ],
            points: 15,
          },
          {
            title: 'Преобразование температуры',
            description: 'Считайте температуру в Цельсиях (double). Выведите её в Фаренгейтах с 1 знаком после запятой. Формула: F = C * 9/5 + 32.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    double celsius;\n    cin >> celsius;\n    // Переведите в Фаренгейты: F = C * 9/5 + 32\n    // Выведите с 1 знаком после запятой\n    return 0;\n}\n',
            testCases: [
              { input: '0', expectedOutput: '32.0', description: '0°C = 32°F' },
              { input: '100', expectedOutput: '212.0', description: '100°C = 212°F' },
              { input: '36.6', expectedOutput: '97.9', description: '36.6°C = 97.9°F' },
            ],
            points: 15,
          },
          {
            title: 'Визитка программиста',
            description: 'Считайте имя (string), возраст (int), рост (double) и любимый символ (char). Выведите визитку в формате: "=== Визитка ===", "Имя: <имя>", "Возраст: <возраст>", "Рост: <рост> м", "Символ: <символ>".',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    // Считайте: имя, возраст, рост, символ\n    // Выведите красивую визитку\n    return 0;\n}\n',
            testCases: [
              { input: 'Алексей\n14\n1.65\n@', expectedOutput: '=== Визитка ===\nИмя: Алексей\nВозраст: 14\nРост: 1.65 м\nСимвол: @', description: 'Визитка Алексея' },
              { input: 'Мария\n15\n1.70\n#', expectedOutput: '=== Визитка ===\nИмя: Мария\nВозраст: 15\nРост: 1.7 м\nСимвол: #', description: 'Визитка Марии' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Ввод и вывод',
            description: 'Считайте имя и возраст, выведите приветствие.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Считайте имя и возраст\n    // Выведите: Привет, <имя>! Тебе <возраст> лет.\n    return 0;\n}\n',
            testCases: [
              { input: 'Алексей\n13', expectedOutput: 'Привет, Алексей! Тебе 13 лет.', description: 'Приветствие' },
              { input: 'Мария\n15', expectedOutput: 'Привет, Мария! Тебе 15 лет.', description: 'Приветствие Мария' },
            ],
            points: 10,
          },
          {
            title: 'Сумма трёх чисел',
            description: 'Считайте три целых числа на одной строке. Выведите их сумму.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Выведите сумму\n    return 0;\n}\n',
            testCases: [
              { input: '1 2 3', expectedOutput: '6', description: '1+2+3=6' },
              { input: '10 20 30', expectedOutput: '60', description: '10+20+30=60' },
              { input: '-5 0 5', expectedOutput: '0', description: '-5+0+5=0' },
            ],
            points: 10,
          },
          {
            title: 'Форматированный вывод числа Пи',
            description: 'Считайте целое число N (1-10). Выведите число Пи (3.14159265358979) с N знаками после запятой.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    double pi = 3.14159265358979;\n    // Выведите pi с n знаками после запятой\n    // Используйте fixed и setprecision\n    return 0;\n}\n',
            testCases: [
              { input: '2', expectedOutput: '3.14', description: 'Pi с 2 знаками' },
              { input: '5', expectedOutput: '3.14159', description: 'Pi с 5 знаками' },
              { input: '0', expectedOutput: '3', description: 'Pi без знаков' },
            ],
            points: 15,
          },
          {
            title: 'Строка с пробелами',
            description: 'Считайте полное имя (с пробелами) через getline. Выведите: "Здравствуйте, <полное имя>!".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string fullName;\n    // Используйте getline для считывания строки с пробелами\n    getline(cin, fullName);\n    // Выведите приветствие\n    return 0;\n}\n',
            testCases: [
              { input: 'Иван Петров', expectedOutput: 'Здравствуйте, Иван Петров!', description: 'Полное имя' },
              { input: 'Анна Мария Сергеева', expectedOutput: 'Здравствуйте, Анна Мария Сергеева!', description: 'Три слова' },
            ],
            points: 15,
          },
          {
            title: 'Форматированная таблица',
            description: 'Считайте 3 товара (название и цена на каждой строке). Выведите таблицу: каждый товар на строке в формате "<название>: <цена> руб.". В конце выведите "Итого: <сумма> руб.".',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Считайте 3 пары: название (string) и цена (int)\n    // Формат ввода: название на первой строке, цена на второй\n    // Выведите таблицу и итог\n    return 0;\n}\n',
            testCases: [
              { input: 'Хлеб\n50\nМолоко\n80\nСыр\n200', expectedOutput: 'Хлеб: 50 руб.\nМолоко: 80 руб.\nСыр: 200 руб.\nИтого: 330 руб.', description: 'Три товара' },
              { input: 'Ручка\n30\nТетрадь\n45\nЛинейка\n25', expectedOutput: 'Ручка: 30 руб.\nТетрадь: 45 руб.\nЛинейка: 25 руб.\nИтого: 100 руб.', description: 'Канцтовары' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Калькулятор C++',
            description: 'Считайте два числа a и b, выведите результаты всех операций: сложение, вычитание, умножение, целочисленное деление, остаток.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Выведите результаты: +, -, *, /, %\n    return 0;\n}\n',
            testCases: [
              { input: '10 3', expectedOutput: '13\n7\n30\n3\n1', description: '10 и 3' },
              { input: '20 4', expectedOutput: '24\n16\n80\n5\n0', description: '20 и 4' },
              { input: '7 2', expectedOutput: '9\n5\n14\n3\n1', description: '7 и 2' },
            ],
            points: 10,
          },
          {
            title: 'Площадь и периметр',
            description: 'Считайте длину и ширину прямоугольника (целые числа). Выведите площадь и периметр на отдельных строках.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Вычислите и выведите площадь и периметр\n    return 0;\n}\n',
            testCases: [
              { input: '5 3', expectedOutput: '15\n16', description: '5x3' },
              { input: '10 10', expectedOutput: '100\n40', description: 'Квадрат 10x10' },
              { input: '1 7', expectedOutput: '7\n16', description: '1x7' },
            ],
            points: 10,
          },
          {
            title: 'Разделение на часы и минуты',
            description: 'Считайте количество минут (целое число). Выведите в формате "<часы> ч <минуты> мин".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int totalMinutes;\n    cin >> totalMinutes;\n    // Разделите на часы и минуты\n    // Используйте / и %\n    return 0;\n}\n',
            testCases: [
              { input: '150', expectedOutput: '2 ч 30 мин', description: '150 минут' },
              { input: '60', expectedOutput: '1 ч 0 мин', description: 'Ровно час' },
              { input: '45', expectedOutput: '0 ч 45 мин', description: 'Меньше часа' },
              { input: '1000', expectedOutput: '16 ч 40 мин', description: '1000 минут' },
            ],
            points: 15,
          },
          {
            title: 'Среднее арифметическое',
            description: 'Считайте 5 целых чисел. Выведите их среднее арифметическое с 2 знаками после запятой.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int a, b, c, d, e;\n    cin >> a >> b >> c >> d >> e;\n    // Вычислите среднее и выведите с 2 знаками\n    // Не забудьте про вещественное деление!\n    return 0;\n}\n',
            testCases: [
              { input: '10 20 30 40 50', expectedOutput: '30.00', description: 'Среднее 30' },
              { input: '1 2 3 4 5', expectedOutput: '3.00', description: 'Среднее 3' },
              { input: '7 3 8 2 5', expectedOutput: '5.00', description: 'Среднее 5' },
              { input: '1 1 1 1 2', expectedOutput: '1.20', description: 'Среднее 1.20' },
            ],
            points: 15,
          },
          {
            title: 'Разбиение числа на цифры',
            description: 'Считайте трёхзначное число. Выведите на отдельных строках: сотни, десятки, единицы, а затем сумму цифр.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Разбейте число на цифры: сотни, десятки, единицы\n    // Используйте / и %\n    // Выведите каждую цифру и их сумму\n    return 0;\n}\n',
            testCases: [
              { input: '123', expectedOutput: '1\n2\n3\n6', description: '123 -> 1,2,3 сумма=6' },
              { input: '456', expectedOutput: '4\n5\n6\n15', description: '456 -> 4,5,6 сумма=15' },
              { input: '900', expectedOutput: '9\n0\n0\n9', description: '900 -> 9,0,0 сумма=9' },
              { input: '111', expectedOutput: '1\n1\n1\n3', description: '111 -> 1,1,1 сумма=3' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Чётное или нечётное',
            description: 'Считайте целое число. Выведите "Четное" или "Нечетное".',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Проверьте чётность числа\n    return 0;\n}\n',
            testCases: [
              { input: '4', expectedOutput: 'Четное', description: '4 — чётное' },
              { input: '7', expectedOutput: 'Нечетное', description: '7 — нечётное' },
              { input: '0', expectedOutput: 'Четное', description: '0 — чётное' },
              { input: '-3', expectedOutput: 'Нечетное', description: '-3 — нечётное' },
            ],
            points: 10,
          },
          {
            title: 'Максимум из трёх',
            description: 'Считайте три целых числа. Выведите наибольшее из них.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Найдите и выведите максимальное\n    return 0;\n}\n',
            testCases: [
              { input: '1 2 3', expectedOutput: '3', description: 'Максимум 3' },
              { input: '10 5 8', expectedOutput: '10', description: 'Максимум 10' },
              { input: '-1 -5 -3', expectedOutput: '-1', description: 'Максимум -1' },
              { input: '7 7 7', expectedOutput: '7', description: 'Все равны' },
            ],
            points: 15,
          },
          {
            title: 'Классификация возраста',
            description: 'Считайте возраст (целое число). Выведите категорию: 0-6 — "Малыш", 7-12 — "Ребёнок", 13-17 — "Подросток", 18-64 — "Взрослый", 65+ — "Пенсионер".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int age;\n    cin >> age;\n    // Определите категорию возраста\n    return 0;\n}\n',
            testCases: [
              { input: '3', expectedOutput: 'Малыш', description: '3 года' },
              { input: '10', expectedOutput: 'Ребёнок', description: '10 лет' },
              { input: '15', expectedOutput: 'Подросток', description: '15 лет' },
              { input: '30', expectedOutput: 'Взрослый', description: '30 лет' },
              { input: '70', expectedOutput: 'Пенсионер', description: '70 лет' },
            ],
            points: 15,
          },
          {
            title: 'Решение квадратного уравнения',
            description: 'Считайте коэффициенты a, b, c квадратного уравнения ax^2+bx+c=0. Выведите количество корней: "Нет корней", "Один корень: <x>" или "Два корня: <x1> <x2>" (с 2 знаками, x1 < x2).',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <cmath>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    double a, b, c;\n    cin >> a >> b >> c;\n    // Вычислите дискриминант D = b*b - 4*a*c\n    // Если D < 0 — нет корней\n    // Если D == 0 — один корень\n    // Если D > 0 — два корня\n    cout << fixed << setprecision(2);\n    return 0;\n}\n',
            testCases: [
              { input: '1 -3 2', expectedOutput: 'Два корня: 1.00 2.00', description: 'x^2-3x+2=0' },
              { input: '1 -2 1', expectedOutput: 'Один корень: 1.00', description: 'x^2-2x+1=0' },
              { input: '1 1 1', expectedOutput: 'Нет корней', description: 'x^2+x+1=0' },
              { input: '2 -8 6', expectedOutput: 'Два корня: 1.00 3.00', description: '2x^2-8x+6=0' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
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
          {
            title: 'Месяц и время года',
            description: 'Считайте номер месяца (1-12). Выведите время года: 12,1,2 — "Зима", 3,4,5 — "Весна", 6,7,8 — "Лето", 9,10,11 — "Осень". Для некорректного — "Ошибка".',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int month;\n    cin >> month;\n    // Используйте switch/case для определения времени года\n    return 0;\n}\n',
            testCases: [
              { input: '1', expectedOutput: 'Зима', description: 'Январь — зима' },
              { input: '4', expectedOutput: 'Весна', description: 'Апрель — весна' },
              { input: '7', expectedOutput: 'Лето', description: 'Июль — лето' },
              { input: '10', expectedOutput: 'Осень', description: 'Октябрь — осень' },
              { input: '13', expectedOutput: 'Ошибка', description: 'Некорректный месяц' },
            ],
            points: 10,
          },
          {
            title: 'Калькулятор с операцией',
            description: 'Считайте два числа и символ операции (+, -, *, /). Выведите результат. Для деления на 0 — "Деление на ноль". Для неизвестной операции — "Неизвестная операция".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    double a, b;\n    char op;\n    cin >> a >> op >> b;\n    // Используйте switch для выбора операции\n    return 0;\n}\n',
            testCases: [
              { input: '10 + 5', expectedOutput: '15', description: '10+5=15' },
              { input: '10 - 3', expectedOutput: '7', description: '10-3=7' },
              { input: '4 * 3', expectedOutput: '12', description: '4*3=12' },
              { input: '10 / 0', expectedOutput: 'Деление на ноль', description: 'Деление на 0' },
              { input: '5 ^ 2', expectedOutput: 'Неизвестная операция', description: 'Неизвестная операция' },
            ],
            points: 15,
          },
          {
            title: 'Оценка словом',
            description: 'Считайте оценку (целое число 2-5). Выведите словесный эквивалент: 5 — "Отлично", 4 — "Хорошо", 3 — "Удовлетворительно", 2 — "Неудовлетворительно". Иначе — "Некорректная оценка".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int grade;\n    cin >> grade;\n    // Используйте switch/case\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: 'Отлично', description: 'Оценка 5' },
              { input: '4', expectedOutput: 'Хорошо', description: 'Оценка 4' },
              { input: '3', expectedOutput: 'Удовлетворительно', description: 'Оценка 3' },
              { input: '2', expectedOutput: 'Неудовлетворительно', description: 'Оценка 2' },
              { input: '1', expectedOutput: 'Некорректная оценка', description: 'Оценка 1' },
            ],
            points: 15,
          },
          {
            title: 'Меню действий',
            description: 'Реализуйте меню. Считайте число (пункт меню) и параметр. 1 — площадь квадрата (сторона), 2 — площадь круга (радиус, Pi=3.14159), 3 — удвоить число. Для несуществующего пункта — "Нет такого пункта". Вывод с 2 знаками после запятой.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int choice;\n    double param;\n    cin >> choice >> param;\n    cout << fixed << setprecision(2);\n    // switch по choice:\n    // 1 — площадь квадрата\n    // 2 — площадь круга\n    // 3 — удвоить число\n    return 0;\n}\n',
            testCases: [
              { input: '1 5', expectedOutput: '25.00', description: 'Квадрат 5' },
              { input: '2 3', expectedOutput: '28.27', description: 'Круг r=3' },
              { input: '3 7', expectedOutput: '14.00', description: 'Удвоить 7' },
              { input: '4 1', expectedOutput: 'Нет такого пункта', description: 'Несуществующий пункт' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Сумма до нуля',
            description: 'Считывайте числа, пока не введён 0. Выведите сумму.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Считывайте числа до 0\n    // Выведите сумму\n    return 0;\n}\n',
            testCases: [
              { input: '5\n3\n-2\n0', expectedOutput: '6', description: '5+3-2=6' },
              { input: '10\n20\n30\n0', expectedOutput: '60', description: '10+20+30=60' },
              { input: '0', expectedOutput: '0', description: 'Сразу 0' },
            ],
            points: 10,
          },
          {
            title: 'Обратный отсчёт',
            description: 'Считайте целое число N. Выведите числа от N до 1 через пробел, используя while.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выведите числа от n до 1 через пробел\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '5 4 3 2 1', description: 'От 5 до 1' },
              { input: '3', expectedOutput: '3 2 1', description: 'От 3 до 1' },
              { input: '1', expectedOutput: '1', description: 'Только 1' },
            ],
            points: 10,
          },
          {
            title: 'Количество цифр',
            description: 'Считайте целое положительное число. Выведите количество цифр в нём, используя while.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте количество цифр\n    // Делите число на 10, пока оно не станет 0\n    return 0;\n}\n',
            testCases: [
              { input: '12345', expectedOutput: '5', description: '5 цифр' },
              { input: '7', expectedOutput: '1', description: '1 цифра' },
              { input: '100', expectedOutput: '3', description: '3 цифры' },
              { input: '999999', expectedOutput: '6', description: '6 цифр' },
            ],
            points: 15,
          },
          {
            title: 'Степень двойки',
            description: 'Считайте число N. Найдите наименьшую степень двойки, которая >= N. Выведите эту степень.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Начните с 1 и умножайте на 2, пока не станет >= n\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '8', description: 'Ближайшая степень 2 для 5' },
              { input: '16', expectedOutput: '16', description: '16 уже степень 2' },
              { input: '1', expectedOutput: '1', description: '1 = 2^0' },
              { input: '100', expectedOutput: '128', description: 'Ближайшая степень 2 для 100' },
            ],
            points: 15,
          },
          {
            title: 'Числа Фибоначчи до N',
            description: 'Считайте число N. Выведите все числа Фибоначчи, не превышающие N, через пробел. Последовательность: 1, 1, 2, 3, 5, 8, ...',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выведите числа Фибоначчи <= n\n    // F(1)=1, F(2)=1, F(k) = F(k-1) + F(k-2)\n    return 0;\n}\n',
            testCases: [
              { input: '10', expectedOutput: '1 1 2 3 5 8', description: 'Фибоначчи до 10' },
              { input: '1', expectedOutput: '1 1', description: 'Фибоначчи до 1' },
              { input: '100', expectedOutput: '1 1 2 3 5 8 13 21 34 55 89', description: 'Фибоначчи до 100' },
              { input: '21', expectedOutput: '1 1 2 3 5 8 13 21', description: 'Фибоначчи до 21' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Таблица умножения',
            description: 'Считайте число N, выведите таблицу умножения для N (1-10).',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выведите таблицу: N * i = результат\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '5 * 1 = 5\n5 * 2 = 10\n5 * 3 = 15\n5 * 4 = 20\n5 * 5 = 25\n5 * 6 = 30\n5 * 7 = 35\n5 * 8 = 40\n5 * 9 = 45\n5 * 10 = 50', description: 'Таблица для 5' },
              { input: '3', expectedOutput: '3 * 1 = 3\n3 * 2 = 6\n3 * 3 = 9\n3 * 4 = 12\n3 * 5 = 15\n3 * 6 = 18\n3 * 7 = 21\n3 * 8 = 24\n3 * 9 = 27\n3 * 10 = 30', description: 'Таблица для 3' },
            ],
            points: 10,
          },
          {
            title: 'Сумма чётных',
            description: 'Считайте число N. Выведите сумму всех чётных чисел от 1 до N включительно.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите сумму чётных чисел от 1 до n\n    return 0;\n}\n',
            testCases: [
              { input: '10', expectedOutput: '30', description: '2+4+6+8+10=30' },
              { input: '5', expectedOutput: '6', description: '2+4=6' },
              { input: '1', expectedOutput: '0', description: 'Нет чётных' },
              { input: '20', expectedOutput: '110', description: 'Сумма чётных до 20' },
            ],
            points: 10,
          },
          {
            title: 'Факториал',
            description: 'Считайте число N (0-12). Выведите N! (факториал). 0! = 1.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Вычислите факториал: n! = 1 * 2 * ... * n\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '120', description: '5! = 120' },
              { input: '0', expectedOutput: '1', description: '0! = 1' },
              { input: '10', expectedOutput: '3628800', description: '10! = 3628800' },
              { input: '1', expectedOutput: '1', description: '1! = 1' },
            ],
            points: 15,
          },
          {
            title: 'Простые числа в диапазоне',
            description: 'Считайте два числа A и B (A <= B). Выведите все простые числа в диапазоне [A, B] через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Переберите числа от a до b\n    // Для каждого проверьте, простое ли оно\n    return 0;\n}\n',
            testCases: [
              { input: '1 20', expectedOutput: '2 3 5 7 11 13 17 19', description: 'Простые до 20' },
              { input: '10 30', expectedOutput: '11 13 17 19 23 29', description: 'Простые 10-30' },
              { input: '2 2', expectedOutput: '2', description: 'Только 2' },
            ],
            points: 15,
          },
          {
            title: 'Рисование прямоугольника',
            description: 'Считайте два числа: ширину W и высоту H. Выведите прямоугольник из символов *, где рамка из *, а внутри пробелы.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int w, h;\n    cin >> w >> h;\n    // Нарисуйте прямоугольник из *\n    // Первая и последняя строки — полностью из *\n    // Средние строки — * по краям, пробелы внутри\n    return 0;\n}\n',
            testCases: [
              { input: '5 3', expectedOutput: '*****\n*   *\n*****', description: '5x3' },
              { input: '4 4', expectedOutput: '****\n*  *\n*  *\n****', description: '4x4' },
              { input: '3 2', expectedOutput: '***\n***', description: '3x2' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Работа с массивом',
            description: 'Считайте N чисел в массив, выведите сумму, максимум и минимум на отдельных строках.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    // Считайте массив и выведите сумму, макс, мин\n    return 0;\n}\n',
            testCases: [
              { input: '5\n10 20 30 40 50', expectedOutput: '150\n50\n10', description: '5 чисел' },
              { input: '3\n-5 0 5', expectedOutput: '0\n5\n-5', description: 'С отрицательными' },
              { input: '1\n42', expectedOutput: '42\n42\n42', description: 'Один элемент' },
            ],
            points: 10,
          },
          {
            title: 'Реверс массива',
            description: 'Считайте N чисел. Выведите массив в обратном порядке через пробел.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Выведите массив в обратном порядке\n    return 0;\n}\n',
            testCases: [
              { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: 'Реверс 1-5' },
              { input: '3\n10 20 30', expectedOutput: '30 20 10', description: 'Реверс 3 чисел' },
              { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
            ],
            points: 10,
          },
          {
            title: 'Подсчёт элементов',
            description: 'Считайте N чисел и число X. Выведите, сколько раз X встречается в массиве.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int x;\n    cin >> x;\n    // Подсчитайте количество вхождений x\n    return 0;\n}\n',
            testCases: [
              { input: '7\n1 2 3 2 4 2 5\n2', expectedOutput: '3', description: '2 встречается 3 раза' },
              { input: '5\n1 1 1 1 1\n1', expectedOutput: '5', description: 'Все одинаковые' },
              { input: '4\n1 2 3 4\n5', expectedOutput: '0', description: 'Не найден' },
            ],
            points: 15,
          },
          {
            title: 'Сдвиг массива влево',
            description: 'Считайте N чисел. Сдвиньте все элементы на 1 позицию влево (первый элемент становится последним). Выведите результат через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Сдвиньте элементы влево на 1 позицию\n    // Первый элемент -> в конец\n    return 0;\n}\n',
            testCases: [
              { input: '5\n1 2 3 4 5', expectedOutput: '2 3 4 5 1', description: 'Сдвиг 1-5' },
              { input: '3\n10 20 30', expectedOutput: '20 30 10', description: 'Сдвиг 3 чисел' },
              { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
            ],
            points: 15,
          },
          {
            title: 'Удаление дубликатов',
            description: 'Считайте N чисел. Выведите только уникальные элементы в порядке первого появления, через пробел.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Выведите уникальные элементы (в порядке первого появления)\n    return 0;\n}\n',
            testCases: [
              { input: '7\n1 2 3 2 4 1 5', expectedOutput: '1 2 3 4 5', description: 'Удалены повторы' },
              { input: '5\n5 5 5 5 5', expectedOutput: '5', description: 'Все одинаковые' },
              { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Нет повторов' },
              { input: '6\n3 1 4 1 5 9', expectedOutput: '3 1 4 5 9', description: 'Одна единица убрана' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Обработка строк',
            description: 'Считайте строку, выведите её длину, первый и последний символы — каждое на новой строке.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Выведите длину, первый символ, последний символ\n    return 0;\n}\n',
            testCases: [
              { input: 'Hello', expectedOutput: '5\nH\no', description: 'Строка Hello' },
              { input: 'A', expectedOutput: '1\nA\nA', description: 'Одна буква' },
              { input: 'Привет', expectedOutput: '12\nП\nт', description: 'Кириллица (UTF-8)' },
            ],
            points: 10,
          },
          {
            title: 'Подсчёт гласных',
            description: 'Считайте строку из латинских букв. Выведите количество гласных (a, e, i, o, u — без учёта регистра).',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    // Подсчитайте количество гласных (a, e, i, o, u)\n    return 0;\n}\n',
            testCases: [
              { input: 'Hello World', expectedOutput: '3', description: 'e, o, o' },
              { input: 'aeiou', expectedOutput: '5', description: 'Все гласные' },
              { input: 'bcdfg', expectedOutput: '0', description: 'Нет гласных' },
              { input: 'APPLE', expectedOutput: '2', description: 'Заглавные A и E' },
            ],
            points: 10,
          },
          {
            title: 'Замена символа',
            description: 'Считайте строку, затем два символа: старый и новый. Замените все вхождения старого символа на новый и выведите результат.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    char oldChar, newChar;\n    cin >> oldChar >> newChar;\n    // Замените все oldChar на newChar в строке s\n    return 0;\n}\n',
            testCases: [
              { input: 'Hello World\no a', expectedOutput: 'Hella Warld', description: 'o -> a' },
              { input: 'aabbcc\na x', expectedOutput: 'xxbbcc', description: 'a -> x' },
              { input: 'test\nz q', expectedOutput: 'test', description: 'Нет замен' },
            ],
            points: 15,
          },
          {
            title: 'Палиндром',
            description: 'Считайте строку (только строчные латинские буквы без пробелов). Выведите "YES", если строка палиндром (читается одинаково слева направо и справа налево), иначе "NO".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте, является ли строка палиндромом\n    return 0;\n}\n',
            testCases: [
              { input: 'abcba', expectedOutput: 'YES', description: 'abcba — палиндром' },
              { input: 'hello', expectedOutput: 'NO', description: 'hello — не палиндром' },
              { input: 'a', expectedOutput: 'YES', description: 'Одна буква' },
              { input: 'abba', expectedOutput: 'YES', description: 'abba — палиндром' },
              { input: 'abc', expectedOutput: 'NO', description: 'abc — не палиндром' },
            ],
            points: 15,
          },
          {
            title: 'Подсчёт слов',
            description: 'Считайте строку (слова разделены пробелами). Выведите количество слов и самое длинное слово. Если несколько слов одинаковой длины — выведите первое.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    // Разбейте строку на слова (через stringstream или вручную)\n    // Подсчитайте количество слов\n    // Найдите самое длинное слово\n    return 0;\n}\n',
            testCases: [
              { input: 'Hello beautiful world', expectedOutput: '3\nbeautiful', description: '3 слова, longest=beautiful' },
              { input: 'one', expectedOutput: '1\none', description: 'Одно слово' },
              { input: 'a bb ccc dd e', expectedOutput: '5\nccc', description: '5 слов, longest=ccc' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Функция is_prime',
            description: 'Напишите функцию isPrime(n), которая проверяет простоту числа. Считайте число и выведите YES или NO.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nbool isPrime(int n) {\n    // Ваш код\n    return false;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << (isPrime(n) ? "YES" : "NO") << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '7', expectedOutput: 'YES', description: '7 — простое' },
              { input: '12', expectedOutput: 'NO', description: '12 — не простое' },
              { input: '2', expectedOutput: 'YES', description: '2 — простое' },
              { input: '1', expectedOutput: 'NO', description: '1 — не простое' },
            ],
            points: 10,
          },
          {
            title: 'Функция возведения в степень',
            description: 'Напишите функцию power(base, exp), которая возводит base в степень exp (exp >= 0). Считайте два числа и выведите результат.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nlong long power(int base, int exp) {\n    // Вычислите base^exp\n    // Используйте цикл\n    return 0;\n}\n\nint main() {\n    int base, exp;\n    cin >> base >> exp;\n    cout << power(base, exp) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '2 10', expectedOutput: '1024', description: '2^10=1024' },
              { input: '5 3', expectedOutput: '125', description: '5^3=125' },
              { input: '7 0', expectedOutput: '1', description: '7^0=1' },
              { input: '3 4', expectedOutput: '81', description: '3^4=81' },
            ],
            points: 10,
          },
          {
            title: 'Функция НОД',
            description: 'Напишите функцию gcd(a, b), которая находит наибольший общий делитель (алгоритм Евклида). Считайте два числа и выведите НОД.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint gcd(int a, int b) {\n    // Алгоритм Евклида\n    // Пока b != 0: temp = b, b = a % b, a = temp\n    return 0;\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << gcd(a, b) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '12 8', expectedOutput: '4', description: 'НОД(12,8)=4' },
              { input: '100 75', expectedOutput: '25', description: 'НОД(100,75)=25' },
              { input: '17 13', expectedOutput: '1', description: 'Взаимно простые' },
              { input: '24 36', expectedOutput: '12', description: 'НОД(24,36)=12' },
            ],
            points: 15,
          },
          {
            title: 'Рекурсивный факториал',
            description: 'Напишите рекурсивную функцию factorial(n). Считайте число N (0-12) и выведите N!.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Базовый случай: если n <= 1, вернуть 1\n    // Рекурсивный случай: n * factorial(n-1)\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '120', description: '5!=120' },
              { input: '0', expectedOutput: '1', description: '0!=1' },
              { input: '10', expectedOutput: '3628800', description: '10!=3628800' },
              { input: '12', expectedOutput: '479001600', description: '12!=479001600' },
            ],
            points: 15,
          },
          {
            title: 'Массив через функции',
            description: 'Реализуйте три функции: fillArray(arr, n) — заполняет массив из stdin, sumArray(arr, n) — возвращает сумму, avgArray(arr, n) — возвращает среднее. Считайте N чисел и выведите сумму и среднее (с 2 знаками).',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nvoid fillArray(int arr[], int n) {\n    // Считайте n чисел в массив\n}\n\nint sumArray(int arr[], int n) {\n    // Верните сумму элементов\n    return 0;\n}\n\ndouble avgArray(int arr[], int n) {\n    // Верните среднее арифметическое\n    return 0.0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    fillArray(arr, n);\n    cout << sumArray(arr, n) << endl;\n    cout << fixed << setprecision(2) << avgArray(arr, n) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n10 20 30 40 50', expectedOutput: '150\n30.00', description: 'Сумма 150, среднее 30' },
              { input: '3\n1 2 3', expectedOutput: '6\n2.00', description: 'Сумма 6, среднее 2' },
              { input: '4\n7 3 8 2', expectedOutput: '20\n5.00', description: 'Сумма 20, среднее 5' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Перегрузка area',
            description: 'Создайте перегруженные функции area для квадрата (1 параметр) и прямоугольника (2 параметра). Считайте данные и выведите площади.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\n// Ваши функции area\n\nint main() {\n    int side;\n    cin >> side;\n    cout << area(side) << endl;\n\n    int w, h;\n    cin >> w >> h;\n    cout << area(w, h) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n4 6', expectedOutput: '25\n24', description: 'Квадрат 5 и прямоугольник 4x6' },
              { input: '10\n3 7', expectedOutput: '100\n21', description: 'Квадрат 10 и прямоугольник 3x7' },
            ],
            points: 10,
          },
          {
            title: 'Перегрузка print',
            description: 'Создайте три перегруженные функции print: для int (выводит "Целое: <n>"), для double (выводит "Дробное: <n>" с 2 знаками), для string (выводит "Строка: <s>"). Считайте тип (1=int, 2=double, 3=string) и значение.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nvoid print(int n) {\n    // Выведите: Целое: n\n}\n\nvoid print(double n) {\n    // Выведите: Дробное: n (с 2 знаками)\n}\n\nvoid print(string s) {\n    // Выведите: Строка: s\n}\n\nint main() {\n    int type;\n    cin >> type;\n    if (type == 1) { int v; cin >> v; print(v); }\n    else if (type == 2) { double v; cin >> v; print(v); }\n    else { string v; cin >> v; print(v); }\n    return 0;\n}\n',
            testCases: [
              { input: '1\n42', expectedOutput: 'Целое: 42', description: 'Целое число' },
              { input: '2\n3.14159', expectedOutput: 'Дробное: 3.14', description: 'Дробное число' },
              { input: '3\nHello', expectedOutput: 'Строка: Hello', description: 'Строка' },
            ],
            points: 10,
          },
          {
            title: 'Функция max с перегрузкой',
            description: 'Создайте перегруженные функции maxOf: для двух int, для трёх int, для двух double. Считайте тип (2i, 3i, 2d) и числа, выведите максимум.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint maxOf(int a, int b) {\n    // Верните максимум из двух int\n    return 0;\n}\n\nint maxOf(int a, int b, int c) {\n    // Верните максимум из трёх int\n    return 0;\n}\n\ndouble maxOf(double a, double b) {\n    // Верните максимум из двух double\n    return 0;\n}\n\nint main() {\n    string type;\n    cin >> type;\n    if (type == "2i") {\n        int a, b; cin >> a >> b;\n        cout << maxOf(a, b) << endl;\n    } else if (type == "3i") {\n        int a, b, c; cin >> a >> b >> c;\n        cout << maxOf(a, b, c) << endl;\n    } else {\n        double a, b; cin >> a >> b;\n        cout << fixed << setprecision(2) << maxOf(a, b) << endl;\n    }\n    return 0;\n}\n',
            testCases: [
              { input: '2i\n5 10', expectedOutput: '10', description: 'max(5,10)=10' },
              { input: '3i\n3 7 5', expectedOutput: '7', description: 'max(3,7,5)=7' },
              { input: '2d\n3.14 2.71', expectedOutput: '3.14', description: 'max(3.14,2.71)=3.14' },
            ],
            points: 15,
          },
          {
            title: 'Значения по умолчанию',
            description: 'Напишите функцию greet(name, greeting="Привет"), которая выводит "<greeting>, <name>!". Считайте число строк N, затем N строк: если строка содержит 1 слово — вызовите с приветствием по умолчанию, если 2 слова — с пользовательским.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nvoid greet(string name, string greeting = "Привет") {\n    cout << greeting << ", " << name << "!" << endl;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    for (int i = 0; i < n; i++) {\n        string line;\n        getline(cin, line);\n        // Разберите строку: одно или два слова\n        // Вызовите greet соответственно\n    }\n    return 0;\n}\n',
            testCases: [
              { input: '3\nАлексей\nЗдравствуй Мария\nПетр', expectedOutput: 'Привет, Алексей!\nЗдравствуй, Мария!\nПривет, Петр!', description: 'Три приветствия' },
              { input: '2\nДобрыйДень Иван\nСергей', expectedOutput: 'ДобрыйДень, Иван!\nПривет, Сергей!', description: 'Два приветствия' },
            ],
            points: 15,
          },
          {
            title: 'Универсальный конвертер',
            description: 'Создайте перегруженные функции convert: convert(int km) — км в метры (km*1000), convert(double kg) — кг в граммы (kg*1000), convert(int hours, int minutes) — в общие минуты. Считайте тип (km/kg/time) и параметры, выведите результат.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint convert(int km) {\n    // Километры в метры\n    return 0;\n}\n\ndouble convert(double kg) {\n    // Килограммы в граммы\n    return 0;\n}\n\nint convert(int hours, int minutes) {\n    // Часы и минуты в общие минуты\n    return 0;\n}\n\nint main() {\n    string type;\n    cin >> type;\n    if (type == "km") {\n        int v; cin >> v;\n        cout << convert(v) << endl;\n    } else if (type == "kg") {\n        double v; cin >> v;\n        cout << fixed << setprecision(1) << convert(v) << endl;\n    } else {\n        int h, m; cin >> h >> m;\n        cout << convert(h, m) << endl;\n    }\n    return 0;\n}\n',
            testCases: [
              { input: 'km\n5', expectedOutput: '5000', description: '5 км = 5000 м' },
              { input: 'kg\n2.5', expectedOutput: '2500.0', description: '2.5 кг = 2500 г' },
              { input: 'time\n2 30', expectedOutput: '150', description: '2ч 30мин = 150 мин' },
              { input: 'km\n0', expectedOutput: '0', description: '0 км = 0 м' },
              { input: 'time\n0 45', expectedOutput: '45', description: '0ч 45мин = 45 мин' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Обмен через указатели',
            description: 'Напишите функцию swapPtr(int *a, int *b), которая обменивает значения через указатели.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid swapPtr(int *a, int *b) {\n    // Ваш код — обменяйте значения через разыменование\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    swapPtr(&a, &b);\n    cout << a << " " << b << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5 10', expectedOutput: '10 5', description: 'Обмен 5 и 10' },
              { input: '42 7', expectedOutput: '7 42', description: 'Обмен 42 и 7' },
              { input: '0 0', expectedOutput: '0 0', description: 'Обмен нулей' },
            ],
            points: 10,
          },
          {
            title: 'Увеличение через указатель',
            description: 'Напишите функцию addValue(int *ptr, int val), которая прибавляет val к значению по указателю. Считайте число и значение для прибавления, выведите результат.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid addValue(int *ptr, int val) {\n    // Прибавьте val к значению по указателю\n}\n\nint main() {\n    int n, val;\n    cin >> n >> val;\n    addValue(&n, val);\n    cout << n << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '10 5', expectedOutput: '15', description: '10+5=15' },
              { input: '0 100', expectedOutput: '100', description: '0+100=100' },
              { input: '50 -30', expectedOutput: '20', description: '50+(-30)=20' },
            ],
            points: 10,
          },
          {
            title: 'Поиск min и max через указатели',
            description: 'Напишите функцию findMinMax(int *arr, int n, int *min, int *max), которая находит минимум и максимум массива через указатели. Считайте N чисел, выведите min и max.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid findMinMax(int *arr, int n, int *minVal, int *maxVal) {\n    // Найдите минимум и максимум в массиве\n    // Запишите результаты через указатели\n}\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int minVal, maxVal;\n    findMinMax(arr, n, &minVal, &maxVal);\n    cout << minVal << " " << maxVal << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n3 1 4 1 5', expectedOutput: '1 5', description: 'min=1, max=5' },
              { input: '3\n-10 0 10', expectedOutput: '-10 10', description: 'min=-10, max=10' },
              { input: '1\n42', expectedOutput: '42 42', description: 'Один элемент' },
            ],
            points: 15,
          },
          {
            title: 'Массив через указатели',
            description: 'Считайте N чисел. Используя арифметику указателей (*(arr + i) вместо arr[i]), выведите элементы массива в обратном порядке.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    // Считайте массив используя указательную арифметику\n    for (int i = 0; i < n; i++) cin >> *(arr + i);\n    // Выведите в обратном порядке через пробел\n    // Используйте *(arr + i) для доступа\n    return 0;\n}\n',
            testCases: [
              { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: 'Реверс через указатели' },
              { input: '3\n10 20 30', expectedOutput: '30 20 10', description: 'Три числа' },
            ],
            points: 15,
          },
          {
            title: 'Динамический массив',
            description: 'Считайте N, затем N чисел. Выделите память через new, сохраните числа, отсортируйте по убыванию, выведите через пробел, освободите память через delete[].',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Выделите динамический массив через new\n    int *arr = new int[n];\n    // Считайте элементы\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Отсортируйте по убыванию\n    // Выведите через пробел\n    // Освободите память через delete[]\n    return 0;\n}\n',
            testCases: [
              { input: '5\n3 1 4 1 5', expectedOutput: '5 4 3 1 1', description: 'Сортировка по убыванию' },
              { input: '3\n10 20 30', expectedOutput: '30 20 10', description: 'Три числа' },
              { input: '4\n5 5 5 5', expectedOutput: '5 5 5 5', description: 'Все одинаковые' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Передача по ссылке',
            description: 'Напишите функцию multiplyBy2(int &n), которая удваивает число по ссылке. Считайте число, вызовите функцию 3 раза, выведите результат.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid multiplyBy2(int &n) {\n    // Удвойте число по ссылке\n}\n\nint main() {\n    int n;\n    cin >> n;\n    multiplyBy2(n);\n    multiplyBy2(n);\n    multiplyBy2(n);\n    cout << n << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5', expectedOutput: '40', description: '5*2*2*2=40' },
              { input: '3', expectedOutput: '24', description: '3*2*2*2=24' },
              { input: '1', expectedOutput: '8', description: '1*2*2*2=8' },
            ],
            points: 10,
          },
          {
            title: 'Обмен по ссылке',
            description: 'Напишите функцию swapRef(int &a, int &b), которая обменивает значения по ссылке. Считайте два числа, обменяйте и выведите.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid swapRef(int &a, int &b) {\n    // Обменяйте значения через ссылки\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    swapRef(a, b);\n    cout << a << " " << b << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '10 20', expectedOutput: '20 10', description: 'Обмен 10 и 20' },
              { input: '-5 5', expectedOutput: '5 -5', description: 'Обмен -5 и 5' },
              { input: '0 0', expectedOutput: '0 0', description: 'Обмен нулей' },
            ],
            points: 10,
          },
          {
            title: 'Нормализация массива',
            description: 'Напишите функцию normalize(int &val, int minVal, int maxVal), которая ограничивает значение диапазоном [minVal, maxVal]. Считайте N чисел и диапазон, нормализуйте каждый элемент, выведите через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid normalize(int &val, int minVal, int maxVal) {\n    // Если val < minVal, установите val = minVal\n    // Если val > maxVal, установите val = maxVal\n}\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int lo, hi;\n    cin >> lo >> hi;\n    for (int i = 0; i < n; i++) normalize(arr[i], lo, hi);\n    for (int i = 0; i < n; i++) cout << arr[i] << (i < n-1 ? " " : "\\n");\n    return 0;\n}\n',
            testCases: [
              { input: '5\n1 5 10 15 20\n5 15', expectedOutput: '5 5 10 15 15', description: 'Нормализация [5,15]' },
              { input: '3\n-10 0 10\n0 5', expectedOutput: '0 0 5', description: 'Нормализация [0,5]' },
            ],
            points: 15,
          },
          {
            title: 'Сортировка по ссылке',
            description: 'Напишите функцию sortThree(int &a, int &b, int &c), которая сортирует три числа по возрастанию через ссылки. Считайте три числа, отсортируйте, выведите через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nvoid sortThree(int &a, int &b, int &c) {\n    // Отсортируйте a, b, c по возрастанию\n    // Используйте обмен по ссылке\n}\n\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    sortThree(a, b, c);\n    cout << a << " " << b << " " << c << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '3 1 2', expectedOutput: '1 2 3', description: '3,1,2 -> 1,2,3' },
              { input: '5 5 5', expectedOutput: '5 5 5', description: 'Все равны' },
              { input: '10 -5 0', expectedOutput: '-5 0 10', description: '10,-5,0 -> -5,0,10' },
              { input: '1 2 3', expectedOutput: '1 2 3', description: 'Уже отсортированы' },
            ],
            points: 15,
          },
          {
            title: 'Статистика массива по ссылке',
            description: 'Напишите функцию stats(const int arr[], int n, int &sum, double &avg, int &minVal, int &maxVal), которая вычисляет сумму, среднее, минимум и максимум. Считайте N чисел и выведите все 4 значения (среднее с 2 знаками).',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nvoid stats(const int arr[], int n, int &sum, double &avg, int &minVal, int &maxVal) {\n    // Вычислите сумму, среднее, минимум, максимум\n    // Запишите результаты через ссылки\n}\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[100];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int sum, minVal, maxVal;\n    double avg;\n    stats(arr, n, sum, avg, minVal, maxVal);\n    cout << sum << endl;\n    cout << fixed << setprecision(2) << avg << endl;\n    cout << minVal << endl;\n    cout << maxVal << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n10 20 30 40 50', expectedOutput: '150\n30.00\n10\n50', description: '5 чисел' },
              { input: '3\n-5 0 5', expectedOutput: '0\n0.00\n-5\n5', description: 'С отрицательными' },
              { input: '4\n7 3 8 2', expectedOutput: '20\n5.00\n2\n8', description: '4 числа' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Структура Point',
            description: 'Создайте структуру Point (x, y). Считайте две точки и выведите расстояние между ними с 2 знаками после запятой.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <cmath>\n#include <iomanip>\nusing namespace std;\n\nstruct Point {\n    double x, y;\n};\n\nint main() {\n    Point p1, p2;\n    cin >> p1.x >> p1.y >> p2.x >> p2.y;\n    // Вычислите расстояние: sqrt((x2-x1)^2 + (y2-y1)^2)\n    cout << fixed << setprecision(2);\n    return 0;\n}\n',
            testCases: [
              { input: '0 0 3 4', expectedOutput: '5.00', description: 'Расстояние (0,0)-(3,4)=5' },
              { input: '1 1 4 5', expectedOutput: '5.00', description: 'Расстояние (1,1)-(4,5)=5' },
              { input: '0 0 0 0', expectedOutput: '0.00', description: 'Одинаковые точки' },
            ],
            points: 10,
          },
          {
            title: 'Структура Student',
            description: 'Создайте структуру Student (name, grade). Считайте данные одного ученика и выведите: "<name>: <grade>".',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    double grade;\n};\n\nint main() {\n    Student s;\n    cin >> s.name >> s.grade;\n    // Выведите: имя: оценка\n    return 0;\n}\n',
            testCases: [
              { input: 'Алексей 4.5', expectedOutput: 'Алексей: 4.5', description: 'Ученик Алексей' },
              { input: 'Мария 5', expectedOutput: 'Мария: 5', description: 'Ученик Мария' },
            ],
            points: 10,
          },
          {
            title: 'Массив структур',
            description: 'Считайте N учеников (имя и оценка). Выведите имя ученика с наивысшей оценкой.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nstruct Student {\n    string name;\n    double grade;\n};\n\nint main() {\n    int n;\n    cin >> n;\n    Student students[100];\n    for (int i = 0; i < n; i++) {\n        cin >> students[i].name >> students[i].grade;\n    }\n    // Найдите ученика с максимальной оценкой\n    return 0;\n}\n',
            testCases: [
              { input: '3\nАлексей 4.5\nМария 4.8\nПетр 4.2', expectedOutput: 'Мария', description: 'Мария лучшая' },
              { input: '2\nИван 3.0\nОльга 5.0', expectedOutput: 'Ольга', description: 'Ольга лучшая' },
            ],
            points: 15,
          },
          {
            title: 'Структура Rectangle',
            description: 'Создайте структуру Rectangle (width, height) и функцию area(Rectangle r). Считайте N прямоугольников, выведите площадь каждого.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nstruct Rectangle {\n    int width, height;\n};\n\nint area(Rectangle r) {\n    // Верните площадь\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        Rectangle r;\n        cin >> r.width >> r.height;\n        cout << area(r) << endl;\n    }\n    return 0;\n}\n',
            testCases: [
              { input: '3\n5 3\n10 2\n4 4', expectedOutput: '15\n20\n16', description: 'Три прямоугольника' },
              { input: '2\n1 1\n100 200', expectedOutput: '1\n20000', description: 'Два прямоугольника' },
            ],
            points: 15,
          },
          {
            title: 'Дроби как структуры',
            description: 'Создайте структуру Fraction (numerator, denominator). Реализуйте функции add и multiply для дробей. Считайте две дроби, выведите их сумму и произведение в формате "числитель/знаменатель" (без сокращения).',
            difficulty: 'hard',
            starterCode: '#include <iostream>\nusing namespace std;\n\nstruct Fraction {\n    int num, den;\n};\n\nFraction add(Fraction a, Fraction b) {\n    // a/b + c/d = (a*d + c*b) / (b*d)\n    return {0, 1};\n}\n\nFraction multiply(Fraction a, Fraction b) {\n    // a/b * c/d = (a*c) / (b*d)\n    return {0, 1};\n}\n\nint main() {\n    Fraction a, b;\n    cin >> a.num >> a.den >> b.num >> b.den;\n    Fraction sum = add(a, b);\n    Fraction prod = multiply(a, b);\n    cout << sum.num << "/" << sum.den << endl;\n    cout << prod.num << "/" << prod.den << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '1 2 1 3', expectedOutput: '5/6\n1/6', description: '1/2+1/3=5/6, 1/2*1/3=1/6' },
              { input: '2 3 3 4', expectedOutput: '17/12\n6/12', description: '2/3+3/4=17/12, 2/3*3/4=6/12' },
              { input: '1 1 1 1', expectedOutput: '2/1\n1/1', description: '1+1=2, 1*1=1' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Работа с вектором',
            description: 'Считайте N чисел в вектор, отсортируйте и выведите через пробел.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте числа в vector, отсортируйте, выведите через пробел\n    return 0;\n}\n',
            testCases: [
              { input: '5\n3 1 4 1 5', expectedOutput: '1 1 3 4 5', description: 'Сортировка 5 чисел' },
              { input: '3\n10 5 8', expectedOutput: '5 8 10', description: 'Сортировка 3 чисел' },
              { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
            ],
            points: 10,
          },
          {
            title: 'Удаление элемента из вектора',
            description: 'Считайте N чисел и число X. Удалите все вхождения X из вектора и выведите оставшиеся через пробел.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    int x;\n    cin >> x;\n    // Удалите все вхождения x из вектора\n    // Выведите оставшиеся через пробел\n    return 0;\n}\n',
            testCases: [
              { input: '6\n1 2 3 2 4 2\n2', expectedOutput: '1 3 4', description: 'Удалить 2' },
              { input: '4\n5 5 5 5\n5', expectedOutput: '', description: 'Удалить все' },
              { input: '3\n1 2 3\n4', expectedOutput: '1 2 3', description: 'Нечего удалять' },
            ],
            points: 10,
          },
          {
            title: 'Объединение векторов',
            description: 'Считайте два вектора (сначала N1 и числа, потом N2 и числа). Объедините их в один, отсортируйте и выведите через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n1;\n    cin >> n1;\n    vector<int> v1(n1);\n    for (int i = 0; i < n1; i++) cin >> v1[i];\n    int n2;\n    cin >> n2;\n    vector<int> v2(n2);\n    for (int i = 0; i < n2; i++) cin >> v2[i];\n    // Объедините v1 и v2, отсортируйте, выведите\n    return 0;\n}\n',
            testCases: [
              { input: '3\n5 3 1\n3\n4 2 6', expectedOutput: '1 2 3 4 5 6', description: 'Объединение и сортировка' },
              { input: '2\n10 20\n2\n5 15', expectedOutput: '5 10 15 20', description: '4 числа' },
            ],
            points: 15,
          },
          {
            title: 'Уникальные элементы вектора',
            description: 'Считайте N чисел. Выведите только уникальные элементы в отсортированном порядке через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    // Отсортируйте и удалите дубликаты\n    // Подсказка: sort + unique + erase\n    return 0;\n}\n',
            testCases: [
              { input: '7\n3 1 4 1 5 9 2', expectedOutput: '1 2 3 4 5 9', description: 'Уникальные отсортированные' },
              { input: '5\n5 5 5 5 5', expectedOutput: '5', description: 'Один уникальный' },
              { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Все уникальные' },
            ],
            points: 15,
          },
          {
            title: 'Матрица на векторах',
            description: 'Считайте размеры матрицы N и M, затем N*M чисел. Выведите сумму каждой строки и сумму каждого столбца. Используйте vector<vector<int>>.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> matrix(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++)\n            cin >> matrix[i][j];\n    // Выведите сумму каждой строки (через пробел в одну строку)\n    // Затем сумму каждого столбца (через пробел в одну строку)\n    return 0;\n}\n',
            testCases: [
              { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '6 15\n5 7 9', description: '2x3 матрица' },
              { input: '3 2\n1 2\n3 4\n5 6', expectedOutput: '3 7 11\n9 12', description: '3x2 матрица' },
              { input: '1 1\n42', expectedOutput: '42\n42', description: '1x1 матрица' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Бинарный поиск',
            description: 'Считайте отсортированный массив и число для поиска. Реализуйте бинарный поиск. Выведите индекс или -1.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int> &arr, int target) {\n    // Реализуйте бинарный поиск\n    return -1;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target;\n    cin >> target;\n    cout << binarySearch(arr, target) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: 'Найден на позиции 2' },
              { input: '5\n1 3 5 7 9\n4', expectedOutput: '-1', description: 'Не найден' },
              { input: '1\n42\n42', expectedOutput: '0', description: 'Один элемент — найден' },
            ],
            points: 10,
          },
          {
            title: 'Пузырьковая сортировка',
            description: 'Реализуйте пузырьковую сортировку. Считайте N чисел, отсортируйте и выведите через пробел.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid bubbleSort(vector<int> &arr) {\n    int n = arr.size();\n    // Реализуйте пузырьковую сортировку\n    // Два вложенных цикла, обмен соседних элементов\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    bubbleSort(arr);\n    for (int i = 0; i < n; i++) cout << arr[i] << (i < n-1 ? " " : "\\n");\n    return 0;\n}\n',
            testCases: [
              { input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'Сортировка 5 чисел' },
              { input: '3\n3 2 1', expectedOutput: '1 2 3', description: 'Обратный порядок' },
              { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Уже отсортировано' },
            ],
            points: 10,
          },
          {
            title: 'Сортировка выбором',
            description: 'Реализуйте сортировку выбором. Считайте N чисел, отсортируйте по возрастанию и выведите через пробел.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid selectionSort(vector<int> &arr) {\n    int n = arr.size();\n    // На каждом шаге находите минимум в оставшейся части\n    // и ставьте его на правильную позицию\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    selectionSort(arr);\n    for (int i = 0; i < n; i++) cout << arr[i] << (i < n-1 ? " " : "\\n");\n    return 0;\n}\n',
            testCases: [
              { input: '6\n64 25 12 22 11 1', expectedOutput: '1 11 12 22 25 64', description: '6 чисел' },
              { input: '4\n4 3 2 1', expectedOutput: '1 2 3 4', description: 'Обратный порядок' },
              { input: '3\n-5 10 -3', expectedOutput: '-5 -3 10', description: 'С отрицательными' },
            ],
            points: 15,
          },
          {
            title: 'Подсчёт операций сравнения',
            description: 'Реализуйте пузырьковую сортировку и подсчитайте количество сравнений. Считайте N чисел, выведите отсортированный массив и количество сравнений на отдельных строках.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint bubbleSortCount(vector<int> &arr) {\n    int n = arr.size();\n    int comparisons = 0;\n    // Реализуйте пузырьковую сортировку\n    // Считайте каждое сравнение (comparisons++)\n    return comparisons;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int comps = bubbleSortCount(arr);\n    for (int i = 0; i < n; i++) cout << arr[i] << (i < n-1 ? " " : "\\n");\n    cout << comps << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '4\n4 3 2 1', expectedOutput: '1 2 3 4\n6', description: '4 элемента, 6 сравнений' },
              { input: '3\n1 2 3', expectedOutput: '1 2 3\n3', description: '3 элемента, 3 сравнения' },
              { input: '5\n5 4 3 2 1', expectedOutput: '1 2 3 4 5\n10', description: '5 элементов, 10 сравнений' },
            ],
            points: 15,
          },
          {
            title: 'Два бинарных поиска',
            description: 'Считайте отсортированный массив из N чисел. Затем считайте число X. Найдите первое и последнее вхождение X в массиве. Выведите два индекса через пробел, или "-1 -1" если X не найден.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint findFirst(vector<int> &arr, int target) {\n    // Бинарный поиск первого вхождения\n    int left = 0, right = arr.size() - 1, result = -1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) { result = mid; right = mid - 1; }\n        else if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return result;\n}\n\nint findLast(vector<int> &arr, int target) {\n    // Бинарный поиск последнего вхождения\n    return -1;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int x;\n    cin >> x;\n    cout << findFirst(arr, x) << " " << findLast(arr, x) << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '7\n1 2 2 2 3 4 5\n2', expectedOutput: '1 3', description: 'Первый=1, последний=3' },
              { input: '5\n1 3 5 7 9\n4', expectedOutput: '-1 -1', description: 'Не найден' },
              { input: '5\n1 1 1 1 1\n1', expectedOutput: '0 4', description: 'Все одинаковые' },
              { input: '6\n1 2 3 4 5 5\n5', expectedOutput: '4 5', description: 'Два 5 в конце' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Класс Rectangle',
            description: 'Создайте класс Rectangle с приватными полями width, height, публичными методами area() и perimeter(). Считайте данные и выведите площадь и периметр.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nclass Rectangle {\n    // Приватные поля: width, height\n    // Публичный конструктор\n    // Методы area() и perimeter()\n};\n\nint main() {\n    int w, h;\n    cin >> w >> h;\n    Rectangle r(w, h);\n    cout << r.area() << endl;\n    cout << r.perimeter() << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5 3', expectedOutput: '15\n16', description: '5x3: area=15, perimeter=16' },
              { input: '10 10', expectedOutput: '100\n40', description: '10x10: area=100, perimeter=40' },
              { input: '1 7', expectedOutput: '7\n16', description: '1x7: area=7, perimeter=16' },
            ],
            points: 10,
          },
          {
            title: 'Класс Counter',
            description: 'Создайте класс Counter с приватным полем count (начальное значение 0). Методы: increment(), decrement(), getCount(). Считайте N операций (+ или -), выведите итоговое значение.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\nusing namespace std;\n\nclass Counter {\nprivate:\n    int count;\npublic:\n    Counter() : count(0) {}\n    void increment() { /* +1 */ }\n    void decrement() { /* -1, минимум 0 */ }\n    int getCount() { return count; }\n};\n\nint main() {\n    Counter c;\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        char op;\n        cin >> op;\n        if (op == \'+\') c.increment();\n        else c.decrement();\n    }\n    cout << c.getCount() << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5\n+ + + - +', expectedOutput: '3', description: '3 плюса, 1 минус' },
              { input: '3\n- - -', expectedOutput: '0', description: 'Минимум 0' },
              { input: '4\n+ + + +', expectedOutput: '4', description: 'Только плюсы' },
            ],
            points: 10,
          },
          {
            title: 'Класс BankAccount',
            description: 'Создайте класс BankAccount с приватным полем balance. Методы: deposit(amount), withdraw(amount) — возвращает true если хватает средств, getBalance(). Считайте N операций (D сумма / W сумма), выведите баланс.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nclass BankAccount {\nprivate:\n    double balance;\npublic:\n    BankAccount() : balance(0) {}\n    void deposit(double amount) {\n        // Пополнение\n    }\n    bool withdraw(double amount) {\n        // Снятие (если хватает средств)\n        return false;\n    }\n    double getBalance() { return balance; }\n};\n\nint main() {\n    BankAccount acc;\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        char op;\n        double amount;\n        cin >> op >> amount;\n        if (op == \'D\') acc.deposit(amount);\n        else acc.withdraw(amount);\n    }\n    cout << fixed << setprecision(2) << acc.getBalance() << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '3\nD 1000\nW 500\nD 200', expectedOutput: '700.00', description: '1000-500+200=700' },
              { input: '3\nD 100\nW 200\nD 50', expectedOutput: '150.00', description: 'Снятие отклонено, 100+50' },
              { input: '2\nD 500\nW 500', expectedOutput: '0.00', description: 'Снять всё' },
            ],
            points: 15,
          },
          {
            title: 'Класс Stack',
            description: 'Реализуйте класс Stack (стек) на массиве: push(val), pop() — возвращает верхний элемент и удаляет, top() — возвращает верхний без удаления, isEmpty(). Считайте N команд, выполните их.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Stack {\nprivate:\n    int data[100];\n    int sz;\npublic:\n    Stack() : sz(0) {}\n    void push(int val) { /* Добавить элемент */ }\n    int pop() { /* Удалить и вернуть верхний */ return 0; }\n    int top() { /* Вернуть верхний без удаления */ return 0; }\n    bool isEmpty() { return sz == 0; }\n};\n\nint main() {\n    Stack s;\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "push") {\n            int v; cin >> v;\n            s.push(v);\n        } else if (cmd == "pop") {\n            cout << s.pop() << endl;\n        } else if (cmd == "top") {\n            cout << s.top() << endl;\n        }\n    }\n    return 0;\n}\n',
            testCases: [
              { input: '5\npush 10\npush 20\ntop\npop\npop', expectedOutput: '20\n20\n10', description: 'Базовые операции стека' },
              { input: '4\npush 1\npush 2\npush 3\npop', expectedOutput: '3', description: 'Pop возвращает последний' },
              { input: '3\npush 42\ntop\ntop', expectedOutput: '42\n42', description: 'Top не удаляет' },
            ],
            points: 15,
          },
          {
            title: 'Класс String (упрощённый)',
            description: 'Создайте класс MyString с приватным полем string data. Реализуйте: length(), charAt(index), concat(other), toUpper(). Считайте строку и операции, выведите результаты.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nclass MyString {\nprivate:\n    string data;\npublic:\n    MyString(string s) : data(s) {}\n    int length() { return data.length(); }\n    char charAt(int index) {\n        // Верните символ по индексу\n        return \'\\0\';\n    }\n    MyString concat(MyString other) {\n        // Верните новую строку — конкатенацию\n        return MyString("");\n    }\n    string toUpper() {\n        // Верните строку в верхнем регистре\n        return "";\n    }\n    string getData() { return data; }\n};\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n    MyString ms1(s1), ms2(s2);\n    cout << ms1.length() << endl;\n    cout << ms1.charAt(0) << endl;\n    MyString combined = ms1.concat(ms2);\n    cout << combined.getData() << endl;\n    cout << ms1.toUpper() << endl;\n    return 0;\n}\n',
            testCases: [
              { input: 'hello world', expectedOutput: '5\nh\nhelloworld\nHELLO', description: 'hello + world' },
              { input: 'abc xyz', expectedOutput: '3\na\nabcxyz\nABC', description: 'abc + xyz' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Иерархия фигур',
            description: 'Создайте базовый класс Shape с виртуальным area(). Реализуйте Circle и Rectangle. Считайте данные и выведите площади.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() = 0;\n    virtual ~Shape() {}\n};\n\n// Реализуйте Circle (radius) и Rectangle (width, height)\n\nint main() {\n    double w, h;\n    cin >> w >> h;\n    double r;\n    cin >> r;\n    Rectangle rect(w, h);\n    Circle circ(r);\n    cout << fixed;\n    cout.precision(2);\n    cout << rect.area() << endl;\n    cout << circ.area() << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '5 3\n4', expectedOutput: '15.00\n50.27', description: 'Прямоугольник 5x3 и круг r=4' },
              { input: '10 2\n1', expectedOutput: '20.00\n3.14', description: 'Прямоугольник 10x2 и круг r=1' },
            ],
            points: 10,
          },
          {
            title: 'Наследование Animal',
            description: 'Создайте базовый класс Animal с виртуальным методом speak(). Унаследуйте Dog ("Гав!") и Cat ("Мяу!"). Считайте тип (dog/cat) и имя, выведите "<имя> говорит: <звук>".',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Animal {\nprotected:\n    string name;\npublic:\n    Animal(string n) : name(n) {}\n    virtual string speak() = 0;\n    virtual ~Animal() {}\n    string getName() { return name; }\n};\n\n// Реализуйте Dog и Cat\n\nint main() {\n    string type, name;\n    cin >> type >> name;\n    Animal *animal = nullptr;\n    if (type == "dog") animal = new Dog(name);\n    else animal = new Cat(name);\n    cout << animal->getName() << " говорит: " << animal->speak() << endl;\n    delete animal;\n    return 0;\n}\n',
            testCases: [
              { input: 'dog Бобик', expectedOutput: 'Бобик говорит: Гав!', description: 'Собака' },
              { input: 'cat Мурка', expectedOutput: 'Мурка говорит: Мяу!', description: 'Кот' },
            ],
            points: 10,
          },
          {
            title: 'Полиморфизм через массив',
            description: 'Создайте массив указателей на Shape. Считайте N фигур (тип: circle r / rect w h). Выведите площадь каждой (с 2 знаками) и общую площадь.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <cmath>\n#include <vector>\nusing namespace std;\n\nclass Shape {\npublic:\n    virtual double area() = 0;\n    virtual ~Shape() {}\n};\n\nclass Circle : public Shape {\n    double radius;\npublic:\n    Circle(double r) : radius(r) {}\n    double area() override { return 3.14159 * radius * radius; }\n};\n\nclass Rect : public Shape {\n    double w, h;\npublic:\n    Rect(double w, double h) : w(w), h(h) {}\n    double area() override { return w * h; }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    vector<Shape*> shapes;\n    for (int i = 0; i < n; i++) {\n        string type;\n        cin >> type;\n        if (type == "circle") {\n            double r; cin >> r;\n            shapes.push_back(new Circle(r));\n        } else {\n            double w, h; cin >> w >> h;\n            shapes.push_back(new Rect(w, h));\n        }\n    }\n    cout << fixed;\n    cout.precision(2);\n    double total = 0;\n    for (auto s : shapes) {\n        cout << s->area() << endl;\n        total += s->area();\n    }\n    cout << total << endl;\n    for (auto s : shapes) delete s;\n    return 0;\n}\n',
            testCases: [
              { input: '3\ncircle 5\nrect 4 6\ncircle 3', expectedOutput: '78.54\n24.00\n28.27\n130.81', description: '3 фигуры' },
              { input: '2\nrect 2 3\nrect 4 5', expectedOutput: '6.00\n20.00\n26.00', description: '2 прямоугольника' },
            ],
            points: 15,
          },
          {
            title: 'Класс с перегрузкой оператора',
            description: 'Создайте класс Vector2D (x, y). Перегрузите оператор + для сложения двух векторов. Считайте два вектора и выведите их сумму в формате "(x, y)".',
            difficulty: 'medium',
            starterCode: '#include <iostream>\nusing namespace std;\n\nclass Vector2D {\nprivate:\n    double x, y;\npublic:\n    Vector2D(double x = 0, double y = 0) : x(x), y(y) {}\n    Vector2D operator+(const Vector2D &other) {\n        // Верните новый вектор — сумму\n        return Vector2D(0, 0);\n    }\n    void print() {\n        cout << "(" << x << ", " << y << ")" << endl;\n    }\n};\n\nint main() {\n    double x1, y1, x2, y2;\n    cin >> x1 >> y1 >> x2 >> y2;\n    Vector2D v1(x1, y1), v2(x2, y2);\n    Vector2D sum = v1 + v2;\n    sum.print();\n    return 0;\n}\n',
            testCases: [
              { input: '1 2 3 4', expectedOutput: '(4, 6)', description: '(1,2)+(3,4)=(4,6)' },
              { input: '0 0 5 5', expectedOutput: '(5, 5)', description: '(0,0)+(5,5)=(5,5)' },
              { input: '-1 3 1 -3', expectedOutput: '(0, 0)', description: '(-1,3)+(1,-3)=(0,0)' },
            ],
            points: 15,
          },
          {
            title: 'Система персонажей RPG',
            description: 'Создайте базовый класс Character (name, hp, attack). Наследники: Warrior (бонус +5 к атаке), Mage (бонус +3 к атаке, двойной урон). Метод attackTarget(Character &target) наносит урон. Считайте двух персонажей, проведите бой и выведите оставшиеся HP.',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Character {\nprotected:\n    string name;\n    int hp;\n    int atk;\npublic:\n    Character(string n, int h, int a) : name(n), hp(h), atk(a) {}\n    virtual int getDamage() { return atk; }\n    void takeDamage(int dmg) { hp -= dmg; if (hp < 0) hp = 0; }\n    int getHp() { return hp; }\n    string getName() { return name; }\n    virtual ~Character() {}\n};\n\nclass Warrior : public Character {\npublic:\n    Warrior(string n, int h, int a) : Character(n, h, a + 5) {}\n};\n\nclass Mage : public Character {\npublic:\n    Mage(string n, int h, int a) : Character(n, h, a + 3) {}\n    int getDamage() override { return atk * 2; }\n};\n\nint main() {\n    string type1, name1;\n    int hp1, atk1;\n    cin >> type1 >> name1 >> hp1 >> atk1;\n    string type2, name2;\n    int hp2, atk2;\n    cin >> type2 >> name2 >> hp2 >> atk2;\n\n    Character *c1, *c2;\n    if (type1 == "warrior") c1 = new Warrior(name1, hp1, atk1);\n    else c1 = new Mage(name1, hp1, atk1);\n    if (type2 == "warrior") c2 = new Warrior(name2, hp2, atk2);\n    else c2 = new Mage(name2, hp2, atk2);\n\n    // Каждый атакует другого один раз\n    c2->takeDamage(c1->getDamage());\n    c1->takeDamage(c2->getDamage());\n\n    cout << c1->getName() << ": " << c1->getHp() << endl;\n    cout << c2->getName() << ": " << c2->getHp() << endl;\n    delete c1; delete c2;\n    return 0;\n}\n',
            testCases: [
              { input: 'warrior Рыцарь 100 10\nmage Маг 80 8', expectedOutput: 'Рыцарь: 78\nМаг: 65', description: 'Рыцарь(100hp,15atk) vs Маг(80hp,22dmg)' },
              { input: 'mage Колдун 50 12\nwarrior Боец 120 20', expectedOutput: 'Колдун: 25\nБоец: 90', description: 'Маг vs Воин' },
            ],
            points: 25,
          },
        ],
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
        assignments: [
          {
            title: 'Журнал оценок',
            description: 'Считайте учеников и их оценки, выведите средние и лучшего ученика.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nstruct Student {\n    string name;\n    vector<int> grades;\n\n    double average() {\n        // Вычислите среднее оценок\n        return 0;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    vector<Student> students(n);\n    for (int i = 0; i < n; i++) {\n        cin >> students[i].name;\n        int m;\n        cin >> m;\n        students[i].grades.resize(m);\n        for (int j = 0; j < m; j++) {\n            cin >> students[i].grades[j];\n        }\n    }\n    // Выведите средние и лучшего ученика\n    return 0;\n}\n',
            testCases: [
              { input: '2\nАлексей\n4\n5 4 5 3\nМария\n4\n5 5 4 5', expectedOutput: 'Алексей: 4.25\nМария: 4.75\nЛучший: Мария', description: '2 ученика' },
              { input: '3\nИван\n3\n5 5 5\nОльга\n3\n4 4 4\nПетр\n3\n3 3 3', expectedOutput: 'Иван: 5.00\nОльга: 4.00\nПетр: 3.00\nЛучший: Иван', description: '3 ученика' },
            ],
            points: 10,
          },
          {
            title: 'Сортировка учеников',
            description: 'Считайте N учеников (имя и среднюю оценку). Отсортируйте по убыванию средней оценки и выведите список.',
            difficulty: 'easy',
            starterCode: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nstruct Student {\n    string name;\n    double grade;\n};\n\nint main() {\n    int n;\n    cin >> n;\n    vector<Student> students(n);\n    for (int i = 0; i < n; i++) {\n        cin >> students[i].name >> students[i].grade;\n    }\n    // Отсортируйте по убыванию grade\n    // Выведите: имя: оценка (с 2 знаками)\n    cout << fixed << setprecision(2);\n    return 0;\n}\n',
            testCases: [
              { input: '3\nИван 4.5\nМария 4.8\nПетр 4.2', expectedOutput: 'Мария: 4.80\nИван: 4.50\nПетр: 4.20', description: '3 ученика' },
              { input: '2\nА 5.0\nБ 3.0', expectedOutput: 'А: 5.00\nБ: 3.00', description: '2 ученика' },
            ],
            points: 10,
          },
          {
            title: 'Адресная книга',
            description: 'Реализуйте адресную книгу. Команды: ADD имя телефон, FIND имя, LIST. ADD добавляет контакт, FIND выводит телефон или "Не найден", LIST выводит все контакты отсортированные по имени.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nstruct Contact {\n    string name;\n    string phone;\n};\n\nint main() {\n    vector<Contact> contacts;\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        string cmd;\n        cin >> cmd;\n        if (cmd == "ADD") {\n            Contact c;\n            cin >> c.name >> c.phone;\n            contacts.push_back(c);\n        } else if (cmd == "FIND") {\n            string name;\n            cin >> name;\n            // Найдите и выведите телефон, или "Не найден"\n        } else {\n            // LIST — отсортируйте и выведите все контакты\n        }\n    }\n    return 0;\n}\n',
            testCases: [
              { input: '5\nADD Алексей 123\nADD Мария 456\nFIND Алексей\nFIND Иван\nLIST', expectedOutput: '123\nНе найден\nАлексей: 123\nМария: 456', description: 'Добавление и поиск' },
              { input: '4\nADD Петр 789\nADD Анна 111\nADD Иван 222\nLIST', expectedOutput: 'Анна: 111\nИван: 222\nПетр: 789', description: 'Сортировка по имени' },
            ],
            points: 15,
          },
          {
            title: 'Калькулятор с историей',
            description: 'Реализуйте калькулятор с классом Calculator. Поддержите операции: число, +, -, *, =. Операция "=" выводит текущий результат. В конце выведите историю операций.',
            difficulty: 'medium',
            starterCode: '#include <iostream>\n#include <vector>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nclass Calculator {\nprivate:\n    double result;\n    vector<string> history;\npublic:\n    Calculator() : result(0) {}\n    void setInitial(double val) {\n        result = val;\n        history.push_back(to_string((int)val));\n    }\n    void add(double val) { result += val; history.push_back("+ " + to_string((int)val)); }\n    void sub(double val) { result -= val; history.push_back("- " + to_string((int)val)); }\n    void mul(double val) { result *= val; history.push_back("* " + to_string((int)val)); }\n    double getResult() { return result; }\n    void printHistory() {\n        for (auto &h : history) cout << h << " ";\n        cout << "= " << (int)result << endl;\n    }\n};\n\nint main() {\n    Calculator calc;\n    int n;\n    cin >> n;\n    double first;\n    cin >> first;\n    calc.setInitial(first);\n    for (int i = 1; i < n; i++) {\n        char op;\n        double val;\n        cin >> op >> val;\n        if (op == \'+\') calc.add(val);\n        else if (op == \'-\') calc.sub(val);\n        else if (op == \'*\') calc.mul(val);\n    }\n    cout << (int)calc.getResult() << endl;\n    calc.printHistory();\n    return 0;\n}\n',
            testCases: [
              { input: '4\n10 + 5 - 3 * 2', expectedOutput: '24\n10 + 5 - 3 * 2 = 24', description: '10+5-3=12*2=24' },
              { input: '3\n100 - 50 + 25', expectedOutput: '75\n100 - 50 + 25 = 75', description: '100-50+25=75' },
            ],
            points: 15,
          },
          {
            title: 'Мини-система тестирования',
            description: 'Создайте систему тестирования. Класс Question (вопрос, варианты, правильный ответ). Считайте N вопросов, затем N ответов пользователя. Выведите результат: для каждого вопроса "Верно"/"Неверно", затем итог "Результат: X/N".',
            difficulty: 'hard',
            starterCode: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nclass Question {\nprivate:\n    string text;\n    vector<string> options;\n    int correctAnswer; // 1-based\npublic:\n    Question() : correctAnswer(0) {}\n    void setQuestion(string t, vector<string> opts, int correct) {\n        text = t;\n        options = opts;\n        correctAnswer = correct;\n    }\n    bool check(int answer) { return answer == correctAnswer; }\n    string getText() { return text; }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    vector<Question> questions(n);\n    for (int i = 0; i < n; i++) {\n        string text;\n        getline(cin, text);\n        int numOpts;\n        cin >> numOpts;\n        cin.ignore();\n        vector<string> opts(numOpts);\n        for (int j = 0; j < numOpts; j++) getline(cin, opts[j]);\n        int correct;\n        cin >> correct;\n        cin.ignore();\n        questions[i].setQuestion(text, opts, correct);\n    }\n    int score = 0;\n    for (int i = 0; i < n; i++) {\n        int answer;\n        cin >> answer;\n        if (questions[i].check(answer)) {\n            cout << "Верно" << endl;\n            score++;\n        } else {\n            cout << "Неверно" << endl;\n        }\n    }\n    cout << "Результат: " << score << "/" << n << endl;\n    return 0;\n}\n',
            testCases: [
              { input: '2\nСтолица России?\n3\nМосква\nПетербург\nКазань\n1\nСколько будет 2+2?\n3\n3\n4\n5\n2\n1\n2', expectedOutput: 'Верно\nВерно\nРезультат: 2/2', description: 'Всё верно' },
              { input: '2\nСтолица России?\n3\nМосква\nПетербург\nКазань\n1\nСколько будет 2+2?\n3\n3\n4\n5\n2\n2\n3', expectedOutput: 'Неверно\nНеверно\nРезультат: 0/2', description: 'Всё неверно' },
            ],
            points: 25,
          },
        ],
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
          ON CONFLICT (lesson_id, order_index) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            difficulty = EXCLUDED.difficulty,
            starter_code = EXCLUDED.starter_code,
            test_cases = EXCLUDED.test_cases,
            points = EXCLUDED.points,
            ege_task_number = EXCLUDED.ege_task_number`,
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
