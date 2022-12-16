import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DecryptedToken } from "../services/Token.service";

export default class TokenRepository {
  private refreshTokenCount: number;

  constructor(private prismaClient: PrismaClient) {
    this.refreshTokenCount = 10;
  }

  public generateToken(payload: Object, secret: string, expiration: string) {
    const token = jwt.sign(payload, secret, {
      expiresIn: expiration,
    });
    return token;
  }

  public decryptToken(token: string, secret: string): DecryptedToken | null {
    try {
      const decryptedToken = jwt.verify(token, secret);
      if (!decryptedToken) {
        throw new Error();
      }
      return {
        id: (<DecryptedToken>decryptedToken).id,
        role: (<DecryptedToken>decryptedToken).role,
        timestamp: ((<JwtPayload>decryptedToken).iat ?? 0) * 1000,
      };
    } catch (err) {
      return null;
    }
  }

  public async isRefreshTokenSaved(token: string): Promise<boolean> {
    const result = await this.prismaClient.refreshToken.findUnique({
      where: { content: token },
    });
    return !!result;
  }

  public async saveRefreshToken(account_id: string, token: string) {
    try {
      await this.prismaClient.refreshToken.create({
        data: {
          content: token,
          account: { connect: { ext_id: account_id } },
        },
      });
      await this.cleanUpRefreshTokens(account_id);
    } catch (e) {}
  }

  public async updateRefreshToken(oldToken: string, newToken: string) {
    try {
      await this.prismaClient.refreshToken.update({
        data: { content: newToken },
        where: { content: oldToken },
      });
    } catch (e) {}
  }
  public async deleteRefreshToken(token: string) {
    await this.prismaClient.refreshToken.delete({ where: { content: token } });
  }

  public setRefreshTokenCount(count: number) {
    this.refreshTokenCount = count;
  }

  private async cleanUpRefreshTokens(account_id: string) {
    const tokens = await this.prismaClient.refreshToken.findMany({
      where: { account: { ext_id: account_id } },
      orderBy: { createdAt: "asc" },
    });

    for (let i = 0; i < tokens.length - this.refreshTokenCount; i++) {
      await this.prismaClient.refreshToken.delete({
        where: { id: tokens[i].id },
      });
    }
  }
}
