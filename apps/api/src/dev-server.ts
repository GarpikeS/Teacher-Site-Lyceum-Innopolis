/**
 * Development API Server - works without PostgreSQL/Redis
 * Uses in-memory storage with pre-seeded course content
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { python10Lessons } from './database/seed-grade10-python';
import { cpp10Lessons } from './database/seed-grade10-cpp';
import { python11Lessons } from './database/seed-grade11-python';
import { cpp11Lessons } from './database/seed-grade11-cpp';
import { infosec78Lessons } from './database/seed-infosec78';
import { infosec910Lessons } from './database/seed-infosec910';
import { infosec11Lessons } from './database/seed-infosec11';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = parseInt(process.env.API_PORT || '5001', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5000';

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// ============================================
// IN-MEMORY DATABASE
// ============================================
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  createdAt: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: 'python' | 'cpp';
  level: string;
  isPublished: boolean;
  orderIndex: number;
  estimatedHours: number;
  createdAt: string;
}

interface Lesson {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  orderIndex: number;
  durationMinutes: number;
  isPublished: boolean;
  prerequisites: string[];
  createdAt: string;
}

interface Assignment {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  assignmentType: string;
  difficulty: string;
  starterCode: string;
  testCases: Array<{ id: number; input: string; expectedOutput: string; description: string; isHidden: boolean; points: number }>;
  validationType: string;
  maxAttempts: number;
  points: number;
  orderIndex: number;
  isPublished: boolean;
}

interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  code: string;
  language: string;
  status: string;
  testResults: any;
  score: number;
  maxScore: number;
  teacherFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  attemptNumber: number;
  createdAt: string;
}

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progressPercentage: number;
}

interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
}

interface ClassRoom {
  id: string;
  teacherId: string;
  name: string;
  description: string;
  createdAt: string;
}

interface ClassStudent {
  classId: string;
  studentId: string;
  joinedAt: string;
}

const db = {
  users: [] as User[],
  courses: [] as Course[],
  lessons: [] as Lesson[],
  assignments: [] as Assignment[],
  submissions: [] as Submission[],
  enrollments: [] as Enrollment[],
  progress: [] as UserProgress[],
  refreshTokens: new Map<string, string>(),
  classes: [] as ClassRoom[],
  classStudents: [] as ClassStudent[],
};

let idCounter = 100;
function genId(): string {
  return `id-${++idCounter}-${Date.now().toString(36)}`;
}

// ============================================
// SEED DATA
// ============================================
function seedData() {
  // Admin user
  const adminHash = bcrypt.hashSync('password123', 10);
  db.users.push({
    id: 'user-admin',
    email: 'admin@school.com',
    passwordHash: adminHash,
    firstName: 'Администратор',
    lastName: 'Системы',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // Teacher user
  const teacherHash = bcrypt.hashSync('password123', 10);
  db.users.push({
    id: 'user-teacher',
    email: 'teacher@school.com',
    passwordHash: teacherHash,
    firstName: 'Иван',
    lastName: 'Петров',
    role: 'teacher',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // Student user
  const studentHash = bcrypt.hashSync('password123', 10);
  db.users.push({
    id: 'user-student',
    email: 'student1@school.com',
    passwordHash: studentHash,
    firstName: 'Алексей',
    lastName: 'Сидоров',
    role: 'student',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // Second student
  const student2Hash = bcrypt.hashSync('password123', 10);
  db.users.push({
    id: 'user-student2',
    email: 'student2@school.com',
    passwordHash: student2Hash,
    firstName: 'Мария',
    lastName: 'Козлова',
    role: 'student',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // Third student
  const student3Hash = bcrypt.hashSync('password123', 10);
  db.users.push({
    id: 'user-student3',
    email: 'student3@school.com',
    passwordHash: student3Hash,
    firstName: 'Дмитрий',
    lastName: 'Волков',
    role: 'student',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  // ==========================================
  // PYTHON COURSE
  // ==========================================
  const pythonCourseId = 'course-python';
  db.courses.push({
    id: pythonCourseId,
    slug: 'python-advanced-7',
    title: 'Python: Углубленный курс',
    description: 'Изучение Python для 7 класса. Переменные, циклы, функции, списки, словари, работа с файлами и алгоритмы.',
    language: 'python',
    level: 'advanced',
    isPublished: true,
    orderIndex: 1,
    estimatedHours: 40,
    createdAt: new Date().toISOString(),
  });

  // Python Lessons
  const pythonLessons = [
    {
      id: 'lesson-py-1',
      slug: 'intro-python',
      title: 'Введение в Python',
      description: 'Знакомство с языком программирования Python',
      content: `<h2>Что такое Python?</h2>
<p>Python — один из самых популярных языков программирования в мире. Его используют в Google, NASA, YouTube и многих других компаниях.</p>

<h3>Почему Python?</h3>
<ul>
  <li><strong>Простой синтаксис</strong> — код читается как обычный текст</li>
  <li><strong>Мощные библиотеки</strong> — для веба, науки, игр, ИИ</li>
  <li><strong>Кроссплатформенность</strong> — работает на Windows, Mac, Linux</li>
</ul>

<h3>Ваша первая программа</h3>
<p>Напишите в редакторе справа:</p>
<pre><code>print("Привет, мир!")</code></pre>
<p>Функция <code>print()</code> выводит текст на экран. Текст внутри кавычек называется <strong>строкой</strong>.</p>

<h3>Комментарии</h3>
<p>Комментарии начинаются с символа <code>#</code> и не выполняются:</p>
<pre><code># Это комментарий
print("А это код")  # Комментарий в конце строки</code></pre>

<h3>Арифметика</h3>
<p>Python умеет считать:</p>
<pre><code>print(2 + 3)    # 5
print(10 - 4)   # 6
print(3 * 7)    # 21
print(15 / 4)   # 3.75
print(15 // 4)  # 3 (целочисленное деление)
print(2 ** 10)  # 1024 (возведение в степень)</code></pre>`,
      durationMinutes: 30,
      orderIndex: 1,
    },
    {
      id: 'lesson-py-2',
      slug: 'variables-types',
      title: 'Переменные и типы данных',
      description: 'Работа с переменными, числами, строками и логическими значениями',
      content: `<h2>Переменные</h2>
<p>Переменная — это именованная область памяти для хранения данных.</p>
<pre><code>name = "Алексей"
age = 13
height = 165.5
is_student = True</code></pre>

<h3>Типы данных</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr><th>Тип</th><th>Описание</th><th>Пример</th></tr>
  <tr><td><code>int</code></td><td>Целое число</td><td><code>42</code></td></tr>
  <tr><td><code>float</code></td><td>Дробное число</td><td><code>3.14</code></td></tr>
  <tr><td><code>str</code></td><td>Строка</td><td><code>"Привет"</code></td></tr>
  <tr><td><code>bool</code></td><td>Логическое</td><td><code>True / False</code></td></tr>
</table>

<h3>Ввод данных</h3>
<pre><code>name = input("Как тебя зовут? ")
print("Привет, " + name + "!")

# Ввод числа
age = int(input("Сколько тебе лет? "))
print("Через 5 лет тебе будет", age + 5)</code></pre>

<h3>Форматирование строк (f-строки)</h3>
<pre><code>name = "Мария"
age = 13
print(f"Меня зовут {name}, мне {age} лет")</code></pre>`,
      durationMinutes: 35,
      orderIndex: 2,
    },
    {
      id: 'lesson-py-3',
      slug: 'conditions',
      title: 'Условные операторы',
      description: 'if, elif, else — принятие решений в программе',
      content: `<h2>Условный оператор if</h2>
<p>Позволяет программе принимать решения в зависимости от условий.</p>

<pre><code>age = 13

if age >= 18:
    print("Вы совершеннолетний")
elif age >= 14:
    print("Вы подросток")
else:
    print("Вы ещё ребёнок")</code></pre>

<h3>Операторы сравнения</h3>
<ul>
  <li><code>==</code> — равно</li>
  <li><code>!=</code> — не равно</li>
  <li><code>&gt;</code>, <code>&lt;</code> — больше, меньше</li>
  <li><code>&gt;=</code>, <code>&lt;=</code> — больше или равно, меньше или равно</li>
</ul>

<h3>Логические операторы</h3>
<pre><code>age = 13
has_ticket = True

if age >= 12 and has_ticket:
    print("Добро пожаловать в кино!")

temperature = 35
if temperature > 30 or temperature < -10:
    print("Экстремальная температура!")

if not has_ticket:
    print("Купите билет")</code></pre>

<h3>Вложенные условия</h3>
<pre><code>score = 85

if score >= 90:
    grade = "5 (отлично)"
elif score >= 75:
    grade = "4 (хорошо)"
elif score >= 60:
    grade = "3 (удовлетворительно)"
else:
    grade = "2 (неудовлетворительно)"

print(f"Оценка: {grade}")</code></pre>`,
      durationMinutes: 40,
      orderIndex: 3,
    },
    {
      id: 'lesson-py-4',
      slug: 'loops',
      title: 'Циклы for и while',
      description: 'Повторение действий: циклы for, while, break, continue',
      content: `<h2>Цикл for</h2>
<p>Используется для перебора последовательностей.</p>
<pre><code># Перебор диапазона
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Перебор строки
for char in "Python":
    print(char)

# range с параметрами
for i in range(1, 11):
    print(f"{i} x 7 = {i * 7}")</code></pre>

<h2>Цикл while</h2>
<p>Выполняется, пока условие истинно.</p>
<pre><code>count = 1
while count <= 5:
    print(f"Шаг {count}")
    count += 1</code></pre>

<h3>break и continue</h3>
<pre><code># break — выход из цикла
for i in range(100):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue — пропуск итерации
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9</code></pre>

<h3>Вложенные циклы</h3>
<pre><code># Таблица умножения
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} x {j} = {i*j}", end="  ")
    print()  # Новая строка</code></pre>`,
      durationMinutes: 45,
      orderIndex: 4,
    },
    {
      id: 'lesson-py-5',
      slug: 'functions',
      title: 'Функции',
      description: 'Создание и использование функций, аргументы, возвращаемые значения',
      content: `<h2>Зачем нужны функции?</h2>
<p>Функции позволяют разбить программу на небольшие блоки, которые можно использовать повторно.</p>

<h3>Создание функции</h3>
<pre><code>def greet(name):
    print(f"Привет, {name}!")

greet("Алексей")
greet("Мария")</code></pre>

<h3>Возвращаемое значение</h3>
<pre><code>def square(n):
    return n ** 2

result = square(5)
print(result)  # 25</code></pre>

<h3>Несколько параметров</h3>
<pre><code>def calculate_area(width, height):
    return width * height

area = calculate_area(5, 3)
print(f"Площадь: {area}")  # 15</code></pre>

<h3>Параметры по умолчанию</h3>
<pre><code>def power(base, exp=2):
    return base ** exp

print(power(3))     # 9 (3^2)
print(power(2, 10)) # 1024 (2^10)</code></pre>

<h3>Рекурсия</h3>
<pre><code>def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120</code></pre>`,
      durationMinutes: 50,
      orderIndex: 5,
    },
    {
      id: 'lesson-py-6',
      slug: 'lists',
      title: 'Списки и кортежи',
      description: 'Работа со списками: создание, изменение, срезы, методы',
      content: `<h2>Списки (list)</h2>
<p>Список — упорядоченная коллекция элементов.</p>
<pre><code>fruits = ["яблоко", "банан", "вишня"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]</code></pre>

<h3>Доступ к элементам</h3>
<pre><code>fruits = ["яблоко", "банан", "вишня"]
print(fruits[0])   # яблоко
print(fruits[-1])  # вишня (последний)</code></pre>

<h3>Методы списков</h3>
<pre><code>nums = [3, 1, 4, 1, 5]
nums.append(9)      # Добавить в конец
nums.insert(0, 0)   # Вставить по индексу
nums.remove(1)      # Удалить первое вхождение
nums.sort()         # Сортировка
nums.reverse()      # Реверс
print(len(nums))    # Длина списка</code></pre>

<h3>Срезы (slicing)</h3>
<pre><code>nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(nums[2:5])    # [2, 3, 4]
print(nums[:3])     # [0, 1, 2]
print(nums[7:])     # [7, 8, 9]
print(nums[::2])    # [0, 2, 4, 6, 8]</code></pre>

<h3>List comprehension</h3>
<pre><code>squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]</code></pre>`,
      durationMinutes: 45,
      orderIndex: 6,
    },
    {
      id: 'lesson-py-7',
      slug: 'dictionaries',
      title: 'Словари (dict)',
      description: 'Словари: пары ключ-значение, методы, итерация',
      content: `<h2>Словари</h2>
<p>Словарь — коллекция пар «ключ: значение». Ключи уникальны.</p>
<pre><code>student = {
    "name": "Алексей",
    "age": 13,
    "grade": 7
}
print(student["name"])  # Алексей</code></pre>

<h3>Основные операции</h3>
<pre><code># Добавление и изменение
student["school"] = "Лицей №1"
student["age"] = 14

# Удаление
del student["grade"]

# Проверка наличия ключа
if "name" in student:
    print("Имя есть")</code></pre>

<h3>Методы словаря</h3>
<pre><code>d = {"a": 1, "b": 2, "c": 3}
print(d.keys())    # dict_keys(['a', 'b', 'c'])
print(d.values())  # dict_values([1, 2, 3])
print(d.items())   # dict_items([('a', 1), ...])
print(d.get("x", 0))  # 0 (значение по умолчанию)</code></pre>

<h3>Итерация по словарю</h3>
<pre><code>scores = {"Алексей": 95, "Мария": 88, "Иван": 92}
for name, score in scores.items():
    print(f"{name}: {score}")

# Словарь из списка
names = ["a", "b", "c"]
values = [1, 2, 3]
d = dict(zip(names, values))</code></pre>

<h3>Вложенные словари</h3>
<pre><code>school = {
    "7A": {"students": 25, "teacher": "Петров"},
    "7B": {"students": 28, "teacher": "Иванова"}
}
print(school["7A"]["teacher"])  # Петров</code></pre>`,
      durationMinutes: 45,
      orderIndex: 7,
    },
    {
      id: 'lesson-py-8',
      slug: 'tuples-sets',
      title: 'Кортежи и множества',
      description: 'Кортежи (tuple), множества (set), операции над множествами',
      content: `<h2>Кортежи (tuple)</h2>
<p>Кортеж — неизменяемая последовательность элементов.</p>
<pre><code>point = (3, 5)
colors = ("red", "green", "blue")
print(point[0])  # 3
# point[0] = 10  # Ошибка! Кортеж нельзя изменить

# Распаковка
x, y = point
print(x, y)  # 3 5</code></pre>

<h3>Зачем кортежи?</h3>
<ul>
  <li>Защита от случайного изменения данных</li>
  <li>Могут быть ключами словаря (списки — нет)</li>
  <li>Работают быстрее списков</li>
</ul>

<h2>Множества (set)</h2>
<p>Множество — неупорядоченная коллекция уникальных элементов.</p>
<pre><code>nums = {1, 2, 3, 2, 1}
print(nums)  # {1, 2, 3}

nums.add(4)
nums.remove(1)
print(3 in nums)  # True</code></pre>

<h3>Операции над множествами</h3>
<pre><code>a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)  # {1, 2, 3, 4, 5, 6} — объединение
print(a & b)  # {3, 4} — пересечение
print(a - b)  # {1, 2} — разность
print(a ^ b)  # {1, 2, 5, 6} — симм. разность</code></pre>

<h3>Практическое применение</h3>
<pre><code># Удалить дубликаты
nums = [1, 3, 2, 3, 1, 4, 2]
unique = list(set(nums))
print(unique)  # [1, 2, 3, 4]</code></pre>`,
      durationMinutes: 40,
      orderIndex: 8,
    },
    {
      id: 'lesson-py-9',
      slug: 'string-methods',
      title: 'Строки: методы и форматирование',
      description: 'Продвинутая работа со строками, методы, срезы, форматирование',
      content: `<h2>Методы строк</h2>
<pre><code>s = "Hello, World!"
print(s.upper())       # HELLO, WORLD!
print(s.lower())       # hello, world!
print(s.strip())       # Убрать пробелы по краям
print(s.replace("World", "Python"))  # Hello, Python!
print(s.split(", "))   # ['Hello', 'World!']
print(s.find("World")) # 7
print(s.count("l"))    # 3
print(s.startswith("Hello"))  # True</code></pre>

<h3>Срезы строк</h3>
<pre><code>s = "Программирование"
print(s[0:7])    # Програм
print(s[::-1])   # еинаворимаргорП (реверс)
print(s[7:])     # мирование</code></pre>

<h3>Форматирование строк</h3>
<pre><code># f-строки (рекомендуется)
name = "Алексей"
age = 13
print(f"Имя: {name}, возраст: {age}")
print(f"Пи = {3.14159:.2f}")  # Пи = 3.14

# Метод format
print("{}+{}={}".format(2, 3, 5))

# Выравнивание
for i in range(1, 6):
    print(f"{i:>3} | {'*' * i}")</code></pre>

<h3>Полезные функции</h3>
<pre><code># Проверки
print("123".isdigit())    # True
print("abc".isalpha())    # True
print("abc123".isalnum()) # True

# Объединение
words = ["Python", "это", "круто"]
print(" ".join(words))  # Python это круто</code></pre>`,
      durationMinutes: 40,
      orderIndex: 9,
    },
    {
      id: 'lesson-py-10',
      slug: 'error-handling',
      title: 'Обработка ошибок',
      description: 'try/except, типы исключений, raise, собственные исключения',
      content: `<h2>Зачем обрабатывать ошибки?</h2>
<p>Ошибки в программе — нормальное явление. Важно уметь их перехватывать.</p>

<h3>Конструкция try/except</h3>
<pre><code>try:
    num = int(input("Введите число: "))
    result = 100 / num
    print(f"Результат: {result}")
except ValueError:
    print("Это не число!")
except ZeroDivisionError:
    print("На ноль делить нельзя!")
except Exception as e:
    print(f"Неизвестная ошибка: {e}")</code></pre>

<h3>else и finally</h3>
<pre><code>try:
    num = int(input())
except ValueError:
    print("Ошибка ввода")
else:
    print(f"Вы ввели: {num}")  # Если НЕ было ошибки
finally:
    print("Конец программы")   # Всегда выполняется</code></pre>

<h3>Типичные исключения</h3>
<ul>
  <li><code>ValueError</code> — неверное значение</li>
  <li><code>TypeError</code> — неверный тип</li>
  <li><code>IndexError</code> — индекс за пределами</li>
  <li><code>KeyError</code> — ключ не найден</li>
  <li><code>ZeroDivisionError</code> — деление на 0</li>
  <li><code>FileNotFoundError</code> — файл не найден</li>
</ul>

<h3>Создание исключений</h3>
<pre><code>def check_age(age):
    if age < 0:
        raise ValueError("Возраст не может быть отрицательным")
    return age

try:
    check_age(-5)
except ValueError as e:
    print(e)</code></pre>`,
      durationMinutes: 40,
      orderIndex: 10,
    },
    {
      id: 'lesson-py-11',
      slug: 'modules',
      title: 'Модули и библиотеки',
      description: 'Импорт модулей, стандартная библиотека, random, math, datetime',
      content: `<h2>Что такое модуль?</h2>
<p>Модуль — файл с Python-кодом, который можно использовать повторно.</p>

<h3>Импорт модулей</h3>
<pre><code>import math
print(math.pi)        # 3.141592653589793
print(math.sqrt(16))  # 4.0

from math import ceil, floor
print(ceil(3.2))   # 4
print(floor(3.8))  # 3</code></pre>

<h3>Модуль random</h3>
<pre><code>import random

print(random.randint(1, 10))     # Случайное число от 1 до 10
print(random.choice(["a", "b"])) # Случайный элемент
print(random.random())           # Дробное от 0.0 до 1.0

nums = [1, 2, 3, 4, 5]
random.shuffle(nums)  # Перемешать список</code></pre>

<h3>Модуль datetime</h3>
<pre><code>from datetime import datetime, timedelta

now = datetime.now()
print(now.strftime("%d.%m.%Y %H:%M"))

birthday = datetime(2012, 5, 15)
age_days = (now - birthday).days
print(f"Вам {age_days} дней")</code></pre>

<h3>Модуль collections</h3>
<pre><code>from collections import Counter

text = "hello world"
freq = Counter(text)
print(freq.most_common(3))
# [('l', 3), ('o', 2), ('h', 1)]</code></pre>`,
      durationMinutes: 40,
      orderIndex: 11,
    },
    {
      id: 'lesson-py-12',
      slug: 'oop-basics',
      title: 'ООП: Классы и объекты',
      description: 'Основы объектно-ориентированного программирования: классы, атрибуты, методы',
      content: `<h2>Что такое ООП?</h2>
<p>Объектно-ориентированное программирование — подход, где данные и функции объединяются в <strong>объекты</strong>.</p>

<h3>Создание класса</h3>
<pre><code>class Dog:
    def __init__(self, name, age):
        self.name = name  # атрибут
        self.age = age

    def bark(self):  # метод
        print(f"{self.name} говорит: Гав!")

    def info(self):
        print(f"{self.name}, {self.age} лет")

# Создание объектов
dog1 = Dog("Бобик", 3)
dog2 = Dog("Шарик", 5)

dog1.bark()  # Бобик говорит: Гав!
dog2.info()  # Шарик, 5 лет</code></pre>

<h3>__init__ — конструктор</h3>
<p>Метод <code>__init__</code> вызывается при создании объекта. <code>self</code> — ссылка на текущий объект.</p>

<h3>Пример: Прямоугольник</h3>
<pre><code>class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def __str__(self):
        return f"Прямоугольник {self.width}x{self.height}"

r = Rectangle(5, 3)
print(r.area())       # 15
print(r.perimeter())  # 16
print(r)              # Прямоугольник 5x3</code></pre>

<h3>Пример: Ученик</h3>
<pre><code>class Student:
    def __init__(self, name):
        self.name = name
        self.grades = []

    def add_grade(self, grade):
        self.grades.append(grade)

    def average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)

s = Student("Мария")
s.add_grade(5)
s.add_grade(4)
s.add_grade(5)
print(f"Средний балл: {s.average():.1f}")  # 4.7</code></pre>`,
      durationMinutes: 50,
      orderIndex: 12,
    },
    {
      id: 'lesson-py-13',
      slug: 'oop-inheritance',
      title: 'ООП: Наследование',
      description: 'Наследование классов, переопределение методов, super()',
      content: `<h2>Наследование</h2>
<p>Наследование позволяет создать новый класс на основе существующего.</p>

<pre><code>class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name}: Гав!"

class Cat(Animal):
    def speak(self):
        return f"{self.name}: Мяу!"

animals = [Dog("Бобик"), Cat("Мурка"), Dog("Рекс")]
for animal in animals:
    print(animal.speak())</code></pre>

<h3>super() — вызов метода родителя</h3>
<pre><code>class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Student(Person):
    def __init__(self, name, age, grade):
        super().__init__(name, age)  # вызов __init__ родителя
        self.grade = grade

    def info(self):
        return f"{self.name}, {self.age} лет, {self.grade} класс"

s = Student("Алексей", 13, 7)
print(s.info())</code></pre>

<h3>Практический пример: Фигуры</h3>
<pre><code>class Shape:
    def area(self):
        return 0

    def describe(self):
        return f"{self.__class__.__name__}: площадь = {self.area()}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

shapes = [Circle(5), Square(4), Circle(3)]
for s in shapes:
    print(s.describe())</code></pre>`,
      durationMinutes: 50,
      orderIndex: 13,
    },
    {
      id: 'lesson-py-14',
      slug: 'sorting-algorithms',
      title: 'Алгоритмы сортировки',
      description: 'Сортировка пузырьком, выбором, вставками, встроенная sorted()',
      content: `<h2>Зачем нужна сортировка?</h2>
<p>Сортировка — одна из базовых операций в программировании. Упорядоченные данные проще искать и обрабатывать.</p>

<h3>Сортировка пузырьком (Bubble Sort)</h3>
<pre><code>def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

nums = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(nums))
# [11, 12, 22, 25, 34, 64, 90]</code></pre>

<h3>Сортировка выбором (Selection Sort)</h3>
<pre><code>def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr</code></pre>

<h3>Сортировка вставками (Insertion Sort)</h3>
<pre><code>def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr</code></pre>

<h3>Встроенная сортировка Python</h3>
<pre><code>nums = [5, 2, 8, 1, 9]
print(sorted(nums))             # [1, 2, 5, 8, 9]
print(sorted(nums, reverse=True))  # [9, 8, 5, 2, 1]

# Сортировка по ключу
words = ["banana", "apple", "cherry"]
print(sorted(words, key=len))   # по длине

students = [("Мария", 95), ("Алексей", 88), ("Иван", 92)]
print(sorted(students, key=lambda x: x[1], reverse=True))</code></pre>`,
      durationMinutes: 50,
      orderIndex: 14,
    },
    {
      id: 'lesson-py-15',
      slug: 'search-algorithms',
      title: 'Алгоритмы поиска',
      description: 'Линейный и бинарный поиск, поиск в словарях',
      content: `<h2>Линейный поиск</h2>
<p>Простейший алгоритм — проверяем каждый элемент по очереди.</p>
<pre><code>def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Индекс найденного элемента
    return -1  # Не найден

nums = [4, 2, 7, 1, 9, 3]
print(linear_search(nums, 7))  # 2
print(linear_search(nums, 5))  # -1</code></pre>

<h3>Бинарный поиск</h3>
<p>Работает только с <strong>отсортированным</strong> массивом. На каждом шаге отбрасывает половину.</p>
<pre><code>def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11, 13, 15]
print(binary_search(nums, 7))   # 3
print(binary_search(nums, 10))  # -1</code></pre>

<h3>Сравнение скорости</h3>
<table border="1" style="border-collapse: collapse; width: 100%;">
  <tr><th>Алгоритм</th><th>Лучший</th><th>Средний</th><th>Худший</th></tr>
  <tr><td>Линейный</td><td>O(1)</td><td>O(n)</td><td>O(n)</td></tr>
  <tr><td>Бинарный</td><td>O(1)</td><td>O(log n)</td><td>O(log n)</td></tr>
</table>
<p>Для 1 000 000 элементов: линейный — до 1 000 000 шагов, бинарный — максимум 20!</p>

<h3>Поиск с помощью in и index</h3>
<pre><code>nums = [1, 5, 3, 7, 9]
print(5 in nums)        # True
print(nums.index(7))    # 3</code></pre>`,
      durationMinutes: 45,
      orderIndex: 15,
    },
    {
      id: 'lesson-py-16',
      slug: 'recursion-advanced',
      title: 'Рекурсия (углубленно)',
      description: 'Рекурсивные алгоритмы, дерево рекурсии, мемоизация',
      content: `<h2>Напоминание: что такое рекурсия?</h2>
<p>Рекурсия — когда функция вызывает саму себя. Важно: должно быть <strong>базовое условие</strong> для остановки.</p>

<h3>Числа Фибоначчи</h3>
<pre><code>def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(10):
    print(fib(i), end=" ")
# 0 1 1 2 3 5 8 13 21 34</code></pre>

<h3>Проблема: повторные вычисления</h3>
<p>fib(5) вызывает fib(4) и fib(3), а fib(4) снова вызывает fib(3)... Экспоненциальный рост!</p>

<h3>Мемоизация — кеширование результатов</h3>
<pre><code>def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

print(fib_memo(50))  # Мгновенно!</code></pre>

<h3>Рекурсивные задачи</h3>
<pre><code># Сумма цифр числа
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)

print(digit_sum(12345))  # 15

# Возведение в степень
def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(power(2, 10))  # 1024

# Палиндром
def is_palindrome(s):
    if len(s) <= 1:
        return True
    if s[0] != s[-1]:
        return False
    return is_palindrome(s[1:-1])

print(is_palindrome("radar"))  # True</code></pre>`,
      durationMinutes: 50,
      orderIndex: 16,
    },
    {
      id: 'lesson-py-17',
      slug: 'working-with-data',
      title: 'Работа с данными (JSON)',
      description: 'Чтение и запись JSON, обработка структурированных данных',
      content: `<h2>Формат JSON</h2>
<p>JSON (JavaScript Object Notation) — популярный формат обмена данными.</p>

<h3>Работа с JSON в Python</h3>
<pre><code>import json

# Словарь -> JSON строка
data = {"name": "Алексей", "age": 13, "grades": [5, 4, 5]}
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# JSON строка -> словарь
parsed = json.loads(json_str)
print(parsed["name"])  # Алексей</code></pre>

<h3>Обработка списков данных</h3>
<pre><code>students = [
    {"name": "Алексей", "score": 95},
    {"name": "Мария", "score": 88},
    {"name": "Иван", "score": 92},
    {"name": "Анна", "score": 97},
]

# Средний балл
avg = sum(s["score"] for s in students) / len(students)
print(f"Средний: {avg:.1f}")

# Лучший ученик
best = max(students, key=lambda s: s["score"])
print(f"Лучший: {best['name']} ({best['score']})")

# Фильтрация
excellent = [s for s in students if s["score"] >= 90]
print(f"Отличники: {len(excellent)}")</code></pre>

<h3>Вложенные структуры</h3>
<pre><code>school = {
    "classes": [
        {
            "name": "7A",
            "students": [
                {"name": "Алексей", "avg": 4.5},
                {"name": "Мария", "avg": 4.8}
            ]
        }
    ]
}

for cls in school["classes"]:
    print(f"Класс {cls['name']}:")
    for s in cls["students"]:
        print(f"  {s['name']}: {s['avg']}")</code></pre>`,
      durationMinutes: 45,
      orderIndex: 17,
    },
    {
      id: 'lesson-py-18',
      slug: 'lambda-map-filter',
      title: 'Lambda, map, filter и генераторы',
      description: 'Анонимные функции, функциональное программирование, генераторы списков',
      content: `<h2>Lambda-функции</h2>
<p>Анонимные (безымянные) функции для коротких операций.</p>
<pre><code># Обычная функция
def square(x):
    return x ** 2

# То же самое через lambda
square = lambda x: x ** 2
print(square(5))  # 25

# Lambda с несколькими аргументами
add = lambda a, b: a + b
print(add(3, 4))  # 7</code></pre>

<h3>map() — применить функцию к каждому элементу</h3>
<pre><code>nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x ** 2, nums))
print(squares)  # [1, 4, 9, 16, 25]

# Преобразование строк
names = ["алексей", "мария", "иван"]
capitalized = list(map(str.capitalize, names))
print(capitalized)  # ['Алексей', 'Мария', 'Иван']</code></pre>

<h3>filter() — отфильтровать элементы</h3>
<pre><code>nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)  # [2, 4, 6, 8, 10]

# Фильтрация строк
words = ["hello", "", "world", "", "python"]
non_empty = list(filter(None, words))
print(non_empty)  # ['hello', 'world', 'python']</code></pre>

<h3>Генераторы (yield)</h3>
<pre><code>def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(5):
    print(num)  # 5, 4, 3, 2, 1

# Генератор бесконечной последовательности
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")
# 0 1 1 2 3 5 8 13 21 34</code></pre>`,
      durationMinutes: 50,
      orderIndex: 18,
    },
    {
      id: 'lesson-py-19',
      slug: 'matrix-2d-arrays',
      title: 'Двумерные массивы и матрицы',
      description: 'Работа с двумерными списками, матричные операции',
      content: `<h2>Двумерные списки</h2>
<p>Двумерный список — список списков. Представляет таблицу или матрицу.</p>
<pre><code>matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print(matrix[1][2])  # 6 (строка 1, столбец 2)</code></pre>

<h3>Создание и заполнение</h3>
<pre><code># Нулевая матрица 3x4
rows, cols = 3, 4
matrix = [[0] * cols for _ in range(rows)]

# Заполнение
for i in range(rows):
    for j in range(cols):
        matrix[i][j] = i * cols + j + 1

# Вывод матрицы
for row in matrix:
    print(row)</code></pre>

<h3>Операции с матрицами</h3>
<pre><code># Сумма всех элементов
total = sum(sum(row) for row in matrix)

# Транспонирование (строки <-> столбцы)
def transpose(m):
    rows = len(m)
    cols = len(m[0])
    return [[m[i][j] for i in range(rows)] for j in range(cols)]

# Сумма двух матриц
def add_matrices(a, b):
    rows = len(a)
    cols = len(a[0])
    return [[a[i][j] + b[i][j] for j in range(cols)] for i in range(rows)]</code></pre>

<h3>Практические задачи</h3>
<pre><code># Поиск максимума в матрице
def find_max(matrix):
    max_val = matrix[0][0]
    for row in matrix:
        for val in row:
            if val > max_val:
                max_val = val
    return max_val

# Сумма главной диагонали
def diagonal_sum(matrix):
    return sum(matrix[i][i] for i in range(len(matrix)))</code></pre>`,
      durationMinutes: 45,
      orderIndex: 19,
    },
    {
      id: 'lesson-py-20',
      slug: 'final-project-python',
      title: 'Итоговый проект: Игра «Угадай число»',
      description: 'Применяем все знания: ООП, алгоритмы, обработка ошибок в итоговом проекте',
      content: `<h2>Итоговый проект</h2>
<p>Создадим игру «Угадай число» с использованием всех изученных концепций.</p>

<h3>Требования</h3>
<ul>
  <li>Компьютер загадывает число от 1 до 100</li>
  <li>Игрок угадывает, получая подсказки "больше" / "меньше"</li>
  <li>Подсчёт попыток и рекорды</li>
  <li>Обработка ошибок ввода</li>
</ul>

<h3>Реализация</h3>
<pre><code>import random

class GuessGame:
    def __init__(self, min_num=1, max_num=100):
        self.min_num = min_num
        self.max_num = max_num
        self.records = []

    def play_round(self):
        secret = random.randint(self.min_num, self.max_num)
        attempts = 0
        print(f"Я загадал число от {self.min_num} до {self.max_num}")

        while True:
            try:
                guess = int(input("Ваша догадка: "))
            except ValueError:
                print("Введите целое число!")
                continue

            attempts += 1

            if guess < secret:
                print("Больше!")
            elif guess > secret:
                print("Меньше!")
            else:
                print(f"Верно! Вы угадали за {attempts} попыток")
                self.records.append(attempts)
                return attempts

    def show_stats(self):
        if not self.records:
            print("Нет результатов")
            return
        print(f"Игр сыграно: {len(self.records)}")
        print(f"Лучший результат: {min(self.records)}")
        print(f"Средний результат: {sum(self.records)/len(self.records):.1f}")

# Запуск
game = GuessGame()
game.play_round()
game.show_stats()</code></pre>

<h3>Что вы изучили за курс</h3>
<ul>
  <li>Переменные и типы данных</li>
  <li>Условия и циклы</li>
  <li>Функции и рекурсия</li>
  <li>Списки, словари, множества</li>
  <li>ООП: классы и наследование</li>
  <li>Алгоритмы сортировки и поиска</li>
  <li>Обработка ошибок</li>
  <li>Работа с данными</li>
</ul>
<p><strong>Поздравляем! Вы прошли курс Python!</strong></p>`,
      durationMinutes: 60,
      orderIndex: 20,
    },
  ];

  for (const lesson of pythonLessons) {
    db.lessons.push({
      ...lesson,
      courseId: pythonCourseId,
      isPublished: true,
      prerequisites: [],
      createdAt: new Date().toISOString(),
    });
  }

  // Python Assignments
  const pythonAssignments = [
    {
      id: 'assign-py-1',
      lessonId: 'lesson-py-1',
      title: 'Привет, мир!',
      description: 'Напишите программу, которая выводит "Hello, World!"',
      starterCode: '# Напишите ваш код здесь\n',
      testCases: [
        { id: 1, input: '', expectedOutput: 'Hello, World!', description: 'Вывод приветствия', isHidden: false, points: 10 },
      ],
      points: 10,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-2',
      lessonId: 'lesson-py-1',
      title: 'Калькулятор',
      description: 'Напишите программу, которая считает сумму двух чисел, введённых пользователем.',
      starterCode: 'a = int(input())\nb = int(input())\n# Выведите сумму a + b\n',
      testCases: [
        { id: 1, input: '3\n5', expectedOutput: '8', description: 'Сумма 3 + 5', isHidden: false, points: 5 },
        { id: 2, input: '10\n20', expectedOutput: '30', description: 'Сумма 10 + 20', isHidden: false, points: 5 },
        { id: 3, input: '-5\n15', expectedOutput: '10', description: 'Сумма -5 + 15', isHidden: true, points: 5 },
      ],
      points: 15,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-3',
      lessonId: 'lesson-py-2',
      title: 'Информация о себе',
      description: 'Напишите программу, которая принимает имя и возраст, и выводит строку в формате: "Имя: X, Возраст: Y"',
      starterCode: 'name = input()\nage = input()\n# Выведите в формате: Имя: X, Возраст: Y\n',
      testCases: [
        { id: 1, input: 'Алексей\n13', expectedOutput: 'Имя: Алексей, Возраст: 13', description: 'Базовый тест', isHidden: false, points: 10 },
        { id: 2, input: 'Мария\n14', expectedOutput: 'Имя: Мария, Возраст: 14', description: 'Другое имя', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-4',
      lessonId: 'lesson-py-3',
      title: 'Проверка чётности',
      description: 'Напишите программу, которая принимает число и выводит "even" если оно чётное, или "odd" если нечётное.',
      starterCode: 'n = int(input())\n# Определите чётное число или нечётное\n',
      testCases: [
        { id: 1, input: '4', expectedOutput: 'even', description: 'Чётное число', isHidden: false, points: 5 },
        { id: 2, input: '7', expectedOutput: 'odd', description: 'Нечётное число', isHidden: false, points: 5 },
        { id: 3, input: '0', expectedOutput: 'even', description: 'Ноль', isHidden: true, points: 5 },
        { id: 4, input: '-3', expectedOutput: 'odd', description: 'Отрицательное', isHidden: true, points: 5 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-5',
      lessonId: 'lesson-py-4',
      title: 'Сумма чисел от 1 до N',
      description: 'Напишите программу, которая принимает число N и выводит сумму всех чисел от 1 до N включительно.',
      starterCode: 'n = int(input())\n# Посчитайте сумму от 1 до n\n',
      testCases: [
        { id: 1, input: '5', expectedOutput: '15', description: 'Сумма 1..5', isHidden: false, points: 5 },
        { id: 2, input: '10', expectedOutput: '55', description: 'Сумма 1..10', isHidden: false, points: 5 },
        { id: 3, input: '100', expectedOutput: '5050', description: 'Сумма 1..100', isHidden: true, points: 5 },
        { id: 4, input: '1', expectedOutput: '1', description: 'Один элемент', isHidden: true, points: 5 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-6',
      lessonId: 'lesson-py-5',
      title: 'Факториал',
      description: 'Напишите функцию factorial(n), которая возвращает факториал числа n. Выведите результат для введённого числа.',
      starterCode: 'def factorial(n):\n    # Напишите рекурсивную или итеративную функцию\n    pass\n\nn = int(input())\nprint(factorial(n))\n',
      testCases: [
        { id: 1, input: '5', expectedOutput: '120', description: '5! = 120', isHidden: false, points: 8 },
        { id: 2, input: '0', expectedOutput: '1', description: '0! = 1', isHidden: false, points: 8 },
        { id: 3, input: '10', expectedOutput: '3628800', description: '10!', isHidden: true, points: 9 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-7',
      lessonId: 'lesson-py-6',
      title: 'Максимум в списке',
      description: 'Прочитайте N чисел и выведите максимальное. Первая строка — количество чисел N, вторая — N чисел через пробел.',
      starterCode: 'n = int(input())\nnums = list(map(int, input().split()))\n# Найдите и выведите максимальное число\n',
      testCases: [
        { id: 1, input: '5\n3 1 4 1 5', expectedOutput: '5', description: 'Максимум в [3,1,4,1,5]', isHidden: false, points: 7 },
        { id: 2, input: '3\n-5 -1 -10', expectedOutput: '-1', description: 'Отрицательные числа', isHidden: false, points: 7 },
        { id: 3, input: '1\n42', expectedOutput: '42', description: 'Один элемент', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-8',
      lessonId: 'lesson-py-7',
      title: 'Частота слов',
      description: 'Дана строка со словами через пробел. Подсчитайте, сколько раз встречается каждое слово, и выведите их в формате "слово:количество" (каждое на новой строке, в порядке первого появления).',
      starterCode: 'words = input().split()\n# Подсчитайте частоту каждого слова\n',
      testCases: [
        { id: 1, input: 'hello world hello', expectedOutput: 'hello:2\nworld:1', description: 'Простой тест', isHidden: false, points: 10 },
        { id: 2, input: 'a b a b a', expectedOutput: 'a:3\nb:2', description: 'Повторы', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-9',
      lessonId: 'lesson-py-8',
      title: 'Уникальные элементы',
      description: 'Даны два набора чисел через пробел (две строки). Выведите числа, которые есть в обоих наборах, в отсортированном порядке через пробел.',
      starterCode: 'a = set(map(int, input().split()))\nb = set(map(int, input().split()))\n# Найдите и выведите пересечение\n',
      testCases: [
        { id: 1, input: '1 2 3 4 5\n3 4 5 6 7', expectedOutput: '3 4 5', description: 'Пересечение', isHidden: false, points: 10 },
        { id: 2, input: '1 2 3\n4 5 6', expectedOutput: '', description: 'Нет общих', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-10',
      lessonId: 'lesson-py-9',
      title: 'Реверс слов',
      description: 'Дана строка. Разверните порядок слов (не букв). Выведите результат.',
      starterCode: 's = input()\n# Разверните порядок слов\n',
      testCases: [
        { id: 1, input: 'Hello World Python', expectedOutput: 'Python World Hello', description: 'Три слова', isHidden: false, points: 10 },
        { id: 2, input: 'one', expectedOutput: 'one', description: 'Одно слово', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-py-11',
      lessonId: 'lesson-py-10',
      title: 'Безопасное деление',
      description: 'Прочитайте два числа. Выведите результат деления первого на второе с точностью до 2 знаков. Если второе число равно 0, выведите "Error: division by zero". Если ввод не число — "Error: invalid input".',
      starterCode: 'try:\n    a = int(input())\n    b = int(input())\n    # Выполните деление с обработкой ошибок\nexcept:\n    pass\n',
      testCases: [
        { id: 1, input: '10\n3', expectedOutput: '3.33', description: 'Обычное деление', isHidden: false, points: 7 },
        { id: 2, input: '10\n0', expectedOutput: 'Error: division by zero', description: 'Деление на ноль', isHidden: false, points: 7 },
        { id: 3, input: 'abc\n5', expectedOutput: 'Error: invalid input', description: 'Неверный ввод', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-12',
      lessonId: 'lesson-py-11',
      title: 'Генерация пароля',
      description: 'Используя модуль random, напишите программу, которая читает число N и выводит случайный пароль длиной N символов из букв (a-z, A-Z) и цифр (0-9). Для воспроизводимости используйте random.seed(42) в начале.',
      starterCode: 'import random\nimport string\nrandom.seed(42)\nn = int(input())\n# Сгенерируйте пароль\n',
      testCases: [
        { id: 1, input: '8', expectedOutput: 'IxoLBR0I', description: 'Пароль длиной 8', isHidden: false, points: 15 },
        { id: 2, input: '4', expectedOutput: 'IxoL', description: 'Пароль длиной 4', isHidden: true, points: 10 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-13',
      lessonId: 'lesson-py-12',
      title: 'Класс Банковский счёт',
      description: 'Создайте класс BankAccount с методами deposit(amount) и withdraw(amount). При снятии больше баланса выведите "Insufficient funds". Прочитайте начальный баланс, затем количество операций, затем сами операции (deposit X или withdraw X). В конце выведите баланс.',
      starterCode: 'class BankAccount:\n    def __init__(self, balance=0):\n        self.balance = balance\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n\nbalance = int(input())\naccount = BankAccount(balance)\nn = int(input())\nfor _ in range(n):\n    op = input().split()\n    # Обработайте операцию\nprint(account.balance)\n',
      testCases: [
        { id: 1, input: '100\n3\ndeposit 50\nwithdraw 30\nwithdraw 200', expectedOutput: 'Insufficient funds\n120', description: 'Базовые операции', isHidden: false, points: 13 },
        { id: 2, input: '0\n2\ndeposit 100\nwithdraw 100', expectedOutput: '0', description: 'До нуля', isHidden: true, points: 12 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-14',
      lessonId: 'lesson-py-13',
      title: 'Иерархия фигур',
      description: 'Создайте класс Shape с методом area(). Унаследуйте от него Circle(radius) и Rectangle(width, height). Прочитайте тип фигуры и параметры. Выведите площадь округлённую до 2 знаков.',
      starterCode: 'import math\n\nclass Shape:\n    def area(self):\n        return 0\n\n# Создайте Circle и Rectangle\n\nshape_type = input()\nif shape_type == "circle":\n    r = float(input())\n    # ...\nelif shape_type == "rectangle":\n    w = float(input())\n    h = float(input())\n    # ...\n',
      testCases: [
        { id: 1, input: 'circle\n5', expectedOutput: '78.54', description: 'Площадь круга', isHidden: false, points: 13 },
        { id: 2, input: 'rectangle\n4\n6', expectedOutput: '24.00', description: 'Площадь прямоугольника', isHidden: false, points: 12 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-15',
      lessonId: 'lesson-py-14',
      title: 'Сортировка пузырьком',
      description: 'Реализуйте сортировку пузырьком. Прочитайте N, затем N чисел через пробел. Выведите отсортированный массив через пробел.',
      starterCode: 'n = int(input())\narr = list(map(int, input().split()))\n\n# Реализуйте bubble sort\n\nprint(" ".join(map(str, arr)))\n',
      testCases: [
        { id: 1, input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'Базовая сортировка', isHidden: false, points: 7 },
        { id: 2, input: '4\n-3 0 -1 5', expectedOutput: '-3 -1 0 5', description: 'С отрицательными', isHidden: true, points: 7 },
        { id: 3, input: '1\n42', expectedOutput: '42', description: 'Один элемент', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-16',
      lessonId: 'lesson-py-15',
      title: 'Бинарный поиск',
      description: 'Реализуйте бинарный поиск. Первая строка — N чисел через пробел (отсортированы). Вторая — искомое число. Выведите индекс (0-based) или -1.',
      starterCode: 'arr = list(map(int, input().split()))\ntarget = int(input())\n\n# Реализуйте бинарный поиск\n',
      testCases: [
        { id: 1, input: '1 3 5 7 9 11\n7', expectedOutput: '3', description: 'Найден', isHidden: false, points: 10 },
        { id: 2, input: '1 3 5 7 9 11\n4', expectedOutput: '-1', description: 'Не найден', isHidden: false, points: 10 },
        { id: 3, input: '1\n1', expectedOutput: '0', description: 'Один элемент', isHidden: true, points: 5 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-17',
      lessonId: 'lesson-py-16',
      title: 'Сумма цифр (рекурсия)',
      description: 'Напишите рекурсивную функцию digit_sum(n), которая возвращает сумму цифр числа. Прочитайте число и выведите результат.',
      starterCode: 'def digit_sum(n):\n    # Рекурсивно найдите сумму цифр\n    pass\n\nn = int(input())\nprint(digit_sum(n))\n',
      testCases: [
        { id: 1, input: '12345', expectedOutput: '15', description: 'Сумма 1+2+3+4+5', isHidden: false, points: 10 },
        { id: 2, input: '9', expectedOutput: '9', description: 'Одна цифра', isHidden: false, points: 5 },
        { id: 3, input: '999', expectedOutput: '27', description: '9+9+9', isHidden: true, points: 10 },
      ],
      points: 25,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-18',
      lessonId: 'lesson-py-17',
      title: 'Обработка JSON',
      description: 'Дана JSON-строка со списком учеников [{name, score}, ...]. Выведите имя ученика с максимальным score.',
      starterCode: 'import json\n\ndata = input()\nstudents = json.loads(data)\n# Найдите ученика с максимальным score\n',
      testCases: [
        { id: 1, input: '[{"name":"Alice","score":85},{"name":"Bob","score":92},{"name":"Charlie","score":88}]', expectedOutput: 'Bob', description: 'Базовый тест', isHidden: false, points: 10 },
        { id: 2, input: '[{"name":"X","score":100}]', expectedOutput: 'X', description: 'Один ученик', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-19',
      lessonId: 'lesson-py-18',
      title: 'Map и Filter',
      description: 'Прочитайте N чисел через пробел. Используя filter и map, выведите квадраты только чётных чисел через пробел.',
      starterCode: 'nums = list(map(int, input().split()))\n# Используйте filter и map\n',
      testCases: [
        { id: 1, input: '1 2 3 4 5 6', expectedOutput: '4 16 36', description: 'Квадраты чётных', isHidden: false, points: 10 },
        { id: 2, input: '1 3 5', expectedOutput: '', description: 'Нет чётных', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-20',
      lessonId: 'lesson-py-19',
      title: 'Диагональ матрицы',
      description: 'Прочитайте число N, затем N строк по N чисел (матрица NxN). Выведите сумму элементов главной диагонали.',
      starterCode: 'n = int(input())\nmatrix = []\nfor _ in range(n):\n    row = list(map(int, input().split()))\n    matrix.append(row)\n# Найдите сумму главной диагонали\n',
      testCases: [
        { id: 1, input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '15', description: '1+5+9=15', isHidden: false, points: 10 },
        { id: 2, input: '2\n10 20\n30 40', expectedOutput: '50', description: '10+40=50', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-py-21',
      lessonId: 'lesson-py-20',
      title: 'Итоговое задание: Статистика',
      description: 'Прочитайте N чисел через пробел. Выведите на отдельных строках: минимум, максимум, среднее (с 2 знаками), медиану (с 2 знаками).',
      starterCode: 'nums = list(map(int, input().split()))\n# Посчитайте: min, max, average, median\n',
      testCases: [
        { id: 1, input: '5 1 3 2 4', expectedOutput: '1\n5\n3.00\n3.00', description: 'Нечётное кол-во', isHidden: false, points: 8 },
        { id: 2, input: '10 20 30 40', expectedOutput: '10\n40\n25.00\n25.00', description: 'Чётное кол-во', isHidden: false, points: 8 },
        { id: 3, input: '42', expectedOutput: '42\n42\n42.00\n42.00', description: 'Одно число', isHidden: true, points: 9 },
      ],
      points: 25,
      difficulty: 'hard',
    },
  ];

  for (const a of pythonAssignments) {
    db.assignments.push({
      ...a,
      assignmentType: 'code',
      validationType: 'automatic',
      maxAttempts: 10,
      orderIndex: 1,
      isPublished: true,
    });
  }

  // ==========================================
  // C++ COURSE
  // ==========================================
  const cppCourseId = 'course-cpp';
  db.courses.push({
    id: cppCourseId,
    slug: 'cpp-advanced-7',
    title: 'C++: Углубленный курс',
    description: 'Основы программирования на C++ для 7 класса. Синтаксис, типы данных, управляющие конструкции, массивы, функции.',
    language: 'cpp',
    level: 'advanced',
    isPublished: true,
    orderIndex: 2,
    estimatedHours: 40,
    createdAt: new Date().toISOString(),
  });

  const cppLessons = [
    {
      id: 'lesson-cpp-1',
      slug: 'intro-cpp',
      title: 'Введение в C++',
      description: 'Первая программа на C++, компиляция и запуск',
      content: `<h2>Что такое C++?</h2>
<p>C++ — мощный язык программирования, используемый для создания игр, операционных систем, браузеров и высокопроизводительных приложений.</p>

<h3>Ваша первая программа</h3>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    cout &lt;&lt; "Hello, World!" &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Разбор программы</h3>
<ul>
  <li><code>#include &lt;iostream&gt;</code> — подключение библиотеки ввода/вывода</li>
  <li><code>using namespace std;</code> — использование стандартного пространства имён</li>
  <li><code>int main()</code> — главная функция, точка входа</li>
  <li><code>cout &lt;&lt;</code> — вывод на экран</li>
  <li><code>endl</code> — переход на новую строку</li>
  <li><code>return 0;</code> — успешное завершение программы</li>
</ul>

<h3>Комментарии</h3>
<pre><code>// Однострочный комментарий

/* Многострочный
   комментарий */</code></pre>`,
      durationMinutes: 30,
      orderIndex: 1,
    },
    {
      id: 'lesson-cpp-2',
      slug: 'variables-cpp',
      title: 'Переменные и типы данных в C++',
      description: 'int, double, string, bool — объявление и использование',
      content: `<h2>Типы данных</h2>
