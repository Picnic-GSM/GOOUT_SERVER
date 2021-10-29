import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    // 요청 상태 확인 후 만료, 늦음 상태 변경
    async checkStatus(obj: Out[]) {
        obj.forEach((element) => {
            // 현재 시간과 신청한 외출의 시작시간을 비교하여 현재 시간보다 늦었다면
            if (element.status == 3) {
                // 승인된 상태라면
                let objTime = element.end_at.toISOString(); // 외출 종료시간과 현재 시간을 비교

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
                    element.status = 5; // 늦음 상태로 표시
                } else if (nowhour == hour) {
                    if (nowmin > min) {
                        element.status = 5;
                    } else if (nowhour == hour) {
                        if (nowmin > min) {
                            element.status = 5;
                        } else {
                            return obj;
                        }
                    } else {
                        return obj;
                    }
                }
            } else if (element.status == 1) {
                // 미승인 상태인 경우
                let objTime = element.start_at.toISOString();
                let hour = Number(objTime.substring(0, objTime.indexOf(':')));
                let min = Number(
                    objTime.substring(objTime.indexOf(':') + 1, 5),
                );
                console.log(`objTime: ${objTime}, hour: ${hour}, min: ${min}`);

                let currentTime = new Date();
                let nowhour = currentTime.getHours();
                let nowmin = currentTime.getMinutes();
                console.log(
                    `currentTime: ${currentTime}, nowhour: ${nowhour}, nowmin: ${nowmin}`,
                );

                // 해당 요청의 외출 시작 시간과 현재 시간 비교하여 해당 데이터 만료시키기
                if (nowhour > hour) {
                    element.status = 7; // 늦음 상태로 표시
                } else if (nowhour == hour) {
                    if (nowmin > min) {
                        element.status = 7;
                    } else if (nowhour == hour) {
                        if (nowmin > min) {
                            element.status = 7;
                        } else {
                            return obj;
                        }
                    } else {
                        return obj;
                    }
                }
            }
        });

        return await this.outRepository.save(obj);
    }

    async getData(): Promise<Out[]> {
        const outObj = await this.outRepository.find({
            relations: ['student'],
        });
        if (!outObj.length) {
            throw new HttpException(
                '일치하는 데이터가 없습니다.',
                HttpStatus.NO_CONTENT,
            );
        }
        return this.checkStatus(outObj);
    }

    findOne(id: number): Promise<Out> {
        return this.outRepository.findOne({
            where: { idx: id },
            relations: ['student'],
        });
    }
    // 상태에 관계없이 학년별 외출 데이터 검색
    async findWithGrade(grade: number): Promise<Out[]> {
        let outObj = await this.outRepository.find({
            relations: ['student'],
        });
        let resultObj: Out[] = [];
        outObj.forEach((elem) => {
            if (elem.student.grade == grade) resultObj.push(elem);
        });
        return resultObj;
    }

    // 상태에 관계없이 학년, 반별 외출 데이터 검색
    async findWithClass(grade: number, s_class: number): Promise<Out[]> {
        let outObj = await this.outRepository.find({
            relations: ['student'],
        });

        let resultObj: Out[] = [];
        outObj.forEach((elem) => {
            if (elem.student.grade == grade && elem.student.s_number == s_class)
                resultObj.push(elem);
        });
        return resultObj;
    }

    // 특정 status 값에 헤당하는 데이터 조회
    async findWithStatus(status: number): Promise<Out[]> {
        return await this.outRepository.find({ status: status });
    }

    // 인덱스 값을 통해 특정 외출 데이터의 status 값 수정
    async updateStatusWithId(idx: number, status: number) {
        let updateObj = await this.outRepository.findOne({
            idx: idx,
        });
        updateObj.status = status;
        return this.outRepository.save(updateObj);
    }

    async remove(id: string): Promise<void> {
        await this.outRepository.delete(id);
    }
}
