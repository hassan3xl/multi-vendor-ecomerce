# order_manager/views_merchant.py
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from orders.models.orders import SubOrder
from .serializers import (
    MerchantSubOrderSerializer,
    UpdateSubOrderStatusSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class MerchantSubOrderListView(ListAPIView):
    serializer_class = MerchantSubOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if not hasattr(user, 'merchant'):
            raise PermissionDenied("You must be a merchant to view these orders.")

        return SubOrder.objects.filter(
            merchant=user.merchant,
            order__payment__payment_status="paid"
            
        )

class MerchantSubOrderDetailView(RetrieveAPIView):
    serializer_class = MerchantSubOrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'merchant'):
            raise PermissionDenied("You are not a merchant.")

        return SubOrder.objects.filter(merchant=user.merchant)


# accept order
class AcceptOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        sub_order = SubOrder.objects.get(id=id)
        if sub_order.status == 'pending':
            sub_order.status = 'processing'
            sub_order.save()
            return Response({"status": "success"})
 

# reject order
class RejectOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        sub_order = SubOrder.objects.get(id=id)
        if sub_order.status == 'pending' or sub_order.status == 'processing':
            sub_order.status = 'cancelled'
            sub_order.save()
            return Response({"status": "success"})


# ship or deliver order
class ShipOrDeliverOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        sub_order = SubOrder.objects.get(id=id)
        if sub_order.status == 'processing':
            sub_order.status = 'shipped'
            sub_order.save()
            return Response({"status": "success"})