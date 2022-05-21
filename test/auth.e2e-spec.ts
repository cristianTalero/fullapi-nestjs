import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { disconnect } from 'mongoose';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AppModule],
      providers: [AuthService]
    }).compile();

    app = moduleFixture.createNestApplication();
    authService = app.get<AuthService>(AuthService)

    await app.init();
  });

  it('/signup (POST) debería crear una cuenta', () => {
    const user = {
      name: 'e2e-name',
      username: 'e2e-username' + Math.random() * Math.random(),
      password: 'e2e-password'
    }

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(200)
      .expect({ message: 'created' });
  });

  it('/signup (POST) debería mostrar que el usuario ya existe', async () => {
    const user = {
      name: 'e2e-name',
      username: 'e2e-username',
      password: 'e2e-password'
    }

    await authService.signup(user)

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(409)
      .expect({ message: 'El usuario ya existe!' });
  });

  it('/login (POST) debería iniciar sesión', async () => {
    const user = {
      username: 'e2e-username',
      password: 'e2e-password'
    }

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200)
  });

  it('/login (POST) debería mostrar que el usuario no existe', async () => {
    const user = {
      username: 'e2e-username-no-exists',
      password: 'e2e-password'
    }

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(404)
      .expect({ message: 'El usuario no existe' });
  });

  it('/login (POST) debería mostrar que la contraseña es incorrecta', async () => {
    const user = {
      username: 'e2e-username',
      password: 'e2e-password-incorrect'
    }

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(403)
      .expect({ message: 'La contraseña no coincide' });
  });

  afterAll(() => disconnect())
});
