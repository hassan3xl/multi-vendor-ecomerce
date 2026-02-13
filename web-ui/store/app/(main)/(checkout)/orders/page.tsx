"use client";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useGetOrders } from "@/lib/hooks/orders.hook";
import { Order } from "@/lib/types/order.types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";

const OrdersPage = () => {
  const { data: ordersArray, isLoading: loading, error } = useGetOrders();
  const orders = ordersArray as Order[];
  console.log("orders", orders);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-accent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error</div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="">
        <Header
          title="My Orders"
          subtitle="View your order history and track shipments"
          stats={[
            {
              title: "Total Orders",
              value: orders?.length,
            },
            {
              title: "Pending Orders",
              value: orders?.filter((order) => order.order_status === "pending")
                .length,
            },
            {
              title: "Delivered Orders",
              value: orders?.filter(
                (order) => order.order_status === "delivered"
              ).length,
            },
            {
              title: "Cancelled Orders",
              value: orders?.filter(
                (order) => order.order_status === "cancelled"
              ).length,
            },
          ]}
        />

        {orders?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-primary">No orders found</div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => (
              <div
                key={order.id}
                className="bg-accent shadow-sm rounded-lg border border-border"
              >
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-primary">
                        Order {order.order_number}
                      </h3>
                      <p className="text-sm text-primary mt-1">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-orders */}
                <div className="divide-y divide-border">
                  {order.sub_orders.map((subOrder) => (
                    <div key={subOrder.id} className="p-6 bg-card">
                      <div className="flex flex-row items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-primary">
                            {subOrder.sub_order_number}
                          </h4>
                          <div className="flex items-center mt-1 space-x-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                subOrder.status
                              )}`}
                            >
                              {subOrder.status.charAt(0).toUpperCase() +
                                subOrder.status.slice(1)}
                            </span>
                            {subOrder.tracking_number && (
                              <span className="text-sm text-primary">
                                Tracking: {subOrder.tracking_number}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 lg:mt-0 text-sm text-primary">
                          <Button>View</Button>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-4">
                        {subOrder.items.map((item) => (
                          <div key={item.id} className="flex flex-col gap-6">
                            <div className="flex items-center space-x-4">
                              <div className="shrink-0 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                {item.product_image ? (
                                  <Image
                                    src={item.product_image}
                                    alt={item.product_name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    unoptimized
                                    width={400}
                                    height={400}
                                  />
                                ) : (
                                  <span className="text-gray-400 text-xs text-center">
                                    No Image
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-primary truncate">
                                  {item.product_name}
                                </p>
                                {item.sku && (
                                  <p className="text-sm text-primary">
                                    SKU: {item.sku}
                                  </p>
                                )}
                                {item.variant && (
                                  <p className="text-sm text-primary">
                                    Variant: {JSON.stringify(item.variant)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-primary">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {formatCurrency(item.price)} each
                              </span>
                              <span className="text-sm font-medium text-primary">
                                {formatCurrency(item.item_total)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Information */}
                      {subOrder.estimated_delivery && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-primary">
                            Estimated Delivery:{" "}
                            {formatDate(subOrder.estimated_delivery)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-6 flex justify-between py-4 bg-accent border-t border-border">
                  <div className="flex justify-between items-center text-sm text-primary">
                    <span>Payment: {order.payment.payment_status}</span>
                    {order.paid_at && (
                      <span>Paid on {formatDate(order.paid_at)}</span>
                    )}
                  </div>
                  <div>
                    {order.payment.payment_status === "paid" ? (
                      <Button>View reciept</Button>
                    ) : order.payment.payment_status === "pending" ? (
                      <Button>Pay now</Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
