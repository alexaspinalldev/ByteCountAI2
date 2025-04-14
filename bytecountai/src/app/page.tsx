import Input from "./components/features/mealInput";
import Header from "./components/common/header";

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <main className="flex flex-col md:flex-row justify-center w-full grow gap-3 px-3 pb-3">
        {/* Settings sidebar */}
        {/* Calendar sidebar */}
        <div className="grow w-full md:w-1/2">
          <Input />
        </div>
        <div className="grow w-full md:w-1/2">
          <section className="flex flex-col p-2 w-full h-full border-1 border-gray-400 rounded-2xl">
            <h1 className="text-2xl text-highlight font-bold p-2">Your day (Date picker here)</h1>
            <h2>Calories</h2>
            <h3>Goal: 2000</h3>
            <h3>Consumed: 1500</h3>
            <h3>Remaining: 500</h3>
            <h2>Meals:</h2>
            <ul>
              <li>Breakfast</li>
              <li>Lunch</li>
              <li>Dinner</li>

            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
