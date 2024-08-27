import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { RequestLogType } from '../enums/request-log-type.enum';
import { ExtendedBaseEntity } from '@app/common/entities/extended-base.entity';

@Entity({ name: 'http_logs' })
export class HttpLogEntity extends ExtendedBaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_id', type: 'varchar' })
  requestId: string;

  @Column({ name: 'request_timestamp', type: 'timestamp', nullable: true })
  requestTimeStamp: Date;

  @Column({
    type: 'enum',
    enum: RequestLogType,
    name: 'request_type',
  })
  requestType: RequestLogType;

  @Column({ name: 'response_timestamp', type: 'timestamp', nullable: true })
  responseTimeStamp: Date;

  @Column({ name: 'method', nullable: true })
  method: string;

  @Column({ name: 'url', nullable: true, length: 1024 })
  url: string;

  @Column('simple-json', { name: 'request_headers', nullable: true })
  requestHeaders: object;

  @Column('simple-json', { name: 'request_body', nullable: true })
  requestBody: object;

  @Column('simple-json', { name: 'response_headers', nullable: true })
  responseHeaders: object;

  @Column('simple-json', { name: 'response_body', nullable: true })
  responseBody?: object;

  @Column({ name: 'error_code', nullable: true })
  errorCode?: number;

  @Column({ name: 'response_status', nullable: true })
  responseStatusCode: number;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'reference_entity', nullable: true })
  referenceEntity: string;

  @Column({ name: 'response_time', nullable: true })
  responseTime: number;
  @BeforeInsert()
  generateRequestId() {
    this.requestId = uuid();
  }
}
