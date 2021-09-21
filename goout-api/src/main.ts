import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("GoOut OpenAPI Docs")
    .setDescription("GoOut Swagger page")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  if (process.env.MODE == "dev") {
    await app.listen(3000);
  } else {
    await app.listen(3000, "0.0.0.0");
  }
}
bootstrap();
