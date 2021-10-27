import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
    @ApiProperty({ description: '이메일 주소' })
    email: string;
}
