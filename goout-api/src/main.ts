import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger';

async function boot() {
    const app = await NestFactory.create(AppModule);

    setupSwagger(app);

    // 개발모드와 프로덕션 환경 구분
    if (process.env.MODE == 'dev') {
        await app.listen(3000); // on development Env -> localhost
    } else {
        await app.listen(3000, '0.0.0.0'); // on production Env -> Open the Host Ip
    }
}
boot();
