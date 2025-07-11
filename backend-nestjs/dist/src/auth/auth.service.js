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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException("Account is deactivated");
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }
    async register(registerDto, user) {
        if (!registerDto.email.endsWith('@vsm.org.vn')) {
            throw new common_1.UnauthorizedException("Email must end with @vsm.org.vn");
        }
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        let roleToAssign = registerDto.role;
        if (!user) {
            if (roleToAssign) {
                throw new common_1.UnauthorizedException("Regular users cannot assign roles");
            }
            roleToAssign = 'USER';
        }
        else {
            if (user.role === 'EDITOR') {
                throw new common_1.ForbiddenException("Editors cannot create accounts");
            }
            if (user.role !== 'ADMIN' && roleToAssign) {
                throw new common_1.UnauthorizedException("Only admins can assign roles");
            }
            roleToAssign = roleToAssign || 'USER';
            if (roleToAssign && !['ADMIN', 'EDITOR', 'USER'].includes(roleToAssign)) {
                throw new common_1.UnauthorizedException("Invalid role assigned");
            }
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const userData = {
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            avatar: registerDto.avatar,
            role: roleToAssign,
        };
        const createdUser = await this.usersService.create(userData);
        const payload = {
            sub: createdUser.id,
            email: createdUser.email,
            role: createdUser.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                avatar: createdUser.avatar,
                role: createdUser.role,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        const { password, ...profile } = user;
        return profile;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map