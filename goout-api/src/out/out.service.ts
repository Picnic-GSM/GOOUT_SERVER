import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/user/entites/student.entity';
import { StudentDataService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Out } from './entities/out.entity';
import { CreateOutDataDto } from './dto/create-out.dto';

@Injectable()
export class OutDataService {
    constructor(
        @InjectRepository(Out)
        private outRepository: Repository<Out>,
        private readonly studentDataService: StudentDataService,
    ) {}

    async create(obj: CreateOutDataDto, studentObj: Student) {
        return await this.outRepository.save({
            ...obj,
            student: studentObj,
        });
    }

    async checkStatus(obj: Out[]) {
        obj.forEach((element) => {
            if (element.status == 3) {
                let objTime = element.end_at.toISOString();

                let hour = Number(objTime.substring(0, objTime.indexOf(':')));
                let min = Number(
                    objTime.substring(objTime.indexOf(':') + 1, 5),
                );

                let currentTime = new Date();
                let nowhour = currentTime.getHours();
                let nowmin = currentTime.getMinutes();

                console.log(
                    `objTime - hour : ${hour} <-> currentTime - hour : ${nowhour}
           objTime - min : ${min} <-> currentTime - min : ${nowmin}`,
                );
                if (nowhour > hour) {
                    element.status = 5;
                } else if (nowhour == hour) {
                    if (nowmin > min) {
                        element.status = 5;
                    } else if (nowhour == hour) {
                        if (nowmin > min) {
                            element.status = 5;
                        } else {
                            element.status = 3;
                        }
                    } else {
                        element.status = 3;
                    }
                }
            }
        });

        return await this.outRepository.save(obj);
    }

    getData(): Promise<Out[]> {
        return this.outRepository.find({ relations: ['student'] });
    }

    findOne(id: number): Promise<Out> {
        return this.outRepository.findOne({ relations: ['Student'] });
    }

    async findWithGrade(grade: number): Promise<Out[]> {
        let outData = await this.outRepository.find({
            where: { status: 3 },
            relations: ['Student'],
        }); // 승인된 외출 요청 검색
        let resultObj: Out[];
        outData.forEach((elem) => {
            if (elem.student.grade == grade) resultObj.push(elem);
        });
        return resultObj;
    }

    async findWithClass(grade: number, s_class: number): Promise<Out[]> {
        let resultObj: Out[];
        let outData = await this.outRepository.find({ status: 3 }); // 승인된 외출 요청만 검색
        outData.forEach((elem) => {
            if (elem.student.grade == grade && elem.student.s_number == s_class)
                resultObj.push(elem);
        });
        return resultObj;
    }

    async find_with_request_check(request: number): Promise<Out[]> {
        return await this.outRepository.find({ status: request });
    }

    async updateGoingdata(id: number, going_status: number) {
        const updateObj = await this.outRepository.findOne({
            idx: id,
        });
        updateObj.status = going_status;
        await this.outRepository.save(updateObj);
    }

    async update_GoingRequestdata(id: number, going_request: number) {
        const updateObj = await this.outRepository.findOne({
            idx: id,
        });
        updateObj.status = going_request;
        await this.outRepository.save(updateObj);
    }
    async remove(id: string): Promise<void> {
        await this.outRepository.delete(id);
    }
}
