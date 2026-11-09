
import { Global, Module } from '@nestjs/common';
import { ShowingRelationsService } from './showing-relations.service';

@Global()
@Module({
  providers: [ShowingRelationsService],
  exports: [ShowingRelationsService],
})
export class ShowingRelationsModule {}
