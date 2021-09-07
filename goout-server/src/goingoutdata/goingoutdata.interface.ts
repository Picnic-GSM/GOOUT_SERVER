import { ApiProperty } from "@nestjs/swagger";

export class CreateGoingDto {
    username:string;
    grade: number;
    class:number;
    s_number:number;
    @ApiProperty({description:'goingout start time'})
    start_time:string;
    @ApiProperty({description:'goingout endtime'})
    end_time:string;
    @ApiProperty({description:'goingout reason'})
    reason:string;
    @ApiProperty({description:'goingout result status'})
    going_status:string;
}