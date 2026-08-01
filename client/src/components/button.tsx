interface ButtonProps{
  label: string;
  onClick: () => void;
  className?: string
}

export default function Button({label,onClick,className} : ButtonProps) {

  const style = "transition-all text-xs border rounded-md px-4 py-2 text-white active:scale-[.95] bg-zinc-900 cursor-pointer"

  return <button
    onClick={onClick}
    className={style + " " + className}
  >
    {label}
  </button>
}
