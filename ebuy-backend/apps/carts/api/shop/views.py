# cart/views.py
from django.conf import settings
from rest_framework import viewsets, status, generics


from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from apps.carts.models import Cart, CartItem
from apps.carts.api import CartItemSerializer, CartSerializer
import uuid

class UserCartViewSet(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    authentication_classes = []
    
# --- Helper Function ---
def get_or_create_cart(request):
    """Retrieves the cart based on authenticated user or session key."""
    cart = None
    
    # 1. Try to get the cart for an authenticated user
    if request.user.is_authenticated:
        # Get or create a cart linked to the user
        cart, created = Cart.objects.get_or_create(
            user=request.user, 
            defaults={'session_key': None} # Ensure session_key is cleared if user logs in
        )
    
    # 2. Try to get the cart using the session key (for anonymous users)
    else:
        # We expect the front end (Next.js) to send the cart_id in a cookie
        cart_id = request.COOKIES.get('cart_id')
        if cart_id:
            try:
                cart = Cart.objects.get(session_key=cart_id, user__isnull=True)
            except Cart.DoesNotExist:
                # Cart ID is invalid/expired, create a new one
                pass

        if not cart:
            # Create a brand new anonymous cart
            cart = Cart.objects.create(session_key=uuid.uuid4())
            # Note: The view will set this session_key as a cookie in the response

    return cart
# --- End Helper Function ---


class CartViewSet(viewsets.ViewSet):
    """
    API endpoints for managing the shopping cart.
    """
    
    # GET /api/cart/
    def list(self, request):
        """Retrieve the current user's or session's cart."""
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart)
        
        response = Response(serializer.data)
        
        # If it's a new anonymous cart, set the session key as a cookie
        if cart.session_key and not request.COOKIES.get('cart_id'):
            # Set the cookie with the unique cart ID
            response.set_cookie(
                key='cart_id',
                value=str(cart.session_key),
                max_age=settings.SESSION_COOKIE_AGE, # Or whatever duration you prefer
                httponly=True, # Prevent client-side JS access for security
                samesite='Lax'
            )
            
        return response

    # POST /api/cart/add_item/
    @action(detail=False, methods=['post'], url_path='add_item')
    def add_item(self, request):
        """Add a product to the cart or increase its quantity."""
        cart = get_or_create_cart(request)
        
        # We use the CartItemSerializer to validate incoming data
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data.get('quantity', 1)
        
        try:
            # Check if item already exists in cart
            item = CartItem.objects.get(cart=cart, product_id=product_id)
            item.quantity += quantity
            item.save()
            created = False
        except CartItem.DoesNotExist:
            # Create new item
            item = CartItem.objects.create(
                cart=cart, 
                product_id=product_id, 
                quantity=quantity
            )
            created = True
        
        # Re-serialize the item to return the updated cart state
        response_serializer = CartSerializer(cart)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    # PUT/PATCH /api/cart/update_item/{item_id}/
    @action(detail=False, methods=['patch'], url_path='update_item/(?P<item_pk>[^/.]+)')
    def update_item(self, request, item_pk=None):
        """Update the quantity of a specific cart item."""
        cart = get_or_create_cart(request)
        
        # Find the specific item in *this* cart
        item = get_object_or_404(CartItem, cart=cart, pk=item_pk)
        
        new_quantity = request.data.get('quantity')
        
        if new_quantity is None or not isinstance(new_quantity, int) or new_quantity <= 0:
            return Response(
                {"error": "Quantity must be a positive integer."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        item.quantity = new_quantity
        item.save()
        
        response_serializer = CartSerializer(cart)
        return Response(response_serializer.data)

    # DELETE /api/cart/remove_item/{item_id}/
    @action(detail=False, methods=['delete'], url_path='remove_item/(?P<item_pk>[^/.]+)')
    def remove_item(self, request, item_pk=None):
        """Remove a specific cart item."""
        cart = get_or_create_cart(request)
        
        # Find the specific item in *this* cart and delete it
        item = get_object_or_404(CartItem, cart=cart, pk=item_pk)
        item.delete()
        
        response_serializer = CartSerializer(cart)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


    @action(detail=False, methods=['delete'], url_path='clear')
    def clear(self, request):
        cart = get_object_or_404(Cart)
        cart.clear_cart()
        
        response_serializer = CartSerializer(cart)
        return Response(response_serializer.data, status=status.HTTP_200_OK)