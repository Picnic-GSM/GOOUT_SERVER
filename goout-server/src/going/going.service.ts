import { Injectable } from '@nestjs/common';
import { GoingoutDataService } from 'src/goingoutdata/goingoutdata.service';

@Injectable()
export class GoingService {
    constructor(private readonly goingoutservice:GoingoutDataService) {}
    check_status(student_data) {
        let change;
        let status;
        student_data.forEach(async going => {
            let goingtime = going.end_time
            let hour = Number(goingtime.substring(0,goingtime.indexOf(':')));
            let min = Number(goingtime.substring(goingtime.indexOf(':')+1,5));
            let time = new Date();
            let nowhour = time.getHours();
            let nowmin = time.getMinutes();
            
            console.log(nowhour,nowmin)
            if (going.back_check == 1) {
                status = await '귀가 완료'
            } else {
                if(nowhour > hour) {
                    status = await '지각'
                } else if(nowhour == hour) {
                    if(nowmin > min) {
                        status = await '지각'
                    } else {
                        status = await '외출중'
                    }
                } else {
                    status = await '외출중'
                }
            }
            console.log(hour,min,status)    // 나중에 지우기
            change = this.goingoutservice.updateGoingdata(going.goingid,status); //에러 발생시 await 추가
        });
    }
}
