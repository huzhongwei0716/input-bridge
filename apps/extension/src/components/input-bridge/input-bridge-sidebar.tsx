"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, GitBranch, ChevronRight, ChevronLeft } from "lucide-react"
import { SidebarHeader } from "./sidebar-header"
import { DataSourceTab } from "./data-source-tab"
import { MappingTab } from "./mapping-tab"
import { SidebarFooter } from "./sidebar-footer"
import { useStore } from "@/content/store"
import { domInteractive } from "@/content/DomInteractive"

export function InputBridgeSidebar() {
  const { isOpen, toggleSidebar, parsedData, mappings } = useStore()

  const handleFill = () => {
    if (!parsedData) return;
    const fillMap: Record<string, any> = {};
    Object.entries(mappings).forEach(([key, selector]) => {
      const value = parsedData[key];
      if (value !== undefined) {
        fillMap[selector] = value;
      }
    });
    domInteractive.fillForm(fillMap);
  };

  const canFill = !!parsedData && Object.keys(mappings).length > 0

  if (!isOpen) {
    return (
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-[999999] bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="fixed top-0 right-0 h-screen w-[380px] flex flex-col border-l border-border bg-card shadow-2xl z-[999999] text-foreground font-sans box-border">
         {/* Toggle Button (inside sidebar to close) */}
         <button 
            onClick={toggleSidebar} 
            className="absolute -left-10 top-4 bg-card border border-border text-muted-foreground p-2 rounded-l-md shadow-md hover:text-foreground transition-colors"
         >
           <ChevronRight size={20} />
         </button>

        <SidebarHeader connectedTo="Connected to Page" />

        <Tabs defaultValue="mapping" className="flex flex-1 flex-col min-h-0">
          <div className="border-b border-border px-3 pt-1">
            <TabsList className="h-8 w-full bg-transparent p-0 gap-1">
              <TabsTrigger
                value="source"
                className="h-7 flex-1 gap-1.5 rounded-md bg-transparent px-3 text-[11px] font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <Database className="h-3 w-3" />
                Data Source
              </TabsTrigger>
              <TabsTrigger
                value="mapping"
                className="h-7 flex-1 gap-1.5 rounded-md bg-transparent px-3 text-[11px] font-medium text-muted-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <GitBranch className="h-3 w-3" />
                Mapping
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="source"
            className="flex-1 mt-0 data-[state=inactive]:hidden"
          >
            <DataSourceTab />
          </TabsContent>

          <TabsContent
            value="mapping"
            className="flex-1 mt-0 min-h-0 data-[state=inactive]:hidden"
          >
            <MappingTab />
          </TabsContent>
        </Tabs>

        <SidebarFooter onFill={handleFill} canFill={canFill} />
      </aside>
    </TooltipProvider>
  )
}