<pre><code>#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    int age = 13;              // Целое число
    double pi = 3.14159;       // Дробное число
    char grade = 'A';          // Символ
    string name = "Алексей";   // Строка
    bool isStudent = true;     // Логическое значение

    cout &lt;&lt; "Имя: " &lt;&lt; name &lt;&lt; endl;
    cout &lt;&lt; "Возраст: " &lt;&lt; age &lt;&lt; endl;
    cout &lt;&lt; "PI: " &lt;&lt; pi &lt;&lt; endl;

    return 0;
}</code></pre>

<h3>Ввод данных</h3>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int a, b;
    cout &lt;&lt; "Введите два числа: ";
    cin &gt;&gt; a &gt;&gt; b;
    cout &lt;&lt; "Сумма: " &lt;&lt; a + b &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Арифметические операции</h3>
<pre><code>int a = 17, b = 5;
cout &lt;&lt; a + b;   // 22
cout &lt;&lt; a - b;   // 12
cout &lt;&lt; a * b;   // 85
cout &lt;&lt; a / b;   // 3 (целочисленное!)
cout &lt;&lt; a % b;   // 2 (остаток)</code></pre>`,
      durationMinutes: 35,
      orderIndex: 2,
    },
    {
      id: 'lesson-cpp-3',
      slug: 'conditions-cpp',
      title: 'Условные операторы в C++',
      description: 'if, else if, else, switch — ветвление программы',
      content: `<h2>Оператор if</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int age;
    cin &gt;&gt; age;

    if (age >= 18) {
        cout &lt;&lt; "Совершеннолетний" &lt;&lt; endl;
    } else if (age >= 14) {
        cout &lt;&lt; "Подросток" &lt;&lt; endl;
    } else {
        cout &lt;&lt; "Ребёнок" &lt;&lt; endl;
    }

    return 0;
}</code></pre>

<h3>Операторы сравнения</h3>
<p><code>==</code>, <code>!=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></p>

<h3>Логические операторы</h3>
<pre><code>// && — И, || — ИЛИ, ! — НЕ
if (age >= 12 && age <= 18) {
    cout &lt;&lt; "Школьник" &lt;&lt; endl;
}</code></pre>

<h3>Тернарный оператор</h3>
<pre><code>int x = 10;
string result = (x % 2 == 0) ? "чётное" : "нечётное";
cout &lt;&lt; result &lt;&lt; endl;</code></pre>`,
      durationMinutes: 40,
      orderIndex: 3,
    },
    {
      id: 'lesson-cpp-4',
      slug: 'loops-cpp',
      title: 'Циклы в C++',
      description: 'for, while, do-while — повторение действий',
      content: `<h2>Цикл for</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    // Вывод чисел от 1 до 10
    for (int i = 1; i <= 10; i++) {
        cout &lt;&lt; i &lt;&lt; " ";
    }
    cout &lt;&lt; endl;
    return 0;
}</code></pre>

<h2>Цикл while</h2>
<pre><code>int n = 1;
while (n <= 5) {
    cout &lt;&lt; n &lt;&lt; " ";
    n++;
}</code></pre>

<h3>break и continue</h3>
<pre><code>for (int i = 1; i <= 100; i++) {
    if (i % 3 == 0) continue;  // Пропустить кратные 3
    if (i > 20) break;          // Остановиться после 20
    cout &lt;&lt; i &lt;&lt; " ";
}</code></pre>

<h3>Вложенные циклы</h3>
<pre><code>// Таблица умножения
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++) {
        cout &lt;&lt; i * j &lt;&lt; "\\t";
    }
    cout &lt;&lt; endl;
}</code></pre>`,
      durationMinutes: 45,
      orderIndex: 4,
    },
    {
      id: 'lesson-cpp-5',
      slug: 'functions-cpp',
      title: 'Функции в C++',
      description: 'Создание функций, параметры, возвращаемые значения, перегрузка',
      content: `<h2>Функции</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

// Объявление функции
int add(int a, int b) {
    return a + b;
}

void greet(string name) {
    cout &lt;&lt; "Привет, " &lt;&lt; name &lt;&lt; "!" &lt;&lt; endl;
}

int main() {
    cout &lt;&lt; add(3, 5) &lt;&lt; endl;  // 8
    greet("Алексей");
    return 0;
}</code></pre>

<h3>Параметры по умолчанию</h3>
<pre><code>int power(int base, int exp = 2) {
    int result = 1;
    for (int i = 0; i &lt; exp; i++)
        result *= base;
    return result;
}

cout &lt;&lt; power(3) &lt;&lt; endl;     // 9 (3^2)
cout &lt;&lt; power(2, 10) &lt;&lt; endl;  // 1024</code></pre>

<h3>Перегрузка функций</h3>
<pre><code>int area(int side) {
    return side * side;  // Квадрат
}

int area(int width, int height) {
    return width * height;  // Прямоугольник
}

double area(double radius) {
    return 3.14159 * radius * radius;  // Круг
}</code></pre>

<h3>Рекурсия</h3>
<pre><code>int factorial(int n) {
    if (n &lt;= 1) return 1;
    return n * factorial(n - 1);
}

cout &lt;&lt; factorial(5) &lt;&lt; endl;  // 120</code></pre>`,
      durationMinutes: 45,
      orderIndex: 5,
    },
    {
      id: 'lesson-cpp-6',
      slug: 'arrays-cpp',
      title: 'Массивы',
      description: 'Статические массивы, многомерные массивы, обход',
      content: `<h2>Одномерные массивы</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int nums[5] = {10, 20, 30, 40, 50};

    // Доступ по индексу
    cout &lt;&lt; nums[0] &lt;&lt; endl;  // 10
    cout &lt;&lt; nums[4] &lt;&lt; endl;  // 50

    // Обход массива
    for (int i = 0; i &lt; 5; i++) {
        cout &lt;&lt; nums[i] &lt;&lt; " ";
    }
    cout &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Ввод массива</h3>
<pre><code>int n;
cin &gt;&gt; n;
int arr[1000];  // Максимальный размер

for (int i = 0; i &lt; n; i++) {
    cin &gt;&gt; arr[i];
}

// Поиск максимума
int maxVal = arr[0];
for (int i = 1; i &lt; n; i++) {
    if (arr[i] &gt; maxVal)
        maxVal = arr[i];
}
cout &lt;&lt; "Максимум: " &lt;&lt; maxVal &lt;&lt; endl;</code></pre>

<h3>Двумерные массивы</h3>
<pre><code>int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Обход
for (int i = 0; i &lt; 3; i++) {
    for (int j = 0; j &lt; 3; j++) {
        cout &lt;&lt; matrix[i][j] &lt;&lt; " ";
    }
    cout &lt;&lt; endl;
}</code></pre>

<h3>Сортировка пузырьком</h3>
<pre><code>void bubbleSort(int arr[], int n) {
    for (int i = 0; i &lt; n - 1; i++)
        for (int j = 0; j &lt; n - i - 1; j++)
            if (arr[j] &gt; arr[j + 1])
                swap(arr[j], arr[j + 1]);
}</code></pre>`,
      durationMinutes: 45,
      orderIndex: 6,
    },
    {
      id: 'lesson-cpp-7',
      slug: 'strings-cpp',
      title: 'Строки в C++',
      description: 'string: создание, методы, сравнение, поиск',
      content: `<h2>Тип string</h2>
<pre><code>#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    string s1 = "Hello";
    string s2 = "World";
    string s3 = s1 + ", " + s2 + "!";
    cout &lt;&lt; s3 &lt;&lt; endl;  // Hello, World!
    cout &lt;&lt; s3.length() &lt;&lt; endl;  // 13
    return 0;
}</code></pre>

<h3>Методы строк</h3>
<pre><code>string s = "Hello, World!";
cout &lt;&lt; s.substr(0, 5) &lt;&lt; endl;    // Hello
cout &lt;&lt; s.find("World") &lt;&lt; endl;   // 7
cout &lt;&lt; s.at(0) &lt;&lt; endl;           // H

s.replace(7, 5, "C++");  // Hello, C++!
s.erase(5, 2);           // Удалить 2 символа с позиции 5
s.insert(5, "!!");        // Вставить на позицию 5</code></pre>

<h3>Ввод строк</h3>
<pre><code>string word;
cin &gt;&gt; word;  // Читает одно слово

string line;
getline(cin, line);  // Читает всю строку</code></pre>

<h3>Обход строки</h3>
<pre><code>string s = "Hello";
for (int i = 0; i &lt; s.length(); i++) {
    cout &lt;&lt; s[i] &lt;&lt; " ";
}

// Range-based for
for (char c : s) {
    cout &lt;&lt; c &lt;&lt; " ";
}

// Реверс строки
string reversed = "";
for (int i = s.length() - 1; i &gt;= 0; i--) {
    reversed += s[i];
}</code></pre>

<h3>Полезные функции</h3>
<pre><code>#include &lt;cctype&gt;
char c = 'a';
cout &lt;&lt; (char)toupper(c) &lt;&lt; endl;  // A
cout &lt;&lt; isdigit('5') &lt;&lt; endl;      // true
cout &lt;&lt; isalpha('x') &lt;&lt; endl;      // true</code></pre>`,
      durationMinutes: 40,
      orderIndex: 7,
    },
    {
      id: 'lesson-cpp-8',
      slug: 'pointers-cpp',
      title: 'Указатели',
      description: 'Основы указателей: адреса, разыменование, арифметика',
      content: `<h2>Что такое указатель?</h2>
<p>Указатель — переменная, хранящая адрес другой переменной в памяти.</p>

<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int x = 42;
    int* ptr = &amp;x;  // ptr хранит адрес x

    cout &lt;&lt; "Значение x: " &lt;&lt; x &lt;&lt; endl;       // 42
    cout &lt;&lt; "Адрес x: " &lt;&lt; &amp;x &lt;&lt; endl;         // 0x7fff...
    cout &lt;&lt; "Значение ptr: " &lt;&lt; ptr &lt;&lt; endl;    // тот же адрес
    cout &lt;&lt; "Значение по ptr: " &lt;&lt; *ptr &lt;&lt; endl; // 42

    *ptr = 100;  // Изменяем x через указатель
    cout &lt;&lt; x &lt;&lt; endl;  // 100
    return 0;
}</code></pre>

<h3>Указатели и массивы</h3>
<pre><code>int arr[5] = {10, 20, 30, 40, 50};
int* p = arr;  // p указывает на первый элемент

cout &lt;&lt; *p &lt;&lt; endl;       // 10
cout &lt;&lt; *(p + 1) &lt;&lt; endl; // 20
cout &lt;&lt; *(p + 2) &lt;&lt; endl; // 30</code></pre>

<h3>Указатели и функции</h3>
<pre><code>void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5, y = 10;
    swap(&amp;x, &amp;y);
    cout &lt;&lt; x &lt;&lt; " " &lt;&lt; y &lt;&lt; endl;  // 10 5
}</code></pre>

<h3>nullptr</h3>
<pre><code>int* ptr = nullptr;  // Указатель «в никуда»
if (ptr != nullptr) {
    cout &lt;&lt; *ptr &lt;&lt; endl;  // Не выполнится
}</code></pre>`,
      durationMinutes: 50,
      orderIndex: 8,
    },
    {
      id: 'lesson-cpp-9',
      slug: 'references-cpp',
      title: 'Ссылки',
      description: 'Ссылки в C++, передача по ссылке, const-ссылки',
      content: `<h2>Ссылки</h2>
<p>Ссылка — это псевдоним (второе имя) для существующей переменной.</p>

<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    int x = 42;
    int&amp; ref = x;  // ref — ссылка на x

    cout &lt;&lt; ref &lt;&lt; endl;  // 42
    ref = 100;
    cout &lt;&lt; x &lt;&lt; endl;    // 100 (x изменился!)
    return 0;
}</code></pre>

<h3>Передача по ссылке</h3>
<pre><code>// По значению (копия)
void doubleVal(int n) {
    n *= 2;  // Изменяет копию
}

// По ссылке (оригинал)
void doubleRef(int&amp; n) {
    n *= 2;  // Изменяет оригинал
}

int main() {
    int a = 5;
    doubleVal(a);
    cout &lt;&lt; a &lt;&lt; endl;  // 5 (не изменился)

    doubleRef(a);
    cout &lt;&lt; a &lt;&lt; endl;  // 10 (изменился!)
}</code></pre>

<h3>const-ссылки</h3>
<pre><code>// Не позволяет изменять объект
void print(const string&amp; s) {
    cout &lt;&lt; s &lt;&lt; endl;
    // s = "other";  // Ошибка!
}

// Полезно для больших объектов — избегаем копирования
void processData(const vector&lt;int&gt;&amp; data) {
    for (int x : data) cout &lt;&lt; x &lt;&lt; " ";
}</code></pre>

<h3>Когда использовать?</h3>
<ul>
  <li><strong>По значению</strong> — для простых типов (int, double)</li>
  <li><strong>По ссылке (&amp;)</strong> — когда нужно изменить аргумент</li>
  <li><strong>По const-ссылке (const &amp;)</strong> — для больших объектов без изменения</li>
</ul>`,
      durationMinutes: 40,
      orderIndex: 9,
    },
    {
      id: 'lesson-cpp-10',
      slug: 'structs-cpp',
      title: 'Структуры (struct)',
      description: 'Пользовательские типы данных, группировка данных',
      content: `<h2>Структуры</h2>
<p>Структура объединяет несколько переменных разных типов.</p>

<pre><code>#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

struct Student {
    string name;
    int age;
    double gpa;
};

int main() {
    Student s1;
    s1.name = "Алексей";
    s1.age = 13;
    s1.gpa = 4.5;

    // Или инициализация сразу
    Student s2 = {"Мария", 14, 4.8};

    cout &lt;&lt; s2.name &lt;&lt; ": " &lt;&lt; s2.gpa &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Массив структур</h3>
<pre><code>Student students[3] = {
    {"Алексей", 13, 4.5},
    {"Мария", 14, 4.8},
    {"Иван", 13, 4.2}
};

// Найти лучшего ученика
int bestIdx = 0;
for (int i = 1; i &lt; 3; i++) {
    if (students[i].gpa &gt; students[bestIdx].gpa)
        bestIdx = i;
}
cout &lt;&lt; "Лучший: " &lt;&lt; students[bestIdx].name &lt;&lt; endl;</code></pre>

<h3>Структуры и функции</h3>
<pre><code>struct Point {
    double x, y;
};

double distance(const Point&amp; a, const Point&amp; b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return sqrt(dx * dx + dy * dy);
}

Point midpoint(const Point&amp; a, const Point&amp; b) {
    return {(a.x + b.x) / 2, (a.y + b.y) / 2};
}</code></pre>

<h3>Методы в структуре</h3>
<pre><code>struct Rectangle {
    double width, height;

    double area() {
        return width * height;
    }

    double perimeter() {
        return 2 * (width + height);
    }
};

Rectangle r = {5.0, 3.0};
cout &lt;&lt; "Площадь: " &lt;&lt; r.area() &lt;&lt; endl;</code></pre>`,
      durationMinutes: 45,
      orderIndex: 10,
    },
    {
      id: 'lesson-cpp-11',
      slug: 'classes-cpp',
      title: 'ООП: Классы',
      description: 'Классы, инкапсуляция, конструкторы, деструкторы',
      content: `<h2>Класс vs Структура</h2>
<p>В C++ класс = структура + инкапсуляция. По умолчанию поля класса приватные.</p>

<pre><code>#include &lt;iostream&gt;
#include &lt;string&gt;
using namespace std;

class Dog {
private:
    string name;
    int age;

public:
    // Конструктор
    Dog(string n, int a) : name(n), age(a) {}

    // Методы
    void bark() {
        cout &lt;&lt; name &lt;&lt; " говорит: Гав!" &lt;&lt; endl;
    }

    string getName() { return name; }
    int getAge() { return age; }
};

int main() {
    Dog dog("Бобик", 3);
    dog.bark();
    cout &lt;&lt; dog.getName() &lt;&lt; ", " &lt;&lt; dog.getAge() &lt;&lt; " лет" &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Инкапсуляция</h3>
<ul>
  <li><code>private</code> — доступ только внутри класса</li>
  <li><code>public</code> — доступ отовсюду</li>
  <li><code>protected</code> — доступ из класса и потомков</li>
</ul>

<h3>Пример: BankAccount</h3>
<pre><code>class BankAccount {
private:
    string owner;
    double balance;

public:
    BankAccount(string o, double b) : owner(o), balance(b) {}

    void deposit(double amount) {
        if (amount &gt; 0) balance += amount;
    }

    bool withdraw(double amount) {
        if (amount &gt; balance) return false;
        balance -= amount;
        return true;
    }

    double getBalance() { return balance; }

    void print() {
        cout &lt;&lt; owner &lt;&lt; ": " &lt;&lt; balance &lt;&lt; " руб." &lt;&lt; endl;
    }
};</code></pre>

<h3>Конструктор по умолчанию</h3>
<pre><code>class Counter {
private:
    int count;

public:
    Counter() : count(0) {}  // По умолчанию
    Counter(int c) : count(c) {}  // С параметром

    void increment() { count++; }
    int getCount() { return count; }
};</code></pre>`,
      durationMinutes: 50,
      orderIndex: 11,
    },
    {
      id: 'lesson-cpp-12',
      slug: 'inheritance-cpp',
      title: 'ООП: Наследование',
      description: 'Наследование классов, виртуальные функции, полиморфизм',
      content: `<h2>Наследование</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) {}
    virtual string speak() { return "..."; }
    string getName() { return name; }
};

class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}
    string speak() override { return "Гав!"; }
};

class Cat : public Animal {
public:
    Cat(string n) : Animal(n) {}
    string speak() override { return "Мяу!"; }
};

int main() {
    Dog d("Бобик");
    Cat c("Мурка");
    cout &lt;&lt; d.getName() &lt;&lt; ": " &lt;&lt; d.speak() &lt;&lt; endl;
    cout &lt;&lt; c.getName() &lt;&lt; ": " &lt;&lt; c.speak() &lt;&lt; endl;
    return 0;
}</code></pre>

<h3>Виртуальные функции и полиморфизм</h3>
<pre><code>void makeSpeak(Animal&amp; a) {
    cout &lt;&lt; a.getName() &lt;&lt; " говорит: " &lt;&lt; a.speak() &lt;&lt; endl;
}

int main() {
    Dog d("Бобик");
    Cat c("Мурка");
    makeSpeak(d);  // Бобик говорит: Гав!
    makeSpeak(c);  // Мурка говорит: Мяу!
}</code></pre>

<h3>Пример: Фигуры</h3>
<pre><code>class Shape {
public:
    virtual double area() { return 0; }
    virtual string name() { return "Shape"; }
};

class Circle : public Shape {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() override { return 3.14159 * radius * radius; }
    string name() override { return "Circle"; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() override { return w * h; }
    string name() override { return "Rectangle"; }
};</code></pre>`,
      durationMinutes: 50,
      orderIndex: 12,
    },
    {
      id: 'lesson-cpp-13',
      slug: 'dynamic-memory-cpp',
      title: 'Динамическая память',
      description: 'new/delete, динамические массивы, утечки памяти',
      content: `<h2>Динамическое выделение памяти</h2>
<pre><code>#include &lt;iostream&gt;
using namespace std;

int main() {
    // Выделение одной переменной
    int* p = new int(42);
    cout &lt;&lt; *p &lt;&lt; endl;  // 42
    delete p;  // Освобождаем память

    // Динамический массив
    int n;
    cin &gt;&gt; n;
    int* arr = new int[n];

    for (int i = 0; i &lt; n; i++) {
        arr[i] = i * 10;
    }

    for (int i = 0; i &lt; n; i++) {
        cout &lt;&lt; arr[i] &lt;&lt; " ";
    }

    delete[] arr;  // Освобождаем массив
    return 0;
}</code></pre>

<h3>Утечки памяти</h3>
<pre><code>// ПЛОХО — утечка памяти!
void bad() {
    int* p = new int(42);
    // Забыли delete — память потеряна
}

// ХОРОШО
void good() {
    int* p = new int(42);
    cout &lt;&lt; *p &lt;&lt; endl;
    delete p;
}</code></pre>

<h3>Правило: new — delete</h3>
<ul>
  <li>Каждому <code>new</code> — свой <code>delete</code></li>
  <li>Каждому <code>new[]</code> — свой <code>delete[]</code></li>
  <li>Не используйте <code>delete</code> дважды</li>
  <li>После <code>delete</code> — установите указатель в <code>nullptr</code></li>
</ul>

<h3>Когда нужна динамическая память?</h3>
<ul>
  <li>Размер массива определяется в runtime</li>
  <li>Объект должен жить дольше функции</li>
  <li>Большие объекты не помещаются в стек</li>
</ul>

<p><strong>Совет:</strong> В реальных проектах используйте <code>vector</code> вместо динамических массивов!</p>`,
      durationMinutes: 45,
      orderIndex: 13,
    },
    {
      id: 'lesson-cpp-14',
      slug: 'vector-cpp',
      title: 'STL: vector',
      description: 'Динамический массив vector: создание, методы, итерация',
      content: `<h2>vector — динамический массив</h2>
<p>vector из STL — безопасная и удобная замена обычным массивам.</p>

<pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

int main() {
    vector&lt;int&gt; nums = {10, 20, 30};

    // Добавление элементов
    nums.push_back(40);
    nums.push_back(50);

    // Размер
    cout &lt;&lt; "Размер: " &lt;&lt; nums.size() &lt;&lt; endl;

    // Доступ
    cout &lt;&lt; nums[0] &lt;&lt; endl;    // 10
    cout &lt;&lt; nums.at(1) &lt;&lt; endl; // 20 (с проверкой)
    cout &lt;&lt; nums.front() &lt;&lt; endl; // 10
    cout &lt;&lt; nums.back() &lt;&lt; endl;  // 50

    // Удаление последнего
    nums.pop_back();
    return 0;
}</code></pre>

<h3>Итерация</h3>
<pre><code>vector&lt;string&gt; names = {"Алексей", "Мария", "Иван"};

// Range-based for
for (const string&amp; name : names) {
    cout &lt;&lt; name &lt;&lt; " ";
}

// По индексу
for (int i = 0; i &lt; names.size(); i++) {
    cout &lt;&lt; i &lt;&lt; ": " &lt;&lt; names[i] &lt;&lt; endl;
}</code></pre>

<h3>Полезные операции</h3>
<pre><code>#include &lt;algorithm&gt;

vector&lt;int&gt; v = {5, 3, 1, 4, 2};

// Сортировка
sort(v.begin(), v.end());
// v = {1, 2, 3, 4, 5}

// Реверс
reverse(v.begin(), v.end());

// Поиск
auto it = find(v.begin(), v.end(), 3);
if (it != v.end()) {
    cout &lt;&lt; "Найдено на позиции " &lt;&lt; (it - v.begin()) &lt;&lt; endl;
}

// Минимум и максимум
cout &lt;&lt; *min_element(v.begin(), v.end()) &lt;&lt; endl;
cout &lt;&lt; *max_element(v.begin(), v.end()) &lt;&lt; endl;</code></pre>

<h3>2D vector</h3>
<pre><code>vector&lt;vector&lt;int&gt;&gt; matrix(3, vector&lt;int&gt;(4, 0));
matrix[1][2] = 42;</code></pre>`,
      durationMinutes: 45,
      orderIndex: 14,
    },
    {
      id: 'lesson-cpp-15',
      slug: 'map-set-cpp',
      title: 'STL: map и set',
      description: 'Ассоциативные контейнеры: map, set, unordered_map',
      content: `<h2>map — словарь (ассоциативный массив)</h2>
<pre><code>#include &lt;iostream&gt;
#include &lt;map&gt;
using namespace std;

int main() {
    map&lt;string, int&gt; ages;
    ages["Алексей"] = 13;
    ages["Мария"] = 14;
    ages["Иван"] = 13;

    // Доступ
    cout &lt;&lt; ages["Мария"] &lt;&lt; endl;  // 14

    // Проверка наличия
    if (ages.count("Алексей")) {
        cout &lt;&lt; "Найден!" &lt;&lt; endl;
    }

    // Обход
    for (auto&amp; [name, age] : ages) {
        cout &lt;&lt; name &lt;&lt; ": " &lt;&lt; age &lt;&lt; endl;
    }
    return 0;
}</code></pre>

<h3>Подсчёт частоты</h3>
<pre><code>string text = "hello world hello";
map&lt;string, int&gt; freq;
// Разделяем по пробелам и считаем
string word;
istringstream iss(text);
while (iss &gt;&gt; word) {
    freq[word]++;
}

for (auto&amp; [w, count] : freq) {
    cout &lt;&lt; w &lt;&lt; ": " &lt;&lt; count &lt;&lt; endl;
}</code></pre>

<h2>set — множество</h2>
<pre><code>#include &lt;set&gt;

set&lt;int&gt; nums = {3, 1, 4, 1, 5, 9, 2, 6};
// Автоматически: уникальные + отсортированные

for (int n : nums) {
    cout &lt;&lt; n &lt;&lt; " ";  // 1 2 3 4 5 6 9
}

nums.insert(7);
nums.erase(4);

if (nums.count(5)) {
    cout &lt;&lt; "5 есть в множестве" &lt;&lt; endl;
}</code></pre>

<h3>Практический пример</h3>
<pre><code>// Удалить дубликаты и отсортировать
vector&lt;int&gt; v = {5, 3, 1, 3, 5, 2};
set&lt;int&gt; s(v.begin(), v.end());
vector&lt;int&gt; unique(s.begin(), s.end());
// unique = {1, 2, 3, 5}</code></pre>`,
      durationMinutes: 45,
      orderIndex: 15,
    },
    {
      id: 'lesson-cpp-16',
      slug: 'stl-algorithms-cpp',
      title: 'STL: Алгоритмы',
      description: 'sort, find, count, accumulate, transform и другие алгоритмы',
      content: `<h2>Алгоритмы STL</h2>
<p>Стандартная библиотека содержит мощные алгоритмы для работы с контейнерами.</p>

<pre><code>#include &lt;iostream&gt;
#include &lt;vector&gt;
#include &lt;algorithm&gt;
#include &lt;numeric&gt;
using namespace std;

int main() {
    vector&lt;int&gt; v = {5, 3, 1, 4, 2};

    // Сортировка
    sort(v.begin(), v.end());         // 1 2 3 4 5
    sort(v.begin(), v.end(), greater&lt;int&gt;());  // 5 4 3 2 1

    // Сумма элементов
    int sum = accumulate(v.begin(), v.end(), 0);
    cout &lt;&lt; "Сумма: " &lt;&lt; sum &lt;&lt; endl;

    // Подсчёт
    cout &lt;&lt; count(v.begin(), v.end(), 3) &lt;&lt; endl;

    return 0;
}</code></pre>

<h3>Поиск</h3>
<pre><code>vector&lt;int&gt; v = {1, 2, 3, 4, 5};

// Линейный поиск
auto it = find(v.begin(), v.end(), 3);

// Бинарный поиск (массив должен быть отсортирован)
bool found = binary_search(v.begin(), v.end(), 3);

// Нижняя граница
auto lb = lower_bound(v.begin(), v.end(), 3);
cout &lt;&lt; "Индекс: " &lt;&lt; (lb - v.begin()) &lt;&lt; endl;</code></pre>

<h3>Трансформация</h3>
<pre><code>vector&lt;int&gt; src = {1, 2, 3, 4, 5};
vector&lt;int&gt; dst(5);

// Умножить каждый элемент на 2
transform(src.begin(), src.end(), dst.begin(),
          [](int x) { return x * 2; });
// dst = {2, 4, 6, 8, 10}

// Фильтрация с copy_if
vector&lt;int&gt; evens;
copy_if(src.begin(), src.end(), back_inserter(evens),
        [](int x) { return x % 2 == 0; });
// evens = {2, 4}</code></pre>

<h3>Другие полезные алгоритмы</h3>
<pre><code>// min/max
cout &lt;&lt; *min_element(v.begin(), v.end()) &lt;&lt; endl;
cout &lt;&lt; *max_element(v.begin(), v.end()) &lt;&lt; endl;

// all_of, any_of, none_of
bool allPositive = all_of(v.begin(), v.end(), [](int x) { return x &gt; 0; });
bool hasNegative = any_of(v.begin(), v.end(), [](int x) { return x &lt; 0; });

// unique (удалить последовательные дубликаты)
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());</code></pre>`,
      durationMinutes: 50,
      orderIndex: 16,
    },
    {
      id: 'lesson-cpp-17',
      slug: 'templates-cpp',
      title: 'Шаблоны (Templates)',
      description: 'Шаблоны функций и классов, обобщённое программирование',
      content: `<h2>Шаблоны функций</h2>
<p>Шаблоны позволяют писать код, работающий с любым типом данных.</p>

<pre><code>#include &lt;iostream&gt;
using namespace std;

template &lt;typename T&gt;
T maximum(T a, T b) {
    return (a &gt; b) ? a : b;
}

int main() {
    cout &lt;&lt; maximum(3, 7) &lt;&lt; endl;       // 7 (int)
    cout &lt;&lt; maximum(3.14, 2.71) &lt;&lt; endl; // 3.14 (double)
    cout &lt;&lt; maximum('a', 'z') &lt;&lt; endl;    // z (char)
    return 0;
}</code></pre>

<h3>Шаблон с несколькими типами</h3>
<pre><code>template &lt;typename T, typename U&gt;
void printPair(T first, U second) {
    cout &lt;&lt; first &lt;&lt; " : " &lt;&lt; second &lt;&lt; endl;
}

printPair(1, "hello");     // int, string
printPair(3.14, true);     // double, bool</code></pre>

<h3>Шаблон: обмен значений</h3>
<pre><code>template &lt;typename T&gt;
void mySwap(T&amp; a, T&amp; b) {
    T temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
mySwap(x, y);  // x=10, y=5

string s1 = "hello", s2 = "world";
mySwap(s1, s2);  // s1="world", s2="hello"</code></pre>

<h3>Шаблон: вывод массива</h3>
<pre><code>template &lt;typename T&gt;
void printArray(const vector&lt;T&gt;&amp; arr) {
    for (const T&amp; item : arr) {
        cout &lt;&lt; item &lt;&lt; " ";
    }
    cout &lt;&lt; endl;
}

vector&lt;int&gt; nums = {1, 2, 3};
vector&lt;string&gt; words = {"hello", "world"};
printArray(nums);   // 1 2 3
printArray(words);  // hello world</code></pre>`,
      durationMinutes: 45,
      orderIndex: 17,
    },
    {
      id: 'lesson-cpp-18',
      slug: 'exceptions-cpp',
      title: 'Обработка исключений',
      description: 'try/catch, throw, стандартные исключения',
      content: `<h2>Исключения в C++</h2>
<pre><code>#include &lt;iostream&gt;
#include &lt;stdexcept&gt;
using namespace std;

int main() {
    try {
        int a, b;
        cin &gt;&gt; a &gt;&gt; b;

        if (b == 0) {
            throw runtime_error("Division by zero!");
        }

        cout &lt;&lt; a / b &lt;&lt; endl;

    } catch (const runtime_error&amp; e) {
        cout &lt;&lt; "Ошибка: " &lt;&lt; e.what() &lt;&lt; endl;
    } catch (...) {
        cout &lt;&lt; "Неизвестная ошибка" &lt;&lt; endl;
    }

    return 0;
}</code></pre>

<h3>Стандартные исключения</h3>
<ul>
  <li><code>runtime_error</code> — ошибка выполнения</li>
  <li><code>invalid_argument</code> — неверный аргумент</li>
  <li><code>out_of_range</code> — выход за пределы</li>
  <li><code>overflow_error</code> — переполнение</li>
  <li><code>logic_error</code> — логическая ошибка</li>
</ul>

<h3>Исключения в функциях</h3>
<pre><code>double divide(double a, double b) {
    if (b == 0)
        throw invalid_argument("Cannot divide by zero");
    return a / b;
}

int parseAge(const string&amp; s) {
    int age = stoi(s);
    if (age &lt; 0 || age &gt; 150)
        throw out_of_range("Invalid age");
    return age;
}

try {
    cout &lt;&lt; divide(10, 0) &lt;&lt; endl;
} catch (const invalid_argument&amp; e) {
    cout &lt;&lt; e.what() &lt;&lt; endl;
}</code></pre>

<h3>vector::at() — безопасный доступ</h3>
<pre><code>vector&lt;int&gt; v = {1, 2, 3};
try {
    cout &lt;&lt; v.at(10) &lt;&lt; endl;  // Бросит out_of_range
} catch (const out_of_range&amp; e) {
    cout &lt;&lt; "Индекс за пределами: " &lt;&lt; e.what() &lt;&lt; endl;
}</code></pre>`,
      durationMinutes: 40,
      orderIndex: 18,
    },
    {
      id: 'lesson-cpp-19',
      slug: 'file-io-cpp',
      title: 'Файловый ввод/вывод',
      description: 'Чтение и запись файлов с помощью fstream',
      content: `<h2>Работа с файлами</h2>
<pre><code>#include &lt;iostream&gt;
#include &lt;fstream&gt;
#include &lt;string&gt;
using namespace std;

int main() {
    // Запись в файл
    ofstream outFile("output.txt");
    if (outFile.is_open()) {
        outFile &lt;&lt; "Привет, файл!" &lt;&lt; endl;
        outFile &lt;&lt; 42 &lt;&lt; endl;
        outFile.close();
    }

    // Чтение из файла
    ifstream inFile("output.txt");
    string line;
    while (getline(inFile, line)) {
        cout &lt;&lt; line &lt;&lt; endl;
    }
    inFile.close();

    return 0;
}</code></pre>

<h3>Чтение чисел из файла</h3>
<pre><code>ifstream fin("numbers.txt");
int num;
vector&lt;int&gt; numbers;

while (fin &gt;&gt; num) {
    numbers.push_back(num);
}
fin.close();

int sum = 0;
for (int n : numbers) sum += n;
cout &lt;&lt; "Сумма: " &lt;&lt; sum &lt;&lt; endl;</code></pre>

<h3>Проверка открытия файла</h3>
<pre><code>ifstream file("data.txt");
if (!file.is_open()) {
    cerr &lt;&lt; "Ошибка: файл не найден!" &lt;&lt; endl;
    return 1;
}</code></pre>

<h3>Режимы открытия</h3>
<pre><code>// Дописать в конец файла
ofstream file("log.txt", ios::app);
file &lt;&lt; "Новая запись" &lt;&lt; endl;

// Бинарный режим
ofstream binFile("data.bin", ios::binary);

// Чтение и запись
fstream file("data.txt", ios::in | ios::out);</code></pre>

<h3>Пример: копирование файла</h3>
<pre><code>ifstream src("input.txt");
ofstream dst("copy.txt");

string line;
while (getline(src, line)) {
    dst &lt;&lt; line &lt;&lt; endl;
}

src.close();
dst.close();</code></pre>`,
      durationMinutes: 40,
      orderIndex: 19,
    },
    {
      id: 'lesson-cpp-20',
      slug: 'final-project-cpp',
      title: 'Итоговый проект: Телефонная книга',
      description: 'Применяем все знания C++ в итоговом проекте',
      content: `<h2>Итоговый проект</h2>
<p>Создадим простую телефонную книгу с использованием классов, STL и обработки ошибок.</p>

<h3>Реализация</h3>
<pre><code>#include &lt;iostream&gt;
#include &lt;map&gt;
#include &lt;string&gt;
using namespace std;

class PhoneBook {
private:
    map&lt;string, string&gt; contacts;

public:
    void add(const string&amp; name, const string&amp; phone) {
        contacts[name] = phone;
        cout &lt;&lt; "Контакт добавлен: " &lt;&lt; name &lt;&lt; endl;
    }

    void find(const string&amp; name) {
        auto it = contacts.find(name);
        if (it != contacts.end()) {
            cout &lt;&lt; it-&gt;first &lt;&lt; ": " &lt;&lt; it-&gt;second &lt;&lt; endl;
        } else {
            cout &lt;&lt; "Контакт не найден" &lt;&lt; endl;
        }
    }

    void remove(const string&amp; name) {
        if (contacts.erase(name)) {
            cout &lt;&lt; "Удалён: " &lt;&lt; name &lt;&lt; endl;
        } else {
            cout &lt;&lt; "Контакт не найден" &lt;&lt; endl;
        }
    }

    void listAll() {
        if (contacts.empty()) {
            cout &lt;&lt; "Книга пуста" &lt;&lt; endl;
            return;
        }
        for (auto&amp; [name, phone] : contacts) {
            cout &lt;&lt; name &lt;&lt; ": " &lt;&lt; phone &lt;&lt; endl;
        }
    }

    int size() { return contacts.size(); }
};

int main() {
    PhoneBook book;
    book.add("Алексей", "+7-999-111-2233");
    book.add("Мария", "+7-999-444-5566");
    book.listAll();
    book.find("Алексей");
    return 0;
}</code></pre>

<h3>Что вы изучили за курс</h3>
<ul>
  <li>Переменные, типы данных, ввод/вывод</li>
  <li>Условия и циклы</li>
  <li>Функции и массивы</li>
  <li>Указатели и ссылки</li>
  <li>Структуры и классы (ООП)</li>
  <li>Наследование и полиморфизм</li>
  <li>STL: vector, map, set, алгоритмы</li>
  <li>Шаблоны и обработка исключений</li>
  <li>Файловый ввод/вывод</li>
</ul>
<p><strong>Поздравляем! Вы прошли курс C++!</strong></p>`,
      durationMinutes: 60,
      orderIndex: 20,
    },
  ];

  for (const lesson of cppLessons) {
    db.lessons.push({
      ...lesson,
      courseId: cppCourseId,
      isPublished: true,
      prerequisites: [],
      createdAt: new Date().toISOString(),
    });
  }

  // C++ Assignments
  const cppAssignments = [
    {
      id: 'assign-cpp-1',
      lessonId: 'lesson-cpp-1',
      title: 'Hello C++',
      description: 'Напишите программу, которая выводит "Hello, World!"',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Напишите ваш код здесь\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '', expectedOutput: 'Hello, World!', description: 'Вывод приветствия', isHidden: false, points: 10 },
      ],
      points: 10,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-2',
      lessonId: 'lesson-cpp-2',
      title: 'Сумма двух чисел',
      description: 'Прочитайте два целых числа и выведите их сумму.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Выведите сумму\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '3 5', expectedOutput: '8', description: '3 + 5', isHidden: false, points: 5 },
        { id: 2, input: '100 200', expectedOutput: '300', description: '100 + 200', isHidden: false, points: 5 },
        { id: 3, input: '-10 10', expectedOutput: '0', description: '-10 + 10', isHidden: true, points: 5 },
      ],
      points: 15,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-3',
      lessonId: 'lesson-cpp-3',
      title: 'Чётное или нечётное',
      description: 'Прочитайте число и выведите "even" если оно чётное, или "odd" если нечётное.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Определите чётность\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '4', expectedOutput: 'even', description: 'Чётное', isHidden: false, points: 5 },
        { id: 2, input: '7', expectedOutput: 'odd', description: 'Нечётное', isHidden: false, points: 5 },
        { id: 3, input: '0', expectedOutput: 'even', description: 'Ноль', isHidden: true, points: 5 },
      ],
      points: 15,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-4',
      lessonId: 'lesson-cpp-4',
      title: 'Сумма от 1 до N',
      description: 'Прочитайте число N и выведите сумму чисел от 1 до N.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Посчитайте сумму от 1 до n\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5', expectedOutput: '15', description: 'Сумма 1..5', isHidden: false, points: 7 },
        { id: 2, input: '10', expectedOutput: '55', description: 'Сумма 1..10', isHidden: false, points: 7 },
        { id: 3, input: '100', expectedOutput: '5050', description: 'Сумма 1..100', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-5',
      lessonId: 'lesson-cpp-5',
      title: 'Факториал (C++)',
      description: 'Напишите функцию factorial(n), которая возвращает факториал числа n. Прочитайте число и выведите результат.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    // Реализуйте функцию\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5', expectedOutput: '120', description: '5! = 120', isHidden: false, points: 7 },
        { id: 2, input: '0', expectedOutput: '1', description: '0! = 1', isHidden: false, points: 7 },
        { id: 3, input: '10', expectedOutput: '3628800', description: '10!', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-6',
      lessonId: 'lesson-cpp-6',
      title: 'Максимум в массиве',
      description: 'Прочитайте N, затем N чисел. Выведите максимальное число.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int arr[1000];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Найдите и выведите максимум\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5\n3 1 4 1 5', expectedOutput: '5', description: 'Максимум в массиве', isHidden: false, points: 7 },
        { id: 2, input: '3\n-5 -1 -10', expectedOutput: '-1', description: 'Отрицательные', isHidden: true, points: 7 },
        { id: 3, input: '1\n42', expectedOutput: '42', description: 'Один элемент', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-7',
      lessonId: 'lesson-cpp-7',
      title: 'Палиндром (C++)',
      description: 'Прочитайте строку (одно слово) и выведите "yes" если это палиндром, "no" если нет.',
      starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте, является ли строка палиндромом\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: 'radar', expectedOutput: 'yes', description: 'Палиндром', isHidden: false, points: 7 },
        { id: 2, input: 'hello', expectedOutput: 'no', description: 'Не палиндром', isHidden: false, points: 7 },
        { id: 3, input: 'a', expectedOutput: 'yes', description: 'Один символ', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-8',
      lessonId: 'lesson-cpp-8',
      title: 'Обмен через указатели',
      description: 'Напишите функцию swapPtr(int* a, int* b), которая меняет значения местами. Прочитайте два числа, поменяйте и выведите.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nvoid swapPtr(int* a, int* b) {\n    // Реализуйте обмен через указатели\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    swapPtr(&a, &b);\n    cout << a << " " << b << endl;\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5 10', expectedOutput: '10 5', description: 'Обмен', isHidden: false, points: 10 },
        { id: 2, input: '0 0', expectedOutput: '0 0', description: 'Одинаковые', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-9',
      lessonId: 'lesson-cpp-9',
      title: 'Удвоение по ссылке',
      description: 'Напишите функцию doubleValue(int& n), удваивающую число. Прочитайте число, удвойте и выведите.',
      starterCode: '#include <iostream>\nusing namespace std;\n\nvoid doubleValue(int& n) {\n    // Удвойте значение\n}\n\nint main() {\n    int n;\n    cin >> n;\n    doubleValue(n);\n    cout << n << endl;\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5', expectedOutput: '10', description: '5 -> 10', isHidden: false, points: 10 },
        { id: 2, input: '-3', expectedOutput: '-6', description: '-3 -> -6', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-10',
      lessonId: 'lesson-cpp-10',
      title: 'Структура Точка',
      description: 'Создайте структуру Point {int x, y}. Прочитайте координаты двух точек и выведите расстояние между ними (с 2 знаками после запятой).',
      starterCode: '#include <iostream>\n#include <cmath>\n#include <iomanip>\nusing namespace std;\n\nstruct Point {\n    int x, y;\n};\n\nint main() {\n    Point a, b;\n    cin >> a.x >> a.y >> b.x >> b.y;\n    // Вычислите и выведите расстояние\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '0 0 3 4', expectedOutput: '5.00', description: 'Расстояние 5', isHidden: false, points: 10 },
        { id: 2, input: '1 1 1 1', expectedOutput: '0.00', description: 'Совпадающие точки', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-11',
      lessonId: 'lesson-cpp-11',
      title: 'Класс Счётчик',
      description: 'Создайте класс Counter с методами increment(), decrement(), getValue(). Начальное значение 0. Прочитайте N операций (+ или -) и выведите итоговое значение.',
      starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Counter {\nprivate:\n    int value;\npublic:\n    Counter() : value(0) {}\n    void increment() { /* ... */ }\n    void decrement() { /* ... */ }\n    int getValue() { return value; }\n};\n\nint main() {\n    Counter c;\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        string op;\n        cin >> op;\n        // Обработайте операцию\n    }\n    cout << c.getValue() << endl;\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5\n+ + + - +', expectedOutput: '3', description: '3 плюса, 1 минус, 1 плюс', isHidden: false, points: 10 },
        { id: 2, input: '3\n- - -', expectedOutput: '-3', description: 'Только минусы', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-12',
      lessonId: 'lesson-cpp-12',
      title: 'Площадь фигур',
      description: 'Прочитайте тип фигуры ("circle" или "rectangle") и параметры. Выведите площадь с 2 знаками.',
      starterCode: '#include <iostream>\n#include <string>\n#include <cmath>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    string type;\n    cin >> type;\n    // Вычислите площадь\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: 'circle\n5', expectedOutput: '78.54', description: 'Круг r=5', isHidden: false, points: 10 },
        { id: 2, input: 'rectangle\n4 6', expectedOutput: '24.00', description: 'Прямоугольник 4x6', isHidden: false, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-13',
      lessonId: 'lesson-cpp-14',
      title: 'Сортировка vector',
      description: 'Прочитайте N, затем N чисел. Отсортируйте их и выведите через пробел.',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    // Отсортируйте и выведите\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'Сортировка', isHidden: false, points: 7 },
        { id: 2, input: '3\n-1 -5 3', expectedOutput: '-5 -1 3', description: 'С отрицательными', isHidden: true, points: 7 },
        { id: 3, input: '1\n42', expectedOutput: '42', description: 'Один элемент', isHidden: true, points: 6 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-14',
      lessonId: 'lesson-cpp-15',
      title: 'Частота символов (map)',
      description: 'Прочитайте строку (одно слово). Выведите каждый символ и его частоту в алфавитном порядке (формат: "символ:количество", по строке на каждый).',
      starterCode: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Подсчитайте частоту символов\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: 'hello', expectedOutput: 'e:1\nh:1\nl:2\no:1', description: 'Частота в hello', isHidden: false, points: 10 },
        { id: 2, input: 'aaa', expectedOutput: 'a:3', description: 'Один символ', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-15',
      lessonId: 'lesson-cpp-16',
      title: 'Сумма чётных (STL)',
      description: 'Прочитайте N чисел. Используя STL-алгоритмы, выведите сумму только чётных чисел.',
      starterCode: '#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    // Найдите сумму чётных\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '6\n1 2 3 4 5 6', expectedOutput: '12', description: '2+4+6=12', isHidden: false, points: 10 },
        { id: 2, input: '3\n1 3 5', expectedOutput: '0', description: 'Нет чётных', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-16',
      lessonId: 'lesson-cpp-17',
      title: 'Шаблон максимума',
      description: 'Напишите шаблонную функцию findMax, которая находит максимум в массиве. Прочитайте N целых чисел и выведите максимум.',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\ntemplate <typename T>\nT findMax(const vector<T>& arr) {\n    // Найдите максимум\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    cout << findMax(v) << endl;\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5\n3 1 4 1 5', expectedOutput: '5', description: 'Максимум 5', isHidden: false, points: 10 },
        { id: 2, input: '3\n-5 -1 -10', expectedOutput: '-1', description: 'Отрицательные', isHidden: true, points: 10 },
      ],
      points: 20,
      difficulty: 'medium',
    },
    {
      id: 'assign-cpp-17',
      lessonId: 'lesson-cpp-18',
      title: 'Безопасное деление (C++)',
      description: 'Прочитайте два числа. Выведите результат целочисленного деления. Если делитель 0 — выведите "Error: division by zero".',
      starterCode: '#include <iostream>\n#include <stdexcept>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Используйте try/catch\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '10 3', expectedOutput: '3', description: '10/3=3', isHidden: false, points: 10 },
        { id: 2, input: '10 0', expectedOutput: 'Error: division by zero', description: 'Деление на 0', isHidden: false, points: 10 },
      ],
      points: 20,
      difficulty: 'easy',
    },
    {
      id: 'assign-cpp-18',
      lessonId: 'lesson-cpp-20',
      title: 'Итоговое: Статистика массива',
      description: 'Прочитайте N чисел. Выведите на отдельных строках: минимум, максимум, сумму, среднее (с 2 знаками).',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    // Выведите min, max, sum, average\n    return 0;\n}\n',
      testCases: [
        { id: 1, input: '5\n1 2 3 4 5', expectedOutput: '1\n5\n15\n3.00', description: 'Базовый тест', isHidden: false, points: 8 },
        { id: 2, input: '3\n-10 0 10', expectedOutput: '-10\n10\n0\n0.00', description: 'С отрицательными', isHidden: true, points: 8 },
        { id: 3, input: '1\n42', expectedOutput: '42\n42\n42\n42.00', description: 'Один элемент', isHidden: true, points: 9 },
      ],
      points: 25,
      difficulty: 'hard',
    },
  ];

  for (const a of cppAssignments) {
    db.assignments.push({
      ...a,
      assignmentType: 'code',
      validationType: 'automatic',
      maxAttempts: 10,
      orderIndex: 1,
      isPublished: true,
    });
  }

  // Teacher's class
  db.classes.push({
    id: 'class-7a',
    teacherId: 'user-teacher',
    name: '7А класс',
    description: 'Углублённое изучение программирования',
    createdAt: new Date().toISOString(),
  });

  db.classStudents.push(
    { classId: 'class-7a', studentId: 'user-student', joinedAt: new Date().toISOString() },
    { classId: 'class-7a', studentId: 'user-student2', joinedAt: new Date().toISOString() },
  );

  // Enroll students
  db.enrollments.push({
    id: 'enr-1',
    userId: 'user-student',
    courseId: pythonCourseId,
    enrolledAt: new Date().toISOString(),
    progressPercentage: 0,
  });

  // ============================================
  // SEED COURSES FROM EXTERNAL SEED FILES
  // ============================================

  // Helper to convert seed lessons to in-memory format
  function addSeedCourse(courseId: string, prefix: string, seedLessons: any[]) {
    seedLessons.forEach((lesson, idx) => {
      const lessonId = `lesson-${prefix}-${idx + 1}`;
      db.lessons.push({
        id: lessonId,
        courseId,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        orderIndex: idx + 1,
        durationMinutes: lesson.duration || 45,
        isPublished: true,
        prerequisites: [],
        createdAt: new Date().toISOString(),
      });
      if (lesson.assignment) {
        const a = lesson.assignment;
        db.assignments.push({
          id: `assign-${prefix}-${idx + 1}`,
          lessonId,
          title: a.title,
          description: a.description,
          assignmentType: 'code',
          difficulty: a.difficulty || 'medium',
          starterCode: a.starterCode || '',
          testCases: (a.testCases || []).map((tc: any, i: number) => ({
            id: i + 1,
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            description: tc.description || '',
            isHidden: tc.isHidden || false,
            points: tc.points || Math.floor((a.points || 10) / (a.testCases?.length || 1)),
          })),
          validationType: 'automatic',
          maxAttempts: 10,
          points: a.points || 10,
          orderIndex: 1,
          isPublished: true,
        });
      }
    });
  }

  // Add 7 additional courses
  db.courses.push(
    { id: 'course-python-10', slug: 'python-10-advanced', title: 'Python для 10 класса', description: 'Углублённый курс: алгоритмы, структуры данных, рекурсия, ДП, графы.', language: 'python', level: 'advanced', isPublished: true, orderIndex: 3, estimatedHours: 60, createdAt: new Date().toISOString() },
    { id: 'course-cpp-10', slug: 'cpp-10-advanced', title: 'C++ для 10 класса', description: 'Углублённый курс: указатели, STL, алгоритмы, структуры данных, шаблоны.', language: 'cpp', level: 'advanced', isPublished: true, orderIndex: 4, estimatedHours: 65, createdAt: new Date().toISOString() },
    { id: 'course-python-11', slug: 'python-11-ege', title: 'Python для 11 класса (ЕГЭ)', description: 'Подготовка к ЕГЭ по информатике на Python. Разбор заданий 6, 12, 14, 16, 17, 23-27.', language: 'python', level: 'advanced', isPublished: true, orderIndex: 5, estimatedHours: 70, createdAt: new Date().toISOString() },
    { id: 'course-cpp-11', slug: 'cpp-11-ege', title: 'C++ для 11 класса (ЕГЭ)', description: 'Подготовка к ЕГЭ по информатике на C++. Разбор заданий 6, 12, 14, 16, 17, 24-27.', language: 'cpp', level: 'advanced', isPublished: true, orderIndex: 6, estimatedHours: 70, createdAt: new Date().toISOString() },
    { id: 'course-infosec-78', slug: 'infosec-78', title: 'Информационная безопасность 7-8 класс', description: 'Криптография, стеганография, веб-безопасность и форензика.', language: 'python', level: 'advanced', isPublished: true, orderIndex: 7, estimatedHours: 50, createdAt: new Date().toISOString() },
    { id: 'course-infosec-910', slug: 'infosec-910', title: 'Информационная безопасность 9-10 класс', description: 'RSA, сетевая безопасность, форензика, reverse engineering и CTF.', language: 'python', level: 'advanced', isPublished: true, orderIndex: 8, estimatedHours: 60, createdAt: new Date().toISOString() },
    { id: 'course-infosec-11', slug: 'infosec-11', title: 'Информационная безопасность 11 класс', description: 'Продвинутая криптография, веб-эксплуатация, бинарная эксплуатация, OSINT и подготовка к CTF.', language: 'python', level: 'advanced', isPublished: true, orderIndex: 9, estimatedHours: 70, createdAt: new Date().toISOString() },
  );

  // Populate lessons and assignments from seed files
  addSeedCourse('course-python-10', 'py10', python10Lessons);
  addSeedCourse('course-cpp-10', 'cpp10', cpp10Lessons);
  addSeedCourse('course-python-11', 'py11', python11Lessons);
  addSeedCourse('course-cpp-11', 'cpp11', cpp11Lessons);
  addSeedCourse('course-infosec-78', 'isec78', infosec78Lessons);
  addSeedCourse('course-infosec-910', 'isec910', infosec910Lessons);
  addSeedCourse('course-infosec-11', 'isec11', infosec11Lessons);

  console.log(`Seeded: ${db.users.length} users, ${db.courses.length} courses, ${db.lessons.length} lessons, ${db.assignments.length} assignments`);
}

// ============================================
// AUTH MIDDLEWARE
// ============================================
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Token required' } });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = db.users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } });
  }
}

function optionalAuth(req: any, _res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      req.user = db.users.find(u => u.id === payload.userId) || null;
    } catch { req.user = null; }
  }
  next();
}

