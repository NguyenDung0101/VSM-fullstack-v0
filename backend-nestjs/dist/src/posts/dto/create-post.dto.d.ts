import { PostCategory, PostStatus } from "@prisma/client";
export declare class CreatePostDto {
    title: string;
    excerpt: string;
    content: string;
    cover?: string;
    category: PostCategory;
    status?: PostStatus;
    featured?: boolean;
    tags?: string[];
}
