import Image from "next/image";
interface EmptyProps {
    label: string,
}

export default function Empty({label}: EmptyProps) {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  )
}
