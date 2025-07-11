"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Member {
  id: string
  name: string
  role: string
  avatar: string
}

const members: Member[] = [
  { id: "1", name: "Nguyễn Văn A", role: "Huấn luyện viên trưởng", avatar: "/placeholder.svg?height=200&width=200" },
  { id: "2", name: "Trần Thị B", role: "Chuyên gia dinh dưỡng", avatar: "/placeholder.svg?height=200&width=200" },
  { id: "3", name: "Lê Văn C", role: "Đại sứ VSM", avatar: "/placeholder.svg?height=200&width=200" },
  { id: "4", name: "Phạm Thị D", role: "Chuyên gia vật lý trị liệu", avatar: "/placeholder.svg?height=200&width=200" },
]

export function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Đội ngũ <span className="gradient-text">VSM</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Gặp gỡ những gương mặt tiêu biểu đồng hành cùng chúng tôi.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="glass hover:shadow-lg transition-shadow">
                <img src={m.avatar || "/placeholder.svg"} alt={m.name} className="w-full h-48 object-cover" />
                <CardHeader className="text-center">
                  <CardTitle>{m.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">{m.role}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
