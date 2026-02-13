
from django.urls import path, include
from .views import OrderViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r"", OrderViewSet, basename="orders")




urlpatterns = [
    path("", include(router.urls)),
    # path("order/create/", CreateOrderView.as_view(), name="create-order"),

]