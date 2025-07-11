import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { QueryPostsDto } from "./dto/query-posts.dto";
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<{
        _count: {
            comments: number;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        excerpt: string;
        content: string;
        cover: string | null;
        category: import(".prisma/client").$Enums.PostCategory;
        views: number;
        likes: number;
        featured: boolean;
        status: import(".prisma/client").$Enums.PostStatus;
        tags: string;
        commentsCount: number;
        publishedAt: Date | null;
        authorId: string;
    }>;
    findAll(query: QueryPostsDto): Promise<{
        data: {
            tags: string[];
            commentsCount: number;
            _count: {
                comments: number;
            };
            author: {
                id: string;
                name: string;
                avatar: string;
            };
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            excerpt: string;
            content: string;
            cover: string | null;
            category: import(".prisma/client").$Enums.PostCategory;
            views: number;
            likes: number;
            featured: boolean;
            status: import(".prisma/client").$Enums.PostStatus;
            publishedAt: Date | null;
            authorId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        tags: string[];
        commentsCount: number;
        _count: {
            comments: number;
        };
        author: {
            id: string;
            name: string;
            avatar: string;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        excerpt: string;
        content: string;
        cover: string | null;
        category: import(".prisma/client").$Enums.PostCategory;
        views: number;
        likes: number;
        featured: boolean;
        status: import(".prisma/client").$Enums.PostStatus;
        publishedAt: Date | null;
        authorId: string;
    }>;
    update(id: string, updatePostDto: UpdatePostDto, req: any): Promise<{
        author: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        excerpt: string;
        content: string;
        cover: string | null;
        category: import(".prisma/client").$Enums.PostCategory;
        views: number;
        likes: number;
        featured: boolean;
        status: import(".prisma/client").$Enums.PostStatus;
        tags: string;
        commentsCount: number;
        publishedAt: Date | null;
        authorId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        excerpt: string;
        content: string;
        cover: string | null;
        category: import(".prisma/client").$Enums.PostCategory;
        views: number;
        likes: number;
        featured: boolean;
        status: import(".prisma/client").$Enums.PostStatus;
        tags: string;
        commentsCount: number;
        publishedAt: Date | null;
        authorId: string;
    }>;
}
