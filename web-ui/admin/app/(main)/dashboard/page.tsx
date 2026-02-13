"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/services/apiService";
import Header from "@/components/Header";
import Loader from "@/components/Loader";

const DashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiService.get("/dashboard/");
      return res;
    },
  });
  console.log("data", data);
  if (isLoading) return <Loader title="Loading dashboard" />;
  if (error) return <p>Failed to load dashboard.</p>;

  return (
    <div className="">
      {/* Page Header */}
      <Header
        title="Dashboard"
        subtitle="Welcome back, Here's what's happening today."
        stats={[
          {
            title: "Total Products",
            value: `${data.stats.total_products}`,
            // change: "+20.1%",
            icon: "",
          },
          {
            title: "Total Revenue",
            value: `$ ${data.stats.active_products}0000`,
            // change: "+12.5%",
            icon: "Withdraw",
          },
          {
            title: "Active Products",
            value: `${data.stats.active_products}`,
            // change: "+5.3%",
            icon: "",
          },
          {
            title: "Total Orders",
            value: `${data.stats.inactive_products}`,
            // change: "+2.1%",
          },
        ]}
      />

      {/* Content Cards */}
      <div className="bg-muted p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Recent Orders
        </h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div>
                <p className="font-medium text-primary">Order #{1000 + i}</p>
                <p className="text-sm text-gray-500">Customer Name</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary">
                  ${(Math.random() * 500 + 50).toFixed(2)}
                </p>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Completed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
