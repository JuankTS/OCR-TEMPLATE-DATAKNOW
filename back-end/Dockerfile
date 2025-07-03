FROM mcr.microsoft.com/azure-functions/python:4-python3.11
 
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true
 
RUN pip install --upgrade pip
COPY requirements.txt /
RUN pip install -r /requirements.txt
 
COPY . /home/site/wwwroot

