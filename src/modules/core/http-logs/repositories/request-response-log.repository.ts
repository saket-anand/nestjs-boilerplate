import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpLogEntity } from '../entities/http-log.entity';

export class RequestResponseLogRepository extends Repository<HttpLogEntity> {
  constructor(
    @InjectRepository(HttpLogEntity) httpLogEntity: Repository<HttpLogEntity>,
  ) {
    super(
      httpLogEntity.target,
      httpLogEntity.manager,
      httpLogEntity.queryRunner,
    );
  }
}
