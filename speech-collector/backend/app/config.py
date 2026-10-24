import os
import secrets
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
STORAGE_DIR = BASE_DIR / "storage"
RAW_AUDIO_DIR = STORAGE_DIR / "raw"
WAV_AUDIO_DIR = STORAGE_DIR / "wav"
DATABASE_PATH = DATA_DIR / "collector_app.sqlite3"
CONSENT_VERSION = "research-consent-v1"
# Without ADMIN_TOKEN there is no shared default password: a random one is made
# for this run and printed at startup, so the admin page is never open to a
# password that is written in the public code.
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "").strip()
ADMIN_TOKEN_GENERATED = not ADMIN_TOKEN
if ADMIN_TOKEN_GENERATED:
    ADMIN_TOKEN = secrets.token_urlsafe(12)
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,https://ztang-yit-xiaang.github.io",
    ).split(",")
    if origin.strip()
]

PDF_SOURCE_PATHS = [
    Path(r"D:\瑞安文化研究\温州方言志 (郑张尚芳) (Z-Library).pdf"),
    Path(r"D:\瑞安文化研究\温州方言词典 (游汝杰, 杨乾明) (Z-Library).pdf"),
    Path(r"D:\瑞安文化研究\温州方言读音字典.pdf"),
    Path(r"D:\瑞安文化研究\温州方言詞典 (李荣) (Z-Library).pdf"),
    Path(r"D:\瑞安文化研究\瑞安方言曲艺韵书 (沈克成, 何克识) (Z-Library).pdf"),
    Path(r"D:\瑞安文化研究\瑞安方言读音字典 (张永恺) (Z-Library)_2.pdf"),
]


def ensure_directories() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    RAW_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    WAV_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
