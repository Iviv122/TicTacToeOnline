interface ButtonProps{
  label: string;
  onClick: () => void;
  className?: string
}

export default function Button({label,onClick,className} : ButtonProps) {

  const style = "border-2 border-solid border-white rounded-md p-2"

  return <button
    onClick={onClick}
    className={style + " " + className}
  >
    {label}
  </button>
}
