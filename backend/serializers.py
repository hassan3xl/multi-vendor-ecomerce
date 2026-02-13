

from rest_framework.serializers import  ModelSerializer
from rest_framework import serializers

from products.models import(
    Product, 
    Wishlist,
    ProductImage,
    Category, 
    Review,
    ProductSpecification, 
    ProductInventory, 
    Feature
)
from django.db.models import Avg


class WishlistSerializer(ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ["user", "likes_count", "created_at"]

class ProductFeaturesSerializer(ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']

class ProductInventorySerializer(ModelSerializer):
    class Meta:
        model = ProductInventory
        fields = ['id', 'stock']

class ReviewSerializer(ModelSerializer):
    user_id = serializers.UUIDField(source='user.id', read_only=True)
    first_name = serializers.CharField(source='user.profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user.profile.last_name', read_only=True)
    avatar = serializers.ImageField(source='user.profile.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user_id', 'first_name', 'last_name', 'avatar', 'rating', 'comment', 'created_at']

class ProductSpecificationSerializer(ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['id', 'title', 'body']

class ProductCategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", 'name', 'image']

class ProductImageSerializer(ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['id', 'image',  'is_primary']
    
    def get_image(self, obj):
        """This method MUST be named get_<field_name>"""
        if obj.image:
            return obj.image.url
        return None

class ProductSerializer(ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=False)
    category = ProductCategorySerializer(read_only=True)
    specifications = ProductSpecificationSerializer(read_only=False, many=True)
    product_reviews = ReviewSerializer(many=True, read_only=True)
    inventory = ProductInventorySerializer(read_only=False)
    features = ProductFeaturesSerializer(many=True, read_only=False)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'stock', "average_rating", 'is_on_sale', 
                  'sale_price', 'original_price', 'category',
                    'inventory', 'features', "is_active", 'images', 'product_reviews', 'specifications']
        

    def get_average_rating(self, obj):
        avg = obj.product_reviews.aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg is not None else 0.0


