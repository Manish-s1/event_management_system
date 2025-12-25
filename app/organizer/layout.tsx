import { AppSidebar } from "./components/app-sidebar"
import { LogoutButton } from "./components/LogoutButton"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 overflow-auto">
        <div className="flex flex-col h-full">
          <header className="border-b bg-white sticky top-0 z-20 shadow-sm">
            <div className="flex h-16 items-center gap-2 px-6">
              <SidebarTrigger />
              <span className="font-bold text-lg">Organizer Panel</span>
              <div className="ml-auto">
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-slate-50">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
}
