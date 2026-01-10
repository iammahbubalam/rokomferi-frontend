
import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionInfo, getProductsByCollection } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { Container } from "@/components/ui/Container";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = await getCollectionInfo(slug);
  const products = await getProductsByCollection(slug);

  if (!info) {
    notFound();
  }

  return (
    <div className="bg-bg-primary min-h-screen text-primary pb-24">
       
       {/* 1. Cinematic Header (Mood Board) */}
       <div className="relative h-[80vh] w-full overflow-hidden">
          <Image
            src={info.image}
            alt={info.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
             <span className="text-xs uppercase tracking-[0.3em] mb-4">Collection</span>
             <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl tracking-tight opacity-90">{info.title}</h1>
             <p className="max-w-md mt-6 text-lg md:text-xl font-light leading-relaxed text-white/90">
                {info.description}
             </p>
          </div>
       </div>

       <Container>
         {/* 2. Narrative Intro */}
         {info.story && (
            <div className="py-24 md:py-32 flex justify-center">
               <div className="max-w-2xl text-center space-y-6">
                  <span className="w-px h-12 bg-primary/20 mx-auto block" />
                  <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-primary/80">
                    "{info.story}"
                  </p>
                  <span className="w-px h-12 bg-primary/20 mx-auto block" />
               </div>
            </div>
         )}

         {/* 3. Asymmetrical/Mixed Grid */}
         {/* Using a layout that breaks the monotony of a standard grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 lg:gap-8 items-start">
            
            {products.map((product, idx) => {
               // Logic to vary span and offsets for an "editorial" feel
               // Pattern: 
               // 0: Col-span-4 (Left)
               // 1: Col-span-6 (Right, offset down)
               // 2: Col-span-4 (Center)
               // ... simplistic modulation
               
               const isLarge = idx % 3 === 1;
               const isCenter = idx % 3 === 2;
               
               let colSpan = "lg:col-span-4";
               if (isLarge) colSpan = "lg:col-span-6 lg:col-start-7 lg:mt-24";
               if (isCenter) colSpan = "lg:col-span-4 lg:col-start-5";

               return (
                 <div key={product.id} className={`${colSpan}`}>
                    <ProductCard product={product} />
                 </div>
               );
            })}
         </div>

         {products.length === 0 && (
            <div className="py-24 text-center">
                <p className="text-secondary">Collection inventory updating...</p>
            </div>
         )}

       </Container>
    </div>
  );
}
