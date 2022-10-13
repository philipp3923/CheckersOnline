import TokenRepository from "../repositories/Token.repository";

export enum Role {
    ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST"
}

export interface DecryptedToken {
    account_id: string,
    role: Role
}

export interface EncryptedToken {
    token: string,
    creation: number
}

export default class TokenService {

    constructor(private tokenRepository: TokenRepository, private accessTokenSecret: string, private refreshTokenSecret: string, private refreshTokenCount?: number) {
        if(typeof refreshTokenCount !== "undefined"){
            this.tokenRepository.setRefreshTokenCount(refreshTokenCount);
        }
    }

    public async generateAccessToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
        const encryptedToken = this.tokenRepository.generateToken(decryptedToken, this.accessTokenSecret, "30m");
        return this.wrapToken(encryptedToken);
    }

    public async generateRefreshToken(decryptedToken: DecryptedToken): Promise<EncryptedToken> {
        const encryptedToken: string = this.tokenRepository.generateToken(decryptedToken, this.refreshTokenSecret, "30d");
        await this.tokenRepository.saveRefreshToken(decryptedToken.account_id, encryptedToken);
        return this.wrapToken(encryptedToken);
    }

    public async updateRefreshToken(oldToken: string): Promise<EncryptedToken> {
        const oldDecryptedToken: DecryptedToken | null = await this.decryptRefreshToken(oldToken);

        if(oldDecryptedToken === null){
            throw new Error("Invalid token provided for update");
        }

        const newEncryptedToken: EncryptedToken = await this.generateRefreshToken(oldDecryptedToken);

        await this.tokenRepository.updateRefreshToken(oldToken, newEncryptedToken.token);

        return newEncryptedToken;
    }

    public async deleteRefreshToken(token: string){
        await this.tokenRepository.deleteRefreshToken(token);
    }

    public async decryptRefreshToken(token: string): Promise<DecryptedToken | null> {
        const decryptedToken = await this.tokenRepository.decryptToken(token, this.refreshTokenSecret);
        if(decryptedToken?.role !== Role.GUEST && !await this.tokenRepository.isRefreshTokenSaved(token)){
            return null;
        }
        return decryptedToken;
    }

    public decryptAccessToken(token: string): DecryptedToken | null {
        return this.tokenRepository.decryptToken(token, this.accessTokenSecret);
    }

    public async createTokenResponse(decryptedToken: DecryptedToken){
        const accessToken = await this.generateAccessToken(decryptedToken);
        const refreshToken = await this.generateRefreshToken(decryptedToken);

        const response = {accessToken: accessToken, refreshToken: refreshToken, user: decryptedToken};
        return response;
    }

    private wrapToken(token: string): EncryptedToken{
        return {token: token, creation: Date.now() - 5000};
    }
}