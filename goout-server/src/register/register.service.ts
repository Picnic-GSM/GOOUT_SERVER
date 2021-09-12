import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RegisterDataDto } from "src/userdata/register.interface";
import { UserdataService } from "src/userdata/userdata.service";
import * as nodemailer from "nodemailer";
import { RedisService } from "src/util/redis.service";

@Injectable()
export class RegisterService {
  
}
