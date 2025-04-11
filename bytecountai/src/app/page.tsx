import Input from "../components/mealInput";

export default function Home() {
  return (
    <main className="flex justify-center w-full h-full flex-wrap p-3">
      {/* Settings sidebar */}
      {/* Calendar sidebar */}
      <div className="h-1/2 w-full md:h-full md:w-1/2">
        <Input />
      </div>
      <div className="h-1/2 w-full md:h-full md:w-1/2">
        <section className="flex flex-col p-2 w-full h-full border-1 border-gray-400 rounded-2xl">
          <h1 className="text-2xl text-highlight font-bold p-2">Your day</h1>
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
        </section>
      </div>
    </main >
  );
}
