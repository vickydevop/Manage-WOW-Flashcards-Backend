import { CommonFieldsInterface } from './common-fields.interface';
export class NewUserInterface extends CommonFieldsInterface {
  user_name: string;
  password: string;
  mobile_no: number;
}
