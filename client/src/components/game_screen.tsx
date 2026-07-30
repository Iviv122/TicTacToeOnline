import type { components } from "../schema";
import { Circle, X } from "lucide-react";

interface GameScreenProps {
  game: components["schemas"]["GameScheme"];
  send: (data: components["schemas"]["CommandPayload"]) => void;
  player_name: string
}

export default function GameScreen({ game, send, player_name }: GameScreenProps) {
  const sendCords = (x: number, y: number) => {
    const mess: components["schemas"]["CommandPayload"] = {
      command: "mark",
      payload: {
        cords: {
          x,
          y,
        },
      },
    };

    send(mess);
  };

  return (
    <div>
      <div>{player_name === game.current_player.name ? "Your turn" : game.current_player.name+"s turn"}</div>
      {game.board.map((row, y) => (
        <div key={y} className="flex ">
          {row.map((val, x) => (
            <Tile
              key={`${x}-${y}`}
              value={val}
              onClick={() => sendCords(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface TileProps {
  value: components["schemas"]["GameSymbols"];
  onClick: () => void;
}

function Tile({ value, onClick }: TileProps) {
  let content: React.ReactNode = null;

  switch (value) {
    case "X":
      content = <X />;
      break;
    case "O":
      content = <Circle />;
      break;
    default:
      content = null;
  }

  return (
    <div
      className="flex h-15 w-15 items-center justify-center border text-2xl"
      onClick={onClick}
    >
      {content}
    </div>
  );
}
