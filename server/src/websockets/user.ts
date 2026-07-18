import { Elysia, t } from "elysia";
import { roomManager } from "../classes/room_manager";
import { Message, User } from "../classes/user";
import { CommandPayload, CommandPayloadType } from "../classes/command";
import { Room } from "../classes/room";

const clients = new Map<string,User>()


roomManager.addEventListener("onAdd", () => {
  for (const client of clients) {
    sendRooms(client[1])
  }
});

function sendRooms(user : User){
  const mess = {
    type: 'rooms',
    data : roomManager.get_rooms()
  } as Message
  user.sendMessage(mess)
}
function sendRoom(user : User,room: Room){
  const mess = {
    type: 'room',
    data: room
  } as Message
  user.sendMessage(mess)
}

function onRoomUpdate(room : Room) {
  for (const client of clients.values()) {
    sendRoom(client, room)
  }
}

function sendUsers(user : User){
  const users = []
  for (const i of clients.values()) {
    users.push(i)
  }
  const mess = {
    type: 'users',
    data: users
  } as Message
  console.log(mess)
  user.sendMessage(mess)
}

function onUsersChange() {
  for (const i of clients.values()) {
    sendUsers(i)
  }
}

function UserJoinRoom(user: User, room_id : String) {
  const room = roomManager.get_rooms().find(i => i.id === room_id)
  if (room) {
    room.users.push(user)
    onRoomUpdate(room)
  }
}

function handleUserMessage(user : User,mess: CommandPayloadType) {
  switch (mess.command) {
    case "join":
      UserJoinRoom(user, mess.payload.room || "")
      return;

  }
}

export const websocket_instance = (route: string) =>
  new Elysia().ws(route, {
    body: CommandPayload,
    open(ws) {
      const user = new User(ws.id, `User_${ws.id.slice(0, 4)}`, ws.raw);
      clients.set(ws.id, user)
      sendRooms(user)
      onUsersChange()
      sendUsers(user)
    },
    message(ws, message) {
      ws.send(message);
      console.log(message)
      const user = clients.get(ws.id)
      if (user) {
        handleUserMessage(user, message)
      }
    },
    close(ws, code, reason) {
      clients.delete(ws.id)
      onUsersChange()
      console.log(code, reason);
    },
  });
