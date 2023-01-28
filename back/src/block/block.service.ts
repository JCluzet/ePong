import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EBlock } from './interface/bock.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(EBlock)
    private blockRepository: Repository<EBlock>,
  ) {}

  async getAll(): Promise<EBlock[]> {
    return this.blockRepository.find();
  }

  async getBlocked(login: string): Promise<string[]> {
    try {
      const userblocked: EBlock[] = await this.blockRepository.find({ where: { sender: login, status: 'blocked' } });
      if (userblocked[0]) return userblocked.map((element: EBlock) => element.receiver);
      return [];
    } catch (err) {
      throw err;
    }
  }

  async blockUser(from: string, to: string) {
    try {
      const relations: EBlock[] = await this.blockRepository.find({ where: { sender: from, receiver: to } });
      const relation: EBlock = relations[0];
      if (relation !== undefined && relation.status === 'blocked') return;
      let newRelation: EBlock;
      if (relation) {
        newRelation = { ...relation };
        newRelation.status = 'blocked';
      } else {
        newRelation = {
          sender: from,
          receiver: to,
          status: 'blocked',
        };
      }
      await this.blockRepository.save(newRelation);
    } catch (err) {
      throw err;
    }
  }

  async unblockUser(from: string, to: string) {
    try {
      const relations: EBlock[] = await this.blockRepository.find({ where: { sender: from, receiver: to } });
      const relation: EBlock = relations[0];
      if (relation !== undefined && relation.status === 'none') return;
      let newRelation: EBlock;
      if (relation) {
        newRelation = { ...relation };
        newRelation.status = 'none';
      } else {
        newRelation = {
          sender: from,
          receiver: to,
          status: 'none',
        };
      }
      await this.blockRepository.save(newRelation);
    } catch (err) {
      throw err;
    }
  }
}
