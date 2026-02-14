import { Play, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarFooterProps {
  onFill?: () => void;
  canFill?: boolean;
}

export function SidebarFooter({ onFill, canFill = false }: SidebarFooterProps) {
  return (
    <footer className="sticky bottom-0 flex flex-col gap-2 border-t border-border bg-background px-3 py-3">
      <Button 
        onClick={onFill}
        disabled={!canFill}
        className="w-full gap-2 h-9 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
      >
        <Play className="h-3.5 w-3.5" />
        Auto-Fill Form
      </Button>
      <Button
        variant="outline"
        className="w-full gap-2 h-8 text-xs text-muted-foreground hover:text-foreground"
      >
        <Save className="h-3 w-3" />
        Save Template
      </Button>
    </footer>
  )
}
