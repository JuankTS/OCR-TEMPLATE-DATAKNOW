# Dockerfile para el backend
FROM python:3.10-slim

# Evita prompts al instalar
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependencias del sistema necesarias para pdf2image
RUN apt-get update && apt-get install -y \
    poppler-utils \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Crea y usa el directorio /app
WORKDIR /app

# Copia todo el proyecto
COPY . /app

# Instala dependencias Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Expone el puerto 8000
EXPOSE 8000

# Comando de arranque del servidor
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
