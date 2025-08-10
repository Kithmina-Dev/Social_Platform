import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfileController } from './controllers/profile.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [UsersController, ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