function requireRole(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
    }
    next();
  };
}

// ============================================
// ROUTES: AUTH
// ============================================
app.post('/api/v1/auth/register', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'All fields required' } });
  }
  if (db.users.find(u => u.email === email)) {
    return res.status(409).json({ success: false, error: { code: 'DUPLICATE', message: 'Email already registered' } });
  }

  const validRole = (role === 'teacher' || role === 'student') ? role : 'student';
  const user: User = {
    id: genId(),
    email,
    passwordHash: await bcrypt.hash(password, 10),
    firstName,
    lastName,
    role: validRole,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  db.refreshTokens.set(refreshToken, user.id);

  res.status(201).json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      tokens: { accessToken, refreshToken },
    },
  });
});

app.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
  }

  const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  db.refreshTokens.set(refreshToken, user.id);

  res.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      tokens: { accessToken, refreshToken },
    },
  });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !db.refreshTokens.has(refreshToken)) {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });
  }
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const user = db.users.find(u => u.id === payload.userId);
    if (!user) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found' } });

    db.refreshTokens.delete(refreshToken);
    const newAccessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    db.refreshTokens.set(newRefreshToken, user.id);

    res.json({ success: true, data: { accessToken: newAccessToken, refreshToken: newRefreshToken } });
  } catch {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token expired' } });
  }
});

