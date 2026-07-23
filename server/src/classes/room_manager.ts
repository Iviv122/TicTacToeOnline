import { randomUUIDv7 } from "bun";
import { Room } from "./room";
import { EventEmitter } from "node:events";
import { User } from "./user";

class RoomManager extends EventEmitter {
  constructor() {
    super();
  }

  private rooms: Set<Room> = new Set<Room>();

  create_room(room_name: string, owner: User): Room {
    const room = new Room(room_name, randomUUIDv7(), owner);
    room.on("update", () => this.handleRoomUpdate(room));
    this.rooms.add(room);
    this.emit("update");
    return room;
  }

  removeRoom(room: Room) {
    this.rooms.delete(room);
    this.emit("update");
  }

  get_rooms() {
    return [...this.rooms.values()];
  }

  get_room(id: string) {
    for (const i of this.rooms.values()) {
      if (i.id === id) {
        return i;
      }
    }
    return null;
  }

  count_rooms() {
    return this.rooms.size;
  }
  handleRoomUpdate(room: Room) {
    this.emit("room_update", room);
  }
}

export const roomManager = new RoomManager();
