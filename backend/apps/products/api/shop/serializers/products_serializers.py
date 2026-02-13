from rest_framework.serializers import  ModelSerializer
from rest_framework import serializers

from apps.products.models import(
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

class ProductMerchantSerializer(serializers.ModelSerializer):
    store_logo = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()


    class Meta:
        model = Product
        fields = [
            "id", "store_name", "average_rating", "products",
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


class WishlistSerializer(ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ["user", "created_at"]

class ProductFeaturesSerializer(ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']

class ProductInventorySerializer(ModelSerializer):
    class Meta:
        model = ProductInventory
        fields = ['id', 'sku']

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
    merchant = ProductMerchantSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=False)
    category = ProductCategorySerializer(read_only=True)
    specifications = ProductSpecificationSerializer(read_only=False, many=True)
    product_reviews = ReviewSerializer(many=True, read_only=True)
    inventory = ProductInventorySerializer(read_only=False)
    features = ProductFeaturesSerializer(many=True, read_only=False)
    average_rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'description',  'stock', "average_rating", 'is_on_sale', 'created_at',
                  'sale_price', 'original_price', 'category',
                    'inventory', 'features', "is_active", 'images', 'merchant', 'product_reviews', 'specifications']

    def get_average_rating(self, obj):
        avg = obj.product_reviews.aggregate(avg=Avg('rating'))['avg']
        return round(avg, 1) if avg is not None else 0.0



class CategorySerializer(ModelSerializer):
    product_count = serializers.SerializerMethodField()
    products = ProductSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'product_count', 'products']

    def get_product_count(self, obj):
        return obj.products.count()

    def get_image(self, obj):
        """This method MUST be named get_<field_name>"""
        if obj.image:
            return obj.image.url
        return None