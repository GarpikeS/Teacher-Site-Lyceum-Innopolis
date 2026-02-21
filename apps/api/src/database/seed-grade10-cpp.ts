// ============================================
// Grade 10 C++ — Углублённый курс
// 20 уроков, ~65 часов
// Указатели, STL, алгоритмы, структуры данных, шаблоны
// ============================================

export const cpp10Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Повторение C++ и STL
  // ──────────────────────────────────────────
  {
    slug: 'cpp-review-stl-intro',
    title: 'Повторение C++ и введение в STL',
    description: 'Основы C++, компиляция, STL контейнеры, итераторы',
    content: `# Повторение C++ и введение в STL

## Компиляция и запуск

\`\`\`bash
g++ -std=c++17 -O2 -o solution solution.cpp
./solution
\`\`\`

## Шаблон программы

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Ваш код

    return 0;
}
\`\`\`

## STL — Standard Template Library

STL предоставляет готовые **контейнеры**, **алгоритмы** и **итераторы**.

## vector — динамический массив

\`\`\`cpp
vector<int> v;
v.push_back(5);          // добавить в конец
v.pop_back();             // удалить последний
v.size();                 // размер
v[0];                     // доступ по индексу
v.front(); v.back();      // первый / последний

// Инициализация
vector<int> a(n, 0);     // n нулей
vector<int> b = {1,2,3};
vector<vector<int>> g(n); // 2D
\`\`\`

## string — строки

\`\`\`cpp
string s = "hello";
s.length();          // 5
s.substr(1, 3);      // "ell"
s.find("ll");        // 2
s += " world";       // конкатенация
s[0] = 'H';         // доступ по индексу

// Преобразования
to_string(42);       // "42"
stoi("42");          // 42
stoll("1000000000"); // long long
\`\`\`

## pair и tuple

\`\`\`cpp
pair<int, string> p = {42, "hello"};
cout << p.first << " " << p.second;

// Сортировка пар — сначала по first, затем по second
vector<pair<int, int>> pairs;
sort(pairs.begin(), pairs.end());

// auto для удобства
auto [x, y] = make_pair(1, 2); // C++17
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Работа с vector',
        description: 'Считайте N чисел. Удалите все отрицательные и выведите оставшиеся через пробел. Используйте vector.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте числа, удалите отрицательные\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 -1 4 -2 5', expectedOutput: '3 4 5', description: 'Удалены -1 и -2' },
          { input: '3\n-1 -2 -3', expectedOutput: '', description: 'Все удалены' },
          { input: '4\n1 2 3 4', expectedOutput: '1 2 3 4', description: 'Ничего не удалено' },
        ],
        points: 10,
      },
      {
        title: 'Реверс вектора',
        description: 'Считайте N чисел в vector. Выведите их в обратном порядке через пробел. Не используйте дополнительный массив.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    // Разверните вектор и выведите\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: 'Обратный порядок' },
          { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
          { input: '3\n10 20 30', expectedOutput: '30 20 10', description: 'Три элемента' },
        ],
        points: 10,
      },
      {
        title: 'Подстрока в строке',
        description: 'Считайте строку S и подстроку T. Выведите индекс первого вхождения T в S. Если не найдено — выведите -1. Используйте string::find.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s, t;\n    cin >> s >> t;\n    // Найдите первое вхождение t в s\n    return 0;\n}\n',
        testCases: [
          { input: 'helloworld\nworld', expectedOutput: '5', description: 'world начинается с позиции 5' },
          { input: 'abcabc\nabc', expectedOutput: '0', description: 'Первое вхождение с начала' },
          { input: 'hello\nxyz', expectedOutput: '-1', description: 'Подстрока не найдена' },
        ],
        points: 15,
      },
      {
        title: 'Сортировка пар',
        description: 'Считайте N пар целых чисел. Отсортируйте по первому элементу, при равенстве — по второму. Выведите каждую пару на отдельной строке.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<pair<int,int>> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i].first >> v[i].second;\n    // Отсортируйте и выведите\n    return 0;\n}\n',
        testCases: [
          { input: '3\n2 5\n1 3\n2 1', expectedOutput: '1 3\n2 1\n2 5', description: 'Сортировка по first, затем по second' },
          { input: '2\n5 5\n5 3', expectedOutput: '5 3\n5 5', description: 'Одинаковый first — по second' },
          { input: '1\n7 2', expectedOutput: '7 2', description: 'Одна пара' },
        ],
        points: 15,
      },
      {
        title: 'Уникальные элементы vector',
        description: 'Считайте N чисел. Выведите только уникальные числа в порядке первого появления. Используйте vector и set для отслеживания.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте числа и выведите уникальные в порядке появления\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1 2 3 2 1 4 3', expectedOutput: '1 2 3 4', description: 'Порядок первого появления' },
          { input: '5\n5 5 5 5 5', expectedOutput: '5', description: 'Все одинаковые' },
          { input: '4\n10 20 30 40', expectedOutput: '10 20 30 40', description: 'Все уникальны' },
          { input: '6\n3 1 4 1 5 9', expectedOutput: '3 1 4 5 9', description: 'Смешанные повторы' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 2: Указатели и ссылки
  // ──────────────────────────────────────────
  {
    slug: 'pointers-references',
    title: 'Указатели и ссылки',
    description: 'Адреса памяти, разыменование, передача по ссылке, nullptr',
    content: `# Указатели и ссылки

## Указатели

\`\`\`cpp
int x = 42;
int* ptr = &x;    // ptr хранит адрес x

cout << ptr;      // адрес (например, 0x7fff...)
cout << *ptr;     // разыменование: 42
*ptr = 100;       // x теперь 100
\`\`\`

## Указатели и массивы

\`\`\`cpp
int arr[] = {1, 2, 3, 4, 5};
int* p = arr;     // p указывает на arr[0]

cout << *p;       // 1
cout << *(p + 2); // 3 (арифметика указателей)
p++;              // p теперь указывает на arr[1]
\`\`\`

## Ссылки

\`\`\`cpp
int x = 42;
int& ref = x;    // ref — псевдоним для x

ref = 100;       // x теперь 100
cout << x;       // 100

// Передача по ссылке
void increment(int& n) {
    n++;
}
int a = 5;
increment(a);    // a = 6
\`\`\`

## Передача в функцию

\`\`\`cpp
// По значению — копия (медленно для больших объектов)
void f(vector<int> v) { ... }

// По ссылке — без копирования
void f(vector<int>& v) { v.push_back(1); }

// По константной ссылке — чтение без копирования
void f(const vector<int>& v) { cout << v[0]; }
\`\`\`

## nullptr и динамическая память

\`\`\`cpp
int* ptr = nullptr;  // нулевой указатель

// Динамическое выделение
int* p = new int(42);
delete p;

int* arr = new int[100];
delete[] arr;

// В олимпиадах: используйте vector вместо new/delete!
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Обмен через ссылки',
        description: 'Считайте два числа A и B. Напишите функцию swap(int&, int&), которая обменивает значения. Выведите A и B после обмена.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nvoid mySwap(int& a, int& b) {\n    // Реализуйте обмен\n}\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    mySwap(a, b);\n    cout << a << " " << b << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '3 5', expectedOutput: '5 3', description: '3↔5' },
          { input: '0 0', expectedOutput: '0 0', description: 'Одинаковые' },
          { input: '-1 1', expectedOutput: '1 -1', description: 'Отрицательные' },
        ],
        points: 10,
      },
      {
        title: 'Увеличение через указатель',
        description: 'Считайте число N. Напишите функцию increment(int* p), которая увеличивает значение по указателю на 1. Вызовите её 3 раза и выведите результат.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nvoid increment(int* p) {\n    // Увеличьте значение по указателю на 1\n}\n\nint main() {\n    int n;\n    cin >> n;\n    increment(&n);\n    increment(&n);\n    increment(&n);\n    cout << n << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '8', description: '5 + 3 = 8' },
          { input: '0', expectedOutput: '3', description: '0 + 3 = 3' },
          { input: '-5', expectedOutput: '-2', description: '-5 + 3 = -2' },
        ],
        points: 10,
      },
      {
        title: 'Минимум и максимум через ссылки',
        description: 'Считайте N чисел. Напишите функцию findMinMax(const vector<int>& v, int& mn, int& mx), которая находит минимум и максимум. Выведите min и max через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid findMinMax(const vector<int>& v, int& mn, int& mx) {\n    // Найдите минимум и максимум\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    int mn, mx;\n    findMinMax(v, mn, mx);\n    cout << mn << " " << mx << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 4 1 5', expectedOutput: '1 5', description: 'min=1, max=5' },
          { input: '1\n42', expectedOutput: '42 42', description: 'Один элемент' },
          { input: '4\n-10 -20 -5 -1', expectedOutput: '-20 -1', description: 'Все отрицательные' },
        ],
        points: 15,
      },
      {
        title: 'Арифметика указателей на массиве',
        description: 'Считайте N чисел в массив. Используя только арифметику указателей (без оператора []), вычислите сумму элементов и выведите её.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int* arr = new int[n];\n    // Считайте элементы и найдите сумму через указатели\n    // Используйте *(arr + i) вместо arr[i]\n    delete[] arr;\n    return 0;\n}\n',
        testCases: [
          { input: '4\n1 2 3 4', expectedOutput: '10', description: '1+2+3+4=10' },
          { input: '1\n100', expectedOutput: '100', description: 'Один элемент' },
          { input: '3\n-1 0 1', expectedOutput: '0', description: 'Сумма ноль' },
        ],
        points: 15,
      },
      {
        title: 'Сортировка массива через указатели',
        description: 'Считайте N чисел. Напишите функцию bubbleSort(int* arr, int n), которая сортирует массив пузырьком, используя указатели для доступа. Выведите отсортированный массив.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nvoid bubbleSort(int* arr, int n) {\n    // Реализуйте пузырьковую сортировку через указатели\n    // Используйте *(arr + i) для доступа к элементам\n}\n\nint main() {\n    int n;\n    cin >> n;\n    int* arr = new int[n];\n    for (int i = 0; i < n; i++) cin >> *(arr + i);\n    bubbleSort(arr, n);\n    for (int i = 0; i < n; i++) {\n        if (i > 0) cout << " ";\n        cout << *(arr + i);\n    }\n    cout << endl;\n    delete[] arr;\n    return 0;\n}\n',
        testCases: [
          { input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'Обычная сортировка' },
          { input: '3\n3 2 1', expectedOutput: '1 2 3', description: 'Обратный порядок' },
          { input: '4\n1 1 1 1', expectedOutput: '1 1 1 1', description: 'Одинаковые элементы' },
          { input: '2\n-5 3', expectedOutput: '-5 3', description: 'Отрицательные числа' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 3: Сложность и сортировки
  // ──────────────────────────────────────────
  {
    slug: 'cpp-complexity-sorting',
    title: 'Сложность алгоритмов и сортировки',
    description: 'O-нотация, std::sort, компараторы, stable_sort',
    content: `# Сложность и сортировки

## O-нотация

| Сложность | n=10⁶ | Допустимо? |
|-----------|-------|------------|
| O(n) | 10⁶ | Да |
| O(n log n) | 2·10⁷ | Да |
| O(n²) | 10¹² | Нет! |

## std::sort

\`\`\`cpp
#include <algorithm>

vector<int> a = {5, 3, 1, 4, 2};

// По возрастанию
sort(a.begin(), a.end());

// По убыванию
sort(a.begin(), a.end(), greater<int>());

// Кастомный компаратор
sort(a.begin(), a.end(), [](int x, int y) {
    return abs(x) < abs(y);  // по модулю
});
\`\`\`

## Сортировка структур

\`\`\`cpp
struct Student {
    string name;
    int grade;
};

vector<Student> students;

// По оценке (убывание), при равенстве — по имени
sort(students.begin(), students.end(),
    [](const Student& a, const Student& b) {
        if (a.grade != b.grade) return a.grade > b.grade;
        return a.name < b.name;
    });
\`\`\`

## stable_sort

\`\`\`cpp
// Сохраняет порядок равных элементов
stable_sort(a.begin(), a.end());
\`\`\`

## partial_sort и nth_element

\`\`\`cpp
// Найти k наименьших элементов
partial_sort(a.begin(), a.begin() + k, a.end());

// Найти k-й элемент (медиана за O(n))
nth_element(a.begin(), a.begin() + k, a.end());
// a[k] теперь содержит элемент, который был бы на позиции k
// в отсортированном массиве
\`\`\`

## Merge sort (реализация)

\`\`\`cpp
void mergeSort(vector<int>& a, int l, int r) {
    if (r - l <= 1) return;
    int mid = (l + r) / 2;
    mergeSort(a, l, mid);
    mergeSort(a, mid, r);

    vector<int> temp;
    int i = l, j = mid;
    while (i < mid && j < r) {
        if (a[i] <= a[j]) temp.push_back(a[i++]);
        else temp.push_back(a[j++]);
    }
    while (i < mid) temp.push_back(a[i++]);
    while (j < r) temp.push_back(a[j++]);
    copy(temp.begin(), temp.end(), a.begin() + l);
}
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Кастомная сортировка',
        description: 'Считайте N, затем N пар (имя, балл). Отсортируйте по баллу убыванию, при равенстве — по имени. Выведите имена по одному на строке.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте пары и отсортируйте\n    return 0;\n}\n',
        testCases: [
          { input: '3\nAlice 90\nBob 85\nCharlie 90', expectedOutput: 'Alice\nCharlie\nBob', description: 'Alice и Charlie по 90 (алф.), Bob 85' },
          { input: '2\nZack 100\nAmy 100', expectedOutput: 'Amy\nZack', description: 'Одинаковый балл — по алфавиту' },
          { input: '1\nSolo 50', expectedOutput: 'Solo', description: 'Один ученик' },
        ],
        points: 10,
      },
      {
        title: 'Сортировка по возрастанию',
        description: 'Считайте N целых чисел. Отсортируйте их по возрастанию с помощью std::sort и выведите через пробел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Отсортируйте и выведите\n    return 0;\n}\n',
        testCases: [
          { input: '5\n5 3 1 4 2', expectedOutput: '1 2 3 4 5', description: 'По возрастанию' },
          { input: '3\n-1 -5 3', expectedOutput: '-5 -1 3', description: 'С отрицательными' },
          { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
        ],
        points: 10,
      },
      {
        title: 'Сортировка по модулю',
        description: 'Считайте N целых чисел. Отсортируйте по модулю (абсолютному значению) по возрастанию. При равных модулях сохраните исходный порядок (stable_sort). Выведите через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Стабильная сортировка по модулю\n    return 0;\n}\n',
        testCases: [
          { input: '5\n-3 1 -2 4 -1', expectedOutput: '1 -1 -2 -3 4', description: 'По модулю, стабильная' },
          { input: '4\n5 -5 3 -3', expectedOutput: '3 -3 5 -5', description: 'Пары с одинаковым модулем' },
          { input: '3\n0 -1 1', expectedOutput: '0 -1 1', description: 'С нулём' },
        ],
        points: 15,
      },
      {
        title: 'Медиана массива',
        description: 'Считайте N чисел. Найдите медиану: для нечётного N — средний элемент отсортированного массива, для чётного — меньший из двух средних. Используйте nth_element для O(n).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Найдите медиану через nth_element\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 4 1 5', expectedOutput: '3', description: 'Средний из 5' },
          { input: '4\n1 2 3 4', expectedOutput: '2', description: 'Меньший из двух средних' },
          { input: '1\n7', expectedOutput: '7', description: 'Один элемент' },
        ],
        points: 15,
      },
      {
        title: 'Количество инверсий',
        description: 'Считайте N чисел. Подсчитайте количество инверсий — пар (i, j), где i < j и a[i] > a[j]. Используйте merge sort для O(n log n).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nlong long mergeCount(vector<int>& a, int l, int r) {\n    // Merge sort с подсчётом инверсий\n    if (r - l <= 1) return 0;\n    int mid = (l + r) / 2;\n    long long inv = mergeCount(a, l, mid) + mergeCount(a, mid, r);\n    // Слияние с подсчётом\n    return inv;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    cout << mergeCount(a, 0, n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5\n2 3 8 6 1', expectedOutput: '5', description: '5 инверсий' },
          { input: '3\n3 2 1', expectedOutput: '3', description: 'Полностью обратный' },
          { input: '4\n1 2 3 4', expectedOutput: '0', description: 'Уже отсортирован' },
          { input: '2\n2 1', expectedOutput: '1', description: 'Одна инверсия' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 4: STL контейнеры: set и map
  // ──────────────────────────────────────────
  {
    slug: 'stl-set-map',
    title: 'STL: set, multiset, map',
    description: 'Упорядоченные контейнеры, lower_bound, итераторы',
    content: `# STL: set, multiset, map

## set — упорядоченное множество

\`\`\`cpp
#include <set>

set<int> s;
s.insert(5);
s.insert(3);
s.insert(5);  // дубликат не добавится
// s = {3, 5}

s.erase(3);
s.count(5);          // 1 (есть) или 0 (нет)
s.find(5);           // итератор на 5

*s.begin();          // минимум: 3
*s.rbegin();         // максимум: 5

// lower_bound и upper_bound
auto it = s.lower_bound(4);  // первый >= 4 → указывает на 5
\`\`\`

## multiset — множество с повторами

\`\`\`cpp
multiset<int> ms;
ms.insert(5);
ms.insert(5);
ms.insert(3);
// ms = {3, 5, 5}

ms.count(5);           // 2
ms.erase(ms.find(5));  // удалить ОДНО вхождение 5
// ms = {3, 5}
ms.erase(5);           // удалить ВСЕ вхождения 5
\`\`\`

## map — словарь

\`\`\`cpp
#include <map>

map<string, int> grades;
grades["Alice"] = 95;
grades["Bob"] = 87;

// Проверка наличия
if (grades.count("Alice"))
    cout << grades["Alice"];

// Перебор (отсортирован по ключу)
for (auto& [name, grade] : grades)
    cout << name << ": " << grade << endl;

// erase
grades.erase("Bob");
\`\`\`

## unordered_set и unordered_map

\`\`\`cpp
#include <unordered_set>
#include <unordered_map>

// O(1) в среднем вместо O(log n)
unordered_set<int> us;
unordered_map<string, int> um;

// Нет упорядоченности!
// Нет lower_bound / upper_bound!
\`\`\`

## Задача: количество уникальных элементов

\`\`\`cpp
int n;
cin >> n;
set<int> unique_nums;
for (int i = 0; i < n; i++) {
    int x; cin >> x;
    unique_nums.insert(x);
}
cout << unique_nums.size();
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Частотный словарь',
        description: 'Считайте N слов. Для каждого уникального слова выведите количество вхождений, отсортировав по алфавиту.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте частоты слов\n    return 0;\n}\n',
        testCases: [
          { input: '5\napple banana apple cherry banana', expectedOutput: 'apple 2\nbanana 2\ncherry 1', description: 'Частоты по алфавиту' },
          { input: '3\naa aa aa', expectedOutput: 'aa 3', description: 'Одно слово' },
          { input: '4\ndog cat bird ant', expectedOutput: 'ant 1\nbird 1\ncat 1\ndog 1', description: 'Все уникальны' },
        ],
        points: 10,
      },
      {
        title: 'Количество уникальных',
        description: 'Считайте N целых чисел. Выведите количество уникальных чисел. Используйте set.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    set<int> s;\n    // Считайте числа и добавьте в set\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1 2 3 2 1 4 3', expectedOutput: '4', description: '4 уникальных: 1,2,3,4' },
          { input: '5\n5 5 5 5 5', expectedOutput: '1', description: 'Все одинаковые' },
          { input: '3\n10 20 30', expectedOutput: '3', description: 'Все разные' },
        ],
        points: 10,
      },
      {
        title: 'Пересечение множеств',
        description: 'Считайте N чисел первого множества и M чисел второго. Выведите числа, которые есть в обоих множествах, в порядке возрастания.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n;\n    set<int> a;\n    for (int i = 0; i < n; i++) { int x; cin >> x; a.insert(x); }\n    cin >> m;\n    // Найдите пересечение с вторым множеством\n    return 0;\n}\n',
        testCases: [
          { input: '4\n1 2 3 4\n3\n3 4 5', expectedOutput: '3 4', description: 'Пересечение {3,4}' },
          { input: '3\n1 2 3\n3\n4 5 6', expectedOutput: '', description: 'Нет общих' },
          { input: '2\n5 10\n2\n10 5', expectedOutput: '5 10', description: 'Полное совпадение' },
        ],
        points: 15,
      },
      {
        title: 'Второй по частоте элемент',
        description: 'Считайте N чисел. Выведите элемент, который встречается вторым по частоте. Если таких несколько — выведите наименьший. Гарантируется, что существуют как минимум 2 различных частоты.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <map>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    map<int,int> freq;\n    // Считайте числа, подсчитайте частоты\n    // Найдите второй по частоте элемент\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1 1 1 2 2 3 3', expectedOutput: '2', description: '1 встречается 3 раза, 2 и 3 — по 2, ответ 2 (наименьший)' },
          { input: '5\n5 5 3 3 1', expectedOutput: '3', description: '5 — 2 раза, 3 — 2 раза, 1 — 1 раз; второй по частоте = 1 раз, ответ 1... нет: 5 и 3 по 2, 1 по 1, второй = 1' },
          { input: '6\n1 2 2 3 3 3', expectedOutput: '2', description: '3 — 3 раза, 2 — 2 раза' },
        ],
        points: 15,
      },
      {
        title: 'Объединение словарей',
        description: 'Считайте N пар (ключ значение) и M пар (ключ значение). Объедините два map: если ключ есть в обоих, сложите значения. Выведите итоговый словарь по алфавиту: ключ сумма.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n, m;\n    map<string, int> result;\n    cin >> n;\n    // Считайте первый словарь\n    cin >> m;\n    // Считайте второй словарь и объедините\n    // Выведите результат\n    return 0;\n}\n',
        testCases: [
          { input: '2\nalpha 10\nbeta 20\n2\nbeta 5\ngamma 15', expectedOutput: 'alpha 10\nbeta 25\ngamma 15', description: 'beta: 20+5=25' },
          { input: '1\nx 100\n1\ny 200', expectedOutput: 'x 100\ny 200', description: 'Нет пересечений' },
          { input: '2\na 1\nb 2\n2\na 3\nb 4', expectedOutput: 'a 4\nb 6', description: 'Полное пересечение: 1+3=4, 2+4=6' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 5: STL: queue, stack, priority_queue
  // ──────────────────────────────────────────
  {
    slug: 'stl-queue-stack',
    title: 'STL: стек, очередь, приоритетная очередь',
    description: 'stack, queue, deque, priority_queue, применения',
    content: `# STL: стек, очередь, приоритетная очередь

## stack

\`\`\`cpp
#include <stack>

stack<int> st;
st.push(1);
st.push(2);
st.push(3);
st.top();   // 3
st.pop();   // удалить 3
st.size();  // 2
st.empty(); // false
\`\`\`

## queue

\`\`\`cpp
#include <queue>

queue<int> q;
q.push(1);
q.push(2);
q.front();  // 1
q.back();   // 2
q.pop();    // удалить 1
\`\`\`

## deque — двусторонняя очередь

\`\`\`cpp
#include <deque>

deque<int> dq;
dq.push_front(1);
dq.push_back(2);
dq.front();      // 1
dq.back();       // 2
dq.pop_front();
dq.pop_back();
dq[0];           // доступ по индексу O(1)!
\`\`\`

## priority_queue — куча

\`\`\`cpp
#include <queue>

// Max-heap (по умолчанию)
priority_queue<int> pq;
pq.push(5);
pq.push(3);
pq.push(8);
pq.top();  // 8 (максимум)
pq.pop();

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(5);
minPQ.push(3);
minPQ.top();  // 3 (минимум)

// Пары
priority_queue<pair<int,int>,
               vector<pair<int,int>>,
               greater<pair<int,int>>> pq2;
\`\`\`

## Задача: проверка скобок

\`\`\`cpp
bool isValid(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{')
            st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return st.empty();
}
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Проверка скобок (C++)',
        description: 'Считайте строку из скобок ()[]{}. Выведите YES если правильная, NO иначе.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте скобки\n    return 0;\n}\n',
        testCases: [
          { input: '({[]})', expectedOutput: 'YES', description: 'Правильная' },
          { input: '([)]', expectedOutput: 'NO', description: 'Неправильная' },
          { input: '', expectedOutput: 'YES', description: 'Пустая' },
        ],
        points: 10,
      },
      {
        title: 'Обратная польская запись',
        description: 'Считайте выражение в обратной польской записи (числа и операторы + - * через пробел). Вычислите и выведите результат. Используйте stack.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <stack>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    stack<int> st;\n    string token;\n    // Обработайте каждый токен\n    while (iss >> token) {\n        // Если число — push, если оператор — вычислите\n    }\n    cout << st.top() << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '3 4 +', expectedOutput: '7', description: '3 + 4 = 7' },
          { input: '5 1 2 + 4 * + 3 -', expectedOutput: '14', description: '5 + (1+2)*4 - 3 = 14' },
          { input: '2 3 *', expectedOutput: '6', description: '2 * 3 = 6' },
        ],
        points: 10,
      },
      {
        title: 'Очередь команд',
        description: 'Считайте N команд: PUSH x (добавить в очередь), POP (удалить из очереди и вывести), FRONT (вывести первый элемент). Используйте queue.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <queue>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    queue<int> q;\n    // Обработайте команды\n    return 0;\n}\n',
        testCases: [
          { input: '5\nPUSH 1\nPUSH 2\nFRONT\nPOP\nFRONT', expectedOutput: '1\n1\n2', description: 'FIFO порядок' },
          { input: '3\nPUSH 42\nFRONT\nPOP', expectedOutput: '42\n42', description: 'Один элемент' },
          { input: '4\nPUSH 10\nPUSH 20\nPOP\nPOP', expectedOutput: '10\n20', description: 'Два элемента в порядке FIFO' },
        ],
        points: 15,
      },
      {
        title: 'K наибольших элементов',
        description: 'Считайте N чисел и K. Выведите K наибольших элементов в порядке убывания. Используйте priority_queue.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Считайте числа, найдите K наибольших\n    return 0;\n}\n',
        testCases: [
          { input: '7 3\n3 1 4 1 5 9 2', expectedOutput: '9 5 4', description: 'Три наибольших' },
          { input: '5 1\n10 20 30 40 50', expectedOutput: '50', description: 'Один наибольший' },
          { input: '4 4\n4 3 2 1', expectedOutput: '4 3 2 1', description: 'Все элементы' },
        ],
        points: 15,
      },
      {
        title: 'Минимум в стеке за O(1)',
        description: 'Реализуйте стек, поддерживающий операции: PUSH x, POP, MIN (вывести текущий минимум). Все операции за O(1). Считайте N операций.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    stack<int> st;      // основной стек\n    stack<int> minSt;   // стек минимумов\n    // Обработайте операции\n    return 0;\n}\n',
        testCases: [
          { input: '7\nPUSH 3\nPUSH 1\nMIN\nPOP\nMIN\nPUSH 2\nMIN', expectedOutput: '1\n3\n2', description: 'Минимум обновляется' },
          { input: '4\nPUSH 5\nPUSH 5\nPOP\nMIN', expectedOutput: '5', description: 'Одинаковые элементы' },
          { input: '5\nPUSH 10\nPUSH 20\nPUSH 5\nMIN\nPOP', expectedOutput: '5', description: 'Min после push нескольких' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 6: Рекурсия и разделяй-и-властвуй
  // ──────────────────────────────────────────
  {
    slug: 'cpp-recursion-divide',
    title: 'Рекурсия и разделяй-и-властвуй',
    description: 'Рекурсия в C++, перестановки, подмножества, быстрое возведение',
    content: `# Рекурсия и разделяй-и-властвуй

## Быстрое возведение в степень

\`\`\`cpp
long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
\`\`\`

## Генерация перестановок

\`\`\`cpp
void permutations(vector<int>& arr, int start) {
    if (start == arr.size() - 1) {
        for (int x : arr) cout << x << " ";
        cout << endl;
        return;
    }
    for (int i = start; i < arr.size(); i++) {
        swap(arr[start], arr[i]);
        permutations(arr, start + 1);
        swap(arr[start], arr[i]);
    }
}
\`\`\`

## Генерация подмножеств

\`\`\`cpp
void subsets(vector<int>& arr, int index, vector<int>& current) {
    if (index == arr.size()) {
        for (int x : current) cout << x << " ";
        cout << endl;
        return;
    }
    subsets(arr, index + 1, current);
    current.push_back(arr[index]);
    subsets(arr, index + 1, current);
    current.pop_back();
}
\`\`\`

## Merge sort с подсчётом инверсий

\`\`\`cpp
long long mergeCount(vector<int>& a, int l, int r) {
    if (r - l <= 1) return 0;
    int mid = (l + r) / 2;
    long long inv = mergeCount(a, l, mid) + mergeCount(a, mid, r);

    vector<int> temp;
    int i = l, j = mid;
    while (i < mid && j < r) {
        if (a[i] <= a[j]) temp.push_back(a[i++]);
        else {
            temp.push_back(a[j++]);
            inv += mid - i;
        }
    }
    while (i < mid) temp.push_back(a[i++]);
    while (j < r) temp.push_back(a[j++]);
    copy(temp.begin(), temp.end(), a.begin() + l);
    return inv;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Быстрое возведение в степень (C++)',
        description: 'Считайте base, exp, mod. Вычислите base^exp mod mod.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long base, exp, mod;\n    cin >> base >> exp >> mod;\n    // Быстрое возведение\n    return 0;\n}\n',
        testCases: [
          { input: '2 10 1000', expectedOutput: '24', description: '2^10 mod 1000 = 24' },
          { input: '3 100 1000000007', expectedOutput: '515377520', description: 'Большой показатель' },
          { input: '5 0 7', expectedOutput: '1', description: 'n^0 = 1' },
        ],
        points: 10,
      },
      {
        title: 'Факториал рекурсивно',
        description: 'Считайте число N (0 <= N <= 20). Вычислите N! рекурсивно и выведите результат.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Рекурсивный факториал\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '120', description: '5! = 120' },
          { input: '0', expectedOutput: '1', description: '0! = 1' },
          { input: '10', expectedOutput: '3628800', description: '10! = 3628800' },
        ],
        points: 10,
      },
      {
        title: 'Число перестановок',
        description: 'Считайте N (N <= 8). Выведите все перестановки чисел от 1 до N в лексикографическом порядке, каждую на новой строке. Числа через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid permute(vector<int>& arr, int start) {\n    // Генерация перестановок\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) arr[i] = i + 1;\n    // Выведите все перестановки\n    return 0;\n}\n',
        testCases: [
          { input: '2', expectedOutput: '1 2\n2 1', description: 'Две перестановки' },
          { input: '3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', description: '6 перестановок' },
          { input: '1', expectedOutput: '1', description: 'Одна перестановка' },
        ],
        points: 15,
      },
      {
        title: 'Сумма подмножеств',
        description: 'Считайте N чисел и целевую сумму S. Выведите YES, если существует подмножество с суммой S, иначе NO. Используйте рекурсивный перебор.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nbool subsetSum(vector<int>& a, int idx, int target) {\n    // Рекурсивный перебор подмножеств\n}\n\nint main() {\n    int n, s;\n    cin >> n >> s;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    cout << (subsetSum(a, 0, s) ? "YES" : "NO") << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '4 9\n3 7 1 8', expectedOutput: 'YES', description: '1 + 8 = 9' },
          { input: '3 10\n1 2 3', expectedOutput: 'NO', description: 'Макс сумма 6 < 10' },
          { input: '5 15\n5 5 5 5 5', expectedOutput: 'YES', description: '5+5+5 = 15' },
        ],
        points: 15,
      },
      {
        title: 'Ханойские башни',
        description: 'Считайте N — количество дисков. Выведите последовательность ходов для перемещения N дисков с колышка A на C через B. Формат: "A -> C". В последней строке выведите общее количество ходов.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint cnt = 0;\n\nvoid hanoi(int n, char from, char to, char aux) {\n    // Рекурсивное решение Ханойских башен\n}\n\nint main() {\n    int n;\n    cin >> n;\n    hanoi(n, \'A\', \'C\', \'B\');\n    cout << cnt << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '1', expectedOutput: 'A -> C\n1', description: '1 ход' },
          { input: '2', expectedOutput: 'A -> B\nA -> C\nB -> C\n3', description: '3 хода' },
          { input: '3', expectedOutput: 'A -> C\nA -> B\nC -> B\nA -> C\nB -> A\nB -> C\nA -> C\n7', description: '7 ходов' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 7: Динамическое программирование
  // ──────────────────────────────────────────
  {
    slug: 'cpp-dp-basics',
    title: 'Динамическое программирование на C++',
    description: 'Фибоначчи, лестница, рюкзак, НВП',
    content: `# Динамическое программирование на C++

## Фибоначчи

\`\`\`cpp
long long fib(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}
\`\`\`

## Лестница

\`\`\`cpp
int climbStairs(int n, int k) {
    vector<long long> dp(n + 1, 0);
    dp[0] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= min(i, k); j++)
            dp[i] += dp[i - j];
    return dp[n];
}
\`\`\`

## Рюкзак 0/1

\`\`\`cpp
int knapsack(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++)
        for (int j = W; j >= w[i]; j--)
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
    return dp[W];
}
\`\`\`

## НВП (O(n log n))

\`\`\`cpp
int lis(vector<int>& a) {
    vector<int> tails;
    for (int x : a) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end())
            tails.push_back(x);
        else
            *it = x;
    }
    return tails.size();
}
\`\`\`

## НОП (Наибольшая общая подпоследовательность)

\`\`\`cpp
int lcs(const string& s1, const string& s2) {
    int n = s1.length(), m = s2.length();
    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    return dp[n][m];
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Рюкзак 0/1 (C++)',
        description: 'Считайте N и W, затем N пар (вес, стоимость). Выведите макс. стоимость.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, W;\n    cin >> n >> W;\n    // Решите задачу рюкзака\n    return 0;\n}\n',
        testCases: [
          { input: '4 8\n2 3\n3 4\n4 5\n5 6', expectedOutput: '10', description: 'Макс стоимость при весе 8' },
          { input: '1 10\n5 100', expectedOutput: '100', description: 'Один предмет' },
          { input: '3 5\n3 10\n4 15\n2 7', expectedOutput: '17', description: '10+7=17, вес 3+2=5' },
        ],
        points: 10,
      },
      {
        title: 'Числа Фибоначчи',
        description: 'Считайте N. Выведите N-е число Фибоначчи (F(0)=0, F(1)=1). Используйте итеративный подход с O(1) памяти.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Вычислите n-е число Фибоначчи\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '55', description: 'F(10) = 55' },
          { input: '0', expectedOutput: '0', description: 'F(0) = 0' },
          { input: '1', expectedOutput: '1', description: 'F(1) = 1' },
        ],
        points: 10,
      },
      {
        title: 'Лестница с шагами',
        description: 'Считайте N (количество ступеней) и K (макс. шаг). Выведите количество способов подняться на N-ю ступень, если за раз можно перешагнуть от 1 до K ступеней.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // DP для лестницы\n    return 0;\n}\n',
        testCases: [
          { input: '4 2', expectedOutput: '5', description: '5 способов: 1111, 112, 121, 211, 22' },
          { input: '3 3', expectedOutput: '4', description: '4 способа' },
          { input: '1 1', expectedOutput: '1', description: 'Один шаг' },
        ],
        points: 15,
      },
      {
        title: 'Наибольшая возрастающая подпоследовательность',
        description: 'Считайте N чисел. Найдите длину наибольшей строго возрастающей подпоследовательности (НВП). Используйте алгоритм за O(n log n) с lower_bound.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // НВП за O(n log n)\n    return 0;\n}\n',
        testCases: [
          { input: '6\n10 9 2 5 3 7', expectedOutput: '3', description: '2, 5, 7 или 2, 3, 7' },
          { input: '5\n1 2 3 4 5', expectedOutput: '5', description: 'Уже возрастающая' },
          { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — НВП длины 1' },
        ],
        points: 15,
      },
      {
        title: 'Наибольшая общая подпоследовательность',
        description: 'Считайте две строки S1 и S2. Выведите длину их наибольшей общей подпоследовательности (НОП).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n    // DP для НОП\n    return 0;\n}\n',
        testCases: [
          { input: 'abcde\nace', expectedOutput: '3', description: 'НОП: ace' },
          { input: 'abc\ndef', expectedOutput: '0', description: 'Нет общих символов' },
          { input: 'abcdef\nabcdef', expectedOutput: '6', description: 'Строки одинаковые' },
          { input: 'abcd\nabdc', expectedOutput: '3', description: 'НОП: abd или abc' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 8: DP — продвинутые задачи
  // ──────────────────────────────────────────
  {
    slug: 'cpp-dp-advanced',
    title: 'DP: пути в таблице, монеты, разбиения',
    description: 'DP на сетке, задача размена, восстановление ответа',
    content: `# DP: продвинутые задачи

## Пути в таблице

\`\`\`cpp
long long countPaths(int n, int m) {
    vector<vector<long long>> dp(n + 1, vector<long long>(m + 1, 0));
    dp[1][1] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (i == 1 && j == 1) continue;
            dp[i][j] = (i > 1 ? dp[i-1][j] : 0) + (j > 1 ? dp[i][j-1] : 0);
        }
    return dp[n][m];
}
\`\`\`

## Путь с максимальной суммой

\`\`\`cpp
int maxPathSum(vector<vector<int>>& grid) {
    int n = grid.size(), m = grid[0].size();
    vector<vector<int>> dp(n, vector<int>(m, 0));
    dp[0][0] = grid[0][0];

    for (int i = 1; i < n; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int j = 1; j < m; j++) dp[0][j] = dp[0][j-1] + grid[0][j];

    for (int i = 1; i < n; i++)
        for (int j = 1; j < m; j++)
            dp[i][j] = max(dp[i-1][j], dp[i][j-1]) + grid[i][j];

    return dp[n-1][m-1];
}
\`\`\`

## Минимум монет (с восстановлением)

\`\`\`cpp
vector<int> minCoins(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    vector<int> parent(amount + 1, -1);
    dp[0] = 0;

    for (int i = 1; i <= amount; i++)
        for (int c : coins)
            if (c <= i && dp[i - c] != INT_MAX && dp[i - c] + 1 < dp[i]) {
                dp[i] = dp[i - c] + 1;
                parent[i] = c;
            }

    // Восстановление ответа
    vector<int> result;
    int cur = amount;
    while (cur > 0) {
        result.push_back(parent[cur]);
        cur -= parent[cur];
    }
    return result;
}
\`\`\`

## DP на подмножествах (bitmask DP)

\`\`\`cpp
// Задача коммивояжёра — O(2^n * n²)
int tsp(vector<vector<int>>& dist, int n) {
    int INF = 1e9;
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0; // начинаем из вершины 0

    for (int mask = 1; mask < (1 << n); mask++)
        for (int v = 0; v < n; v++) {
            if (!(mask & (1 << v))) continue;
            if (dp[mask][v] == INF) continue;
            for (int u = 0; u < n; u++) {
                if (mask & (1 << u)) continue;
                int newMask = mask | (1 << u);
                dp[newMask][u] = min(dp[newMask][u],
                    dp[mask][v] + dist[v][u]);
            }
        }

    int ans = INF;
    int full = (1 << n) - 1;
    for (int v = 0; v < n; v++)
        ans = min(ans, dp[full][v] + dist[v][0]);
    return ans;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Количество путей в таблице',
        description: 'Считайте N и M. Выведите количество путей из (1,1) в (N,M), если можно двигаться только вправо или вниз.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Подсчитайте количество путей\n    return 0;\n}\n',
        testCases: [
          { input: '3 3', expectedOutput: '6', description: '6 путей в таблице 3×3' },
          { input: '2 2', expectedOutput: '2', description: '2 пути: →↓ и ↓→' },
          { input: '1 5', expectedOutput: '1', description: 'Только вправо' },
        ],
        points: 10,
      },
      {
        title: 'Максимальный путь в таблице',
        description: 'Считайте N и M, затем таблицу N×M. Найдите путь из (1,1) в (N,M) (вправо или вниз) с максимальной суммой. Выведите эту сумму.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> grid(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) cin >> grid[i][j];\n    // DP для максимального пути\n    return 0;\n}\n',
        testCases: [
          { input: '3 3\n1 3 1\n1 5 1\n4 2 1', expectedOutput: '12', description: '1+3+5+2+1=12 или 1+1+5+2+1... max=12' },
          { input: '2 2\n1 2\n3 4', expectedOutput: '8', description: '1+3+4=8' },
          { input: '1 3\n5 10 3', expectedOutput: '18', description: 'Одна строка: 5+10+3' },
        ],
        points: 10,
      },
      {
        title: 'Размен монет',
        description: 'Считайте N (количество номиналов), затем N номиналов, затем сумму S. Выведите минимальное количество монет для размена S. Если невозможно — выведите -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> coins(n);\n    for (int i = 0; i < n; i++) cin >> coins[i];\n    int s;\n    cin >> s;\n    // DP для минимального размена\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1 5 10\n27', expectedOutput: '5', description: '10+10+5+1+1 = 5 монет' },
          { input: '2\n3 5\n7', expectedOutput: '-1', description: 'Невозможно разменять 7' },
          { input: '1\n1\n0', expectedOutput: '0', description: 'Ноль монет для суммы 0' },
        ],
        points: 15,
      },
      {
        title: 'Пути в таблице с препятствиями',
        description: 'Считайте N и M, затем таблицу N×M (0 — свободная клетка, 1 — препятствие). Выведите количество путей из (1,1) в (N,M), двигаясь только вправо или вниз.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> grid(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) cin >> grid[i][j];\n    // DP с учётом препятствий\n    return 0;\n}\n',
        testCases: [
          { input: '3 3\n0 0 0\n0 1 0\n0 0 0', expectedOutput: '2', description: 'Препятствие в центре — 2 пути' },
          { input: '2 2\n0 0\n0 0', expectedOutput: '2', description: 'Без препятствий' },
          { input: '2 2\n0 1\n1 0', expectedOutput: '0', description: 'Путь заблокирован' },
        ],
        points: 15,
      },
      {
        title: 'Bitmask DP: Задача о назначениях',
        description: 'Считайте N (N <= 15), затем матрицу N×N стоимостей. Назначьте каждому работнику ровно одну задачу (биекция). Выведите минимальную суммарную стоимость. Используйте bitmask DP.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<vector<int>> cost(n, vector<int>(n));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < n; j++) cin >> cost[i][j];\n    // Bitmask DP: dp[mask] — мин стоимость назначения\n    // mask — множество уже назначенных задач\n    return 0;\n}\n',
        testCases: [
          { input: '3\n9 2 7\n6 4 3\n5 8 1', expectedOutput: '7', description: '2+3+... мин=2+4+1=7' },
          { input: '2\n1 10\n10 1', expectedOutput: '2', description: '1+1=2' },
          { input: '1\n5', expectedOutput: '5', description: 'Одна задача' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 9: Графы — BFS и DFS
  // ──────────────────────────────────────────
  {
    slug: 'cpp-graphs-bfs-dfs',
    title: 'Графы: BFS и DFS на C++',
    description: 'Списки смежности, обходы графов, компоненты связности',
    content: `# Графы: BFS и DFS

## Список смежности

\`\`\`cpp
int n, m;
cin >> n >> m;
vector<vector<int>> g(n + 1);
for (int i = 0; i < m; i++) {
    int u, v;
    cin >> u >> v;
    g[u].push_back(v);
    g[v].push_back(u);
}
\`\`\`

## BFS

\`\`\`cpp
vector<int> bfs(vector<vector<int>>& g, int start, int n) {
    vector<int> dist(n + 1, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : g[v])
            if (dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
    }
    return dist;
}
\`\`\`

## DFS

\`\`\`cpp
vector<bool> visited;

void dfs(vector<vector<int>>& g, int v) {
    visited[v] = true;
    for (int u : g[v])
        if (!visited[u])
            dfs(g, u);
}

int countComponents(vector<vector<int>>& g, int n) {
    visited.assign(n + 1, false);
    int cnt = 0;
    for (int v = 1; v <= n; v++)
        if (!visited[v]) {
            dfs(g, v);
            cnt++;
        }
    return cnt;
}
\`\`\`

## Поиск цикла

\`\`\`cpp
enum Color { WHITE, GRAY, BLACK };

bool hasCycleDFS(vector<vector<int>>& g, int v,
                 vector<Color>& color) {
    color[v] = GRAY;
    for (int u : g[v]) {
        if (color[u] == GRAY) return true;
        if (color[u] == WHITE && hasCycleDFS(g, u, color))
            return true;
    }
    color[v] = BLACK;
    return false;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Кратчайший путь BFS (C++)',
        description: 'Считайте N, M, S, T и M рёбер. Выведите длину кратчайшего пути из S в T. Если нет — -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    // BFS из s\n    return 0;\n}\n',
        testCases: [
          { input: '5 4 1 5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: '1->2->3->4->5' },
          { input: '4 3 1 4\n1 2\n2 3\n1 3', expectedOutput: '-1', description: 'Нет пути' },
          { input: '3 2 1 3\n1 2\n2 3', expectedOutput: '2', description: '1->2->3' },
        ],
        points: 10,
      },
      {
        title: 'Компоненты связности',
        description: 'Считайте N вершин и M рёбер неориентированного графа. Выведите количество компонент связности.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> g;\nvector<bool> visited;\n\nvoid dfs(int v) {\n    // Обход в глубину\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    g.resize(n + 1);\n    visited.assign(n + 1, false);\n    // Считайте рёбра и подсчитайте компоненты\n    return 0;\n}\n',
        testCases: [
          { input: '6 3\n1 2\n3 4\n5 6', expectedOutput: '3', description: 'Три компоненты: {1,2}, {3,4}, {5,6}' },
          { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1', description: 'Все связаны' },
          { input: '3 0', expectedOutput: '3', description: 'Нет рёбер — 3 компоненты' },
        ],
        points: 10,
      },
      {
        title: 'Проверка двудольности',
        description: 'Считайте N вершин и M рёбер неориентированного графа. Выведите YES, если граф двудольный, NO иначе. Используйте BFS с раскраской.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> g(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v; cin >> u >> v;\n        g[u].push_back(v);\n        g[v].push_back(u);\n    }\n    // BFS с раскраской в 2 цвета\n    return 0;\n}\n',
        testCases: [
          { input: '4 4\n1 2\n2 3\n3 4\n4 1', expectedOutput: 'YES', description: 'Цикл длины 4 — двудольный' },
          { input: '3 3\n1 2\n2 3\n3 1', expectedOutput: 'NO', description: 'Треугольник — не двудольный' },
          { input: '2 1\n1 2', expectedOutput: 'YES', description: 'Одно ребро — двудольный' },
        ],
        points: 15,
      },
      {
        title: 'Обнаружение цикла в ориентированном графе',
        description: 'Считайте N вершин и M ориентированных рёбер. Выведите YES, если граф содержит цикл, NO иначе. Используйте DFS с тремя цветами.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nenum Color { WHITE, GRAY, BLACK };\nvector<vector<int>> g;\nvector<Color> color;\n\nbool dfs(int v) {\n    // DFS с тремя цветами для обнаружения цикла\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    g.resize(n + 1);\n    color.assign(n + 1, WHITE);\n    // Считайте рёбра и проверьте наличие цикла\n    return 0;\n}\n',
        testCases: [
          { input: '3 3\n1 2\n2 3\n3 1', expectedOutput: 'YES', description: 'Цикл 1->2->3->1' },
          { input: '3 2\n1 2\n2 3', expectedOutput: 'NO', description: 'DAG без цикла' },
          { input: '4 4\n1 2\n2 3\n3 4\n4 2', expectedOutput: 'YES', description: 'Цикл 2->3->4->2' },
        ],
        points: 15,
      },
      {
        title: 'Топологическая сортировка',
        description: 'Считайте N вершин и M ориентированных рёбер DAG. Выведите вершины в топологическом порядке. Если несколько ответов — выведите лексикографически наименьший.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<vector<int>> g(n + 1);\n    vector<int> indeg(n + 1, 0);\n    // Считайте рёбра, постройте граф\n    // Алгоритм Кана с priority_queue для лексикографического порядка\n    return 0;\n}\n',
        testCases: [
          { input: '4 4\n1 2\n1 3\n2 4\n3 4', expectedOutput: '1 2 3 4', description: 'Линейный порядок' },
          { input: '3 2\n3 1\n3 2', expectedOutput: '3 1 2', description: '3 первый, затем 1 и 2' },
          { input: '4 3\n2 1\n3 1\n4 1', expectedOutput: '2 3 4 1', description: '1 зависит от 2, 3, 4' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 10: Графы — Дейкстра
  // ──────────────────────────────────────────
  {
    slug: 'cpp-graphs-dijkstra',
    title: 'Графы: алгоритм Дейкстры',
    description: 'Кратчайшие пути во взвешенном графе, priority_queue',
    content: `# Алгоритм Дейкстры

## Реализация с priority_queue

\`\`\`cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<long long, int> pli;

vector<long long> dijkstra(vector<vector<pair<int,int>>>& g,
                           int start, int n) {
    vector<long long> dist(n + 1, LLONG_MAX);
    priority_queue<pli, vector<pli>, greater<pli>> pq;

    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;

        for (auto [w, u] : g[v]) {
            if (dist[v] + w < dist[u]) {
                dist[u] = dist[v] + w;
                pq.push({dist[u], u});
            }
        }
    }
    return dist;
}

int main() {
    int n, m, s;
    cin >> n >> m >> s;

    vector<vector<pair<int,int>>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        g[u].push_back({w, v});
        g[v].push_back({w, u});
    }

    auto dist = dijkstra(g, s, n);
    for (int i = 1; i <= n; i++)
        cout << (dist[i] == LLONG_MAX ? -1 : dist[i]) << " ";

    return 0;
}
\`\`\`

## Восстановление пути

\`\`\`cpp
vector<int> parent(n + 1, -1);

// В алгоритме Дейкстры добавить:
if (dist[v] + w < dist[u]) {
    dist[u] = dist[v] + w;
    parent[u] = v;
    pq.push({dist[u], u});
}

// Восстановление пути
vector<int> getPath(int target) {
    vector<int> path;
    for (int v = target; v != -1; v = parent[v])
        path.push_back(v);
    reverse(path.begin(), path.end());
    return path;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Дейкстра (C++)',
        description: 'Считайте N, M, S. Затем M рёбер (u v w). Выведите кратчайшие расстояния от S до всех вершин (-1 если недостижима).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, s;\n    cin >> n >> m >> s;\n    // Алгоритм Дейкстры\n    return 0;\n}\n',
        testCases: [
          { input: '4 5 1\n1 2 1\n1 3 4\n2 3 2\n2 4 6\n3 4 3', expectedOutput: '0 1 3 6', description: 'Кратчайшие расстояния от 1' },
          { input: '3 2 1\n1 2 5\n2 3 3', expectedOutput: '0 5 8', description: 'Линейный граф' },
          { input: '2 0 1', expectedOutput: '0 -1', description: 'Нет рёбер' },
        ],
        points: 10,
      },
      {
        title: 'Минимальное расстояние',
        description: 'Считайте N, M, S, T и M взвешенных рёбер. Выведите длину кратчайшего пути из S в T. Если пути нет — выведите -1.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    vector<vector<pair<int,int>>> g(n + 1);\n    for (int i = 0; i < m; i++) {\n        int u, v, w; cin >> u >> v >> w;\n        g[u].push_back({w, v});\n        g[v].push_back({w, u});\n    }\n    // Дейкстра от s, выведите dist[t]\n    return 0;\n}\n',
        testCases: [
          { input: '3 3 1 3\n1 2 2\n2 3 3\n1 3 10', expectedOutput: '5', description: '1->2->3 = 2+3 = 5' },
          { input: '2 1 1 2\n1 2 7', expectedOutput: '7', description: 'Одно ребро' },
          { input: '3 1 1 3\n1 2 5', expectedOutput: '-1', description: 'Нет пути до 3' },
        ],
        points: 10,
      },
      {
        title: 'Восстановление кратчайшего пути',
        description: 'Считайте N, M, S, T и M взвешенных рёбер. Выведите вершины кратчайшего пути из S в T. Если пути нет — выведите -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    vector<vector<pair<int,int>>> g(n + 1);\n    vector<int> parent(n + 1, -1);\n    // Считайте рёбра, запустите Дейкстру с parent\n    // Восстановите и выведите путь\n    return 0;\n}\n',
        testCases: [
          { input: '4 4 1 4\n1 2 1\n2 3 1\n3 4 1\n1 4 10', expectedOutput: '1 2 3 4', description: 'Путь через промежуточные вершины' },
          { input: '2 1 1 2\n1 2 5', expectedOutput: '1 2', description: 'Прямое ребро' },
          { input: '3 1 1 3\n1 2 1', expectedOutput: '-1', description: 'Нет пути' },
        ],
        points: 15,
      },
      {
        title: 'Второй кратчайший путь',
        description: 'Считайте N, M, S, T и M взвешенных рёбер. Выведите длину второго кратчайшего пути из S в T (строго больше первого). Если нет — выведите -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    vector<vector<pair<int,int>>> g(n + 1);\n    // Считайте рёбра\n    // Модифицированная Дейкстра: храните 2 кратчайших расстояния\n    return 0;\n}\n',
        testCases: [
          { input: '4 5 1 4\n1 2 1\n2 4 3\n1 3 2\n3 4 2\n2 3 1', expectedOutput: '5', description: 'Первый=4 (1->2->3->4), второй=5 (1->3->4)' },
          { input: '2 1 1 2\n1 2 5', expectedOutput: '-1', description: 'Только один путь' },
          { input: '3 3 1 3\n1 2 1\n2 3 1\n1 3 3', expectedOutput: '3', description: 'Первый=2, второй=3' },
        ],
        points: 15,
      },
      {
        title: 'Кратчайшие пути от нескольких источников',
        description: 'Считайте N, M и K источников. Затем K номеров вершин-источников и M взвешенных рёбер. Для каждой вершины от 1 до N выведите расстояние до ближайшего источника (-1 если недостижима).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, k;\n    cin >> n >> m >> k;\n    vector<int> sources(k);\n    for (int i = 0; i < k; i++) cin >> sources[i];\n    vector<vector<pair<int,int>>> g(n + 1);\n    // Считайте рёбра\n    // Мульти-источниковая Дейкстра: добавьте все источники в очередь\n    return 0;\n}\n',
        testCases: [
          { input: '5 4 2\n1 5\n1 2 3\n2 3 1\n4 5 2\n3 4 4', expectedOutput: '0 3 4 2 0', description: 'Источники 1 и 5' },
          { input: '3 2 1\n2\n1 2 5\n2 3 3', expectedOutput: '5 0 3', description: 'Источник 2' },
          { input: '4 2 2\n1 4\n1 2 1\n3 4 1', expectedOutput: '0 1 1 0', description: 'Два источника по краям' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 11: Строковые алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'cpp-string-algorithms',
    title: 'Строковые алгоритмы на C++',
    description: 'Хеширование, Z-функция, prefix-функция (КМП)',
    content: `# Строковые алгоритмы на C++

## Z-функция

\`\`\`cpp
vector<int> zFunction(const string& s) {
    int n = s.length();
    vector<int> z(n, 0);
    z[0] = n;
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r)
            z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]])
            z[i]++;
        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    return z;
}

// Поиск подстроки
int countOccurrences(const string& text, const string& pattern) {
    string s = pattern + "$" + text;
    auto z = zFunction(s);
    int m = pattern.length();
    int count = 0;
    for (int i = m + 1; i < s.length(); i++)
        if (z[i] == m) count++;
    return count;
}
\`\`\`

## Prefix-функция (КМП)

\`\`\`cpp
vector<int> prefixFunction(const string& s) {
    int n = s.length();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j])
            j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}
\`\`\`

## Полиномиальное хеширование

\`\`\`cpp
struct StringHash {
    vector<long long> h, pw;
    long long base = 31, mod = 1e9 + 9;

    StringHash(const string& s) {
        int n = s.length();
        h.resize(n + 1, 0);
        pw.resize(n + 1, 1);
        for (int i = 0; i < n; i++) {
            h[i + 1] = (h[i] * base + s[i] - 'a' + 1) % mod;
            pw[i + 1] = pw[i] * base % mod;
        }
    }

    long long getHash(int l, int r) { // [l, r)
        return (h[r] - h[l] * pw[r - l] % mod + mod * mod) % mod;
    }
};
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Поиск подстроки (Z-функция)',
        description: 'Считайте текст T и шаблон P. Выведите количество вхождений P в T.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string t, p;\n    cin >> t >> p;\n    // Z-функция для поиска\n    return 0;\n}\n',
        testCases: [
          { input: 'aaaa\naa', expectedOutput: '3', description: '3 вхождения' },
          { input: 'abcabcabc\nabc', expectedOutput: '3', description: '3 вхождения' },
          { input: 'hello\nworld', expectedOutput: '0', description: 'Нет вхождений' },
        ],
        points: 10,
      },
      {
        title: 'Палиндром-проверка',
        description: 'Считайте строку S. Выведите YES, если это палиндром (читается одинаково в обе стороны), NO иначе. Учитывайте только строчные буквы.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте, является ли строка палиндромом\n    return 0;\n}\n',
        testCases: [
          { input: 'abcba', expectedOutput: 'YES', description: 'Палиндром' },
          { input: 'abcd', expectedOutput: 'NO', description: 'Не палиндром' },
          { input: 'a', expectedOutput: 'YES', description: 'Один символ' },
        ],
        points: 10,
      },
      {
        title: 'Prefix-функция',
        description: 'Считайте строку S. Выведите значения prefix-функции (КМП) через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    int n = s.length();\n    vector<int> pi(n, 0);\n    // Вычислите prefix-функцию\n    return 0;\n}\n',
        testCases: [
          { input: 'abcabcd', expectedOutput: '0 0 0 1 2 3 0', description: 'Prefix-функция для abcabcd' },
          { input: 'aabaaab', expectedOutput: '0 1 0 1 2 2 3', description: 'Prefix-функция для aabaaab' },
          { input: 'aaaa', expectedOutput: '0 1 2 3', description: 'Все одинаковые' },
        ],
        points: 15,
      },
      {
        title: 'Наибольший палиндром-подстрока',
        description: 'Считайте строку S. Выведите длину наибольшей подстроки-палиндрома. Используйте хеширование или перебор с оптимизацией.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Найдите длину наибольшей подстроки-палиндрома\n    return 0;\n}\n',
        testCases: [
          { input: 'babad', expectedOutput: '3', description: 'bab или aba — длина 3' },
          { input: 'cbbd', expectedOutput: '2', description: 'bb — длина 2' },
          { input: 'a', expectedOutput: '1', description: 'Один символ' },
          { input: 'abacaba', expectedOutput: '7', description: 'Вся строка — палиндром' },
        ],
        points: 15,
      },
      {
        title: 'Сравнение подстрок за O(1) хешированием',
        description: 'Считайте строку S и Q запросов. Каждый запрос — четыре числа l1 r1 l2 r2 (1-based). Для каждого запроса выведите YES, если S[l1..r1] == S[l2..r2], NO иначе. Используйте полиномиальное хеширование.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nconst long long BASE = 31;\nconst long long MOD = 1000000009;\n\nint main() {\n    string s;\n    cin >> s;\n    int n = s.length();\n    // Предвычислите хеши и степени\n    vector<long long> h(n + 1, 0), pw(n + 1, 1);\n    int q;\n    cin >> q;\n    // Обработайте запросы\n    return 0;\n}\n',
        testCases: [
          { input: 'abcabc\n2\n1 3 4 6\n1 2 2 3', expectedOutput: 'YES\nNO', description: 'abc==abc, ab!=bc' },
          { input: 'aaaa\n1\n1 2 3 4', expectedOutput: 'YES', description: 'aa == aa' },
          { input: 'abcdef\n1\n1 3 4 6', expectedOutput: 'NO', description: 'abc != def' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 12: Теория чисел
  // ──────────────────────────────────────────
  {
    slug: 'cpp-number-theory',
    title: 'Теория чисел на C++',
    description: 'Решето, модулярная арифметика, обратный элемент',
    content: `# Теория чисел на C++

## Решето Эратосфена

\`\`\`cpp
vector<bool> sieve(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i * i <= n; i++)
        if (is_prime[i])
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
    return is_prime;
}
\`\`\`

## Модулярная арифметика

\`\`\`cpp
const long long MOD = 1e9 + 7;

long long add(long long a, long long b) {
    return ((a % MOD) + (b % MOD)) % MOD;
}

long long mul(long long a, long long b) {
    return ((a % MOD) * (b % MOD)) % MOD;
}

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

long long modInverse(long long a, long long mod) {
    return power(a, mod - 2, mod);
}
\`\`\`

## Биномиальные коэффициенты

\`\`\`cpp
const int MAXN = 200001;
long long fact[MAXN], inv_fact[MAXN];

void precompute() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++)
        fact[i] = fact[i-1] * i % MOD;
    inv_fact[MAXN-1] = power(fact[MAXN-1], MOD - 2, MOD);
    for (int i = MAXN - 2; i >= 0; i--)
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD;
}

long long C(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fact[n] % MOD * inv_fact[k] % MOD * inv_fact[n-k] % MOD;
}
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Решето Эратосфена (C++)',
        description: 'Считайте N. Выведите количество простых чисел от 2 до N.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Решето Эратосфена\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '4', description: '2,3,5,7' },
          { input: '100', expectedOutput: '25', description: '25 простых' },
          { input: '2', expectedOutput: '1', description: 'Только 2' },
        ],
        points: 10,
      },
      {
        title: 'НОД и НОК',
        description: 'Считайте два числа A и B. Выведите их НОД и НОК через пробел. Используйте алгоритм Евклида.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nlong long gcd(long long a, long long b) {\n    // Алгоритм Евклида\n}\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    // Выведите НОД и НОК\n    return 0;\n}\n',
        testCases: [
          { input: '12 8', expectedOutput: '4 24', description: 'НОД(12,8)=4, НОК=24' },
          { input: '7 13', expectedOutput: '1 91', description: 'Взаимно простые' },
          { input: '6 6', expectedOutput: '6 6', description: 'Одинаковые числа' },
        ],
        points: 10,
      },
      {
        title: 'Факторизация числа',
        description: 'Считайте число N (2 <= N <= 10^9). Выведите его разложение на простые множители в порядке возрастания через пробел (с повторениями).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    // Разложите n на простые множители\n    return 0;\n}\n',
        testCases: [
          { input: '12', expectedOutput: '2 2 3', description: '12 = 2*2*3' },
          { input: '13', expectedOutput: '13', description: 'Простое число' },
          { input: '100', expectedOutput: '2 2 5 5', description: '100 = 2*2*5*5' },
        ],
        points: 15,
      },
      {
        title: 'Модульное возведение и обратный элемент',
        description: 'Считайте A, B и MOD (простое). Вычислите (A / B) mod MOD, используя обратный элемент через теорему Ферма: B^(-1) = B^(MOD-2) mod MOD.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nlong long power(long long base, long long exp, long long mod) {\n    // Быстрое возведение в степень\n}\n\nint main() {\n    long long a, b, mod;\n    cin >> a >> b >> mod;\n    // Вычислите (a * modInverse(b)) % mod\n    return 0;\n}\n',
        testCases: [
          { input: '6 3 1000000007', expectedOutput: '2', description: '6/3 = 2' },
          { input: '1 2 1000000007', expectedOutput: '500000004', description: '1/2 mod 10^9+7' },
          { input: '10 5 7', expectedOutput: '2', description: '10/5 mod 7 = 2' },
        ],
        points: 15,
      },
      {
        title: 'Биномиальный коэффициент по модулю',
        description: 'Считайте N и K. Выведите C(N, K) mod 10^9+7. Используйте предвычисление факториалов и обратных факториалов.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nconst long long MOD = 1000000007;\n\nlong long power(long long base, long long exp, long long mod) {\n    // Быстрое возведение\n}\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Предвычислите факториалы и обратные факториалы\n    // Выведите C(n, k) mod MOD\n    return 0;\n}\n',
        testCases: [
          { input: '5 2', expectedOutput: '10', description: 'C(5,2) = 10' },
          { input: '10 0', expectedOutput: '1', description: 'C(n,0) = 1' },
          { input: '100 50', expectedOutput: '538992043', description: 'Большой коэффициент' },
          { input: '1000 500', expectedOutput: '159835829', description: 'Очень большой' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 13: Деревья
  // ──────────────────────────────────────────
  {
    slug: 'cpp-trees',
    title: 'Деревья на C++',
    description: 'Обход, высота, диаметр, LCA',
    content: `# Деревья на C++

## Представление

\`\`\`cpp
int n;
cin >> n;
vector<vector<int>> tree(n + 1);
for (int i = 0; i < n - 1; i++) {
    int u, v;
    cin >> u >> v;
    tree[u].push_back(v);
    tree[v].push_back(u);
}
\`\`\`

## DFS на дереве

\`\`\`cpp
vector<int> depth(n + 1, 0);
vector<int> subtreeSize(n + 1, 1);

void dfs(int v, int parent) {
    for (int u : tree[v]) {
        if (u == parent) continue;
        depth[u] = depth[v] + 1;
        dfs(u, v);
        subtreeSize[v] += subtreeSize[u];
    }
}
\`\`\`

## Диаметр дерева

\`\`\`cpp
pair<int,int> bfsFarthest(vector<vector<int>>& tree, int start) {
    int n = tree.size();
    vector<int> dist(n, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);
    int farthest = start;
    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : tree[v])
            if (dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
                if (dist[u] > dist[farthest])
                    farthest = u;
            }
    }
    return {farthest, dist[farthest]};
}

int diameter(vector<vector<int>>& tree) {
    auto [far1, _] = bfsFarthest(tree, 1);
    auto [far2, d] = bfsFarthest(tree, far1);
    return d;
}
\`\`\`

## LCA (двоичный подъём)

\`\`\`cpp
const int LOG = 20;
int up[200001][LOG];
int tin[200001], tout[200001];
int timer = 0;

void dfsLCA(int v, int p, vector<vector<int>>& tree) {
    tin[v] = timer++;
    up[v][0] = p;
    for (int j = 1; j < LOG; j++)
        up[v][j] = up[up[v][j-1]][j-1];
    for (int u : tree[v])
        if (u != p) dfsLCA(u, v, tree);
    tout[v] = timer++;
}

bool isAncestor(int u, int v) {
    return tin[u] <= tin[v] && tout[v] <= tout[u];
}

int lca(int u, int v) {
    if (isAncestor(u, v)) return u;
    if (isAncestor(v, u)) return v;
    for (int j = LOG - 1; j >= 0; j--)
        if (!isAncestor(up[u][j], v))
            u = up[u][j];
    return up[u][0];
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Диаметр дерева (C++)',
        description: 'Считайте N, затем N-1 рёбер. Выведите диаметр дерева.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите диаметр\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: 'Цепочка, диаметр 4' },
          { input: '5\n1 2\n1 3\n1 4\n1 5', expectedOutput: '2', description: 'Звезда, диаметр 2' },
          { input: '2\n1 2', expectedOutput: '1', description: 'Два узла' },
        ],
        points: 10,
      },
      {
        title: 'Высота дерева',
        description: 'Считайте N и N-1 рёбер. Корень — вершина 1. Выведите высоту дерева (максимальную глубину от корня до листа).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> tree;\nint maxDepth = 0;\n\nvoid dfs(int v, int parent, int depth) {\n    // Обход дерева, обновите максимальную глубину\n}\n\nint main() {\n    int n;\n    cin >> n;\n    tree.resize(n + 1);\n    // Считайте рёбра и найдите высоту\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: 'Цепочка — высота 4' },
          { input: '4\n1 2\n1 3\n1 4', expectedOutput: '1', description: 'Звезда — высота 1' },
          { input: '1', expectedOutput: '0', description: 'Один узел — высота 0' },
        ],
        points: 10,
      },
      {
        title: 'Размеры поддеревьев',
        description: 'Считайте N и N-1 рёбер. Корень — вершина 1. Для каждой вершины от 1 до N выведите размер её поддерева (включая саму вершину).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> tree;\nvector<int> subtreeSize;\n\nvoid dfs(int v, int parent) {\n    subtreeSize[v] = 1;\n    // Обойдите детей\n}\n\nint main() {\n    int n;\n    cin >> n;\n    tree.resize(n + 1);\n    subtreeSize.resize(n + 1, 0);\n    // Считайте рёбра и вычислите размеры поддеревьев\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2\n1 3\n2 4\n2 5', expectedOutput: '5 3 1 1 1', description: 'Корень=5, вершина 2=3' },
          { input: '3\n1 2\n1 3', expectedOutput: '3 1 1', description: 'Звезда' },
          { input: '1', expectedOutput: '1', description: 'Один узел' },
        ],
        points: 15,
      },
      {
        title: 'Расстояние между вершинами',
        description: 'Считайте N, N-1 рёбер, затем Q запросов. Каждый запрос — пара вершин u v. Для каждого выведите расстояние (количество рёбер) между u и v.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint bfsDist(vector<vector<int>>& tree, int u, int v, int n) {\n    // BFS от u до v\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<vector<int>> tree(n + 1);\n    // Считайте рёбра и обработайте запросы\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5\n2\n1 5\n2 4', expectedOutput: '4\n2', description: '1->5 = 4, 2->4 = 2' },
          { input: '3\n1 2\n1 3\n1\n2 3', expectedOutput: '2', description: '2->1->3 = 2' },
          { input: '4\n1 2\n1 3\n3 4\n1\n2 4', expectedOutput: '3', description: '2->1->3->4 = 3' },
        ],
        points: 15,
      },
      {
        title: 'Центроид дерева',
        description: 'Считайте N и N-1 рёбер. Найдите центроид дерева — вершину, при удалении которой максимальная компонента связности минимальна. Выведите номер центроида (при нескольких — наименьший).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<int>> tree;\nvector<int> subtreeSize;\nint n;\n\nvoid calcSize(int v, int parent) {\n    subtreeSize[v] = 1;\n    for (int u : tree[v]) {\n        if (u == parent) continue;\n        calcSize(u, v);\n        subtreeSize[v] += subtreeSize[u];\n    }\n}\n\nint main() {\n    cin >> n;\n    tree.resize(n + 1);\n    subtreeSize.resize(n + 1, 0);\n    // Считайте рёбра, найдите центроид\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '3', description: 'Центр цепочки' },
          { input: '4\n1 2\n1 3\n1 4', expectedOutput: '1', description: 'Центр звезды' },
          { input: '7\n1 2\n1 3\n2 4\n2 5\n3 6\n3 7', expectedOutput: '1', description: 'Сбалансированное дерево' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 14: Шаблоны (templates)
  // ──────────────────────────────────────────
  {
    slug: 'cpp-templates',
    title: 'Шаблоны функций и классов',
    description: 'template, обобщённое программирование, шаблонные классы',
    content: `# Шаблоны (templates)

## Шаблонные функции

\`\`\`cpp
template<typename T>
T myMax(T a, T b) {
    return (a > b) ? a : b;
}

cout << myMax(3, 5);          // int
cout << myMax(3.14, 2.71);    // double
cout << myMax<string>("ab", "cd"); // string
\`\`\`

## Шаблон с несколькими типами

\`\`\`cpp
template<typename T1, typename T2>
auto myAdd(T1 a, T2 b) -> decltype(a + b) {
    return a + b;
}

cout << myAdd(3, 2.5); // 5.5 (int + double)
\`\`\`

## Шаблонный класс

\`\`\`cpp
template<typename T>
class Stack {
    vector<T> data;
public:
    void push(T val) { data.push_back(val); }
    T top() { return data.back(); }
    void pop() { data.pop_back(); }
    bool empty() { return data.empty(); }
    int size() { return data.size(); }
};

Stack<int> intStack;
Stack<string> strStack;
\`\`\`

## Шаблон для чтения

\`\`\`cpp
template<typename T>
T read() {
    T x;
    cin >> x;
    return x;
}

int n = read<int>();
string s = read<string>();
\`\`\`

## Шаблон для debug

\`\`\`cpp
template<typename T>
void print(const vector<T>& v) {
    for (const T& x : v)
        cout << x << " ";
    cout << endl;
}

template<typename K, typename V>
void print(const map<K, V>& m) {
    for (auto& [key, val] : m)
        cout << key << ": " << val << endl;
}
\`\`\``,
    duration: 45,
    assignments: [
      {
        title: 'Шаблонный стек',
        description: 'Реализуйте шаблонный стек. Считайте N операций: PUSH x (добавить), POP (удалить и вывести), TOP (вывести верхний). Тип данных — int.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\ntemplate<typename T>\nclass Stack {\n    // Реализуйте стек\n};\n\nint main() {\n    int n;\n    cin >> n;\n    Stack<int> st;\n    // Обработайте операции\n    return 0;\n}\n',
        testCases: [
          { input: '5\nPUSH 3\nPUSH 5\nTOP\nPOP\nTOP', expectedOutput: '5\n5\n3', description: 'TOP=5, POP=5, TOP=3' },
          { input: '3\nPUSH 42\nTOP\nPOP', expectedOutput: '42\n42', description: 'Один элемент' },
          { input: '4\nPUSH 1\nPUSH 2\nPOP\nPOP', expectedOutput: '2\n1', description: 'LIFO порядок' },
        ],
        points: 10,
      },
      {
        title: 'Шаблонная функция максимума',
        description: 'Считайте тип (int или double), затем два значения. Напишите шаблонную функцию myMax и выведите наибольшее. Для double — с 1 знаком после точки.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\ntemplate<typename T>\nT myMax(T a, T b) {\n    // Верните максимум из двух значений\n}\n\nint main() {\n    string type;\n    cin >> type;\n    if (type == "int") {\n        int a, b; cin >> a >> b;\n        cout << myMax(a, b) << endl;\n    } else {\n        double a, b; cin >> a >> b;\n        cout << fixed << setprecision(1) << myMax(a, b) << endl;\n    }\n    return 0;\n}\n',
        testCases: [
          { input: 'int\n3 7', expectedOutput: '7', description: 'Максимум int' },
          { input: 'double\n3.5 2.1', expectedOutput: '3.5', description: 'Максимум double' },
          { input: 'int\n-5 -1', expectedOutput: '-1', description: 'Отрицательные int' },
        ],
        points: 10,
      },
      {
        title: 'Шаблонная функция поиска',
        description: 'Напишите шаблонную функцию findIndex(vector<T>& v, T target), возвращающую индекс первого вхождения target (-1 если не найден). Считайте N чисел и target. Выведите индекс.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\ntemplate<typename T>\nint findIndex(const vector<T>& v, T target) {\n    // Найдите первое вхождение target\n}\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> v(n);\n    for (int i = 0; i < n; i++) cin >> v[i];\n    int target;\n    cin >> target;\n    cout << findIndex(v, target) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5\n10 20 30 40 50\n30', expectedOutput: '2', description: '30 на позиции 2' },
          { input: '3\n1 2 3\n5', expectedOutput: '-1', description: 'Не найден' },
          { input: '4\n7 7 7 7\n7', expectedOutput: '0', description: 'Первое вхождение' },
        ],
        points: 15,
      },
      {
        title: 'Шаблонный вывод контейнера',
        description: 'Напишите шаблонную функцию printVector(const vector<T>& v), выводящую элементы через пробел. Считайте тип (int или string), затем N элементов. Выведите их.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\ntemplate<typename T>\nvoid printVector(const vector<T>& v) {\n    // Выведите элементы через пробел\n}\n\nint main() {\n    string type;\n    cin >> type;\n    int n;\n    cin >> n;\n    if (type == "int") {\n        vector<int> v(n);\n        for (int i = 0; i < n; i++) cin >> v[i];\n        printVector(v);\n    } else {\n        vector<string> v(n);\n        for (int i = 0; i < n; i++) cin >> v[i];\n        printVector(v);\n    }\n    return 0;\n}\n',
        testCases: [
          { input: 'int\n3\n1 2 3', expectedOutput: '1 2 3', description: 'Вектор int' },
          { input: 'string\n2\nhello world', expectedOutput: 'hello world', description: 'Вектор string' },
          { input: 'int\n1\n42', expectedOutput: '42', description: 'Один элемент' },
        ],
        points: 15,
      },
      {
        title: 'Шаблонный класс Pair с методами',
        description: 'Реализуйте шаблонный класс MyPair<T1, T2> с полями first, second и методом swap(), который меняет first и second местами (только если T1 == T2). Считайте два int, создайте MyPair, вызовите swap, выведите first и second.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\ntemplate<typename T>\nclass MyPair {\npublic:\n    T first, second;\n    MyPair(T a, T b) : first(a), second(b) {}\n    void swapValues() {\n        // Обменяйте first и second\n    }\n    void print() {\n        cout << first << " " << second << endl;\n    }\n};\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    MyPair<int> p(a, b);\n    p.print();\n    p.swapValues();\n    p.print();\n    return 0;\n}\n',
        testCases: [
          { input: '3 7', expectedOutput: '3 7\n7 3', description: 'Обмен 3 и 7' },
          { input: '0 0', expectedOutput: '0 0\n0 0', description: 'Одинаковые' },
          { input: '-5 10', expectedOutput: '-5 10\n10 -5', description: 'С отрицательным' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 15: Жадные алгоритмы
  // ──────────────────────────────────────────
  {
    slug: 'cpp-greedy',
    title: 'Жадные алгоритмы на C++',
    description: 'Активности, покрытие, дробный рюкзак',
    content: `# Жадные алгоритмы на C++

## Максимум непересекающихся отрезков

\`\`\`cpp
int maxActivities(vector<pair<int,int>>& segs) {
    sort(segs.begin(), segs.end(),
        [](const auto& a, const auto& b) {
            return a.second < b.second;
        });

    int count = 0, lastEnd = -1;
    for (auto& [start, end] : segs) {
        if (start >= lastEnd) {
            count++;
            lastEnd = end;
        }
    }
    return count;
}
\`\`\`

## Минимальное количество точек

\`\`\`cpp
int minPoints(vector<pair<int,int>>& segs) {
    sort(segs.begin(), segs.end(),
        [](const auto& a, const auto& b) {
            return a.second < b.second;
        });

    int count = 0, lastPoint = INT_MIN;
    for (auto& [l, r] : segs) {
        if (lastPoint < l) {
            count++;
            lastPoint = r;
        }
    }
    return count;
}
\`\`\`

## Задача Хаффмана

\`\`\`cpp
long long huffman(vector<int>& freqs) {
    priority_queue<long long, vector<long long>, greater<>> pq;
    for (int f : freqs) pq.push(f);

    long long total = 0;
    while (pq.size() > 1) {
        long long a = pq.top(); pq.pop();
        long long b = pq.top(); pq.pop();
        total += a + b;
        pq.push(a + b);
    }
    return total;
}
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Непересекающиеся отрезки (C++)',
        description: 'Считайте N, затем N пар (начало, конец). Выведите максимум непересекающихся отрезков.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Жадный алгоритм\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 3\n2 5\n4 7\n6 9\n8 10', expectedOutput: '3', description: '[1,3],[4,7],[8,10]' },
          { input: '3\n1 10\n2 3\n4 5', expectedOutput: '2', description: '[2,3],[4,5]' },
          { input: '1\n1 100', expectedOutput: '1', description: 'Один отрезок' },
        ],
        points: 10,
      },
      {
        title: 'Жадный размен',
        description: 'Считайте сумму S и номиналы монет: 1, 5, 10, 25. Выведите минимальное количество монет для размена S жадным алгоритмом (всегда берём наибольшую монету).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int s;\n    cin >> s;\n    int coins[] = {25, 10, 5, 1};\n    int count = 0;\n    // Жадный размен\n    return 0;\n}\n',
        testCases: [
          { input: '41', expectedOutput: '4', description: '25+10+5+1 = 4 монеты' },
          { input: '25', expectedOutput: '1', description: 'Одна монета 25' },
          { input: '1', expectedOutput: '1', description: 'Одна монета 1' },
        ],
        points: 10,
      },
      {
        title: 'Дробный рюкзак',
        description: 'Считайте N предметов и вместимость W. Для каждого предмета даны вес и стоимость. Предметы можно делить. Выведите максимальную стоимость с точностью 4 знака.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n, w;\n    cin >> n >> w;\n    vector<pair<double,double>> items(n); // {вес, стоимость}\n    for (int i = 0; i < n; i++) cin >> items[i].first >> items[i].second;\n    // Отсортируйте по стоимости/вес и набирайте жадно\n    return 0;\n}\n',
        testCases: [
          { input: '3 50\n10 60\n20 100\n30 120', expectedOutput: '240.0000', description: '60 + 100 + 80 = 240' },
          { input: '1 10\n5 100', expectedOutput: '100.0000', description: 'Предмет влезает целиком' },
          { input: '2 10\n20 200\n30 300', expectedOutput: '100.0000', description: 'Берём 10/20 от первого' },
        ],
        points: 15,
      },
      {
        title: 'Минимум точек для покрытия отрезков',
        description: 'Считайте N отрезков [l, r]. Найдите минимальное количество точек, чтобы каждый отрезок содержал хотя бы одну точку.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<pair<int,int>> segs(n);\n    for (int i = 0; i < n; i++) cin >> segs[i].first >> segs[i].second;\n    // Жадный: сортируйте по правому концу\n    return 0;\n}\n',
        testCases: [
          { input: '4\n1 3\n2 5\n3 6\n5 7', expectedOutput: '2', description: 'Точки 3 и 7 покрывают все' },
          { input: '3\n1 2\n3 4\n5 6', expectedOutput: '3', description: 'Непересекающиеся — 3 точки' },
          { input: '2\n1 10\n2 5', expectedOutput: '1', description: 'Вложенные — 1 точка' },
        ],
        points: 15,
      },
      {
        title: 'Задача Хаффмана',
        description: 'Считайте N частот символов. Постройте оптимальный код Хаффмана и выведите суммарную длину закодированного текста (сумму freq[i] * len[i]). Используйте priority_queue.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте частоты и постройте дерево Хаффмана\n    priority_queue<long long, vector<long long>, greater<long long>> pq;\n    return 0;\n}\n',
        testCases: [
          { input: '4\n5 9 12 13', expectedOutput: '68', description: 'Сумма: (5+9)*2 + 12*2 + 13*1 ... = 68' },
          { input: '2\n10 20', expectedOutput: '30', description: '10*1 + 20*1 = 30' },
          { input: '1\n100', expectedOutput: '0', description: 'Один символ — длина 0' },
          { input: '3\n1 1 1', expectedOutput: '5', description: '1*2 + 1*2 + 1*1 = 5' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 16: Бинарный поиск по ответу
  // ──────────────────────────────────────────
  {
    slug: 'cpp-binary-search-answer',
    title: 'Бинарный поиск по ответу',
    description: 'Параметрический поиск, верёвки, коровы',
    content: `# Бинарный поиск по ответу

## Верёвки

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> ropes(n);
    for (int& r : ropes) cin >> r;

    int lo = 1, hi = *max_element(ropes.begin(), ropes.end());
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        long long pieces = 0;
        for (int r : ropes) pieces += r / mid;
        if (pieces >= k) lo = mid + 1;
        else hi = mid - 1;
    }
    cout << hi << endl;
    return 0;
}
\`\`\`

## Коровы в стойлах

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> stalls(n);
    for (int& s : stalls) cin >> s;
    sort(stalls.begin(), stalls.end());

    int lo = 1, hi = stalls.back() - stalls[0];

    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        int count = 1, last = stalls[0];
        for (int i = 1; i < n; i++) {
            if (stalls[i] - last >= mid) {
                count++;
                last = stalls[i];
            }
        }
        if (count >= k) lo = mid + 1;
        else hi = mid - 1;
    }
    cout << hi << endl;
    return 0;
}
\`\`\`

## Разбиение массива на k частей

\`\`\`cpp
bool canSplit(vector<int>& a, int k, long long maxSum) {
    int parts = 1;
    long long cur = 0;
    for (int x : a) {
        if (cur + x > maxSum) {
            parts++;
            cur = x;
            if (parts > k) return false;
        } else cur += x;
    }
    return true;
}

long long minMaxSum(vector<int>& a, int k) {
    long long lo = *max_element(a.begin(), a.end());
    long long hi = accumulate(a.begin(), a.end(), 0LL);
    while (lo < hi) {
        long long mid = (lo + hi) / 2;
        if (canSplit(a, k, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Верёвки (C++)',
        description: 'Считайте N и K, затем N длин верёвок. Найдите макс. целую длину куска для K кусков.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Бинарный поиск по ответу\n    return 0;\n}\n',
        testCases: [
          { input: '4 11\n802 743 457 539', expectedOutput: '200', description: '4+3+2+2=11 кусков по 200' },
          { input: '1 1\n100', expectedOutput: '100', description: 'Одна верёвка' },
          { input: '2 4\n10 10', expectedOutput: '5', description: '10/5=2+10/5=2=4' },
        ],
        points: 10,
      },
      {
        title: 'Бинарный поиск в массиве',
        description: 'Считайте N отсортированных чисел и число X. Выведите индекс X (0-based) или -1, если не найден. Используйте lower_bound.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    int x;\n    cin >> x;\n    // Бинарный поиск через lower_bound\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: '5 на позиции 2' },
          { input: '4\n2 4 6 8\n5', expectedOutput: '-1', description: 'Не найден' },
          { input: '1\n42\n42', expectedOutput: '0', description: 'Один элемент' },
        ],
        points: 10,
      },
      {
        title: 'Коровы в стойлах',
        description: 'Считайте N позиций стойл и K коров. Разместите K коров так, чтобы минимальное расстояние между двумя коровами было максимальным. Выведите это расстояние.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    vector<int> stalls(n);\n    for (int i = 0; i < n; i++) cin >> stalls[i];\n    sort(stalls.begin(), stalls.end());\n    // Бинарный поиск по минимальному расстоянию\n    return 0;\n}\n',
        testCases: [
          { input: '5 3\n1 2 8 4 9', expectedOutput: '3', description: 'Позиции 1, 4, 8 — мин расстояние 3' },
          { input: '3 2\n1 5 10', expectedOutput: '9', description: 'Позиции 1 и 10' },
          { input: '4 2\n1 2 3 4', expectedOutput: '3', description: 'Позиции 1 и 4' },
        ],
        points: 15,
      },
      {
        title: 'Разбиение массива на K частей',
        description: 'Считайте N чисел и K. Разбейте массив на K непрерывных частей, минимизируя максимальную сумму части. Выведите эту минимальную максимальную сумму.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nbool canSplit(vector<int>& a, int k, long long maxSum) {\n    // Проверьте, можно ли разбить на <= k частей с суммой <= maxSum\n}\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Бинарный поиск по ответу\n    return 0;\n}\n',
        testCases: [
          { input: '5 3\n1 2 3 4 5', expectedOutput: '6', description: '[1,2,3],[4],[5] — макс=6' },
          { input: '4 2\n1 1 1 1', expectedOutput: '2', description: '[1,1],[1,1] — макс=2' },
          { input: '3 1\n10 20 30', expectedOutput: '60', description: 'Одна часть — вся сумма' },
        ],
        points: 15,
      },
      {
        title: 'Квадратный корень с точностью',
        description: 'Считайте число N (1 <= N <= 10^18). Выведите целую часть квадратного корня из N (наибольшее x, что x*x <= N). Используйте бинарный поиск на long long.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    // Бинарный поиск: найдите наибольшее x, что x*x <= n\n    // Осторожно с переполнением!\n    return 0;\n}\n',
        testCases: [
          { input: '16', expectedOutput: '4', description: 'sqrt(16) = 4' },
          { input: '10', expectedOutput: '3', description: '3*3=9 <= 10, 4*4=16 > 10' },
          { input: '1000000000000000000', expectedOutput: '1000000000', description: 'sqrt(10^18) = 10^9' },
          { input: '1', expectedOutput: '1', description: 'sqrt(1) = 1' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 17: Битовые операции
  // ──────────────────────────────────────────
  {
    slug: 'cpp-bitwise',
    title: 'Битовые операции и маски',
    description: 'AND, OR, XOR, перебор подмножеств, __builtin функции',
    content: `# Битовые операции

## Основы

\`\`\`cpp
int a = 0b1010; // 10
int b = 0b1100; // 12

a & b;   // AND: 0b1000 (8)
a | b;   // OR:  0b1110 (14)
a ^ b;   // XOR: 0b0110 (6)
~a;      // NOT
a << 2;  // сдвиг влево (×4)
a >> 1;  // сдвиг вправо (÷2)
\`\`\`

## Полезные трюки

\`\`\`cpp
// Проверить k-й бит
bool hasBit(int n, int k) { return (n >> k) & 1; }

// Установить/сбросить k-й бит
int setBit(int n, int k) { return n | (1 << k); }
int clearBit(int n, int k) { return n & ~(1 << k); }

// Степень двойки?
bool isPow2(int n) { return n > 0 && (n & (n-1)) == 0; }

// Встроенные функции GCC
__builtin_popcount(n);     // количество единиц (int)
__builtin_popcountll(n);   // для long long
__builtin_clz(n);          // ведущие нули
__builtin_ctz(n);          // хвостовые нули
\`\`\`

## Перебор подмножеств

\`\`\`cpp
int n = 4;
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++)
        if (mask & (1 << i))
            cout << i << " ";
    cout << endl;
}
\`\`\`

## XOR: поиск единственного

\`\`\`cpp
int findSingle(vector<int>& a) {
    int result = 0;
    for (int x : a) result ^= x;
    return result;
}
\`\`\``,
    duration: 45,
    assignments: [
      {
        title: 'XOR поиск (C++)',
        description: 'Считайте N чисел. Все встречаются дважды, кроме одного. Найдите его через XOR.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // XOR всех элементов\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 2 1', expectedOutput: '3', description: '3 — единственное' },
          { input: '7\n4 1 2 1 2 4 7', expectedOutput: '7', description: '7' },
          { input: '1\n42', expectedOutput: '42', description: 'Одно число' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт единичных битов',
        description: 'Считайте число N. Выведите количество единичных битов в двоичном представлении N. Реализуйте через битовые операции (не используйте __builtin_popcount).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint countBits(int n) {\n    int count = 0;\n    // Считайте единичные биты\n    return count;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << countBits(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '7', expectedOutput: '3', description: '111 — 3 единицы' },
          { input: '16', expectedOutput: '1', description: '10000 — 1 единица' },
          { input: '255', expectedOutput: '8', description: '11111111 — 8 единиц' },
        ],
        points: 10,
      },
      {
        title: 'Перебор подмножеств',
        description: 'Считайте N (N <= 15), затем N чисел. Выведите сумму элементов для каждого непустого подмножества в порядке перебора масок от 1 до 2^N-1, каждую на отдельной строке.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Переберите все непустые подмножества через маски\n    return 0;\n}\n',
        testCases: [
          { input: '2\n3 5', expectedOutput: '3\n5\n8', description: '{3}, {5}, {3,5}' },
          { input: '3\n1 2 4', expectedOutput: '1\n2\n3\n4\n5\n6\n7', description: 'Все 7 подмножеств' },
          { input: '1\n10', expectedOutput: '10', description: 'Одно подмножество' },
        ],
        points: 15,
      },
      {
        title: 'Степень двойки',
        description: 'Считайте N чисел. Для каждого выведите YES, если число — степень двойки, NO иначе. Используйте битовый трюк: n > 0 && (n & (n-1)) == 0.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    for (int i = 0; i < n; i++) {\n        int x;\n        cin >> x;\n        // Проверьте, является ли x степенью двойки\n    }\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: 'YES\nYES\nNO\nYES\nNO', description: '1,2,4 — степени двойки' },
          { input: '3\n16 32 15', expectedOutput: 'YES\nYES\nNO', description: '16 и 32 — степени двойки' },
          { input: '2\n0 1024', expectedOutput: 'NO\nYES', description: '0 — не степень, 1024 — да' },
        ],
        points: 15,
      },
      {
        title: 'Максимальный XOR подмассива',
        description: 'Считайте N чисел. Найдите максимальный XOR непрерывного подмассива. Для N <= 1000 используйте перебор всех подмассивов с предвычислением XOR-префиксов.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Вычислите XOR-префиксы: prefix[i] = a[0]^a[1]^...^a[i-1]\n    // XOR подмассива [l,r) = prefix[r] ^ prefix[l]\n    // Найдите максимум\n    return 0;\n}\n',
        testCases: [
          { input: '4\n1 2 3 4', expectedOutput: '7', description: '1^2^3^4=4, 1^2^3=0, 3^4=7' },
          { input: '3\n8 1 2', expectedOutput: '11', description: '8^1^2=11' },
          { input: '1\n5', expectedOutput: '5', description: 'Один элемент' },
          { input: '5\n5 2 1 6 3', expectedOutput: '7', description: 'Макс XOR подмассива' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 18: Комбинаторика и перебор
  // ──────────────────────────────────────────
  {
    slug: 'cpp-combinatorics',
    title: 'Комбинаторика: перестановки и backtracking',
    description: 'next_permutation, N ферзей, генерация сочетаний',
    content: `# Комбинаторика и backtracking

## next_permutation

\`\`\`cpp
vector<int> a = {1, 2, 3};
do {
    for (int x : a) cout << x << " ";
    cout << endl;
} while (next_permutation(a.begin(), a.end()));
// 1 2 3, 1 3 2, 2 1 3, 2 3 1, 3 1 2, 3 2 1
\`\`\`

## Генерация сочетаний

\`\`\`cpp
void combinations(int n, int k, int start,
                  vector<int>& current) {
    if (current.size() == k) {
        for (int x : current) cout << x << " ";
        cout << endl;
        return;
    }
    for (int i = start; i <= n; i++) {
        current.push_back(i);
        combinations(n, k, i + 1, current);
        current.pop_back();
    }
}
\`\`\`

## N ферзей

\`\`\`cpp
int solutions = 0;

void solveQueens(int n, int row, int cols,
                 int diag1, int diag2) {
    if (row == n) { solutions++; return; }
    for (int col = 0; col < n; col++) {
        if ((cols >> col) & 1) continue;
        if ((diag1 >> (row - col + n)) & 1) continue;
        if ((diag2 >> (row + col)) & 1) continue;
        solveQueens(n, row + 1,
            cols | (1 << col),
            diag1 | (1 << (row - col + n)),
            diag2 | (1 << (row + col)));
    }
}
\`\`\`

## Включения-исключения

\`\`\`cpp
// Количество чисел от 1 до n, делящихся на a или b
long long countDiv(long long n, long long a, long long b) {
    long long lcm_ab = a / __gcd(a, b) * b;
    return n/a + n/b - n/lcm_ab;
}
\`\`\``,
    duration: 50,
    assignments: [
      {
        title: 'Количество перестановок с условием',
        description: 'Считайте N. Выведите количество перестановок чисел 1..N, в которых ни одно число не стоит на своём месте (беспорядки).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Формула беспорядков: D(n) = (n-1)*(D(n-1) + D(n-2))\n    return 0;\n}\n',
        testCases: [
          { input: '3', expectedOutput: '2', description: 'D(3) = 2: (2,3,1) и (3,1,2)' },
          { input: '4', expectedOutput: '9', description: 'D(4) = 9' },
          { input: '1', expectedOutput: '0', description: 'D(1) = 0' },
        ],
        points: 10,
      },
      {
        title: 'Количество перестановок',
        description: 'Считайте N. Выведите N! (факториал). Для N <= 20 ответ помещается в long long.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long result = 1;\n    // Вычислите факториал\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '120', description: '5! = 120' },
          { input: '0', expectedOutput: '1', description: '0! = 1' },
          { input: '10', expectedOutput: '3628800', description: '10! = 3628800' },
        ],
        points: 10,
      },
      {
        title: 'Генерация сочетаний C(n,k)',
        description: 'Считайте N и K. Выведите все сочетания из N по K в лексикографическом порядке, каждое на отдельной строке, числа через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid combinations(int n, int k, int start, vector<int>& current) {\n    // Рекурсивная генерация сочетаний\n}\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    vector<int> current;\n    combinations(n, k, 1, current);\n    return 0;\n}\n',
        testCases: [
          { input: '4 2', expectedOutput: '1 2\n1 3\n1 4\n2 3\n2 4\n3 4', description: '6 сочетаний' },
          { input: '3 1', expectedOutput: '1\n2\n3', description: 'По одному' },
          { input: '3 3', expectedOutput: '1 2 3', description: 'Одно сочетание' },
        ],
        points: 15,
      },
      {
        title: 'Следующая перестановка',
        description: 'Считайте N чисел — текущую перестановку. Выведите следующую в лексикографическом порядке. Если это последняя — выведите первую (наименьшую).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Используйте next_permutation\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '1 3 2', description: 'Следующая за 1 2 3' },
          { input: '3\n3 2 1', expectedOutput: '1 2 3', description: 'Последняя -> первая' },
          { input: '4\n1 3 4 2', expectedOutput: '1 4 2 3', description: 'Следующая за 1 3 4 2' },
        ],
        points: 15,
      },
      {
        title: 'N ферзей',
        description: 'Считайте N. Выведите количество способов расставить N ферзей на доске N×N так, чтобы ни один не бил другого. Используйте backtracking с битовыми масками.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint n, solutions = 0;\n\nvoid solve(int row, int cols, int diag1, int diag2) {\n    // Backtracking с битовыми масками\n}\n\nint main() {\n    cin >> n;\n    solve(0, 0, 0, 0);\n    cout << solutions << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '4', expectedOutput: '2', description: '2 решения для 4 ферзей' },
          { input: '8', expectedOutput: '92', description: '92 решения для 8 ферзей' },
          { input: '1', expectedOutput: '1', description: '1 решение' },
          { input: '5', expectedOutput: '10', description: '10 решений для 5 ферзей' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 19: Олимпиадные приёмы
  // ──────────────────────────────────────────
  {
    slug: 'cpp-competitive-tricks',
    title: 'Олимпиадные приёмы C++',
    description: 'Координатное сжатие, отложенные операции, оффлайн-обработка',
    content: `# Олимпиадные приёмы

## Координатное сжатие

\`\`\`cpp
// Замена больших координат на маленькие
vector<int> a = {1000000, 1, 500000, 1, 1000000};
vector<int> sorted_unique = a;
sort(sorted_unique.begin(), sorted_unique.end());
sorted_unique.erase(unique(sorted_unique.begin(),
    sorted_unique.end()), sorted_unique.end());

for (int& x : a) {
    x = lower_bound(sorted_unique.begin(),
        sorted_unique.end(), x) - sorted_unique.begin();
}
// a = {2, 0, 1, 0, 2}
\`\`\`

## Скользящее окно максимума (deque)

\`\`\`cpp
vector<int> slidingMax(vector<int>& a, int k) {
    deque<int> dq;
    vector<int> result;

    for (int i = 0; i < a.size(); i++) {
        while (!dq.empty() && dq.front() <= i - k)
            dq.pop_front();
        while (!dq.empty() && a[dq.back()] <= a[i])
            dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1)
            result.push_back(a[dq.front()]);
    }
    return result;
}
\`\`\`

## Разреженная таблица (Sparse Table)

\`\`\`cpp
// RMQ (Range Minimum Query) за O(1) после O(n log n) построения
const int LOG = 20;
int sparse[LOG][200001];

void build(vector<int>& a) {
    int n = a.size();
    for (int i = 0; i < n; i++) sparse[0][i] = a[i];
    for (int j = 1; j < LOG; j++)
        for (int i = 0; i + (1 << j) <= n; i++)
            sparse[j][i] = min(sparse[j-1][i],
                sparse[j-1][i + (1 << (j-1))]);
}

int query(int l, int r) { // [l, r]
    int j = __lg(r - l + 1);
    return min(sparse[j][l], sparse[j][r - (1 << j) + 1]);
}
\`\`\`

## Быстрый ввод

\`\`\`cpp
// Для очень больших входных данных
inline int readInt() {
    int x = 0; char c = getchar();
    while (c < '0' || c > '9') c = getchar();
    while (c >= '0' && c <= '9') {
        x = x * 10 + c - '0';
        c = getchar();
    }
    return x;
}
\`\`\``,
    duration: 55,
    assignments: [
      {
        title: 'Максимум в скользящем окне',
        description: 'Считайте N и K, затем N чисел. Для каждого окна длины K выведите максимум. Используйте deque.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Скользящее окно с deque\n    return 0;\n}\n',
        testCases: [
          { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7', description: 'Максимумы окон' },
          { input: '5 1\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', description: 'Окно 1 — сами элементы' },
          { input: '3 3\n5 3 1', expectedOutput: '5', description: 'Одно окно' },
        ],
        points: 10,
      },
      {
        title: 'Координатное сжатие',
        description: 'Считайте N чисел. Замените каждое число его рангом в отсортированном порядке (0-based, уникальные). Выведите сжатые координаты через пробел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Координатное сжатие\n    return 0;\n}\n',
        testCases: [
          { input: '5\n100 1 50 1 100', expectedOutput: '2 0 1 0 2', description: '1->0, 50->1, 100->2' },
          { input: '3\n5 3 1', expectedOutput: '2 1 0', description: '1->0, 3->1, 5->2' },
          { input: '4\n7 7 7 7', expectedOutput: '0 0 0 0', description: 'Все одинаковые' },
        ],
        points: 10,
      },
      {
        title: 'Sparse Table: минимум на отрезке',
        description: 'Считайте N чисел и Q запросов (l, r) (1-based). Для каждого запроса выведите минимум на отрезке [l, r]. Используйте Sparse Table для O(1) на запрос.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <cmath>\nusing namespace std;\n\nconst int LOG = 20;\nint sparse[LOG][200001];\n\nvoid build(vector<int>& a, int n) {\n    // Постройте Sparse Table\n}\n\nint query(int l, int r) {\n    // Ответьте на запрос минимума\n}\n\nint main() {\n    int n, q;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    build(a, n);\n    cin >> q;\n    // Обработайте запросы\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 4 1 5\n3\n1 3\n2 5\n1 5', expectedOutput: '1\n1\n1', description: 'Минимумы на отрезках' },
          { input: '4\n5 2 8 1\n2\n1 2\n3 4', expectedOutput: '2\n1', description: 'min(5,2)=2, min(8,1)=1' },
          { input: '1\n42\n1\n1 1', expectedOutput: '42', description: 'Один элемент' },
        ],
        points: 15,
      },
      {
        title: 'Два указателя: сумма пары',
        description: 'Считайте N отсортированных чисел и целевую сумму S. Выведите YES и два числа a b (a <= b), если существует пара с суммой S. Иначе — NO. Используйте два указателя за O(n).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    long long s;\n    cin >> n >> s;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Два указателя: left=0, right=n-1\n    return 0;\n}\n',
        testCases: [
          { input: '5 9\n1 2 4 5 7', expectedOutput: 'YES\n2 7', description: '2 + 7 = 9' },
          { input: '4 10\n1 2 3 4', expectedOutput: 'NO', description: 'Нет пары' },
          { input: '3 6\n1 3 5', expectedOutput: 'YES\n1 5', description: '1 + 5 = 6' },
        ],
        points: 15,
      },
      {
        title: 'Количество различных сумм подотрезков',
        description: 'Считайте N чисел. Подсчитайте количество различных сумм непрерывных подотрезков. Используйте префиксные суммы и set для хранения уникальных разностей.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Вычислите все суммы подотрезков через prefix sums\n    // Используйте set для уникальных значений\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '5', description: '1,2,3,3,5,6 -> уникальных 5: {1,2,3,5,6}' },
          { input: '2\n1 1', expectedOutput: '2', description: '{1, 2}' },
          { input: '4\n1 2 1 2', expectedOutput: '5', description: '{1,2,3,4,6} -> 5 уникальных' },
        ],
        points: 25,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 20: Итоговый проект
  // ──────────────────────────────────────────
  {
    slug: 'cpp-final-project',
    title: 'Итоговый проект: комплексная задача',
    description: 'Применение всех изученных структур данных и алгоритмов',
    content: `# Итоговый проект

## Обзор курса

| Тема | Инструменты C++ |
|------|----------------|
| STL контейнеры | vector, set, map, deque, priority_queue |
| Указатели | &, *, new/delete, ссылки |
| Сортировки | sort, stable_sort, nth_element |
| Рекурсия | backtracking, разделяй и властвуй |
| DP | 1D, 2D, bitmask DP |
| Графы | BFS, DFS, Дейкстра |
| Деревья | диаметр, LCA |
| Строки | Z-функция, КМП, хеширование |
| Теория чисел | решето, модулярная арифметика |
| Жадные | активности, покрытие |
| Бин. поиск | по ответу |
| Биты | маски, XOR, popcount |
| Шаблоны | template, обобщённый код |

## Ключевые приёмы

\`\`\`cpp
// 1. Всегда начинать с
ios_base::sync_with_stdio(false);
cin.tie(NULL);

// 2. Использовать long long для произведений
long long prod = (long long)a * b;

// 3. Бинарный поиск — lower_bound, upper_bound

// 4. Сортировка с лямбдой

// 5. set для уникальных, map для частот

// 6. priority_queue для жадных

// 7. vector<vector<int>> для графов
\`\`\`

## Стратегия олимпиады

1. **Прочитайте все задачи** — начните с лёгких
2. **Оцените сложность** — n ≤ 10⁵ → O(n log n)
3. **Напишите наивное решение** для тестирования
4. **Оптимизируйте** — если нужно
5. **Тестируйте** — граничные случаи, большие входы`,
    duration: 60,
    assignments: [
      {
        title: 'Комплексная задача C++',
        description: 'Считайте N точек (xi, yi). Найдите минимальное расстояние между двумя точками. Выведите с точностью 6 знаков.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <cmath>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите минимальное расстояние\n    return 0;\n}\n',
        testCases: [
          { input: '3\n0 0\n3 4\n1 1', expectedOutput: '1.414214', description: 'sqrt(2)' },
          { input: '2\n0 0\n5 0', expectedOutput: '5.000000', description: '5' },
          { input: '4\n0 0\n10 10\n1 0\n0 1', expectedOutput: '1.000000', description: '(0,0)-(1,0)' },
        ],
        points: 10,
      },
      {
        title: 'Суммарная статистика',
        description: 'Считайте N чисел. Выведите на отдельных строках: минимум, максимум, сумму, среднее (с 2 знаками). Используйте STL алгоритмы.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // Выведите min, max, sum, average\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: '1\n5\n15\n3.00', description: 'Базовая статистика' },
          { input: '3\n10 20 30', expectedOutput: '10\n30\n60\n20.00', description: 'Кратные 10' },
          { input: '1\n42', expectedOutput: '42\n42\n42\n42.00', description: 'Один элемент' },
        ],
        points: 10,
      },
      {
        title: 'Матричное умножение',
        description: 'Считайте размеры двух матриц A (N×M) и B (M×K) и их элементы. Выведите произведение A×B (N×K), элементы через пробел, строки через перевод строки.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m, k;\n    cin >> n >> m;\n    vector<vector<int>> A(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) cin >> A[i][j];\n    cin >> m >> k;\n    vector<vector<int>> B(m, vector<int>(k));\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < k; j++) cin >> B[i][j];\n    // Вычислите и выведите произведение\n    return 0;\n}\n',
        testCases: [
          { input: '2 3\n1 2 3\n4 5 6\n3 2\n7 8\n9 10\n11 12', expectedOutput: '58 64\n139 154', description: '2x3 * 3x2 = 2x2' },
          { input: '1 2\n1 2\n2 1\n3\n4', expectedOutput: '11', description: '1x2 * 2x1 = 1x1' },
          { input: '2 2\n1 0\n0 1\n2 2\n5 6\n7 8', expectedOutput: '5 6\n7 8', description: 'Единичная матрица' },
        ],
        points: 15,
      },
      {
        title: 'Граф: мосты',
        description: 'Считайте N вершин и M рёбер неориентированного графа. Выведите количество мостов (рёбер, удаление которых увеличивает компоненты связности). Используйте алгоритм поиска мостов за O(N+M).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<vector<pair<int,int>>> g;\nvector<int> tin, low;\nvector<bool> visited;\nint timer_val = 0;\nint bridges = 0;\n\nvoid dfs(int v, int parentEdge) {\n    visited[v] = true;\n    tin[v] = low[v] = timer_val++;\n    // Обойдите соседей, обновите low, проверьте мосты\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Считайте рёбра и найдите мосты\n    return 0;\n}\n',
        testCases: [
          { input: '4 4\n1 2\n2 3\n3 1\n3 4', expectedOutput: '1', description: 'Мост: 3-4' },
          { input: '3 3\n1 2\n2 3\n3 1', expectedOutput: '0', description: 'Цикл — нет мостов' },
          { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '3', description: 'Цепочка — все 3 моста' },
        ],
        points: 15,
      },
      {
        title: 'Комплексная олимпиадная задача',
        description: 'Считайте N, M и K. Дана сетка N×M с числами. Найдите путь из (1,1) в (N,M) (вправо/вниз), посещая ровно K клеток с максимальными значениями. Выведите максимальную сумму этих K клеток на пути. Используйте DP с тремя параметрами: dp[i][j][cnt].',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, k;\n    cin >> n >> m >> k;\n    vector<vector<int>> grid(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) cin >> grid[i][j];\n    // DP: dp[i][j][cnt] — макс сумма, если пришли в (i,j) и выбрали cnt клеток\n    // Переход: из (i-1,j) или (i,j-1), cnt или cnt-1 если берём текущую клетку\n    return 0;\n}\n',
        testCases: [
          { input: '3 3 2\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '15', description: 'Лучший путь: выбрать 6 и 9 = 15' },
          { input: '2 2 1\n1 10\n10 1', expectedOutput: '10', description: 'Выбрать одну клетку: max=10' },
          { input: '2 3 2\n1 5 1\n1 1 5', expectedOutput: '10', description: 'Путь через 5 и 5' },
        ],
        points: 25,
      },
    ],
  },
];
