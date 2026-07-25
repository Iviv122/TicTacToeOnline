interface TextInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
  className?: string;
}

export default function TextInput({
  placeholder,
  onChange,
  value,
  className
}: TextInputProps) {

  const style = "text-white border-b-2 border-red border-solid"

  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      className={style + " " + className}
    />
  );
}
