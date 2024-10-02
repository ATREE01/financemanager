import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(
      this.userRepository.create({
        hashedPassword: createUserDto.hashedPassword,
        profile: {
          username: createUserDto.username,
          email: createUserDto.email,
        },
      }),
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        profile: {
          email: email,
        },
      },
    });
  }

  // this get is in term of bank(like group by bank)
  async getUserBank(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        bank: {
          currency: true,
          incExpRecords: true,
          bankRecords: true,
          stockBuyRecords: true,
          stockBundleSellRecords: true,
        },
      },
    });
  }

  async getUserBankRecords(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        bankRecords: {
          bank: {
            currency: true,
          },
        },
      },
    });
  }

  async getUserCurrencyTransactionRecords(
    userId: string,
  ): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        currencyTransactionRecords: {
          fromBank: {
            currency: true,
          },
          toBank: {
            currency: true,
          },
          fromCurrency: true,
          toCurrency: true,
        },
      },
    });
  }

  async getUserBrokerageFirms(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        brokerageFirms: {
          stockBundleSellRecords: {
            userStock: true,
          },
          stockRecords: {
            userStock: true,
            stockBuyRecords: true,
          },
          transactionCurrency: true,
          settlementCurrency: true,
        },
      },
    });
  }

  async getUserBrokergaeFirmWithRecords(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        brokerageFirms: {
          transactionCurrency: true,
          settlementCurrency: true,
          stockRecords: {
            userStock: {
              stock: true,
            },
            brokerageFirm: true,
            stockBuyRecords: true,
            stockSellRecords: true,
          },
        },
      },
    });
  }

  async getUserStockRecords(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        stockRecords: {
          userStock: {
            stock: true,
          },
          brokerageFirm: {
            transactionCurrency: true,
            settlementCurrency: true,
          },
          stockBuyRecords: {
            bank: true,
          },
          stockSellRecords: {
            stockBundleSellRecord: true,
          },
        },
      },
    });
  }

  async getUserStockBundleSellRecords(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        stockBundleSellRecords: {
          bank: true,
          brokerageFirm: {
            transactionCurrency: true,
            settlementCurrency: true,
          },
          userStock: true,
          stockSellRecords: true,
        },
      },
    });
  }
}
