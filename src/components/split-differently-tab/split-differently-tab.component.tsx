import React, {useContext, useEffect, useState} from "react";
import {IFriend, IUser} from "../../db/db";
import {AuthContext} from "../../contexts/auth-context";
import Utils from "../../utils/utils";
import "./split-differently-tab.component.scss";
import WrapInCurrencySignComponent from "../wrap-in-currency-sign/wrap-in-currency-sign.component";

export interface ISplitDifferentlyTabComponent {
	selectedFriends: IFriend[];
	totalAmount: string;
	addExpenseToDb: (friends: any[]) => void;
}

const SplitDifferentlyTabComponent = (props: ISplitDifferentlyTabComponent) => {
	const {totalAmount, selectedFriends} = props;

	const authCtx = useContext(AuthContext);

	const [listOfFriends, setListOfFriends] = useState(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		selectedFriends, totalAmount));
	const [amountToSettle, setAmountToSettle] = useState("0");
	const [isAllChecked, setIsAllChecked] = useState(true);

	/**
	 * Gets called when individual checkbox is changed
	 */
	const onChangeHandler = (friend: IUser | IFriend): void => {
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({
			..._friend,
			isChecked: friend.id === _friend.id ? !_friend.isChecked : _friend.isChecked,
			amountTheyGave: friend.id === _friend.id ? _friend.isChecked ? "0" : _friend.amountTheyGave : _friend.amountTheyGave
		}));
		const filteredFriends = newListOfFriends.filter(friend => friend.isChecked);
		const totalSummedAmount = Utils.getTotalSumOfFriends(newListOfFriends);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
		setListOfFriends(newListOfFriends);
		setIsAllChecked(filteredFriends.length === _listOfFriends.length);

	}

	/**
	 * Gets called all checkbox is changed
	 */
	const allCheckedHandler = (): void => {
		setIsAllChecked(!isAllChecked);
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({..._friend, isChecked: !isAllChecked}));
		const filteredFriends = newListOfFriends.filter(friend => friend.isChecked);
		newListOfFriends = newListOfFriends.map(_friend => ({
			..._friend,
			amountTheyGave: filteredFriends.length ? Utils.getDividedNumber(totalAmount, filteredFriends.length) : "0"
		}));
		const totalSummedAmount = Utils.getTotalSumOfFriends(newListOfFriends);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
	}


	/**
	 * Gets called input changes are made
	 */
	const splitDifferentlyAmountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, friend: IUser | IFriend): void => {
		let {value} = event.target;
		if (Number(value) < 0) {
			return;
		}
		const _listOfFriends = [...listOfFriends];
		const tempFriend = _listOfFriends.find(_friend => _friend.id === friend.id);
		if (tempFriend) {
			tempFriend.amountTheyGave = value;
		}
		const totalSummedAmount = Utils.getTotalSumOfFriends(_listOfFriends);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
		setListOfFriends(_listOfFriends);
	}

	const isAmountSettled = (): boolean => {
		return Number(amountToSettle) === 0;
	}

	/**
	 * Called by parent component <AddExpensesPage/>
	 */
	const addExpenseToDb = (): void => {
		props.addExpenseToDb(listOfFriends);
	}

	useEffect(() => {
		setListOfFriends(Utils.mergeUserAndFriends(authCtx.loggedInUser, props.selectedFriends, props.totalAmount));
		setAmountToSettle("0");
	}, [props]);


	return (
		<div className="split-differently-tab__component">
			<div className="content">
				<ul className="list-group">
					<li className="list-group-item d-flex justify-content-between">
						<div>
							<input checked={isAllChecked} className="form-check-input me-1" onChange={allCheckedHandler}
							       type="checkbox"/>&nbsp;
							<span>All</span>
						</div>
						<div>
							<span
								className={`${isAmountSettled() ? "settled" : ""}`}>Amount to settle: <WrapInCurrencySignComponent
								value={amountToSettle}/></span>
						</div>
					</li>
					{listOfFriends.map(friend => <li key={friend.id} className="list-group-item">
						<div className="in-list d-flex flex-column justify-content-between">
							<div>
								<label><input type="checkbox" className="form-check-input me-1"
								              onChange={() => onChangeHandler(friend)}
								              checked={friend.isChecked}/>&nbsp;{friend.name}</label>
							</div>
							<input className="form-control number-data"
							       onChange={(event) => splitDifferentlyAmountChangeHandler(event, friend)}
							       disabled={!friend.isChecked}
							       type="number" value={friend.amountTheyGave}/>
						</div>
					</li>)}
				</ul>
				<div className="row">
					<div className="col-md-12 g-0">
						<button className="btn btn-success" disabled={!isAmountSettled() || !Number(totalAmount)}
						        onClick={addExpenseToDb}>Add Expense</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplitDifferentlyTabComponent;
