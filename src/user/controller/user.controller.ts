/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { CreateUserDto } from "../dto/CreateUser.dto";
import { UpdateUserDto } from "../dto/UpdateUser.dto";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
 
  @Post()
  async createUser(@Body() createUserDto : CreateUserDto) {
  
    return this.userService.createUser(createUserDto)
  }

  @Get()
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(7), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ){
    return await this.userService.findUsers(page,limit,search)
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDetails: UpdateUserDto
  ) {
    return await this.userService.updateUser(id, updateUserDetails)
  }

  @Delete(':id') 
  async deleteUser(@Param('id',ParseIntPipe) id: number) {
    return this.userService.deleteUser(id)
  }
}
