import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import drizzleConfig from 'drizzle.config';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private db: NodePgDatabase;

  async onModuleInit() {
    const credentials = drizzleConfig.dbCredentials;
    if (!process.env.RUNNING_LOCAL) {
      credentials.host = 'db'; // ao rodar o docker-compose, o host deve ser o nome do serviço no docker-compose.yml
    }

    this.client = new Client(credentials);

    await this.client.connect();
    this.db = drizzle(this.client);
  }

  getDb() {
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.end();
  }
}
