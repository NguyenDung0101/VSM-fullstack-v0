"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  backgroundColor?: string;
  customClasses?: string;
}

export function CTASection({
  title = "Sẵn sàng bứt phá?",
  description = "Đăng ký ngay để tham gia sự kiện chạy bộ cùng cộng đồng sinh viên trên toàn quốc!",
  buttonText = "Đăng ký ngay",
  backgroundColor = "bg-gradient-to-r from-primary/20 to-purple-500/20",
  customClasses = "",
}: CTASectionProps = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className={`py-20 ${backgroundColor} ${customClasses}`}>
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {title.split(/(\s+)/).map((word, i) =>
              word === "bứt phá?" ? (
                <span key={i} className="gradient-text">
                  {word}
                </span>
              ) : (
                word
              )
            )}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">{description}</p>
          <Button size="lg" asChild className="px-8 py-4">
            <Link href="/events">
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
