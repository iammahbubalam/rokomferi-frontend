
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug, getProductReviews } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShoppingBag, Ruler, Info } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductGallery } from "@/components/product/ProductGallery";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product.id);

  return (
    <div className="min-h-screen bg-bg-primary text-primary pt-20">
      {/* Top Navigation / Breadcrumb */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collection
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-10rem)]">
        
        {/* Left: Product Gallery (Sticky on Desktop) */}
        <div className="w-full lg:w-[55%] relative lg:sticky lg:top-24 h-fit">
           <div className="p-4 lg:p-8">
             <ProductGallery media={product.media} />
           </div>
        </div>

        {/* Right: Story & Details (Scrollable but Sticky relative to container) */}
        <div className="w-full lg:w-[45%] p-6 md:p-12 lg:p-16 flex flex-col gap-12 bg-bg-primary">
           
           {/* Header */}
           <div className="space-y-4 border-b border-primary/10 pb-8">
              <span className="text-secondary text-sm tracking-[0.2em] uppercase">{product.category}</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-[0.9]">
                {product.name}
              </h1>
              <div className="flex items-center justify-between pt-2">
                 <div className="flex flex-col">
                     <span className="text-2xl font-light text-primary">
                         ৳{(product.pricing.salePrice || product.pricing.basePrice).toLocaleString()}
                     </span>
                     {product.pricing.salePrice && (
                         <span className="text-sm line-through text-secondary opacity-60">৳{product.pricing.basePrice.toLocaleString()}</span>
                     )}
                 </div>
                 {product.inventory.status === 'in_stock' ? (
                   <span className="text-xs text-green-600 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"/> In Stock
                   </span>
                 ) : (
                   <span className="text-xs text-red-500 uppercase tracking-widest">Sold Out</span>
                 )}
              </div>
           </div>

           {/* StoryBrand: The Hook */}
           {product.weaversNote && (
             <div className="space-y-4">
                <h3 className="font-serif text-xl italic text-primary/80">The Weaver's Note</h3>
                <p className="text-lg font-light leading-relaxed text-secondary/90">
                  {product.weaversNote}
                </p>
             </div>
           )}



// ...

           {/* Actions */}
           <div className="space-y-6">
              <AddToCartButton product={product} />
              <div className="flex justify-center gap-8 text-xs uppercase tracking-widest text-secondary underline-offset-4 decoration-primary/30">
                 <button className="hover:underline flex items-center gap-2"><Ruler className="w-3 h-3"/> Size Guide</button>
                 <button className="hover:underline flex items-center gap-2"><Info className="w-3 h-3"/> Delivery & Returns</button>
              </div>
           </div>

           {/* Fabric Story */}
           {product.fabricStory && (
              <div className="bg-bg-secondary p-8 space-y-4 border border-white/5">
                 <span className="text-xs uppercase tracking-widest text-secondary">Material Origin</span>
                 <p className="text-primary leading-relaxed font-light">
                    {product.fabricStory}
                 </p>
              </div>
           )}

           {/* Specifications Table */}
           {product.specifications && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 border-t border-primary/10 pt-8 text-sm">
                <div>
                  <span className="block text-secondary text-xs uppercase mb-1">Material Composition</span>
                  <span className="text-primary">{product.specifications.material}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase mb-1">Weave Type</span>
                  <span className="text-primary">{product.specifications.weave}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase mb-1">Origin</span>
                  <span className="text-primary">{product.specifications.origin}</span>
                </div>
                <div>
                  <span className="block text-secondary text-xs uppercase mb-1">Care</span>
                  <ul className="text-primary list-disc list-inside">
                    {product.specifications.care.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
             </div>
           )}

        </div>
      </div>
      
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-20 py-20 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl mb-12 text-center">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                    <h3 className="text-secondary uppercase text-xs tracking-widest mb-6 border-b border-gray-100 pb-2">Recent Feedback</h3>
                    <ReviewList reviews={reviews} />
                </div>
                <div>
                   <div className="sticky top-24">
                      <ReviewForm productId={product.id} onSuccess={() => {}} />
                   </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}
