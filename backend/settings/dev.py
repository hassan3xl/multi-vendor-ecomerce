from .base import *

DEBUG = True


SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }

    # "default": dj_database_url.config(default=os.getenv("DB_URL"))

}

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


