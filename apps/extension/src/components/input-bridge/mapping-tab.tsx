import { Crosshair, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useStore } from "@/content/store"

export function MappingTab() {
  const { 
    parsedData, 
    mappings, 
    setMapping, 
    startSelecting, 
    stopSelecting, 
    activeKey, 
    isSelecting 
  } = useStore()

  const handleTogglePick = (key: string) => {
    if (isSelecting && activeKey === key) {
        stopSelecting()
    } else {
        startSelecting(key)
    }
  }

  const handleRemoveMapping = (key: string) => {
      setMapping(key, "")
  }

  const handleSelectorChange = (key: string, value: string) => {
      setMapping(key, value)
  }

  const dataKeys = parsedData ? Object.keys(parsedData) : []

  return (
    <div className="flex h-full flex-col">
      {/* Column Headers */}
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Source Key
        </span>
        <span className="w-4" />
        <span className="flex-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Target Selector
        </span>
        <span className="w-14" />
      </div>

      {/* Mapping Rows */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {dataKeys.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground">
                  No data parsed. Please enter JSON in the Data Source tab.
              </div>
          )}
          {dataKeys.map((key, index) => {
             const isRowPicking = isSelecting && activeKey === key
             const currentSelector = mappings[key] || ""
             
             return (
            <div
              key={key}
              className={`group flex items-center gap-2 px-3 py-1.5 transition-colors hover:bg-accent/50 ${
                index !== dataKeys.length - 1 ? "border-b border-border/50" : ""
              } ${isRowPicking ? "bg-primary/5" : ""}`}
            >
              {/* Source Key */}
              <div className="flex-1 min-w-0">
                <Input
                  value={key}
                  readOnly
                  className="h-7 border-none bg-transparent px-1.5 font-mono text-[11px] text-primary placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring cursor-default"
                />
              </div>

              {/* Arrow */}
              <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />

              {/* Target Selector */}
              <div className="flex-1 min-w-0">
                <Input
                  value={currentSelector}
                  onChange={(e) => handleSelectorChange(key, e.target.value)}
                  className={`h-7 border-none bg-transparent px-1.5 font-mono text-[11px] placeholder:text-muted-foreground/50 focus-visible:ring-1 focus-visible:ring-ring ${
                    isRowPicking
                      ? "text-chart-2"
                      : "text-muted-foreground"
                  }`}
                  placeholder="#selector"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-6 w-6 ${
                        isRowPicking
                          ? "text-chart-2 bg-chart-2/10"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => handleTogglePick(key)}
                    >
                      <Crosshair className="h-3 w-3" />
                      <span className="sr-only">Pick element</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Pick Element</TooltipContent>
                </Tooltip>
                
                {currentSelector && (
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    onClick={() => handleRemoveMapping(key)}
                    >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Remove mapping</span>
                    </Button>
                )}
                 {!currentSelector && <div className="w-6" />}
              </div>
            </div>
          )})}
        </div>
      </ScrollArea>
    </div>
  )
}
