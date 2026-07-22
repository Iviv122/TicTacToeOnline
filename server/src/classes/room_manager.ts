import { randomUUIDv7 } from "bun";
import { Room } from "./room";
import { EventEmitter } from "node:events";

class RoomManager extends EventEmitter {
  constructor() {
    super();
  }

  private rooms: Set<Room> = new Set<Room>();

  room_updated(room: Room) {
    this.emit("room_update",room)
  }

  create_room(room_name: string) {
    const room = new Room(room_name, randomUUIDv7());

    room.on("update", (room) => this.room_updated(room))

    this.rooms.add(room);
    this.emit("update");

    return room;
  }

  removeRoomById(id: string) {
    for (const i of this.rooms.values()) {
      if (i.id === id) {
        this, this.rooms.delete(i)
        this.emit("update");
      }
    }
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
}

export const roomManager = new RoomManager();
