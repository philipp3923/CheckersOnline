import {User} from "../../shared/models/user.model";
import {Token} from "../../shared/models/token.model";

export interface AuthResponse {
  accessToken: Token,
  refreshToken: Token,
  user: User,
}
