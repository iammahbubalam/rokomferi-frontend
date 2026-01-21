"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementData {
  message: string;
  linkText?: string;
  linkUrl?: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * AnnouncementBar - Site-wide promotional banner
 * L9: Renders above header, dismissible, respects server-side scheduling
 */
export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(
    null,
  );
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem("announcement_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Fetch active announcement
    const fetchAnnouncement = async () => {
      try {
        const res = await fetch(getApiUrl("/content/announcement_bar"));
        if (res.ok) {
          const data = await res.json();
          // Only show if isActive is true (server-side check already done)
          if (data.isActive && data.content?.message) {
            setAnnouncement({
              message: data.content.message,
              linkText: data.content.linkText,
              linkUrl: data.content.linkUrl,
              backgroundColor: data.content.backgroundColor || "#1a1a2e",
              textColor: data.content.textColor || "#ffffff",
            });
          }
        }
      } catch (err) {
        // Fail silently - announcement is non-critical
        console.debug("Failed to fetch announcement:", err);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("announcement_dismissed", "true");
  };

  // Don't render if dismissed or no announcement
  if (isDismissed || !announcement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
        style={{
          backgroundColor: announcement.backgroundColor,
          color: announcement.textColor,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center">
          <p className="text-sm font-medium text-center pr-8">
            {announcement.message}
            {announcement.linkText && announcement.linkUrl && (
              <>
                {" "}
                <Link
                  href={announcement.linkUrl}
                  className="underline hover:no-underline font-semibold ml-1 transition-colors"
                  style={{ color: announcement.textColor }}
                >
                  {announcement.linkText}
                </Link>
              </>
            )}
          </p>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss announcement"
            style={{ color: announcement.textColor }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
