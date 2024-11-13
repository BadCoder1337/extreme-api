FROM python:3.7

WORKDIR /app/backend/authorization_service
COPY requirements.txt ./requirements.txt
RUN openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
RUN openssl rsa -pubout -in private_key.pem -out public_key.pem
RUN apt-get update && apt-get install -y curl
RUN pip install -r requirements.txt --no-cache-dir
COPY . ./

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]