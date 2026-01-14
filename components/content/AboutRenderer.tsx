"use client";

import { AboutBlock, AboutPage } from "@/lib/content-types";
import Image from "next/image";

export function AboutRenderer({ data }: { data: AboutPage | null }) {
  if (!data) return null;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        {/* Fallback pattern or image */}
        <div className="absolute inset-0 bg-gray-900">
          {data.hero.imageUrl && (
            <Image
              src={data.hero.imageUrl}
              alt={data.hero.title}
              fill
              className="object-cover opacity-60"
            />
          )}
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            {data.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide max-w-2xl mx-auto">
            {data.hero.subtitle}
          </p>
        </div>
      </div>

      {/* Blocks */}
      <div className="py-20">
        {data.blocks.map((block, idx) => (
          <Block key={idx} block={block} />
        ))}
      </div>
    </div>
  );
}

function Block({ block }: { block: AboutBlock }) {
  switch (block.type) {
    case "text":
      return (
        <section className="max-w-3xl mx-auto px-6 py-12 text-center">
          {block.heading && (
            <h2 className="text-3xl font-serif text-gray-900 mb-6">
              {block.heading}
            </h2>
          )}
          {block.body && (
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {block.body}
            </p>
          )}
        </section>
      );

    case "stats":
      return (
        <section className="bg-primary/5 py-20 my-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {block.items?.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl md:text-5xl font-serif text-primary mb-2">
                    {item.value}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-gray-500 font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    // Add 'image_split' implementation if needed later, seeded data currently just has 'text' and 'stats'
    // But adding a basic fallback
    default:
      return null;
  }
}
