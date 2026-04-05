import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(username: string, email: string, pass: string, avatarUrl: string | null = null): Promise<any> {
    const existing = await this.userRepository.findOne({ where: [{ email }, { username }] });
    if (existing) {
      throw new BadRequestException('Bu email yoki username avval ishlatilgan');
    }
    
    const passwordHash = await bcrypt.hash(pass, 10);
    const user = this.userRepository.create({ username, email, passwordHash, avatarUrl });
    await this.userRepository.save(user);

    return this.generateTokens(user);
  }

  async login(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Kiritilgan ma\'lumotlar xato');

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Kiritilgan ma\'lumotlar xato');

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
      });
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');
      
      const payloadAccess = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(payloadAccess);
      return { access_token };
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz');
    }
  }

  async updateProfile(userId: string, updateData: { username?: string; email?: string; avatarUrl?: string }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    if (updateData.username) user.username = updateData.username;
    if (updateData.email) user.email = updateData.email;
    if (updateData.avatarUrl) user.avatarUrl = updateData.avatarUrl;

    await this.userRepository.save(user);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      coinsBalance: user.coinsBalance,
      avatarUrl: user.avatarUrl
    };
  }

  async getRanking() {
    return this.userRepository.find({
      order: { coinsBalance: 'DESC' },
      take: 10,
      select: ['id', 'username', 'avatarUrl', 'coinsBalance', 'totalTasksCompleted']
    });
  }

  private generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh-secret',
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '30d',
      }),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        coinsBalance: user.coinsBalance,
        avatarUrl: user.avatarUrl
      }
    };
  }
}