app.post('/api/v1/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) db.refreshTokens.delete(refreshToken);
  res.json({ success: true, message: 'Logged out' });
});

app.get('/api/v1/auth/me', authenticateToken, (req: any, res) => {
  const u = req.user;
  res.json({ success: true, data: { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role, isActive: u.isActive, createdAt: u.createdAt } });
});

app.patch('/api/v1/auth/me', authenticateToken, (req: any, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
  if (req.body.firstName) user.firstName = req.body.firstName;
  if (req.body.lastName) user.lastName = req.body.lastName;
  res.json({ success: true, data: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, isActive: user.isActive, createdAt: user.createdAt } });
});

// ============================================
// ROUTES: COURSES
// ============================================
app.get('/api/v1/courses', optionalAuth, (req: any, res) => {
  let courses = db.courses.filter(c => c.isPublished);
  const result = courses.map(c => {
    const enrollment = req.user ? db.enrollments.find(e => e.userId === req.user.id && e.courseId === c.id) : null;
    const totalLessons = db.lessons.filter(l => l.courseId === c.id && l.isPublished).length;
    const completedLessons = req.user
      ? db.progress.filter(p => p.userId === req.user.id && p.status === 'completed' && db.lessons.find(l => l.id === p.lessonId && l.courseId === c.id)).length
      : 0;
    return {
      ...c,
      totalLessons,
      completedLessons,
      progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      enrolledAt: enrollment?.enrolledAt || null,
    };
  });
  res.json({ success: true, data: result });
});

