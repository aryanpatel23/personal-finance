// src/components/Budgets.jsx
import React, { useState } from 'react';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [budget, setBudget] = useState({ name: '', amount: '' });

    const addBudget = () => {
        setBudgets([...budgets, { ...budget, id: budgets.length + 1 }]);
        setBudget({ name: '', amount: '' });
    };

    return (
        <div className="budgets">
            <h2>Budgets</h2>
            <div>
                <input
                    type="text"
                    placeholder="Budget Name"
                    value={budget.name}
                    onChange={(e) => setBudget({ ...budget, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={budget.amount}
                    onChange={(e) => setBudget({ ...budget, amount: e.target.value })}
                />
                <button onClick={addBudget}>Add Budget</button>
            </div>
            <ul>
                {budgets.map((b) => (
                    <li key={b.id}>
                        {b.name}: ${b.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Budgets;
