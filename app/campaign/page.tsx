import Image from "next/image";
import Link from "next/link";
import HorizontalScroll from "@/components/brand/HorizontalScroll";
import { getCollections, getProductsByCollection } from "@/lib/data";

export const metadata = {
    title: "The Campaign | Rokomferi",
    description:
        "Explore the latest collections through our cinematic digital lookbook.",
};

export default async function CampaignPage() {
    const collections = await getCollections();

    if (!collections || collections.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas">
                <p className="font-utility text-sm uppercase tracking-widest opacity-40">
                    The new campaign is coming soon.
                </p>
            </div>
        );
    }

    const collectionsWithProducts = await Promise.all(
        collections.map(async (col) => {
            const products = await getProductsByCollection(col.slug);
            return { ...col, products };
        })
    );

    return (
        // ⚠️ NO overflow-x-hidden here — it breaks position:sticky
        <div className="bg-canvas">
            {/* SECTION 1: Cinematic Hero */}
            <div className="h-screen relative flex items-center justify-center overflow-hidden">
                <Image
                    src={
                        collections[0]?.image && collections[0].image.trim() !== ""
                            ? collections[0].image
                            : "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=3386&auto=format&fit=crop"
                    }
                    alt="Campaign Hero"
                    fill
                    priority
                    className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 text-center space-y-4">
                    <p className="font-utility text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/60 mb-8">
                        Rokomferi Digital Editorial
                    </p>
                    <h1 className="font-display text-7xl md:text-[10rem] text-white leading-[0.85] tracking-tight drop-shadow-2xl">
                        THE
                        <br />
                        CAMPAIGN
                    </h1>
                </div>
            </div>

            {/* Dynamic Collection Sections — each HorizontalScroll is its own section */}
            {collectionsWithProducts.map((collection, idx) => (
                <HorizontalScroll key={collection.id} className="gap-12 pl-12 md:pl-32">
                    {/* Collection Title Card */}
                    <div className="relative h-[60vh] w-[400px] md:w-[600px] flex flex-col justify-end shrink-0 pb-12">
                        <span className="font-utility text-xs text-primary/40 uppercase tracking-[0.3em] mb-4">
                            Collection {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <h2 className="font-display text-6xl md:text-[7rem] leading-[0.9] text-primary uppercase">
                            {collection.title.split(" ").map((word: string, i: number) => (
                                <span key={i} className="block">
                                    {word}
                                </span>
                            ))}
                        </h2>
                    </div>

                    {/* Product Images */}
                    {collection.products.map((product: any, pIdx: number) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group relative h-[60vh] w-[300px] md:w-[450px] shrink-0 bg-neutral-800"
                        >
                            <Image
                                src={
                                    product.images &&
                                        product.images[0] &&
                                        product.images[0].trim() !== ""
                                        ? product.images[0]
                                        : "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1080&auto=format&fit=crop"
                                }
                                alt={product.name}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <span className="absolute -bottom-10 left-0 font-utility text-xs text-primary uppercase tracking-widest">
                                Look {pIdx + 1 < 10 ? `0${pIdx + 1}` : pIdx + 1}
                            </span>
                        </Link>
                    ))}

                    {/* End Card */}
                    <div className="relative h-[60vh] w-[400px] flex items-center justify-center shrink-0">
                        <p className="font-utility text-xs tracking-widest text-neutral-500 uppercase">
                            End of Collection
                        </p>
                    </div>
                </HorizontalScroll>
            ))}

            {/* Outro */}
            <div className="h-[50vh] flex flex-col items-center justify-center bg-canvas">
                <Link
                    href="/shop"
                    className="font-utility text-sm uppercase tracking-widest hover:opacity-60 transition-opacity"
                >
                    Explore the Collection
                </Link>
            </div>
        </div>
    );
}
