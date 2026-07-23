import { CommandPayloadType } from "./command";
import { Message } from "./message";
import { Room } from "./room";
import { roomManager } from "./room_manager";
import { User } from "./user";

class UserManager {
  clients = new Map<string, User>();

  constructor() {
    roomManager.on("room_update", (room: Room) => roomUpdated(this, room));
    roomManager.on("update", () => roomsUpdated(this));
  }

  join(user: User): void {
    this.clients.set(user.id, user);
    sendRooms(user);
    sendId(user);
    this.onUsersChange();
  }
  message(mess: CommandPayloadType, id: string) {
    const user = this.clients.get(id);
    if (user) {
      this.handleUserMessage(user, mess);
    }
  }
  close(id: string, code: number, reason: string) {
    const client = this.clients.get(id);
    if (client) {
      client.close();
      this.clients.delete(id);
    }
    this.onUsersChange();
  }

  getUser(id: string): User | null {
    return this.clients.get(id) || null;
  }
  getUsers(): Map<string, User> {
    return this.clients;
  }

  userCount(): number {
    return this.clients.size;
  }
  onUsersChange() {
    for (const i of this.clients.values()) {
      this.sendUsersCount(i);
    }
  }
  sendUsersCount(user: User) {
    const users = [];
    for (const i of this.clients.values()) {
      users.push(i);
    }
    const count = this.userCount();
    const mess = {
      type: "users",
      data: count,
    } as Message;
    user.sendMessage(mess);
  }
  UserJoinRoom(user: User, room_id: string) {
    const room = roomManager.get_room(room_id);
    if (room) {
      room.join(user);
      roomUpdated(userManager, room);
    }
  }
  handleUserMessage(user: User, mess: CommandPayloadType) {
    console.log(mess);
    switch (mess.command) {
      case "join":
        user.leave(); // make sure to leave
        this.UserJoinRoom(user, mess.payload.room || "");
        return;
      case "leave":
        user.leave();
        return;
      case "create":
        if (mess.payload.name) {
          if (mess.payload.name?.trim() !== "") {
            roomManager.create_room(mess.payload.name, user);
          }
        }
        return;
      default:
        console.log(mess.command + " Message type undefined");
        return;
    }
  }
}
export const userManager = new UserManager();

function sendRooms(user: User) {
  const mess = {
    type: "rooms",
    data: roomManager.get_rooms(),
  } as Message;
  user.sendMessage(mess);
}
function sendRoom(user: User, room: Room) {
  const mess = {
    type: "room",
    data: room,
  } as Message;
  user.sendMessage(mess);
}
function sendId(user: User) {
  const mess = {
    type: "connection",
    data: user.id,
  } as Message;
  user.sendMessage(mess);
}
function roomUpdated(_userManager: UserManager, room: Room): void {
  for (const client of _userManager.clients.values()) {
    sendRoom(client, room);
  }
}
function roomsUpdated(_userManager: UserManager): void {
  for (const client of _userManager.clients.values()) {
    sendRooms(client);
  }
}
