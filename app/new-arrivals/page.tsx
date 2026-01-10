import CategoryPage from "../category/[slug]/page";

// Reuse the Category Page logic for the top-level route
export default async function NewArrivalsPage() {
  // Simulate the params promise
  const params = Promise.resolve({ slug: "new-arrivals" });
  return <CategoryPage params={params} />;
}
