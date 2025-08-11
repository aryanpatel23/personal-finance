import React from "react";
import data from "/Users/aryanpatel/Desktop/personal_finance/src/data.json";
import { PieChart, Pie, Cell, Label } from "recharts";
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
    <div className="bg-[#F4F6FA] min-h-screen flex">
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
        {/* Pots & Budgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 w-full">
          {/* Pots */}
          <div className="bg-white rounded-xl p-12 flex flex-col gap-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-[#201F24]">Pots</span>
              <span className="text-sm text-[#888] flex items-center gap-1 cursor-pointer hover:underline">
                See Details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
            <div className="bg-[#F9F7F4] rounded-lg p-6 flex items-center gap-6 mb-6">
              <span className="bg-[#E6F2EF] p-3 rounded-full">
                <svg width="32" height="32" fill="none">
                  <rect width="32" height="32" rx="16" fill="#E6F2EF" />
                  <path
                    d="M16 10v8"
                    stroke="#277C78"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="22" r="2" fill="#277C78" />
                </svg>
              </span>
              <div>
                <div className="text-xs text-[#888]">Total Saved</div>
                <div className="text-2xl font-bold text-[#201F24]">
                  ${totalSaved.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {pots.slice(0, 4).map((pot) => (
                <div key={pot.name} className="flex flex-col gap-1">
                  <span className="text-xs text-[#888]">{pot.name}</span>
                  <span className="text-lg font-bold text-[#201F24]">
                    ${pot.total.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Budgets */}
          <div className="bg-white rounded-xl p-12 flex flex-col gap-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-[#201F24]">Budgets</span>
              <span className="text-sm text-[#888] flex items-center gap-1 cursor-pointer hover:underline">
                See Details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <PieChart width={320} height={320}>
                  <Pie
                    data={chartData}
                    dataKey="spent"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
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
                                className="fill-foreground text-2xl font-bold"
                              >
                                ${totalSpent}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-base"
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
              {/* Legend */}
              <div className="w-full flex flex-col gap-4 mt-6">
                {spentByCategory.map((b) => (
                  <div key={b.category} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{
                        background:
                          b.theme || categoryColors[b.category] || "#ccc",
                      }}
                    ></span>
                    <span className="text-[#201F24] text-sm w-24 truncate">
                      {b.category}
                    </span>
                    <span className="text-[#201F24] text-sm font-bold">
                      ${b.spent.toFixed(2)}
                    </span>
                    <span className="text-[#B3B3B3] text-xs">
                      of ${b.maximum.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Transactions */}
        <div className="bg-white rounded-xl p-12 w-full min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-[#201F24]">
              Transactions
            </span>
            <span className="text-sm text-[#888] flex items-center gap-1 cursor-pointer hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {latestTx.map((t, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <img
                  src={t.avatar.replace("./src", "/src")}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-[#201F24]">{t.name}</div>
                  <div className="text-xs text-[#888]">
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
      </main>
    </div>
  );
}
