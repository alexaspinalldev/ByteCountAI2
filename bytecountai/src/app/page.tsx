import Input from "./components/input";

export default function Home() {
  return (
    <main className="grow flex gap-3 justify-center w-full h-full bg-background text-white flex-wrap p-3 md:p-5">
      <Input />
      <div className="flex flex-col w-full md:w-[45%] border-1 border-gray-400 rounded-2xl">
        <h1>Your day</h1>
        <h2>Calories</h2>
        <h3>Goal: 2000</h3>
        <h3>Consumed: 1500</h3>
        <h3>Remaining: 500</h3>
        <h2>Meals:</h2>
        <ul>
          <li>Breakfast</li>
          <li>Lunch</li>
          <li>Dinner</li>
          <li>Snacks</li>
          <li>Drinks</li>
          <li>Other</li>
        </ul>
      </div>
    </main >
  );
}
