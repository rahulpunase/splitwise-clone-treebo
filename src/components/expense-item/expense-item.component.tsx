import React, {useContext, useEffect, useState} from 'react';
import WrapInCurrencySignComponent from "../wrap-in-currency-sign/wrap-in-currency-sign.component";
import {AuthContext} from "../../contexts/auth-context";
import "./expense-item.component.scss";



const ExpenseItemComponent = ({expense, deleteExpense}: any) => {

	const authCtx = useContext(AuthContext);
	const [amountToSettleByYou, setAmountToSettleByYou] = useState(0);

	const isSameUser = (expense: any, friend: any) =>  {
		return friend.id === expense.createdBy;
	}

	useEffect(() => {
		if (authCtx.loggedInUser) {
			const you = expense.friends.find((friend: any) => expense.createdBy === friend.id);
			if (you) {
				const calculateAmount = Math.floor(Number(you.amountTheyOwe) - Number(expense.totalAmount)/expense.friends.length);
				setAmountToSettleByYou(calculateAmount);
			}
		}
	}, [expense, authCtx]);

	return (
		<div className="expense-item__component">
			<div className="exp-holder">
				<div className="img"></div>
				<div className="info">
					<div className="row d-flex justify-content-between">
						<div className="col-xl-6 col-6 fr-row">
							<h6>Non-group Expense</h6>
							<div className="small"><i>Created at: </i></div>
						</div>
						<div className="col-xl-6 col-6 total-group-amount">
							<WrapInCurrencySignComponent value={expense.totalAmount}/>
							<button onClick={() => deleteExpense(expense.id)} className="btn btn-sm btn-danger"><i className="fa fa-trash-can"></i></button>
						</div>
					</div>
					<div className="row">
						<div className="col-xl-6">
							{expense.friends.map((frInfo: any) => <div className={`${isSameUser(expense, frInfo) ? 'highlight-user' : ''}`}>{isSameUser(expense, frInfo) ? 'You owe' : frInfo.name + ' owes'} <WrapInCurrencySignComponent value={frInfo.whenSplitEquallyAmount} /></div>)}
						</div>
					</div>
					<div className="row d-flex justify-content-center amount-detail">
						{amountToSettleByYou > 0 && <div className="receive-highlight col-8">Amount you'll receive <WrapInCurrencySignComponent value={amountToSettleByYou}/></div> }
						{amountToSettleByYou < 0 && <div className="owe-highlight col-8">Amount you owe to your friends <WrapInCurrencySignComponent value={Math.abs(amountToSettleByYou)}/></div> }
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExpenseItemComponent;
