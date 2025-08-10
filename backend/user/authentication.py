# user/authenticate.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

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
            
            # Instead of fetching from cache, directly fetch from DB:
            user = self.get_user(validated_token)
            
            # You can optionally log serialized user for debug, no caching:
            serialized = UserSerializer(user).data
            print("DB user fetched:", serialized)

            return (user, validated_token)
        
        except AuthenticationFailed as e:
            print(f"AuthenticationFailed: {e}")
            # Return None to indicate unauthenticated
            return None
        except Exception as e:
            print(f"Unexpected error during authentication: {e}")
            return None