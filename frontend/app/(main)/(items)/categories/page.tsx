import CategoryList from "@/components/products/CategoryList";
import { Category } from "@/lib/types/product.types";
import { Fragment } from "react/jsx-runtime";

export default async function Categories() {
  // ✅ Fetch data directly on the server
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds (ISR caching)
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">Failed to load categories.</p>
      </div>
    );
  }

  const categories: Category[] = await res.json();

  if (categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">No categories available.</p>
      </div>
    );
  }

  return (
    <section className="p-4">
      <h2 className="text-2xl mt-2 font-bold py-2 text-primary">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {categories.map((category) => {
          return (
            <div key={category.id}>
              <CategoryList category={category} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
