import {TokenModel} from "./token.model";
import {UserModel} from "./user.model";

export interface AuthResponse {
  accessToken: TokenModel,
  refreshToken: TokenModel,
  user: UserModel,
}