app.get('/api/v1/courses/:id', (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
  res.json({ success: true, data: course });
});

app.post('/api/v1/courses', authenticateToken, requireRole('admin'), (req: any, res) => {
  const course: Course = { id: genId(), ...req.body, isPublished: false, createdAt: new Date().toISOString() };
  db.courses.push(course);
  res.status(201).json({ success: true, data: course });
});

app.patch('/api/v1/courses/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const course = db.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
  Object.assign(course, req.body);
  res.json({ success: true, data: course });
});

app.delete('/api/v1/courses/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const idx = db.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });
  db.courses.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

app.post('/api/v1/courses/:id/enroll', authenticateToken, (req: any, res) => {
  const courseId = req.params.id;
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });

  const existing = db.enrollments.find(e => e.userId === req.user.id && e.courseId === courseId);
  if (existing) return res.json({ success: true, data: existing });

  const enrollment: Enrollment = { id: genId(), userId: req.user.id, courseId, enrolledAt: new Date().toISOString(), progressPercentage: 0 };
  db.enrollments.push(enrollment);
  res.status(201).json({ success: true, data: enrollment });
});

app.get('/api/v1/courses/:id/enrollment', authenticateToken, (req: any, res) => {
  const enrollment = db.enrollments.find(e => e.userId === req.user.id && e.courseId === req.params.id);
  if (!enrollment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not enrolled' } });
  res.json({ success: true, data: enrollment });
});

// ============================================
// ROUTES: LESSONS
// ============================================
app.get('/api/v1/lessons/courses/:courseId/lessons', optionalAuth, (req: any, res) => {
  const lessons = db.lessons
    .filter(l => l.courseId === req.params.courseId && l.isPublished)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(l => {
      const prog = req.user ? db.progress.find(p => p.userId === req.user.id && p.lessonId === l.id) : null;
      return { ...l, status: prog?.status || 'not_started', startedAt: prog?.startedAt, completedAt: prog?.completedAt };
    });
  res.json({ success: true, data: lessons });
});

app.get('/api/v1/lessons/:id', (req, res) => {
  const lesson = db.lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
  res.json({ success: true, data: lesson });
});

app.post('/api/v1/lessons', authenticateToken, requireRole('admin'), (req: any, res) => {
  const lesson: Lesson = {
    id: genId(), ...req.body, isPublished: false, prerequisites: req.body.prerequisites || [], createdAt: new Date().toISOString(),
  };
  db.lessons.push(lesson);
  res.status(201).json({ success: true, data: lesson });
});

app.patch('/api/v1/lessons/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const lesson = db.lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
  Object.assign(lesson, req.body);
  res.json({ success: true, data: lesson });
});

