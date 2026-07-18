import { Elysia, t } from "elysia";
import { roomManager } from "../classes/room_manager";
import { Message, User } from "../classes/user";
import { CommandPayload } from "../classes/command";

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

function sendUsers(user : User){
  const users = []
  for (const i of clients.values()) {
    users.push(i)
  }
  const mess = {
    type: 'users',
    data: users
  } as Message
  console.clear()
  console.log(mess)
  user.sendMessage(mess)
}

function onUsersChange() {
  for (const i of clients.values()) {
    sendUsers(i)
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
    },
    close(ws, code, reason) {
      clients.delete(ws.id)
      onUsersChange()
      console.log(code, reason);
    },
  });
