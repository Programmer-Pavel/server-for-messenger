import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  //   @Post()
  //   async create(@Body() userData: Prisma.UserCreateInput) {
  //     return this.usersService.createUser(userData);
  //   }
}
