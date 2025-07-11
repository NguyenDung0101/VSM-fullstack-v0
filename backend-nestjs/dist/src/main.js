"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: configService.get("CORS_ORIGIN")?.split(",") || [
            "http://localhost:3000",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    });
    app.setGlobalPrefix("api/v1");
    if (configService.get("NODE_ENV") !== "production") {
        const config = new swagger_1.DocumentBuilder()
            .setTitle("VSM API")
            .setDescription("Vietnam Student Marathon API Documentation")
            .setVersion("1.0")
            .addBearerAuth()
            .addTag("auth", "Authentication endpoints")
            .addTag("users", "User management")
            .addTag("posts", "Blog posts and articles")
            .addTag("events", "Running events")
            .addTag("products", "Shop products")
            .addTag("comments", "Post comments")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup("api/docs", app, document);
    }
    const port = configService.get("PORT") || 3001;
    await app.listen(port);
    console.log(`🚀 VSM API Server running on port ${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map