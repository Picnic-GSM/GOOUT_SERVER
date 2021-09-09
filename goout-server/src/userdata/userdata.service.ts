import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Userdata } from "./userdata.entity";
import * as crypto from "crypto";
import { LoginDataDto } from "./login.interface";

@Injectable()
export class UserdataService {
  constructor(
    @InjectRepository(Userdata)
    private usersRepository: Repository<Userdata>
  ) {}

  async createUserdata(createUserDto: LoginDataDto) {
<<<<<<< HEAD
    crypto.randomBytes(64, (err, buf) => {
      crypto.pbkdf2(
        "비밀번호",
        buf.toString("base64"),
        100000,
        64,
        "sha512",
        (err, key) => {
          //console.log(key.toString('base64'));
          console.log(key);
        }
      );
    });
    //createUserDto.salt = await bcrypt.genSalt();
    //createUserDto.password = await bcrypt.hash(createUserDto.password,createUserDto.salt);
    return this.usersRepository.save(createUserDto);
=======
    const cipher = crypto.createCipher('aes-256-cbc', process.env.key);
    let result = cipher.update(createUserDto.password, 'utf8', 'base64');
    result += cipher.final('base64');
    createUserDto.password = await result;
    let create_result = await this.usersRepository.save(createUserDto);
    return create_result;
    
>>>>>>> 2e58c0b3c8edb425581bbb2573e85d4592218033
  }
  getData(): Promise<Userdata[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Userdata> {
    return this.usersRepository.findOne(id);
  }
  findOnewithUserid(userid: number): Promise<Userdata> {
    return this.usersRepository.findOne(userid);
  }
  findwithEmail(email: string): Promise<Userdata> {
    return this.usersRepository.findOne({ email: email });
  }
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
