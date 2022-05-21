import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { SignupDto } from './auth/dto/signup.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) {}

  @Get()
  public getHello(): string {
    return 'Hello World!'
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  user(@Req() req: Request) {
    return req.user
  }
}
