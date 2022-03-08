import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../contexts/auth-context";
import db, {IFriend, IFriendToAddToDb, IUser} from "../../db/db";
import Utils from "../../utils/utils";
import WrapInCurrencySignComponent from "../wrap-in-currency-sign/wrap-in-currency-sign.component";
import {useDispatch} from "react-redux";
import {_addInProgressExpenses} from "../../store/reducers/add-expense.action";

export interface ISplitEquallyComponent {
	totalAmount: string;
	selectedFriends: IFriend[];
	addExpenseToDb: (friends: any[]) => void
}

const SplitEquallyComponent = (props: ISplitEquallyComponent) => {
	const dispatch = useDispatch();
	const {totalAmount, selectedFriends} = props;
	const authCtx = useContext(AuthContext);
	const [listOfFriends, setListOfFriends] = useState(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		selectedFriends, props.totalAmount));
	const [isAllChecked, setIsAllChecked] = useState(true);

	useEffect(() => {
		setListOfFriends(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		props.selectedFriends, props.totalAmount));
	}, [props]);

	useEffect(() => {
		const _listOfFriends = [...listOfFriends];
		const newListOfFriends = _listOfFriends.map(_friend => ({..._friend, isChecked: isAllChecked}));
		setListOfFriends(newListOfFriends);
	}, [isAllChecked]);

	// useEffect(() => {
	// 	return () => {
	// 		dispatch(_addInProgressExpenses(selectedFriends))
	// 	}
	// }, []);

	const allCheckedHandler = () => {
		setIsAllChecked(!isAllChecked);
	}

	const onChangeHandler = (friend: IUser | IFriend) => {
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({
			..._friend,
			isChecked: friend.id === _friend.id ? !_friend.isChecked: _friend.isChecked
		}));
		const filteredFriends = newListOfFriends.filter(friend => friend.isChecked);
		newListOfFriends = newListOfFriends.map(_friend => ({
			..._friend,
			whenSplitEquallyAmount: Utils.convertToFixed(Number(totalAmount)/filteredFriends.length)
		}))
		setListOfFriends(newListOfFriends);
	}

	const addExpenseToDb = () => {
		const friends = listOfFriends.map(friend => ({
			...friend,
			amountTheyOwe: friend.whenSplitEquallyAmount
		}));
		props.addExpenseToDb(friends);
	}

	return (
		<div className="content">
			<ul className="list-group">
				<li className="list-group-item d-flex justify-content-between">
					<div><label><input checked={isAllChecked} onChange={allCheckedHandler}
						type="checkbox"/>&nbsp;
						All</label></div>
				</li>
				{listOfFriends.map(friend => <li key={friend.id} className="list-group-item">
					<div className="in-list d-flex justify-content-between align-items-center">
						<div>
							<label><input type="checkbox" onChange={() => onChangeHandler(friend)}
								checked={friend.isChecked}/>&nbsp;{friend.name}</label>
						</div>
						<div>
							<b><WrapInCurrencySignComponent
								value={friend.isChecked ? friend.whenSplitEquallyAmount : '0.00'}/></b>
						</div>
					</div>
				</li>)}
			</ul>
			<div className="row">
				<div className="col-md-12 g-0">
					<button className="btn btn-success" onClick={addExpenseToDb}>Add Expense</button>
				</div>
			</div>
		</div>
	)
};

export default SplitEquallyComponent;
