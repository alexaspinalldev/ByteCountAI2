import Input from "./components/input";

export default function Home() {
  return (
    <main className="flex items-center justify-center w-full h-screen bg-[#1B2A1E] text-white flex-wrap">
      <div className="flex flex-wrap w-full md:w-1/2 border-2 border-gray-300 rounded-2xl">
        <Input />
      </div>
      <div className="flex flex-col w-full md:w-1/2 border-2 border-gray-300 rounded-2xl">
        <h1>Your day</h1>
        <ul>
          <li>Text</li>
          <li>Text</li>
          <li>Text</li>
        </ul>
      </div>
    </main >
  );
}
