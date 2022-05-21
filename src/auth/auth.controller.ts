import { Body, Controller, Get, HttpStatus, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("login")
  async login(@Body() user: LoginDto, @Res() res?: Response): Promise<void> {
    const { status, message, token } = await this.authService.login(user)

    res.status(status).json({message: message!, token: token!})
  }

  @Post("signup")
  async signup(@Body() user: SignupDto, @Res() res?: Response): Promise<void> {
    const { status, message } = await this.authService.signup(user)

    res.status(status).json({message})
  }
}
