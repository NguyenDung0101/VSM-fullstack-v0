"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Trophy, Heart } from "lucide-react";
import SportsCommunityStory from "@/components/home/SportsCommunityStory";

const ICON_MAP = { Target, Users, Trophy, Heart };

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface AboutFeaturesProps {
  features?: Feature[];
  customClasses?: string;
}

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: "Target",
    title: "Mục tiêu rõ ràng",
    description:
      "Xây dựng cộng đồng chạy bộ sinh viên mạnh mẽ và bền vững tại Việt Nam.",
  },
  {
    icon: "Users",
    title: "Cộng đồng đoàn kết",
    description:
      "Kết nối hàng nghìn sinh viên có cùng đam mê chạy bộ trên khắp cả nước.",
  },
  {
    icon: "Trophy",
    title: "Thành tựu xuất sắc",
    description:
      "Tổ chức thành công nhiều giải chạy lớn với sự tham gia của hàng nghìn vận động viên.",
  },
  {
    icon: "Heart",
    title: "Tinh thần thể thao",
    description:
      "Lan tỏa tinh thần thể thao, sức khỏe và lối sống tích cực trong giới trẻ.",
  },
];

const AboutFeatures = ({
  features = DEFAULT_FEATURES,
  customClasses = "",
}: AboutFeaturesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <div ref={ref} className={`container mx-auto px-4 ${customClasses}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon =
            ICON_MAP[feature.icon as keyof typeof ICON_MAP] || Target;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 glass">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutFeatures;
