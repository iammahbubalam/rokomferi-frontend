import { getCollections } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="bg-main min-h-screen pb-24">
      <Container>
        {/* Header */}
        <div className="pt-12 pb-16 md:pt-20 md:pb-24 text-center max-w-2xl mx-auto space-y-6">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary">
              The Collections
           </h1>
           <p className="text-secondary tracking-wide font-light md:text-lg">
              Curated edits of timeless elegance. Each collection tells a story of heritage, craftsmanship, and modern grace.
           </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {collections.map((collection, index) => (
            <Link 
              href={`/collection/${collection.slug}`} 
              key={collection.id}
              className={`group block relative ${
                 /* Make the first item full width if odd number or just distinct layout? 
                    Let's keep simple 2 cols for now, maybe alternate layouts later.
                    Actually, making the 3rd item span 2 cols looks cool if there's 3 items.
                 */
                 index === collections.length - 1 && collections.length % 2 !== 0 ? "md:col-span-2 md:w-3/4 md:mx-auto" : ""
              }`}
            >
              <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm bg-gray-100">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-serif text-lg">
                    No Image
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="mt-6 md:mt-8 space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-accent-gold font-medium">Edit 2026</span>
                   <div className="h-px w-8 bg-accent-gold/30"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-primary group-hover:text-accent-gold transition-colors duration-300">
                  {collection.title}
                </h2>
                <p className="text-secondary text-sm md:text-base line-clamp-2 max-w-md mx-auto md:mx-0">
                  {collection.description}
                </p>
                <div className="pt-4">
                  <span className="inline-block border-b border-primary/30 pb-0.5 text-xs uppercase tracking-widest group-hover:border-accent-gold group-hover:text-accent-gold transition-all">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {collections.length === 0 && (
             <div className="col-span-full py-20 text-center">
                <p className="text-secondary text-lg">No collections found.</p>
             </div>
          )}
        </div>
      </Container>
    </div>
  );
}
