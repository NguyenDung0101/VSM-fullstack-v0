"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PostsService = class PostsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createPostDto, authorId) {
        return this.prisma.post.create({
            data: {
                ...createPostDto,
                authorId,
                tags: JSON.stringify(createPostDto.tags || []),
                publishedAt: createPostDto.status === client_1.PostStatus.PUBLISHED ? new Date() : null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
        });
    }
    async findAll(query) {
        const { category, status, featured, authorId, limit = 10, page = 1, search, } = query;
        const where = {};
        if (category)
            where.category = category;
        if (status)
            where.status = status;
        if (featured !== undefined)
            where.featured = featured;
        if (authorId)
            where.authorId = authorId;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { excerpt: { contains: search } },
                { content: { contains: search } },
            ];
        }
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    status: "APPROVED",
                                },
                            },
                        },
                    },
                },
                orderBy: [
                    { featured: "desc" },
                    { publishedAt: "desc" },
                    { createdAt: "desc" },
                ],
                take: limit,
                skip: (page - 1) * limit,
            }),
            this.prisma.post.count({ where }),
        ]);
        return {
            data: posts.map((post) => ({
                ...post,
                tags: this.parseTags(post.tags),
                commentsCount: post._count.comments,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: {
                            where: {
                                status: "APPROVED",
                            },
                        },
                    },
                },
            },
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        await this.prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
        return {
            ...post,
            tags: this.parseTags(post.tags),
            commentsCount: post._count.comments,
        };
    }
    async update(id, updatePostDto, userId, userRole) {
        const post = await this.findOne(id);
        if (post.authorId !== userId &&
            userRole !== client_1.Role.ADMIN &&
            userRole !== client_1.Role.EDITOR) {
            throw new common_1.ForbiddenException("You can only edit your own posts");
        }
        const updateData = {
            ...updatePostDto,
        };
        if (updatePostDto.tags) {
            updateData.tags = JSON.stringify(updatePostDto.tags);
        }
        if (updatePostDto.status === client_1.PostStatus.PUBLISHED && !post.publishedAt) {
            updateData.publishedAt = new Date();
        }
        return this.prisma.post.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
    }
    async remove(id, userId, userRole) {
        const post = await this.findOne(id);
        if (post.authorId !== userId &&
            userRole !== client_1.Role.ADMIN &&
            userRole !== client_1.Role.EDITOR) {
            throw new common_1.ForbiddenException("You can only delete your own posts");
        }
        return this.prisma.post.delete({
            where: { id },
        });
    }
    parseTags(tags) {
        try {
            return JSON.parse(tags || "[]");
        }
        catch {
            return [];
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostsService);
//# sourceMappingURL=posts.service.js.map