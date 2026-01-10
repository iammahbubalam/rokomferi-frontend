
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShoppingBag, Ruler, Info } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-primary text-primary pt-20">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
        
        {/* Left: VisualHero (Sticky) */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative lg:sticky lg:top-20">
           <Image
             src={product.media[0].url}
             alt={product.name}
             fill
             className="object-cover"
             priority
           />
           <Link 
             href="/" 
             className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
           >
             <ArrowLeft className="w-4 h-4" /> Back to Collection
           </Link>
        </div>

        {/* Right: Story & Details (Scrollable) */}
        <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col gap-12 bg-bg-primary">
           
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
    </div>
  );
}
