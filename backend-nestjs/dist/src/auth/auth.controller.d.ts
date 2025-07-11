import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: any;
            avatar: any;
            role: any;
        };
    }>;
    registerSelf(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    register(registerDto: RegisterDto, req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getProfile(req: any): Promise<{
        _count: {
            posts: number;
            comments: number;
            events: number;
        };
        id: string;
        name: string;
        email: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
