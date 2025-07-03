import azure.functions as func
from function import bp  # módulo donde defines tu Blueprint

app = func.FunctionApp()
app.register_functions(bp)
