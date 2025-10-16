import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: string;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  gradient = "bg-gradient-primary",
  description 
}: MetricCardProps) {
  const changeColorClasses = {
    positive: "text-revenue-green",
    negative: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-md hover:shadow-lg transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <p className={`text-sm ${changeColorClasses[changeType]} font-medium`}>
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
          </div>
          <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-primary`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}