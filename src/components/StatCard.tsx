import { Type as type, LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  bgColor: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  bgColor,
}: StatCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div
        className={`${bgColor} rounded-full w-12 h-12 flex items-center justify-center mb-6`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
