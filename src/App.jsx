import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar";
import DataTableDemo from "@/components/Transaction";
import transactions from "/Users/aryanpatel/Desktop/personal_finance/src/data.json"; // Import the JSON data
import { CardWithForm } from "@/components/pots"; // Import the CardWithForm component

export default function Layout() {
  return (
    <Router>
      <SidebarProvider>
        <div style={{ display: "flex" }}>
          <AppSidebar />
          <main>
            <Routes>
              <Route path="/" element={<div>Welcome to the Dashboard</div>} />
              <Route path="/overview" element={<div>Overview Page</div>} />
              <Route path="/budget" element={<div>Budget Page</div>} />
              <Route
                path="/transactions"
                element={<DataTableDemo transactions={transactions} />}
              />
              <Route path="/pots" element={<CardWithForm />} />
              <Route
                path="/recurring-bills"
                element={<div>Recurring Bills Page</div>}
              />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}
