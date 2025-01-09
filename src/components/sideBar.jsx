import { Link } from "react-router-dom";
import OverviewIcon from "../assets/images/icon-nav-overview.svg";
import BudgetIcon from "../assets/images/icon-nav-budgets.svg";
import TransactionIcon from "../assets/images/icon-nav-transactions.svg";
import PotsIcon from "../assets/images/icon-nav-pots.svg";
import RecurringIcon from "../assets/images/icon-nav-recurring-bills.svg";
import LogoLarge from "../assets/images/logo-large.svg";

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
    <Sidebar>
      <SidebarContent className="bg-black text-2xl font-extrabold mb-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-lg font-bold px-4 py-2">
            <img src={LogoLarge} alt="Finance logo" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 pl-0 mb-4 last:mb-0"
                >
                  <SidebarMenuItem className="w-full border-l-2 border-[#277C78]">
                    <SidebarMenuButton
                      asChild
                      className="rounded-l-none toggle-switch"
                    >
                      <Link to={item.url}>
                        <img src={item.icon} alt={`${item.title} Icon`} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
