import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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

    return this.userRepository.save(user);
  }

  async createCorpUser(
    email: string,
    password: string,
    organizationId: string,
  ) {
    const user = this.userRepository.create({
      email,
      password,
      organizationId,
    });

    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: {
        organization: true,
      },
    });
  }

  async findByMobile(mobile: string) {
    return this.userRepository.findOneBy({ mobile });
  }

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ["organization"],
    });
  }
}