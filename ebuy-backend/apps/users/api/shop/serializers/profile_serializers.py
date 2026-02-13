from rest_framework import serializers
from apps.users.models import Profile

from rest_framework import serializers
from apps.users.models import Profile, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source='user.email', read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'full_name',
            'bio', 'avatar', 'phone', 'email_notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    

    
    def get_avatar(self, obj):
        """This method MUST be named get_<field_name>"""
        if obj.avatar:
            return obj.avatar.url
        return None