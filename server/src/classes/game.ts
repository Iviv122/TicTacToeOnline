import { t } from "elysia";
import EventEmitter from "node:events";
import { register_model } from "../models";
import { UserSchema } from "./user";

export class TicTacToeGame<TPlayer> extends EventEmitter {
  private win_length = 3;

  turn = 0;
  players = new Map<TPlayer, GameSymbolsType>()
  player_queue : Array<TPlayer>

  width = 3;
  height = 3;

  board: Array<Array<GameSymbolsType>> = [];
  free_fields : number

  constructor(cross_player: TPlayer, circles_player: TPlayer) {
    super();
    this.init_board();

    this.player_queue = []

    this.players.set(cross_player, 'X')
    this.player_queue.push(cross_player)
    this.players.set(circles_player, 'O')
    this.player_queue.push(circles_player)

    this.free_fields = this.width*this.height

  }
  init_board() {
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board.push([]);
      for (let j = 0; j < this.width; j++) {
        this.board[i].push('.');
      }
    }
  }

  update = () => {
    this.emit("update")
  }

  mark(x: number, y: number, TPlayer: TPlayer): boolean {
    console.log(x +","+y)
    if (TPlayer !== this.curr_player()) {
      return false;
    }
    if (!Number.isInteger(x) || !Number.isInteger(y)) { // :3
      return false;
    }
    if (x < 0 || y < 0) {
      console.log("negative value")
      return false;
    }
    if (x >= this.width || y >= this.height) {
      console.log("out of bounds value")
      return false;
    }
    if (this.board[y][x] !== '.') {
      return false;
    }
    const symbol = this.players.get(this.curr_player())
    if (!symbol) {
      return false;
    }
    this.board[y][x] = symbol;

    var res = this.check_win(symbol);

    if (res) {
      this.end_game(this.curr_player());
      return true;
    }
    this.turn += 1;
    this.free_fields -= 1;
    if (this.free_fields === 0) {
      this.end_game(undefined)
    }
    return true;
  }
  check_win(symbol : GameSymbolsType): boolean {

    // Check rows
    for (let i = 0; i < this.height; i++) {
      let good = 0;
      for (let j = 0; j < this.width; j++) {
        if (this.board[i][j] === symbol) {
          good++;
        } else {
          break;
        }
      }
      if (good === this.win_length) {
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < this.width; j++) {
      let good = 0;
      for (let i = 0; i < this.height; i++) {
        if (this.board[i][j] === symbol) {
          good++;
        } else {
          break;
        }
      }
      if (good === this.win_length) {
        return true;
      }
    }

    // Main diagonal
    let good = 0;
    for (let i = 0; i < Math.min(this.width, this.height); i++) {
      if (this.board[i][i] === symbol) {
        good++;
      } else {
        break;
      }
    }
    if (good === this.win_length) {
      return true;
    }

    // Anti-diagonal
    good = 0;
    for (let i = 0; i < Math.min(this.width, this.height); i++) {
      if (this.board[i][this.width - 1 - i] === symbol) {
        good++;
      } else {
        break;
      }
    }
    if (good === this.win_length) {
      return true;
    }

    return false;
  }
  end_game(player: TPlayer | undefined) {
    if (player !== undefined) {
      this.emit("end",player)
    } else {
      this.emit("end",undefined)
    }
  }
  curr_player(): TPlayer{
    return this.player_queue[this.turn%this.player_queue.length]
  }
  reset(): void {
    // TODO
    // restart*
    // end on player end
  }
  toJson() {
    return {
      current_player: this.curr_player(),
      board: this.board
    } as GameSchemeType
  }
}

const GameSymbols = t.Union([
  t.Literal("X"),
  t.Literal("O"),
  t.Literal(".")
])
type GameSymbolsType = typeof GameSymbols.static
register_model("GameSymbols",GameSymbols)

export const GameScheme = t.Object({
  current_player: UserSchema,
  board: t.Array(t.Array(GameSymbols))
})
export type GameSchemeType = typeof GameScheme.static
register_model("GameScheme", GameScheme)

export const TurnScheme = t.Object({
  x: t.Integer(),
  y: t.Integer()
})
export type TurnSchemeType = typeof TurnScheme.static
register_model("TurnScheme",TurnScheme)
