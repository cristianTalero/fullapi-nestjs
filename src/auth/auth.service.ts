import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { disconnect, Model } from 'mongoose';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { Login, LoginDocument } from './schemas/login.schema';
import { SignupDto } from './dto/signup.dto';
import { Signup, SignupDocument } from './schemas/signup.schema';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Login.name) private readonly loginModel: Model<LoginDocument>,
        @InjectModel(Signup.name) private readonly signupModel: Model<SignupDocument>
    ) {}

    async encrypt(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)

        return await bcrypt.hash(password, salt)
    }

    async validate(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    async signup(credentials: SignupDto): Promise<{ status: number, message: string }> {
        const userExists = await this.signupModel.findOne({ username: credentials['username'] })

        if (userExists) return { status: 409, message: 'El usuario ya existe!' }

        credentials['password'] = await this.encrypt(credentials['password'])
        const user = new this.signupModel(credentials)
        const res = await user.save()

        if (!res) return { status: 500, message: 'Ocurrio un error al crear el usuario!' }

        return { status: 200, message: 'created' }
    }

    async login(credentials: LoginDto): Promise<{ status: number, message?: string, token?: string }> {
        const user = await this.loginModel.findOne({ username: credentials['username'] })

        if (!user) return { status: 404, message: 'El usuario no existe' }
    
        const isValid = await this.validate(credentials['password'], user['password'])
        if (!isValid) {
            return { status: 403, message: 'La contraseña no coincide' }
        }
        
        return {status: 200, token!: this.jwtService.sign(user.toObject())}
    }
}
