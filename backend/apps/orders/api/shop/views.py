# order_manager/views/create_order.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.carts.models import Cart, CartItem
from apps.orders.models import Order, OrderItem, SubOrder, PaymentInfo, Address
import uuid
from rest_framework import viewsets
from .serializers import OrderItemSerializer, OrderSerializer, SubOrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    # create order
    @transaction.atomic
    def create(self, request, *args, **kwargs):

        user = request.user

        # 1. Get the user's cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        if cart.items.count() == 0:
            return Response({"error": "No items in cart"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Extract shipping address from frontend
        shipping_data = request.data.get("shipping_address")
        if not shipping_data:
            return Response({"error": "Shipping address is required"}, status=400)

        # 3. Create Address
        address = Address.objects.create(
            full_address=shipping_data["full_address"],
            city=shipping_data["city"],
            state=shipping_data["state"],
            zip_code=shipping_data["zip_code"],
            country=shipping_data["country"],
            phone_number=shipping_data["phone"],
        )

        # 4. Create Payment Info (initial state)
        payment = PaymentInfo.objects.create(
            payment_method=request.data.get("payment_method", "not_selected"),
            payment_status="pending",
        )

        # 5. Create Order
        order = Order.objects.create(
            user=user,
            order_number=f"ORD-{uuid.uuid4().hex[:10].upper()}",
            total_amount=0,
            shipping_address=address,
            payment=payment,
            order_status="pending_payment",
        )

        # 6. Group cart items by merchant
        merchant_groups = {}
        for item in cart.items.select_related("product"):
            merchant = item.product.merchant

            if merchant.id not in merchant_groups:
                merchant_groups[merchant.id] = {
                    "merchant": merchant,
                    "items": []
                }
            merchant_groups[merchant.id]["items"].append(item)

        # 7. Create SubOrders + Items
        total_amount = 0

        for m_id, group in merchant_groups.items():
            merchant = group["merchant"]
            items = group["items"]

            sub_order = SubOrder.objects.create(
                order=order,
                merchant=merchant,
                sub_order_number=f"SUB-{uuid.uuid4().hex[:10].upper()}",
                status="pending",
                subtotal=0,
            )

            subtotal = 0

            for cart_item in items:
                price = cart_item.get_unit_price
                quantity = cart_item.quantity

                primary_image = cart_item.product.images.filter(is_primary=True).first()
                product_image_url = primary_image.image.url if primary_image else ""


                OrderItem.objects.create(
                    sub_order=sub_order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_description=cart_item.product.description,
                    product_image=product_image_url,
                    price=price,
                    quantity=quantity,
                    item_total=price * quantity,
                    # variant=None,
                )

                subtotal += price * quantity

            sub_order.subtotal = subtotal
            sub_order.save()

            total_amount += subtotal

        # 8. Update order total
        order.total_amount = total_amount
        order.save()

        # 9. Clear cart
        cart.items.all().delete()

        return Response({
            "message": "Order created successfully",
            "order_id": order.id,
            "order_number": order.order_number,
            "total_amount": total_amount
        }, status=201)
