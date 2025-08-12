# utils/supabase.py
import os
from supabase import create_client
from datetime import datetime
from decouple import config # for .env #type: ignore

# SUPABASE_URL = os.environ.get("SUPABASE_URL")
# SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_SERVICE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

from datetime import datetime

def upload_lesson_file(file_obj, lesson_title):
    """
    Uploads file to Supabase storage and returns public URL.
    Handles Supabase Python SDK's UploadResponse correctly.
    """
    filename = f"lessons/{datetime.now().timestamp()}_{lesson_title}_{file_obj.name}"

    # Convert InMemoryUploadedFile → bytes
    file_bytes = file_obj.read()

    res = supabase.storage.from_("lesson-files").upload(filename, file_bytes)

    # Safely check for errors
    error = getattr(res, "error", None)
    if error:
        # If error is an object with message attribute
        error_msg = getattr(error, "message", str(error))
        raise Exception(f"Supabase upload error: {error_msg}")

    # Make sure data exists (optional check)
    # if not hasattr(res, "data") or res.data is None:
    #     raise Exception("Supabase upload returned no data")

    public_url = supabase.storage.from_("lesson-files").get_public_url(filename)
    return public_url
