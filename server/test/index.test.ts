// test/index.test.ts
import { describe, expect, it } from "bun:test";
import { TicTacToeGame } from "../src/classes/game";
import { UserSchemaType } from "../src/classes/user";

describe("Elysia", () => {
  const user1 = {
    id: "a",
    name: " player1",
  } as UserSchemaType;
  const user2 = {
    id: "a",
    name: " player1",
  } as UserSchemaType;
  it("game creates proper board", async () => {
    const game = new TicTacToeGame(user1, user2);
    const response = game.board;
    expect(response).toEqual([
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ]);
  });
  const winningCombinations = [
    [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    ],
    [
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
    ],
    [
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
    ],
    [
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
    ],
    [
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
    ],
    [
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
    ],
    [
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    ],
    [
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ],
  ];

  it.each(winningCombinations)("detects win for %p", (winningMoves) => {
    const game = new TicTacToeGame(user1, user2);

    let response;
    game.once("end", (winner) => {
      response = winner;
    });

    const fillers = [];
    for (let r = 0; r < 3 && fillers.length < 2; r++) {
      for (let c = 0; c < 3 && fillers.length < 2; c++) {
        if (!winningMoves.some(([wr, wc]) => wr === r && wc === c)) {
          fillers.push([r, c]);
        }
      }
    }

    game.mark(winningMoves[0][0], winningMoves[0][1], user1);
    game.mark(fillers[0][0], fillers[0][1], user2);
    game.mark(winningMoves[1][0], winningMoves[1][1], user1);
    game.mark(fillers[1][0], fillers[1][1], user2);
    game.mark(winningMoves[2][0], winningMoves[2][1], user1);

    expect(response).toBe(user1);
  });
  it("can't play in another order", () => {
    const game = new TicTacToeGame(user1, user2);

    expect(game.mark(0, 0, user2)).toBe(false);
  });
  it("can't overwrite play", () => {
    const game = new TicTacToeGame(user1, user2);
    game.mark(0, 0, user1);
    expect(game.mark(0, 0, user2)).toBe(false);
  });
  it("can't negative", () => {
    const game = new TicTacToeGame(user1, user2);
    game.mark(0, 0, user1);
    expect(game.mark(-1, -1, user2)).toBe(false);
  });
  it("can't out of bounds", () => {
    const game = new TicTacToeGame(user1, user2);
    game.mark(0, 0, user1);
    expect(game.mark(9999, 9999, user2)).toBe(false);
  });
  it("only integers", () => {
    const game = new TicTacToeGame(user1, user2);
    game.mark(0, 0, user1);
    expect(game.mark(1.5, 2.4, user2)).toBe(false);
  });
  it("only integers", () => {
    const game = new TicTacToeGame(user1, user2);
    game.mark(0, 0, user1);
    expect(game.mark(1.5, 2.4, user2)).toBe(false);
  });
  it("ties are ok", () => {
    const game = new TicTacToeGame(user1, user2);

    let response = user1;
    game.once("end", (winner) => {
      response = winner;
    });

    game.mark(0, 0, user1); // X
    game.mark(0, 1, user2); // O
    game.mark(0, 2, user1); // X

    game.mark(1, 1, user2); // O
    game.mark(1, 0, user1); // X
    game.mark(1, 2, user2); // O
    game.mark(2, 1, user1); // X
    game.mark(2, 0, user2); // O
    game.mark(2, 2, user1); // X

    expect(response).toBe(undefined);
  });
});
