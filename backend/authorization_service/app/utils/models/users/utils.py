import bcrypt


def hash_password(plain_password):
    # Generate a salt and hash the password
    hashed_password = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt())
    return hashed_password.decode('utf-8')  # Store as a string in the database

def verify_password(plain_password, hashed_password):
    # Convert hashed_password to bytes if it's stored as a string
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode() if isinstance(hashed_password, str) else hashed_password)