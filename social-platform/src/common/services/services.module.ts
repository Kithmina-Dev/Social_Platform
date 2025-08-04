import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TypesenseService } from './typesense.service';

/**
 * Global services module that provides common services across the application
 * Using @Global() makes the services available everywhere without re-importing
 */
@Global()
@Module({
  providers: [PrismaService, TypesenseService],
  exports: [PrismaService, TypesenseService],
})
export class ServicesModule {}
