from os import path

import redis

if __package__ is None or __package__ == '':
    import sys

    sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

    from backend.authorization_service.app.utils.config import config
else:
    from ..utils.config import config

# Initialize Redis
redis_client = redis.StrictRedis.from_url(config.REDIS_URL)


def rate_limit_check(user_identifier: str, endpoint: str, limit: int, period: int):
    """
    Checks and increments rate limit count in Redis.
    Args:
        user_identifier: Unique identifier (username or IP) for rate limit;
        endpoint: 'login' or 'refresh';
        limit: Max attempts allowed within the period;
        period: Period duration in seconds.

    Returns:
        False, if rate limit exceeded, else True.
    """
    key = f"rate_limit:{endpoint}:{user_identifier}"
    attempts = redis_client.get(key)

    if attempts and int(attempts) >= limit:
        return False  # Rate limit exceeded

    # Increment attempt count, set TTL if it's a new key
    redis_client.incr(key)
    if attempts is None:
        redis_client.expire(key, period)
    return True
