import Image from "next/image";
import Input from "./components/input";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen">
      <div className="flex flex-wrap w-4/5 border-2 border-gray-300 rounded-2xl">
        <Input />
        {/* <div className="flex flex-col w-full border border-pink-500 md:w-1/2">
          <h1>Your day</h1>
          <ul>
            <li>Text</li>
            <li>Text</li>
            <li>Text</li>
          </ul>
        </div> */}
      </div>
    </main >
  );
}
