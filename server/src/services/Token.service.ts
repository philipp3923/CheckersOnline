import TokenRepository from "../repositories/Token.repository";
import AccountRepository from "../repositories/Account.repository";

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    GUEST = "GUEST",
}

export interface DecryptedToken {
    id: string;
    role: Role;
    timestamp?: number;
}

export interface EncryptedToken {
    string: string;
    timestamp: number;
}

export default class TokenService {
    constructor(
        private tokenRepository: TokenRepository,
        private accountRepository: AccountRepository,
        private accessTokenSecret: string,
        private refreshTokenSecret: string,
        private refreshTokenCount?: number
    ) {
        if (typeof refreshTokenCount !== "undefined") {
            this.tokenRepository.setRefreshTokenCount(refreshTokenCount);
        }
    }

    public async generateAccessToken(
        decryptedToken: DecryptedToken
    ): Promise<EncryptedToken> {
        const encryptedToken = this.tokenRepository.generateToken(
            decryptedToken,
            this.accessTokenSecret,
            "30m"
        );
        return this.wrapToken(encryptedToken);
    }

    public async generateRefreshToken(
        decryptedToken: DecryptedToken
    ): Promise<EncryptedToken> {
        const encryptedToken: string = this.tokenRepository.generateToken(
            decryptedToken,
            this.refreshTokenSecret,
            "30d"
        );
        await this.tokenRepository.saveRefreshToken(
            decryptedToken.id,
            encryptedToken
        );
        return this.wrapToken(encryptedToken);
    }

    public async updateRefreshToken(oldToken: string): Promise<EncryptedToken> {
        const oldDecryptedToken: DecryptedToken | null =
            await this.decryptRefreshToken(oldToken);

        if (oldDecryptedToken === null) {
            throw new Error("Invalid token provided for update");
        }

        const newEncryptedToken: EncryptedToken = await this.generateRefreshToken(
            oldDecryptedToken
        );

        await this.tokenRepository.updateRefreshToken(
            oldToken,
            newEncryptedToken.string
        );

        return newEncryptedToken;
    }

    public async deleteRefreshToken(token: string) {
        await this.tokenRepository.deleteRefreshToken(token);
    }

    public async decryptRefreshToken(
        token: string
    ): Promise<DecryptedToken | null> {
        const decryptedToken = await this.tokenRepository.decryptToken(
            token,
            this.refreshTokenSecret
        );
        if (!(await this.tokenRepository.isRefreshTokenSaved(token))) {
            return null;
        }
        return decryptedToken;
    }

    // #TODO implement check for last logout
    public async decryptAccessToken(
        token: string
    ): Promise<DecryptedToken | null> {
        const decryptedToken = await this.tokenRepository.decryptToken(
            token,
            this.accessTokenSecret
        );

        if (
            decryptedToken === null ||
            typeof decryptedToken.timestamp === "undefined"
        ) {
            return null;
        }

        const account = await this.accountRepository.getByExtID(decryptedToken.id);

        if (account === null) {
            return null;
        }

        if (
            account.logoutAt !== null &&
            account.logoutAt.getTime() > decryptedToken.timestamp
        ) {
            return null;
        }

        delete decryptedToken.timestamp;

        return decryptedToken;
    }

    public async createTokenResponse(decryptedToken: DecryptedToken) {
        const accessToken = await this.generateAccessToken(decryptedToken);
        const refreshToken = await this.generateRefreshToken(decryptedToken);

        const response = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: decryptedToken,
        };
        return response;
    }

    private wrapToken(token: string): EncryptedToken {
        return {string: token, timestamp: Date.now() - 5000};
    }
}
