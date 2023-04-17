import {User} from "./User";

export interface JwtAuthResponse {
  token: string | undefined;
  username: string | undefined;
  refreshToken: string | undefined;
  expiresAt: number | undefined;
  is_admin: boolean | false;
  user: User | undefined;
}
