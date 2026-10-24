import secrets

from fastapi import Header, HTTPException

from .config import ADMIN_TOKEN


def require_admin(x_admin_token: str = Header(default="")) -> None:
    if not ADMIN_TOKEN or not secrets.compare_digest(x_admin_token.encode(), ADMIN_TOKEN.encode()):
        raise HTTPException(status_code=403, detail="管理密碼不對")
