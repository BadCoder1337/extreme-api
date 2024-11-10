import base64
import os
from os import path
from typing import Optional

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

base_path = path.dirname(path.dirname(path.dirname(path.dirname(path.abspath(__file__)))))

# Load RSA key
with open(f"{base_path}/public_key.pem", "rb") as f:
    public_key = serialization.load_pem_public_key(
        f.read(),
        backend=default_backend()
    )


def encrypt_jwt(encoded_jwt: bytes, should_use_aes: Optional[bool] = False) -> str:
    encrypted_aes_key: bytes = bytes()
    if should_use_aes is True:
        # Generate a symmetric AES key
        aes_key = generate_aes_key()

        # Encrypt the JWT with AES
        encrypted_jwt = aes_encrypt(data=encoded_jwt, aes_key=aes_key)

        # Encrypt the AES key with RSA
        encrypted_aes_key = rsa_encrypt_key(aes_key, public_key)
    else:
        # Encrypt the JWT using the public key
        encrypted_jwt = public_key.encrypt(
            encoded_jwt,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
    # Encode the encrypted token for transport
    return base64.urlsafe_b64encode(encrypted_aes_key + encrypted_jwt).decode()


# Generate a random AES key for symmetric encryption
def generate_aes_key(length=32) -> bytes:
    return os.urandom(length)


# Encrypt data using AES
def aes_encrypt(data: bytes, aes_key: bytes) -> bytes:
    iv = os.urandom(16)  # Initialization vector for AES
    cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(data) + encryptor.finalize()
    return iv + ciphertext


# Encrypt the AES key using RSA
def rsa_encrypt_key(aes_key: bytes, a_key) -> bytes:
    encrypted_key = a_key.encrypt(
        aes_key,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_key
