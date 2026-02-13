
from django.urls import path, include
from ..views.category_views import CategoryListView, CategoryDetailsView


urlpatterns = [
    path('', CategoryListView.as_view(), name='category-list'),
    path('<str:name>/', CategoryDetailsView.as_view()),
    
]