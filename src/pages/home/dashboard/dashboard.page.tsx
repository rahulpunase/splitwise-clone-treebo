import React, {createContext, useContext, useEffect, useState} from 'react';
import './dashboard.page.scss';
import {AuthContext} from "../../../contexts/auth-context";
import db from "../../../db/db";
import WrapInCurrencySignComponent from "../../../components/wrap-in-currency-sign/wrap-in-currency-sign.component";
import ExpenseItemComponent from "../../../components/expense-item/expense-item.component";

const DashboardPage = () => {
	const authCtx = useContext(AuthContext);
	const [expenses, setExpenses] = useState<any[]>([]);

	useEffect(() => {
		if (authCtx.loggedInUser) {
			db.fetchExpensesFromCreatedByUser(authCtx.loggedInUser.id)
				.then(expenses => {
					console.log(expenses);
					setExpenses(expenses);
				});
		}
	}, []);

	const deleteExpense = (expenseId: string) => {
		if (authCtx.loggedInUser) {
			db.deleteExpense(expenseId, authCtx.loggedInUser.id).then(expenses => setExpenses(expenses));
		}
	}

	return (
		<div className="dashboard__page">
			<h2>Welcome to you dashboard {authCtx.loggedInUser?.name}</h2>
			<div className="row g-0">
				<div className="col-md-4 col-6">
					<span>You are owed <b><WrapInCurrencySignComponent value={75}/></b></span>
				</div>
				<div className="col-md-4 col-6">
					<span>You are owed <b><WrapInCurrencySignComponent value={75}/></b></span>
				</div>
			</div>
			<div className="row g-0">
				<ul className="list-group">
					{
						expenses.map(
							expense => <li className="list-group-item">
								<ExpenseItemComponent
									key={expense.id}
									expense={expense}
									deleteExpense={deleteExpense}
								/>
							</li>
						)
					}
				</ul>
			</div>
		</div>
	);
};

export default DashboardPage;
