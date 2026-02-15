// ============================================
// Infosec 9-10 — Информационная безопасность
// 20 уроков, ~60 часов
// Криптография, сетевая безопасность, форензика, RE, CTF
// ============================================

export const infosec910Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Алгоритм RSA
  // ──────────────────────────────────────────
  {
    slug: 'rsa-algorithm',
    title: 'Алгоритм RSA: математические основы',
    description: 'Модульная арифметика, простые числа, генерация ключей RSA, шифрование и дешифрование',
    content: `# Алгоритм RSA: математические основы

## Введение

RSA — один из первых и наиболее широко используемых алгоритмов асимметричного шифрования. Назван по первым буквам фамилий создателей: **Rivest, Shamir, Adleman** (1977).

Главная идея: легко перемножить два больших простых числа, но **крайне сложно** разложить результат обратно на множители (задача факторизации).

## Модульная арифметика

Операция \\\`mod\\\` — остаток от деления:

\\\`\\\`\\\`python
# Основы модульной арифметики
print(17 % 5)   # 2
print(25 % 7)   # 4

# Свойства:
# (a + b) mod n = ((a mod n) + (b mod n)) mod n
# (a * b) mod n = ((a mod n) * (b mod n)) mod n

# Быстрое возведение в степень по модулю
# Python: встроенная функция pow(base, exp, mod)
print(pow(7, 13, 11))  # 7^13 mod 11
\\\`\\\`\\\`

## Функция Эйлера

Функция Эйлера **φ(n)** — количество чисел от 1 до n, взаимно простых с n.

Для произведения двух простых: **φ(p·q) = (p-1)·(q-1)**

\\\`\\\`\\\`python
from math import gcd

def euler_totient(n):
    """Вычисление функции Эйлера"""
    result = 0
    for i in range(1, n + 1):
        if gcd(i, n) == 1:
            result += 1
    return result

# Для простого p: phi(p) = p - 1
print(euler_totient(7))   # 6
print(euler_totient(11))  # 10

# Для p*q: phi(p*q) = (p-1)*(q-1)
print(euler_totient(77))  # phi(7*11) = 6*10 = 60
\\\`\\\`\\\`

## Генерация ключей RSA

Алгоритм:
1. Выбрать два простых числа **p** и **q**
2. Вычислить **n = p · q**
3. Вычислить **φ(n) = (p-1)(q-1)**
4. Выбрать **e** — взаимно простое с φ(n), обычно 65537
5. Найти **d** — обратное к e по модулю φ(n): **e·d ≡ 1 (mod φ(n))**

Открытый ключ: **(e, n)**, закрытый ключ: **(d, n)**

\\\`\\\`\\\`python
from math import gcd

def generate_rsa_keys(p, q):
    n = p * q
    phi = (p - 1) * (q - 1)

    # Выбираем e
    e = 65537
    if gcd(e, phi) != 1:
        e = 3
        while gcd(e, phi) != 1:
            e += 2

    # Находим d (обратное по модулю)
    d = pow(e, -1, phi)

    return (e, n), (d, n)

public_key, private_key = generate_rsa_keys(61, 53)
print(f"Открытый ключ: {public_key}")
print(f"Закрытый ключ: {private_key}")
\\\`\\\`\\\`

## Шифрование и дешифрование

- Шифрование: **C = M^e mod n**
- Дешифрование: **M = C^d mod n**

\\\`\\\`\\\`python
def rsa_encrypt(message, public_key):
    e, n = public_key
    return pow(message, e, n)

def rsa_decrypt(ciphertext, private_key):
    d, n = private_key
    return pow(ciphertext, d, n)

# Пример
p, q = 61, 53
pub, priv = generate_rsa_keys(p, q)
original = 42
encrypted = rsa_encrypt(original, pub)
decrypted = rsa_decrypt(encrypted, priv)
print(f"{original} -> {encrypted} -> {decrypted}")
\\\`\\\`\\\`

## Почему RSA безопасен?

Безопасность RSA основана на **сложности факторизации**. Для малых чисел разложение тривиально, но для чисел длиной 2048+ бит — вычислительно невозможно при текущих технологиях.`,
    duration: 55,
    assignment: {
      title: 'Реализация RSA',
      description: 'Даны на первой строке два простых числа p и q. На второй строке — число M (сообщение). Реализуйте RSA: сгенерируйте ключи (используйте e=65537, если gcd(e,phi)=1, иначе найдите минимальное нечётное e>=3), зашифруйте M и выведите через пробел: зашифрованное сообщение C, затем результат дешифрования (должен совпасть с M).',
      difficulty: 'medium' as const,
      starterCode: '# Считайте p, q\n# Считайте M\n# Сгенерируйте ключи RSA\n# Зашифруйте и дешифруйте\n# Выведите C и расшифрованное M через пробел\n\n',
      testCases: [
        { input: '61 53\n42', expectedOutput: '2557 42', description: 'p=61, q=53, M=42' },
        { input: '17 19\n10', expectedOutput: '78 10', description: 'p=17, q=19, M=10' },
        { input: '23 29\n100', expectedOutput: '486 100', description: 'p=23, q=29, M=100' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 2: Протокол Диффи-Хеллмана
  // ──────────────────────────────────────────
  {
    slug: 'diffie-hellman',
    title: 'Протокол Диффи-Хеллмана',
    description: 'Обмен ключами, дискретное логарифмирование, MITM-атака',
    content: `# Протокол Диффи-Хеллмана

## Проблема обмена ключами

Как двум сторонам договориться об общем секретном ключе по **незащищённому** каналу связи? Протокол Диффи-Хеллмана (1976) решает эту задачу.

## Математическая основа: дискретное логарифмирование

Задача: дано g, p и A = g^a mod p. Найти a — **крайне сложно** для больших чисел.

\\\`\\\`\\\`python
# Прямая задача — быстро:
g, a, p = 5, 123456, 104729
A = pow(g, a, p)
print(f"g={g}, a={a}, p={p} => A={A}")

# Обратная задача (дискретный логарифм) — медленно:
# Дано g=5, p=104729, A=...
# Найти a — перебор (для малых чисел)
def discrete_log_brute(g, A, p):
    for a in range(p):
        if pow(g, a, p) == A:
            return a
    return None
\\\`\\\`\\\`

## Протокол по шагам

1. Алиса и Боб публично договариваются о **g** (генератор) и **p** (большое простое)
2. Алиса выбирает секретное **a**, вычисляет **A = g^a mod p**, отправляет Бобу
3. Боб выбирает секретное **b**, вычисляет **B = g^b mod p**, отправляет Алисе
4. Алиса вычисляет: **S = B^a mod p**
5. Боб вычисляет: **S = A^b mod p**
6. Оба получают **одинаковый** секрет S!

Почему? S = (g^b)^a mod p = (g^a)^b mod p = g^(a·b) mod p

\\\`\\\`\\\`python
def diffie_hellman(g, p, a, b):
    """Моделирование протокола Диффи-Хеллмана"""
    # Публичные значения
    A = pow(g, a, p)  # Алиса отправляет
    B = pow(g, b, p)  # Боб отправляет

    # Вычисление общего секрета
    S_alice = pow(B, a, p)
    S_bob = pow(A, b, p)

    assert S_alice == S_bob
    return A, B, S_alice

g, p = 5, 23
a, b = 6, 15
A, B, S = diffie_hellman(g, p, a, b)
print(f"A={A}, B={B}, Общий секрет S={S}")
\\\`\\\`\\\`

## MITM-атака (Man-in-the-Middle)

Злоумышленник (Ева) перехватывает и подменяет сообщения:

1. Алиса отправляет A — Ева перехватывает, отправляет своё A'
2. Боб отправляет B — Ева перехватывает, отправляет своё B'
3. Ева устанавливает **два** общих секрета: с Алисой и с Бобом

\\\`\\\`\\\`python
def mitm_attack(g, p, a, b, e_secret):
    """Моделирование MITM-атаки"""
    A = pow(g, a, p)
    B = pow(g, b, p)

    # Ева подменяет
    E = pow(g, e_secret, p)

    # Алиса думает, что общается с Бобом
    S_alice = pow(E, a, p)  # Алиса + Ева
    S_eve_a = pow(A, e_secret, p)

    # Боб думает, что общается с Алисой
    S_bob = pow(E, b, p)    # Боб + Ева
    S_eve_b = pow(B, e_secret, p)

    return S_alice, S_eve_a, S_bob, S_eve_b
\\\`\\\`\\\`

## Защита от MITM

- **Цифровые сертификаты** — подтверждают подлинность ключей
- **PKI** (инфраструктура открытых ключей)
- **Взаимная аутентификация** сторон`,
    duration: 50,
    assignment: {
      title: 'Моделирование Диффи-Хеллмана',
      description: 'На первой строке даны g и p (простое). На второй строке — секретное число a (Алисы). На третьей строке — секретное число b (Боба). Вычислите и выведите три числа через пробел: публичное значение Алисы A, публичное значение Боба B, общий секрет S.',
      difficulty: 'medium' as const,
      starterCode: '# Считайте g, p\n# Считайте a (секрет Алисы)\n# Считайте b (секрет Боба)\n# Вычислите A, B, S\n# Выведите A B S через пробел\n\n',
      testCases: [
        { input: '5 23\n6\n15', expectedOutput: '8 19 2', description: 'g=5, p=23, a=6, b=15' },
        { input: '2 13\n3\n5', expectedOutput: '8 6 8', description: 'g=2, p=13, a=3, b=5' },
        { input: '3 17\n4\n7', expectedOutput: '13 11 4', description: 'g=3, p=17, a=4, b=7' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 3: AES и блочные шифры
  // ──────────────────────────────────────────
  {
    slug: 'aes-block-ciphers',
    title: 'AES и блочные шифры',
    description: 'Режимы ECB/CBC, размер блока, padding',
    content: `# AES и блочные шифры

## Симметричное шифрование

В отличие от RSA (асимметричное), **симметричные** шифры используют один ключ для шифрования и дешифрования. AES (Advanced Encryption Standard) — стандарт с 2001 года.

## Основы блочных шифров

Блочный шифр обрабатывает данные **фиксированными блоками**:
- AES: блок = 128 бит (16 байт)
- Ключ: 128, 192 или 256 бит

Что делать, если данные длиннее одного блока? Используются **режимы шифрования**.

## Режим ECB (Electronic Codebook)

Каждый блок шифруется **независимо** одним и тем же ключом.

\\\`\\\`\\\`python
def ecb_encrypt(blocks, key_func):
    """Моделирование ECB (упрощённо)"""
    return [key_func(block) for block in blocks]

def ecb_decrypt(cipher_blocks, key_func_inv):
    return [key_func_inv(block) for block in cipher_blocks]

# Проблема ECB: одинаковые блоки открытого текста
# дают одинаковые блоки шифротекста!
plaintext_blocks = [100, 200, 100, 300, 100]
key = 42
encrypted = [b ^ key for b in plaintext_blocks]
print(encrypted)  # [78, 226, 78, 278, 78] — видна структура!
\\\`\\\`\\\`

**Проблема ECB**: одинаковые блоки дают одинаковый шифротекст — утечка информации о структуре данных. Классический пример — «пингвин ECB».

## Режим CBC (Cipher Block Chaining)

Каждый блок XOR-ится с **предыдущим шифроблоком** перед шифрованием. Первый блок XOR-ится с **вектором инициализации (IV)**.

\\\`\\\`\\\`python
def cbc_encrypt(blocks, key, iv):
    """Моделирование CBC"""
    encrypted = []
    prev = iv
    for block in blocks:
        # XOR с предыдущим шифроблоком
        xored = block ^ prev
        # Шифрование (упрощённо — XOR с ключом)
        cipher = xored ^ key
        encrypted.append(cipher)
        prev = cipher
    return encrypted

def cbc_decrypt(cipher_blocks, key, iv):
    """Дешифрование CBC"""
    decrypted = []
    prev = iv
    for cipher in cipher_blocks:
        xored = cipher ^ key
        plain = xored ^ prev
        decrypted.append(plain)
        prev = cipher
    return decrypted

blocks = [100, 200, 100, 300, 100]
key, iv = 42, 99
enc = cbc_encrypt(blocks, key, iv)
dec = cbc_decrypt(enc, key, iv)
print(f"Исходные: {blocks}")
print(f"Зашифр.:  {enc}")
print(f"Расшифр.: {dec}")
\\\`\\\`\\\`

## Padding (дополнение)

Если данные не кратны размеру блока, нужен padding. Стандарт **PKCS#7**: дополняем байтами, значение которых = количество добавленных байт.

\\\`\\\`\\\`python
def pkcs7_pad(data, block_size):
    pad_len = block_size - (len(data) % block_size)
    return data + [pad_len] * pad_len

def pkcs7_unpad(data):
    pad_len = data[-1]
    if pad_len > len(data):
        raise ValueError("Неверный padding")
    # Проверяем, что все padding-байты корректны
    if data[-pad_len:] != [pad_len] * pad_len:
        raise ValueError("Неверный padding")
    return data[:-pad_len]

data = [72, 101, 108, 108, 111]  # "Hello" — 5 байт
padded = pkcs7_pad(data, 8)  # блок = 8
print(padded)  # [72, 101, 108, 108, 111, 3, 3, 3]
print(pkcs7_unpad(padded))  # [72, 101, 108, 108, 111]
\\\`\\\`\\\`

## Сравнение режимов

| Свойство | ECB | CBC |
|----------|-----|-----|
| Параллельное шифрование | Да | Нет |
| Параллельное дешифрование | Да | Да |
| Ошибка в одном блоке | Затрагивает 1 блок | Затрагивает 2 блока |
| Безопасность | Утечка паттернов | Хорошая |`,
    duration: 55,
    assignment: {
      title: 'CBC шифрование',
      description: 'На первой строке дан ключ key (целое число). На второй строке — IV (целое число). На третьей строке — блоки данных через пробел (целые числа). Реализуйте CBC-шифрование с XOR в качестве шифрующей функции: для каждого блока сначала XOR с предыдущим шифроблоком (или IV для первого), затем XOR с ключом. Выведите зашифрованные блоки через пробел.',
      difficulty: 'medium' as const,
      starterCode: '# Считайте key\n# Считайте iv\n# Считайте блоки\n# Реализуйте CBC-шифрование\n# Выведите зашифрованные блоки через пробел\n\n',
      testCases: [
        { input: '42\n99\n100 200 100 300 100', expectedOutput: '45 207 129 391 457', description: 'Базовый тест CBC' },
        { input: '10\n0\n1 2 3 4 5', expectedOutput: '11 3 10 4 11', description: 'IV=0' },
        { input: '255\n128\n50 100 150 200', expectedOutput: '77 214 191 136', description: 'Другой ключ и IV' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 4: Padding-атаки
  // ──────────────────────────────────────────
  {
    slug: 'padding-attacks',
    title: 'Padding-атаки',
    description: 'PKCS#7, Oracle-атаки на padding, уязвимости CBC',
    content: `# Padding-атаки

## PKCS#7 Padding

При блочном шифровании данные должны быть кратны размеру блока. PKCS#7 дополняет данные байтами, значение каждого = количество добавленных байт.

| Данные (блок 8) | Padding | Результат |
|-----------------|---------|-----------|
| 7 байт | 01 | data + [1] |
| 6 байт | 02 02 | data + [2, 2] |
| 5 байт | 03 03 03 | data + [3, 3, 3] |
| 8 байт (полный) | 08 08 08 08 08 08 08 08 | data + целый блок |

**Важно**: если данные уже кратны блоку, добавляется **полный блок** padding.

\\\`\\\`\\\`python
def pkcs7_pad(data, block_size):
    """PKCS#7 padding"""
    pad_len = block_size - (len(data) % block_size)
    return data + bytes([pad_len] * pad_len)

def pkcs7_unpad(data):
    """Удаление PKCS#7 padding"""
    pad_len = data[-1]
    if pad_len == 0 or pad_len > len(data):
        raise ValueError("Invalid padding")
    for i in range(pad_len):
        if data[-(i + 1)] != pad_len:
            raise ValueError("Invalid padding")
    return data[:-pad_len]

# Примеры
print(list(pkcs7_pad(b"Hello", 8)))     # [72,101,108,108,111, 3,3,3]
print(list(pkcs7_pad(b"12345678", 8)))   # + [8]*8 — целый блок!
\\\`\\\`\\\`

## Padding Oracle Attack

**Padding Oracle** — сервер, который при дешифровке сообщает, валиден ли padding. Этого достаточно для полной расшифровки!

### Принцип работы

В CBC дешифрование: P[i] = Decrypt(C[i]) XOR C[i-1]

Атакующий **модифицирует C[i-1]**, чтобы управлять результатом P[i]. Если сервер отвечает «padding valid», атакующий узнаёт значение Decrypt(C[i]).

\\\`\\\`\\\`python
def check_padding(data, block_size):
    """Проверка PKCS#7 padding — это и есть 'oracle'"""
    if len(data) == 0 or len(data) % block_size != 0:
        return False
    pad_len = data[-1]
    if pad_len == 0 or pad_len > block_size:
        return False
    for i in range(pad_len):
        if data[-(i + 1)] != pad_len:
            return False
    return True

# Oracle отвечает True/False
print(check_padding(bytes([1, 2, 3, 3, 3]), 8))  # False (len != block)
print(check_padding(bytes([1, 2, 3, 4, 5, 3, 3, 3]), 8))  # True
print(check_padding(bytes([1, 2, 3, 4, 5, 3, 2, 3]), 8))  # False
\\\`\\\`\\\`

## Моделирование атаки (один байт)

\\\`\\\`\\\`python
def oracle_attack_last_byte(cipher_block, prev_block, oracle_func, block_size):
    """Восстановление последнего байта через Oracle"""
    for guess in range(256):
        # Модифицируем последний байт prev_block
        modified = bytearray(prev_block)
        modified[-1] = guess
        # Если oracle валиден, то:
        # Decrypt(cipher_block)[-1] XOR guess == 0\x01
        test_data = bytes(modified) + cipher_block
        if oracle_func(test_data, block_size):
            # Decrypt(cipher_block)[-1] = guess XOR 0\x01
            intermediate = guess ^ 0\x01
            # Реальный открытый текст:
            plaintext_byte = intermediate ^ prev_block[-1]
            return plaintext_byte
    return None
\\\`\\\`\\\`

## Защита от Padding Oracle

1. **Аутентифицированное шифрование** (AES-GCM) — проверяет целостность
2. **Постоянное время** проверки — не давать тайминг-информацию
3. **HMAC-then-Encrypt** или **Encrypt-then-MAC**`,
    duration: 55,
    assignment: {
      title: 'Валидация PKCS#7 padding',
      description: 'На первой строке дан размер блока block_size (целое число). На второй строке — последовательность байт через пробел (целые числа 0-255). Проверьте, является ли PKCS#7 padding валидным. Padding валиден, если: длина данных кратна block_size, последний байт p (1 <= p <= block_size), и последние p байт все равны p. Выведите "VALID" или "INVALID".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте block_size\n# Считайте байты\n# Проверьте PKCS#7 padding\n# Выведите VALID или INVALID\n\n',
      testCases: [
        { input: '8\n1 2 3 4 5 3 3 3', expectedOutput: 'VALID', description: 'Корректный padding 03 03 03' },
        { input: '8\n1 2 3 4 5 6 7 1', expectedOutput: 'VALID', description: 'Корректный padding 01' },
        { input: '8\n1 2 3 4 5 6 2 3', expectedOutput: 'INVALID', description: 'Некорректный padding — байты не совпадают' },
        { input: '8\n1 2 3 4 5 6 7 0', expectedOutput: 'INVALID', description: 'Padding 0 невалиден' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 5: Радужные таблицы
  // ──────────────────────────────────────────
  {
    slug: 'rainbow-tables',
    title: 'Радужные таблицы',
    description: 'Предвычисленные хеши, соль, bcrypt/scrypt',
    content: `# Радужные таблицы

## Хеш-функции

Хеш-функция преобразует данные произвольной длины в строку фиксированной длины. Свойства криптографического хеша:

1. **Детерминированность** — одинаковый вход = одинаковый выход
2. **Лавинный эффект** — малое изменение входа → полное изменение выхода
3. **Необратимость** — по хешу нельзя восстановить исходные данные
4. **Устойчивость к коллизиям** — сложно найти два входа с одинаковым хешем

\\\`\\\`\\\`python
import hashlib

# MD5 (устаревший, НЕ безопасен!)
h = hashlib.md5(b"password").he\xdigest()
print(f"MD5: {h}")  # 5f4dcc3b5aa765d61d8327deb882cf99

# SHA-256 (современный стандарт)
h = hashlib.sha256(b"password").he\xdigest()
print(f"SHA-256: {h}")

# Лавинный эффект
h1 = hashlib.sha256(b"test1").he\xdigest()
h2 = hashlib.sha256(b"test2").he\xdigest()
# Отличается 1 символ — хеши полностью разные!
\\\`\\\`\\\`

## Атака по словарю

Если пароли хранятся как хеши, атакующий может предвычислить хеши популярных паролей.

\\\`\\\`\\\`python
import hashlib

# "Словарь" паролей
dictionary = ["password", "123456", "qwerty", "admin", "letmein"]

# Предвычисление хешей
hash_table = {}
for pwd in dictionary:
    h = hashlib.sha256(pwd.encode()).he\xdigest()
    hash_table[h] = pwd

# Взлом
target_hash = hashlib.sha256(b"admin").he\xdigest()
if target_hash in hash_table:
    print(f"Пароль найден: {hash_table[target_hash]}")
\\\`\\\`\\\`

## Радужные таблицы

Радужная таблица — это **оптимизированная** структура для хранения предвычисленных хешей. Вместо хранения всех пар (пароль → хеш) используются **цепочки** с функциями редукции.

### Цепочка: пароль → хеш → редукция → пароль → хеш → ...

\\\`\\\`\\\`python
import hashlib

def reduction(hash_hex, index, max_len=6):
    """Функция редукции: хеш -> потенциальный пароль"""
    charset = "abcdefghijklmnopqrstuvwxyz0123456789"
    num = (int(hash_hex[:8], 16) + index) % (len(charset) ** max_len)
    result = ""
    for _ in range(max_len):
        result += charset[num % len(charset)]
        num //= len(charset)
    return result

def build_chain(start, chain_len):
    """Построение одной цепочки"""
    current = start
    for i in range(chain_len):
        h = hashlib.md5(current.encode()).he\xdigest()
        current = reduction(h, i)
    return current  # конечная точка

# Таблица хранит только (начало, конец) каждой цепочки
\\\`\\\`\\\`

## Защита: соль (salt)

**Соль** — случайная строка, добавляемая к паролю перед хешированием:

hash(salt + password) вместо hash(password)

\\\`\\\`\\\`python
import hashlib
import os

def hash_password(password):
    salt = os.urandom(16)  # 16 случайных байт
    h = hashlib.sha256(salt + password.encode()).he\xdigest()
    return salt.hex() + ":" + h

def verify_password(password, stored):
    salt_hex, hash_hex = stored.split(":")
    salt = bytes.fromhex(salt_hex)
    h = hashlib.sha256(salt + password.encode()).he\xdigest()
    return h == hash_hex
\\\`\\\`\\\`

## bcrypt и scrypt

Современные функции хеширования паролей специально **медленные**:
- **bcrypt** — настраиваемый cost factor (раунды)
- **scrypt** — дополнительно требует много памяти
- **Argon2** — победитель Password Hashing Competition (2015)`,
    duration: 50,
    assignment: {
      title: 'Атака по словарю',
      description: 'На первой строке дан SHA-256 хеш (hex-строка). На второй строке число N. Далее N строк — словарь паролей. Найдите пароль, SHA-256 хеш которого совпадает с заданным. Выведите найденный пароль или "NOT FOUND". Используйте hashlib.sha256(password.encode()).he\xdigest().',
      difficulty: 'medium' as const,
      starterCode: '# Считайте target_hash\n# Считайте N\n# Считайте N паролей\n# Найдите пароль с совпадающим хешем\n# Выведите пароль или NOT FOUND\n\nimport hashlib\n\n',
      testCases: [
        { input: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8\n5\nhello\nworld\npassword\nadmin\ntest', expectedOutput: 'password', description: 'Пароль password найден' },
        { input: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918\n4\nroot\nuser\nguest\nadmin', expectedOutput: 'admin', description: 'Пароль admin найден' },
        { input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n3\nabc\ndef\nghi', expectedOutput: 'NOT FOUND', description: 'Пароль не найден в словаре' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 6: Цифровые подписи
  // ──────────────────────────────────────────
  {
    slug: 'digital-signatures',
    title: 'Цифровые подписи',
    description: 'Принцип работы, RSA-подпись, верификация, PKI',
    content: `# Цифровые подписи

## Зачем нужны цифровые подписи?

Цифровая подпись решает три задачи:
1. **Аутентификация** — подтверждение авторства
2. **Целостность** — данные не были изменены
3. **Неотказуемость** — автор не может отрицать подпись

## Принцип работы

1. Отправитель вычисляет **хеш сообщения**
2. Хеш **шифруется закрытым ключом** отправителя → подпись
3. Получатель **расшифровывает подпись** открытым ключом
4. Сравнивает полученный хеш с хешем сообщения

\\\`\\\`\\\`python
import hashlib
from math import gcd

def simple_hash(message):
    """Простая хеш-функция для демонстрации"""
    return int(hashlib.sha256(message.encode()).he\xdigest()[:8], 16)

# RSA-подпись (упрощённо)
def rsa_sign(message, private_key):
    """Подписание: hash -> encrypt с закрытым ключом"""
    d, n = private_key
    h = simple_hash(message) % n
    signature = pow(h, d, n)
    return signature

def rsa_verify(message, signature, public_key):
    """Верификация: decrypt подписи -> сравнение с hash"""
    e, n = public_key
    h = simple_hash(message) % n
    decrypted_hash = pow(signature, e, n)
    return h == decrypted_hash
\\\`\\\`\\\`

## Полный пример

\\\`\\\`\\\`python
def generate_keys(p, q):
    n = p * q
    phi = (p - 1) * (q - 1)
    e = 65537
    if gcd(e, phi) != 1:
        e = 3
        while gcd(e, phi) != 1:
            e += 2
    d = pow(e, -1, phi)
    return (e, n), (d, n)

pub, priv = generate_keys(101, 103)
message = "Transfer 1000 to Alice"
sig = rsa_sign(message, priv)
print(f"Подпись: {sig}")

# Верификация
print(rsa_verify(message, sig, pub))  # True

# Изменённое сообщение
print(rsa_verify("Transfer 9999 to Eve", sig, pub))  # False!
\\\`\\\`\\\`

## PKI — инфраструктура открытых ключей

Проблема: как убедиться, что открытый ключ принадлежит нужному лицу?

**Центр сертификации (CA)** подписывает связку (имя, открытый ключ):

1. Владелец генерирует пару ключей
2. Отправляет открытый ключ + данные в CA
3. CA проверяет личность и выдаёт **сертификат**
4. Сертификат = данные + открытый ключ + подпись CA

\\\`\\\`\\\`python
# Моделирование сертификата
class Certificate:
    def __init__(self, owner, public_key, ca_signature):
        self.owner = owner
        self.public_key = public_key
        self.ca_signature = ca_signature

    def verify(self, ca_public_key):
        """Проверка сертификата подписью CA"""
        data = f"{self.owner}:{self.public_key}"
        return rsa_verify(data, self.ca_signature, ca_public_key)
\\\`\\\`\\\`

## Цепочки доверия

- **Root CA** → подписывает промежуточные CA
- **Промежуточный CA** → подписывает сертификаты серверов
- Браузер доверяет набору Root CA

## Алгоритмы подписей

| Алгоритм | Основа | Статус |
|----------|--------|--------|
| RSA-PSS | Факторизация | Актуальный |
| ECDSA | Эллиптические кривые | Актуальный |
| Ed25519 | Кривая Curve25519 | Современный |
| DSA | Дискретный логарифм | Устаревает |`,
    duration: 50,
    assignment: {
      title: 'RSA-подпись и верификация',
      description: 'На первой строке даны два простых числа p и q. На второй строке — сообщение (строка). На третьей строке — команда SIGN или VERIFY. Если SIGN — вычислите подпись: hash = int(SHA256(message)[:8], 16) % n, signature = pow(hash, d, n). Выведите signature. Если VERIFY — на четвёртой строке дана подпись (число). Проверьте: pow(signature, e, n) == hash. Выведите "VALID" или "INVALID". Используйте e=65537 если gcd(e,phi)=1.',
      difficulty: 'hard' as const,
      starterCode: '# Считайте p, q\n# Считайте message\n# Считайте команду\n# Выполните SIGN или VERIFY\n\nimport hashlib\nfrom math import gcd\n\n',
      testCases: [
        { input: '101 103\nHello\nSIGN', expectedOutput: '1682', description: 'Подпись сообщения Hello' },
        { input: '101 103\nHello\nVERIFY\n1682', expectedOutput: 'VALID', description: 'Верификация корректной подписи' },
        { input: '101 103\nHello\nVERIFY\n1234', expectedOutput: 'INVALID', description: 'Верификация некорректной подписи' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 7: Модель TCP/IP
  // ──────────────────────────────────────────
  {
    slug: 'tcp-ip-model',
    title: 'Модель TCP/IP',
    description: 'Уровни, инкапсуляция, заголовки пакетов',
    content: `# Модель TCP/IP

## Уровни модели TCP/IP

| Уровень | Название | Протоколы | Данные |
|---------|----------|-----------|--------|
| 4 | Прикладной | HTTP, DNS, SMTP, FTP | Сообщения |
| 3 | Транспортный | TCP, UDP | Сегменты/Датаграммы |
| 2 | Сетевой | IP, ICMP, ARP | Пакеты |
| 1 | Канальный | Ethernet, Wi-Fi | Кадры |

## Инкапсуляция

При отправке данные **оборачиваются** заголовками каждого уровня:

Данные → [TCP заголовок + Данные] → [IP заголовок + TCP + Данные] → [Ethernet + IP + TCP + Данные]

\\\`\\\`\\\`python
# Моделирование инкапсуляции
def encapsulate(data, headers):
    """Инкапсуляция данных заголовками"""
    packet = data
    for header in headers:
        packet = header + "|" + packet
    return packet

# Пример
data = "GET /index.html HTTP/1.1"
layers = [
    "TCP:80:1024:SEQ=100",    # Транспортный
    "IP:192.168.1.1:10.0.0.1", # Сетевой
    "ETH:AA:BB:CC:DD"          # Канальный
]
packet = encapsulate(data, layers)
print(packet)
\\\`\\\`\\\`

## IP-заголовок

Ключевые поля IP-заголовка (IPv4, 20 байт минимум):

\\\`\\\`\\\`python
import struct

def parse_ip_header(header_bytes):
    """Разбор IP-заголовка (первые 20 байт)"""
    fields = struct.unpack('!BBHHHBBH4s4s', header_bytes[:20])
    version = fields[0] >> 4
    ihl = fields[0] & 0\x0F
    total_length = fields[2]
    ttl = fields[5]
    protocol = fields[6]  # 6=TCP, 17=UDP, 1=ICMP
    src_ip = '.'.join(str(b) for b in fields[8])
    dst_ip = '.'.join(str(b) for b in fields[9])
    return {
        'version': version,
        'header_length': ihl * 4,
        'total_length': total_length,
        'ttl': ttl,
        'protocol': protocol,
        'src': src_ip,
        'dst': dst_ip
    }
\\\`\\\`\\\`

## TCP-заголовок

\\\`\\\`\\\`python
def parse_tcp_header(header_bytes):
    """Разбор TCP-заголовка"""
    fields = struct.unpack('!HHLLBBHHH', header_bytes[:20])
    src_port = fields[0]
    dst_port = fields[1]
    seq_num = fields[2]
    ack_num = fields[3]
    data_offset = (fields[4] >> 4) * 4
    flags = fields[5]
    # Флаги: URG ACK PSH RST SYN FIN
    flag_names = []
    if flags & 0\x20: flag_names.append("URG")
    if flags & 0\x10: flag_names.append("ACK")
    if flags & 0\x08: flag_names.append("PSH")
    if flags & 0\x04: flag_names.append("RST")
    if flags & 0\x02: flag_names.append("SYN")
    if flags & 0\x01: flag_names.append("FIN")
    return {
        'src_port': src_port,
        'dst_port': dst_port,
        'seq': seq_num,
        'ack': ack_num,
        'flags': flag_names
    }
\\\`\\\`\\\`

## TCP Handshake (трёхстороннее рукопожатие)

1. **SYN** → Клиент отправляет SYN (seq=x)
2. **SYN-ACK** → Сервер отвечает SYN+ACK (seq=y, ack=x+1)
3. **ACK** → Клиент отправляет ACK (ack=y+1)

После этого соединение установлено.

## Безопасность на уровне сети

- **IP spoofing** — подмена IP-адреса отправителя
- **TCP hijacking** — перехват TCP-сессии
- **Sniffing** — прослушивание трафика
- Защита: TLS/SSL, IPsec, VPN`,
    duration: 50,
    assignment: {
      title: 'Разбор сетевого пакета',
      description: 'На первой строке дана строка — модель пакета в формате: "SRC_IP:DST_IP:PROTOCOL:SRC_PORT:DST_PORT:FLAGS". PROTOCOL — число (6=TCP, 17=UDP, 1=ICMP). FLAGS — число (побитовое: 32=URG, 16=ACK, 8=PSH, 4=RST, 2=SYN, 1=FIN). Разберите пакет и выведите три строки: 1) "SRC_IP -> DST_IP", 2) имя протокола (TCP/UDP/ICMP), 3) список флагов через запятую в порядке URG,ACK,PSH,RST,SYN,FIN (только установленные). Если флагов нет — выведите "NONE".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте строку пакета\n# Разберите поля\n# Выведите информацию\n\n',
      testCases: [
        { input: '192.168.1.1:10.0.0.1:6:1024:80:18', expectedOutput: '192.168.1.1 -> 10.0.0.1\nTCP\nACK,SYN', description: 'TCP SYN-ACK пакет (flags=18=16+2)' },
        { input: '10.0.0.5:8.8.8.8:17:12345:53:0', expectedOutput: '10.0.0.5 -> 8.8.8.8\nUDP\nNONE', description: 'UDP DNS запрос без флагов' },
        { input: '172.16.0.1:172.16.0.2:6:443:50000:17', expectedOutput: '172.16.0.1 -> 172.16.0.2\nTCP\nACK,FIN', description: 'TCP FIN-ACK (flags=17=16+1)' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 8: DNS и атаки
  // ──────────────────────────────────────────
  {
    slug: 'dns-attacks',
    title: 'DNS и атаки',
    description: 'Резолвинг, DNS spoofing, DNS tunneling',
    content: `# DNS и атаки

## Система DNS

**DNS** (Domain Name System) — «телефонная книга» интернета. Преобразует доменные имена в IP-адреса.

### Иерархия DNS

\\\`\\\`\\\`
. (корень)
├── com.
│   ├── google.com.
│   └── e\xample.com.
├── org.
│   └── wikipedia.org.
└── ru.
    └── yandex.ru.
\\\`\\\`\\\`

### Типы записей

| Тип | Назначение | Пример |
|-----|-----------|--------|
| A | IPv4 адрес | e\xample.com → 93.184.216.34 |
| AAAA | IPv6 адрес | e\xample.com → 2606:2800:... |
| CNAME | Алиас | www.e\xample.com → e\xample.com |
| MX | Почтовый сервер | e\xample.com → mail.e\xample.com |
| NS | DNS-сервер | e\xample.com → ns1.e\xample.com |
| TXT | Текст | SPF, DKIM записи |

## Процесс резолвинга

\\\`\\\`\\\`python
# Моделирование DNS резолвинга
class DNSResolver:
    def __init__(self):
        self.cache = {}
        self.zone_db = {
            "e\xample.com": {"A": "93.184.216.34", "MX": "mail.e\xample.com"},
            "google.com": {"A": "142.250.74.46"},
            "mail.e\xample.com": {"A": "93.184.216.35"},
        }

    def resolve(self, domain, record_type="A"):
        # 1. Проверяем кеш
        cache_key = f"{domain}:{record_type}"
        if cache_key in self.cache:
            return f"[CACHE] {self.cache[cache_key]}"

        # 2. Рекурсивный запрос
        if domain in self.zone_db and record_type in self.zone_db[domain]:
            result = self.zone_db[domain][record_type]
            self.cache[cache_key] = result
            return result

        return "NXDOMAIN"

resolver = DNSResolver()
print(resolver.resolve("e\xample.com"))      # 93.184.216.34
print(resolver.resolve("e\xample.com"))      # [CACHE] 93.184.216.34
print(resolver.resolve("unknown.com"))      # NXDOMAIN
\\\`\\\`\\\`

## DNS Spoofing (подмена DNS)

Атакующий подменяет DNS-ответ, перенаправляя жертву на свой сервер.

\\\`\\\`\\\`python
class SpoofedDNS:
    """DNS с возможностью spoofing"""
    def __init__(self, real_resolver, spoofed_records):
        self.real = real_resolver
        self.spoofed = spoofed_records  # {"domain": "evil_ip"}

    def resolve(self, domain, record_type="A"):
        # Атакующий перехватывает запрос
        if domain in self.spoofed:
            return self.spoofed[domain]  # Подменённый ответ!
        return self.real.resolve(domain, record_type)

# Атака
evil_dns = SpoofedDNS(resolver, {"bank.com": "192.168.1.100"})
print(evil_dns.resolve("bank.com"))    # 192.168.1.100 (фишинг!)
print(evil_dns.resolve("google.com"))  # Нормальный ответ
\\\`\\\`\\\`

## DNS Tunneling

Используется для **вывода данных** через DNS-запросы — часто обходит файрволы.

Принцип: данные кодируются в поддоменах: \\\`ZW5jb2RlZA.evil.com\\\`

\\\`\\\`\\\`python
import base64

def dns_tunnel_encode(data, domain):
    """Кодирование данных в DNS-запрос"""
    encoded = base64.b32encode(data.encode()).decode().rstrip('=').lower()
    # Разбиваем на части по 63 символа (ограничение DNS)
    parts = [encoded[i:i+63] for i in range(0, len(encoded), 63)]
    return '.'.join(parts) + '.' + domain

def dns_tunnel_decode(query, domain):
    """Извлечение данных из DNS-запроса"""
    subdomain = query.replace('.' + domain, '')
    encoded = subdomain.replace('.', '').upper()
    # Добавляем padding
    padding = '=' * (8 - len(encoded) % 8) if len(encoded) % 8 else ''
    return base64.b32decode(encoded + padding).decode()

secret = "password123"
query = dns_tunnel_encode(secret, "evil.com")
print(f"DNS запрос: {query}")
decoded = dns_tunnel_decode(query, "evil.com")
print(f"Декодировано: {decoded}")
\\\`\\\`\\\`

## Защита

- **DNSSEC** — цифровые подписи DNS-ответов
- **DNS over HTTPS (DoH)** — шифрование DNS-трафика
- **DNS over TLS (DoT)** — TLS для DNS`,
    duration: 55,
    assignment: {
      title: 'DNS-резолвер с кешем',
      description: 'На первой строке число N — количество записей в зоне. Далее N строк формата "domain type value" (например: "e\xample.com A 1.2.3.4"). Затем число Q — количество запросов. Далее Q строк формата "domain type". Для каждого запроса выведите результат. Если запись найдена — выведите значение. При повторном запросе того же domain+type — выведите "CACHE:значение". Если не найдена — "NXDOMAIN".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте N записей зоны\n# Считайте Q запросов\n# Реализуйте резолвер с кешем\n\n',
      testCases: [
        { input: '3\ne\xample.com A 93.184.216.34\ngoogle.com A 142.250.74.46\ne\xample.com MX mail.e\xample.com\n4\ne\xample.com A\ngoogle.com A\ne\xample.com A\nunknown.com A', expectedOutput: '93.184.216.34\n142.250.74.46\nCACHE:93.184.216.34\nNXDOMAIN', description: 'Базовый тест с кешем' },
        { input: '1\ntest.ru A 10.0.0.1\n3\ntest.ru A\ntest.ru MX\ntest.ru A', expectedOutput: '10.0.0.1\nNXDOMAIN\nCACHE:10.0.0.1', description: 'Запрос несуществующего типа записи' },
        { input: '2\na.com A 1.1.1.1\nb.com A 2.2.2.2\n5\na.com A\nb.com A\na.com A\nb.com A\nc.com A', expectedOutput: '1.1.1.1\n2.2.2.2\nCACHE:1.1.1.1\nCACHE:2.2.2.2\nNXDOMAIN', description: 'Множественное кеширование' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 9: Сканирование портов
  // ──────────────────────────────────────────
  {
    slug: 'port-scanning',
    title: 'Сканирование портов',
    description: 'TCP SYN/connect, сервисы, Nmap (теория)',
    content: `# Сканирование портов

## Зачем сканировать порты?

Порт — «точка входа» для сетевого сервиса. Знание открытых портов — первый шаг **разведки** (reconnaissance) в пентесте.

## Известные порты

| Порт | Протокол | Сервис |
|------|----------|--------|
| 21 | TCP | FTP |
| 22 | TCP | SSH |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 8080 | TCP | HTTP Proxy |

## Типы сканирования

### TCP Connect Scan

Полное TCP-рукопожатие. Надёжно, но заметно.

\\\`\\\`\\\`python
# Моделирование TCP Connect Scan
def tcp_connect_scan(target, ports, open_ports_set):
    """Моделирование сканирования"""
    results = {}
    for port in ports:
        if port in open_ports_set:
            # SYN -> SYN-ACK -> ACK (соединение установлено)
            results[port] = "open"
        else:
            # SYN -> RST (порт закрыт)
            results[port] = "closed"
    return results

# Пример
open_ports = {22, 80, 443}
scan = tcp_connect_scan("192.168.1.1", range(1, 1025), open_ports)
for port, state in scan.items():
    if state == "open":
        print(f"Port {port}: {state}")
\\\`\\\`\\\`

### TCP SYN Scan (полуоткрытое)

Отправляется только SYN. Если ответ SYN-ACK — порт открыт, RST — закрыт. Соединение **не завершается** (отправляется RST). Менее заметно.

### UDP Scan

Отправляется пустой UDP-пакет. Если ICMP «port unreachable» — закрыт. Нет ответа — открыт или фильтруется. Медленно и ненадёжно.

## Определение сервисов

\\\`\\\`\\\`python
WELL_KNOWN_PORTS = {
    21: "FTP", 22: "SSH", 23: "Telnet", 25: "SMTP",
    53: "DNS", 80: "HTTP", 110: "POP3", 143: "IMAP",
    443: "HTTPS", 993: "IMAPS", 995: "POP3S",
    3306: "MySQL", 5432: "PostgreSQL", 8080: "HTTP-Proxy",
    3389: "RDP", 6379: "Redis", 27017: "MongoDB"
}

def identify_service(port):
    return WELL_KNOWN_PORTS.get(port, "Unknown")

def scan_report(open_ports):
    print(f"{'PORT':<8} {'STATE':<8} {'SERVICE'}")
    print("-" * 30)
    for port in sorted(open_ports):
        service = identify_service(port)
        print(f"{port:<8} {'open':<8} {service}")

scan_report([22, 80, 443, 3306, 9999])
\\\`\\\`\\\`

## Nmap — основы (теория)

Nmap — главный инструмент сканирования. Основные команды:

\\\`\\\`\\\`
nmap -sS target        # SYN scan
nmap -sT target        # TCP connect scan
nmap -sU target        # UDP scan
nmap -sV target        # Определение версий сервисов
nmap -O target         # Определение ОС
nmap -p 1-1000 target  # Диапазон портов
nmap -A target         # Aggressive scan (всё вместе)
\\\`\\\`\\\`

## Защита от сканирования

- **Firewall** — фильтрация входящих пакетов
- **Port knocking** — порт открывается после последовательности «стуков»
- **IDS/IPS** — обнаружение и блокировка сканирования
- Закрытие ненужных сервисов`,
    duration: 50,
    assignment: {
      title: 'Анализ результатов сканирования',
      description: 'На первой строке число N — количество результатов сканирования. Далее N строк формата "port state" (state: open/closed/filtered). Определите сервис для каждого открытого порта из словаря: 21=FTP, 22=SSH, 25=SMTP, 53=DNS, 80=HTTP, 443=HTTPS, 3306=MySQL, 5432=PostgreSQL, 8080=HTTP-Proxy (остальные — Unknown). Выведите только открытые порты в формате "port service" (по возрастанию порта).',
      difficulty: 'medium' as const,
      starterCode: '# Считайте N\n# Считайте результаты сканирования\n# Определите сервисы\n# Выведите открытые порты\n\n',
      testCases: [
        { input: '5\n22 open\n80 open\n443 open\n3306 closed\n9999 open', expectedOutput: '22 SSH\n80 HTTP\n443 HTTPS\n9999 Unknown', description: 'Открытые порты с известными и неизвестным сервисом' },
        { input: '3\n21 open\n25 filtered\n53 open', expectedOutput: '21 FTP\n53 DNS', description: 'FTP и DNS открыты, SMTP фильтруется' },
        { input: '4\n80 closed\n443 closed\n8080 open\n5432 open', expectedOutput: '5432 PostgreSQL\n8080 HTTP-Proxy', description: 'HTTP закрыт, proxy и PostgreSQL открыты' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 10: Firewall и IDS
  // ──────────────────────────────────────────
  {
    slug: 'firewall-ids',
    title: 'Firewall и IDS',
    description: 'Фильтрация пакетов, правила, обнаружение вторжений',
    content: `# Firewall и IDS

## Firewall (межсетевой экран)

Firewall контролирует сетевой трафик на основе **правил**. Решает: пропустить, заблокировать или отклонить пакет.

### Типы файрволов

| Тип | Уровень | Описание |
|-----|---------|----------|
| Пакетный фильтр | Сетевой (L3-L4) | Проверяет заголовки IP/TCP |
| Stateful | Сетевой (L3-L4) | Отслеживает состояние соединений |
| Application | Прикладной (L7) | Понимает протоколы (HTTP, DNS) |
| WAF | Прикладной (L7) | Защита веб-приложений |

### Правила файрвола

\\\`\\\`\\\`python
class FirewallRule:
    def __init__(self, action, src_ip=None, dst_ip=None,
                 protocol=None, dst_port=None):
        self.action = action      # ALLOW / DENY
        self.src_ip = src_ip      # None = any
        self.dst_ip = dst_ip
        self.protocol = protocol  # TCP / UDP / ICMP / None=any
        self.dst_port = dst_port  # None = any

    def matches(self, packet):
        if self.src_ip and packet['src_ip'] != self.src_ip:
            return False
        if self.dst_ip and packet['dst_ip'] != self.dst_ip:
            return False
        if self.protocol and packet['protocol'] != self.protocol:
            return False
        if self.dst_port and packet.get('dst_port') != self.dst_port:
            return False
        return True

class Firewall:
    def __init__(self, default_action="DENY"):
        self.rules = []
        self.default = default_action

    def add_rule(self, rule):
        self.rules.append(rule)

    def process(self, packet):
        for rule in self.rules:
            if rule.matches(packet):
                return rule.action
        return self.default  # Правило по умолчанию

# Настройка файрвола
fw = Firewall(default_action="DENY")
fw.add_rule(FirewallRule("ALLOW", dst_port=80, protocol="TCP"))
fw.add_rule(FirewallRule("ALLOW", dst_port=443, protocol="TCP"))
fw.add_rule(FirewallRule("DENY", src_ip="192.168.1.100"))
fw.add_rule(FirewallRule("ALLOW", dst_port=22, protocol="TCP"))
\\\`\\\`\\\`

## IDS — Intrusion Detection System

IDS анализирует трафик и выявляет **аномалии** или **сигнатуры** атак.

### Сигнатурный подход

\\\`\\\`\\\`python
class SignatureIDS:
    def __init__(self):
        self.signatures = [
            {"name": "SQL Injection", "pattern": "' OR 1=1"},
            {"name": "XSS", "pattern": "<script>"},
            {"name": "Path Traversal", "pattern": "../"},
            {"name": "Command Injection", "pattern": "; rm -rf"},
            {"name": "Port Scan", "pattern": "SYN_ONLY"},
        ]
        self.alerts = []

    def inspect(self, payload):
        for sig in self.signatures:
            if sig["pattern"].lower() in payload.lower():
                alert = f"ALERT: {sig['name']} detected!"
                self.alerts.append(alert)
                return alert
        return "OK"

ids = SignatureIDS()
print(ids.inspect("SELECT * FROM users WHERE id=' OR 1=1--"))
print(ids.inspect("Normal GET request"))
print(ids.inspect("<script>alert('xss')</script>"))
\\\`\\\`\\\`

### Аномальный подход

\\\`\\\`\\\`python
class AnomalyIDS:
    def __init__(self, threshold):
        self.threshold = threshold
        self.connection_count = {}  # IP -> count

    def observe(self, src_ip):
        self.connection_count[src_ip] = self.connection_count.get(src_ip, 0) + 1
        if self.connection_count[src_ip] > self.threshold:
            return f"ALERT: Anomaly from {src_ip} ({self.connection_count[src_ip]} connections)"
        return "OK"

# Порог: 100 соединений
anomaly_ids = AnomalyIDS(threshold=100)
for _ in range(101):
    result = anomaly_ids.observe("10.0.0.5")
# Последний вызов даст ALERT
\\\`\\\`\\\`

## IPS — Intrusion Prevention System

IPS = IDS + **блокировка** вредоносного трафика в реальном времени.`,
    duration: 55,
    assignment: {
      title: 'Моделирование файрвола',
      description: 'На первой строке — действие по умолчанию (ALLOW или DENY). На второй — число R (правила). Далее R строк формата: "ACTION PROTOCOL DST_PORT" (например "ALLOW TCP 80"). На следующей строке — число P (пакеты). Далее P строк формата: "PROTOCOL DST_PORT". Для каждого пакета проверьте правила по порядку: первое совпавшее (по protocol и dst_port) определяет действие. Если ни одно не совпало — действие по умолчанию. Выведите для каждого пакета ALLOW или DENY.',
      difficulty: 'medium' as const,
      starterCode: '# Считайте действие по умолчанию\n# Считайте правила\n# Считайте пакеты\n# Примените правила\n\n',
      testCases: [
        { input: 'DENY\n3\nALLOW TCP 80\nALLOW TCP 443\nDENY TCP 23\n4\nTCP 80\nTCP 443\nTCP 22\nTCP 23', expectedOutput: 'ALLOW\nALLOW\nDENY\nDENY', description: 'HTTP и HTTPS разрешены, SSH заблокирован по умолчанию, Telnet явно запрещён' },
        { input: 'ALLOW\n2\nDENY TCP 3306\nDENY TCP 5432\n3\nTCP 80\nTCP 3306\nTCP 5432', expectedOutput: 'ALLOW\nDENY\nDENY', description: 'По умолчанию ALLOW, БД заблокированы' },
        { input: 'DENY\n1\nALLOW TCP 22\n3\nTCP 22\nUDP 53\nTCP 80', expectedOutput: 'ALLOW\nDENY\nDENY', description: 'Только SSH разрешён' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 11: MITM-атаки
  // ──────────────────────────────────────────
  {
    slug: 'mitm-attacks',
    title: 'MITM-атаки',
    description: 'ARP spoofing, SSL stripping, защита',
    content: `# MITM-атаки

## Что такое MITM?

**Man-in-the-Middle** — атакующий встаёт «посередине» между двумя сторонами, перехватывая и/или модифицируя трафик.

\\\`\\\`\\\`
Алиса  <──────>  Ева (MITM)  <──────>  Боб
       (думает,            (думает,
        что Боб)            что Алиса)
\\\`\\\`\\\`

## ARP Spoofing

ARP (Address Resolution Protocol) преобразует IP → MAC-адрес в локальной сети.

### Как работает ARP

\\\`\\\`\\\`python
class ARPTable:
    """ARP-таблица узла"""
    def __init__(self):
        self.table = {}  # IP -> MAC

    def update(self, ip, mac):
        self.table[ip] = mac

    def resolve(self, ip):
        return self.table.get(ip, None)

# Нормальная ARP-таблица жертвы
victim_arp = ARPTable()
victim_arp.update("192.168.1.1", "AA:BB:CC:DD:EE:01")  # Роутер
victim_arp.update("192.168.1.2", "AA:BB:CC:DD:EE:02")  # Сервер

print(victim_arp.resolve("192.168.1.1"))  # MAC роутера
\\\`\\\`\\\`

### ARP Spoofing атака

\\\`\\\`\\\`python
def arp_spoof(victim_arp, target_ip, attacker_mac):
    """Атакующий отправляет поддельный ARP-ответ"""
    # Жертва обновляет ARP-таблицу:
    # IP роутера -> MAC атакующего!
    victim_arp.update(target_ip, attacker_mac)
    return victim_arp.resolve(target_ip)

attacker_mac = "EV:IL:EV:IL:EV:IL"
# Подменяем MAC роутера на MAC атакующего
new_mac = arp_spoof(victim_arp, "192.168.1.1", attacker_mac)
print(f"Жертва думает, что роутер = {new_mac}")
# Теперь весь трафик к роутеру идёт через атакующего!
\\\`\\\`\\\`

## SSL Stripping

Атакующий понижает HTTPS до HTTP:

1. Жертва запрашивает http://bank.com
2. Сервер отвечает: «перейди на https://bank.com»
3. MITM перехватывает и устанавливает HTTPS с сервером
4. С жертвой общается по HTTP (без шифрования)!

\\\`\\\`\\\`python
class SSLStripper:
    """Моделирование SSL stripping"""
    def __init__(self):
        self.intercepted = []

    def process_response(self, response):
        # Заменяем https:// на http://
        modified = response.replace("https://", "http://")
        if modified != response:
            self.intercepted.append(response)
        return modified

    def process_request(self, request):
        # Перехватываем данные (логин/пароль)
        if "password=" in request:
            self.intercepted.append(f"STOLEN: {request}")
        # Отправляем серверу по HTTPS
        return request.replace("http://", "https://")

stripper = SSLStripper()
# Сервер ответил: перейди на HTTPS
resp = stripper.process_response("Location: https://bank.com/login")
print(resp)  # Location: http://bank.com/login

# Жертва отправляет данные по HTTP (!)
req = stripper.process_request("POST http://bank.com/login password=secret123")
print(f"Перехвачено: {stripper.intercepted}")
\\\`\\\`\\\`

## Защита от MITM

| Атака | Защита |
|-------|--------|
| ARP Spoofing | Static ARP, 802.1X, ARP Inspection |
| SSL Stripping | HSTS, Certificate Pinning |
| DNS Spoofing | DNSSEC, DoH/DoT |
| Общее | VPN, взаимная аутентификация |

## HSTS — HTTP Strict Transport Security

Сервер указывает браузеру: «используй **только** HTTPS». Браузер запоминает и не допускает понижения.`,
    duration: 50,
    assignment: {
      title: 'Детектор ARP spoofing',
      description: 'На первой строке число N — количество ARP-записей (наблюдений). Далее N строк формата "IP MAC". Обнаружьте ARP spoofing: если один IP-адрес ассоциируется с разными MAC-адресами (MAC изменился), это подозрительно. Выведите все подозрительные IP (в порядке первого обнаружения конфликта), по одному на строку, в формате "IP SPOOFED old_MAC->new_MAC". Если конфликтов нет — выведите "NO SPOOFING".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте N\n# Считайте ARP-записи\n# Обнаружьте конфликты MAC для одного IP\n\n',
      testCases: [
        { input: '5\n192.168.1.1 AA:BB:CC:DD:EE:01\n192.168.1.2 AA:BB:CC:DD:EE:02\n192.168.1.1 EV:IL:00:00:00:01\n192.168.1.3 AA:BB:CC:DD:EE:03\n192.168.1.2 EV:IL:00:00:00:02', expectedOutput: '192.168.1.1 SPOOFED AA:BB:CC:DD:EE:01->EV:IL:00:00:00:01\n192.168.1.2 SPOOFED AA:BB:CC:DD:EE:02->EV:IL:00:00:00:02', description: 'Два IP подменены' },
        { input: '3\n10.0.0.1 AA:AA:AA:AA:AA:AA\n10.0.0.2 BB:BB:BB:BB:BB:BB\n10.0.0.3 CC:CC:CC:CC:CC:CC', expectedOutput: 'NO SPOOFING', description: 'Нет конфликтов' },
        { input: '4\n192.168.0.1 11:22:33:44:55:66\n192.168.0.1 AA:BB:CC:DD:EE:FF\n192.168.0.1 00:11:22:33:44:55\n192.168.0.2 FF:FF:FF:FF:FF:FF', expectedOutput: '192.168.0.1 SPOOFED 11:22:33:44:55:66->AA:BB:CC:DD:EE:FF', description: 'Множественные изменения одного IP — выводим только первый конфликт' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 12: Дампы памяти
  // ──────────────────────────────────────────
  {
    slug: 'memory-dumps',
    title: 'Дампы памяти',
    description: 'Структура RAM, извлечение данных, строки и артефакты',
    content: `# Дампы памяти

## Что такое дамп памяти?

**Дамп памяти** (memory dump) — снимок содержимого оперативной памяти в определённый момент времени. Форензический аналитик извлекает из него:

- Запущенные процессы
- Открытые файлы и сетевые соединения
- Пароли и ключи шифрования
- Историю команд
- Вредоносный код

## Представление данных в памяти

\\\`\\\`\\\`python
import struct

# Целые числа в памяти (little-endian, \x86)
value = 0\x12345678
packed = struct.pack('<I', value)  # little-endian unsigned int
print(f"Значение: 0x{value:08X}")
print(f"В памяти: {' '.join(f'{b:02X}' for b in packed)}")
# В памяти: 78 56 34 12  (байты перевёрнуты!)

# Обратно
unpacked = struct.unpack('<I', packed)[0]
print(f"Восстановлено: 0x{unpacked:08X}")
\\\`\\\`\\\`

## Извлечение строк

Одна из простейших техник — поиск читаемых строк (ASCII/UTF-8) в бинарных данных.

\\\`\\\`\\\`python
def extract_strings(data, min_length=4):
    """Извлечение ASCII-строк из бинарных данных"""
    strings = []
    current = ""
    for byte in data:
        if 32 <= byte <= 126:  # Печатные ASCII-символы
            current += chr(byte)
        else:
            if len(current) >= min_length:
                strings.append(current)
            current = ""
    if len(current) >= min_length:
        strings.append(current)
    return strings

# Пример: "бинарные данные" с читаемыми строками
raw = bytes([
    0\x00, 0\xFF, 0\x70, 0\x61, 0\x73, 0\x73, 0\x77, 0\x6F,  # ..passwo
    0\x72, 0\x64, 0\x31, 0\x32, 0\x33, 0\x00, 0\xFF, 0\x00,  # rd123...
    0\x68, 0\x74, 0\x74, 0\x70, 0\x3A, 0\x2F, 0\x2F, 0\x65,  # http://e
    0\x76, 0\x69, 0\x6C, 0\x2E, 0\x63, 0\x6F, 0\x6D, 0\x00,  # vil.com.
])
found = extract_strings(raw)
print(found)  # ['password123', 'http://evil.com']
\\\`\\\`\\\`

## Поиск паттернов

\\\`\\\`\\\`python
def find_pattern(data, pattern):
    """Поиск байтовой последовательности в дампе"""
    results = []
    pattern_bytes = bytes(pattern)
    for i in range(len(data) - len(pattern_bytes) + 1):
        if data[i:i + len(pattern_bytes)] == pattern_bytes:
            results.append(i)
    return results

# Поиск "MZ" (сигнатура PE-файла Windows)
dump = b'\\\x00\\\x00\\\x4D\\\x5A\\\x90\\\x00\\\x03\\\x00\\\x00\\\x4D\\\x5A'
offsets = find_pattern(dump, [0\x4D, 0\x5A])
print(f"PE-файлы найдены по смещениям: {offsets}")  # [2, 9]
\\\`\\\`\\\`

## Анализ процессов

\\\`\\\`\\\`python
# Моделирование извлечения информации о процессах
def parse_process_list(raw_data):
    """Парсинг списка процессов из дампа"""
    processes = []
    # Формат: 4 байта PID + 4 байта PPID + 32 байта имя
    record_size = 40
    for i in range(0, len(raw_data) - record_size + 1, record_size):
        pid = struct.unpack('<I', raw_data[i:i+4])[0]
        ppid = struct.unpack('<I', raw_data[i+4:i+8])[0]
        name = raw_data[i+8:i+40].split(b'\\\x00')[0].decode('ascii', errors='ignore')
        if pid > 0 and name:
            processes.append({'pid': pid, 'ppid': ppid, 'name': name})
    return processes
\\\`\\\`\\\`

## Инструменты форензики памяти

- **Volatility** — главный фреймворк для анализа дампов
- **Rekall** — альтернативный фреймворк
- **strings** — извлечение строк (Unix-утилита)`,
    duration: 55,
    assignment: {
      title: 'Извлечение строк из дампа',
      description: 'На первой строке дана последовательность байт в hex через пробел (например: "48 65 6C 6C 6F 00 FF 57 6F 72 6C 64"). На второй строке — минимальная длина строки N. Извлеките все ASCII-строки (символы с кодами 32-126) длиной >= N. Выведите каждую найденную строку на отдельной строке. Если строк нет — выведите "NO STRINGS".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте hex-байты\n# Считайте min_length\n# Извлеките ASCII-строки\n\n',
      testCases: [
        { input: '00 FF 70 61 73 73 77 6F 72 64 31 32 33 00 FF 00 68 74 74 70 3A 2F 2F 65 76 69 6C 2E 63 6F 6D 00\n4', expectedOutput: 'password123\nhttp://evil.com', description: 'Две строки в бинарных данных' },
        { input: '41 42 43 00 44 45 00 46 47 48 49 4A\n3', expectedOutput: 'ABC\nFGHIJ', description: 'Строки разделены нулевыми байтами' },
        { input: '00 01 02 03 FF FE FD\n3', expectedOutput: 'NO STRINGS', description: 'Нет печатных строк' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 13: Карвинг файлов
  // ──────────────────────────────────────────
  {
    slug: 'file-carving',
    title: 'Карвинг файлов',
    description: 'Восстановление по сигнатурам, magic bytes, инструменты',
    content: `# Карвинг файлов

## Что такое карвинг?

**File carving** — восстановление файлов из сырых данных (дамп диска, памяти) без использования файловой системы. Основан на **сигнатурах** (magic bytes) — уникальных последовательностях байт в начале файлов.

## Сигнатуры файлов (Magic Bytes)

| Формат | Сигнатура (hex) | ASCII |
|--------|----------------|-------|
| JPEG | FF D8 FF | ... |
| PNG | 89 50 4E 47 0D 0A 1A 0A | .PNG.... |
| PDF | 25 50 44 46 | %PDF |
| ZIP | 50 4B 03 04 | PK.. |
| ELF | 7F 45 4C 46 | .ELF |
| PE (EXE) | 4D 5A | MZ |
| GIF | 47 49 46 38 | GIF8 |
| RAR | 52 61 72 21 | Rar! |

\\\`\\\`\\\`python
# Словарь сигнатур
FILE_SIGNATURES = {
    'JPEG': bytes([0\xFF, 0\xD8, 0\xFF]),
    'PNG':  bytes([0\x89, 0\x50, 0\x4E, 0\x47]),
    'PDF':  bytes([0\x25, 0\x50, 0\x44, 0\x46]),
    'ZIP':  bytes([0\x50, 0\x4B, 0\x03, 0\x04]),
    'ELF':  bytes([0\x7F, 0\x45, 0\x4C, 0\x46]),
    'PE':   bytes([0\x4D, 0\x5A]),
    'GIF':  bytes([0\x47, 0\x49, 0\x46, 0\x38]),
    'RAR':  bytes([0\x52, 0\x61, 0\x72, 0\x21]),
}

def identify_file(data):
    """Определение типа файла по сигнатуре"""
    for name, sig in FILE_SIGNATURES.items():
        if data[:len(sig)] == sig:
            return name
    return "UNKNOWN"

# Примеры
print(identify_file(b'\\\x89PNG\\r\\n\\\x1a\\n...'))  # PNG
print(identify_file(b'%PDF-1.4...'))              # PDF
print(identify_file(b'MZ\\\x90\\\x00...'))            # PE
\\\`\\\`\\\`

## Алгоритм карвинга

\\\`\\\`\\\`python
def carve_files(raw_data, signatures):
    """Простой карвинг: находим начала файлов"""
    found = []
    for offset in range(len(raw_data)):
        for name, sig in signatures.items():
            if raw_data[offset:offset + len(sig)] == sig:
                found.append({
                    'type': name,
                    'offset': offset,
                    'signature': sig.hex()
                })
    return found

# Моделирование сырых данных диска
disk_data = bytearray(1000)
# "Спрятаны" файлы:
disk_data[100:103] = bytes([0\xFF, 0\xD8, 0\xFF])   # JPEG на смещении 100
disk_data[500:504] = bytes([0\x25, 0\x50, 0\x44, 0\x46])  # PDF на смещении 500
disk_data[800:802] = bytes([0\x4D, 0\x5A])          # PE на смещении 800

results = carve_files(bytes(disk_data), FILE_SIGNATURES)
for r in results:
    print(f"Найден {r['type']} на смещении {r['offset']}")
\\\`\\\`\\\`

## Footer-сигнатуры

Некоторые форматы имеют **завершающие** сигнатуры:
- JPEG: FF D9
- PNG: 49 45 4E 44 AE 42 60 82 (IEND)
- PDF: %%EOF

\\\`\\\`\\\`python
FILE_FOOTERS = {
    'JPEG': bytes([0\xFF, 0\xD9]),
    'PDF':  b'%%EOF',
}

def carve_with_footer(raw_data, header_sig, footer_sig):
    """Карвинг с учётом footer для определения размера"""
    files = []
    offset = 0
    while offset < len(raw_data):
        # Ищем header
        pos = raw_data.find(header_sig, offset)
        if pos == -1:
            break
        # Ищем footer после header
        end = raw_data.find(footer_sig, pos + len(header_sig))
        if end != -1:
            end += len(footer_sig)
            files.append(raw_data[pos:end])
        offset = pos + 1
    return files
\\\`\\\`\\\`

## Инструменты

- **Foremost** — классический карвер
- **Scalpel** — настраиваемый карвер
- **PhotoRec** — восстановление медиафайлов
- **Binwalk** — анализ прошивок и встроенных файлов`,
    duration: 50,
    assignment: {
      title: 'Карвинг файлов по сигнатурам',
      description: 'На первой строке дана последовательность байт в hex через пробел — содержимое «диска». Найдите все вхождения файловых сигнатур: JPEG=FFD8FF, PNG=89504E47, PDF=25504446, ZIP=504B0304, PE=4D5A. Выведите для каждого найденного файла строку "TYPE offset=OFFSET" в порядке возрастания смещения. Если ничего не найдено — выведите "NO FILES".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте hex-байты\n# Ищите сигнатуры файлов\n# Выведите результаты\n\n',
      testCases: [
        { input: '00 00 FF D8 FF 00 00 25 50 44 46 00 4D 5A 00', expectedOutput: 'JPEG offset=2\nPDF offset=7\nPE offset=12', description: 'JPEG, PDF и PE в данных' },
        { input: '89 50 4E 47 00 00 50 4B 03 04 00', expectedOutput: 'PNG offset=0\nZIP offset=6', description: 'PNG в начале и ZIP' },
        { input: '00 00 00 00 00 01 02 03', expectedOutput: 'NO FILES', description: 'Нет файловых сигнатур' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 14: Метаданные
  // ──────────────────────────────────────────
  {
    slug: 'metadata-analysis',
    title: 'Метаданные: EXIF, Office, PDF',
    description: 'Извлечение и анализ метаданных файлов',
    content: `# Метаданные: EXIF, Office, PDF

## Что такое метаданные?

**Метаданные** — «данные о данных». Содержат скрытую информацию о файле: автор, время создания, GPS-координаты, использованное ПО и т.д.

В форензике метаданные — **кладезь информации** для расследования.

## EXIF (E\xchangeable Image File Format)

Метаданные фотографий: камера, настройки, GPS-координаты.

\\\`\\\`\\\`python
# Моделирование EXIF-данных
exif_data = {
    'Make': 'Canon',
    'Model': 'Canon EOS 5D Mark IV',
    'DateTime': '2024:03:15 14:30:22',
    'ExposureTime': '1/250',
    'FNumber': 'f/5.6',
    'ISO': 400,
    'GPSLatitude': 55.7558,   # Москва
    'GPSLongitude': 37.6173,
    'Software': 'Adobe Photoshop CC 2024',
    'ImageWidth': 6720,
    'ImageHeight': 4480,
}

def analyze_exif(exif):
    """Анализ EXIF-данных для форензики"""
    findings = []
    if 'GPSLatitude' in exif:
        findings.append(f"Геолокация: {exif['GPSLatitude']}, {exif['GPSLongitude']}")
    if 'DateTime' in exif:
        findings.append(f"Дата съёмки: {exif['DateTime']}")
    if 'Software' in exif:
        findings.append(f"Обработка: {exif['Software']}")
    if 'Make' in exif:
        findings.append(f"Камера: {exif['Make']} {exif.get('Model', '')}")
    return findings

for f in analyze_exif(exif_data):
    print(f)
\\\`\\\`\\\`

## Метаданные Office-документов

\\\`\\\`\\\`python
# Office-документы (.docx, .xlsx) — это ZIP-архивы с XML
# Метаданные в docProps/core.xml

office_metadata = {
    'title': 'Секретный отчёт',
    'creator': 'Иванов А.П.',
    'lastModifiedBy': 'Петров Б.В.',
    'created': '2024-01-15T10:30:00Z',
    'modified': '2024-03-20T16:45:00Z',
    'revision': 15,
    'company': 'ООО Рога и Копыта',
    'application': 'Microsoft Office Word 2019',
}

def analyze_office_metadata(meta):
    """Форензический анализ метаданных Office"""
    findings = []
    if meta.get('creator') != meta.get('lastModifiedBy'):
        findings.append(
            f"Документ создан '{meta['creator']}', "
            f"изменён '{meta['lastModifiedBy']}'"
        )
    if meta.get('revision', 0) > 10:
        findings.append(f"Много правок: {meta['revision']} ревизий")
    if meta.get('company'):
        findings.append(f"Организация: {meta['company']}")
    return findings
\\\`\\\`\\\`

## Метаданные PDF

\\\`\\\`\\\`python
# PDF содержит словарь метаданных
pdf_metadata = {
    'Title': 'Договор купли-продажи',
    'Author': 'admin',  # Подозрительное имя автора
    'Creator': 'Microsoft Word 2016',
    'Producer': 'Mac OS X 10.15 Quartz PDFContext',
    'CreationDate': "D:20240315143000+03'00'",
    'ModDate': "D:20240316091500+03'00'",
}

def parse_pdf_date(date_str):
    """Парсинг даты PDF формата D:YYYYMMDDHHmmSS"""
    if date_str.startswith("D:"):
        date_str = date_str[2:]
    year = date_str[0:4]
    month = date_str[4:6]
    day = date_str[6:8]
    hour = date_str[8:10]
    minute = date_str[10:12]
    return f"{year}-{month}-{day} {hour}:{minute}"

print(parse_pdf_date(pdf_metadata['CreationDate']))
\\\`\\\`\\\`

## Очистка метаданных

\\\`\\\`\\\`python
def sanitize_metadata(metadata, keep_fields=None):
    """Очистка метаданных"""
    if keep_fields is None:
        return {}
    return {k: v for k, v in metadata.items() if k in keep_fields}

# Оставляем только безопасные поля
clean = sanitize_metadata(exif_data, keep_fields=['ImageWidth', 'ImageHeight'])
print(clean)  # Без GPS, автора, камеры
\\\`\\\`\\\`

## OSINT через метаданные

Метаданные позволяют:
- Определить **местоположение** (GPS)
- Выявить **автора** документа
- Установить **время** создания/изменения
- Определить **ПО** и ОС автора
- Обнаружить **несоответствия** (подделки)`,
    duration: 50,
    assignment: {
      title: 'Анализ метаданных',
      description: 'На первой строке число N — количество метаданных. Далее N строк формата "key:value". Проведите анализ и выведите все «подозрительные» находки, по одной на строку: 1) Если есть ключи GPSLatitude и GPSLongitude — "GEOLOCATION lat lon". 2) Если creator != lastModifiedBy (оба есть) — "AUTHOR_MISMATCH creator->lastModifiedBy". 3) Если ключ Software или application содержит "Photoshop" — "IMAGE_EDITED". Если подозрительного нет — "CLEAN".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте N метаданных\n# Проанализируйте\n# Выведите находки\n\n',
      testCases: [
        { input: '5\nMake:Canon\nDateTime:2024-03-15\nGPSLatitude:55.7558\nGPSLongitude:37.6173\nSoftware:Adobe Photoshop CC', expectedOutput: 'GEOLOCATION 55.7558 37.6173\nIMAGE_EDITED', description: 'GPS и Photoshop обнаружены' },
        { input: '4\ncreator:Ivanov\nlastModifiedBy:Petrov\ntitle:Report\nrevision:5', expectedOutput: 'AUTHOR_MISMATCH Ivanov->Petrov', description: 'Разные авторы' },
        { input: '3\ntitle:Document\ncreator:Admin\nlastModifiedBy:Admin', expectedOutput: 'CLEAN', description: 'Нет подозрительных данных' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 15: Timeline-анализ
  // ──────────────────────────────────────────
  {
    slug: 'timeline-analysis',
    title: 'Timeline-анализ',
    description: 'Временные метки файлов, MAC-times, реконструкция событий',
    content: `# Timeline-анализ

## MAC-times

Каждый файл имеет три (или более) временных метки:

| Метка | Значение | Обновляется при |
|-------|----------|-----------------|
| **M**odified | Время изменения содержимого | Запись в файл |
| **A**ccessed | Время последнего доступа | Чтение файла |
| **C**hanged / Created | Время изменения метаданных / создания | Переименование, смена прав |

\\\`\\\`\\\`python
from datetime import datetime

class FileTimestamps:
    def __init__(self, name, modified, accessed, created):
        self.name = name
        self.modified = datetime.fromisoformat(modified)
        self.accessed = datetime.fromisoformat(accessed)
        self.created = datetime.fromisoformat(created)

    def detect_anomalies(self):
        """Обнаружение аномалий в MAC-times"""
        anomalies = []
        # Modified раньше Created — файл скопирован/перемещён
        if self.modified < self.created:
            anomalies.append("TIMESTOMP: Modified < Created")
        # Accessed раньше Created
        if self.accessed < self.created:
            anomalies.append("TIMESTOMP: Accessed < Created")
        return anomalies

f = FileTimestamps(
    "secret.docx",
    modified="2024-01-10T08:00:00",
    accessed="2024-03-15T14:30:00",
    created="2024-03-01T12:00:00"
)
# Modified (январь) < Created (март) — подозрительно!
print(f.detect_anomalies())
\\\`\\\`\\\`

## Построение timeline

\\\`\\\`\\\`python
from datetime import datetime

def build_timeline(events):
    """Построение хронологии событий"""
    timeline = []
    for event in events:
        dt = datetime.fromisoformat(event['time'])
        timeline.append((dt, event['action'], event['file']))
    # Сортировка по времени
    timeline.sort(key=lambda x: x[0])
    return timeline

events = [
    {'time': '2024-03-15T14:30:00', 'action': 'CREATED', 'file': 'malware.e\xe'},
    {'time': '2024-03-15T14:25:00', 'action': 'MODIFIED', 'file': 'hosts'},
    {'time': '2024-03-15T14:35:00', 'action': 'CREATED', 'file': 'backdoor.py'},
    {'time': '2024-03-15T14:20:00', 'action': 'ACCESSED', 'file': 'credentials.txt'},
    {'time': '2024-03-15T14:32:00', 'action': 'DELETED', 'file': 'logs.txt'},
]

timeline = build_timeline(events)
for time, action, file in timeline:
    print(f"[{time.strftime('%H:%M:%S')}] {action:10} {file}")
\\\`\\\`\\\`

## Обнаружение timestomping

**Timestomping** — умышленная подмена временных меток для сокрытия следов.

\\\`\\\`\\\`python
def detect_timestomp(files):
    """Обнаружение timestomping"""
    suspicious = []
    for f in files:
        modified = datetime.fromisoformat(f['modified'])
        created = datetime.fromisoformat(f['created'])
        accessed = datetime.fromisoformat(f['accessed'])

        reasons = []
        # Время модификации раньше создания
        if modified < created:
            reasons.append("M<C")
        # Время доступа раньше создания
        if accessed < created:
            reasons.append("A<C")
        # Секунды = 0 у всех (подозрительная "круглость")
        if (modified.second == 0 and accessed.second == 0
                and created.second == 0):
            reasons.append("ROUND_TIMES")

        if reasons:
            suspicious.append((f['name'], reasons))
    return suspicious
\\\`\\\`\\\`

## Корреляция событий

\\\`\\\`\\\`python
def correlate_events(timeline, window_seconds=60):
    """Группировка событий по временным окнам"""
    groups = []
    current_group = [timeline[0]]

    for i in range(1, len(timeline)):
        time_diff = (timeline[i][0] - timeline[i-1][0]).total_seconds()
        if time_diff <= window_seconds:
            current_group.append(timeline[i])
        else:
            groups.append(current_group)
            current_group = [timeline[i]]
    groups.append(current_group)
    return groups

# Группы событий помогают восстановить последовательность действий
\\\`\\\`\\\``,
    duration: 55,
    assignment: {
      title: 'Анализ MAC-times',
      description: 'На первой строке число N — количество файлов. Далее N строк формата "filename modified accessed created" (даты в формате YYYY-MM-DDTHH:MM:SS). Для каждого файла проверьте: если modified < created — выведите "filename TIMESTOMP M<C". Если accessed < created — "filename TIMESTOMP A<C". Затем отсортируйте ВСЕ события (каждый файл даёт 3 события: M/A/C) по времени и выведите timeline в формате "HH:MM:SS ACTION filename" (ACTION: MODIFIED/ACCESSED/CREATED).',
      difficulty: 'hard' as const,
      starterCode: '# Считайте N файлов\n# Проверьте аномалии\n# Постройте timeline\n\nfrom datetime import datetime\n\n',
      testCases: [
        { input: '2\nmalware.e\xe 2024-01-10T08:00:00 2024-03-15T14:30:00 2024-03-01T12:00:00\nnotes.txt 2024-03-10T09:00:00 2024-03-15T10:00:00 2024-03-05T08:00:00', expectedOutput: 'malware.e\xe TIMESTOMP M<C\n08:00:00 MODIFIED malware.e\xe\n08:00:00 CREATED notes.txt\n09:00:00 MODIFIED notes.txt\n10:00:00 ACCESSED notes.txt\n12:00:00 CREATED malware.e\xe\n14:30:00 ACCESSED malware.e\xe', description: 'Один файл с timestomping + timeline' },
        { input: '1\ntest.txt 2024-05-01T10:00:00 2024-05-01T11:00:00 2024-05-01T09:00:00', expectedOutput: '09:00:00 CREATED test.txt\n10:00:00 MODIFIED test.txt\n11:00:00 ACCESSED test.txt', description: 'Нормальный файл без аномалий' },
        { input: '1\nhidden.dat 2024-01-01T00:00:00 2024-01-01T00:00:00 2024-06-15T12:00:00', expectedOutput: 'hidden.dat TIMESTOMP M<C\nhidden.dat TIMESTOMP A<C\n00:00:00 MODIFIED hidden.dat\n00:00:00 ACCESSED hidden.dat\n12:00:00 CREATED hidden.dat', description: 'Обе аномалии: M<C и A<C' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 16: Основы ассемблера \x86
  // ──────────────────────────────────────────
  {
    slug: 'assembly-\x86-basics',
    title: 'Основы ассемблера \x86',
    description: 'Регистры, команды MOV/ADD/SUB/CMP/JMP, стек',
    content: `# Основы ассемблера \x86

## Зачем нужен ассемблер?

Для **reverse engineering** необходимо понимать машинный код. Ассемблер — «человекочитаемый» машинный код.

## Регистры \x86 (32-bit)

| Регистр | Назначение | 16-bit | 8-bit |
|---------|-----------|--------|-------|
| EAX | Аккумулятор (результат) | AX | AH, AL |
| EBX | Базовый | BX | BH, BL |
| ECX | Счётчик (циклы) | CX | CH, CL |
| EDX | Данные (деление) | DX | DH, DL |
| ESP | Stack Pointer | SP | — |
| EBP | Base Pointer | BP | — |
| ESI | Source Index | SI | — |
| EDI | Destination Index | DI | — |
| EIP | Instruction Pointer | IP | — |

## Основные команды

\\\`\\\`\\\`python
# Эмулятор \x86 (упрощённый)
class X86Emulator:
    def __init__(self):
        self.regs = {
            'eax': 0, 'ebx': 0, 'ecx': 0, 'edx': 0,
            'esp': 0\x1000, 'ebp': 0, 'eip': 0
        }
        self.memory = {}
        self.flags = {'ZF': 0, 'SF': 0, 'CF': 0}

    def mov(self, dst, src):
        """MOV dst, src — копирование"""
        self.regs[dst] = self._get_value(src)

    def add(self, dst, src):
        """ADD dst, src — сложение"""
        self.regs[dst] += self._get_value(src)
        self._update_flags(self.regs[dst])

    def sub(self, dst, src):
        """SUB dst, src — вычитание"""
        self.regs[dst] -= self._get_value(src)
        self._update_flags(self.regs[dst])

    def cmp(self, a, b):
        """CMP a, b — сравнение (SUB без сохранения)"""
        result = self._get_value(a) - self._get_value(b)
        self._update_flags(result)

    def _get_value(self, operand):
        if isinstance(operand, int):
            return operand
        return self.regs.get(operand, 0)

    def _update_flags(self, result):
        self.flags['ZF'] = 1 if result == 0 else 0
        self.flags['SF'] = 1 if result < 0 else 0

cpu = X86Emulator()
cpu.mov('eax', 10)
cpu.mov('ebx', 3)
cpu.add('eax', 'ebx')    # eax = 13
cpu.sub('eax', 5)        # eax = 8
print(f"EAX = {cpu.regs['eax']}")
\\\`\\\`\\\`

## Стек

Стек растёт **вниз** (от больших адресов к меньшим).

\\\`\\\`\\\`python
class Stack:
    def __init__(self, cpu):
        self.cpu = cpu

    def push(self, value):
        """PUSH: уменьшить ESP, записать значение"""
        self.cpu.regs['esp'] -= 4
        addr = self.cpu.regs['esp']
        self.cpu.memory[addr] = self.cpu._get_value(value)

    def pop(self, dst):
        """POP: прочитать значение, увеличить ESP"""
        addr = self.cpu.regs['esp']
        self.cpu.regs[dst] = self.cpu.memory.get(addr, 0)
        self.cpu.regs['esp'] += 4

stack = Stack(cpu)
cpu.mov('eax', 42)
stack.push('eax')       # Кладём 42 на стек
cpu.mov('eax', 0)       # Обнуляем EAX
stack.pop('eax')        # Снимаем со стека
print(f"EAX = {cpu.regs['eax']}")  # 42
\\\`\\\`\\\`

## Условные переходы

\\\`\\\`\\\`python
# После CMP устанавливаются флаги:
# ZF=1 если равны, SF=1 если результат отрицательный

# JE  (Jump if Equal)     — если ZF=1
# JNE (Jump if Not Equal) — если ZF=0
# JG  (Jump if Greater)   — если ZF=0 и SF=0
# JL  (Jump if Less)      — если SF=1
# JMP (Unconditional)     — всегда

cpu.mov('eax', 5)
cpu.cmp('eax', 5)
print(f"ZF={cpu.flags['ZF']}")  # ZF=1 (равны)

cpu.cmp('eax', 10)
print(f"SF={cpu.flags['SF']}")  # SF=1 (5-10 < 0)
\\\`\\\`\\\`

## Вызов функций

\\\`\\\`\\\`
; Пролог функции
push ebp          ; Сохраняем старый EBP
mov  ebp, esp     ; EBP = текущий ESP
sub  esp, 16      ; Выделяем место для локальных переменных

; Тело функции
mov  [ebp-4], 10  ; Локальная переменная

; Эпилог
mov  esp, ebp     ; Восстанавливаем ESP
pop  ebp          ; Восстанавливаем EBP
ret               ; Возврат
\\\`\\\`\\\``,
    duration: 60,
    assignment: {
      title: 'Эмулятор \x86',
      description: 'На первой строке число N — количество инструкций. Далее N строк — инструкции: "MOV reg val", "ADD reg val", "SUB reg val", "PUSH reg", "POP reg". val — число или имя регистра (eax, ebx, ecx, edx). Стек начинается с ESP=4096, растёт вниз (PUSH: ESP-=4, POP: ESP+=4). После выполнения всех инструкций выведите значения регистров "eax ebx ecx edx esp".',
      difficulty: 'hard' as const,
      starterCode: '# Считайте N инструкций\n# Реализуйте эмулятор\n# Выведите eax ebx ecx edx esp\n\n',
      testCases: [
        { input: '5\nMOV eax 10\nMOV ebx 3\nADD eax ebx\nSUB eax 5\nMOV ecx eax', expectedOutput: '8 3 8 0 4096', description: 'MOV, ADD, SUB' },
        { input: '4\nMOV eax 42\nPUSH eax\nMOV eax 0\nPOP eax', expectedOutput: '42 0 0 0 4096', description: 'PUSH и POP' },
        { input: '6\nMOV eax 100\nMOV ebx 200\nPUSH eax\nPUSH ebx\nPOP ecx\nPOP edx', expectedOutput: '100 200 200 100 4096', description: 'Порядок стека (LIFO)' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 17: Анализ бинарников
  // ──────────────────────────────────────────
  {
    slug: 'binary-analysis',
    title: 'Анализ бинарников',
    description: 'Строки, импорты, дизассемблирование, objdump',
    content: `# Анализ бинарников

## Статический анализ

**Статический анализ** — исследование файла **без запуска**. Первый и безопасный шаг в RE.

### Шаг 1: Определение типа файла

\\\`\\\`\\\`python
def detect_binary_type(header):
    """Определение типа бинарного файла"""
    if header[:2] == b'MZ':
        return 'PE (Windows EXE/DLL)'
    elif header[:4] == b'\\\x7fELF':
        return 'ELF (Linux/Unix)'
    elif header[:4] == b'\\\xca\\\xfe\\\xba\\\xbe':
        return 'Mach-O Universal (macOS)'
    elif header[:4] == b'\\\xfe\\\xed\\\xfa\\\xce':
        return 'Mach-O 32-bit (macOS)'
    elif header[:8] == b'\\\x00asm\\\x01\\\x00\\\x00\\\x00'[:8]:
        return 'WebAssembly'
    elif header[:2] == b'PK':
        return 'ZIP/APK/JAR'
    return 'Unknown'
\\\`\\\`\\\`

### Шаг 2: Извлечение строк

\\\`\\\`\\\`python
def extract_interesting_strings(data, min_len=4):
    """Извлечение строк с классификацией"""
    strings = []
    current = ""
    for byte in data:
        if 32 <= byte <= 126:
            current += chr(byte)
        else:
            if len(current) >= min_len:
                strings.append(current)
            current = ""
    if len(current) >= min_len:
        strings.append(current)

    # Классификация
    classified = []
    for s in strings:
        category = "STRING"
        if s.startswith("http") or "://" in s:
            category = "URL"
        elif "@" in s and "." in s:
            category = "EMAIL"
        elif s.endswith(".dll") or s.endswith(".e\xe"):
            category = "LIBRARY"
        elif any(c in s for c in ['\\\\', '/', 'C:']):
            category = "PATH"
        elif s.startswith("HKEY_") or "\\\\Software\\\\" in s:
            category = "REGISTRY"
        classified.append((category, s))
    return classified
\\\`\\\`\\\`

### Шаг 3: Анализ PE-заголовка

\\\`\\\`\\\`python
import struct

def parse_pe_imports(data):
    """Упрощённый анализ импортов PE"""
    # В реальности нужен полный PE-парсер
    # Ищем имена DLL по строкам
    dlls = []
    strings = extract_interesting_strings(data)
    for cat, s in strings:
        if cat == "LIBRARY" and s.endswith(".dll"):
            dlls.append(s)

    # Подозрительные DLL
    suspicious = {
        'ws2_32.dll': 'Сетевые операции',
        'wininet.dll': 'HTTP-запросы',
        'advapi32.dll': 'Реестр, привилегии',
        'crypt32.dll': 'Криптография',
    }
    findings = []
    for dll in dlls:
        if dll.lower() in suspicious:
            findings.append(f"{dll}: {suspicious[dll.lower()]}")
    return dlls, findings
\\\`\\\`\\\`

## Энтропия

**Энтропия** показывает «случайность» данных. Высокая энтропия = данные зашифрованы или сжаты.

\\\`\\\`\\\`python
import math
from collections import Counter

def calculate_entropy(data):
    """Энтропия Шеннона (0-8 для байт)"""
    if not data:
        return 0
    counter = Counter(data)
    length = len(data)
    entropy = 0
    for count in counter.values():
        p = count / length
        if p > 0:
            entropy -= p * math.log2(p)
    return round(entropy, 4)

# Примеры
text = b"Hello World! " * 100
print(f"Текст: {calculate_entropy(text):.2f}")  # ~3.2

random_data = bytes(range(256)) * 4
print(f"Случайные: {calculate_entropy(random_data):.2f}")  # ~8.0
\\\`\\\`\\\`

## Инструменты

- **objdump** — дизассемблирование (Linux)
- **Ghidra** — бесплатный декомпилятор (NSA)
- **IDA** — профессиональный дизассемблер
- **radare2** — фреймворк для RE
- **PE Explorer** / **PE-bear** — анализ PE-файлов`,
    duration: 55,
    assignment: {
      title: 'Анализ строк бинарника',
      description: 'На первой строке дана последовательность байт в hex через пробел. Извлеките все ASCII-строки (коды 32-126) длиной >= 4. Классифицируйте каждую: если содержит "://" — URL, если содержит ".dll" или ".e\xe" — LIBRARY, если содержит "@" — EMAIL, иначе — STRING. Выведите каждую строку в формате "CATEGORY: string". Если строк нет — "NO STRINGS".',
      difficulty: 'medium' as const,
      starterCode: '# Считайте hex-байты\n# Извлеките и классифицируйте строки\n\n',
      testCases: [
        { input: '68 74 74 70 3A 2F 2F 65 76 69 6C 2E 63 6F 6D 00 6B 65 72 6E 65 6C 33 32 2E 64 6C 6C 00 48 65 6C 6C 6F', expectedOutput: 'URL: http://evil.com\nLIBRARY: kernel32.dll\nSTRING: Hello', description: 'URL, DLL и обычная строка' },
        { input: '75 73 65 72 40 6D 61 69 6C 2E 72 75 00 00 74 65 73 74 2E 65 78 65', expectedOutput: 'EMAIL: user@mail.ru\nLIBRARY: test.e\xe', description: 'Email и EXE' },
        { input: '00 01 02 FF FE FD 00 41 42 43 00', expectedOutput: 'NO STRINGS', description: 'Нет строк >= 4 символов' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 18: Основы отладки
  // ──────────────────────────────────────────
  {
    slug: 'debugging-basics',
    title: 'Основы отладки',
    description: 'Breakpoints, пошаговое выполнение, анализ переменных',
    content: `# Основы отладки

## Отладка в реверс-инжиниринге

**Динамический анализ** — запуск программы под отладчиком для наблюдения за поведением. Отладчик позволяет:

- Останавливать выполнение (**breakpoints**)
- Выполнять по одной инструкции (**step**)
- Просматривать регистры и память
- Модифицировать данные в реальном времени

## Моделирование отладчика

\\\`\\\`\\\`python
class Debugger:
    def __init__(self, program):
        self.program = program  # Список инструкций
        self.pc = 0             # Program Counter
        self.regs = {'eax': 0, 'ebx': 0, 'ecx': 0, 'edx': 0}
        self.breakpoints = set()
        self.history = []       # Лог выполнения
        self.running = True

    def set_breakpoint(self, line):
        self.breakpoints.add(line)

    def remove_breakpoint(self, line):
        self.breakpoints.discard(line)

    def step(self):
        """Выполнить одну инструкцию"""
        if self.pc >= len(self.program):
            self.running = False
            return None
        instr = self.program[self.pc]
        self.history.append((self.pc, instr, dict(self.regs)))
        self._e\xecute(instr)
        self.pc += 1
        return instr

    def run_until_breakpoint(self):
        """Выполнять до breakpoint или конца"""
        while self.running:
            if self.pc in self.breakpoints:
                return f"Breakpoint at line {self.pc}"
            self.step()
        return "Program finished"

    def _e\xecute(self, instr):
        parts = instr.split()
        op = parts[0].upper()
        if op == 'MOV':
            self.regs[parts[1]] = self._val(parts[2])
        elif op == 'ADD':
            self.regs[parts[1]] += self._val(parts[2])
        elif op == 'SUB':
            self.regs[parts[1]] -= self._val(parts[2])
        elif op == 'MUL':
            self.regs[parts[1]] *= self._val(parts[2])

    def _val(self, operand):
        try:
            return int(operand)
        e\xcept ValueError:
            return self.regs.get(operand, 0)
\\\`\\\`\\\`

## Использование отладчика

\\\`\\\`\\\`python
program = [
    "MOV eax 5",      # Строка 0
    "MOV ebx 3",      # Строка 1
    "ADD eax ebx",    # Строка 2
    "MUL eax 2",      # Строка 3
    "SUB eax 1",      # Строка 4
]

dbg = Debugger(program)
dbg.set_breakpoint(2)  # Стоп перед ADD

result = dbg.run_until_breakpoint()
print(result)  # Breakpoint at line 2
print(f"EAX={dbg.regs['eax']}, EBX={dbg.regs['ebx']}")

# Пошаговое выполнение
dbg.step()  # ADD eax ebx -> eax=8
print(f"После ADD: EAX={dbg.regs['eax']}")

dbg.step()  # MUL eax 2 -> eax=16
print(f"После MUL: EAX={dbg.regs['eax']}")
\\\`\\\`\\\`

## Watchpoints

\\\`\\\`\\\`python
class WatchDebugger(Debugger):
    def __init__(self, program):
        super().__init__(program)
        self.watchpoints = {}  # reg -> value

    def watch(self, reg):
        """Отслеживать изменение регистра"""
        self.watchpoints[reg] = self.regs.get(reg, 0)

    def step(self):
        old_regs = dict(self.regs)
        result = super().step()
        # Проверяем watchpoints
        for reg in self.watchpoints:
            if self.regs.get(reg) != old_regs.get(reg):
                print(f"WATCH: {reg} changed "
                      f"{old_regs[reg]} -> {self.regs[reg]}")
                self.watchpoints[reg] = self.regs[reg]
        return result
\\\`\\\`\\\`

## Антиотладочные техники

Вредоносное ПО часто пытается обнаружить отладчик:

\\\`\\\`\\\`python
# Моделирование антиотладочных проверок
def detect_debugger():
    """Типичные проверки (моделирование)"""
    checks = {
        'IsDebuggerPresent': False,  # Win API
        'timing_check': False,       # Замер времени
        'int3_check': False,         # Breakpoint-инструкция
        'parent_process': 'explorer.e\xe',  # Родительский процесс
    }
    # Если время выполнения участка > N — отладчик
    # Если родитель не explorer.e\xe — подозрительно
    return any([
        checks['IsDebuggerPresent'],
        checks['timing_check'],
        checks['parent_process'] not in ['explorer.e\xe', 'cmd.e\xe'],
    ])
\\\`\\\`\\\`

## Инструменты отладки

- **GDB** — стандартный отладчик Linux
- **\x64dbg** — отладчик для Windows
- **OllyDbg** — классический 32-bit отладчик
- **WinDbg** — отладчик от Microsoft`,
    duration: 55,
    assignment: {
      title: 'Эмулятор с breakpoints',
      description: 'На первой строке число B — количество breakpoints (номера строк, 0-inde\xed). На второй строке — B чисел (номера строк). На третьей строке — число N (инструкции). Далее N строк — инструкции: MOV/ADD/SUB/MUL reg val. Выполняйте программу. При достижении breakpoint выведите "BREAK line=L eax=X ebx=Y ecx=Z edx=W" и продолжайте. После завершения — "END eax=X ebx=Y ecx=Z edx=W".',
      difficulty: 'hard' as const,
      starterCode: '# Считайте breakpoints\n# Считайте инструкции\n# Эмулируйте с breakpoints\n\n',
      testCases: [
        { input: '1\n2\n5\nMOV eax 5\nMOV ebx 3\nADD eax ebx\nMUL eax 2\nSUB eax 1', expectedOutput: 'BREAK line=2 eax=5 ebx=3 ecx=0 edx=0\nEND eax=15 ebx=3 ecx=0 edx=0', description: 'Breakpoint на строке 2, затем выполнение до конца' },
        { input: '2\n0 3\n4\nMOV eax 10\nSUB eax 3\nADD eax 1\nMUL eax 2', expectedOutput: 'BREAK line=0 eax=0 ebx=0 ecx=0 edx=0\nBREAK line=3 eax=8 ebx=0 ecx=0 edx=0\nEND eax=16 ebx=0 ecx=0 edx=0', description: 'Два breakpoint' },
        { input: '0\n\n3\nMOV eax 7\nMOV ebx eax\nADD ecx ebx', expectedOutput: 'END eax=7 ebx=7 ecx=7 edx=0', description: 'Без breakpoints' },
      ],
      points: 20,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 19: Стратегии CTF
  // ──────────────────────────────────────────
  {
    slug: 'ctf-strategies',
    title: 'Стратегии CTF',
    description: 'Распределение задач, инструменты, writeup',
    content: `# Стратегии CTF

## Что такое CTF?

**Capture The Flag** — соревнования по информационной безопасности. Цель — найти «флаг» (секретную строку, обычно формата \\\`flag{...}\\\`).

## Форматы CTF

| Формат | Описание |
|--------|----------|
| **Jeopardy** | Набор задач по категориям, за очки |
| **Attack-Defense** | Команды защищают свои сервисы и атакуют чужие |
| **King of the Hill** | Захват и удержание сервера |

## Категории задач Jeopardy

\\\`\\\`\\\`
├── Web         — SQL injection, XSS, SSRF, auth bypass
├── Crypto      — Криптоанализ, RSA, AES, хеши
├── Reverse     — Анализ бинарников, кейгены
├── Pwn         — Эксплуатация уязвимостей (buffer overflow)
├── Forensics   — Анализ дампов, pcap, стеганография
├── OSINT       — Разведка из открытых источников
├── Misc        — Всё остальное
└── Stego       — Стеганография (данные в изображениях)
\\\`\\\`\\\`

## Стратегия команды

\\\`\\\`\\\`python
def assign_tasks(team, challenges):
    """Распределение задач в команде"""
    specializations = {
        'web_expert': ['Web'],
        'crypto_expert': ['Crypto'],
        'reverse_expert': ['Reverse', 'Pwn'],
        'forensics_expert': ['Forensics', 'Stego'],
        'generalist': ['OSINT', 'Misc'],
    }

    assignments = {}
    for member in team:
        role = team[member]
        categories = specializations.get(role, [])
        assigned = [c for c in challenges
                    if c['category'] in categories]
        # Сортируем по очкам (сначала лёгкие)
        assigned.sort(key=lambda x: x['points'])
        assignments[member] = assigned
    return assignments
\\\`\\\`\\\`

## Типичные техники

### Поиск флагов

\\\`\\\`\\\`python
import re

def find_flags(text, pattern=r'flag\\{[^}]+\\}'):
    """Поиск флагов в тексте/данных"""
    return re.findall(pattern, text)

# Флаг может быть в разных кодировках
import base64

def check_encodings(data):
    """Проверка популярных кодировок"""
    results = []

    # Base64
    try:
        decoded = base64.b64decode(data).decode('utf-8')
        if 'flag' in decoded.lower():
            results.append(('base64', decoded))
    e\xcept E\xception:
        pass

    # Hex
    try:
        decoded = bytes.fromhex(data).decode('utf-8')
        if 'flag' in decoded.lower():
            results.append(('hex', decoded))
    e\xcept E\xception:
        pass

    # ROT13
    import codecs
    decoded = codecs.decode(data, 'rot_13')
    if 'flag' in decoded.lower():
        results.append(('rot13', decoded))

    return results

# Пример
encoded = base64.b64encode(b"flag{hidden_treasure}").decode()
print(f"Закодировано: {encoded}")
print(check_encodings(encoded))
\\\`\\\`\\\`

### Цезарь и подстановочные шифры

\\\`\\\`\\\`python
def caesar_brute(ciphertext):
    """Перебор всех сдвигов шифра Цезаря"""
    results = []
    for shift in range(26):
        decrypted = ""
        for c in ciphertext:
            if c.isalpha():
                base = ord('a') if c.islower() else ord('A')
                decrypted += chr((ord(c) - base + shift) % 26 + base)
            else:
                decrypted += c
        results.append((shift, decrypted))
    return results

cipher = "synt{pnrfne_pvcure}"
for shift, text in caesar_brute(cipher):
    if 'flag' in text.lower():
        print(f"Shift {shift}: {text}")  # ROT13: flag{caesar_cipher}
\\\`\\\`\\\`

## Структура writeup

1. **Описание задачи** — что дано
2. **Разведка** — первые шаги анализа
3. **Решение** — пошаговый процесс
4. **Флаг** — итоговый ответ
5. **Выводы** — чему научились`,
    duration: 50,
    assignment: {
      title: 'Поиск и декодирование флагов',
      description: 'На первой строке дан тип кодировки: "base64", "hex", "caesar" или "plain". На второй строке — закодированная строка. Декодируйте и найдите флаг формата flag{...}. Для caesar — переберите все 26 сдвигов и найдите тот, где появляется "flag{". Для base64 — декодируйте из base64. Для hex — декодируйте из hex-строки (каждые 2 символа = 1 байт). Для plain — строка уже содержит флаг. Выведите найденный флаг.',
      difficulty: 'medium' as const,
      starterCode: '# Считайте тип кодировки\n# Считайте закодированную строку\n# Декодируйте и найдите флаг\n\nimport base64\nimport re\n\n',
      testCases: [
        { input: 'base64\nZmxhZ3toZWxsb193b3JsZH0=', expectedOutput: 'flag{hello_world}', description: 'Base64 декодирование' },
        { input: 'hex\n666c61677b6865785f69735f66756e7d', expectedOutput: 'flag{hex_is_fun}', description: 'Hex декодирование' },
        { input: 'caesar\nsynt{pnrfne_vf_rnfl}', expectedOutput: 'flag{caesar_is_easy}', description: 'Шифр Цезаря (ROT13)' },
        { input: 'plain\nThe answer is flag{plain_text}!', expectedOutput: 'flag{plain_text}', description: 'Флаг в открытом тексте' },
      ],
      points: 15,
    },
  },

  // ──────────────────────────────────────────
  // УРОК 20: Многоэтапный CTF
  // ──────────────────────────────────────────
  {
    slug: 'multistage-ctf',
    title: 'Многоэтапный CTF',
    description: 'Комбинирование техник, цепочки уязвимостей',
    content: `# Многоэтапный CTF

## Цепочки атак

В реальных атаках (и сложных CTF) уязвимости **комбинируются**. Каждый шаг открывает доступ к следующему.

## Пример цепочки

\\\`\\\`\\\`
1. Сканирование → обнаружен открытый порт 8080
2. Web-разведка → найден скрытый endpoint /admin
3. SQL injection → извлечён хеш пароля
4. Брутфорс хеша → получен пароль
5. Авторизация → доступ к панели
6. File upload → загрузка reverse shell
7. Privilege escalation → root-доступ
8. Извлечение флага
\\\`\\\`\\\`

## Этап 1: Разведка (Reconnaissance)

\\\`\\\`\\\`python
def reconnaissance(target_info):
    """Анализ информации о цели"""
    findings = {}

    # Анализ открытых портов
    open_ports = target_info.get('ports', [])
    services = {
        22: 'SSH', 80: 'HTTP', 443: 'HTTPS',
        3306: 'MySQL', 8080: 'HTTP-Alt'
    }
    findings['services'] = [
        (p, services.get(p, 'Unknown')) for p in open_ports
    ]

    # Анализ заголовков
    headers = target_info.get('headers', {})
    if 'Server' in headers:
        findings['server'] = headers['Server']
    if 'X-Powered-By' in headers:
        findings['framework'] = headers['X-Powered-By']

    return findings

target = {
    'ports': [22, 80, 3306, 8080],
    'headers': {
        'Server': 'Apache/2.4.41',
        'X-Powered-By': 'PHP/7.4.3'
    }
}
print(reconnaissance(target))
\\\`\\\`\\\`

## Этап 2: Эксплуатация (Exploitation)

\\\`\\\`\\\`python
def sql_injection_extract(vulnerable_query, payloads):
    """Моделирование SQL injection"""
    # Простая модель базы данных
    fake_db = {
        "users": [
            {"id": 1, "name": "admin", "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99"},
            {"id": 2, "name": "user", "password_hash": "ee11cbb19052e40b07aac5ae8c58b3a6"},
        ]
    }
    extracted = []
    for payload in payloads:
        if "UNION SELECT" in payload.upper():
            # Моделируем утечку данных
            for row in fake_db["users"]:
                extracted.append(row)
        elif "OR 1=1" in payload:
            extracted.append("AUTH_BYPASS")
    return extracted

payloads = [
    "' OR 1=1 --",
    "' UNION SELECT name, password_hash FROM users --"
]
results = sql_injection_extract("SELECT * FROM items WHERE id='{}'", payloads)
for r in results:
    print(r)
\\\`\\\`\\\`

## Этап 3: Пост-эксплуатация

\\\`\\\`\\\`python
import hashlib

def crack_hash(target_hash, wordlist):
    """Взлом хеша по словарю"""
    for word in wordlist:
        if hashlib.md5(word.encode()).he\xdigest() == target_hash:
            return word
    return None

# Взламываем найденные хеши
hashes = {
    "admin": "5f4dcc3b5aa765d61d8327deb882cf99",
    "user": "ee11cbb19052e40b07aac5ae8c58b3a6",
}

wordlist = ["password", "123456", "admin", "user", "qwerty"]
for name, h in hashes.items():
    cracked = crack_hash(h, wordlist)
    if cracked:
        print(f"{name}: {cracked}")
\\\`\\\`\\\`

## Этап 4: Многослойное декодирование

\\\`\\\`\\\`python
import base64

def multi_decode(data):
    """Многоэтапное декодирование данных"""
    steps = []
    current = data

    for attempt in range(10):  # Максимум 10 шагов
        decoded = False

        # Попытка Base64
        try:
            result = base64.b64decode(current).decode('utf-8')
            steps.append(('base64', result))
            current = result
            decoded = True
        e\xcept E\xception:
            pass

        # Попытка Hex
        if not decoded:
            try:
                result = bytes.fromhex(current).decode('utf-8')
                steps.append(('hex', result))
                current = result
                decoded = True
            e\xcept E\xception:
                pass

        # Попытка ROT13
        if not decoded:
            import codecs
            result = codecs.decode(current, 'rot_13')
            if result != current and 'flag' in result.lower():
                steps.append(('rot13', result))
                current = result
                decoded = True

        if not decoded or 'flag{' in current:
            break

    return steps, current

# Пример: base64(hex(flag))
original = "flag{multi_layer}"
encoded = base64.b64encode(
    original.encode().hex().encode()
).decode()
print(f"Закодировано: {encoded}")
steps, result = multi_decode(encoded)
for method, value in steps:
    print(f"  {method}: {value}")
print(f"Флаг: {result}")
\\\`\\\`\\\`

## Написание Writeup

Хороший writeup содержит:
1. Условие задачи
2. Каждый шаг решения с обоснованием
3. Используемые инструменты
4. Код решения
5. Финальный флаг
6. Альтернативные подходы`,
    duration: 60,
    assignment: {
      title: 'Многоэтапный CTF challenge',
      description: 'На первой строке — начальная строка данных. На второй строке — число этапов N. Далее N строк, каждая описывает операцию: "base64" — декодировать текущую строку из base64, "hex" — декодировать из hex (каждые 2 символа = 1 байт), "caesar <shift>" — сдвиг Цезаря с указанным числом (только буквы a-z/A-Z), "reverse" — перевернуть строку, "xor <key>" — XOR каждого символа (ord) с числом key, результат — символы. Применяйте операции последовательно к текущей строке. Выведите финальный результат.',
      difficulty: 'hard' as const,
      starterCode: '# Считайте начальную строку\n# Считайте число операций\n# Применяйте операции последовательно\n# Выведите результат\n\nimport base64\n\n',
      testCases: [
        { input: 'fW9sbGVoe2dhbGY=\n2\nbase64\nreverse', expectedOutput: 'flag{hello}', description: 'Base64 затем reverse' },
        { input: '5a6d78685a33747561574e6c66513d3d\n2\nhex\nbase64', expectedOutput: 'flag{nice}', description: 'Hex -> Base64' },
        { input: 'synt{ebg_guvegrra}\n1\ncaesar 13', expectedOutput: 'flag{rot_thirteen}', description: 'ROT13' },
      ],
      points: 20,
    },
  },
];
