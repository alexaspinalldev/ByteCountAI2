import Input from "./components/features/mealInput";
import DayTracker from "./components/features/dayTracker";
import Header from "./components/common/header";


export default function Home() {
  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <main className="flex flex-col md:flex-row justify-center w-full grow gap-3 px-3 pb-3">
        {/* Calendar sidebar */}
        <div className="grow w-full md:w-1/2">
          <Input />
        </div>
        <div className="grow w-full md:w-1/2">
          <DayTracker />
        </div>
      </main>
    </div>
  );
}
