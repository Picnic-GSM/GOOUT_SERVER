import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentDataService } from 'src/user/user.service';
import { Leave } from './entites/leave.entity';
import { Student } from 'src/user/entites/student.entity';
import { CreateLeaveDataDto } from './dto/create-leave.dto';

@Injectable()
export class LeaveDataService {
    constructor(
        @InjectRepository(Leave)
        private leaveRepository: Repository<Leave>,
        private readonly studentDataService: StudentDataService,
    ) {}

    getData(): Promise<Leave[]> {
        return this.leaveRepository.find();
    }

    findOne(id: number): Promise<Leave> {
        return this.leaveRepository.findOne({
            where: { idx: id },
            relations: ['Student'],
        });
    }

    // Todo
    create(obj: CreateLeaveDataDto, studentObj: Student) {
        try {
            this.leaveRepository.save({
                ...obj,
                student: studentObj,
            });
        } catch (error) {
            throw new HttpException(
                '저장 중 에러 발생.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // 상태 구분없이 학년별 leave 데이터 검색
    async findWithGrade(grade: number): Promise<Leave[]> {
        let leaveObj = await this.leaveRepository.find({
            relations: ['student'],
        });
        let resultObj: Leave[] = [];
        leaveObj.forEach((elem) => {
            if (elem.student.grade == grade) resultObj.push(elem);
        });
        if (!leaveObj.length) {
            throw new HttpException(
                '일치하는 정보 없음',
                HttpStatus.NO_CONTENT,
            );
        }
        return resultObj;
    }

    // 상태 구분없이 학년, 반별 leave 데이터 검색
    async findWithGradeClass(grade: number, s_class: number): Promise<Leave[]> {
        let leaveObj = await this.leaveRepository.find({
            relations: ['student'],
        });
        let resultObj: Leave[] = [];
        leaveObj.forEach((elem) => {
            if (elem.student.grade == grade && elem.student.class == s_class)
                resultObj.push(elem);
        });
        if (!leaveObj.length) {
            throw new HttpException(
                '일치하는 정보 없음',
                HttpStatus.NO_CONTENT,
            );
        }
        return resultObj;
    }

    async find_with_request_check(status: number) {
        return await this.leaveRepository.find({ status: status });
    }

    async updateStatusWithId(id: number, status: number) {
        const updateObj = await this.leaveRepository.findOne({ idx: id });
        updateObj.status = 2;
        await this.leaveRepository.save(updateObj);
    }

    async remove(id: string): Promise<void> {
        await this.leaveRepository.delete(id);
    }
}
