import UserRepository from "../repositories/User.repository";
import EncryptionRepository from "../repositories/Encryption.repository";
import IdentityRepository from "../repositories/Identity.repository";
import AccountRepository from "../repositories/Account.repository";
import { DecryptedToken } from "./Token.service";
import SocketService from "./Socket.service";
import FriendshipService from "./Friendship.service";

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private encryptionRepository: EncryptionRepository,
    private identRepository: IdentityRepository,
    private accountRepository: AccountRepository,
    private friendshipService: FriendshipService,

    private socketService: SocketService
  ) {}

  public async create(
    email: string,
    username: string,
    password: string
  ): Promise<string> {
    if (
      !this.validatePassword(password) ||
      !this.validateUsername(username) ||
      !this.validateEmail(email)
    ) {
      throw new Error("Illegal arguments provided");
    }
    if (
      (await this.getByEmail(email)) !== null ||
      (await this.getByUsername(username)) !== null
    ) {
      throw new Error("User already exists");
    }

    const hashedPassword = this.encryptionRepository.hashPassword(password);
    const id = await this.identRepository.generateUserID();

    try {
      await this.userRepository.create(id, email, username, hashedPassword);
    } catch (e) {
      throw new Error("User generation failed");
    }

    return id;
  }

  public async login(id: string) {
    await this.userRepository.login(id);
  }

  public async authenticate(id: string, password: string): Promise<boolean> {
    const userPassword = await this.userRepository.getPassword(id);

    if (userPassword === null) {
      throw new Error("User does not exist");
    }

    return this.encryptionRepository.comparePasswords(password, userPassword);
  }

  public async getByUsername(username: string): Promise<string | null> {
    return await this.userRepository.getByUsername(username);
  }

  public async getByEmail(email: string): Promise<string | null> {
    return await this.userRepository.getByEmail(email);
  }

  public async getAllMatchingEmail(email: string) {
    return (await this.userRepository.getAllMatchingEmail(email)).map(
      (user) => {
        return { id: user.account.ext_id, username: user.username };
      }
    );
  }

  public async getAllMatchingUsername(username: string) {
    return (await this.userRepository.getAllMatchingUsername(username)).map(
      (user) => {
        return { id: user.account.ext_id, username: user.username };
      }
    );
  }

  public async getEmail(id: string) {
    return (await this.getByID(id))?.email ?? null;
  }

  public async getUsername(id: string) {
    return (await this.getByID(id))?.username ?? null;
  }

  /**
   *
   * @deprecated unsafe to use
   */
  public async getByUsernameOrEmail(name: string) {
    return await this.userRepository.getByEmailOrUsername(name);
  }

  public async changePassword(id: string, password: string) {
    const hashedPassword = this.encryptionRepository.hashPassword(password);
    await this.userRepository.changePassword(id, hashedPassword);
  }

  public async changeUsername(id: string, username: string) {
    await this.userRepository.changeUsername(id, username);
  }

  public async changeEmail(id: string, email: string) {
    await this.userRepository.changeEmail(id, email);
  }

  public validateUsername(username: string): boolean {
    let result = true;

    if (username.length < 4) {
      result = false;
    }

    //#TODO CHANGE FOR PRODUCTION
    return true;
  }

  public validateEmail(email: string): boolean {
    let result = true;

    if (email.length < 4) {
      result = false;
    }

    //#TODO CHANGE FOR PRODUCTION
    return true;
  }

  public validatePassword(password: string): boolean {
    let result = true;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;

    if (!password.match(regex)) {
      result = false;
    }

    //#TODO CHANGE FOR PRODUCTION
    return true;
  }

  private async getByID(id: string) {
    return await this.userRepository.getByAccountID(id);
  }

  public async delete(decryptedToken: DecryptedToken) {
    const connection = this.socketService.getConnection(decryptedToken);
    const friendships = await this.friendshipService.getFriends(
      decryptedToken.id
    );
    for (let friend of friendships) {
      await this.friendshipService.delete(friend.user, friend.friend);
    }
    await connection?.disconnectAllSockets();
    await this.accountRepository.setDeleted(decryptedToken.id);
    await this.userRepository.deleteUser(decryptedToken.id);
  }
}
