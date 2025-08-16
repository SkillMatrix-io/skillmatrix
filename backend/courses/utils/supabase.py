# # utils/supabase.py
# import os
# from supabase import create_client
# from datetime import datetime
# from decouple import config # for .env #type: ignore

# # SUPABASE_URL = os.environ.get("SUPABASE_URL")
# # SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# SUPABASE_URL = config("SUPABASE_URL")
# SUPABASE_KEY = config("SUPABASE_SERVICE_KEY")

# supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# from datetime import datetime

# def upload_lesson_file(file_obj, lesson_title):
#     """
#     Uploads file to Supabase storage and returns public URL.
#     Handles Supabase Python SDK's UploadResponse correctly.
#     """
#     filename = f"lessons/{datetime.now().timestamp()}_{lesson_title}_{file_obj.name}"

#     # Convert InMemoryUploadedFile → bytes
#     file_bytes = file_obj.read()

#     res = supabase.storage.from_("lesson-files").upload(filename, file_bytes)

#     # Safely check for errors
#     error = getattr(res, "error", None)
#     if error:
#         # If error is an object with message attribute
#         error_msg = getattr(error, "message", str(error))
#         raise Exception(f"Supabase upload error: {error_msg}")

#     # Make sure data exists (optional check)
#     # if not hasattr(res, "data") or res.data is None:
#     #     raise Exception("Supabase upload returned no data")

#     public_url = supabase.storage.from_("lesson-files").get_public_url(filename)
#     return public_url

# utils/supabase.py
import os
import mimetypes
from supabase import create_client
from datetime import datetime
from decouple import config  # type: ignore

# Environment config
SUPABASE_URL = config("SUPABASE_URL")
SUPABASE_KEY = config("SUPABASE_SERVICE_KEY")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def detect_content_type(file_obj):
    """
    Determine the MIME type for a file with explicit PDF/video handling.
    Priority:
      1. Hardcoded rules for PDFs and common videos.
      2. file_obj.content_type (if available).
      3. mimetypes.guess_type fallback.
    """
    ext = file_obj.name.lower()

    # PDF branch
    if ext.endswith(".pdf"):
        return "application/pdf"

    # Video branches (add more if needed)
    if ext.endswith(".mp4"):
        return "video/mp4"
    elif ext.endswith(".mov"):
        return "video/quicktime"
    elif ext.endswith(".webm"):
        return "video/webm"
    elif ext.endswith(".avi"):
        return "video/x-msvideo"

    # Use uploaded file's provided content_type if available
    if hasattr(file_obj, "content_type") and file_obj.content_type:
        return file_obj.content_type

    # Guess from extension
    guessed_type, _ = mimetypes.guess_type(file_obj.name)
    return guessed_type or "application/octet-stream"


def upload_lesson_file(file_obj, lesson_title):
    """
    Uploads file to Supabase storage with explicit content type.
    Returns public URL.
    """
    # Unique filename
    filename = f"lessons/{datetime.now().timestamp()}_{lesson_title}_{file_obj.name}"

    # Read file into bytes
    file_bytes = file_obj.read()

    # Detect MIME type
    content_type = detect_content_type(file_obj)

    # Upload with explicit content type
    res = supabase.storage.from_("lesson-files").upload(
        filename,
        file_bytes,
        {
            "content-type": content_type
        }
    )

    # Error handling
    error = getattr(res, "error", None)
    if error:
        error_msg = getattr(error, "message", str(error))
        raise Exception(f"Supabase upload error: {error_msg}")

    # Return public URL
    public_url = supabase.storage.from_("lesson-files").get_public_url(filename)
    return public_url
