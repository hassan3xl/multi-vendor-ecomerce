from django.contrib import admin
from .models.orders import Order, OrderItem, SubOrder, Address, PaymentInfo

admin.site.register(Order)
admin.site.register(SubOrder)
admin.site.register(OrderItem)
admin.site.register(Address)
admin.site.register(PaymentInfo)

