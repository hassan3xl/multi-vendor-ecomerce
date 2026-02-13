from django.db import models
import uuid
from django.conf import settings

class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=False, 
        blank=False, 
        related_name='carts'
    )
    # Used to track anonymous carts via a session/cookie key
    session_key = models.CharField(max_length=40, null=True, blank=True, unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.email}"
        return f"Anonymous Cart {self.id}"

    @property
    def total_items(self):
        """Returns the total number of distinct items in the cart."""
        return self.items.count()

    @property
    def total_quantity(self):
        """Returns the sum of all item quantities in the cart."""
        return sum(item.quantity for item in self.items.all())

    @property
    def get_cart_total(self):
        """Calculates the subtotal of all items in the cart."""
        # Use Product's sale_price if available, otherwise original_price
        # Note: You should ideally move price calculation logic into Product model methods 
        # as discussed in the previous response.
        return sum(item.get_total_price() for item in self.items.all())
    
    
    def clear_cart(self):
        """Clear all items from cart"""
        self.items.all().delete()
        self.save() 

    class Meta:
        ordering = ['-created_at']

class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Links to the main Cart container
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    # Links to the actual Product being purchased
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    
    quantity = models.PositiveIntegerField(default=1)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Cart {self.cart.id}"

    @property
    def get_unit_price(self):
        """Returns the current effective price of the product."""
        # Use sale_price if on sale, otherwise original_price
        return self.product.sale_price if self.product.is_on_sale and self.product.sale_price else self.product.original_price

    @property
    def get_total_price(self):
        """Returns the total price for this item (unit price * quantity)."""
        return self.get_unit_price * self.quantity

    class Meta:
        # Ensures a product can only be added once to a specific cart
        unique_together = ['cart', 'product']