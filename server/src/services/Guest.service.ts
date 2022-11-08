import GuestRepository from "../repositories/Guest.repository";
import IdentityRepository from "../repositories/Identity.repository";

export default class GuestService {
  constructor(
    private guestRepository: GuestRepository,
    private identityRepository: IdentityRepository
  ) {}

  public async create(): Promise<string> {
    const id = await this.identityRepository.generateGuestID();
    try {
      await this.guestRepository.create(id);
    } catch (e) {
      throw new Error("User generation failed");
    }
    return id;
  }
}
