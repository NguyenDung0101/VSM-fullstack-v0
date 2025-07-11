"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const images = [
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
  "/placeholder.svg?height=600&width=800",
]

export function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const next = () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Khoảnh khắc <span className="gradient-text">đáng nhớ</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="aspect-video rounded-xl overflow-hidden">
            <Image src={images[index] || "/placeholder.svg"} alt="Gallery" fill className="object-cover" />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur hover:bg-background/90"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur hover:bg-background/90"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
