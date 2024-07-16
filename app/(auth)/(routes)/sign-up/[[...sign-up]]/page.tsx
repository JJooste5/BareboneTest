import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-700">
      <SignUp />
    </div>
  );
}