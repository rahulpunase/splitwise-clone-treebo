import React, { useContext, useEffect, useState} from "react";
import "./dashboard.page.scss";
import {AuthContext} from "../../../contexts/auth-context";
import db from "../../../db/db";
import WrapInCurrencySignComponent from "../../../components/wrap-in-currency-sign/wrap-in-currency-sign.component";
import ExpenseItemComponent from "../../../components/expense-item/expense-item.component";

const DashboardPage = () => {
	const authCtx = useContext(AuthContext);
	const [expenses, setExpenses] = useState<any[]>([]);
	const [totalExpenseAmount, setTotalExpenseAmount] = useState('0');
	const [amountYouGave, setAmountYouGave] = useState('0');
	const [amountYouOwe, setAmountYouOwe] = useState('0');
	const [amountYouReceive, setAmountYouReceive] = useState('0');

	useEffect(() => {
		if (authCtx.loggedInUser) {
			db.fetchExpensesFromCreatedByUser(authCtx.loggedInUser.id)
				.then(expenses => {
					setExpenses(expenses);
				});
		}
	}, []);

	/**
	 * Gets called when deleting expense
	 */
	const deleteExpense = (expenseId: string): void => {
		if (authCtx.loggedInUser) {
			db.deleteExpense(expenseId, authCtx.loggedInUser.id).then(expenses => {
				authCtx.showNotification("Expense deleted", 500);
				setExpenses(expenses)
			});
		}
	}

	const calculateTotalAmount = (expenses: any[]): void => {
		const totalAmount = expenses.map(expense => Number(expense.totalAmount)).reduce((a, b) => a + b, 0);
		setTotalExpenseAmount(totalAmount.toFixed(2));
	}

	/**
	 * Calculates the amount you gave
	 */
	const calculateAmountYouGave = (expenses: any[]): void => {
		const _amountYouGave = expenses.map(expense => {
			const you = expense.friends.find((friend: any) => friend.id === authCtx.loggedInUser?.id);
			if (you) {
				return Number(you.amountTheyGave);
			} else {
				return 0;
			}
		}).reduce((a, b) => a + b, 0);
		setAmountYouGave(_amountYouGave.toFixed(2));
	}

	/**
	 * Calculates the amount you owe
	 */
	const calculateTheAmountYouOwe = (expense: any[]): void => {
		const _amountYouOwe = expenses.map(expense => {
			const you = expense.friends.find((friend: any) => expense.createdBy === friend.id);
			if (you) {
				const amount = (Math.floor(Number(you.amountTheyGave) - Number(expense.totalAmount)/expense.friends.length));
				return amount < 0 ? amount : 0;
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
		setAmountYouOwe(Math.abs(_amountYouOwe).toFixed(2));
	}

	/**
	 * Calculates the amount you receive
	 */
	const calculateTheAmountYouReceive = (expense: any[]): void => {
		const _amountYouReceive = expenses.map(expense => {
			const you = expense.friends.find((friend: any) => expense.createdBy === friend.id);
			if (you) {
				const amount = (Math.floor(Number(you.amountTheyGave) - Number(expense.totalAmount)/expense.friends.length));
				return amount > 0 ? amount : 0;
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
		setAmountYouReceive(_amountYouReceive.toFixed(2));
	}

	useEffect(() => {
		calculateTotalAmount(expenses);
		calculateAmountYouGave(expenses);
		calculateTheAmountYouOwe(expenses);
		calculateTheAmountYouReceive(expenses);
	}, [expenses]);

	return (
		<div className="dashboard__page">
			<h2>Welcome to your dashboard {authCtx.loggedInUser?.name}</h2>
			<div className="row g-0 margin-bottom theme-font-color">
				<div className="col-md-3 col-6">
					<div><small>Total Expenses</small></div>
					<div><WrapInCurrencySignComponent value={totalExpenseAmount}/></div>
				</div>
				<div className="col-md-3 col-6">
					<div><small>Amount you receive</small></div>
					<div><WrapInCurrencySignComponent value={amountYouReceive}/></div>
				</div>
				<div className="col-md-3 col-6">
					<div><small>Amount you owe</small></div>
					<div><WrapInCurrencySignComponent value={amountYouOwe}/></div>
				</div>
				<div className="col-md-3 col-6">
					<div><small>Amount you gave</small></div>
					<div><WrapInCurrencySignComponent value={amountYouGave}/></div>
				</div>
			</div>
			<div className="row g-0">
				{!expenses.length && <div className="no-expenses theme-font-color">
					<div className="in-center-ex-icon">
						<div><i className="fa fa-list"/></div>
						<div><small>The expenses will appear here</small></div>
					</div>
				</div>}
				<ul className="list-group list-group-flush">
					{
						expenses.map(
							expense => <li key={expense.id} className="list-group-item">
								<ExpenseItemComponent
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
