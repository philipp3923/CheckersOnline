import { PrismaClient } from "@prisma/client";
import { Role } from "../services/Token.service";
import AccountRepository from "./Account.repository";

export default class UserRepository {
  constructor(
    private prismaClient: PrismaClient,
    private accountRepository: AccountRepository
  ) {}

  public async create(
    id: string,
    email: string,
    username: string,
    password: string
  ) {
    await this.accountRepository.create(id, Role.USER);
    const user = await this.prismaClient.user.create({
      data: {
        username: username,
        email: email,
        password: password,
        account: { connect: { ext_id: id } },
      },
    });
  }

  public async login(id: string) {
    await this.accountRepository.login(id);
  }

  public async getByUsername(username: string): Promise<string | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { username: username },
      include: { account: true },
    });
    return user ? user.account.ext_id : null;
  }

  public async getByAccountID(id: string) {
    const account = await this.prismaClient.account.findUnique({
      where: { ext_id: id },
      include: { user: true },
    });
    return account?.user ?? null;
  }

  public async getByEmail(email: string): Promise<string | null> {
    const user = await this.prismaClient.user.findUnique({
      where: { email: email },
      include: { account: true },
    });
    return user ? user.account.ext_id : null;
  }

  public async getPassword(id: string): Promise<string | null> {
    let account = await this.prismaClient.account.findUnique({
      where: { ext_id: id },
      include: { user: true },
    });
    return account?.user?.password ?? null;
  }

  /**
   *
   * @deprecated unsafe to use
   */
  public async getByEmailOrUsername(name: string) {
    let user = await this.prismaClient.user.findFirst({
      where: { OR: [{ email: name }, { username: name }] },
      include: { account: true },
    });
    return user ? user.account.ext_id : null;
  }

  public async getAllMatchingEmail(email: string) {
    return await this.prismaClient.user.findMany({
      where: { email: { contains: email } },
      include: { account: true },
      take: 100,
    });
  }

  public async getAllMatchingUsername(username: string) {
    return await this.prismaClient.user.findMany({
      where: { username: { contains: username } },
      include: { account: true },
      take: 100,
    });
  }

  public async changePassword(id: string, password: string) {
    const user_id: number | undefined = (await this.getByAccountID(id))?.id;
    if (typeof user_id === "undefined") {
      throw new Error("User has no account");
    }
    await this.prismaClient.user.update({
      data: { password: password },
      where: { id: user_id },
    });
  }

  public async changeUsername(id: string, username: string) {
    const user_id: number | undefined = (await this.getByAccountID(id))?.id;
    if (typeof user_id === "undefined") {
      throw new Error("User has no account");
    }
    await this.prismaClient.user.update({
      data: { username: username },
      where: { id: user_id },
    });
  }

  public async changeEmail(id: string, email: string) {
    const user_id: number | undefined = (await this.getByAccountID(id))?.id;
    if (typeof user_id === "undefined") {
      throw new Error("User has no account");
    }
    console.log(user_id);
    console.log(email);
    await this.prismaClient.user.update({
      data: { email: email },
      where: { id: user_id },
    });
  }

  public async deleteUser(id: string) {
    const user_id: number | undefined = (await this.getByAccountID(id))?.id;
    if (typeof user_id === "undefined") {
      throw new Error("User has no account");
    }
    await this.prismaClient.user.delete({ where: { id: user_id } });
  }
}
