import KeyIndicatorsSection from "@/components/dashboard/KeyIndicatorsSection";
import WelcomeSection from "@/components/dashboard/WelcomeSection";

export default function DashboardPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <WelcomeSection />
      <KeyIndicatorsSection />
    </div>
  );
}
