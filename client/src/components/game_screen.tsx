import type { components } from "../schema";

interface GameScreenProps {
  game: components["schemas"]["GameScheme"];
  send: (data) => void;
}

export default function GameScreen({ game, send }: GameScreenProps) {
  const sendCords = (x, y) => {
    const mess = {
      command: 'mark',
      payload: {
        cords: {
          x: x,
          y: y,
        },
      },
    } as components["schemas"]["CommandPayload"];
    send(mess);
  };

  return (
    <div>
      <div>{game.current_player.name}' Turn</div>
      {game.board.map((row, y) => (
        <div className="flex gap-10">
          {row.map((val, x) => (
            <div
              onClick={() => {
                sendCords(x, y);
              }}
            >
              {val}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
