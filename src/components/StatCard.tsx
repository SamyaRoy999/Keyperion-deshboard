import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  bgColor?: string;
}

export default function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white px-6 py-6 w-full space-y-4 rounded-3xl flex flex-col xl:items-start justify-center items-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <div>
        <p className="text-base font-medium text-[#535353]">{label}</p>
        <p className="text-2xl text-black font-bold text-center xl:text-start">
          {value}
        </p>
      </div>
    </div>
  );
}
