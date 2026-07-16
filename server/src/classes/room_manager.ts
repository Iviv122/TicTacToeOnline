import { randomUUIDv7 } from "bun";
import { Room } from "../types/room";
import { User } from "../types/user";

export class RoomManager {
  rooms: Room[] = [];

  add_room(room_name: String) {
    const room = {
            id: randomUUIDv7(),
            name: room_name,
            users: [] as User[],
    } as Room
    this.rooms.push(room)
    return room
  }
  get_rooms() {
    return this.rooms
  }
  get_room(id : string) {
    return this.rooms.find(i => i.id == id)
  }
  count_rooms() {
    return this.rooms.length
  }

}
