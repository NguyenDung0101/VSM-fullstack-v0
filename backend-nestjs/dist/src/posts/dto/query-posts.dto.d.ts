import { PostCategory, PostStatus } from "@prisma/client";
export declare class QueryPostsDto {
    category?: PostCategory;
    status?: PostStatus;
    featured?: boolean;
    authorId?: string;
    search?: string;
    limit?: number;
    page?: number;
}