app.delete('/api/v1/lessons/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const idx = db.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Lesson not found' } });
  db.lessons.splice(idx, 1);
  res.json({ success: true, message: 'Deleted' });
});

app.post('/api/v1/lessons/:id/start', authenticateToken, (req: any, res) => {
  const lessonId = req.params.id;
  let prog = db.progress.find(p => p.userId === req.user.id && p.lessonId === lessonId);
  if (!prog) {
    prog = { id: genId(), userId: req.user.id, lessonId, status: 'in_progress', startedAt: new Date().toISOString() };
    db.progress.push(prog);
  } else if (prog.status === 'not_started') {
    prog.status = 'in_progress';
    prog.startedAt = new Date().toISOString();
  }
  res.json({ success: true, data: prog });
});

app.post('/api/v1/lessons/:id/complete', authenticateToken, (req: any, res) => {
  const lessonId = req.params.id;
  let prog = db.progress.find(p => p.userId === req.user.id && p.lessonId === lessonId);
  if (!prog) {
    prog = { id: genId(), userId: req.user.id, lessonId, status: 'completed', startedAt: new Date().toISOString(), completedAt: new Date().toISOString() };
    db.progress.push(prog);
  } else {
    prog.status = 'completed';
    prog.completedAt = new Date().toISOString();
  }

  // Update enrollment progress
  const lesson = db.lessons.find(l => l.id === lessonId);
  if (lesson) {
    const enrollment = db.enrollments.find(e => e.userId === req.user.id && e.courseId === lesson.courseId);
    if (enrollment) {
      const totalLessons = db.lessons.filter(l => l.courseId === lesson.courseId && l.isPublished).length;
      const completedLessons = db.progress.filter(p =>
        p.userId === req.user.id && p.status === 'completed' &&
        db.lessons.find(l => l.id === p.lessonId && l.courseId === lesson.courseId)
      ).length;
      enrollment.progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }
  }

  res.json({ success: true, data: prog });
});

