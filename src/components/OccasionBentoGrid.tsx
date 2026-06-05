"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { catalogImage } from "@/lib/productImages";

const BENTO_ITEMS = [
  {
    key: "valentines",
    title: "Valentine's",
    subtitle: "Red & pink bears that say I love you",
    href: "/shop?occasion=Valentine's",
    image: catalogImage(6),
    className:
      "col-span-2 row-span-2 min-h-[240px] md:min-h-[320px]",
  },
  {
    key: "birthday",
    title: "Birthdays",
    subtitle: "Celebrate their special day",
    href: "/shop?occasion=Birthday",
    image: catalogImage(2),
    className: "col-span-1 row-span-1 min-h-[160px] md:min-h-[150px]",
  },
  {
    key: "anniversary",
    title: "Anniversaries",
    subtitle: "Timeless romantic gifts",
    href: "/shop?occasion=Anniversary",
    image: catalogImage(16),
    className: "col-span-1 row-span-1 min-h-[160px] md:min-h-[150px]",
  },
  {
    key: "giant",
    title: "Giant Bears",
    subtitle: "Go big — life-size hugs",
    href: "/shop?size=Giant",
    image: catalogImage(12),
    className: "col-span-2 row-span-1 min-h-[180px]",
  },
] as const;

export default function OccasionBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4">
      {BENTO_ITEMS.map((item, i) => (
        <motion.div
          key={item.key}
          className={item.className}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={item.href}
            className="group relative block h-full min-h-[inherit] overflow-hidden rounded-3xl shadow-card hover:shadow-elevated transition-all duration-500 hover:scale-[1.01] ring-1 ring-black/[0.04]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 text-white">
              <span className="inline-flex items-center gap-1 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-blush mb-1">
                Shop
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <h3 className="font-display text-lg md:text-2xl font-medium">{item.title}</h3>
              <p className="text-xs md:text-sm text-white/85 mt-0.5">{item.subtitle}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
