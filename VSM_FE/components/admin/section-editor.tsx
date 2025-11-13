"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Trash2, Image, Type, Palette } from "lucide-react";

interface SectionConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface SectionEditorProps {
  section: SectionConfig;
  onSave: (config: Record<string, any>) => void;
  onClose: () => void;
}

// Section-specific configuration templates
const SECTION_TEMPLATES = {
  HeroSection: {
    title: {
      type: "text",
      label: "Tiêu đề 1",
      default: "CHUNG KẾT",
    },
    subtitle: {
      type: "text",
      label: "Tiêu đề 2",
      default: "VIETNAM STUDENT MARATHON 2025",
    },
    subtitle1: {
      type: "text",
      label: "Tiêu đề 3",
      default: "VIETNAM STUDENT MARATHON 2025",
    },
    backgroundImage: {
      type: "text",
      label: "Background Image URL",
      default: "/img/image1.jpg",
    },
    date: {
      type: "text",
      label: "Ngày thi đấu",
      default: "28/12/2025",
    },
    location: {
      type: "text",
      label: "ĐỊA ĐIỂM",
      default: "Khu đô thị Sala, TP. Thủ Đức, TP.HCM",
    },
    logo: {
      type: "text",
      label: "Đơn vị tổ chức",
      default: "/img/logo-vsm.png",
    },
    primaryButtonText: {
      type: "text",
      label: "Tên nút chính",
      default: "Tham gia sự kiện",
    },
    showAnimations: {
      type: "boolean",
      label: "Show Animations",
      default: true,
    },
  },
  AboutSection: {
    title: {
      type: "text",
      label: "Tiêu đề giới thiệu",
      default: "Giới thiệu về",
    },
    title1: { type: "text", label: "Tiêu đề màu", default: "VSM" },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "VSM không chỉ là một giải chạy thường niên dành cho học sinh, sinh viên, mà còn là sân chơi của những bạn trẻ đam mê chạy bộ từ các trường đại học như: ĐH Kinh tế TP.HCM, UEF, ĐH Sư phạm, ĐH Văn Lang,… Đây là nơi bạn không chỉ thử sức qua từng cự ly chạy – mỗi cự ly là một thử thách, một cơ hội để bứt phá giới hạn bản thân – mà còn được rèn luyện ý chí, nâng cao sức khỏe và kết nối cộng đồng.",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-gradient-to-b from-background to-muted/20",
    },
  },
  EventsSection: {
    title: { type: "text", label: "Tiêu đề", default: "Sự kiện" },
    title1: { type: "text", label: "Tiêu đề màu", default: "sắp tới" },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "Tham gia các sự kiện chạy bộ hấp dẫn được tổ chức bởi VSM. Cùng nhau tạo nên những kỷ niệm đáng nhớ!",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-muted/20",
    },
    showViewAllButton: {
      type: "boolean",
      label: "Show 'View All' Button",
      default: true,
    },
  },
  NewsSection: {
    title: {
      type: "text",
      label: "Tiêu đề",
      default: "Tin tức mới nhất",
    },
    title1: {
      type: "text",
      label: "Tiêu đề màu",
      default: "Tin tức mới nhất",
    },
    description: {
      type: "textarea",
      label: "Description",
      default: "Cập nhật kiến thức và hoạt động mới nhất từ cộng đồng VSM.",
    },
    postsPerRow: {
      type: "number",
      label: "Posts Per Row",
      default: 3,
      min: 1,
      max: 4,
    },
    showViewAllButton: {
      type: "boolean",
      label: "Show 'View All' Button",
      default: true,
    },
  },
  TeamSection: {
    title: { type: "text", label: "Section Title", default: "Đội ngũ VSM" },
    description: {
      type: "textarea",
      label: "Description",
      default: "Gặp gỡ những gương mặt tiêu biểu đồng hành cùng chúng tôi.",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-muted/20",
    },
    membersPerRow: {
      type: "number",
      label: "Members Per Row",
      default: 4,
      min: 2,
      max: 6,
    },
  },
  GallerySection: {
    title: {
      type: "text",
      label: "Section Title",
      default: "Khoảnh khắc đáng nhớ",
    },
    autoPlay: { type: "boolean", label: "Auto Play Slideshow", default: false },
    showControls: {
      type: "boolean",
      label: "Show Navigation Controls",
      default: true,
    },
  },
  CTASection: {
    title: {
      type: "text",
      label: "Section Title",
      default: "Sẵn sàng bứt phá?",
    },
    description: {
      type: "textarea",
      label: "Description",
      default:
        "Đăng ký ngay để tham gia sự kiện chạy bộ cùng cộng đồng sinh viên trên toàn quốc!",
    },
    buttonText: { type: "text", label: "Button Text", default: "Đăng ký ngay" },
    backgroundColor: {
      type: "text",
      label: "Background Color",
      default: "bg-gradient-to-r from-primary/20 to-purple-500/20",
    },
  },
  AboutFeatures: {
    features: {
      type: "array",
      label: "Tính năng nổi bật",
      default: [
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
      ],
    },
    customClasses: {
      type: "text",
      label: "Custom CSS Classes",
      default: "",
    },
  },
  CountdownTimer: {
    eventDate: {
      type: "text",
      label: "Ngày giờ sự kiện (ISO)",
      default: "2025-12-28T04:30:00",
    },
    customClasses: {
      type: "text",
      label: "Custom CSS Classes",
      default: "",
    },
  },
  SportsCommunityStory: {
    subtitle: {
      type: "text",
      label: "Tiêu đề phụ",
      default: "Hành Trình của CHÚNG TỐI",
    },
    title: {
      type: "text",
      label: "Tiêu đề chính",
      default: "CÂU CHUYỆN VSM",
    },
    paragraph1: {
      type: "textarea",
      label: "Đoạn văn 1",
      default:
        "🏃‍♂️Được thành lập từ năm 2023, Vietnam Student Marathon (VSM) ra đời với khát vọng tạo nên một môi trường nơi học sinh, sinh viên có thể rèn luyện ý chí, vượt qua giới hạn bản thân thông qua chạy bộ – một hành trình đơn giản nhưng đầy thử thách và cảm hứng.",
    },
    paragraph2: {
      type: "textarea",
      label: "Đoạn văn 2",
      default:
        "🔥 Câu chuyện ý chí của tuổi trẻ Việt Nam bắt đầu rực cháy qua từng bước chạy và nhịp tim của hàng trăm sinh viên tham gia VSM. Từ những giải chạy đầu tiên với quy mô nhỏ, VSM đã phát triển thành một cộng đồng lớn mạnh, nơi quy tụ những người trẻ cùng niềm đam mê, cùng khát vọng bứt phá chính mình.",
    },
    paragraph3: {
      type: "textarea",
      label: "Đoạn văn 3",
      default:
        "🏃 VSM không chỉ đơn thuần là một sự kiện thể thao – mà còn là một hành trình trưởng thành. Từng bước chạy là một tuyên ngôn mạnh mẽ, là cách mà chúng ta – một thế hệ trẻ #GenZ – chinh phục những khối kiến thức, vượt qua thách thức cuộc sống bằng trí tuệ, kỷ luật và lòng kiên định.",
    },
    paragraph4: {
      type: "textarea",
      label: "Đoạn văn 4",
      default:
        "Chúng tôi tự hào khi VSM đã trở thành sân chơi thường niên uy tín, lan tỏa tinh thần thể thao và lối sống tích cực trong giới trẻ. Trong tương lai, VSM tiếp tục mở rộng quy mô, truyền cảm hứng đến nhiều sinh viên hơn nữa, và cùng nhau xây dựng một cộng đồng mạnh mẽ, văn minh và đầy khát vọng.",
    },
    image: {
      type: "text",
      label: "Hình ảnh",
      default: "img/image1.jpg",
    },
    statsValue: {
      type: "text",
      label: "Số liệu thống kê",
      default: "5000+",
    },
    statsLabel: {
      type: "text",
      label: "Nhãn thống kê",
      default: "Members",
    },
    customClasses: {
      type: "text",
      label: "Custom CSS Classes",
      default: "",
    },
  },
  Stats: {
    stats: {
      type: "array",
      label: "Thống kê",
      default: [
        {
          label: "Sinh viên tham gia qua các mùa",
          value: "1,000+",
          icon: "Users",
        },
        {
          label: "Trường đại học – cao đẳng đồng hành",
          value: "50+",
          icon: "Calendar",
        },
        {
          label: "Mùa giải đã tổ chức thành công liên tiếp từ năm 2023",
          value: "4",
          icon: "MapPin",
        },
        {
          label: "Cộng đồng chạy bộ sinh viên lớn nhất tại Việt Nam",
          value: "1",
          icon: "Award",
        },
      ],
    },
    customClasses: {
      type: "text",
      label: "Custom CSS Classes",
      default: "",
    },
  },
};

