import {UserModel} from "../../shared/models/user.model";
import {TokenModel} from "../../shared/models/token.model";

export interface AuthResponse {
  accessToken: TokenModel,
  refreshToken: TokenModel,
  user: UserModel,
}
