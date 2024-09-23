import SideBar from "./_components/side-bar";

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {

  return (
    <section className="relative flex h-screen overflow-y-hidden">
      <SideBar />

      <div className="size-full overflow-y-scroll p-5 lg:p-10">{children}</div>
    </section>
  )
}