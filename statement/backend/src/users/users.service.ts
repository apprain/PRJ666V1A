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

  // async createUser(email: string, password: string) {

  //   const user = this.userRepository.create({
  //     email,
  //     password,
  //   });

  //   return await this.userRepository.save(user);
  // }

  async createUser(
    email: string,
    password: string,
    mobile?: string,
    kycSessionId?: string,
  ) {
    const user = this.userRepository.create({
      email,
      password,
      mobile,
      mobileVerified: !!mobile,
      kycSessionId,
      kycVerified: !!kycSessionId,
    });

    return await this.userRepository.save(user);
  } F

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

  async findByMobile(mobile: string) {
    return await this.userRepository.findOneBy({ mobile });
  }
}