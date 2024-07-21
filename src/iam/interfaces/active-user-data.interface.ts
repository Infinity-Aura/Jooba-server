import { Role } from 'src/user/enums/role.enum';

export interface ActiveUserData {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
