export default interface FriendshipModel {
  user: string;
  friend: string;
  status: "ACTIVE" | "REQUEST" | "DELETED";
}
