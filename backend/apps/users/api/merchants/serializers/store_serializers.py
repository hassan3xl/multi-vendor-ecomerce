from products.models import Product, ProductImage, Category, Review, ProductSpecification, Feature
from users.models import Merchant, MerchantReview
from rest_framework import serializers
from django.db.models import Avg

class MerchantReviewSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='user.profile.avatar', read_only=True)
    user_names = serializers.SerializerMethodField()

    class Meta:
        model = MerchantReview
        fields = ["id", "user_names", "avatar", "rating", "comment", "created_at"]

    def get_user_names(self, obj):
        profile = getattr(obj.user, "profile", None)
        if profile:
            return f"{profile.first_name} {profile.last_name}".strip()
        return obj.user.email or "Anonymous"


class MerchantStoreSerializer(serializers.ModelSerializer):
    store_logo = serializers.SerializerMethodField()
    merchant_reviews = MerchantReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Merchant
        fields = [
            "id", "store_name", "average_rating", "merchant_reviews", "store_description", "store_address",
            "store_logo", "store_phone", "active_status", "verification_status",
             "total_sales", "created_at"
        ]

    def get_store_logo(self, obj):
        if obj.store_logo:
            return obj.store_logo.url
        return None
    
    def get_average_rating(self, obj):
        avg = obj.merchant_reviews.aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg is not None else 0.0
