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
    assignment: {
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
    assignment: {
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
    assignment: {
      title: 'Кастомная сортировка',
      description: 'Считайте N, затем N пар (имя, балл). Отсортируйте по баллу убыванию, при равенстве — по имени. Выведите имена по одному на строке.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте пары и отсортируйте\n    return 0;\n}\n',
      testCases: [
        { input: '3\nAlice 90\nBob 85\nCharlie 90', expectedOutput: 'Alice\nCharlie\nBob', description: 'Alice и Charlie по 90 (алф.), Bob 85' },
        { input: '2\nZack 100\nAmy 100', expectedOutput: 'Amy\nZack', description: 'Одинаковый балл — по алфавиту' },
        { input: '1\nSolo 50', expectedOutput: 'Solo', description: 'Один ученик' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Частотный словарь',
      description: 'Считайте N слов. Для каждого уникального слова выведите количество вхождений, отсортировав по алфавиту.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <map>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте частоты слов\n    return 0;\n}\n',
      testCases: [
        { input: '5\napple banana apple cherry banana', expectedOutput: 'apple 2\nbanana 2\ncherry 1', description: 'Частоты по алфавиту' },
        { input: '3\naa aa aa', expectedOutput: 'aa 3', description: 'Одно слово' },
        { input: '4\ndog cat bird ant', expectedOutput: 'ant 1\nbird 1\ncat 1\ndog 1', description: 'Все уникальны' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Проверка скобок (C++)',
      description: 'Считайте строку из скобок ()[]{}. Выведите YES если правильная, NO иначе.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте скобки\n    return 0;\n}\n',
      testCases: [
        { input: '({[]})', expectedOutput: 'YES', description: 'Правильная' },
        { input: '([)]', expectedOutput: 'NO', description: 'Неправильная' },
        { input: '', expectedOutput: 'YES', description: 'Пустая' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Быстрое возведение в степень (C++)',
      description: 'Считайте base, exp, mod. Вычислите base^exp mod mod.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long base, exp, mod;\n    cin >> base >> exp >> mod;\n    // Быстрое возведение\n    return 0;\n}\n',
      testCases: [
        { input: '2 10 1000', expectedOutput: '24', description: '2^10 mod 1000 = 24' },
        { input: '3 100 1000000007', expectedOutput: '981147432', description: 'Большой показатель' },
        { input: '5 0 7', expectedOutput: '1', description: 'n^0 = 1' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Рюкзак 0/1 (C++)',
      description: 'Считайте N и W, затем N пар (вес, стоимость). Выведите макс. стоимость.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, W;\n    cin >> n >> W;\n    // Решите задачу рюкзака\n    return 0;\n}\n',
      testCases: [
        { input: '4 8\n2 3\n3 4\n4 5\n5 6', expectedOutput: '10', description: 'Макс стоимость при весе 8' },
        { input: '1 10\n5 100', expectedOutput: '100', description: 'Один предмет' },
        { input: '3 5\n3 10\n4 15\n2 7', expectedOutput: '17', description: '10+7=17, вес 3+2=5' },
      ],
      points: 20,
    },
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
    assignment: {
      title: 'Количество путей в таблице',
      description: 'Считайте N и M. Выведите количество путей из (1,1) в (N,M), если можно двигаться только вправо или вниз.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Подсчитайте количество путей\n    return 0;\n}\n',
      testCases: [
        { input: '3 3', expectedOutput: '6', description: '6 путей в таблице 3×3' },
        { input: '2 2', expectedOutput: '2', description: '2 пути: →↓ и ↓→' },
        { input: '1 5', expectedOutput: '1', description: 'Только вправо' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Кратчайший путь BFS (C++)',
      description: 'Считайте N, M, S, T и M рёбер. Выведите длину кратчайшего пути из S в T. Если нет — -1.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    // BFS из s\n    return 0;\n}\n',
      testCases: [
        { input: '5 4 1 5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: '1→2→3→4→5' },
        { input: '4 3 1 4\n1 2\n2 3\n1 3', expectedOutput: '-1', description: 'Нет пути' },
        { input: '3 2 1 3\n1 2\n2 3', expectedOutput: '2', description: '1→2→3' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Дейкстра (C++)',
      description: 'Считайте N, M, S. Затем M рёбер (u v w). Выведите кратчайшие расстояния от S до всех вершин (-1 если недостижима).',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m, s;\n    cin >> n >> m >> s;\n    // Алгоритм Дейкстры\n    return 0;\n}\n',
      testCases: [
        { input: '4 5 1\n1 2 1\n1 3 4\n2 3 2\n2 4 6\n3 4 3', expectedOutput: '0 1 3 6', description: 'Кратчайшие расстояния от 1' },
        { input: '3 2 1\n1 2 5\n2 3 3', expectedOutput: '0 5 8', description: 'Линейный граф' },
        { input: '2 0 1', expectedOutput: '0 -1', description: 'Нет рёбер' },
      ],
      points: 20,
    },
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
    assignment: {
      title: 'Поиск подстроки (Z-функция)',
      description: 'Считайте текст T и шаблон P. Выведите количество вхождений P в T.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string t, p;\n    cin >> t >> p;\n    // Z-функция для поиска\n    return 0;\n}\n',
      testCases: [
        { input: 'aaaa\naa', expectedOutput: '3', description: '3 вхождения' },
        { input: 'abcabcabc\nabc', expectedOutput: '3', description: '3 вхождения' },
        { input: 'hello\nworld', expectedOutput: '0', description: 'Нет вхождений' },
      ],
      points: 20,
    },
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
    assignment: {
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
    assignment: {
      title: 'Диаметр дерева (C++)',
      description: 'Считайте N, затем N-1 рёбер. Выведите диаметр дерева.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите диаметр\n    return 0;\n}\n',
      testCases: [
        { input: '5\n1 2\n2 3\n3 4\n4 5', expectedOutput: '4', description: 'Цепочка, диаметр 4' },
        { input: '5\n1 2\n1 3\n1 4\n1 5', expectedOutput: '2', description: 'Звезда, диаметр 2' },
        { input: '2\n1 2', expectedOutput: '1', description: 'Два узла' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Шаблонный стек',
      description: 'Реализуйте шаблонный стек. Считайте N операций: PUSH x (добавить), POP (удалить и вывести), TOP (вывести верхний). Тип данных — int.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\ntemplate<typename T>\nclass Stack {\n    // Реализуйте стек\n};\n\nint main() {\n    int n;\n    cin >> n;\n    Stack<int> st;\n    // Обработайте операции\n    return 0;\n}\n',
      testCases: [
        { input: '5\nPUSH 3\nPUSH 5\nTOP\nPOP\nTOP', expectedOutput: '5\n5\n3', description: 'TOP=5, POP=5, TOP=3' },
        { input: '3\nPUSH 42\nTOP\nPOP', expectedOutput: '42\n42', description: 'Один элемент' },
        { input: '4\nPUSH 1\nPUSH 2\nPOP\nPOP', expectedOutput: '2\n1', description: 'LIFO порядок' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Непересекающиеся отрезки (C++)',
      description: 'Считайте N, затем N пар (начало, конец). Выведите максимум непересекающихся отрезков.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Жадный алгоритм\n    return 0;\n}\n',
      testCases: [
        { input: '5\n1 3\n2 5\n4 7\n6 9\n8 10', expectedOutput: '3', description: '[1,3],[4,7],[8,10]' },
        { input: '3\n1 10\n2 3\n4 5', expectedOutput: '2', description: '[2,3],[4,5]' },
        { input: '1\n1 100', expectedOutput: '1', description: 'Один отрезок' },
      ],
      points: 15,
    },
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
    assignment: {
      title: 'Верёвки (C++)',
      description: 'Считайте N и K, затем N длин верёвок. Найдите макс. целую длину куска для K кусков.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Бинарный поиск по ответу\n    return 0;\n}\n',
      testCases: [
        { input: '4 11\n802 743 457 539', expectedOutput: '200', description: '4+3+2+2=11 кусков по 200' },
        { input: '1 1\n100', expectedOutput: '100', description: 'Одна верёвка' },
        { input: '2 4\n10 10', expectedOutput: '5', description: '10/5=2+10/5=2=4' },
      ],
      points: 20,
    },
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
    assignment: {
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
    assignment: {
      title: 'Количество перестановок с условием',
      description: 'Считайте N. Выведите количество перестановок чисел 1..N, в которых ни одно число не стоит на своём месте (беспорядки).',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Формула беспорядков: D(n) = (n-1)*(D(n-1) + D(n-2))\n    return 0;\n}\n',
      testCases: [
        { input: '3', expectedOutput: '2', description: 'D(3) = 2: (2,3,1) и (3,1,2)' },
        { input: '4', expectedOutput: '9', description: 'D(4) = 9' },
        { input: '1', expectedOutput: '0', description: 'D(1) = 0' },
      ],
      points: 20,
    },
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
    assignment: {
      title: 'Максимум в скользящем окне',
      description: 'Считайте N и K, затем N чисел. Для каждого окна длины K выведите максимум. Используйте deque.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Скользящее окно с deque\n    return 0;\n}\n',
      testCases: [
        { input: '8 3\n1 3 -1 -3 5 3 6 7', expectedOutput: '3 3 5 5 6 7', description: 'Максимумы окон' },
        { input: '5 1\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', description: 'Окно 1 — сами элементы' },
        { input: '3 3\n5 3 1', expectedOutput: '5', description: 'Одно окно' },
      ],
      points: 20,
    },
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
    assignment: {
      title: 'Комплексная задача C++',
      description: 'Считайте N точек (xi, yi). Найдите минимальное расстояние между двумя точками. Выведите с точностью 6 знаков.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <cmath>\n#include <algorithm>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите минимальное расстояние\n    return 0;\n}\n',
      testCases: [
        { input: '3\n0 0\n3 4\n1 1', expectedOutput: '1.414214', description: 'sqrt(2)' },
        { input: '2\n0 0\n5 0', expectedOutput: '5.000000', description: '5' },
        { input: '4\n0 0\n10 10\n1 0\n0 1', expectedOutput: '1.000000', description: '(0,0)-(1,0)' },
      ],
      points: 20,
    },
  },
];
