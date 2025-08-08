# user/authenticate.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("=== CookieJWTAuthentication.authenticate called ===")
        raw_token = request.COOKIES.get('access')
        print(f"Raw token from cookies: {raw_token}")
        if raw_token is None:
            print("No access token found in cookies")
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
            print(f"Authentication successful for user: {user}")
            return (user, validated_token) 
        except AuthenticationFailed as e:
            print(f"AuthenticationFailed: {e}")
            # Don't raise — just act like the user is not authenticated
            return None
        except Exception as e:
            print(f"Unexpected error during authentication: {e}")
            return None
