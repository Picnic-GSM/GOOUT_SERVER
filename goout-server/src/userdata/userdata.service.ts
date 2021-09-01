import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Userdata } from './userdata.entity';
import { LoginDataDto } from './userdata.interface';
import * as crypto from 'crypto'

@Injectable()
export class UserdataService {
  constructor(
    @InjectRepository(Userdata)
    private usersRepository: Repository<Userdata>,
  ) {}

  async createUserdata(createUserDto: LoginDataDto) {
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2('비밀번호', buf.toString('base64'), 100000, 64, 'sha512', (err, key) => {
        //console.log(key.toString('base64'));
        console.log(key)
      });
    });
    //createUserDto.salt = await bcrypt.genSalt();
    //createUserDto.password = await bcrypt.hash(createUserDto.password,createUserDto.salt);
    return this.usersRepository.save(createUserDto);
  }
  getData(): Promise<Userdata[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Userdata> {
    return this.usersRepository.findOne(id);
  }
/*
  findIdCheck(userid: string): Promise<Userdata> {
    return this.usersRepository.findOne({userid:userid});
  }
*/
/*
  async updateUserdata(updateUserdataDto:IUpdateUserdata) {
    const updatedata = await this.usersRepository.findOne({userid:updateUserdataDto.userid});
    updatedata.username = updateUserdataDto.username;
    updatedata.email = updateUserdataDto.email;
    await this.usersRepository.save(updatedata);
  }*/

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}