// ============================================
// ROUTES: ASSIGNMENTS
// ============================================
app.get('/api/v1/assignments/lessons/:lessonId/assignments', (req, res) => {
  const assignments = db.assignments
    .filter(a => a.lessonId === req.params.lessonId && a.isPublished)
    .sort((a, b) => a.orderIndex - b.orderIndex);
  res.json({ success: true, data: assignments });
});

app.get('/api/v1/assignments/:id', (req, res) => {
  const assignment = db.assignments.find(a => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assignment not found' } });
  res.json({ success: true, data: assignment });
});

app.post('/api/v1/assignments', authenticateToken, requireRole('admin'), (req: any, res) => {
  const assignment = { id: genId(), ...req.body, isPublished: true };
  db.assignments.push(assignment);
  res.status(201).json({ success: true, data: assignment });
});

// ============================================
// ROUTES: SUBMISSIONS
// ============================================
app.post('/api/v1/assignments/:id/submit', authenticateToken, (req: any, res) => {
  const assignmentId = req.params.id;
  const assignment = db.assignments.find(a => a.id === assignmentId);
  if (!assignment) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assignment not found' } });

  const { code, language } = req.body;
  const attemptNumber = db.submissions.filter(s => s.assignmentId === assignmentId && s.userId === req.user.id).length + 1;

  // Mock code execution: check test cases by pattern matching
  const testResults: any = { passedTests: 0, totalTests: assignment.testCases.length, details: [] };
  // Simple mock: we can't actually execute code without Docker, so we'll simulate
  for (const tc of assignment.testCases) {
    testResults.details.push({
      testId: tc.id,
      passed: false,
      actualOutput: '(выполнение кода недоступно в dev-режиме)',
      expectedOutput: tc.expectedOutput,
      executionTime: 50,
      error: 'Code execution requires Docker. Submit to see your code saved.',
    });
  }

  const status = 'manual_review';
  const submission: Submission = {
    id: genId(),
    assignmentId,
    userId: req.user.id,
    code,
    language: language || 'python',
    status,
    testResults,
    score: 0,
    maxScore: assignment.points,
    attemptNumber,
    createdAt: new Date().toISOString(),
  };
  db.submissions.push(submission);

  res.status(201).json({ success: true, data: submission });
});

app.get('/api/v1/submissions/my', authenticateToken, (req: any, res) => {
  const subs = db.submissions.filter(s => s.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ success: true, data: subs });
});

