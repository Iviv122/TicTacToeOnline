import type { components } from "../schema";
import { Circle, X } from "lucide-react";

interface GameScreenProps {
  game: components["schemas"]["GameScheme"];
  send: (data: components["schemas"]["CommandPayload"]) => void;
  reset_game: () => void;
  player_name: string;
}

export default function GameScreen({
  game,
  send,
  reset_game,
  player_name,
}: GameScreenProps) {
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

  if (game.game_result !== undefined) {
    reset_game();
    switch (game.game_result) {
      case "Crosses":
        return (
          <div>
            <p>Crosses Won</p>
          </div>
        );
      case "Circles":
        return (
          <div>
            <p>Circles Won</p>
          </div>
        );
      case "Tie":
        return <div>Tie</div>;
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full absolute">
      <div>
        {player_name === game.current_player.name
          ? "Your turn"
          : game.current_player.name + "s turn"}
      </div>
      <div>
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
    </div>
  );
}

interface TileProps {
  value: components["schemas"]["GameSymbols"];
  onClick: () => void;
}

function Emoji(value) {
  switch (value) {
    case "X":
      return <X />;
    case "O":
      return <Circle />;
  }
}

function Tile({ value, onClick }: TileProps) {
  return (
    <div
      className="flex h-15 w-15 items-center justify-center border text-2xl"
      onClick={onClick}
    >
      {Emoji(value)}
    </div>
  );
}
