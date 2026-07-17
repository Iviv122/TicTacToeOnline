import { randomUUIDv7 } from "bun";
import { Room } from "../types/room";


class RoomManager extends EventTarget {

  constructor() {
    super();
  }

  private _onAdd: Event = new Event('onAdd');
  private rooms: Room[] = [];

  add_room(room_name: string) {
    const room = new Room(room_name,randomUUIDv7());
    this.rooms.push(room);
    this.dispatchEvent(this._onAdd)
    return room;
  }

  get_rooms() {
    return this.rooms;
  }

  get_room(id: string) {
    return this.rooms.find((i) => i.id == id);
  }

  count_rooms() {
    return this.rooms.length;
  }
}

export const roomManager = new RoomManager();
