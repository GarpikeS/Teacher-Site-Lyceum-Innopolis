// ============================================
// Grade 11 C++ — ЕГЭ по информатике
// 25 уроков, ~70 часов
// Задания ЕГЭ: 6, 12, 14, 16, 17, 24–27
// ============================================

export const cpp11Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Введение
  // ──────────────────────────────────────────
  {
    slug: 'ege-cpp-intro',
    title: 'C++ на ЕГЭ: особенности и настройка',
    description: 'Преимущества C++ на ЕГЭ, компиляция, ввод-вывод, шаблон решения',
    content: `# C++ на ЕГЭ: особенности и настройка

## Почему C++ на ЕГЭ?

| Критерий | C++ | Python |
|----------|-----|--------|
| Скорость | Очень быстрый | Медленнее в 10–100 раз |
| Типизация | Строгая | Динамическая |
| Переполнение | Возможно! | Нет |
| Сложность синтаксиса | Выше | Ниже |

C++ выбирают, когда важна **скорость** — особенно в заданиях 26–27.

## Шаблон решения

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;

    vector<int> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    // Решение
    int result = 0;
    for (int x : a) {
        if (x % 2 == 0) result += x;
    }

    cout << result << endl;
    return 0;
}
\`\`\`

## Быстрый ввод-вывод

\`\`\`cpp
// ОБЯЗАТЕЛЬНО в начале main:
ios_base::sync_with_stdio(false);
cin.tie(NULL);

// Чтение до конца файла
int x;
while (cin >> x) {
    // обработка
}
\`\`\`

## Типы данных и переполнение

\`\`\`cpp
int       // ±2·10⁹ (32 бита)
long long // ±9·10¹⁸ (64 бита)

// ВНИМАНИЕ: переполнение!
int a = 1000000;
int b = a * a;        // ПЕРЕПОЛНЕНИЕ!
long long c = (long long)a * a;  // OK
\`\`\`

## Полезные заголовки

\`\`\`cpp
#include <iostream>    // cin, cout
#include <vector>      // vector
#include <algorithm>   // sort, min, max
#include <string>      // string
#include <cmath>       // sqrt, pow, abs
#include <set>         // set, multiset
#include <map>         // map
#include <queue>       // queue, priority_queue
#include <stack>       // stack
#include <functional>  // greater<>
\`\`\``,
    duration: 45,
    egeTopic: 'Введение',
    egeTaskNumber: null,
    assignment: {
      title: 'Сумма чётных и количество нечётных',
      description: 'Считайте N, затем N целых чисел. Выведите сумму чётных и количество нечётных через пробел.',
      difficulty: 'easy',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Считайте N, затем N чисел\n    // Выведите сумму чётных и кол-во нечётных\n    return 0;\n}\n',
      testCases: [
        { input: '5\n1 2 3 4 5', expectedOutput: '6 3', description: 'Чётные 2+4=6, нечётных 3' },
        { input: '4\n2 4 6 8', expectedOutput: '20 0', description: 'Все чётные' },
        { input: '3\n1 3 5', expectedOutput: '0 3', description: 'Все нечётные' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 2: Задание 6 — Исполнители
  // ──────────────────────────────────────────
  {
    slug: 'ege6-cpp-executors',
    title: 'Задание 6: Исполнители на C++',
    description: 'Моделирование исполнителей, подсчёт программ через DP',
    content: `# Задание 6: Исполнители на C++

## Подсчёт программ (DP)

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    // dp[i] = количество программ, дающих число i
    vector<long long> dp(b + 1, 0);
    dp[a] = 1;

    for (int i = a; i < b; i++) {
        if (dp[i] == 0) continue;
        if (i + 1 <= b) dp[i + 1] += dp[i]; // +1
        if (i * 2 <= b) dp[i * 2] += dp[i]; // *2
    }

    cout << dp[b] << endl;
    return 0;
}
\`\`\`

## Кратчайшая программа (BFS)

\`\`\`cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    vector<int> dist(b + 1, -1);
    queue<int> q;
    dist[a] = 0;
    q.push(a);

    while (!q.empty()) {
        int v = q.front(); q.pop();
        if (v == b) break;

        // Команды: +1, +3, *2
        int next[] = {v + 1, v + 3, v * 2};
        for (int u : next) {
            if (u <= b && dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }

    cout << dist[b] << endl;
    return 0;
}
\`\`\`

## Исполнитель с запрещёнными числами

\`\`\`cpp
#include <iostream>
#include <vector>
#include <set>
using namespace std;

int main() {
    int a, b, k;
    cin >> a >> b >> k;

    set<int> forbidden;
    for (int i = 0; i < k; i++) {
        int x; cin >> x;
        forbidden.insert(x);
    }

    vector<long long> dp(b + 1, 0);
    dp[a] = 1;

    for (int i = a; i < b; i++) {
        if (dp[i] == 0 || forbidden.count(i)) continue;
        if (i + 1 <= b && !forbidden.count(i + 1))
            dp[i + 1] += dp[i];
        if (i * 2 <= b && !forbidden.count(i * 2))
            dp[i * 2] += dp[i];
    }

    cout << dp[b] << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Анализ алгоритмов',
    egeTaskNumber: 6,
    assignment: {
      title: 'Подсчёт программ исполнителя (C++)',
      description: 'Исполнитель: команды +1 и *2. Считайте A и B (A < B ≤ 50). Выведите количество программ, переводящих A в B.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // DP: подсчёт программ из a в b\n    return 0;\n}\n',
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
  // УРОК 3: Задание 6 — Продвинутые исполнители
  // ──────────────────────────────────────────
  {
    slug: 'ege6-cpp-executors-advanced',
    title: 'Задание 6: Исполнители — три команды и ограничения',
    description: 'Исполнители с тремя командами, BFS для кратчайшей программы',
    content: `# Задание 6: Исполнители — продвинутые задачи

## Три команды

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    vector<long long> dp(b + 1, 0);
    dp[a] = 1;

    for (int i = a; i < b; i++) {
        if (dp[i] == 0) continue;
        if (i + 1 <= b) dp[i + 1] += dp[i];
        if (i * 2 <= b) dp[i * 2] += dp[i];
        if (i * 3 <= b) dp[i * 3] += dp[i];
    }

    cout << dp[b] << endl;
    return 0;
}
\`\`\`

## Кратчайший путь с тремя командами

\`\`\`cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    vector<int> dist(b + 1, -1);
    queue<int> q;
    dist[a] = 0;
    q.push(a);

    while (!q.empty()) {
        int v = q.front(); q.pop();
        if (v == b) break;

        for (int u : {v + 1, v + 3, v * 2}) {
            if (u <= b && dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }

    cout << dist[b] << endl;
    return 0;
}
\`\`\`

## Обратный ход

\`\`\`cpp
// Когда целевое число большое, но начальное маленькое
// Идём от b к a, обращая операции
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    int steps = 0;
    while (b > a) {
        if (b % 2 == 0 && b / 2 >= a) {
            b /= 2;  // обратная к *2
        } else {
            b -= 1;  // обратная к +1
        }
        steps++;
    }
    cout << steps << endl;
    return 0;
}
\`\`\``,
    duration: 45,
    egeTopic: 'Анализ алгоритмов',
    egeTaskNumber: 6,
    assignment: {
      title: 'Кратчайшая программа (три команды)',
      description: 'Исполнитель: +1, +3, *2. Считайте A и B (A < B ≤ 1000). Найдите длину кратчайшей программы.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // BFS для кратчайшей программы\n    return 0;\n}\n',
      testCases: [
        { input: '1\n10', expectedOutput: '4', description: '1→2→4→7→10' },
        { input: '1\n100', expectedOutput: '8', description: 'Из 1 в 100 за 8 шагов' },
        { input: '5\n30', expectedOutput: '4', description: 'Из 5 в 30 за 4 шага' },
      ],
      points: 15,
      egeTaskNumber: 6,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 4: Задание 12 — Анализ алгоритмов
  // ──────────────────────────────────────────
  {
    slug: 'ege12-cpp-algorithms',
    title: 'Задание 12: Трассировка алгоритмов на C++',
    description: 'Анализ циклов, обработка цифр, моделирование программ',
    content: `# Задание 12: Трассировка алгоритмов на C++

## Обработка цифр числа

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int s = 0, k = 0;
    while (n > 0) {
        int d = n % 10;
        if (d % 2 == 0) s += d;
        else k++;
        n /= 10;
    }
    cout << s << " " << k << endl;
    return 0;
}
\`\`\`

## Перевод в двоичную систему

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;

    string result = "";
    while (n > 0) {
        result = to_string(n % 2) + result;
        n /= 2;
    }
    cout << result << endl;
    return 0;
}
\`\`\`

## Цикл с условием

\`\`\`cpp
// Наименьшее n, при котором сумма > 1000
#include <iostream>
using namespace std;

int main() {
    int n = 0, s = 0;
    while (s <= 1000) {
        n++;
        s += n * n;
    }
    cout << n << endl;
    return 0;
}
\`\`\`

## Алгоритм Евклида

\`\`\`cpp
int gcd(int a, int b) {
    while (b) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Подсчёт шагов
int gcd_steps(int a, int b) {
    int steps = 0;
    while (b) {
        int temp = b;
        b = a % b;
        a = temp;
        steps++;
    }
    return steps;
}
\`\`\``,
    duration: 45,
    egeTopic: 'Алгоритмы обработки информации',
    egeTaskNumber: 12,
    assignment: {
      title: 'Сумма чётных цифр и количество нечётных',
      description: 'Считайте число N. Выведите сумму чётных цифр и количество нечётных цифр числа N через пробел.',
      difficulty: 'easy',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Обработайте цифры числа\n    return 0;\n}\n',
      testCases: [
        { input: '123456', expectedOutput: '12 3', description: 'Чётные: 2+4+6=12, нечётные: 1,3,5' },
        { input: '2468', expectedOutput: '20 0', description: 'Все цифры чётные' },
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
    slug: 'ege12-cpp-advanced',
    title: 'Задание 12: Вложенные циклы и перебор',
    description: 'Перебор пар, подсчёт делителей, побитовые операции',
    content: `# Задание 12: Вложенные циклы и перебор

## Подсчёт пар с условием

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int count = 0;
    for (int i = 1; i < 100; i++) {
        for (int j = i + 1; j < 100; j++) {
            if ((i + j) % 7 == 0 && (i * j) % 3 == 0)
                count++;
        }
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## Подсчёт делителей

\`\`\`cpp
int count_divisors(int n) {
    int count = 0;
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            count++;
            if (i != n / i) count++;
        }
    }
    return count;
}
\`\`\`

## Побитовые операции

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // Количество единиц в двоичной записи
    int count = 0;
    while (n > 0) {
        count += n & 1;
        n >>= 1;
    }
    cout << count << endl;

    // Или: __builtin_popcount(n) для int
    // __builtin_popcountll(n) для long long
    return 0;
}
\`\`\`

## Поиск входных данных перебором

\`\`\`cpp
// Найти x, для которого алгоритм выводит 120
#include <iostream>
using namespace std;

int main() {
    for (int x = 1; x < 10000; x++) {
        int n = x, s = 0;
        while (n > 0) {
            s += n % 10;
            n /= 10;
        }
        if (s == 120) {
            cout << x << endl;
            break;
        }
    }
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Алгоритмы обработки информации',
    egeTaskNumber: 12,
    assignment: {
      title: 'Шаги алгоритма Евклида (C++)',
      description: 'Считайте A и B. Выведите количество шагов алгоритма Евклида для НОД(A, B).',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Подсчитайте шаги алгоритма Евклида\n    return 0;\n}\n',
      testCases: [
        { input: '12\n8', expectedOutput: '3', description: '12,8 → 8,4 → 4,0 — 3 шага' },
        { input: '100\n75', expectedOutput: '3', description: '100,75 → 75,25 → 25,0 — 3 шага' },
        { input: '17\n13', expectedOutput: '3', description: '17,13 → 13,4 → 4,1 → 1,0 — 3 шага' },
      ],
      points: 15,
      egeTaskNumber: 12,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 6: Задание 14 — Системы счисления
  // ──────────────────────────────────────────
  {
    slug: 'ege14-cpp-number-systems',
    title: 'Задание 14: Системы счисления на C++',
    description: 'Перевод между системами, stoi, подсчёт цифр',
    content: `# Задание 14: Системы счисления на C++

## Перевод из десятичной в систему b

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

string toBase(int n, int base) {
    if (n == 0) return "0";
    string digits = "0123456789ABCDEF";
    string result = "";
    while (n > 0) {
        result = digits[n % base] + result;
        n /= base;
    }
    return result;
}

int main() {
    int n, b;
    cin >> n >> b;
    cout << toBase(n, b) << endl;
    return 0;
}
\`\`\`

## Перевод из системы b в десятичную

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int toDecimal(const string& s, int base) {
    int result = 0;
    for (char c : s) {
        int d;
        if (c >= '0' && c <= '9') d = c - '0';
        else d = c - 'A' + 10;
        result = result * base + d;
    }
    return result;
}

int main() {
    string s;
    int base;
    cin >> s >> base;
    cout << toDecimal(s, base) << endl;
    return 0;
}
\`\`\`

## Подсчёт единиц в двоичной записи

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    cout << __builtin_popcountll(n) << endl;

    // Или вручную:
    int count = 0;
    while (n > 0) {
        count += n & 1;
        n >>= 1;
    }
    return 0;
}
\`\`\`

## Поиск основания

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int n;
    string s;
    cin >> n >> s;

    for (int b = 2; b <= 36; b++) {
        int val = 0;
        bool valid = true;
        for (char c : s) {
            int d = (c >= '0' && c <= '9') ? c - '0' : c - 'A' + 10;
            if (d >= b) { valid = false; break; }
            val = val * b + d;
        }
        if (valid && val == n) {
            cout << b << endl;
            return 0;
        }
    }
    cout << -1 << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Системы счисления',
    egeTaskNumber: 14,
    assignment: {
      title: 'Перевод в заданную систему счисления',
      description: 'Считайте N и основание B. Выведите запись N в системе B (заглавные буквы для цифр > 9).',
      difficulty: 'easy',
      starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n, b;\n    cin >> n >> b;\n    // Переведите n в систему с основанием b\n    return 0;\n}\n',
      testCases: [
        { input: '255\n16', expectedOutput: 'FF', description: '255 → FF' },
        { input: '100\n2', expectedOutput: '1100100', description: '100 в двоичной' },
        { input: '42\n8', expectedOutput: '52', description: '42 в восьмеричной' },
      ],
      points: 10,
      egeTaskNumber: 14,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 7: Задание 14 — Продвинутые задачи
  // ──────────────────────────────────────────
  {
    slug: 'ege14-cpp-advanced',
    title: 'Задание 14: Системы счисления — задачи ЕГЭ',
    description: 'Арифметика в разных системах, поиск оснований, палиндромы',
    content: `# Задание 14: Системы счисления — задачи ЕГЭ

## Арифметика в разных системах

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int fromBase(const string& s, int base) {
    int r = 0;
    for (char c : s) {
        int d = (c >= '0' && c <= '9') ? c - '0' : c - 'A' + 10;
        r = r * base + d;
    }
    return r;
}

int main() {
    // 101011₂ + 2A₁₆ = ?
    int a = fromBase("101011", 2);  // 43
    int b = fromBase("2A", 16);     // 42
    cout << a + b << endl;          // 85
    return 0;
}
\`\`\`

## Палиндромы в разных системах

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> toDigits(int n, int base) {
    vector<int> d;
    while (n > 0) {
        d.push_back(n % base);
        n /= base;
    }
    return d;
}

bool isPalindrome(const vector<int>& d) {
    int n = d.size();
    for (int i = 0; i < n / 2; i++)
        if (d[i] != d[n - 1 - i]) return false;
    return true;
}

int main() {
    int n;
    cin >> n;
    // Найти числа до n — палиндромы в системе 4 с 5 разрядами
    for (int x = 256; x < min(n + 1, 1024); x++) {
        auto d = toDigits(x, 4);
        if (d.size() == 5 && isPalindrome(d))
            cout << x << endl;
    }
    return 0;
}
\`\`\`

## Количество цифр числа в системе b

\`\`\`cpp
int digitCount(int n, int base) {
    if (n == 0) return 1;
    int count = 0;
    while (n > 0) {
        count++;
        n /= base;
    }
    return count;
}

// Последняя цифра: n % base
// Предпоследняя: (n / base) % base
\`\`\``,
    duration: 50,
    egeTopic: 'Системы счисления',
    egeTaskNumber: 14,
    assignment: {
      title: 'Поиск основания системы (C++)',
      description: 'Считайте десятичное число N и строку S — его запись в неизвестной системе. Найдите основание B (2 ≤ B ≤ 36). Если нет — выведите -1.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    string s;\n    cin >> n >> s;\n    // Найдите основание\n    return 0;\n}\n',
      testCases: [
        { input: '63\n120', expectedOutput: '7', description: '120₇ = 49+14+0 = 63' },
        { input: '255\n11111111', expectedOutput: '2', description: '11111111₂ = 255' },
        { input: '100\n144', expectedOutput: '8', description: '144₈ = 64+32+4 = 100' },
      ],
      points: 15,
      egeTaskNumber: 14,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 8: Задание 16 — Рекурсия
  // ──────────────────────────────────────────
  {
    slug: 'ege16-cpp-recursion',
    title: 'Задание 16: Рекурсия на C++',
    description: 'Рекурсивные функции, стек, подсчёт вызовов, мемоизация',
    content: `# Задание 16: Рекурсия на C++

## Основы рекурсии

\`\`\`cpp
#include <iostream>
using namespace std;

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Сумма цифр
int digitSum(int n) {
    if (n < 10) return n;
    return n % 10 + digitSum(n / 10);
}
\`\`\`

## Подсчёт вызовов

\`\`\`cpp
#include <iostream>
using namespace std;

int callCount = 0;

int f(int n) {
    callCount++;
    if (n <= 1) return 1;
    return f(n - 1) + f(n / 2);
}

int main() {
    int n;
    cin >> n;
    f(n);
    cout << callCount << endl;
    return 0;
}
\`\`\`

## Мемоизация с массивом

\`\`\`cpp
#include <iostream>
#include <map>
using namespace std;

map<int, long long> memo;

long long f(int n) {
    if (n <= 2) return n;
    if (memo.count(n)) return memo[n];
    memo[n] = f(n - 1) + 2 * f(n - 2);
    return memo[n];
}

int main() {
    int n;
    cin >> n;
    cout << f(n) << endl;
    return 0;
}
\`\`\`

## Двойная рекурсия

\`\`\`cpp
#include <iostream>
using namespace std;

void f(int n) {
    if (n > 0) {
        f(n - 2);
        cout << n << " ";
        f(n - 1);
    }
}

int main() {
    f(4);  // Вывод: 2 1 4 1 3 2 1
    return 0;
}
\`\`\`

## Переполнение стека

\`\`\`cpp
// В C++ стек ограничен (~1-8 МБ)
// Рекурсия глубиной > 10000 может привести к crash
// Решение: заменить на итерацию или увеличить стек

// Итеративная версия Фибоначчи
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
\`\`\``,
    duration: 50,
    egeTopic: 'Рекурсивные алгоритмы',
    egeTaskNumber: 16,
    assignment: {
      title: 'Подсчёт вызовов рекурсии (C++)',
      description: 'Считайте N. Дана функция:\nint f(int n) {\n    if (n <= 1) return 1;\n    return f(n - 1) + f(n / 2);\n}\nСколько раз вызовется f при вычислении f(N)?',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint callCount = 0;\n\nint f(int n) {\n    callCount++;\n    if (n <= 1) return 1;\n    return f(n - 1) + f(n / 2);\n}\n\nint main() {\n    int n;\n    cin >> n;\n    f(n);\n    cout << callCount << endl;\n    return 0;\n}\n',
      testCases: [
        { input: '1', expectedOutput: '1', description: 'f(1) — 1 вызов' },
        { input: '4', expectedOutput: '9', description: 'f(4) — 9 вызовов' },
        { input: '7', expectedOutput: '25', description: 'f(7) — 25 вызовов' },
      ],
      points: 15,
      egeTaskNumber: 16,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 9: Задание 16 — Рекурсия (продвинутый)
  // ──────────────────────────────────────────
  {
    slug: 'ege16-cpp-recursion-advanced',
    title: 'Задание 16: Рекурсия — взаимная и с мемоизацией',
    description: 'Взаимная рекурсия, замена итерацией, оптимизация',
    content: `# Задание 16: Рекурсия — продвинутые задачи

## Взаимная рекурсия

\`\`\`cpp
#include <iostream>
using namespace std;

int g(int n); // предварительное объявление

int f(int n) {
    if (n <= 0) return 1;
    return f(n - 1) + g(n - 1);
}

int g(int n) {
    if (n <= 0) return 0;
    return g(n - 1) + f(n - 2);
}

int main() {
    cout << f(5) << endl;
    return 0;
}
\`\`\`

## Мемоизация с массивом

\`\`\`cpp
#include <iostream>
using namespace std;

const int MAXN = 100001;
long long dp[MAXN];
bool computed[MAXN];

long long f(int n) {
    if (n <= 2) return n;
    if (computed[n]) return dp[n];
    computed[n] = true;
    dp[n] = f(n - 1) + 2 * f(n - 2);
    return dp[n];
}

int main() {
    int n;
    cin >> n;
    fill(computed, computed + n + 1, false);
    cout << f(n) << endl;
    return 0;
}
\`\`\`

## Замена рекурсии итерацией

\`\`\`cpp
// Рекурсивная версия:
// f(n) = f(n-1) + 2*f(n-2), f(1)=1, f(2)=2

// Итеративная версия:
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n <= 2) { cout << n; return 0; }

    long long prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        long long curr = prev1 + 2 * prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    cout << prev1 << endl;
    return 0;
}
\`\`\`

## Рекурсия и строки

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

string build(int n) {
    if (n == 0) return "A";
    if (n == 1) return "B";
    return build(n - 1) + build(n - 2);
}

int main() {
    cout << build(5) << endl;          // BABBABAB
    cout << build(5).length() << endl; // 8 (числа Фибоначчи!)
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Рекурсивные алгоритмы',
    egeTaskNumber: 16,
    assignment: {
      title: 'Рекурсия с мемоизацией (C++)',
      description: 'Считайте N. f(n) = f(n-1) + 2*f(n-2), f(1)=1, f(2)=2. Выведите f(N).',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Вычислите f(n) итеративно или с мемоизацией\n    return 0;\n}\n',
      testCases: [
        { input: '5', expectedOutput: '16', description: 'f(5) = 16' },
        { input: '3', expectedOutput: '4', description: 'f(3) = 2 + 2*1 = 4' },
        { input: '10', expectedOutput: '512', description: 'f(10) = 512' },
      ],
      points: 15,
      egeTaskNumber: 16,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 10: Задание 17 — Обработка данных
  // ──────────────────────────────────────────
  {
    slug: 'ege17-cpp-data-processing',
    title: 'Задание 17: Обработка числовых данных на C++',
    description: 'Чтение данных, фильтрация, максимум/минимум, агрегация',
    content: `# Задание 17: Обработка числовых данных на C++

## Чтение и обработка

\`\`\`cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;

    int maxVal = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % k == 0 && x > maxVal)
            maxVal = x;
    }
    cout << maxVal << endl;
    return 0;
}
\`\`\`

## Два максимума

\`\`\`cpp
#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;

    int max1 = INT_MIN, max2 = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x > max1) { max2 = max1; max1 = x; }
        else if (x > max2) max2 = x;
    }
    cout << max1 << " " << max2 << endl;
    return 0;
}
\`\`\`

## Пара с максимальным произведением

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    sort(a.begin(), a.end());
    long long opt1 = (long long)a[0] * a[1];
    long long opt2 = (long long)a[n-1] * a[n-2];
    cout << max(opt1, opt2) << endl;
    return 0;
}
\`\`\`

## Максимальная разность соседних

\`\`\`cpp
#include <iostream>
#include <cmath>
using namespace std;

int main() {
    int n;
    cin >> n;
    int prev;
    cin >> prev;

    int maxDiff = 0;
    for (int i = 1; i < n; i++) {
        int curr;
        cin >> curr;
        maxDiff = max(maxDiff, abs(curr - prev));
        prev = curr;
    }
    cout << maxDiff << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка числовых данных',
    egeTaskNumber: 17,
    assignment: {
      title: 'Максимум среди делящихся (C++)',
      description: 'Считайте N и K, затем N чисел. Выведите максимальное число, делящееся на K.',
      difficulty: 'easy',
      starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Найдите максимум среди делящихся на k\n    return 0;\n}\n',
      testCases: [
        { input: '5 3\n7 9 12 5 6', expectedOutput: '12', description: 'Делятся на 3: 9,12,6. Макс=12' },
        { input: '4 5\n10 25 7 15', expectedOutput: '25', description: 'Делятся на 5: 10,25,15. Макс=25' },
        { input: '3 2\n4 8 6', expectedOutput: '8', description: 'Все делятся на 2, макс=8' },
      ],
      points: 10,
      egeTaskNumber: 17,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 11: Задание 17 — Потоковая обработка
  // ──────────────────────────────────────────
  {
    slug: 'ege17-cpp-streaming',
    title: 'Задание 17: Потоковая обработка и серии',
    description: 'Обработка без хранения, серии одинаковых, условная агрегация',
    content: `# Задание 17: Потоковая обработка

## Без хранения всех данных

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int prev;
    cin >> prev;

    int maxDiff = 0;
    for (int i = 1; i < n; i++) {
        int curr;
        cin >> curr;
        int diff = abs(curr - prev);
        if (diff > maxDiff) maxDiff = diff;
        prev = curr;
    }
    cout << maxDiff << endl;
    return 0;
}
\`\`\`

## Длина самой длинной серии

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int prev;
    cin >> prev;
    int curLen = 1, maxLen = 1;

    for (int i = 1; i < n; i++) {
        int curr;
        cin >> curr;
        if (curr == prev) {
            curLen++;
            if (curLen > maxLen) maxLen = curLen;
        } else {
            curLen = 1;
        }
        prev = curr;
    }
    cout << maxLen << endl;
    return 0;
}
\`\`\`

## Пары чисел: два столбца

\`\`\`cpp
#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;

    int bestDay = -1;
    int bestTemp = INT_MIN;

    for (int i = 0; i < n; i++) {
        int day, temp;
        cin >> day >> temp;
        if (temp > bestTemp) {
            bestTemp = temp;
            bestDay = day;
        }
    }
    cout << bestDay << endl;
    return 0;
}
\`\`\`

## Среднее элементов больше предыдущего

\`\`\`cpp
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cin >> n;
    int prev;
    cin >> prev;

    long long total = 0;
    int count = 0;

    for (int i = 1; i < n; i++) {
        int curr;
        cin >> curr;
        if (curr > prev) {
            total += curr;
            count++;
        }
        prev = curr;
    }

    if (count > 0)
        cout << fixed << setprecision(1) << (double)total / count << endl;
    else
        cout << 0 << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка числовых данных',
    egeTaskNumber: 17,
    assignment: {
      title: 'Максимальная разность соседних (C++)',
      description: 'Считайте N, затем N чисел (по одному на строке). Найдите максимальную абсолютную разность между соседними элементами.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Потоковая обработка\n    return 0;\n}\n',
      testCases: [
        { input: '5\n1\n5\n3\n8\n2', expectedOutput: '6', description: '|8-2|=6' },
        { input: '3\n10\n10\n10', expectedOutput: '0', description: 'Все одинаковые' },
        { input: '4\n1\n100\n2\n99', expectedOutput: '99', description: '|1-100|=99' },
      ],
      points: 15,
      egeTaskNumber: 17,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 12: Задание 24 — Строки
  // ──────────────────────────────────────────
  {
    slug: 'ege24-cpp-strings',
    title: 'Задание 24: Обработка строк на C++',
    description: 'Строки в C++: find, substr, подсчёт вхождений',
    content: `# Задание 24: Обработка строк на C++

## Основы строк

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "Информатика";

    cout << s.length() << endl;     // 11
    cout << s[0] << endl;           // И
    cout << s.substr(0, 6) << endl; // Информ

    // Поиск
    size_t pos = s.find("мат");
    if (pos != string::npos)
        cout << "Найдено на позиции " << pos << endl;

    return 0;
}
\`\`\`

## Подсчёт вхождений (включая пересекающиеся)

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s, p;
    cin >> s >> p;

    int count = 0;
    for (size_t i = 0; i + p.length() <= s.length(); i++) {
        if (s.substr(i, p.length()) == p)
            count++;
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## Частота символов

\`\`\`cpp
#include <iostream>
#include <string>
#include <map>
using namespace std;

int main() {
    string s;
    cin >> s;

    map<char, int> freq;
    for (char c : s) freq[c]++;

    char best = s[0];
    for (auto& [ch, cnt] : freq) {
        if (cnt > freq[best]) best = ch;
    }
    cout << best << " " << freq[best] << endl;
    return 0;
}
\`\`\`

## Уникальные подстроки

\`\`\`cpp
#include <iostream>
#include <string>
#include <set>
using namespace std;

int main() {
    string s;
    int k;
    cin >> s >> k;

    set<string> subs;
    for (size_t i = 0; i + k <= s.length(); i++) {
        subs.insert(s.substr(i, k));
    }
    cout << subs.size() << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка символьных строк',
    egeTaskNumber: 24,
    assignment: {
      title: 'Пересекающиеся вхождения (C++)',
      description: 'Считайте строку S и подстроку P. Выведите количество всех вхождений P в S (включая пересекающиеся).',
      difficulty: 'easy',
      starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s, p;\n    cin >> s >> p;\n    // Подсчитайте вхождения\n    return 0;\n}\n',
      testCases: [
        { input: 'aaaa\naa', expectedOutput: '3', description: 'aa в aaaa: позиции 0,1,2' },
        { input: 'abcabc\nabc', expectedOutput: '2', description: 'abc дважды' },
        { input: 'ababab\nab', expectedOutput: '3', description: 'ab на позициях 0,2,4' },
      ],
      points: 10,
      egeTaskNumber: 24,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 13: Задание 24 — Строки (продвинутый)
  // ──────────────────────────────────────────
  {
    slug: 'ege24-cpp-strings-advanced',
    title: 'Задание 24: Строки — палиндромы и паттерны',
    description: 'Палиндромы, перебор строк, конечные автоматы',
    content: `# Задание 24: Строки — продвинутые задачи

## Палиндромы

\`\`\`cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

bool isPalindrome(const string& s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    return s == rev;
}

int main() {
    string s;
    cin >> s;

    // Все палиндромные подстроки длины >= 2
    set<string> palindromes;
    for (int i = 0; i < s.length(); i++) {
        for (int len = 2; i + len <= s.length(); len++) {
            string sub = s.substr(i, len);
            if (isPalindrome(sub))
                palindromes.insert(sub);
        }
    }
    cout << palindromes.size() << endl;
    return 0;
}
\`\`\`

## Подстроки без символа

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    int k;
    char c;
    cin >> s >> k >> c;

    int count = 0;
    for (size_t i = 0; i + k <= s.length(); i++) {
        bool ok = true;
        for (int j = 0; j < k; j++) {
            if (s[i + j] == c) { ok = false; break; }
        }
        if (ok) count++;
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## Перебор строк из алфавита

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int n, count_result = 0;
string chars = "abc";

void generate(string current) {
    if (current.length() == n) {
        if (current.find("abc") != string::npos)
            count_result++;
        return;
    }
    for (char c : chars)
        generate(current + c);
}

int main() {
    cin >> n;
    generate("");
    cout << count_result << endl;
    return 0;
}
\`\`\`

## Скользящее окно для строк

\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;

    // Длина наибольшей подстроки без повторов
    int maxLen = 0;
    for (int i = 0; i < s.length(); i++) {
        bool seen[256] = {};
        int j = i;
        while (j < s.length() && !seen[(int)s[j]]) {
            seen[(int)s[j]] = true;
            j++;
        }
        maxLen = max(maxLen, j - i);
    }
    cout << maxLen << endl;
    return 0;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка символьных строк',
    egeTaskNumber: 24,
    assignment: {
      title: 'Уникальные подстроки длины K (C++)',
      description: 'Считайте строку S и число K. Выведите количество различных подстрок длины K.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <string>\n#include <set>\nusing namespace std;\n\nint main() {\n    string s;\n    int k;\n    cin >> s >> k;\n    // Найдите количество различных подстрок\n    return 0;\n}\n',
      testCases: [
        { input: 'abcabc\n3', expectedOutput: '3', description: 'abc, bca, cab' },
        { input: 'aaaa\n2', expectedOutput: '1', description: 'Только "aa"' },
        { input: 'abcdef\n1', expectedOutput: '6', description: 'Все символы различны' },
      ],
      points: 15,
      egeTaskNumber: 24,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 14: Задание 25 — Делители
  // ──────────────────────────────────────────
  {
    slug: 'ege25-cpp-divisors',
    title: 'Задание 25: Делители и простые числа на C++',
    description: 'Делители, проверка простоты, факторизация, НОД/НОК',
    content: `# Задание 25: Делители и простые числа

## Нахождение делителей

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> divisors(int n) {
    vector<int> result;
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            result.push_back(i);
            if (i != n / i)
                result.push_back(n / i);
        }
    }
    return result;
}

int countDivisors(int n) {
    int count = 0;
    for (int i = 1; i * i <= n; i++) {
        if (n % i == 0) {
            count++;
            if (i != n / i) count++;
        }
    }
    return count;
}
\`\`\`

## Проверка простоты

\`\`\`cpp
bool isPrime(int n) {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0)
            return false;
    }
    return true;
}
\`\`\`

## Факторизация

\`\`\`cpp
vector<int> factorize(int n) {
    vector<int> factors;
    for (int d = 2; d * d <= n; d++) {
        while (n % d == 0) {
            factors.push_back(d);
            n /= d;
        }
    }
    if (n > 1) factors.push_back(n);
    return factors;
}
\`\`\`

## НОД и НОК

\`\`\`cpp
#include <algorithm> // __gcd (C++14+)

int gcd(int a, int b) {
    while (b) { a %= b; swap(a, b); }
    return a;
}

long long lcm(int a, int b) {
    return (long long)a / gcd(a, b) * b;
}
\`\`\`

## Решето Эратосфена

\`\`\`cpp
#include <vector>

vector<bool> sieve(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; i * i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i * i; j <= n; j += i)
                is_prime[j] = false;
        }
    }
    return is_prime;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка целочисленной информации',
    egeTaskNumber: 25,
    assignment: {
      title: 'Числа с K делителями (C++)',
      description: 'Считайте A, B и K. Выведите количество чисел в [A, B] с ровно K делителями.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b, k;\n    cin >> a >> b >> k;\n    // Подсчитайте числа с ровно k делителями\n    return 0;\n}\n',
      testCases: [
        { input: '1\n20\n4', expectedOutput: '5', description: '6,8,10,14,15 — 5 штук' },
        { input: '1\n10\n2', expectedOutput: '4', description: 'Простые: 2,3,5,7' },
        { input: '10\n30\n6', expectedOutput: '4', description: '12,18,20,28 — 4 штуки' },
      ],
      points: 15,
      egeTaskNumber: 25,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 15: Задание 25 — Цифры
  // ──────────────────────────────────────────
  {
    slug: 'ege25-cpp-digits',
    title: 'Задание 25: Работа с цифрами числа на C++',
    description: 'Сумма цифр, числа без определённых цифр, палиндромы',
    content: `# Задание 25: Работа с цифрами числа

## Извлечение цифр

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> getDigits(int n) {
    vector<int> digits;
    if (n == 0) return {0};
    while (n > 0) {
        digits.push_back(n % 10);
        n /= 10;
    }
    // digits в обратном порядке
    reverse(digits.begin(), digits.end());
    return digits;
}

int digitSum(int n) {
    int s = 0;
    while (n > 0) {
        s += n % 10;
        n /= 10;
    }
    return s;
}
\`\`\`

## Числа, делящиеся на сумму цифр

\`\`\`cpp
#include <iostream>
using namespace std;

int digitSum(int n) {
    int s = 0;
    while (n > 0) { s += n % 10; n /= 10; }
    return s;
}

int main() {
    int a, b;
    cin >> a >> b;

    int count = 0;
    for (int x = a; x <= b; x++) {
        int s = digitSum(x);
        if (s > 0 && x % s == 0)
            count++;
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## Все цифры различны

\`\`\`cpp
bool allDigitsUnique(int n) {
    bool seen[10] = {};
    while (n > 0) {
        int d = n % 10;
        if (seen[d]) return false;
        seen[d] = true;
        n /= 10;
    }
    return true;
}
\`\`\`

## Числа без определённой цифры

\`\`\`cpp
bool containsDigit(int n, int d) {
    while (n > 0) {
        if (n % 10 == d) return true;
        n /= 10;
    }
    return false;
}

// Числа от 1 до N без цифры d
int countWithout(int n, int d) {
    int count = 0;
    for (int x = 1; x <= n; x++)
        if (!containsDigit(x, d)) count++;
    return count;
}
\`\`\``,
    duration: 50,
    egeTopic: 'Обработка целочисленной информации',
    egeTaskNumber: 25,
    assignment: {
      title: 'Делимость на сумму цифр (C++)',
      description: 'Считайте A и B. Выведите количество чисел в [A, B], делящихся на сумму своих цифр.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Подсчитайте числа, делящиеся на сумму цифр\n    return 0;\n}\n',
      testCases: [
        { input: '1\n20', expectedOutput: '13', description: '1-9, 10, 12, 18, 20' },
        { input: '100\n110', expectedOutput: '4', description: '100, 102, 108, 110' },
        { input: '1\n9', expectedOutput: '9', description: 'Все однозначные' },
      ],
      points: 15,
      egeTaskNumber: 25,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 16: Задание 26 — Сортировка
  // ──────────────────────────────────────────
  {
    slug: 'ege26-cpp-sorting',
    title: 'Задание 26: Сортировка и бинарный поиск на C++',
    description: 'STL sort, lower_bound, upper_bound, два указателя',
    content: `# Задание 26: Сортировка и бинарный поиск

## STL сортировка

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    sort(a.begin(), a.end());              // по возрастанию
    sort(a.begin(), a.end(), greater<>()); // по убыванию

    // Сортировка пар
    vector<pair<int,int>> pairs;
    sort(pairs.begin(), pairs.end()); // по первому, затем второму
    return 0;
}
\`\`\`

## Бинарный поиск

\`\`\`cpp
#include <algorithm>

// lower_bound — первый >= x
// upper_bound — первый > x
auto it1 = lower_bound(a.begin(), a.end(), x);
auto it2 = upper_bound(a.begin(), a.end(), x);

// Количество элементов == x
int countEqual = upper_bound(a.begin(), a.end(), x)
               - lower_bound(a.begin(), a.end(), x);

// Количество элементов < x
int countLess = lower_bound(a.begin(), a.end(), x) - a.begin();

// Количество в диапазоне [lo, hi]
int countInRange = upper_bound(a.begin(), a.end(), hi)
                 - lower_bound(a.begin(), a.end(), lo);
\`\`\`

## Два указателя

\`\`\`cpp
// Пара с заданной суммой
int left = 0, right = n - 1;
while (left < right) {
    int s = a[left] + a[right];
    if (s == target) {
        cout << a[left] << " " << a[right] << endl;
        break;
    }
    if (s < target) left++;
    else right--;
}
\`\`\`

## Количество пар с разностью K

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int& x : a) cin >> x;
    sort(a.begin(), a.end());

    int count = 0;
    for (int i = 0; i < n; i++) {
        // Ищем a[j] = a[i] + k
        auto it = lower_bound(a.begin() + i + 1, a.end(), a[i] + k);
        if (it != a.end() && *it == a[i] + k)
            count++;
    }
    cout << count << endl;
    return 0;
}
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'Пары с разностью K (C++)',
      description: 'Считайте N и K, затем N чисел. Найдите количество пар (i, j), i < j, с |a[i] - a[j]| = K.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Эффективный подсчёт пар\n    return 0;\n}\n',
      testCases: [
        { input: '5 2\n1 3 5 7 9', expectedOutput: '4', description: '(1,3),(3,5),(5,7),(7,9)' },
        { input: '4 0\n1 1 1 1', expectedOutput: '6', description: 'C(4,2)=6' },
        { input: '3 10\n1 2 3', expectedOutput: '0', description: 'Нет пар' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 17: Задание 26 — DP
  // ──────────────────────────────────────────
  {
    slug: 'ege26-cpp-dp',
    title: 'Задание 26: Динамическое программирование на C++',
    description: 'Рюкзак, НВП, пути в таблице, префиксные суммы',
    content: `# Задание 26: DP на C++

## Рюкзак 0/1

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, W;
    cin >> n >> W;

    vector<int> w(n), v(n);
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];

    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++)
        for (int j = W; j >= w[i]; j--)
            dp[j] = max(dp[j], dp[j - w[i]] + v[i]);

    cout << dp[W] << endl;
    return 0;
}
\`\`\`

## НВП (Наибольшая возрастающая подпоследовательность)

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (a[j] < a[i])
                dp[i] = max(dp[i], dp[j] + 1);

    cout << *max_element(dp.begin(), dp.end()) << endl;
    return 0;
}
\`\`\`

## Пути в таблице

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    vector<vector<long long>> dp(n + 1, vector<long long>(m + 1, 0));
    dp[1][1] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (i == 1 && j == 1) continue;
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }

    cout << dp[n][m] << endl;
    return 0;
}
\`\`\`

## Префиксные суммы

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    vector<long long> prefix(n + 1, 0);
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] + a[i];

    // Сумма на [l, r] (0-indexed):
    // prefix[r + 1] - prefix[l]

    int l, r;
    cin >> l >> r;
    cout << prefix[r + 1] - prefix[l] << endl;
    return 0;
}
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'НВП (C++)',
      description: 'Считайте N, затем N чисел. Найдите длину наибольшей строго возрастающей подпоследовательности.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите длину НВП\n    return 0;\n}\n',
      testCases: [
        { input: '6\n3 1 4 1 5 9', expectedOutput: '4', description: '1,4,5,9 — длина 4' },
        { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — 1' },
        { input: '5\n1 2 3 4 5', expectedOutput: '5', description: 'Возрастающая — 5' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 18: Задание 26 — Графы
  // ──────────────────────────────────────────
  {
    slug: 'ege26-cpp-graphs',
    title: 'Задание 26: Графы на C++',
    description: 'BFS, DFS, компоненты связности, Дейкстра',
    content: `# Задание 26: Графы на C++

## Представление графа

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    vector<vector<int>> graph(n + 1);
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
    return 0;
}
\`\`\`

## BFS

\`\`\`cpp
#include <queue>

vector<int> bfs(const vector<vector<int>>& g, int start) {
    int n = g.size();
    vector<int> dist(n, -1);
    queue<int> q;
    dist[start] = 0;
    q.push(start);

    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : g[v]) {
            if (dist[u] == -1) {
                dist[u] = dist[v] + 1;
                q.push(u);
            }
        }
    }
    return dist;
}
\`\`\`

## DFS и компоненты связности

\`\`\`cpp
vector<bool> visited;

void dfs(const vector<vector<int>>& g, int v) {
    visited[v] = true;
    for (int u : g[v])
        if (!visited[u])
            dfs(g, u);
}

int countComponents(const vector<vector<int>>& g, int n) {
    visited.assign(n + 1, false);
    int count = 0;
    for (int v = 1; v <= n; v++) {
        if (!visited[v]) {
            dfs(g, v);
            count++;
        }
    }
    return count;
}
\`\`\`

## Алгоритм Дейкстры

\`\`\`cpp
#include <queue>
#include <climits>

vector<long long> dijkstra(const vector<vector<pair<int,int>>>& g,
                            int start, int n) {
    vector<long long> dist(n + 1, LLONG_MAX);
    priority_queue<pair<long long,int>,
                   vector<pair<long long,int>>,
                   greater<>> pq;

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
\`\`\``,
    duration: 55,
    egeTopic: 'Сортировка и эффективная обработка',
    egeTaskNumber: 26,
    assignment: {
      title: 'Компоненты связности (C++)',
      description: 'Считайте N и M, затем M рёбер. Выведите количество компонент связности.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<bool> visited;\n\nvoid dfs(const vector<vector<int>>& g, int v) {\n    // Реализуйте DFS\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Найдите количество компонент\n    return 0;\n}\n',
      testCases: [
        { input: '5 3\n1 2\n3 4\n4 5', expectedOutput: '2', description: '{1,2} и {3,4,5}' },
        { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1', description: 'Все связаны' },
        { input: '3 0', expectedOutput: '3', description: 'Нет рёбер' },
      ],
      points: 20,
      egeTaskNumber: 26,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 19: Задание 27 — Введение
  // ──────────────────────────────────────────
  {
    slug: 'ege27-cpp-intro',
    title: 'Задание 27: Сложная задача на C++',
    description: 'Стратегия решения, наивное vs эффективное, шаблон',
    content: `# Задание 27: Сложная задача на C++

## Стратегия

1. **Наивное решение** — O(n²) или O(n³) — даёт 2 балла
2. **Эффективное решение** — O(n log n) или O(n) — даёт 4 балла

## Шаблон

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    // Наивное решение (на 2 балла):
    long long result = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            // проверка и обновление result

    // Эффективное решение (на 4 балла):
    // sort, два указателя, map, set, DP...

    cout << result << endl;
    return 0;
}
\`\`\`

## Пример: максимальное произведение пары

### Наивное (2 балла):

\`\`\`cpp
int n, k;
cin >> n >> k;
vector<int> a(n);
for (int& x : a) cin >> x;

long long best = -1;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) {
        long long p = (long long)a[i] * a[j];
        if (p % k == 0 && p > best)
            best = p;
    }
cout << best << endl;
\`\`\`

### Эффективное (4 балла):

\`\`\`cpp
map<int, int> bestByRemainder;
long long best = -1;

for (int x : a) {
    int r = x % k;
    for (auto& [r2, val] : bestByRemainder) {
        if ((long long)r * r2 % k == 0) {
            best = max(best, (long long)x * val);
        }
    }
    if (!bestByRemainder.count(r) || x > bestByRemainder[r])
        bestByRemainder[r] = x;
}
cout << best << endl;
\`\`\`

## Преимущества C++ в задании 27

- **Скорость**: O(n log n) на C++ в 10 раз быстрее Python
- **\`long long\`**: но следите за переполнением!
- **STL**: \`set\`, \`map\`, \`priority_queue\` — мощные структуры`,
    duration: 50,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Макс. произведение пары, делящееся на K (C++)',
      description: 'Считайте N и K, затем N натуральных чисел. Найдите максимальное произведение пары, делящееся на K.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Найдите макс. произведение пары, делящееся на k\n    return 0;\n}\n',
      testCases: [
        { input: '5 3\n2 3 5 7 6', expectedOutput: '42', description: '7*6=42' },
        { input: '4 2\n1 3 5 4', expectedOutput: '20', description: '5*4=20' },
        { input: '3 5\n5 10 3', expectedOutput: '50', description: '5*10=50' },
      ],
      points: 15,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 20: Задание 27 — Последовательности
  // ──────────────────────────────────────────
  {
    slug: 'ege27-cpp-sequences',
    title: 'Задание 27: Обработка последовательностей на C++',
    description: 'Алгоритм Кадане, ближайшая пара, скользящее окно',
    content: `# Задание 27: Обработка последовательностей

## Алгоритм Кадане

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    int maxSum = a[0], current = a[0];
    for (int i = 1; i < n; i++) {
        current = max(a[i], current + a[i]);
        maxSum = max(maxSum, current);
    }
    cout << maxSum << endl;
    return 0;
}
\`\`\`

## Минимальная разность (ближайшая пара)

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    sort(a.begin(), a.end());
    int minDiff = INT_MAX;
    for (int i = 0; i + 1 < n; i++)
        minDiff = min(minDiff, a[i+1] - a[i]);

    cout << minDiff << endl;
    return 0;
}
\`\`\`

## Максимальная прибыль по акциям

\`\`\`cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> prices(n);
    for (int& x : prices) cin >> x;

    int minPrice = prices[0];
    int maxProfit = 0;
    for (int i = 1; i < n; i++) {
        maxProfit = max(maxProfit, prices[i] - minPrice);
        minPrice = min(minPrice, prices[i]);
    }
    cout << maxProfit << endl;
    return 0;
}
\`\`\`

## Два максимума с разной чётностью

\`\`\`cpp
#include <iostream>
#include <climits>
using namespace std;

int main() {
    int n;
    cin >> n;

    int maxEven = INT_MIN, maxOdd = INT_MIN;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) maxEven = max(maxEven, x);
        else maxOdd = max(maxOdd, x);
    }

    if (maxEven == INT_MIN || maxOdd == INT_MIN)
        cout << -1 << endl;
    else
        cout << (long long)maxEven * maxOdd << endl;

    return 0;
}
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Подмассив с макс. суммой (C++)',
      description: 'Считайте N, затем N чисел. Найдите максимальную сумму непустого подмассива за O(n).',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Алгоритм Кадане\n    return 0;\n}\n',
      testCases: [
        { input: '5\n-2 1 -3 4 -1', expectedOutput: '4', description: '[4]' },
        { input: '6\n-2 1 -3 4 -1 2', expectedOutput: '5', description: '[4,-1,2]' },
        { input: '3\n-1 -2 -3', expectedOutput: '-1', description: 'Все отрицательные' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 21: Задание 27 — DP задачи
  // ──────────────────────────────────────────
  {
    slug: 'ege27-cpp-dp',
    title: 'Задание 27: DP задачи на C++',
    description: 'Размен монет, НОП, редакционное расстояние',
    content: `# Задание 27: DP задачи на C++

## Минимальное количество монет

\`\`\`cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int main() {
    int s, n;
    cin >> s >> n;
    vector<int> coins(n);
    for (int& c : coins) cin >> c;

    vector<int> dp(s + 1, INT_MAX);
    dp[0] = 0;

    for (int i = 1; i <= s; i++)
        for (int c : coins)
            if (c <= i && dp[i - c] != INT_MAX)
                dp[i] = min(dp[i], dp[i - c] + 1);

    cout << (dp[s] != INT_MAX ? dp[s] : -1) << endl;
    return 0;
}
\`\`\`

## Наибольшая общая подпоследовательность

\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    string s1, s2;
    cin >> s1 >> s2;
    int n = s1.length(), m = s2.length();

    vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }

    cout << dp[n][m] << endl;
    return 0;
}
\`\`\`

## Разбиение на подмассивы с мин. разницей

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int total = 0;
    for (int& x : a) { cin >> x; total += x; }

    vector<bool> dp(total + 1, false);
    dp[0] = true;

    for (int x : a)
        for (int s = total; s >= x; s--)
            if (dp[s - x]) dp[s] = true;

    int best = 0;
    for (int s = 0; s <= total / 2; s++)
        if (dp[s]) best = s;

    cout << total - 2 * best << endl;
    return 0;
}
\`\`\`

## Количество способов размена

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int s, n;
    cin >> s >> n;
    vector<int> coins(n);
    for (int& c : coins) cin >> c;

    vector<long long> dp(s + 1, 0);
    dp[0] = 1;

    for (int c : coins)
        for (int j = c; j <= s; j++)
            dp[j] += dp[j - c];

    cout << dp[s] << endl;
    return 0;
}
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Размен монет (C++)',
      description: 'Считайте сумму S и набор номиналов. Выведите минимальное количество монет для размена S. Если невозможно — выведите -1.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int s;\n    cin >> s;\n    // Считайте номиналы и найдите минимум монет\n    return 0;\n}\n',
      testCases: [
        { input: '11\n1 5 6', expectedOutput: '2', description: '11 = 5 + 6' },
        { input: '15\n1 5 10', expectedOutput: '2', description: '15 = 5 + 10' },
        { input: '3\n2', expectedOutput: '-1', description: 'Невозможно' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 22: Задание 27 — Комплексные
  // ──────────────────────────────────────────
  {
    slug: 'ege27-cpp-complex',
    title: 'Задание 27: Комплексные задачи на C++',
    description: 'Тройки, разделение массива, множественные условия',
    content: `# Задание 27: Комплексные задачи

## Тройки (i < j < k, a[i] < a[j] < a[k])

\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    long long count = 0;
    for (int j = 1; j < n - 1; j++) {
        int left = 0, right = 0;
        for (int i = 0; i < j; i++)
            if (a[i] < a[j]) left++;
        for (int k = j + 1; k < n; k++)
            if (a[k] > a[j]) right++;
        count += (long long)left * right;
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## Максимальное произведение трёх чисел

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    sort(a.begin(), a.end());

    long long opt1 = (long long)a[n-1] * a[n-2] * a[n-3];
    long long opt2 = (long long)a[0] * a[1] * a[n-1];
    cout << max(opt1, opt2) << endl;
    return 0;
}
\`\`\`

## Скользящее окно с deque

\`\`\`cpp
#include <iostream>
#include <vector>
#include <deque>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int& x : a) cin >> x;

    deque<int> maxQ, minQ;
    long long count = 0;
    int left = 0;

    for (int right = 0; right < n; right++) {
        while (!maxQ.empty() && a[maxQ.back()] <= a[right])
            maxQ.pop_back();
        maxQ.push_back(right);

        while (!minQ.empty() && a[minQ.back()] >= a[right])
            minQ.pop_back();
        minQ.push_back(right);

        while (a[maxQ.front()] - a[minQ.front()] > k) {
            left++;
            if (maxQ.front() < left) maxQ.pop_front();
            if (minQ.front() < left) minQ.pop_front();
        }
        count += right - left + 1;
    }
    cout << count << endl;
    return 0;
}
\`\`\`

## set / multiset для онлайн-задач

\`\`\`cpp
#include <set>

// Поддержка k-го элемента, медианы,
// вставка/удаление за O(log n)
multiset<int> ms;
ms.insert(5);
ms.insert(3);
auto it = ms.begin(); // минимум
advance(it, ms.size() / 2); // медиана
\`\`\``,
    duration: 55,
    egeTopic: 'Программирование',
    egeTaskNumber: 27,
    assignment: {
      title: 'Максимальная прибыль (C++)',
      description: 'Считайте N, затем N цен акции. Найдите макс. прибыль от одной сделки (купить, потом продать). Если прибыль невозможна — 0.',
      difficulty: 'medium',
      starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите макс. прибыль\n    return 0;\n}\n',
      testCases: [
        { input: '6\n7 1 5 3 6 4', expectedOutput: '5', description: 'Купить за 1, продать за 6' },
        { input: '5\n7 6 4 3 1', expectedOutput: '0', description: 'Цены падают' },
        { input: '4\n1 2 3 4', expectedOutput: '3', description: 'Купить за 1, продать за 4' },
      ],
      points: 20,
      egeTaskNumber: 27,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 23: STL контейнеры
  // ──────────────────────────────────────────
  {
    slug: 'cpp-stl-containers',
    title: 'STL контейнеры для ЕГЭ',
    description: 'vector, set, map, priority_queue — когда что использовать',
    content: `# STL контейнеры для ЕГЭ

## vector

\`\`\`cpp
vector<int> v;
v.push_back(5);
v.size();
v[0];
v.begin(), v.end();

// Инициализация
vector<int> a(n, 0);       // n нулей
vector<int> b = {1,2,3};   // список
vector<vector<int>> g(n);  // 2D
\`\`\`

## set / multiset

\`\`\`cpp
set<int> s;
s.insert(5);
s.erase(5);
s.count(5);          // 0 или 1
s.find(5);           // итератор
*s.begin();          // минимум
*s.rbegin();         // максимум

// lower_bound в set — O(log n)
auto it = s.lower_bound(5);
\`\`\`

## map

\`\`\`cpp
map<int, int> m;
m[5] = 10;
m.count(5);
m.erase(5);

// Перебор
for (auto& [key, val] : m)
    cout << key << ": " << val << endl;

// unordered_map — O(1) в среднем
unordered_map<int, int> um;
\`\`\`

## priority_queue

\`\`\`cpp
// Max-heap (по умолчанию)
priority_queue<int> pq;
pq.push(5);
pq.top();   // максимум
pq.pop();

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;
\`\`\`

## Когда что использовать

| Задача | Контейнер | Сложность |
|--------|-----------|-----------|
| Хранение списка | vector | O(1) доступ |
| Уникальные элементы | set | O(log n) |
| Подсчёт частот | map | O(log n) |
| Быстрый подсчёт | unordered_map | O(1) средн. |
| Макс/мин элемент | priority_queue | O(log n) |
| Проверка наличия | unordered_set | O(1) средн. |`,
    duration: 45,
    egeTopic: 'Программирование',
    egeTaskNumber: null,
    assignment: {
      title: 'Подсчёт уникальных элементов',
      description: 'Считайте N, затем N чисел. Выведите количество различных чисел в массиве.',
      difficulty: 'easy',
      starterCode: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Используйте set для подсчёта уникальных\n    return 0;\n}\n',
      testCases: [
        { input: '5\n1 2 3 2 1', expectedOutput: '3', description: '3 различных: 1,2,3' },
        { input: '4\n5 5 5 5', expectedOutput: '1', description: 'Только 5' },
        { input: '6\n1 2 3 4 5 6', expectedOutput: '6', description: 'Все различны' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 24: Полезные приёмы
  // ──────────────────────────────────────────
  {
    slug: 'cpp-ege-tricks',
    title: 'Полезные приёмы C++ для ЕГЭ',
    description: 'Битовые операции, лямбды, auto, структуры',
    content: `# Полезные приёмы C++ для ЕГЭ

## Битовые операции

\`\`\`cpp
// Проверка бита
bool hasBit(int n, int k) { return (n >> k) & 1; }

// Установка бита
int setBit(int n, int k) { return n | (1 << k); }

// Перебор подмножеств
for (int mask = 0; mask < (1 << n); mask++) {
    for (int i = 0; i < n; i++) {
        if (mask & (1 << i)) {
            // i-й элемент в подмножестве
        }
    }
}

// Количество единиц: __builtin_popcount(n)
// Младший бит: n & (-n)
\`\`\`

## auto и range-based for

\`\`\`cpp
vector<int> a = {1, 2, 3};
for (auto x : a) cout << x;        // копия
for (auto& x : a) x *= 2;         // ссылка (изменяет)
for (const auto& x : a) cout << x; // чтение
\`\`\`

## Лямбды

\`\`\`cpp
// Сортировка с кастомным компаратором
sort(a.begin(), a.end(), [](int x, int y) {
    return abs(x) < abs(y);  // по модулю
});

// Подсчёт с условием
int cnt = count_if(a.begin(), a.end(),
    [](int x) { return x > 0; });
\`\`\`

## Структуры

\`\`\`cpp
struct Student {
    string name;
    int grade;
    bool operator<(const Student& other) const {
        return grade > other.grade; // по убыванию оценки
    }
};

vector<Student> students;
sort(students.begin(), students.end());
\`\`\`

## Быстрое чтение массива

\`\`\`cpp
// Через copy
#include <iterator>
vector<int> a(n);
copy_n(istream_iterator<int>(cin), n, a.begin());

// Через for
for (int& x : a) cin >> x;
\`\`\`

## Полезные алгоритмы STL

\`\`\`cpp
#include <algorithm>
#include <numeric>

// Сумма
int sum = accumulate(a.begin(), a.end(), 0);

// Минимум/максимум
int mn = *min_element(a.begin(), a.end());
int mx = *max_element(a.begin(), a.end());

// Уникальные
sort(a.begin(), a.end());
a.erase(unique(a.begin(), a.end()), a.end());

// Перестановки
sort(a.begin(), a.end());
do {
    // обработка перестановки
} while (next_permutation(a.begin(), a.end()));
\`\`\``,
    duration: 45,
    egeTopic: 'Программирование',
    egeTaskNumber: null,
    assignment: {
      title: 'Перебор подмножеств битовой маской',
      description: 'Считайте N (N ≤ 20), затем N чисел. Найдите количество подмножеств с суммой, делящейся на 3 (пустое подмножество не считать).',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Переберите все подмножества\n    return 0;\n}\n',
      testCases: [
        { input: '3\n1 2 3', expectedOutput: '3', description: '{3}, {1,2}, {1,2,3}' },
        { input: '2\n3 6', expectedOutput: '3', description: '{3}, {6}, {3,6}' },
        { input: '1\n5', expectedOutput: '0', description: '5 не делится на 3' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 25: Итоговый практикум
  // ──────────────────────────────────────────
  {
    slug: 'ege-cpp-final',
    title: 'Итоговый практикум C++ ЕГЭ',
    description: 'Комплексное повторение, чек-лист, решение вариантов',
    content: `# Итоговый практикум C++ ЕГЭ

## Чек-лист

| Задание | Ключевой приём C++ |
|---------|-------------------|
| 6 | DP массив / BFS очередь |
| 12 | Циклы while, операции с цифрами |
| 14 | Деление и остаток, to_string |
| 16 | Рекурсия, мемоизация с map |
| 17 | Потоковый ввод, min/max |
| 24 | string::find, substr, set |
| 25 | Цикл по делителям, % 10 |
| 26 | sort + lower_bound, vector, DFS/BFS |
| 27 | DP, два указателя, set/map |

## Шаблоны на все случаи

\`\`\`cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <set>
#include <map>
#include <queue>
#include <cmath>
#include <climits>
#include <numeric>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // --- Ваш код ---

    return 0;
}
\`\`\`

## Частые ошибки C++

1. **Переполнение int**: используйте \`long long\` для произведений
2. **Неинициализированные переменные**: всегда \`= 0\`
3. **Выход за границы**: проверяйте \`i < n\`
4. **Забыли \`ios_base::sync_with_stdio(false)\`** — TLE
5. **\`endl\` vs \`"\\n"\`**: \`endl\` сбрасывает буфер (медленнее)

## Сравнение с Python

| Операция | Python | C++ |
|----------|--------|-----|
| Ввод | \`int(input())\` | \`cin >> n\` |
| Массив | \`list(map(int, ...))\` | \`vector<int> a(n)\` |
| Сортировка | \`a.sort()\` | \`sort(a.begin(), a.end())\` |
| Множество | \`set()\` | \`set<int>\` |
| Словарь | \`dict()\` | \`map<int,int>\` |
| Бин. поиск | \`bisect_left\` | \`lower_bound\` |
| НОД | \`math.gcd\` | \`__gcd(a,b)\` |

## Когда C++ лучше Python на ЕГЭ

- Задание 26–27 с N > 10⁵ — Python может получить TLE
- Графы с большим количеством вершин
- Задачи с жёсткими ограничениями по времени`,
    duration: 60,
    egeTopic: 'Повторение',
    egeTaskNumber: null,
    assignment: {
      title: 'Комплексная задача C++ ЕГЭ',
      description: 'Считайте N, затем N натуральных чисел. Найдите максимальное произведение двух чисел, одно чётное, другое нечётное. Если пары нет — выведите -1.',
      difficulty: 'hard',
      starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите макс. произведение (чётное * нечётное)\n    return 0;\n}\n',
      testCases: [
        { input: '5\n3 8 5 2 7', expectedOutput: '56', description: '8*7=56' },
        { input: '3\n2 4 6', expectedOutput: '-1', description: 'Нет нечётных' },
        { input: '4\n1 10 3 20', expectedOutput: '60', description: '20*3=60' },
      ],
      points: 20,
    },
  },
];
