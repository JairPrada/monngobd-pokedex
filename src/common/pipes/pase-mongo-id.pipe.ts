import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { isValidObjectId } from "mongoose";

@Injectable()
export class PaseMongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value))
      throw new BadRequestException(`${value} is a Invalid ID`);
    return value;
  }
}
