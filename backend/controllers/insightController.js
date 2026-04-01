const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Income = require('../models/Income');

const mockInsights = {
  healthScore: 72,
  insights: [
    'Your spending is within budget for most categories this month.',
    'Dining expenses account for a significant portion of your discretionary spending.',
    'You have maintained a positive savings rate over the last 30 days.',
  ],
  alert: 'Entertainment spending is approaching your monthly budget limit.',
  recommendation: 'Consider setting up automatic transfers to a savings account on payday to build your emergency fund.',
};

exports.getInsights = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [transactions, budgets, incomeRecords] = await Promise.all([
      Transaction.find({ userId: req.user.id, date: { $gte: thirtyDaysAgo } }).sort({ date: -1 }),
      Budget.find({ userId: req.user.id }),
      Income.find({ userId: req.user.id }),
    ]);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categorySpend = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categorySpend[t.category] = (categorySpend[t.category] || 0) + t.amount;
      });

    const topCategories = Object.entries(categorySpend)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    if (!process.env.GEMINI_API_KEY) {
      return res.json(mockInsights);
    }

    const budgetSummary = budgets
      .map((b) => `${b.category}: budget $${b.maximum}, spent $${categorySpend[b.category] || 0}`)
      .join('; ');

    const monthlyIncome = incomeRecords.reduce((sum, i) => {
      const multipliers = { weekly: 4.33, biweekly: 2.17, monthly: 1, yearly: 1 / 12 };
      return sum + i.amount * (multipliers[i.frequency] || 1);
    }, 0);

    const prompt = `You are a personal finance advisor. Analyze the following financial data for the last 30 days and provide structured insights.

Financial Summary:
- Total income from transactions: $${totalIncome.toFixed(2)}
- Total expenses: $${totalExpenses.toFixed(2)}
- Net: $${(totalIncome - totalExpenses).toFixed(2)}
- Estimated monthly income (from income records): $${monthlyIncome.toFixed(2)}
- Top spending categories: ${topCategories.map((c) => `${c.category} $${c.amount.toFixed(2)}`).join(', ')}
- Budget overview: ${budgetSummary || 'No budgets set'}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "healthScore": <integer 0-100>,
  "insights": [
    "<insight 1, one concise sentence>",
    "<insight 2, one concise sentence>",
    "<insight 3, one concise sentence>"
  ],
  "alert": "<one sentence warning or null if no alert>",
  "recommendation": "<one actionable recommendation sentence>"
}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Strip markdown code fences if present
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return res.json(mockInsights);
      }
    }

    res.json({
      healthScore: parsed.healthScore ?? mockInsights.healthScore,
      insights: parsed.insights ?? mockInsights.insights,
      alert: parsed.alert ?? null,
      recommendation: parsed.recommendation ?? mockInsights.recommendation,
    });
  } catch (err) {
    console.error('Insights error:', err.message);
    res.json(mockInsights);
  }
};
