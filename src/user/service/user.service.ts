/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Like, Repository } from "typeorm";
import { CreateUserParams } from "src/utils/types";
import { UpdateUserDto } from "../dto/UpdateUser.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>
  ){}

  async createUser(userDetails: CreateUserParams){
    const existingUser = await this.userRepository.findOne({
      where: {email: userDetails.email}
    });

    if(existingUser){
      throw new ConflictException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(userDetails.password,10);

    const user = this.userRepository.create({
      ...userDetails, 
      password: hashedPassword
    })

    const savedUser = await this.userRepository.save(user)
    // Exclude password before returning response
     const { password, ...result } = savedUser;

     return result;
  }

  async findOneUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if(!user) {
      throw new NotFoundException(`User with ${id} is not found`)
    }

    return user;
  }

  async findUsers(
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page-1)*limit;
    const whereCondition = search ? {username: Like(`%${search}`)}: {}

    const [data,total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      }
    })

    return {
      total,
      page,
      limit,
      data
    };
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({id});
    if(!user) {
      throw new NotFoundException(`User with ID ${id} is not found`)
    }
    await this.userRepository.update({ id }, updateUserDetails);

    return this.userRepository.findOneBy({id})
  }

  async deleteUser(id: number) {
    const deleteduser = await this.userRepository.delete(id)
    if(deleteduser.affected === 0) {
      throw new NotFoundException(`User with ID ${id} is not found`)
    }

    return{ message: `User with ID ${id} deleted successfully` };
  }
}