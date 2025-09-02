# utils/supabase.py
import mimetypes
from supabase import create_client
from datetime import datetime
from decouple import config  # type: ignore
import re
from urllib.parse import quote

# Environment config
SUPABASE_URL = config("SUPABASE_URL") or "https://zgkkjmbclnmngjugzqpn.supabase.co"
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

def safe_filename(name: str) -> str:
    # Replace spaces with underscores and remove unsafe characters
    name = name.strip().replace(" ", "_")
    name = re.sub(r"[^A-Za-z0-9._-]", "", name)  # keep only safe chars
    return name


def upload_cover_image(file_obj, course_title):
    """
    Uploads a cover image to Supabase 'cover' folder.
    Returns the public URL of the uploaded file.
    """

    # Sanitize both course_title and file name
    safe_course_title = safe_filename(course_title)
    safe_file_name = safe_filename(file_obj.name)

    # Unique filename inside "cover" folder
    filename = f"cover/{datetime.now().timestamp()}_{safe_course_title}_{safe_file_name}"

    # Read file into bytes
    file_bytes = file_obj.read()

    # Detect MIME type
    content_type = detect_content_type(file_obj)

    # Upload with explicit content type
    res = supabase.storage.from_("cover").upload(
        filename,
        file_bytes,
        {
            "content-type": content_type
        }
    )

    error = getattr(res, "error", None)
    if error:
        error_msg = getattr(error, "message", str(error))
        raise Exception(f"Supabase upload error: {error_msg}")

    # Get public URL and ensure proper encoding
    public_url = supabase.storage.from_("cover").get_public_url(filename)
    safe_url = quote(public_url, safe=":/%?=&")  # encode spaces etc. but keep URL structure

    return safe_url
