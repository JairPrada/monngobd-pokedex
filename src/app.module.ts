import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { PokemonModule } from "./pokemon/pokemon.module";
import { CommonModule } from "./common/common.module";
import { SeedModule } from "./seed/seed.module";
import { envConfiguration } from "./config/app.config";
import { JoiValidationSchema } from "./config/joi.valitation";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    MongooseModule.forRoot(process.env.MONGO_STRING_CONNECTION),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