// Teacher: get pending reviews
app.get('/api/v1/submissions/pending-reviews', authenticateToken, requireRole('teacher', 'admin'), (_req, res) => {
  const subs = db.submissions.filter(s => s.status === 'manual_review' || s.status === 'pending');
  const result = subs.map(s => {
    const user = db.users.find(u => u.id === s.userId);
    const assignment = db.assignments.find(a => a.id === s.assignmentId);
    return {
      ...s,
      studentName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      assignmentTitle: assignment?.title || 'Unknown',
    };
  });
  res.json({ success: true, data: result });
});

// Teacher: get all submissions for assignment
app.get('/api/v1/assignments/:assignmentId/submissions', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const subs = db.submissions.filter(s => s.assignmentId === req.params.assignmentId);
  const result = subs.map(s => {
    const user = db.users.find(u => u.id === s.userId);
    return { ...s, studentName: user ? `${user.firstName} ${user.lastName}` : 'Unknown' };
  });
  res.json({ success: true, data: result });
});

// Must be AFTER /submissions/my and /submissions/pending-reviews
app.get('/api/v1/submissions/:id', authenticateToken, (req: any, res) => {
  const submission = db.submissions.find(s => s.id === req.params.id);
  if (!submission) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Submission not found' } });
  res.json({ success: true, data: submission });
});

// Teacher: review submission
app.post('/api/v1/submissions/:id/review', authenticateToken, requireRole('teacher', 'admin'), (req: any, res) => {
  const submission = db.submissions.find(s => s.id === req.params.id);
  if (!submission) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Not found' } });

  const { score, teacherFeedback } = req.body;
  submission.teacherFeedback = teacherFeedback;
  submission.reviewedBy = req.user.id;
  submission.reviewedAt = new Date().toISOString();
  if (score !== undefined) {
    submission.score = score;
    submission.status = score > 0 ? 'passed' : 'failed';
  }

  res.json({ success: true, data: submission });
});

// ============================================
// ROUTES: PROGRESS
// ============================================
app.get('/api/v1/progress/me', authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const enrolledCourses = db.enrollments.filter(e => e.userId === userId).length;
  const completedLessons = db.progress.filter(p => p.userId === userId && p.status === 'completed').length;
  const passedAssignments = db.submissions.filter(s => s.userId === userId && s.status === 'passed').length;
  const totalPoints = db.submissions.filter(s => s.userId === userId && s.status === 'passed').reduce((sum, s) => sum + s.score, 0);

  const recentActivity = [
    ...db.submissions.filter(s => s.userId === userId).map(s => ({
      id: s.id, type: 'submission',
      title: db.assignments.find(a => a.id === s.assignmentId)?.title || 'Задание',
      timestamp: s.createdAt,
    })),
    ...db.progress.filter(p => p.userId === userId && p.startedAt).map(p => ({
      id: p.id, type: 'lesson_progress',
      title: db.lessons.find(l => l.id === p.lessonId)?.title || 'Урок',
      timestamp: p.startedAt!,
    })),
  ].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 10);

  res.json({
    success: true,
    data: { enrolledCourses, completedLessons, passedAssignments, earnedAchievements: 0, totalPoints, currentStreak: 0, recentActivity },
  });
});

app.get('/api/v1/progress/courses/:courseId', authenticateToken, (req: any, res) => {
  const courseId = req.params.courseId;
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Course not found' } });

  const lessons = db.lessons.filter(l => l.courseId === courseId && l.isPublished).sort((a, b) => a.orderIndex - b.orderIndex);
  const lessonsProgress = lessons.map(l => {
    const prog = db.progress.find(p => p.userId === req.user.id && p.lessonId === l.id);
    return { lessonId: l.id, lessonTitle: l.title, status: prog?.status || 'not_started', completedAt: prog?.completedAt };
  });
  const completedLessons = lessonsProgress.filter(l => l.status === 'completed').length;

  res.json({
    success: true,
    data: {
      courseId, courseTitle: course.title,
      progressPercentage: lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0,
      completedLessons, totalLessons: lessons.length, lessonsProgress,
    },
  });
});

// ============================================
// ROUTES: CODE EXECUTION (MOCK)
// ============================================
app.post('/api/v1/code/execute', authenticateToken, (_req, res) => {
  // Mock execution — no Docker available
  res.json({
    success: true,
    data: {
      stdout: '(Dev mode: code execution requires Docker)\nSetup Docker and code-executor service for real execution.',
      stderr: '',
      exitCode: 0,
      executionTime: 0,
      memoryUsed: 0,
    },
  });
});

// ============================================
// ROUTES: TEACHER - CLASSES
// ============================================
app.get('/api/v1/classes', authenticateToken, requireRole('teacher', 'admin'), (req: any, res) => {
  const classes = req.user.role === 'admin'
    ? db.classes
    : db.classes.filter(c => c.teacherId === req.user.id);

  const result = classes.map(c => {
    const students = db.classStudents.filter(cs => cs.classId === c.id);
    return { ...c, studentCount: students.length };
  });
  res.json({ success: true, data: result });
});

app.get('/api/v1/classes/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const cls = db.classes.find(c => c.id === req.params.id);
  if (!cls) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Class not found' } });

  const studentIds = db.classStudents.filter(cs => cs.classId === cls.id).map(cs => cs.studentId);
  const students = db.users.filter(u => studentIds.includes(u.id)).map(u => {
    const enrollments = db.enrollments.filter(e => e.userId === u.id);
    const completedLessons = db.progress.filter(p => p.userId === u.id && p.status === 'completed').length;
    const totalSubmissions = db.submissions.filter(s => s.userId === u.id).length;
    const passedSubmissions = db.submissions.filter(s => s.userId === u.id && s.status === 'passed').length;
    return {
      id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email,
      enrolledCourses: enrollments.length, completedLessons, totalSubmissions, passedSubmissions,
    };
  });

  res.json({ success: true, data: { ...cls, students } });
});

app.post('/api/v1/classes', authenticateToken, requireRole('teacher', 'admin'), (req: any, res) => {
  const cls: ClassRoom = { id: genId(), teacherId: req.user.id, ...req.body, createdAt: new Date().toISOString() };
  db.classes.push(cls);
  res.status(201).json({ success: true, data: cls });
});

app.post('/api/v1/classes/:id/students', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const { studentEmail } = req.body;
  const student = db.users.find(u => u.email === studentEmail && u.role === 'student');
  if (!student) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Student not found' } });

  const existing = db.classStudents.find(cs => cs.classId === req.params.id && cs.studentId === student.id);
  if (existing) return res.json({ success: true, message: 'Already in class' });

  db.classStudents.push({ classId: req.params.id, studentId: student.id, joinedAt: new Date().toISOString() });
  res.status(201).json({ success: true, message: 'Student added' });
});

// Teacher dashboard stats
app.get('/api/v1/teacher/dashboard', authenticateToken, requireRole('teacher', 'admin'), (req: any, res) => {
  const teacherClasses = db.classes.filter(c => c.teacherId === req.user.id);
  const classIds = teacherClasses.map(c => c.id);
  const studentIds = [...new Set(db.classStudents.filter(cs => classIds.includes(cs.classId)).map(cs => cs.studentId))];

  const pendingReviews = db.submissions.filter(s =>
    (s.status === 'manual_review' || s.status === 'pending') && studentIds.includes(s.userId)
  );

  const recentSubmissions = db.submissions
    .filter(s => studentIds.includes(s.userId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)
    .map(s => {
      const user = db.users.find(u => u.id === s.userId);
      const assignment = db.assignments.find(a => a.id === s.assignmentId);
      return {
        id: s.id,
        studentName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        assignmentTitle: assignment?.title || 'Unknown',
        status: s.status,
        score: s.score,
        maxScore: s.maxScore,
        submittedAt: s.createdAt,
      };
    });

  res.json({
    success: true,
    data: {
      totalClasses: teacherClasses.length,
      totalStudents: studentIds.length,
      pendingReviews: pendingReviews.length,
      recentSubmissions,
    },
  });
});

// ============================================
// ROUTES: USERS (admin)
// ============================================
app.get('/api/v1/users', authenticateToken, requireRole('admin'), (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const roleFilter = req.query.role as string | undefined;

  let filtered = db.users;
  if (roleFilter) filtered = filtered.filter(u => u.role === roleFilter);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);

  const users = paged.map(u => ({
    id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName,
    role: u.role, isActive: u.isActive, createdAt: u.createdAt,
  }));

  res.json({
    success: true,
    data: { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
});

app.patch('/api/v1/users/:id/role', authenticateToken, requireRole('admin'), (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION', message: 'Invalid role' } });
  }
  user.role = role;
  res.json({ success: true, data: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, isActive: user.isActive } });
});

app.patch('/api/v1/users/:id/active', authenticateToken, requireRole('admin'), (req, res) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
  user.isActive = req.body.isActive;
  res.json({ success: true, data: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, isActive: user.isActive } });
});

app.delete('/api/v1/users/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const idx = db.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
  db.users.splice(idx, 1);
  res.json({ success: true, message: 'User deleted' });
});

// ============================================
// ROUTES: ACHIEVEMENTS
// ============================================
const achievementsSeed = [
  { id: 'ach-1', slug: 'first-lesson', title: 'Первый шаг', description: 'Пройдите свой первый урок', iconUrl: '📖', badgeColor: '#3b82f6', criteria: { type: 'lessons_completed', count: 1 }, points: 10, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-2', slug: 'five-lessons', title: 'Прилежный ученик', description: 'Пройдите 5 уроков', iconUrl: '📚', badgeColor: '#8b5cf6', criteria: { type: 'lessons_completed', count: 5 }, points: 25, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-3', slug: 'ten-lessons', title: 'Книжный червь', description: 'Пройдите 10 уроков', iconUrl: '🎓', badgeColor: '#6366f1', criteria: { type: 'lessons_completed', count: 10 }, points: 50, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-4', slug: 'first-assignment', title: 'Решатель задач', description: 'Решите первое задание', iconUrl: '💡', badgeColor: '#22c55e', criteria: { type: 'assignments_completed', count: 1 }, points: 10, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-5', slug: 'five-assignments', title: 'Программист', description: 'Решите 5 заданий', iconUrl: '💻', badgeColor: '#10b981', criteria: { type: 'assignments_completed', count: 5 }, points: 25, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-6', slug: 'first-perfect', title: 'Перфекционист', description: 'Получите максимальный балл', iconUrl: '⭐', badgeColor: '#eab308', criteria: { type: 'perfect_score', count: 1 }, points: 30, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-7', slug: 'course-complete', title: 'Выпускник', description: 'Завершите курс целиком', iconUrl: '🎉', badgeColor: '#ec4899', criteria: { type: 'course_completed', count: 1 }, points: 100, isActive: true, createdAt: new Date().toISOString() },
  { id: 'ach-8', slug: 'streak-3', title: 'Трёхдневный марафон', description: 'Занимайтесь 3 дня подряд', iconUrl: '🔥', badgeColor: '#ef4444', criteria: { type: 'streak_days', count: 3 }, points: 20, isActive: true, createdAt: new Date().toISOString() },
] as any[];

const userAchievements: Array<{ userId: string; achievementId: string; earnedAt: string }> = [];

app.get('/api/v1/achievements', optionalAuth, (req: any, res) => {
  const userId = req.user?.id;
  const result = achievementsSeed.map(a => {
    const ua = userId ? userAchievements.find(x => x.userId === userId && x.achievementId === a.id) : null;
    return {
      ...a,
      isEarned: !!ua,
      earnedAt: ua?.earnedAt || null,
      progress: 0,
      progressTarget: a.criteria.count || 1,
    };
  });
  res.json({ success: true, data: result });
});

app.get('/api/v1/achievements/my', authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const earned = userAchievements
    .filter(ua => ua.userId === userId)
    .map(ua => {
      const ach = achievementsSeed.find(a => a.id === ua.achievementId);
      return ach ? { ...ach, isEarned: true, earnedAt: ua.earnedAt } : null;
    })
    .filter(Boolean);
  res.json({ success: true, data: earned });
});

app.post('/api/v1/achievements/check', authenticateToken, (_req: any, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/v1/achievements', authenticateToken, requireRole('admin'), (req, res) => {
  const ach = { id: genId(), ...req.body, isActive: true, createdAt: new Date().toISOString() };
  achievementsSeed.push(ach);
  res.status(201).json({ success: true, data: ach });
});

app.patch('/api/v1/achievements/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const ach = achievementsSeed.find(a => a.id === req.params.id);
  if (!ach) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Achievement not found' } });
  Object.assign(ach, req.body);
  res.json({ success: true, data: ach });
});

app.delete('/api/v1/achievements/:id', authenticateToken, requireRole('admin'), (req, res) => {
  const idx = achievementsSeed.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Achievement not found' } });
  achievementsSeed.splice(idx, 1);
  res.json({ success: true, message: 'Achievement deleted' });
});

// ============================================
// ROUTES: NOTIFICATIONS
// ============================================
const notificationsDb: Array<{ id: string; userId: string; type: string; title: string; message: string; isRead: boolean; createdAt: string }> = [];

// Seed some notifications for each student
function seedNotifications() {
  const students = db.users.filter(u => u.role === 'student');
  const now = new Date();
  students.forEach(student => {
    notificationsDb.push(
      { id: genId(), userId: student.id, type: 'system', title: 'Добро пожаловать!', message: 'Добро пожаловать на платформу Code Learning. Начните с выбора курса.', isRead: false, createdAt: new Date(now.getTime() - 3600000).toISOString() },
      { id: genId(), userId: student.id, type: 'assignment', title: 'Новое задание', message: 'Доступно новое задание "Работа с переменными" в курсе Python.', isRead: false, createdAt: new Date(now.getTime() - 7200000).toISOString() },
      { id: genId(), userId: student.id, type: 'achievement', title: 'Вы близки к достижению!', message: 'Ещё немного и вы получите достижение "Первый шаг".', isRead: true, createdAt: new Date(now.getTime() - 86400000).toISOString() },
    );
  });
}

app.get('/api/v1/notifications', authenticateToken, (req: any, res) => {
  const userId = req.user.id;
  const userNotifications = notificationsDb
    .filter(n => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ success: true, data: userNotifications });
});

app.patch('/api/v1/notifications/:id/read', authenticateToken, (req: any, res) => {
  const notif = notificationsDb.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (!notif) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Notification not found' } });
  notif.isRead = true;
  res.json({ success: true, data: notif });
});

app.post('/api/v1/notifications/read-all', authenticateToken, (req: any, res) => {
  notificationsDb.filter(n => n.userId === req.user.id).forEach(n => n.isRead = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    mode: 'development (in-memory)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    data: {
      users: db.users.length,
      courses: db.courses.length,
      lessons: db.lessons.length,
      assignments: db.assignments.length,
    },
  });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// ============================================
// START
// ============================================
seedData();
seedNotifications();

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  Code Learning Platform — Dev API');
  console.log('========================================');
  console.log(`  Mode:     In-Memory (no PostgreSQL/Redis needed)`);
  console.log(`  API:      http://localhost:${PORT}/api/v1`);
  console.log(`  Health:   http://localhost:${PORT}/health`);
  console.log('');
  console.log('  Test accounts (password: password123):');
  console.log('    Admin:   admin@school.com');
  console.log('    Teacher: teacher@school.com');
  console.log('    Student: student1@school.com');
  console.log('========================================');
  console.log('');
});
