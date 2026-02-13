from rest_framework import serializers
from apps.orders.models import (
    Order, SubOrder, OrderItem, PaymentInfo, Address
)
from apps.products.models import (
    Product
)
from apps.products.api import (
    ProductImageSerializer
)

class PaymentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentInfo
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class SubOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = SubOrder
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    sub_orders = SubOrderSerializer(many=True, read_only=True)
    payment = PaymentInfoSerializer(read_only=True)
    shipping_address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'total_amount',
            'sub_orders',
            'payment',
            'shipping_address',
            'created_at'
        ]
