import React from "react";
import { Link } from "react-router-dom";
import data from "../data.json";
import { PieChart, Pie, Cell, Label } from "recharts";
import potIcon from "/images/icon-pot.svg";
import { ChevronRight } from "lucide-react";

const categoryColors = {
  Entertainment: "#277C78",
  Bills: "#82C9D7",
  "Dining Out": "#F2CDAC",
  "Personal Care": "#626070",
};

export default function Overview() {
  // Balance
  const { current, income, expenses } = data.balance;

  // Pots
  const pots = data.pots;
  const totalSaved = pots.reduce((sum, p) => sum + p.total, 0);

  // Budgets
  const budgets = data.budgets;
  const transactions = data.transactions;
  const spentByCategory = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { ...budget, spent };
  });
  const totalSpent = spentByCategory.reduce((sum, b) => sum + b.spent, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);
  const chartData = spentByCategory.map((b) => ({
    category: b.category,
    spent: b.spent,
    fill: b.theme || categoryColors[b.category] || "#ccc",
  }));

  // Transactions (latest 5)
  const latestTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    // <div className="bg-[#F4F6FA] min-h-screen flex">
    <main className="flex-1 p-8 w-full max-w-full">
      <h1 className="text-3xl font-bold mb-8 text-[#201F24]">Overview</h1>
      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        <div className="bg-black text-white rounded-xl p-8 flex flex-col justify-center min-h-[180px]">
          <span className="text-xl mb-3">Current Balance</span>
          <span className="text-4xl font-bold">
            ${current.toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-xl p-8 flex flex-col justify-center min-h-[180px]">
          <span className="text-xl text-[#888] mb-3">Income</span>
          <span className="text-4xl font-bold text-[#201F24]">
            ${income.toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-xl p-8 flex flex-col justify-center min-h-[180px]">
          <span className="text-xl text-[#888] mb-3">Expenses</span>
          <span className="text-4xl font-bold text-[#201F24]">
            ${expenses.toLocaleString()}
          </span>
        </div>
      </div>
      {/* Four Section Layout using Flexbox */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-8 lg:w-1/2">
          {/* Pots - Smaller height */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#201F24]">Pots</span>
              <Link
                to="/pots"
                className="text-sm text-[#277C78] flex items-center gap-1 cursor-pointer hover:underline font-medium"
              >
                See Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-6">
              {/* Total Saved Card */}
              <div class="bg-[#F8F4F0] min-h-[110px] rounded-xl flex items-center justify-center basis-[50%] py-4 pr-4">
                <div className="flex items-center gap-3">
                  <img src={potIcon} alt="Pot Icon" width={32} height={32} />

                  <div className="text-center">
                    <div className="text-xs text-[#888] mb-1">Total Saved</div>
                    <div className="text-2xl font-bold text-[#201F24]">
                      ${totalSaved.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              {/* Individual Pots List */}
              <div className="w-full max-w-[350px] mx-auto grid grid-cols-2 gap-x-10 gap-y-4">
                {pots.slice(0, 4).map((pot) => (
                  <div
                    key={pot.name}
                    className="flex justify-between items-center"
                  >
                    {/* Colored vertical bar */}
                    <div
                      className="w-1.5 h-6 rounded mr-3"
                      style={{
                        backgroundColor: pot.theme || "#277C78",
                        minWidth: "6px",
                        minHeight: "24px",
                      }}
                    ></div>
                    {/* Label */}
                    <span className="text-[#201F24] text-base font-medium mr-auto">
                      {pot.name}
                    </span>
                    {/* Amount */}
                    <span className="text-[#201F24] text-base font-bold ml-4">
                      ${pot.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#201F24]">
                Transactions
              </span>
              <Link
                to="/transactions"
                className="text-sm text-[#277C78] flex items-center gap-1 cursor-pointer hover:underline font-medium"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              {latestTx.slice(0, 6).map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={t.avatar.replace("./src", "/src")}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-[#201F24] text-base">
                      {t.name}
                    </div>
                    <div className="text-sm text-[#888]">
                      {new Date(t.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      t.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.amount > 0 ? "+" : "-"}$
                    {Math.abs(t.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8 lg:w-1/2">
          {/* Budgets */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#201F24]">Budgets</span>
              <Link
                to="/budget"
                className="text-sm text-[#277C78] flex items-center gap-1 cursor-pointer hover:underline font-medium"
              >
                View More <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Add negative margin top to pull chart upward */}
            <div className="relative w-full max-w-[350px] mx-auto -mt-10 flex items-center justify-center">
              <PieChart width={350} height={350}>
                <Pie
                  data={chartData}
                  dataKey="spent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              ${totalSpent}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 32}
                              className="fill-muted-foreground text-lg"
                            >
                              of ${totalBudget} limit
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                  {chartData.map((entry, idx) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            {/* Legend - Budgets */}
            <div className="w-full max-w-[350px] mx-auto grid grid-cols-2 gap-x-10 gap-y-4 mt-8">
              {spentByCategory.map((b) => (
                <div
                  key={b.category}
                  className="flex justify-between items-center"
                >
                  {/* Colored vertical bar */}
                  <div
                    className="w-1.5 h-6 rounded mr-3"
                    style={{
                      backgroundColor:
                        b.theme || categoryColors[b.category] || "#ccc",
                    }}
                  ></div>
                  {/* Label */}
                  <span className="text-[#201F24] text-base font-medium mr-auto">
                    {b.category}
                  </span>
                  {/* Amount */}
                  <span className="text-[#201F24] text-base font-bold ml-4">
                    ${b.spent.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Bills */}
          <div className="bg-white rounded-xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#201F24]">
                Recurring Bills
              </span>
              <Link
                to="/recurring-bills"
                className="text-sm text-[#277C78] flex items-center gap-1 cursor-pointer hover:underline font-medium"
              >
                See Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {/* Paid Bills */}
              <div className="bg-[#F8F4F0] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#201F24] font-medium">
                    Paid Bills
                  </span>
                  <span className="text-lg font-bold text-[#201F24]">
                    $190.00
                  </span>
                </div>
              </div>
              {/* Total Upcoming */}
              <div className="bg-[#F8F4F0] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#201F24] font-medium">
                    Total Upcoming
                  </span>
                  <span className="text-lg font-bold text-[#201F24]">
                    $194.00
                  </span>
                </div>
              </div>
              {/* Due Soon */}
              <div className="bg-[#F8F4F0] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#201F24] font-medium text-red-600">
                    Due Soon
                  </span>
                  <span className="text-lg font-bold text-red-600">$59.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    // </div>
  );
}
