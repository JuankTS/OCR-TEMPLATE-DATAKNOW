from datetime import datetime
import uuid

def genereta_id() -> str: 
    now = datetime.now()
    str_now = now.strftime("%Y%m%d")
    uuid_id = str(uuid.uuid4())
    chat_id = f'{str_now}-{uuid_id}'
    return chat_id