import { Controller, Post, Body, Get, Put, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as fs from 'fs';

// uploads papkasi yo'q bo'lsa yaratamiz
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Faqat rasm fayllari ruxsat etiladi!'), false);
      }
      cb(null, true);
    }
  }))
  async register(@Body() createDto: any, @UploadedFile() file?: any) {
    let avatarUrl = null;
    if (file) {
      avatarUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${file.filename}`;
    }
    return this.authService.register(createDto.username, createDto.email, createDto.password, avatarUrl);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Faqat rasm fayllari ruxsat etiladi!'), false);
      }
      cb(null, true);
    }
  }))
  async updateProfile(@Req() req, @Body() updateDto: any, @UploadedFile() file?: any) {
    const updateData: any = { ...updateDto };
    if (file) {
      updateData.avatarUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${file.filename}`;
    }
    return this.authService.updateProfile(req.user.id, updateData);
  }

  @Get('ranking')
  async getRanking() {
    return this.authService.getRanking();
  }
}
