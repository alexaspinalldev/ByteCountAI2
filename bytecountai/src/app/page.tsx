import Input from "./components/features/mealInput";
import DayTracker from "./components/features/dayTracker";
import Header from "./components/features/header";


export default function Home() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      {/* ^Containing sidebar */}
      <main className="flex flex-col md:flex-row justify-center w-full grow gap-3 px-3 pb-3">
        <div className="h-3/5 md:h-full w-full md:w-1/2">
          <Input />
        </div>
        <div className="h-2/5 md:h-full w-full md:w-1/2">
          <DayTracker />
        </div>
      </main>
    </div>
  );
}
