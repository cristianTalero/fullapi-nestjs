import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Login, LoginSchema } from './schemas/login.schema';
import { Signup, SignupSchema } from './schemas/signup.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([
      { name: Login.name, schema: LoginSchema },
      { name: Signup.name, schema: SignupSchema }
    ]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule, MongooseModule]
})
export class AuthModule {}
