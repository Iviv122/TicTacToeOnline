import type { ToastContentProps } from "react-toastify";

type CustomNotificationProps = ToastContentProps<{
  title: string;
}>;

export default function Msg({ closeToast, data }: CustomNotificationProps) {
  return (
    <div className="flex flex-col w-full">
      <h3 className={"text-sm font-semibold"}>{data.title}</h3>
    </div>
  );
}
