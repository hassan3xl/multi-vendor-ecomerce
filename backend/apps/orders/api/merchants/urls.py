# order_manager/urls_merchant.py
from django.urls import path
from views import (
    MerchantSubOrderListView,
    MerchantSubOrderDetailView,
    AcceptOrderView,
    RejectOrderView,
    ShipOrDeliverOrderView,
)

urlpatterns = [
    path("", MerchantSubOrderListView.as_view(), name="merchant-orders"),
    path("<uuid:id>/", MerchantSubOrderDetailView.as_view(), name="merchant-order-detail"),
    path("<uuid:id>/accept/", AcceptOrderView.as_view(), name="merchant-order-accept"),
    path("<uuid:id>/reject/", RejectOrderView.as_view(), name="merchant-order-reject"),
    path("<uuid:id>/ship/", ShipOrDeliverOrderView.as_view(), name="merchant-order-ship"),
]
