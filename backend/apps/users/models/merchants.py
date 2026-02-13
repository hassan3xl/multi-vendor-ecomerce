from django.db import models
from django.utils import timezone
from django.db import models
import uuid
from cloudinary.models import CloudinaryField
from .users import User

class Merchant(models.Model):

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("suspended", "Suspended"),
    ]

    VERIFICATION_CHOICES = [
        ("verified", "Verified"),
        ("rejected", "Rejected"),
        ("pending", "Pending"),
    ]


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="merchant"
    )
    store_name = models.CharField(max_length=100, blank=True)
    store_description = models.TextField(max_length=500, blank=True)
    store_email = models.EmailField(blank=True)
    store_address = models.CharField(max_length=100, blank=True)
   
    store_logo = CloudinaryField('image', folder='store_logos/', blank=True, null=True)

    store_phone = models.CharField(max_length=20, blank=True)
    verification_status = models.CharField(
        max_length=20, choices=VERIFICATION_CHOICES, default="pending"
    )
    active_status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="inactive"
    )
    total_sales = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "merchant_profiles"

    def __str__(self):
        return f"{self.user.email} - {self.store_name}"


class MerchantReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    merchant = models.ForeignKey(Merchant, on_delete=models.CASCADE, related_name="merchant_reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_reviews")
    rating = models.PositiveIntegerField()
    comment = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "merchant_reviews"
