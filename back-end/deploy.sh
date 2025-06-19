# === CONFIGURA ESTOS DATOS ===
RESOURCE_GROUP="mi-grupo"
LOCATION="eastus"
ACR_NAME="miacrpersonal"
ACR_IMAGE_NAME="miappocr"
CONTAINER_APP_NAME="ocr-api"
CONTAINER_ENV_NAME="ocr-env"
DOCKERFILE_PATH="."  # Carpeta donde está el Dockerfile

# === OBTENER EL LOGIN SERVER DEL ACR ===
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)

echo "👉 Login server del ACR: $ACR_LOGIN_SERVER"

# === LOGIN A AZURE Y ACR ===
echo "🔐 Iniciando sesión en Azure..."
az login

echo "📦 Login en Azure Container Registry..."
az acr login --name $ACR_NAME

# === CONSTRUIR Y SUBIR LA IMAGEN A ACR ===
echo "🐳 Construyendo imagen Docker..."
docker build -t $ACR_IMAGE_NAME $DOCKERFILE_PATH

echo "🏷️ Etiquetando imagen..."
docker tag $ACR_IMAGE_NAME $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest

echo "📤 Subiendo imagen a ACR..."
docker push $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest

# === OBTENER CREDENCIALES DEL ACR ===
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv)

# === CREAR ENTORNO DE CONTAINER APP SI NO EXISTE ===
echo "🌐 Creando entorno de container app (si no existe)..."
az containerapp env create \
    --name $CONTAINER_ENV_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --only-show-errors

# === CREAR LA CONTAINER APP ===
echo "🚀 Desplegando la container app..."
az containerapp create \
    --name $CONTAINER_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $CONTAINER_ENV_NAME \
    --image $ACR_LOGIN_SERVER/$ACR_IMAGE_NAME:latest \
    --target-port 8000 \
    --ingress external \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --transport auto \
    --only-show-errors

# === OBTENER LA URL DE LA APP ===
APP_URL=$(az containerapp show --name $CONTAINER_APP_NAME --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo "✅ Despliegue completo. URL pública: https://$APP_URL"
