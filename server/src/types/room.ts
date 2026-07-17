import { User } from "./user";

export class Room{
  id: String
  name: String
  users: User[]

  constructor(id : string,name: string) {
    this.id = id
    this.name = name
    this.users = []
  }
  join(user : User) {
    this.users.push(user)
  }
}
