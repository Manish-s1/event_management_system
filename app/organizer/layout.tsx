import { AppSidebar } from "./components/app-sidebar"
import { LogoutButton } from "./components/LogoutButton"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-svh">
          <header className="border-b bg-white sticky top-0 z-20">
            <div className="flex h-14 items-center gap-2 px-4">
              <SidebarTrigger />
              <span className="font-semibold">Organizer Panel</span>
              <div className="ml-auto">
                <LogoutButton />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
