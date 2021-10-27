import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 *
 * @param { INestApplication } app
 */

export async function setupSwagger(app: INestApplication): Promise<void> {
    const options = new DocumentBuilder()
        .setTitle('Goout OpenAPI Docs')
        .setDescription('GoOut Swagger Page')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
}
