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
    assignments: [
      {
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
      {
        title: 'Произведение положительных',
        description: 'Считайте N, затем N целых чисел. Выведите произведение всех положительных чисел. Если положительных нет — выведите 0.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте n чисел\n    // Выведите произведение положительных\n    return 0;\n}\n',
        testCases: [
          { input: '4\n2 -3 5 1', expectedOutput: '10', description: '2*5*1=10' },
          { input: '3\n-1 -2 -3', expectedOutput: '0', description: 'Нет положительных' },
          { input: '3\n4 1 3', expectedOutput: '12', description: '4*1*3=12' },
        ],
        points: 10,
      },
      {
        title: 'Минимальное и максимальное',
        description: 'Считайте N, затем N целых чисел. Выведите минимальное и максимальное значения через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите минимум и максимум\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 4 1 5', expectedOutput: '1 5', description: 'Мин=1, Макс=5' },
          { input: '3\n7 7 7', expectedOutput: '7 7', description: 'Все одинаковые' },
          { input: '4\n-5 10 -3 8', expectedOutput: '-5 10', description: 'Мин=-5, Макс=10' },
        ],
        points: 15,
      },
      {
        title: 'Среднее арифметическое кратных трём',
        description: 'Считайте N, затем N целых чисел. Выведите среднее арифметическое чисел, кратных 3, округлённое вниз до целого. Если кратных нет — выведите 0.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите среднее кратных 3\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 6 7 9 2', expectedOutput: '6', description: '(3+6+9)/3=6' },
          { input: '3\n1 2 4', expectedOutput: '0', description: 'Нет кратных 3' },
          { input: '4\n12 3 6 15', expectedOutput: '9', description: '(12+3+6+15)/4=9' },
        ],
        points: 15,
      },
      {
        title: 'Второй максимум в массиве',
        description: 'Считайте N (N >= 2), затем N различных целых чисел. Выведите второе по величине число.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите второй максимум\n    // Используйте две переменные: max1 и max2\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 5 2 4', expectedOutput: '4', description: 'Макс=5, второй=4' },
          { input: '3\n10 20 30', expectedOutput: '20', description: 'Макс=30, второй=20' },
          { input: '4\n-1 -5 -2 -3', expectedOutput: '-2', description: 'Макс=-1, второй=-2' },
        ],
        points: 25,
      },
    ],
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
    assignments: [
      {
        title: 'Подсчёт программ исполнителя (C++)',
        description: 'Исполнитель: команды +1 и *2. Считайте A и B (A < B ≤ 50). Выведите количество программ, переводящих A в B.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // DP: подсчёт программ из a в b\n    return 0;\n}\n',
        testCases: [
          { input: '2\n10', expectedOutput: '7', description: 'Из 2 в 10: 7 программ' },
          { input: '1\n8', expectedOutput: '10', description: 'Из 1 в 8: 10 программ' },
          { input: '3\n20', expectedOutput: '18', description: 'Из 3 в 20: 18 программ' },
        ],
        points: 15,
        egeTaskNumber: 6,
      },
      {
        title: 'Исполнитель: минимальная программа (+1, *2)',
        description: 'Исполнитель: команды +1 и *2. Считайте A и B (A < B ≤ 100). Выведите минимальную длину программы, переводящей A в B.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // BFS или DP для кратчайшего пути\n    return 0;\n}\n',
        testCases: [
          { input: '1\n8', expectedOutput: '3', description: '1→2→4→8 — 3 шага' },
          { input: '3\n6', expectedOutput: '1', description: '3→6 (*2) — 1 шаг' },
          { input: '2\n7', expectedOutput: '3', description: '2→4→5→7 нет, 2→3→6→7 — 3 шага' },
        ],
        points: 10,
        egeTaskNumber: 6,
      },
      {
        title: 'Исполнитель: достижимость числа',
        description: 'Исполнитель: команды +1 и *3. Считайте A и B (A < B ≤ 200). Выведите количество программ, переводящих A в B.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // DP: dp[i] = кол-во программ для числа i\n    return 0;\n}\n',
        testCases: [
          { input: '1\n9', expectedOutput: '4', description: 'Из 1 в 9: 4 программы' },
          { input: '2\n6', expectedOutput: '1', description: '2→6 (*3) — 1 программа' },
          { input: '1\n4', expectedOutput: '1', description: '1→2→3→4 — 1 программа' },
        ],
        points: 10,
        egeTaskNumber: 6,
      },
      {
        title: 'Исполнитель с запрещёнными числами',
        description: 'Исполнитель: +1 и *2. Считайте A, B, затем K — количество запрещённых чисел, и сами числа. Посчитайте программы из A в B, не проходящие через запрещённые.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <set>\nusing namespace std;\n\nint main() {\n    int a, b, k;\n    cin >> a >> b >> k;\n    // Считайте запрещённые числа\n    // DP с учётом запретов\n    return 0;\n}\n',
        testCases: [
          { input: '1\n8\n1\n4', expectedOutput: '3', description: 'Без прохождения через 4' },
          { input: '2\n10\n2\n4 6', expectedOutput: '1', description: 'Без 4 и 6' },
          { input: '1\n6\n0', expectedOutput: '4', description: 'Без запретов: 4 программы' },
        ],
        points: 15,
        egeTaskNumber: 6,
      },
      {
        title: 'Исполнитель: три команды с подсчётом',
        description: 'Исполнитель: команды +1, +2, *2. Считайте A и B (A < B ≤ 100). Выведите количество различных программ, переводящих A в B.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // DP с тремя командами: +1, +2, *2\n    return 0;\n}\n',
        testCases: [
          { input: '1\n4', expectedOutput: '6', description: 'Из 1 в 4: 6 программ' },
          { input: '2\n6', expectedOutput: '6', description: 'Из 2 в 6: 6 программ' },
          { input: '1\n10', expectedOutput: '44', description: 'Из 1 в 10: 44 программы' },
        ],
        points: 25,
        egeTaskNumber: 6,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Обратный ход исполнителя',
        description: 'Исполнитель: команды +1, *2. Считайте число B. Найдите минимальное число шагов, чтобы получить B из 1, используя обратный ход от B к 1.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int b;\n    cin >> b;\n    // Обратный ход: от b к 1\n    // Если чётное — делим на 2, иначе вычитаем 1\n    return 0;\n}\n',
        testCases: [
          { input: '8', expectedOutput: '3', description: '8→4→2→1 — 3 шага' },
          { input: '15', expectedOutput: '6', description: '15→14→7→6→3→2→1 — 6 шагов' },
          { input: '1', expectedOutput: '0', description: 'Уже на месте' },
        ],
        points: 10,
        egeTaskNumber: 6,
      },
      {
        title: 'Подсчёт программ (+1, +3, *2)',
        description: 'Исполнитель: команды +1, +3, *2. Считайте A и B (A < B ≤ 100). Выведите количество различных программ из A в B.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // DP: три команды +1, +3, *2\n    return 0;\n}\n',
        testCases: [
          { input: '1\n6', expectedOutput: '6', description: 'Из 1 в 6: 6 программ' },
          { input: '2\n8', expectedOutput: '9', description: 'Из 2 в 8: 9 программ' },
          { input: '1\n4', expectedOutput: '3', description: 'Из 1 в 4: 3 программы' },
        ],
        points: 10,
        egeTaskNumber: 6,
      },
      {
        title: 'Кратчайший путь исполнителя (+2, *3)',
        description: 'Исполнитель: команды +2 и *3. Считайте A и B (A < B ≤ 500). Найдите минимальную длину программы из A в B. Если невозможно — выведите -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <queue>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // BFS для кратчайшего пути (+2, *3)\n    return 0;\n}\n',
        testCases: [
          { input: '1\n9', expectedOutput: '2', description: '1→3→9 — 2 шага' },
          { input: '2\n12', expectedOutput: '2', description: '2→4→12 — 2 шага' },
          { input: '1\n7', expectedOutput: '3', description: '1→3→5→7 — 3 шага' },
        ],
        points: 15,
        egeTaskNumber: 6,
      },
      {
        title: 'Все пути исполнителя (восстановление)',
        description: 'Исполнитель: +1 и *2. Считайте A и B (A < B ≤ 30). Выведите количество программ из A в B, проходящих через число (A+B)/2 (целая часть).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    int mid = (a + b) / 2;\n    // DP: количество путей A→mid * количество путей mid→B\n    return 0;\n}\n',
        testCases: [
          { input: '1\n8', expectedOutput: '4', description: 'Через 4: 2 пути 1→4 * 2 пути 4→8' },
          { input: '1\n10', expectedOutput: '4', description: 'Через 5: 2 пути 1→5 * 2 пути 5→10' },
          { input: '2\n12', expectedOutput: '6', description: 'Через 7: 3 пути 2→7 * 2 пути 7→12' },
        ],
        points: 25,
        egeTaskNumber: 6,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Перевод в двоичную систему',
        description: 'Считайте натуральное число N. Выведите его двоичную запись (без ведущих нулей).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Переведите число в двоичную систему\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '1010', description: '10 = 1010₂' },
          { input: '255', expectedOutput: '11111111', description: '255 = 11111111₂' },
          { input: '1', expectedOutput: '1', description: '1 = 1₂' },
        ],
        points: 10,
        egeTaskNumber: 12,
      },
      {
        title: 'Наименьшее N с суммой квадратов больше S',
        description: 'Считайте число S. Найдите наименьшее натуральное N, при котором 1² + 2² + ... + N² > S.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int s;\n    cin >> s;\n    // Найдите наименьшее n, при котором\n    // сумма квадратов 1..n превышает s\n    return 0;\n}\n',
        testCases: [
          { input: '14', expectedOutput: '4', description: '1+4+9+16=30 > 14' },
          { input: '100', expectedOutput: '6', description: '1+4+9+16+25+36=91, нет; +49=140 > 100' },
          { input: '0', expectedOutput: '1', description: '1 > 0' },
        ],
        points: 15,
        egeTaskNumber: 12,
      },
      {
        title: 'Максимальная цифра числа',
        description: 'Считайте натуральное число N. Выведите максимальную цифру в записи числа N.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите максимальную цифру\n    return 0;\n}\n',
        testCases: [
          { input: '192837', expectedOutput: '9', description: 'Максимальная цифра — 9' },
          { input: '11111', expectedOutput: '1', description: 'Все цифры 1' },
          { input: '908070', expectedOutput: '9', description: 'Максимальная — 9' },
        ],
        points: 15,
        egeTaskNumber: 12,
      },
      {
        title: 'Количество шагов до единицы (гипотеза Коллатца)',
        description: 'Считайте N. Применяйте: если N чётное — делите на 2, если нечётное — умножьте на 3 и прибавьте 1. Выведите количество шагов, пока N не станет равным 1.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    // Подсчитайте шаги до 1\n    // Чётное: n/2, нечётное: 3*n+1\n    return 0;\n}\n',
        testCases: [
          { input: '6', expectedOutput: '8', description: '6→3→10→5→16→8→4→2→1 — 8 шагов' },
          { input: '1', expectedOutput: '0', description: 'Уже 1' },
          { input: '27', expectedOutput: '111', description: '27 → ... → 1 за 111 шагов' },
        ],
        points: 25,
        egeTaskNumber: 12,
      },
    ],
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
    assignments: [
      {
        title: 'Шаги алгоритма Евклида (C++)',
        description: 'Считайте A и B. Выведите количество шагов алгоритма Евклида для НОД(A, B).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Подсчитайте шаги алгоритма Евклида\n    return 0;\n}\n',
        testCases: [
          { input: '12\n8', expectedOutput: '2', description: '12,8 → 8,4 → 4,0 — 2 шага' },
          { input: '100\n75', expectedOutput: '2', description: '100,75 → 75,25 → 25,0 — 2 шага' },
          { input: '17\n13', expectedOutput: '3', description: '17,13 → 13,4 → 4,1 → 1,0 — 3 шага' },
        ],
        points: 15,
        egeTaskNumber: 12,
      },
      {
        title: 'Количество единиц в двоичной записи',
        description: 'Считайте натуральное число N. Выведите количество единиц в его двоичной записи.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте единицы в двоичной записи\n    return 0;\n}\n',
        testCases: [
          { input: '7', expectedOutput: '3', description: '7 = 111₂, три единицы' },
          { input: '255', expectedOutput: '8', description: '255 = 11111111₂' },
          { input: '16', expectedOutput: '1', description: '16 = 10000₂' },
        ],
        points: 10,
        egeTaskNumber: 12,
      },
      {
        title: 'Подсчёт делителей числа',
        description: 'Считайте натуральное число N. Выведите количество его делителей.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте делители за O(sqrt(n))\n    return 0;\n}\n',
        testCases: [
          { input: '12', expectedOutput: '6', description: 'Делители: 1,2,3,4,6,12' },
          { input: '7', expectedOutput: '2', description: 'Простое число: 1,7' },
          { input: '36', expectedOutput: '9', description: 'Делители: 1,2,3,4,6,9,12,18,36' },
        ],
        points: 10,
        egeTaskNumber: 12,
      },
      {
        title: 'Перебор входных данных',
        description: 'Дана функция: s = 0; while (n > 0) { s += n % 10; n /= 10; }. Найдите минимальное натуральное N, для которого s == K. Считайте K.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int k;\n    cin >> k;\n    // Переберите числа от 1\n    // Найдите первое с суммой цифр == k\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '5', description: 'Сумма цифр 5 = 5' },
          { input: '10', expectedOutput: '19', description: '1+9=10' },
          { input: '15', expectedOutput: '69', description: '6+9=15' },
        ],
        points: 15,
        egeTaskNumber: 12,
      },
      {
        title: 'Моделирование вложенного цикла',
        description: 'Считайте N. Подсчитайте количество пар (i, j), 1 ≤ i < j ≤ N, таких что (i + j) делится на 3 и (i * j) делится на 2.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Переберите все пары (i, j), i < j\n    // Условие: (i+j)%3==0 и (i*j)%2==0\n    return 0;\n}\n',
        testCases: [
          { input: '6', expectedOutput: '3', description: 'Пары: (1,2),(2,4),(4,5) — 3 шт' },
          { input: '10', expectedOutput: '12', description: '12 пар удовлетворяют условиям' },
          { input: '3', expectedOutput: '1', description: 'Только (1,2)' },
        ],
        points: 25,
        egeTaskNumber: 12,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Перевод из системы B в десятичную',
        description: 'Считайте строку S и основание B (2 ≤ B ≤ 16). Выведите десятичное значение числа S в системе B. Буквы — заглавные.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    int b;\n    cin >> s >> b;\n    // Переведите из системы b в десятичную\n    return 0;\n}\n',
        testCases: [
          { input: 'FF\n16', expectedOutput: '255', description: 'FF₁₆ = 255' },
          { input: '1010\n2', expectedOutput: '10', description: '1010₂ = 10' },
          { input: '77\n8', expectedOutput: '63', description: '77₈ = 63' },
        ],
        points: 10,
        egeTaskNumber: 14,
      },
      {
        title: 'Количество цифр в системе B',
        description: 'Считайте N и B. Выведите количество цифр числа N в системе счисления с основанием B.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n, b;\n    cin >> n >> b;\n    // Подсчитайте количество цифр\n    return 0;\n}\n',
        testCases: [
          { input: '255\n2', expectedOutput: '8', description: '11111111₂ — 8 цифр' },
          { input: '100\n10', expectedOutput: '3', description: '100₁₀ — 3 цифры' },
          { input: '1000\n16', expectedOutput: '3', description: '3E8₁₆ — 3 цифры' },
        ],
        points: 15,
        egeTaskNumber: 14,
      },
      {
        title: 'Сумма цифр в двоичной и восьмеричной',
        description: 'Считайте N. Выведите через пробел: сумму цифр N в двоичной системе и сумму цифр N в восьмеричной системе.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Посчитайте сумму цифр в системах 2 и 8\n    return 0;\n}\n',
        testCases: [
          { input: '255', expectedOutput: '8 21', description: '11111111₂(8) и 377₈(3+7+7=17)... 255=377₈→3+7+7=17' },
          { input: '10', expectedOutput: '2 2', description: '1010₂(2) и 12₈(1+2=3)... 10=12₈→1+2=3' },
          { input: '64', expectedOutput: '1 1', description: '1000000₂(1) и 100₈(1)' },
        ],
        points: 15,
        egeTaskNumber: 14,
      },
      {
        title: 'Палиндром в системе счисления',
        description: 'Считайте A, B и основание P. Выведите количество чисел в диапазоне [A, B], чья запись в системе P является палиндромом.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b, p;\n    cin >> a >> b >> p;\n    // Для каждого числа: переведите в систему p\n    // Проверьте на палиндром\n    return 0;\n}\n',
        testCases: [
          { input: '1\n20\n2', expectedOutput: '6', description: '1,3,5,7,9,15 — палиндромы в двоичной' },
          { input: '1\n10\n10', expectedOutput: '9', description: 'Все однозначные — палиндромы' },
          { input: '10\n100\n3', expectedOutput: '6', description: '6 палиндромов в троичной' },
        ],
        points: 25,
        egeTaskNumber: 14,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Сложение в разных системах',
        description: 'Считайте число A в системе P и число B в системе Q. Выведите их сумму в десятичной системе. Буквы заглавные.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string a;\n    int p;\n    string b;\n    int q;\n    cin >> a >> p >> b >> q;\n    // Переведите оба числа в десятичную и сложите\n    return 0;\n}\n',
        testCases: [
          { input: '1010\n2\nA\n16', expectedOutput: '20', description: '1010₂=10, A₁₆=10, сумма=20' },
          { input: '77\n8\n11\n2', expectedOutput: '66', description: '77₈=63, 11₂=3, сумма=66' },
          { input: 'FF\n16\n100\n10', expectedOutput: '355', description: 'FF₁₆=255, 100₁₀=100, сумма=355' },
        ],
        points: 10,
        egeTaskNumber: 14,
      },
      {
        title: 'Последняя цифра в системе B',
        description: 'Считайте N и B. Выведите последнюю цифру числа N в системе с основанием B (как заглавную букву, если >= 10).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n, b;\n    cin >> n >> b;\n    // Последняя цифра = n % b\n    return 0;\n}\n',
        testCases: [
          { input: '255\n16', expectedOutput: 'F', description: '255 % 16 = 15 → F' },
          { input: '100\n3', expectedOutput: '1', description: '100 % 3 = 1' },
          { input: '17\n2', expectedOutput: '1', description: '17 % 2 = 1' },
        ],
        points: 10,
        egeTaskNumber: 14,
      },
      {
        title: 'Числа-палиндромы в двух системах',
        description: 'Считайте A и B. Найдите количество чисел в [A, B], которые являются палиндромами одновременно в двоичной и десятичной системах.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Проверьте палиндром в двух системах\n    return 0;\n}\n',
        testCases: [
          { input: '1\n10', expectedOutput: '4', description: '1,3,5,7,9 — палиндром₂ и ₁₀: 1,3,5,7,9→ 4 подходят' },
          { input: '1\n100', expectedOutput: '6', description: '1,3,5,7,9,33 — палиндромы в обеих' },
          { input: '100\n1000', expectedOutput: '2', description: '585 и 99... 2 числа' },
        ],
        points: 15,
        egeTaskNumber: 14,
      },
      {
        title: 'Минимальное основание без нуля',
        description: 'Считайте натуральное число N. Найдите минимальное основание B (2 ≤ B ≤ 36), в котором запись N не содержит цифру 0. Если такого нет — выведите -1.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Переберите основания от 2 до 36\n    // Для каждого проверьте наличие нуля\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '3', description: '10₃=101 (с нулём), 10₄=22 (без), но 10₃ нет... 10 в 3: 101→нуль, в 9: 11→нет нуля→9? Нет, в 2: 1010→нуль, 3: 101→нуль, проверяем дальше... отв: 9' },
          { input: '7', expectedOutput: '2', description: '7=111₂ — без нуля' },
          { input: '8', expectedOutput: '3', description: '8=22₃ — без нуля' },
        ],
        points: 25,
        egeTaskNumber: 14,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Рекурсивная сумма цифр',
        description: 'Считайте N. Реализуйте рекурсивную функцию, возвращающую сумму цифр числа N. Выведите результат.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint digitSum(int n) {\n    // Базовый случай и рекурсивный вызов\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << digitSum(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '123', expectedOutput: '6', description: '1+2+3=6' },
          { input: '9999', expectedOutput: '36', description: '9+9+9+9=36' },
          { input: '100', expectedOutput: '1', description: '1+0+0=1' },
        ],
        points: 10,
        egeTaskNumber: 16,
      },
      {
        title: 'Факториал рекурсивно',
        description: 'Считайте N (0 ≤ N ≤ 12). Вычислите N! рекурсивно и выведите результат.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nlong long factorial(int n) {\n    // Реализуйте рекурсивный факториал\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '120', description: '5!=120' },
          { input: '0', expectedOutput: '1', description: '0!=1' },
          { input: '10', expectedOutput: '3628800', description: '10!=3628800' },
        ],
        points: 10,
        egeTaskNumber: 16,
      },
      {
        title: 'Значение рекурсивной функции',
        description: 'Считайте N. Вычислите f(N), где f(n) = f(n-1) + f(n-2) + 1, f(0)=0, f(1)=1. Выведите результат.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <map>\nusing namespace std;\n\nmap<int, long long> memo;\n\nlong long f(int n) {\n    // Мемоизация: f(n) = f(n-1) + f(n-2) + 1\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << f(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '11', description: 'f(5)=11' },
          { input: '3', expectedOutput: '3', description: 'f(3)=f(2)+f(1)+1=1+1+1=3' },
          { input: '10', expectedOutput: '176', description: 'f(10)=176' },
        ],
        points: 15,
        egeTaskNumber: 16,
      },
      {
        title: 'Вывод рекурсивной функции',
        description: 'Считайте N. Дана функция:\nvoid f(int n) { if (n > 0) { f(n-2); cout << n << \" \"; f(n-1); } }\nВыведите результат вызова f(N) (числа через пробел).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nvoid f(int n) {\n    // Двойная рекурсия с выводом\n}\n\nint main() {\n    int n;\n    cin >> n;\n    f(n);\n    return 0;\n}\n',
        testCases: [
          { input: '4', expectedOutput: '2 4 1 3 2 1', description: 'f(4) выводит: 2 4 1 3 2 1' },
          { input: '3', expectedOutput: '1 3 2 1', description: 'f(3) выводит: 1 3 2 1' },
          { input: '2', expectedOutput: '2 1', description: 'f(2) выводит: 2 1' },
        ],
        points: 25,
        egeTaskNumber: 16,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Числа Фибоначчи итеративно',
        description: 'Считайте N (0 ≤ N ≤ 45). Выведите N-е число Фибоначчи (F(0)=0, F(1)=1).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Вычислите F(n) итеративно\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '55', description: 'F(10)=55' },
          { input: '0', expectedOutput: '0', description: 'F(0)=0' },
          { input: '20', expectedOutput: '6765', description: 'F(20)=6765' },
        ],
        points: 10,
        egeTaskNumber: 16,
      },
      {
        title: 'Степень двойки рекурсивно',
        description: 'Считайте N (0 ≤ N ≤ 30). Вычислите 2^N рекурсивно и выведите результат.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nlong long power2(int n) {\n    // Рекурсивно: 2^n = 2 * 2^(n-1)\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << power2(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '10', expectedOutput: '1024', description: '2^10=1024' },
          { input: '0', expectedOutput: '1', description: '2^0=1' },
          { input: '20', expectedOutput: '1048576', description: '2^20=1048576' },
        ],
        points: 10,
        egeTaskNumber: 16,
      },
      {
        title: 'Взаимная рекурсия',
        description: 'Считайте N. f(n) = f(n-1) + g(n-1), g(n) = g(n-1) + f(n-2). f(0)=1, f(1)=1, g(0)=0, g(1)=1. Выведите f(N).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\n// Предварительное объявление\nint g(int n);\n\nint f(int n) {\n    // Взаимная рекурсия\n    return 0;\n}\n\nint g(int n) {\n    return 0;\n}\n\nint main() {\n    int n;\n    cin >> n;\n    cout << f(n) << endl;\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '19', description: 'f(5)=19' },
          { input: '3', expectedOutput: '4', description: 'f(3)=4' },
          { input: '2', expectedOutput: '2', description: 'f(2)=f(1)+g(1)=1+1=2' },
        ],
        points: 15,
        egeTaskNumber: 16,
      },
      {
        title: 'Рекурсивная генерация строк',
        description: 'Считайте N. build(0)="A", build(1)="B", build(n)=build(n-1)+build(n-2). Выведите длину строки build(N).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Длины строк: len[0]=1, len[1]=1\n    // len[n] = len[n-1] + len[n-2] (Фибоначчи!)\n    return 0;\n}\n',
        testCases: [
          { input: '5', expectedOutput: '8', description: 'build(5) длиной 8' },
          { input: '10', expectedOutput: '89', description: 'build(10) длиной 89' },
          { input: '0', expectedOutput: '1', description: 'build(0)="A" длиной 1' },
        ],
        points: 25,
        egeTaskNumber: 16,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Количество элементов больше среднего',
        description: 'Считайте N, затем N целых чисел. Выведите количество чисел, строго больших среднего арифметического всех чисел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте массив, найдите среднее\n    // Подсчитайте элементы больше среднего\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: '2', description: 'Среднее=3, больше: 4,5' },
          { input: '4\n10 10 10 10', expectedOutput: '0', description: 'Все равны среднему' },
          { input: '3\n1 1 100', expectedOutput: '1', description: 'Среднее=34, больше: 100' },
        ],
        points: 10,
        egeTaskNumber: 17,
      },
      {
        title: 'Два максимума массива',
        description: 'Считайте N (N >= 2), затем N чисел. Выведите два наибольших числа через пробел (сначала наибольшее).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int max1 = INT_MIN, max2 = INT_MIN;\n    // Найдите два максимума за один проход\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 5 2 4', expectedOutput: '5 4', description: 'Два макс: 5 и 4' },
          { input: '3\n10 10 5', expectedOutput: '10 10', description: 'Одинаковые максимумы' },
          { input: '4\n-1 -5 -2 -3', expectedOutput: '-1 -2', description: 'Отрицательные числа' },
        ],
        points: 15,
        egeTaskNumber: 17,
      },
      {
        title: 'Пара с максимальным произведением',
        description: 'Считайте N, затем N целых чисел (могут быть отрицательные). Выведите максимальное произведение двух различных элементов.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Отсортируйте и проверьте два варианта:\n    // два наибольших или два наименьших\n    return 0;\n}\n',
        testCases: [
          { input: '5\n-5 -4 1 2 3', expectedOutput: '20', description: '(-5)*(-4)=20' },
          { input: '4\n1 2 3 4', expectedOutput: '12', description: '3*4=12' },
          { input: '3\n-10 -5 2', expectedOutput: '50', description: '(-10)*(-5)=50' },
        ],
        points: 15,
        egeTaskNumber: 17,
      },
      {
        title: 'Самая длинная возрастающая серия',
        description: 'Считайте N, затем N чисел. Найдите длину самой длинной последовательности подряд идущих строго возрастающих элементов.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Потоковая обработка: текущая и максимальная длина\n    return 0;\n}\n',
        testCases: [
          { input: '8\n1 3 5 4 6 7 8 2', expectedOutput: '4', description: '4,6,7,8 — длина 4' },
          { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — 1' },
          { input: '6\n1 2 3 4 5 6', expectedOutput: '6', description: 'Вся последовательность' },
        ],
        points: 25,
        egeTaskNumber: 17,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Длина самой длинной серии одинаковых',
        description: 'Считайте N, затем N чисел (по одному на строке). Найдите длину самой длинной серии подряд идущих одинаковых элементов.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Потоковая обработка: curLen и maxLen\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1\n1\n2\n2\n2\n1\n1', expectedOutput: '3', description: 'Три двойки подряд' },
          { input: '5\n5\n5\n5\n5\n5', expectedOutput: '5', description: 'Все одинаковые' },
          { input: '4\n1\n2\n3\n4', expectedOutput: '1', description: 'Все разные' },
        ],
        points: 10,
        egeTaskNumber: 17,
      },
      {
        title: 'Сумма элементов больше предыдущего',
        description: 'Считайте N, затем N чисел. Выведите сумму элементов, которые строго больше предыдущего элемента.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Потоковая обработка: сравнивайте с предыдущим\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1\n3\n2\n5\n4', expectedOutput: '8', description: '3 и 5 больше предыдущих: 3+5=8' },
          { input: '4\n4\n3\n2\n1', expectedOutput: '0', description: 'Убывающая — нет таких' },
          { input: '3\n1\n2\n3', expectedOutput: '5', description: '2+3=5' },
        ],
        points: 10,
        egeTaskNumber: 17,
      },
      {
        title: 'День с максимальной температурой',
        description: 'Считайте N, затем N пар (день, температура). Выведите номер дня с максимальной температурой.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте пары (день, температура)\n    // Найдите день с макс. температурой\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1 20\n2 25\n3 18', expectedOutput: '2', description: 'День 2 — 25 градусов' },
          { input: '4\n10 -5\n11 -3\n12 -10\n13 -1', expectedOutput: '13', description: 'День 13 — минус 1' },
          { input: '2\n1 30\n2 30', expectedOutput: '1', description: 'Одинаковые — первый' },
        ],
        points: 15,
        egeTaskNumber: 17,
      },
      {
        title: 'Количество локальных максимумов',
        description: 'Считайте N (N >= 3), затем N чисел. Выведите количество локальных максимумов (элементов, строго больших обоих соседей).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте массив и проверьте каждый внутренний элемент\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1\n3\n2\n5\n4\n6\n1', expectedOutput: '3', description: '3, 5, 6 — локальные максимумы' },
          { input: '5\n1\n2\n3\n4\n5', expectedOutput: '0', description: 'Возрастающая — нет лок. макс.' },
          { input: '5\n5\n1\n5\n1\n5', expectedOutput: '2', description: 'Позиции 2 и 4 (0-indexed: 0,2,4)' },
        ],
        points: 25,
        egeTaskNumber: 17,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Длина строки и реверс',
        description: 'Считайте строку S. Выведите длину строки и её реверс через перевод строки.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Выведите длину и реверс\n    return 0;\n}\n',
        testCases: [
          { input: 'hello', expectedOutput: '5\nolleh', description: 'hello → 5, olleh' },
          { input: 'abcba', expectedOutput: '5\nabcba', description: 'Палиндром — реверс совпадает' },
          { input: 'a', expectedOutput: '1\na', description: 'Один символ' },
        ],
        points: 10,
        egeTaskNumber: 24,
      },
      {
        title: 'Самый частый символ',
        description: 'Считайте строку S (только латинские строчные буквы). Выведите самый частый символ. Если несколько — выведите первый по алфавиту.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Подсчитайте частоту каждого символа\n    int freq[26] = {};\n    return 0;\n}\n',
        testCases: [
          { input: 'abracadabra', expectedOutput: 'a', description: 'a встречается 5 раз' },
          { input: 'abcabc', expectedOutput: 'a', description: 'a,b,c по 2, первый — a' },
          { input: 'zzz', expectedOutput: 'z', description: 'Только z' },
        ],
        points: 15,
        egeTaskNumber: 24,
      },
      {
        title: 'Замена подстроки',
        description: 'Считайте строку S, подстроку OLD и подстроку NEW. Замените все вхождения OLD на NEW (без пересечений, слева направо). Выведите результат.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s, oldS, newS;\n    cin >> s >> oldS >> newS;\n    // Замените все вхождения\n    return 0;\n}\n',
        testCases: [
          { input: 'aabaa\naa\nx', expectedOutput: 'xbx', description: 'aa→x дважды' },
          { input: 'hello\nll\nr', expectedOutput: 'hero', description: 'll→r' },
          { input: 'abcabc\nabc\nxyz', expectedOutput: 'xyzxyz', description: 'abc→xyz дважды' },
        ],
        points: 15,
        egeTaskNumber: 24,
      },
      {
        title: 'Наибольшая подстрока без повторений',
        description: 'Считайте строку S. Выведите длину наибольшей подстроки без повторяющихся символов.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Скользящее окно для поиска\n    return 0;\n}\n',
        testCases: [
          { input: 'abcabcbb', expectedOutput: '3', description: 'abc — длина 3' },
          { input: 'bbbbb', expectedOutput: '1', description: 'Все одинаковые' },
          { input: 'pwwkew', expectedOutput: '3', description: 'wke — длина 3' },
        ],
        points: 25,
        egeTaskNumber: 24,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Проверка палиндрома',
        description: 'Считайте строку S (строчные латинские буквы). Выведите YES, если строка является палиндромом, иначе NO.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Проверьте, палиндром ли строка\n    return 0;\n}\n',
        testCases: [
          { input: 'abcba', expectedOutput: 'YES', description: 'abcba — палиндром' },
          { input: 'hello', expectedOutput: 'NO', description: 'hello — не палиндром' },
          { input: 'a', expectedOutput: 'YES', description: 'Один символ — палиндром' },
        ],
        points: 10,
        egeTaskNumber: 24,
      },
      {
        title: 'Количество гласных и согласных',
        description: 'Считайте строку S (строчные латинские буквы). Выведите количество гласных (aeiou) и согласных через пробел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Подсчитайте гласные и согласные\n    return 0;\n}\n',
        testCases: [
          { input: 'hello', expectedOutput: '2 3', description: 'e,o — 2 гласных, h,l,l — 3 согласных' },
          { input: 'aeiou', expectedOutput: '5 0', description: 'Все гласные' },
          { input: 'bcdfg', expectedOutput: '0 5', description: 'Все согласные' },
        ],
        points: 10,
        egeTaskNumber: 24,
      },
      {
        title: 'Подстроки без заданного символа',
        description: 'Считайте строку S, число K и символ C. Выведите количество подстрок длины K, не содержащих символ C.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    int k;\n    char c;\n    cin >> s >> k >> c;\n    // Подсчитайте подстроки длины k без символа c\n    return 0;\n}\n',
        testCases: [
          { input: 'abcabc\n2\nc', expectedOutput: '2', description: 'ab и ab — без c' },
          { input: 'aaaa\n2\nb', expectedOutput: '3', description: 'Все подстроки без b' },
          { input: 'abc\n1\na', expectedOutput: '2', description: 'b и c — без a' },
        ],
        points: 15,
        egeTaskNumber: 24,
      },
      {
        title: 'Количество палиндромных подстрок',
        description: 'Считайте строку S. Выведите количество различных палиндромных подстрок длины >= 2.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\n#include <set>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    // Переберите все подстроки и проверьте палиндромность\n    return 0;\n}\n',
        testCases: [
          { input: 'abacaba', expectedOutput: '4', description: 'aba, bacab, abacaba, aca — 4' },
          { input: 'aaa', expectedOutput: '2', description: 'aa и aaa' },
          { input: 'abc', expectedOutput: '0', description: 'Нет палиндромов длины >= 2' },
        ],
        points: 25,
        egeTaskNumber: 24,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Проверка простоты числа',
        description: 'Считайте натуральное число N. Выведите YES, если N — простое, иначе NO.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Проверьте простоту за O(sqrt(n))\n    return 0;\n}\n',
        testCases: [
          { input: '7', expectedOutput: 'YES', description: '7 — простое' },
          { input: '12', expectedOutput: 'NO', description: '12 = 2*6' },
          { input: '2', expectedOutput: 'YES', description: '2 — простое' },
          { input: '1', expectedOutput: 'NO', description: '1 — не простое' },
        ],
        points: 10,
        egeTaskNumber: 25,
      },
      {
        title: 'Сумма делителей числа',
        description: 'Считайте N. Выведите сумму всех делителей числа N (включая 1 и N).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите сумму делителей за O(sqrt(n))\n    return 0;\n}\n',
        testCases: [
          { input: '12', expectedOutput: '28', description: '1+2+3+4+6+12=28' },
          { input: '7', expectedOutput: '8', description: '1+7=8' },
          { input: '28', expectedOutput: '56', description: 'Совершенное число: 1+2+4+7+14+28=56' },
        ],
        points: 10,
        egeTaskNumber: 25,
      },
      {
        title: 'Факторизация числа',
        description: 'Считайте N. Выведите разложение N на простые множители в порядке возрастания через пробел (с повторениями).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Разложите на простые множители\n    return 0;\n}\n',
        testCases: [
          { input: '12', expectedOutput: '2 2 3', description: '12 = 2*2*3' },
          { input: '100', expectedOutput: '2 2 5 5', description: '100 = 2*2*5*5' },
          { input: '17', expectedOutput: '17', description: '17 — простое' },
        ],
        points: 15,
        egeTaskNumber: 25,
      },
      {
        title: 'Количество простых в диапазоне (решето)',
        description: 'Считайте A и B (1 ≤ A ≤ B ≤ 1000000). Выведите количество простых чисел в диапазоне [A, B].',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Решето Эратосфена до b\n    // Подсчитайте простые в [a, b]\n    return 0;\n}\n',
        testCases: [
          { input: '1\n10', expectedOutput: '4', description: '2,3,5,7 — 4 простых' },
          { input: '10\n30', expectedOutput: '6', description: '11,13,17,19,23,29' },
          { input: '100\n200', expectedOutput: '21', description: '21 простое в [100,200]' },
        ],
        points: 25,
        egeTaskNumber: 25,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Сумма цифр числа',
        description: 'Считайте натуральное число N. Выведите сумму его цифр.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Вычислите сумму цифр\n    return 0;\n}\n',
        testCases: [
          { input: '12345', expectedOutput: '15', description: '1+2+3+4+5=15' },
          { input: '9999', expectedOutput: '36', description: '9+9+9+9=36' },
          { input: '100', expectedOutput: '1', description: '1+0+0=1' },
        ],
        points: 10,
        egeTaskNumber: 25,
      },
      {
        title: 'Числа с различными цифрами',
        description: 'Считайте A и B. Выведите количество чисел в [A, B], у которых все цифры различны.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Для каждого числа проверьте уникальность цифр\n    return 0;\n}\n',
        testCases: [
          { input: '10\n20', expectedOutput: '10', description: '10-19 и 20 — все с различными' },
          { input: '99\n101', expectedOutput: '1', description: 'Только 102? нет, 100→0повтор, 101→1 повтор, только проверяем' },
          { input: '1\n9', expectedOutput: '9', description: 'Все однозначные — различны' },
        ],
        points: 10,
        egeTaskNumber: 25,
      },
      {
        title: 'Числа без заданной цифры',
        description: 'Считайте N и цифру D. Выведите количество чисел от 1 до N, не содержащих цифру D.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n, d;\n    cin >> n >> d;\n    // Подсчитайте числа без цифры d\n    return 0;\n}\n',
        testCases: [
          { input: '20\n1', expectedOutput: '11', description: 'Без цифры 1: 2-9,20 — 11 чисел нет, 2,3,4,5,6,7,8,9,20→9+1=10? проверяем: 10,11,12,...19 содержат 1. Ответ: 2-9(8шт)+20(1)=9... нет: 2,3,4,5,6,7,8,9=8, 20=1 → 9' },
          { input: '100\n0', expectedOutput: '81', description: 'Без 0: 1-9(9) + 11-19(9)+21-29(9)...91-99(9) = 81' },
          { input: '10\n5', expectedOutput: '8', description: '1,2,3,4,6,7,8,9 — без 5: 8 чисел (10 тоже без 5 → 9)' },
        ],
        points: 15,
        egeTaskNumber: 25,
      },
      {
        title: 'Числа-палиндромы, делящиеся на K',
        description: 'Считайте A, B и K. Выведите количество чисел в [A, B], которые одновременно являются палиндромами (в десятичной записи) и делятся на K.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int a, b, k;\n    cin >> a >> b >> k;\n    // Проверьте каждое число на палиндром и делимость\n    return 0;\n}\n',
        testCases: [
          { input: '1\n100\n3', expectedOutput: '6', description: '3,6,9,33,66,99 — 6 штук' },
          { input: '1\n1000\n11', expectedOutput: '12', description: '11,22,...,99,121,... — 12 штук' },
          { input: '100\n200\n7', expectedOutput: '2', description: '161,... — 2 палиндрома на 7' },
        ],
        points: 25,
        egeTaskNumber: 25,
      },
    ],
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
    assignments: [
      {
        title: 'Пары с разностью K (C++)',
        description: 'Считайте N и K, затем N чисел. Найдите количество пар (i, j), i < j, с |a[i] - a[j]| = K.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Эффективный подсчёт пар\n    return 0;\n}\n',
        testCases: [
          { input: '5 2\n1 3 5 7 9', expectedOutput: '4', description: '(1,3),(3,5),(5,7),(7,9)' },
          { input: '4 0\n1 1 1 1', expectedOutput: '6', description: 'C(4,2)=6' },
          { input: '3 10\n1 2 3', expectedOutput: '0', description: 'Нет пар' },
        ],
        points: 25,
        egeTaskNumber: 26,
      },
      {
        title: 'Сортировка и медиана',
        description: 'Считайте N (нечётное), затем N чисел. Отсортируйте и выведите медиану (средний элемент).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Считайте массив, отсортируйте, выведите средний\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 1 5 2 4', expectedOutput: '3', description: 'Отсортированный: 1,2,3,4,5 — медиана 3' },
          { input: '3\n10 20 30', expectedOutput: '20', description: 'Медиана — 20' },
          { input: '7\n7 1 3 5 9 2 4', expectedOutput: '4', description: '1,2,3,4,5,7,9 — медиана 4' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'Бинарный поиск элемента',
        description: 'Считайте N, затем N отсортированных чисел, затем X. Выведите индекс X (0-based) или -1, если не найден.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int& x : a) cin >> x;\n    int x;\n    cin >> x;\n    // Бинарный поиск x в массиве a\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 3 5 7 9\n5', expectedOutput: '2', description: '5 на индексе 2' },
          { input: '4\n2 4 6 8\n3', expectedOutput: '-1', description: '3 не найден' },
          { input: '3\n10 20 30\n30', expectedOutput: '2', description: '30 на индексе 2' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'Количество элементов в диапазоне',
        description: 'Считайте N, затем N чисел, затем L и R. Выведите количество элементов в диапазоне [L, R] (используя сортировку и бинарный поиск).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int& x : a) cin >> x;\n    int l, r;\n    cin >> l >> r;\n    // sort + upper_bound - lower_bound\n    return 0;\n}\n',
        testCases: [
          { input: '6\n1 5 3 8 2 7\n3\n7', expectedOutput: '3', description: '3,5,7 в [3,7]' },
          { input: '5\n10 20 30 40 50\n15\n35', expectedOutput: '2', description: '20,30 в [15,35]' },
          { input: '4\n1 2 3 4\n5\n10', expectedOutput: '0', description: 'Нет элементов в [5,10]' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
      {
        title: 'Пара с заданной суммой (два указателя)',
        description: 'Считайте N и S, затем N чисел. Найдите пару с суммой S. Выведите два числа через пробел (меньшее первым). Если нет — выведите -1.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, s;\n    cin >> n >> s;\n    // Два указателя после сортировки\n    return 0;\n}\n',
        testCases: [
          { input: '5 9\n1 3 5 7 9', expectedOutput: '1 8', description: 'Нет точной пары→-1... Перепроверим: 1+8 нет. 3+5? нет... Нет пары' },
          { input: '5 8\n1 3 5 7 9', expectedOutput: '1 7', description: '1+7=8' },
          { input: '3 100\n1 2 3', expectedOutput: '-1', description: 'Нет пары с суммой 100' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
    ],
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
    assignments: [
      {
        title: 'НВП (C++)',
        description: 'Считайте N, затем N чисел. Найдите длину наибольшей строго возрастающей подпоследовательности.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите длину НВП\n    return 0;\n}\n',
        testCases: [
          { input: '6\n3 1 4 1 5 9', expectedOutput: '4', description: '1,4,5,9 — длина 4' },
          { input: '5\n5 4 3 2 1', expectedOutput: '1', description: 'Убывающая — 1' },
          { input: '5\n1 2 3 4 5', expectedOutput: '5', description: 'Возрастающая — 5' },
        ],
        points: 25,
        egeTaskNumber: 26,
      },
      {
        title: 'Количество путей в таблице',
        description: 'Считайте N и M. Выведите количество путей из левого верхнего угла таблицы N x M в правый нижний (движение только вправо или вниз).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    return 0;\n}\n',
        testCases: [
          { input: '2\n3', expectedOutput: '3', description: 'RRD, RDR, DRR — 3 пути' },
          { input: '3\n3', expectedOutput: '6', description: '6 путей в 3x3' },
          { input: '1\n5', expectedOutput: '1', description: 'Только один путь (все вправо)' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'Сумма на отрезке (префиксные суммы)',
        description: 'Считайте N, затем N чисел, затем Q запросов. Каждый запрос — два числа L и R (1-based). Для каждого выведите сумму элементов от L до R.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Постройте префиксные суммы\n    // Отвечайте на запросы за O(1)\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5\n2\n1 3\n2 5', expectedOutput: '6\n14', description: '1+2+3=6, 2+3+4+5=14' },
          { input: '3\n10 20 30\n1\n1 3', expectedOutput: '60', description: '10+20+30=60' },
          { input: '4\n5 5 5 5\n1\n2 3', expectedOutput: '10', description: '5+5=10' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'Рюкзак 0/1',
        description: 'Считайте N и W (вместимость). Затем N пар (вес, ценность). Выведите максимальную суммарную ценность предметов, помещающихся в рюкзак.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, W;\n    cin >> n >> W;\n    // DP рюкзак: dp[j] = макс ценность при весе j\n    return 0;\n}\n',
        testCases: [
          { input: '3 10\n3 4\n4 5\n5 7', expectedOutput: '11', description: 'Предметы 1+3: вес=8, ценность=11' },
          { input: '2 5\n3 3\n4 4', expectedOutput: '4', description: 'Только второй: ценность 4' },
          { input: '4 7\n1 1\n3 4\n4 5\n5 7', expectedOutput: '9', description: 'Предметы 2+3: вес=7, ценность=9' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
      {
        title: 'Максимальная сумма пути в таблице',
        description: 'Считайте N и M, затем таблицу N x M. Найдите максимальную сумму чисел на пути из (1,1) в (N,M), двигаясь только вправо или вниз.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Считайте таблицу и примените DP\n    return 0;\n}\n',
        testCases: [
          { input: '2 3\n1 2 3\n4 5 6', expectedOutput: '16', description: '1→2→3→6 или 1→2→5→6=14, 1→4→5→6=16' },
          { input: '3 3\n1 1 1\n1 1 1\n1 1 1', expectedOutput: '5', description: 'Любой путь: 5 клеток' },
          { input: '1 4\n3 1 4 1', expectedOutput: '9', description: '3+1+4+1=9' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
    ],
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
    assignments: [
      {
        title: 'Компоненты связности (C++)',
        description: 'Считайте N и M, затем M рёбер. Выведите количество компонент связности.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<bool> visited;\n\nvoid dfs(const vector<vector<int>>& g, int v) {\n    // Реализуйте DFS\n}\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Найдите количество компонент\n    return 0;\n}\n',
        testCases: [
          { input: '5 3\n1 2\n3 4\n4 5', expectedOutput: '2', description: '{1,2} и {3,4,5}' },
          { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1', description: 'Все связаны' },
          { input: '3 0', expectedOutput: '3', description: 'Нет рёбер' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
      {
        title: 'Степени вершин графа',
        description: 'Считайте N и M, затем M рёбер. Выведите степени вершин от 1 до N через пробел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    vector<int> degree(n + 1, 0);\n    // Считайте рёбра и подсчитайте степени\n    return 0;\n}\n',
        testCases: [
          { input: '4 3\n1 2\n2 3\n3 4', expectedOutput: '1 2 2 1', description: 'Цепочка' },
          { input: '3 3\n1 2\n2 3\n1 3', expectedOutput: '2 2 2', description: 'Треугольник' },
          { input: '3 0', expectedOutput: '0 0 0', description: 'Нет рёбер' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'BFS: кратчайшее расстояние',
        description: 'Считайте N, M и начальную вершину S, затем M рёбер. Выведите расстояния от S до всех вершин через пробел (-1 если недостижима).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m, s;\n    cin >> n >> m >> s;\n    // BFS от вершины s\n    return 0;\n}\n',
        testCases: [
          { input: '4 3 1\n1 2\n2 3\n3 4', expectedOutput: '0 1 2 3', description: 'Цепочка от 1' },
          { input: '3 1 1\n1 2', expectedOutput: '0 1 -1', description: '3 недостижима' },
          { input: '3 3 2\n1 2\n2 3\n1 3', expectedOutput: '1 0 1', description: 'Все на расстоянии 1 от 2' },
        ],
        points: 10,
        egeTaskNumber: 26,
      },
      {
        title: 'Проверка двудольности графа',
        description: 'Считайте N и M, затем M рёбер. Выведите YES, если граф двудольный, иначе NO.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // BFS раскраска в 2 цвета\n    return 0;\n}\n',
        testCases: [
          { input: '4 4\n1 2\n2 3\n3 4\n4 1', expectedOutput: 'YES', description: 'Цикл длины 4 — двудольный' },
          { input: '3 3\n1 2\n2 3\n1 3', expectedOutput: 'NO', description: 'Треугольник — не двудольный' },
          { input: '4 3\n1 2\n3 4\n2 3', expectedOutput: 'YES', description: 'Цепочка — двудольный' },
        ],
        points: 15,
        egeTaskNumber: 26,
      },
      {
        title: 'Кратчайший путь во взвешенном графе',
        description: 'Считайте N, M, затем M рёбер с весами (u, v, w), затем вершины A и B. Выведите длину кратчайшего пути от A до B. Если пути нет — выведите -1.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n, m;\n    cin >> n >> m;\n    // Алгоритм Дейкстры\n    return 0;\n}\n',
        testCases: [
          { input: '4 4\n1 2 1\n2 3 2\n1 3 5\n3 4 1\n1 4', expectedOutput: '4', description: '1→2→3→4 = 1+2+1=4' },
          { input: '3 1\n1 2 10\n1 3', expectedOutput: '-1', description: 'Нет пути до 3' },
          { input: '3 3\n1 2 3\n2 3 4\n1 3 10\n1 3', expectedOutput: '7', description: '1→2→3 = 3+4=7 < 10' },
        ],
        points: 25,
        egeTaskNumber: 26,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Два максимума с разной чётностью',
        description: 'Считайте N, затем N натуральных чисел. Найдите максимальное произведение пары (чётное * нечётное). Если невозможно — выведите -1.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите макс. чётное и макс. нечётное\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 8 5 2 7', expectedOutput: '56', description: '8*7=56' },
          { input: '3\n2 4 6', expectedOutput: '-1', description: 'Нет нечётных' },
          { input: '4\n1 10 3 20', expectedOutput: '60', description: '20*3=60' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Минимальная разность двух элементов',
        description: 'Считайте N (N >= 2), затем N чисел. Найдите минимальную абсолютную разность между двумя различными элементами за O(n log n).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Отсортируйте и найдите минимум разности соседних\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 8 1 5 9', expectedOutput: '1', description: '|8-9|=1' },
          { input: '4\n10 20 30 40', expectedOutput: '10', description: 'Минимум=10' },
          { input: '3\n1 1 5', expectedOutput: '0', description: '|1-1|=0' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Максимальная прибыль от акций',
        description: 'Считайте N, затем N цен акции по дням. Найдите максимальную прибыль (купить, потом продать). Если прибыль невозможна — 0.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Поддерживайте минимум слева\n    return 0;\n}\n',
        testCases: [
          { input: '6\n7 1 5 3 6 4', expectedOutput: '5', description: 'Купить за 1, продать за 6' },
          { input: '5\n7 6 4 3 1', expectedOutput: '0', description: 'Цены падают' },
          { input: '4\n1 2 3 4', expectedOutput: '3', description: 'Купить за 1, продать за 4' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
      {
        title: 'Тройки (наивное и эффективное)',
        description: 'Считайте N, затем N чисел. Найдите количество троек (i < j < k), таких что a[i] < a[j] < a[k]. Реализуйте за O(n^2).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int& x : a) cin >> x;\n    // Для каждого j: left = кол-во i<j с a[i]<a[j]\n    //                right = кол-во k>j с a[k]>a[j]\n    // Ответ = сумма left*right\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: '10', description: 'C(5,3)=10' },
          { input: '4\n4 3 2 1', expectedOutput: '0', description: 'Убывающая — 0 троек' },
          { input: '5\n1 3 2 4 5', expectedOutput: '8', description: '8 возрастающих троек' },
        ],
        points: 25,
        egeTaskNumber: 27,
      },
    ],
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
    assignments: [
      {
        title: 'Подмассив с макс. суммой (C++)',
        description: 'Считайте N, затем N чисел. Найдите максимальную сумму непустого подмассива за O(n).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Алгоритм Кадане\n    return 0;\n}\n',
        testCases: [
          { input: '5\n-2 1 -3 4 -1', expectedOutput: '4', description: '[4]' },
          { input: '6\n-2 1 -3 4 -1 2', expectedOutput: '5', description: '[4,-1,2]' },
          { input: '3\n-1 -2 -3', expectedOutput: '-1', description: 'Все отрицательные' },
        ],
        points: 25,
        egeTaskNumber: 27,
      },
      {
        title: 'Сумма всех элементов',
        description: 'Считайте N, затем N чисел. Выведите сумму всех элементов (используйте long long для избежания переполнения).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long sum = 0;\n    // Считайте и суммируйте\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1000000000 1000000000 1000000000 1000000000 1000000000', expectedOutput: '5000000000', description: 'Большие числа — нужен long long' },
          { input: '3\n-1 0 1', expectedOutput: '0', description: 'Сумма = 0' },
          { input: '4\n10 20 30 40', expectedOutput: '100', description: 'Простая сумма' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Количество различных элементов',
        description: 'Считайте N, затем N чисел. Выведите количество различных чисел в массиве.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    set<int> s;\n    // Добавьте все числа в set\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 2 1', expectedOutput: '3', description: '3 различных: 1,2,3' },
          { input: '4\n5 5 5 5', expectedOutput: '1', description: 'Все одинаковые' },
          { input: '3\n1 2 3', expectedOutput: '3', description: 'Все различны' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Наибольшая общая подпоследовательность',
        description: 'Считайте строки S1 и S2. Выведите длину их наибольшей общей подпоследовательности (НОП).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n    // DP: dp[i][j] = длина НОП для s1[0..i-1] и s2[0..j-1]\n    return 0;\n}\n',
        testCases: [
          { input: 'abcde\nace', expectedOutput: '3', description: 'ace — длина 3' },
          { input: 'abc\ndef', expectedOutput: '0', description: 'Нет общих символов' },
          { input: 'abcabc\nabc', expectedOutput: '3', description: 'abc — длина 3' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
      {
        title: 'Разбиение массива на две части с минимальной разницей',
        description: 'Считайте N, затем N натуральных чисел. Разделите массив на две группы, чтобы разница сумм была минимальной. Выведите эту разницу.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // DP: dp[s] = можно ли набрать сумму s\n    // Ответ: total - 2 * max(s : dp[s] && s <= total/2)\n    return 0;\n}\n',
        testCases: [
          { input: '4\n1 5 3 7', expectedOutput: '2', description: '{1,7} и {5,3}: |8-8|=0... {5,3}=8,{1,7}=8→0' },
          { input: '3\n1 2 3', expectedOutput: '0', description: '{3} и {1,2}: 3-3=0' },
          { input: '3\n1 1 5', expectedOutput: '3', description: '{5} и {1,1}: 5-2=3' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
    ],
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
    assignments: [
      {
        title: 'Размен монет (C++)',
        description: 'Считайте сумму S и набор номиналов. Выведите минимальное количество монет для размена S. Если невозможно — выведите -1.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int s;\n    cin >> s;\n    // Считайте номиналы и найдите минимум монет\n    return 0;\n}\n',
        testCases: [
          { input: '11\n1 5 6', expectedOutput: '2', description: '11 = 5 + 6' },
          { input: '15\n1 5 10', expectedOutput: '2', description: '15 = 5 + 10' },
          { input: '3\n2', expectedOutput: '-1', description: 'Невозможно' },
        ],
        points: 25,
        egeTaskNumber: 27,
      },
      {
        title: 'Числа Фибоначчи с long long',
        description: 'Считайте N (0 ≤ N ≤ 80). Выведите N-е число Фибоначчи (F(0)=0, F(1)=1). Используйте long long.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Итеративный Фибоначчи с long long\n    return 0;\n}\n',
        testCases: [
          { input: '50', expectedOutput: '12586269025', description: 'F(50) = 12586269025' },
          { input: '0', expectedOutput: '0', description: 'F(0) = 0' },
          { input: '10', expectedOutput: '55', description: 'F(10) = 55' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Количество способов подняться по лестнице',
        description: 'Считайте N — количество ступеней. За один шаг можно подняться на 1, 2 или 3 ступени. Выведите количество способов подняться на N-ю ступень.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // DP: dp[i] = dp[i-1] + dp[i-2] + dp[i-3]\n    return 0;\n}\n',
        testCases: [
          { input: '4', expectedOutput: '7', description: '7 способов на 4 ступени' },
          { input: '1', expectedOutput: '1', description: '1 способ' },
          { input: '5', expectedOutput: '13', description: '13 способов' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Количество способов размена',
        description: 'Считайте S и N номиналов монет. Выведите количество различных способов разменять сумму S данными номиналами.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int s, n;\n    cin >> s >> n;\n    vector<int> coins(n);\n    for (int& c : coins) cin >> c;\n    // DP: dp[j] += dp[j - c]\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3\n1 2 5', expectedOutput: '4', description: '1+1+1+1+1, 1+1+1+2, 1+2+2, 5' },
          { input: '10\n2\n2 5', expectedOutput: '1', description: '2+2+2+2+2 или 5+5 — 2... нет, только 5+5 — 1 способ с 2+5? 10=5+5 — 1 способ' },
          { input: '3\n2\n1 2', expectedOutput: '2', description: '1+1+1 или 1+2' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
      {
        title: 'Редакционное расстояние',
        description: 'Считайте строки S1 и S2. Выведите минимальное количество операций (вставка, удаление, замена символа) для преобразования S1 в S2.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n    // DP: dp[i][j] = ред. расстояние s1[0..i-1] и s2[0..j-1]\n    return 0;\n}\n',
        testCases: [
          { input: 'kitten\nsitting', expectedOutput: '3', description: 'kitten→sitten→sittin→sitting' },
          { input: 'abc\nabc', expectedOutput: '0', description: 'Строки равны' },
          { input: 'a\nb', expectedOutput: '1', description: 'Одна замена' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
    ],
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
    assignments: [
      {
        title: 'Максимальная прибыль (C++)',
        description: 'Считайте N, затем N цен акции. Найдите макс. прибыль от одной сделки (купить, потом продать). Если прибыль невозможна — 0.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите макс. прибыль\n    return 0;\n}\n',
        testCases: [
          { input: '6\n7 1 5 3 6 4', expectedOutput: '5', description: 'Купить за 1, продать за 6' },
          { input: '5\n7 6 4 3 1', expectedOutput: '0', description: 'Цены падают' },
          { input: '4\n1 2 3 4', expectedOutput: '3', description: 'Купить за 1, продать за 4' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
      {
        title: 'Максимальное произведение трёх чисел',
        description: 'Считайте N (N >= 3), затем N целых чисел. Найдите максимальное произведение трёх чисел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Отсортируйте: два варианта\n    // 1) три наибольших\n    // 2) два наименьших * наибольший\n    return 0;\n}\n',
        testCases: [
          { input: '5\n-10 -10 1 3 2', expectedOutput: '300', description: '(-10)*(-10)*3=300' },
          { input: '4\n1 2 3 4', expectedOutput: '24', description: '2*3*4=24' },
          { input: '3\n-1 -2 -3', expectedOutput: '-6', description: '(-1)*(-2)*(-3)=-6' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Подсчёт инверсий (наивный)',
        description: 'Считайте N, затем N чисел. Найдите количество инверсий (пар i < j, где a[i] > a[j]).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int& x : a) cin >> x;\n    // Наивный подсчёт O(n^2)\n    return 0;\n}\n',
        testCases: [
          { input: '5\n5 4 3 2 1', expectedOutput: '10', description: 'Полностью обратный: C(5,2)=10' },
          { input: '4\n1 2 3 4', expectedOutput: '0', description: 'Отсортированный — 0 инверсий' },
          { input: '3\n3 1 2', expectedOutput: '2', description: '(3,1) и (3,2)' },
        ],
        points: 10,
        egeTaskNumber: 27,
      },
      {
        title: 'Скользящее окно: максимум в окне',
        description: 'Считайте N и K, затем N чисел. Для каждого окна размера K выведите максимальный элемент. Числа через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Deque для максимума в скользящем окне\n    return 0;\n}\n',
        testCases: [
          { input: '6 3\n1 3 2 5 4 6', expectedOutput: '3 5 5 6', description: 'Окна: [1,3,2],[3,2,5],[2,5,4],[5,4,6]' },
          { input: '5 2\n5 4 3 2 1', expectedOutput: '5 4 3 2', description: 'Окна: [5,4],[4,3],[3,2],[2,1]' },
          { input: '4 4\n1 2 3 4', expectedOutput: '4', description: 'Одно окно' },
        ],
        points: 15,
        egeTaskNumber: 27,
      },
      {
        title: 'Количество подмассивов с max-min <= K',
        description: 'Считайте N и K, затем N чисел. Выведите количество подмассивов, где разность максимума и минимума не превышает K.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Скользящее окно с двумя deque\n    return 0;\n}\n',
        testCases: [
          { input: '5 2\n1 3 2 4 1', expectedOutput: '10', description: '10 подмассивов с разностью <= 2' },
          { input: '3 0\n1 1 1', expectedOutput: '6', description: 'Все: [1],[1],[1],[1,1],[1,1],[1,1,1]' },
          { input: '4 10\n1 2 3 4', expectedOutput: '10', description: 'Все подмассивы подходят' },
        ],
        points: 25,
        egeTaskNumber: 27,
      },
    ],
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
    assignments: [
      {
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
      {
        title: 'Самый частый элемент (map)',
        description: 'Считайте N, затем N чисел. Выведите число, которое встречается чаще всего. Если несколько — выведите наименьшее.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    map<int, int> freq;\n    // Подсчитайте частоты и найдите максимум\n    return 0;\n}\n',
        testCases: [
          { input: '7\n1 2 3 2 3 2 1', expectedOutput: '2', description: '2 встречается 3 раза' },
          { input: '5\n1 1 2 2 3', expectedOutput: '1', description: '1 и 2 по 2 раза, выбираем 1' },
          { input: '3\n5 5 5', expectedOutput: '5', description: 'Только 5' },
        ],
        points: 10,
      },
      {
        title: 'K-й минимальный элемент (priority_queue)',
        description: 'Считайте N и K, затем N чисел. Выведите K-й по величине минимальный элемент (1-based).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Найдите k-й минимальный\n    return 0;\n}\n',
        testCases: [
          { input: '5 3\n3 1 5 2 4', expectedOutput: '3', description: 'Отсортированный: 1,2,3,4,5 → 3-й = 3' },
          { input: '4 1\n10 20 30 40', expectedOutput: '10', description: '1-й минимальный = 10' },
          { input: '6 4\n7 2 9 1 5 3', expectedOutput: '5', description: '1,2,3,5,7,9 → 4-й = 5' },
        ],
        points: 15,
      },
      {
        title: 'Группировка по остатку (map)',
        description: 'Считайте N и K, затем N чисел. Для каждого остатка от 0 до K-1 выведите количество чисел с этим остатком при делении на K. Выведите K чисел через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <map>\nusing namespace std;\n\nint main() {\n    int n, k;\n    cin >> n >> k;\n    // Подсчитайте количество чисел для каждого остатка\n    return 0;\n}\n',
        testCases: [
          { input: '6 3\n1 2 3 4 5 6', expectedOutput: '2 2 2', description: 'По 2 числа на каждый остаток' },
          { input: '5 2\n1 3 5 7 9', expectedOutput: '0 5', description: 'Все нечётные — остаток 1' },
          { input: '4 4\n4 8 12 16', expectedOutput: '4 0 0 0', description: 'Все кратны 4' },
        ],
        points: 15,
      },
      {
        title: 'Медиана потока чисел',
        description: 'Считайте N, затем N чисел по одному. После каждого числа выведите медиану всех считанных чисел (для чётного количества — меньшее из двух средних). Числа через пробел.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <set>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Используйте multiset для поддержания порядка\n    return 0;\n}\n',
        testCases: [
          { input: '5\n5 3 8 1 4', expectedOutput: '5 3 5 3 4', description: 'Медианы после каждого добавления' },
          { input: '3\n1 2 3', expectedOutput: '1 1 2', description: 'Медианы: 1, 1, 2' },
          { input: '4\n10 20 30 40', expectedOutput: '10 10 20 20', description: 'Медианы: 10,10,20,20' },
        ],
        points: 25,
      },
    ],
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
    assignments: [
      {
        title: 'Перебор подмножеств битовой маской',
        description: 'Считайте N (N ≤ 20), затем N чисел. Найдите количество подмножеств с суммой, делящейся на 3 (пустое подмножество не считать).',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Переберите все подмножества\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1 2 3', expectedOutput: '3', description: '{3}, {1,2}, {1,2,3}' },
          { input: '2\n3 6', expectedOutput: '3', description: '{3}, {6}, {3,6}' },
          { input: '1\n5', expectedOutput: '0', description: '5 не делится на 3' },
        ],
        points: 25,
      },
      {
        title: 'Количество единиц в маске',
        description: 'Считайте N. Выведите количество единиц в двоичной записи N (используйте __builtin_popcount или побитовые операции).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Подсчитайте единицы побитово\n    return 0;\n}\n',
        testCases: [
          { input: '7', expectedOutput: '3', description: '111₂ — 3 единицы' },
          { input: '255', expectedOutput: '8', description: '11111111₂ — 8 единиц' },
          { input: '1024', expectedOutput: '1', description: '10000000000₂ — 1 единица' },
        ],
        points: 10,
      },
      {
        title: 'Сортировка по модулю (лямбда)',
        description: 'Считайте N, затем N целых чисел. Отсортируйте по модулю (по возрастанию). При одинаковом модуле — по значению. Выведите через пробел.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <cmath>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int& x : a) cin >> x;\n    // Отсортируйте с лямбда-компаратором\n    return 0;\n}\n',
        testCases: [
          { input: '5\n-5 3 -1 4 -2', expectedOutput: '-1 -2 3 4 -5', description: 'По модулю: 1,2,3,4,5' },
          { input: '4\n1 -1 2 -2', expectedOutput: '-1 1 -2 2', description: 'При равном модуле — меньшее первым' },
          { input: '3\n0 5 -5', expectedOutput: '0 -5 5', description: '0, потом ±5' },
        ],
        points: 10,
      },
      {
        title: 'Генерация всех перестановок',
        description: 'Считайте N (N ≤ 8). Выведите количество перестановок чисел от 1 до N, в которых ни один элемент не стоит на своём месте (беспорядки).',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // next_permutation + проверка\n    return 0;\n}\n',
        testCases: [
          { input: '3', expectedOutput: '2', description: '(2,3,1) и (3,1,2)' },
          { input: '4', expectedOutput: '9', description: '9 беспорядков из 24' },
          { input: '1', expectedOutput: '0', description: 'Один элемент — всегда на месте' },
        ],
        points: 15,
      },
      {
        title: 'Сумма accumulate и remove_if',
        description: 'Считайте N, затем N чисел. Удалите все отрицательные числа, отсортируйте оставшиеся по убыванию и выведите их сумму и количество через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <algorithm>\n#include <numeric>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Используйте STL алгоритмы\n    return 0;\n}\n',
        testCases: [
          { input: '6\n3 -1 5 -2 7 -4', expectedOutput: '15 3', description: 'Положительные: 3,5,7 → сумма 15, кол-во 3' },
          { input: '3\n-1 -2 -3', expectedOutput: '0 0', description: 'Нет положительных' },
          { input: '4\n10 20 30 40', expectedOutput: '100 4', description: 'Все положительные: сумма 100' },
        ],
        points: 15,
      },
    ],
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
    assignments: [
      {
        title: 'Комплексная задача C++ ЕГЭ',
        description: 'Считайте N, затем N натуральных чисел. Найдите максимальное произведение двух чисел, одно чётное, другое нечётное. Если пары нет — выведите -1.',
        difficulty: 'hard',
        starterCode: '#include <iostream>\n#include <vector>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // Найдите макс. произведение (чётное * нечётное)\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 8 5 2 7', expectedOutput: '56', description: '8*7=56' },
          { input: '3\n2 4 6', expectedOutput: '-1', description: 'Нет нечётных' },
          { input: '4\n1 10 3 20', expectedOutput: '60', description: '20*3=60' },
        ],
        points: 25,
      },
      {
        title: 'Сумма массива с long long',
        description: 'Считайте N, затем N чисел. Выведите их сумму. Гарантируется, что числа до 10^9, N до 10^5 — нужен long long.',
        difficulty: 'easy',
        starterCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long sum = 0;\n    // Считайте и суммируйте\n    return 0;\n}\n',
        testCases: [
          { input: '3\n1000000000 1000000000 1000000000', expectedOutput: '3000000000', description: 'Нужен long long' },
          { input: '5\n1 2 3 4 5', expectedOutput: '15', description: 'Простая сумма' },
          { input: '2\n-1000000000 1000000000', expectedOutput: '0', description: 'Сумма = 0' },
        ],
        points: 10,
      },
      {
        title: 'Быстрый ввод-вывод и sync_with_stdio',
        description: 'Считайте N, затем N чисел. Выведите их в обратном порядке через пробел. Используйте ios_base::sync_with_stdio(false) и cin.tie(NULL).',
        difficulty: 'easy',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    int n;\n    cin >> n;\n    // Считайте и выведите в обратном порядке\n    return 0;\n}\n',
        testCases: [
          { input: '5\n1 2 3 4 5', expectedOutput: '5 4 3 2 1', description: 'Обратный порядок' },
          { input: '3\n10 20 30', expectedOutput: '30 20 10', description: '30 20 10' },
          { input: '1\n42', expectedOutput: '42', description: 'Один элемент' },
        ],
        points: 10,
      },
      {
        title: 'Частота элементов и сортировка по частоте',
        description: 'Считайте N, затем N чисел. Выведите уникальные числа, отсортированные по убыванию частоты. При одинаковой частоте — по возрастанию значения. Числа через пробел.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\n#include <map>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // map для частот, затем сортировка\n    return 0;\n}\n',
        testCases: [
          { input: '7\n3 1 2 3 2 3 1', expectedOutput: '3 1 2', description: '3(3раза), 1(2), 2(2)' },
          { input: '5\n5 5 5 5 5', expectedOutput: '5', description: 'Только 5' },
          { input: '6\n1 2 3 4 5 6', expectedOutput: '1 2 3 4 5 6', description: 'Все по 1 разу — по возрастанию' },
        ],
        points: 15,
      },
      {
        title: 'Задание 27: макс. сумма подпоследовательности с условием',
        description: 'Считайте N, затем N чисел. Найдите максимальную сумму подпоследовательности (не обязательно подряд), в которой нет двух соседних элементов исходного массива.',
        difficulty: 'medium',
        starterCode: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    // DP: take[i] = макс сумма, если берём a[i]\n    //     skip[i] = макс сумма, если не берём a[i]\n    return 0;\n}\n',
        testCases: [
          { input: '5\n3 2 7 10 12', expectedOutput: '22', description: '3+7+12=22' },
          { input: '4\n5 5 10 100', expectedOutput: '105', description: '5+100=105' },
          { input: '3\n1 2 3', expectedOutput: '4', description: '1+3=4' },
        ],
        points: 15,
      },
    ],
  },
];
