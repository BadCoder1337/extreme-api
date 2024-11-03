FROM python:3.7-slim

WORKDIR /app/backend/authorization_service
COPY . ./

RUN pip install -r requirements.txt --no-cache-dir

RUN apt-get update && apt-get install -y curl

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]