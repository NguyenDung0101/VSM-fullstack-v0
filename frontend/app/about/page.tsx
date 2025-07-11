"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  Trophy,
  Heart,
  Award,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";

const stats = [
  { label: "Thành viên", value: "5,000+", icon: Users },
  { label: "Sự kiện", value: "50+", icon: Calendar },
  { label: "Thành phố", value: "20+", icon: MapPin },
  { label: "Giải thưởng", value: "15+", icon: Award },
];

const values = [
  {
    icon: Target,
    title: "Mục tiêu rõ ràng",
    description:
      "Xây dựng cộng đồng chạy bộ sinh viên mạnh mẽ và bền vững tại Việt Nam.",
  },
  {
    icon: Users,
    title: "Cộng đồng đoàn kết",
    description:
      "Kết nối hàng nghìn sinh viên có cùng đam mê chạy bộ trên khắp cả nước.",
  },
  {
    icon: Trophy,
    title: "Thành tựu xuất sắc",
    description:
      "Tổ chức thành công nhiều giải chạy lớn với sự tham gia của hàng nghìn vận động viên.",
  },
  {
    icon: Heart,
    title: "Tinh thần thể thao",
    description:
      "Lan tỏa tinh thần thể thao, sức khỏe và lối sống tích cực trong giới trẻ.",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Thành lập VSM",
    description:
      "Vietnam Student Marathon được thành lập với sứ mệnh kết nối cộng đồng chạy bộ sinh viên.",
  },
  {
    year: "2021",
    title: "Sự kiện đầu tiên",
    description:
      "Tổ chức thành công VSM Fun Run đầu tiên tại Hà Nội với 500 người tham gia.",
  },
  {
    year: "2022",
    title: "Mở rộng toàn quốc",
    description: "Phát triển hoạt động ra 10 thành phố lớn trên cả nước.",
  },
  {
    year: "2023",
    title: "VSM Marathon",
    description:
      "Tổ chức thành công VSM Marathon đầu tiên với hơn 2,000 vận động viên tham gia.",
  },
  {
    year: "2024",
    title: "Tương lai",
    description:
      "Tiếp tục phát triển và trở thành tổ chức chạy bộ sinh viên hàng đầu Đông Nam Á.",
  },
];

const team = [
  {
    name: "Phan Huỳnh Anh",
    role: "Founder & CEO",
    avatar: "/placeholder.svg?height=200&width=200",
    description:
      "10 năm kinh nghiệm trong lĩnh vực thể thao và tổ chức sự kiện.",
  },
  {
    name: "Dương Thế Khải",
    role: "Giám đốc Huấn luyện",
    avatar: "/placeholder.svg?height=200&width=200",
    description:
      "Chuyên gia dinh dưỡng thể thao và huấn luyện viên marathon chứng nhận quốc tế.",
  },
  {
    name: "Quách Thành Long",
    role: "Giám đốc Sự kiện",
    avatar: "/placeholder.svg?height=200&width=200",
    description:
      "Chuyên gia tổ chức sự kiện với hơn 8 năm kinh nghiệm trong ngành.",
  },
  {
    name: "Lã Phương Uyên",
    role: "Giám đốc Marketing",
    avatar: "/placeholder.svg?height=200&width=200",
    description:
      "Chuyên gia marketing digital và phát triển cộng đồng trực tuyến.",
  },
  {
    name: "Nguyễn Tuấn Dũng",
    role: "Lập trình viên chính",
    avatar: "/placeholder.svg?height=200&width=200",
    description:
      "Chuyên gia marketing digital và phát triển cộng đồng trực tuyến.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-purple-500/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Về <span className="gradient-text">VSM</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Vietnam Student Marathon - Nơi kết nối đam mê chạy bộ của sinh
                viên Việt Nam, xây dựng cộng đồng mạnh mẽ và lan tỏa tinh thần
                thể thao tích cực.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  VSM được thành lập với sứ mệnh kết nối và phát triển cộng đồng
                  chạy bộ sinh viên Việt Nam. Chúng tôi tin rằng thể thao không
                  chỉ giúp rèn luyện sức khỏe mà còn xây dựng tinh thần đoàn
                  kết, ý chí vượt khó và lối sống tích cực.
                </p>
                <p className="text-lg text-muted-foreground">
                  Thông qua các hoạt động chạy bộ, chúng tôi mong muốn tạo ra
                  một môi trường lành mạnh để sinh viên có thể phát triển bản
                  thân, kết bạn và cùng nhau vượt qua những thử thách trong cuộc
                  sống.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="public/img/events-icon.png"
                    alt="VSM Mission"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Toàn quốc</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 glass">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <value.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Hành trình phát triển</h2>
              <p className="text-xl text-muted-foreground">
                Từ những bước chân đầu tiên đến cộng đồng hàng nghìn thành viên
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}
                  >
                    <Card className="glass">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-primary text-white">
                            {item.year}
                          </Badge>
                          <CardTitle>{item.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="w-4 h-4 bg-primary rounded-full relative z-10">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                  </div>

                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold mb-6">Đội ngũ lãnh đạo</h2>
              <p className="text-xl text-muted-foreground">
                Những người đồng hành cùng VSM từ những ngày đầu
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="glass hover:shadow-lg transition-shadow text-center">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {member.name}
                      </h3>
                      <Badge variant="secondary" className="mb-3">
                        {member.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {member.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