export function SectionEditor({
  section,
  onSave,
  onClose,
}: SectionEditorProps) {
  const [config, setConfig] = useState(section.config || {});
  const [activeTab, setActiveTab] = useState("content");

  const template =
    SECTION_TEMPLATES[section.component as keyof typeof SECTION_TEMPLATES] ||
    {};

  useEffect(() => {
    // Initialize config with default values if not set
    const initialConfig = { ...config };
    Object.entries(template).forEach(([key, field]) => {
      if (!(key in initialConfig)) {
        initialConfig[key] = field.default;
      }
    });
    setConfig(initialConfig);
  }, [section.component]);

  const handleSave = () => {
    onSave(config);
  };

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (key: string, field: any) => {
    const value = config[key] ?? field.default;

    switch (field.type) {
      case "datetime-local":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              type="datetime-local"
              value={value ? value.substring(0, 16) : ""}
              onChange={(e) => {
                updateConfig(key, e.target.value);
              }}
              placeholder={field.default}
            />
            {key === "eventDate" && value && (
              <div className="text-xs text-muted-foreground mt-1">
                <span>
                  ISO:{" "}
                  {new Date(value).toISOString().slice(0, 19).replace("T", " ")}
                </span>
              </div>
            )}
          </div>
        );
      case "text":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              value={value || ""}
              onChange={(e) => updateConfig(key, e.target.value)}
              placeholder={field.default}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Textarea
              id={key}
              value={value || ""}
              onChange={(e) => updateConfig(key, e.target.value)}
              placeholder={field.default}
              rows={3}
            />
          </div>
        );

      case "boolean":
        return (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={key}>{field.label}</Label>
            <Switch
              id={key}
              checked={value || false}
              onCheckedChange={(checked) => updateConfig(key, checked)}
            />
          </div>
        );
      case "number":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Input
              id={key}
              type="number"
              value={value || field.default}
              onChange={(e) => updateConfig(key, parseInt(e.target.value))}
              min={field.min}
              max={field.max}
            />
          </div>
        );
      case "array":
        return (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{field.label}</Label>
            <Textarea
              id={key}
              value={JSON.stringify(value || field.default, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateConfig(key, parsed);
                } catch (error) {
                  // Keep the invalid JSON in the textarea for user to fix
                }
              }}
              placeholder="Enter JSON array"
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Edit the JSON array above. Make sure it's valid JSON format.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Edit {section.name}</span>
            <Badge variant="outline">{section.component}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="styling" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Styling
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      field.type === "text" ||
                      field.type === "textarea" ||
                      field.type === "boolean"
                  )
                  .map(([key, field]) => renderField(key, field))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Styling Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      key.includes("background") ||
                      key.includes("color") ||
                      field.type === "number"
                  )
                  .map(([key, field]) => renderField(key, field))}

                <Separator />

                <div className="space-y-2">
                  <Label>Custom CSS Classes</Label>
                  <Input
                    value={config.customClasses || ""}
                    onChange={(e) =>
                      updateConfig("customClasses", e.target.value)
                    }
                    placeholder="Enter custom CSS classes"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add custom Tailwind CSS classes for additional styling
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(template)
                  .filter(
                    ([key, field]) =>
                      key.includes("image") ||
                      key.includes("Image") ||
                      key.includes("media")
                  )
                  .map(([key, field]) => renderField(key, field))}

                <Separator />

                <div className="space-y-2">
                  <Label>Additional Images</Label>
                  <div className="space-y-2">
                    {(config.additionalImages || []).map(
                      (image: string, index: number) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const images = [
                                ...(config.additionalImages || []),
                              ];
                              images[index] = e.target.value;
                              updateConfig("additionalImages", images);
                            }}
                            placeholder="Image URL"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const images = [
                                ...(config.additionalImages || []),
                              ];
                              images.splice(index, 1);
                              updateConfig("additionalImages", images);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const images = [...(config.additionalImages || []), ""];
                        updateConfig("additionalImages", images);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
