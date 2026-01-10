import { getEditorialContent } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import Image from "next/image";

export const metadata = {
  title: "Editorial | Rokomferi",
  description: "Stories woven in silence."
};

export default async function EditorialPage() {
  const content = await getEditorialContent();

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-primary text-primary">
      <Container>
         <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <span className="text-secondary text-xs uppercase tracking-[0.3em]">{content.tagline}</span>
              <h1 className="font-serif text-5xl md:text-7xl text-primary">{content.title}</h1>
              <p className="text-lg md:text-xl font-light text-secondary/80 max-w-2xl mx-auto leading-relaxed">
                {content.description}
              </p>
            </div>

            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
               <Image
                 src={content.image}
                 alt={content.title}
                 fill
                 className="object-cover opacity-90"
                 priority
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left pt-12 border-t border-primary/10 w-full">
               <div>
                  <h3 className="font-serif text-2xl mb-4">The Craft</h3>
                  <p className="font-light text-secondary">
                    Every thread tells a story of patience. In a world of instant gratification, we choose the slow path. Our artisans spend weeks, sometimes months, on a single piece, ensuring that the legacy of Bengal's weaving heritage is preserved in every knot.
                  </p>
               </div>
               <div>
                  <h3 className="font-serif text-2xl mb-4">The Promise</h3>
                  <p className="font-light text-secondary">
                    We believe in clothing that transcends seasons. A Rokomferi piece is designed to be an heirloom, passed down through generations, carrying with it the memories of the celebrations it witnessed.
                  </p>
               </div>
            </div>
         </div>
      </Container>
    </div>
  );
}
