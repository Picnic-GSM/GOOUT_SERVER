import { Module } from '@nestjs/common';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';
import { UserdataService } from 'src/userdata/userdata.service';

@Module({})
export class GoingModule {
    providers:[UserdataService,GoingoutDataService]
}
