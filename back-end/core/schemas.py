from pydantic import BaseModel
from typing import Optional

class ResponseHTTPChat(BaseModel):
    id: str
    text: str

class RequestHTTPVote(BaseModel):
    id: str
    vote: bool