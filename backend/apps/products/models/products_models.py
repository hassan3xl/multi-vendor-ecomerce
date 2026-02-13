
from django.db import models
import uuid 
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from cloudinary.models import CloudinaryField
from .categories import Category



class Product(models.Model):

    class sale_type(models.TextChoices):
        HOT = "hot_deal", "Hot Deal"
        NEW = "new_arrival", "New Arrival"
        BEST = "best_seller", "Best Seller"
        TRENDING = "trending", "Trending"

    class StatusChoices(models.TextChoices):
        ACTIVE = "active", "Active"
        IN_ACTIVE = "in_active", "In Active"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    merchant = models.ForeignKey("users.Merchant", on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    stock = models.PositiveIntegerField(default=0)
    # sale_type = models.CharField(max_length=20, choices=sale_type.choices, default=sale_type.NEW)
    is_on_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes_count = models.PositiveIntegerField(default=0)

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    


    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', '-created_at']),
        ]

    @property
    def primary_image_url(self):
        img = self.images.filter(is_primary=True).first()
        return img.image.url if img else ""


    @property
    def effective_price(self):
        """
        Returns the price the customer should pay.
        Prioritizes sale_price if is_on_sale is True and sale_price is set.
        """
        if self.is_on_sale and self.sale_price is not None:
            return self.sale_price
        return self.original_price

    # Call clean in save() or use full model forms for validation
    def save(self, *args, **kwargs):
        self.full_clean() # Ensure validation runs before saving
        super().save(*args, **kwargs)
    
class Feature(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="features")
    name = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        # Prevent duplicate likes from same user
        unique_together = ['product', 'user']
        # Speed up queries
        indexes = [
            models.Index(fields=['product', 'user']),
        ]

class ProductInventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventory')
    sku = models.CharField(max_length=100, unique=False, blank=True)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    track_inventory = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Product Inventories"

    @property
    def is_in_stock(self):
        if not self.track_inventory:
            return True
        return self.stock > 0

    @property
    def is_low_stock(self):
        if not self.track_inventory:
            return False
        return 0 < self.stock <= self.low_stock_threshold

    def __str__(self):
        return f"{self.product.name} - Stock: {self.stock}"


class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="specifications")
    title = models.CharField(max_length=100)
    body = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - {self.title}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', folder='products/')  # Images will be stored in 'products' folder
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary', 'created_at']

    def save(self, *args, **kwargs):
        # If this is set as primary, unset all other primary images for this product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        
        # If no primary image exists, make this one primary
        if not ProductImage.objects.filter(product=self.product, is_primary=True).exists():
            self.is_primary = True
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - Image {self.order}"
    
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['product', 'user']  # One review per user per product

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)
    #     # Update product rating after saving review
    #     self.product.update_rating()

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        # Update product rating after deleting review
        product.update_rating()

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"


