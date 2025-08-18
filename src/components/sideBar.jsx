import { Link } from "react-router-dom";
import OverviewIcon from "/images/icon-nav-overview.svg";
import BudgetIcon from "/images/icon-nav-budgets.svg";
import TransactionIcon from "/images/icon-nav-transactions.svg";
import PotsIcon from "/images/icon-nav-pots.svg";
import RecurringIcon from "/images/icon-nav-recurring-bills.svg";
import LogoLarge from "/images/logo-large.svg";
import { useSidebar } from "@/components/ui/sidebar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/overview", icon: OverviewIcon },
  { title: "Budget", url: "/budget", icon: BudgetIcon },
  { title: "Transactions", url: "/transactions", icon: TransactionIcon },
  { title: "Pots", url: "/pots", icon: PotsIcon },
  { title: "Recurring Bills", url: "/recurring-bills", icon: RecurringIcon },
];

export function AppSidebar() {
  return (
    <Sidebar className="hidden h-screen fixed top-0 left-0 z-10 lg:block bg-[#201F24] rounded-tr-xl  duration-500 transition-[width] w-[300px] ">
      <SidebarContent className="bg-[#201F24] text-2xl font-extrabold mb-4">
        <SidebarGroup className="w-[292px]">
          <SidebarGroupLabel className="text-white text-lg font-bold px-5 py-12 pt-8">
            <div class="pt-6 ">
              <img src={LogoLarge} width="100" height="50" alt="Finance logo" />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 pl-0 mb-4 last:mb-0"
                >
                  <div className="py-3 w-full h-[5px] flex flex-col  max-w-[95%]">
                    <SidebarMenuItem className=" border-l-2 border-[#277C78]">
                      <SidebarMenuButton
                        asChild
                        className="rounded-l-none toggle-switch flex gap-3 text-[#B3B3B3] items-center py-3 px-6 font-medium rounded-tr-[9px] text-sm rounded-br-[9px] duration-1000 delay-1000 transition-[display]"
                      >
                        <Link to={item.url}>
                          <img src={item.icon} alt={`${item.title} Icon`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
