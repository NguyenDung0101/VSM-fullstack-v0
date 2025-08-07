"use client";

import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { HomepagePreview } from "@/components/admin/homepage-preview";
import { SectionEditor } from "@/components/admin/section-editor";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface SectionConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  config: Record<string, any>;
}

const AVAILABLE_SECTIONS = [
  { id: "hero", name: "Phần đầu trang", component: "HeroSection" },
  { id: "countdown", name: "Đếm ngược sự kiện", component: "CountdownTimer" },
  { id: "about", name: "Phần giới thiệu", component: "AboutSection" },
  {
    id: "aboutfeatures",
    name: "Tính năng nổi bật",
    component: "AboutFeatures",
  },
  { id: "stats", name: "Thống kê VSM", component: "Stats" },
  {
    id: "story",
    name: "Câu chuyện cộng đồng",
    component: "SportsCommunityStory",
  },
  {
    id: "events",
    name: "Hiển thị các sự kiện sắp tới",
    component: "EventsSection",
  },
  { id: "news", name: "Tin tức mới nhất", component: "NewsSection" },
  { id: "team", name: "Phần giới thiệu đội ngũ", component: "TeamSection" },
  {
    id: "gallery",
    name: "Phần hiển thị bộ sưu tập",
    component: "GallerySection",
  },
  { id: "cta", name: "Phần kêu gọi", component: "CTASection" },
];

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: "hero",
    name: "Phần đầu trang",
    component: "HeroSection",
    enabled: true,
    config: {},
  },
  {
    id: "countdown",
    name: "Đếm ngược sự kiện",
    component: "CountdownTimer",
    enabled: true,
    config: { eventDate: "2025-12-28T04:30:00" },
  },
  {
    id: "about",
    name: "Phần giới thiệu",
    component: "AboutSection",
    enabled: true,
    config: {},
  },
  {
    id: "stats",
    name: "Thống kê VSM",
    component: "Stats",
    enabled: true,
    config: {},
  },
  {
    id: "story",
    name: "Câu chuyện cộng đồng",
    component: "SportsCommunityStory",
    enabled: true,
    config: {},
  },
  {
    id: "events",
    name: "Hiển thị các sự kiện sắp tới",
    component: "EventsSection",
    enabled: true,
    config: {},
  },
  {
    id: "news",
    name: "Tin tức mới nhất",
    component: "NewsSection",
    enabled: true,
    config: {},
  },
  {
    id: "team",
    name: "Phần giới thiệu đội ngũ",
    component: "TeamSection",
    enabled: true,
    config: {},
  },
  {
    id: "gallery",
    name: "Phần hiển thị bộ sưu tập",
    component: "GallerySection",
    enabled: true,
    config: {},
  },
  {
    id: "cta",
    name: "Phần kêu gọi",
    component: "CTASection",
    enabled: true,
    config: {},
  },
];

