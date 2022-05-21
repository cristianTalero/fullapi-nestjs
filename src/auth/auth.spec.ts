import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AppModule } from '../app.module';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('Auth', () => {
  let authService: AuthService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AppModule],
      providers: [AuthService]
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('AuthService', () => {

    it('should mount service"', () => {
      expect(authService).toBeDefined()
    })

    it('should encrypt and validate a password', async () => {
      const password = "test"
      const hash = await authService.encrypt(password)

      expect(await authService.validate(password, hash)).toBe(true)
    })

    it('Debería crear un nuevo usuario', async () => {
      const user = {
        name: "Name",
        username: "username" + Math.random() * Math.random(),
        password: "password"
      }

      const id = await authService.signup(user)

      expect(id['status']).toBe(200)
    })

    it('Deberia mostrar un error al intentar crear un usuario ya existente', async () => {
      const user = {
        name: "name",
        username: "username",
        password: "password"
      }

      await authService.signup(user)
      const res = await authService.signup(user)

      expect(res['status']).toBe(409)
    })

    it('Deberia iniciar sesión', async () => {
      const user = {
        username: "username",
        password: "password"
      }

      const res = await authService.login(user)

      expect(res['status']).toBe(200)
    })

    it('Debería mostrar un error al intentar acceder con un usuario inexistente', async () => {
      const user = {
        username: "username-doesnt-exists",
        password: "password"
      }

      const res = await authService.login(user)
      
      expect(res['status']).toBe(404)
    })

    it('Debería mostrar un error al colocar una contraseña incorrecta', async () => {
      const user = {
        username: "username",
        password: "incorrect-password"
      }

      const res = await authService.login(user)
      
      expect(res['status']).toBe(403)
    })
  })

  afterAll(() => disconnect())
})