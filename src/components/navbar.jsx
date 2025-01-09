// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav className="navbar">
        <h1>Personal Finance</h1>
        <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            <li><Link to="/budgets">Budgets</Link></li>
            <li><Link to="/reports">Reports</Link></li>
        </ul>
    </nav>
);

export default Navbar;