export default function HomepageManagerPage() {
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);
  const [editingSection, setEditingSection] = useState<SectionConfig | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("manage");
  const [hasChanges, setHasChanges] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === "development");
    const saved = localStorage.getItem("homepage-config");
    if (saved) {
      try {
        setSections(JSON.parse(saved));
      } catch (error) {
        console.error("Không thể tải cấu hình đã lưu:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("homepage-config", JSON.stringify(sections));
  }, [sections]);

  const handleReorder = (newSections: SectionConfig[]) => {
    setSections(newSections);
    setHasChanges(true);
    toast.success("Đã sắp xếp lại các phần");
  };

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
    setHasChanges(true);
    toast.success("Đã cập nhật trạng thái hiển thị của phần");
  };

  const addSection = (sectionType: string) => {
    const template = AVAILABLE_SECTIONS.find((s) => s.id === sectionType);
    if (!template) return;

    const newSection: SectionConfig = {
      id: `${sectionType}-${Date.now()}`,
      name: template.name,
      component: template.component,
      enabled: true,
      config: {},
    };

    setSections((prev) => [...prev, newSection]);
    setHasChanges(true);
    toast.success("Đã thêm phần mới");
  };

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
    setHasChanges(true);
    toast.success("Đã xóa phần");
  };

  const updateSection = (id: string, config: Record<string, any>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, config } : section
      )
    );
    setHasChanges(true);
    setEditingSection(null);
    toast.success("Đã cập nhật nội dung thành công");
  };

  const saveToFile = async () => {
    try {
      const enabledSections = sections.filter((s) => s.enabled);

      const imports = enabledSections
        .map(
          (section) =>
            `import { ${
              section.component
            } } from "@/components/home/${section.component
              .toLowerCase()
              .replace("section", "-section")}"`
        )
        .join("\n");

      const sectionComponents = enabledSections
        .map((section) => {
          const config =
            section.config && Object.keys(section.config).length > 0
              ? ` {...${JSON.stringify(section.config)}}`
              : "";
          return `        <${section.component}${config} />`;
        })
        .join("\n");

      const fileContent = `import { Navbar } from "@/components/layout/navbar"
${imports}
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
${sectionComponents}
      </main>
      <Footer />
    </div>
  )
}`;

      const response = await fetch("/api/admin/save-homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: fileContent }),
      });

      if (response.ok) {
        setHasChanges(false);
        toast.success("Đã lưu trang chủ thành công!");
      } else {
        throw new Error("Không thể lưu");
      }
    } catch (error) {
      toast.error("Không thể lưu trang chủ. Sử dụng bộ nhớ tạm cho demo.");
      setHasChanges(false);
    }
  };

  const resetToDefault = () => {
    setSections(DEFAULT_SECTIONS);
    setHasChanges(true);
    toast.success("Đã đặt lại về cấu hình mặc định");
  };

  if (!isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Chỉ dành cho chế độ phát triển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trình quản lý trang chủ chỉ khả dụng trong chế độ phát triển vì lý
              do bảo mật.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <div className="min-h-screen bg-background">
            <div className="border-b bg-card px-[65px]">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Quản lý Trang chủ</h1>
                    <p className="text-muted-foreground">
                      Quản lý các phần của trang chủ bằng cách kéo thả
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {hasChanges && (
                      <Badge variant="secondary" className="mr-2">
                        Có thay đổi chưa lưu
                      </Badge>
                    )}
                    <Button variant="outline" onClick={resetToDefault}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Đặt lại
                    </Button>
                    <Button onClick={saveToFile} disabled={!hasChanges}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto pl-20 pr-4 py-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manage">Quản lý các phần</TabsTrigger>
                  <TabsTrigger value="preview">Xem trước trực tiếp</TabsTrigger>
                </TabsList>

                <TabsContent value="manage" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          Các phần hiện tại
                        </h2>
                        <div className="text-sm text-muted-foreground">
                          Kéo để sắp xếp • Nhấn để chỉnh sửa
                        </div>
                      </div>

                      <Reorder.Group
                        axis="y"
                        values={sections}
                        onReorder={handleReorder}
                        className="space-y-3"
                      >
                        {sections.map((section) => (
                          <Reorder.Item
                            key={section.id}
                            value={section}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <Card
                              className={`${
                                section.enabled ? "bg-card" : "bg-muted/50"
                              } hover:shadow-md transition-shadow`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">
                                        {section.name}
                                      </h3>
                                      <Badge
                                        variant={
                                          section.enabled
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {section.enabled ? "Đã bật" : "Đã tắt"}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {section.component}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => toggleSection(section.id)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingSection(section)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeSection(section.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Thêm phần</h2>
                      <div className="space-y-2">
                        {AVAILABLE_SECTIONS.map((section) => (
                          <Button
                            key={section.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => addSection(section.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {section.name}
                          </Button>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h3 className="font-medium mb-2">Hướng dẫn sử dụng</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Kéo các phần để sắp xếp lại</li>
                          <li>• Bật/tắt hiển thị bằng biểu tượng con mắt</li>
                          <li>• Chỉnh sửa nội dung bằng biểu tượng bút</li>
                          <li>• Xóa phần bằng biểu tượng thùng rác</li>
                          <li>
                            • Xem trước thay đổi trong tab Xem trước trực tiếp
                          </li>
                          <li>• Lưu thay đổi để cập nhật trang chủ</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <HomepagePreview sections={sections} />
                </TabsContent>
              </Tabs>
            </div>

            {editingSection && (
              <SectionEditor
                section={editingSection}
                onSave={(config) => updateSection(editingSection.id, config)}
                onClose={() => setEditingSection(null)}
              />
            )}
            <Toaster richColors position="top-right" />
          </div>
        </main>
      </div>
    </div>
  );
}
