import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dbConfig from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { ManageWOWFlashcardsAppModule } from './modules/manage-wow-flashcards/manage-wow-flashcards-app.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // CloudStorageAppModule,
    ManageWOWFlashcardsAppModule,
    AuthModule
  ],
  controllers: [
  ],
  providers: [
  ],
})
export class AppModule { }
// Established connection to database

export const dbConnection = new DataSource(dbConfig());
dbConnection
  .initialize()
  .then(() => {
    console.log(
      `Data Source has been initialized! "${process.env.DB_HOST},${process.env.DB_USERNAME},${process.env.DB_PASSWORD}"`,
    );
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
