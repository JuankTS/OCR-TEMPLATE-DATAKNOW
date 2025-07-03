#!/bin/bash

# === CONFIGURA TUS VARIABLES ===
RESOURCE_GROUP="rg-ML-AI"
LOCATION="eastus2"
ACR_NAME="acrocrpuebas"
ACR_IMAGE_NAME="miappocr"
APP_SERVICE_NAME="funct-orc-test"
APP_SERVICE_PLAN="asp-prueba-colsubsudio (B1: 1)"
STORAGE_ACCOUNT="rgmlai9a6f"
DOCKERFILE_PATH="."

# === OBTENER LOGIN SERVER DE ACR ===
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
echo "👉 Login server del ACR: $ACR_LOGIN_SERVER"

# === LOGIN EN AZURE Y ACR ===
echo "🔐 Iniciando sesión en Azure..."
az login

echo "🔓 Login en Azure Container Registry..."
az acr login --name $ACR_NAME

# === HABILITAR ADMIN EN ACR SI NO ESTÁ ===
echo "🛠️ Habilitando admin en ACR..."
az acr update -n $ACR_NAME --admin-enabled true

# === CONSTRUIR Y SUBIR IMAGEN DOCKER ===
echo "🐳 Construyendo imagen Docker..."
docker build -t $ACR_IMAGE_NAME $DOCKERFILE_PATH

echo "🏷️ Etiquetando imagen..."
docker tag $ACR_IMAGE_NAME $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest

echo "📤 Subiendo imagen a ACR..."
docker push $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest

# === OBTENER CREDENCIALES DE ACR ===
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

# === CONFIGURAR LA FUNCTION APP CON LA IMAGEN DOCKER ===
echo "🚀 Configurando Function App para usar la imagen..."
az functionapp config container set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --docker-custom-image-name $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest \
    --docker-registry-server-url https://$ACR_LOGIN_SERVER \
    --docker-registry-server-user $ACR_USERNAME \
    --docker-registry-server-password $ACR_PASSWORD

# === HABILITAR CONFIGURACIONES NECESARIAS EN LA FUNCTION APP ===
echo "⚙️ Estableciendo settings adicionales..."
az functionapp config appsettings set \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        "WEBSITES_ENABLE_APP_SERVICE_STORAGE=false" \
        "FUNCTIONS_WORKER_RUNTIME=python" \
        "AzureWebJobsStorage=DefaultEndpointsProtocol=https;AccountName=$STORAGE_ACCOUNT;EndpointSuffix=core.windows.net"

# === OBTENER LA URL FINAL ===
APP_URL=$(az functionapp show --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP --query defaultHostName -o tsv)

echo "✅ ¡Listo! Tu función está publicada en: https://$APP_URL/api/OCR-files"
