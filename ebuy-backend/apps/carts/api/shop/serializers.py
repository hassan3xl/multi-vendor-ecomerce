# cart/serializers.py (or a shared serializer file)
from rest_framework import serializers
from apps.products.models import Product, ProductImage
from apps.carts.models import CartItem, Cart


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = ProductImage
        fields = ['id', 'image',  'is_primary']
    
    def get_image(self, obj):
        """This method MUST be named get_<field_name>"""
        if obj.image:
            return obj.image.url
        return None

class MiniProductSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    images = ProductImageSerializer(many=True, read_only=False)


    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'original_price', 'effective_price', 'is_on_sale', 'stock', 'images']



class CartItemSerializer(serializers.ModelSerializer):
    product = MiniProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    item_total = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        # Note: 'cart' is excluded from fields as it's handled by the View
        fields = ['id', 'product', 'product_id', 'quantity', 'item_total']
        read_only_fields = ['id', 'item_total']

    def validate_product_id(self, value):
        # Validate that the product exists
        try:
            Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist or is inactive.")
        return value

    def get_item_total(self, obj: CartItem):
        return obj.product.effective_price * obj.quantity

# cart/serializers.py
class CartSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.IntegerField(read_only=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_quantity', 'cart_total', 'created_at']

    def get_cart_total(self, obj: Cart):
        # We need to sum up the effective prices of all items
        total = sum(item.product.effective_price * item.quantity for item in obj.items.all())
        return total