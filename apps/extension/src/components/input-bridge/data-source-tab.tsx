import { useCallback, useState, useEffect } from "react"
import { Wand2, Upload, FileJson, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/content/store"

export function DataSourceTab() {
  const { jsonInput, setJsonInput } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [parsedKeys, setParsedKeys] = useState<number | null>(null)

  // Update parsed keys count when jsonInput changes
  useEffect(() => {
    try {
      if (!jsonInput) {
        setParsedKeys(null)
        return
      }
      const parsed = JSON.parse(jsonInput)
      const countKeys = (obj: Record<string, unknown>): number => {
        let count = 0
        for (const key in obj) {
          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            count += countKeys(obj[key] as Record<string, unknown>)
          } else {
            count++
          }
        }
        return count
      }
      setParsedKeys(countKeys(parsed))
    } catch {
      setParsedKeys(null)
    }
  }, [jsonInput])

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
    } catch {
      // Invalid JSON - do nothing
    }
  }, [jsonInput, setJsonInput])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setJsonValue(text) // useStore's setJsonInput via helper
      }
      reader.readAsText(file)
    }
  }, [])
  
  // Helper to handle both drop and file input
  const setJsonValue = (val: string) => {
      setJsonInput(val)
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-3 p-3">
        {/* JSON Editor */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              JSON Data
            </label>
            <div className="flex items-center gap-1.5">
              {parsedKeys !== null && (
                <span className="text-[11px] text-primary font-medium">
                  {parsedKeys} keys found
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                onClick={formatJson}
              >
                <Wand2 className="mr-1 h-3 w-3" />
                Format
              </Button>
            </div>
          </div>
          <div className="relative rounded-md border border-border bg-background overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-end pr-1.5 pt-2.5 bg-muted/50 border-r border-border text-[10px] text-muted-foreground/60 font-mono select-none leading-[1.35rem]">
              {jsonInput.split("\n").map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value)
              }}
              className="w-full min-h-[200px] resize-none bg-transparent pl-10 pr-3 py-2.5 font-mono text-xs leading-[1.35rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-md"
              spellCheck={false}
              placeholder="Paste your JSON here..."
            />
          </div>
        </div>

        {/* File Upload Dropzone */}
        <div
          className={`flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/40"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.createElement("input")
            input.type = "file"
            input.accept = ".json,.csv"
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (event) => {
                  setJsonValue(event.target?.result as string)
                }
                reader.readAsText(file)
              }
            }
            input.click()
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground">
              Drop a file here or click to browse
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Supports JSON and CSV files
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <FileJson className="h-3 w-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">.json</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
              <FileSpreadsheet className="h-3 w-3 text-chart-2" />
              <span className="text-[10px] text-muted-foreground">.csv</span>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
