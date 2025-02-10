import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll()
    }

    @Post()
    @Roles(['admin'])
    async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
        this.catsService.createCat(createCatDto)
    }

}
