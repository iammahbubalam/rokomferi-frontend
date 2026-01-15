"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  Image as ImageIcon,
  LayoutTemplate,
  CheckCircle,
  Clock,
  ArrowRight,
  Settings,
} from "lucide-react";
import { HeroEditor } from "@/components/admin/content/HeroEditor";
import { FooterEditor } from "@/components/admin/content/FooterEditor";
import { AboutEditor } from "@/components/admin/content/AboutEditor";
import { PolicyEditor } from "@/components/admin/content/PolicyEditor";
import { GlobalSettingsEditor } from "@/components/admin/content/GlobalSettingsEditor";
import { getApiUrl } from "@/lib/utils";
import { format } from "date-fns";

type ContentType =
  | "hero"
  | "footer"
  | "about"
  | "shipping"
  | "return"
  | "global"
  | null;

interface ContentMeta {
  key: string;
  updatedAt: string;
  itemCount: number;
}

export default function ContentPage() {
  const [activeEditor, setActiveEditor] = useState<ContentType>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<Record<string, ContentMeta>>({});

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [
          heroRes,
          footerRes,
          aboutRes,
          shippingRes,
          returnRes,
          globalRes,
        ] = await Promise.all([
          fetch(getApiUrl("/content/home_hero"), { cache: "no-store" }),
          fetch(getApiUrl("/content/home_footer"), { cache: "no-store" }),
          fetch(getApiUrl("/content/content_about"), { cache: "no-store" }),
          fetch(getApiUrl("/content/policy_shipping"), { cache: "no-store" }),
          fetch(getApiUrl("/content/policy_return"), { cache: "no-store" }),
          fetch(getApiUrl("/content/settings_global"), { cache: "no-store" }),
        ]);

        const newMeta: Record<string, ContentMeta> = {};

        if (heroRes.ok) {
          const data = await heroRes.json();
          newMeta["hero"] = {
            key: "home_hero",
            updatedAt: data.updatedAt,
            itemCount: data.content?.slides?.length || 0,
          };
        }

        if (footerRes.ok) {
          const data = await footerRes.json();
          newMeta["footer"] = {
            key: "home_footer",
            updatedAt: data.updatedAt,
            itemCount: data.content?.sections?.length || 0,
          };
        }

        if (aboutRes.ok) {
          const data = await aboutRes.json();
          newMeta["about"] = {
            key: "content_about",
            updatedAt: data.updatedAt,
            itemCount: data.content?.blocks?.length || 0,
          };
        }

        if (shippingRes.ok) {
          const data = await shippingRes.json();
          newMeta["shipping"] = {
            key: "policy_shipping",
            updatedAt: data.updatedAt,
            itemCount: data.content?.sections?.length || 0,
          };
        }

        if (returnRes.ok) {
          const data = await returnRes.json();
          newMeta["return"] = {
            key: "policy_return",
            updatedAt: data.updatedAt,
            itemCount: data.content?.sections?.length || 0,
          };
        }

        if (globalRes.ok) {
          const data = await globalRes.json();
          newMeta["global"] = {
            key: "settings_global",
            updatedAt: data.updatedAt,
            itemCount: 4,
          };
        }

        setMeta(newMeta);
      } catch (e) {
        console.error("Failed to fetch content metadata", e);
      } finally {
        setLoading(false);
      }
    }
    fetchMeta();
  }, [activeEditor]);

  const sections = [
    {
      id: "hero",
      title: "Hero Banners",
      subtitle: "Main Homepage Slider",
      description:
        "Manage high-impact visuals, headlines, and call-to-actions for the home page landing area.",
      icon: ImageIcon,
      path: "/admin/content/hero",
      metaKey: "hero",
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "footer",
      title: "Footer Navigation",
      subtitle: "Site-wide Footer",
      description:
        "Organize footer columns, links, and navigation structure across the entire website.",
      icon: LayoutTemplate,
      path: "/admin/content/footer",
      metaKey: "footer",
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "about",
      title: "About Page",
      subtitle: "/about",
      description:
        "Manage the brand story, stats, and editorial content blocks.",
      icon: CheckCircle,
      path: "/admin/content/about",
      metaKey: "about",
      color: "bg-amber-50 text-amber-600",
    },

    {
      id: "shipping",
      title: "Shipping Policy",
      subtitle: "/shipping",
      description:
        "Manage delivery areas, timelines, and shipping costs information.",
      icon: Clock,
      path: "/admin/content/shipping",
      metaKey: "shipping",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "return",
      title: "Return Policy",
      subtitle: "/return",
      description: "Manage return windows, conditions, and exchange processes.",
      icon: ArrowRight,
      path: "/admin/content/return",
      metaKey: "return",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Content Management
        </h1>
        <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
          Control the dynamic aspects of your storefront. Updates made here are
          reflected immediately on the live site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          const sectionMeta = meta[section.metaKey];

          return (
            <div
              key={section.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 items-start relative z-10">
                <div
                  className={`p-4 rounded-2xl ${section.color} shrink-0 ring-1 ring-black/5`}
                >
                  <Icon className="w-8 h-8" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-none">
                      {section.title}
                    </h3>
                    {loading ? (
                      <div className="h-5 w-20 bg-gray-100 animate-pulse rounded-full" />
                    ) : sectionMeta ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {section.subtitle}
                  </p>

                  <p className="text-gray-600 text-sm leading-relaxed max-w-lg">
                    {section.description}
                  </p>

                  <div className="flex items-center gap-6 pt-2 text-xs text-gray-400 font-medium">
                    {loading ? (
                      <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
                    ) : sectionMeta ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                          {sectionMeta.itemCount} Items
                        </div>
                        {sectionMeta.updatedAt && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            Updated{" "}
                            {format(
                              new Date(sectionMeta.updatedAt),
                              "MMM d, yyyy • h:mm a"
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <span>No content found</span>
                    )}
                  </div>
                </div>

                <div className="self-start md:self-center shrink-0">
                  <Button
                    onClick={() => setActiveEditor(section.id as ContentType)}
                    variant="secondary"
                    className="w-full md:w-auto"
                  >
                    Manage Content
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {activeEditor === "hero" && (
        <HeroEditor onClose={() => setActiveEditor(null)} />
      )}

      {activeEditor === "footer" && (
        <FooterEditor onClose={() => setActiveEditor(null)} />
      )}

      {activeEditor === "about" && (
        <AboutEditor onClose={() => setActiveEditor(null)} />
      )}

      {activeEditor === "shipping" && (
        <PolicyEditor
          title="Shipping Policy"
          policyKey="policy_shipping"
          onClose={() => setActiveEditor(null)}
        />
      )}

      {activeEditor === "return" && (
        <PolicyEditor
          title="Return Policy"
          policyKey="policy_return"
          onClose={() => setActiveEditor(null)}
        />
      )}
    </div>
  );
}
