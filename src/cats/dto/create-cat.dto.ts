import { IsInt, IsString } from 'class-validator';

export class CreateCatDto {
  /**
   * @example 'Petya'
   */
  @IsString()
  name!: string;

  @IsInt()
  age!: number;

  @IsString()
  breed!: string;
}
