import { Settings, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarHeaderProps {
  connectedTo: string
}

export function SidebarHeader({ connectedTo }: SidebarHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          InputBridge
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5"
        >
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {connectedTo}
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="sr-only">Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Settings</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
