# order_manager/serializers_merchant.py
from rest_framework import serializers
from apps.orders.models import SubOrder, OrderItem


class MerchantOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_name',
            'product_image',
            'price',
            'quantity',
            'item_total',
            'sku',
            'variant',
        ]


class MerchantSubOrderSerializer(serializers.ModelSerializer):
    items = MerchantOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = SubOrder
        fields = [
            'id',
            'sub_order_number',
            'status',
            'subtotal',
            'tracking_number',
            'carrier',
            'estimated_delivery',
            'created_at',
            'updated_at',
            'items',
        ]


class UpdateSubOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubOrder
        fields = ['status', 'tracking_number', 'carrier', 'estimated_delivery']
