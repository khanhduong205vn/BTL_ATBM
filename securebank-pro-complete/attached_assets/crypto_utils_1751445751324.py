from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import os
import base64

# --- Hàm mã hóa AES ---
def encrypt_aes(data, key):
    """Mã hóa dữ liệu bằng AES ở chế độ CBC, trả về chuỗi base64 an toàn cho URL."""
    key_bytes = key.encode('utf-8')[:16]  # Lấy 16 byte đầu tiên
    iv = os.urandom(16)  # Vector khởi tạo ngẫu nhiên
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(pad(data.encode('utf-8'), 16))
    return base64.urlsafe_b64encode(iv + encrypted).decode('utf-8')

def decrypt_aes(ciphertext_b64, key):
    """Giải mã dữ liệu AES từ chuỗi base64, tự động sửa lỗi đệm."""
    key_bytes = key.encode('utf-8')[:16]
    
    # Thêm đệm base64 nếu cần
    missing_padding = len(ciphertext_b64) % 4
    if missing_padding:
        ciphertext_b64 += '=' * (4 - missing_padding)
    
    try:
        ciphertext = base64.urlsafe_b64decode(ciphertext_b64)
    except (ValueError, TypeError) as e:
        raise ValueError(f"Dữ liệu đầu vào không phải là base64 hợp lệ: {str(e)}")

    if len(ciphertext) < 16:
        raise ValueError("Dữ liệu đầu vào quá ngắn để chứa IV.")

    iv = ciphertext[:16]
    encrypted_data = ciphertext[16:]
    cipher = AES.new(key_bytes, AES.MODE_CBC, iv)
    
    try:
        decrypted = unpad(cipher.decrypt(encrypted_data), 16)
        return decrypted.decode('utf-8')
    except (ValueError, UnicodeDecodeError) as e:
        raise ValueError(f"Lỗi giải mã. Khóa hoặc dữ liệu không chính xác: {str(e)}")

# --- Hàm mã hóa Vigenere (không sử dụng trong game, giữ lại để mở rộng) ---
def _vigenere_process(text, key, mode='encrypt'):
    """Hàm lõi xử lý mã hóa/giải mã Vigenere."""
    result = []
    key = key.upper()
    key_index = 0
    for char in text:
        if 'a' <= char <= 'z':
            start = ord('a')
            key_char_shift = ord(key[key_index % len(key)]) - ord('A')
            char_offset = ord(char) - start
            new_offset = (char_offset + key_char_shift) % 26 if mode == 'encrypt' else (char_offset - key_char_shift + 26) % 26
            result.append(chr(start + new_offset))
            key_index += 1
        elif 'A' <= char <= 'Z':
            start = ord('A')
            key_char_shift = ord(key[key_index % len(key)]) - ord('A')
            char_offset = ord(char) - start
            new_offset = (char_offset + key_char_shift) % 26 if mode == 'encrypt' else (char_offset - key_char_shift + 26) % 26
            result.append(chr(start + new_offset))
            key_index += 1
        else:
            result.append(char)
    return "".join(result)

def encrypt_vigenere(text, key):
    """Mã hóa văn bản bằng thuật toán Vigenere."""
    return _vigenere_process(text, key, mode='encrypt')

def decrypt_vigenere(text, key):
    """Giải mã văn bản bằng thuật toán Vigenere."""
    return _vigenere_process(text, key, mode='decrypt')

# --- Hàm mã hóa Caesar (không sử dụng trong game, giữ lại để mở rộng) ---
def encrypt_caesar(text, shift):
    """Mã hóa văn bản bằng thuật toán Caesar."""
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    shifted_alphabet = alphabet[shift:] + alphabet[:shift]
    table = str.maketrans(alphabet + alphabet.upper(), shifted_alphabet + shifted_alphabet.upper())
    return text.translate(table)

def decrypt_caesar(text, shift):
    """Giải mã văn bản bằng thuật toán Caesar."""
    return encrypt_caesar(text, -shift)
