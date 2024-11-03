import redis
from fastapi import FastAPI

app = FastAPI()

# Redis Client (Token Blacklisting)
r = redis.Redis(host='localhost', port=6379, db=0)

# docker-compose healthcheck address
@app.get("/_health")
def health_check():
    return {"status": "healthy"}
