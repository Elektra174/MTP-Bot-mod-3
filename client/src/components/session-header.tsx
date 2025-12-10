import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageSquare } from "lucide-react";

interface SessionHeaderProps {
  scenarioName: string | null;
  phase: string;
  onNewSession: () => void;
}

const phaseLabels: Record<string, string> = {
  "initial": "Начало сессии",
  "goals": "Исследование целей",
  "needs": "Поиск потребности",
  "energy": "Энергия потребности",
  "metaposition": "Метапозиция",
  "integration": "Интеграция",
  "actions": "Новые действия",
  "closing": "Завершение"
};

export function SessionHeader({ scenarioName, phase, onNewSession }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 p-2 sm:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-lg truncate max-w-[100px] sm:max-w-none">
            {scenarioName || "МПТ Терапевт"}
          </span>
        </div>
        <Badge variant="secondary" className="flex-shrink-0 text-xs sm:text-sm hidden sm:flex" data-testid="badge-session-phase">
          {phaseLabels[phase] || phase}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewSession}
        className="flex-shrink-0 px-2 sm:px-3"
        data-testid="button-new-session"
      >
        <RotateCcw className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Новая сессия</span>
      </Button>
    </div>
  );
}
