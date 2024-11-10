import base64
from os import path
from typing import Optional

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers import Cipher, modes, algorithms

if __package__ is None or __package__ == '':
    import sys

    sys.path.append(path.dirname(path.dirname(path.dirname(path.dirname(path.abspath(__file__))))))

    from backend.authorization_service.app.utils.config import config
else:
    from ...utils.config import config


def decrypt_jwt(token: str, should_use_aes: Optional[bool] = False) -> str:
    if should_use_aes is True:
        # Extract the encrypted AES key and the encrypted JWT
        token_bytes = base64.urlsafe_b64decode(token)
        encrypted_aes_key = token_bytes[:256]  # Assuming a 2048-bit RSA key
        encrypted_token = token_bytes[256:]

        # Decrypt the AES key
        aes_key = rsa_decrypt_key(encrypted_aes_key, config.SECRET_KEY)

        # Decrypt the JWT
        decrypted_token = aes_decrypt(encrypted_token, aes_key)
    else:
        # Decode the Base64-encoded token
        encrypted_token = base64.urlsafe_b64decode(token)
        # Decrypt the token using the private key
        decrypted_token = config.SECRET_KEY.decrypt(
            encrypted_token,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        ).decode()

    return decrypted_token


# Decrypt the AES key using RSA
def rsa_decrypt_key(encrypted_aes_key: bytes, private_key) -> bytes:
    decrypted_key = private_key.decrypt(
        encrypted_aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted_key


# Decrypt data using AES
def aes_decrypt(encrypted_data: bytes, aes_key: bytes) -> str:
    iv = encrypted_data[:16]  # Extract the IV
    ciphertext = encrypted_data[16:]  # Extract the ciphertext
    cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_data = decryptor.update(ciphertext) + decryptor.finalize()
    return decrypted_data.decode()
