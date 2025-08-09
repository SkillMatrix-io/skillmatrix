# user/authenticate.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.core.cache import cache
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
            user_id = validated_token['user_id']

            # Try Redis first
            cache_key = f"user_data:{user_id}"
            user_data = cache.get(cache_key)

            if user_data:
                # Create a mock User instance without DB hit
                user = User(**user_data)
                user.pk = user_id
                print("redis: ",user)
                return (user, validated_token)

            # Fallback: DB fetch
            user = self.get_user(validated_token)
            # Cache serialized data (exclude password & sensitive fields)
            serialized = UserSerializer(user).data
            cache.set(cache_key, serialized, timeout=60*5)  # 5 min TTL
            return (user, validated_token)
        
        except AuthenticationFailed as e:
            print(f"AuthenticationFailed: {e}")
            # Don't raise — just act like the user is not authenticated
            return None
        except Exception as e:
            print(f"Unexpected error during authentication: {e}")
            return None
