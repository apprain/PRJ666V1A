import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createUser(email: string, password: string) {

    const user = this.userRepository.create({
      email,
      password,
    });

    return await this.userRepository.save(user);
  }

  async createCorpUser(email: string, password: string, organizationname: string) {
    
    const user = this.userRepository.create({
      email,
      password,
      organizationname,
    });

    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}