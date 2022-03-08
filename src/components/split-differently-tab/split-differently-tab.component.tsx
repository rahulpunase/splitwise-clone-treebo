import React, {useContext, useEffect, useState} from 'react';
import {IFriend, IUser} from "../../db/db";
import {AuthContext} from "../../contexts/auth-context";
import Utils from "../../utils/utils";
import "./split-differently-tab.component.scss";
import WrapInCurrencySignComponent from "../wrap-in-currency-sign/wrap-in-currency-sign.component";

export interface ISplitDifferentlyTabComponent {
	selectedFriends: IFriend[];
	totalAmount: string;
}

const SplitDifferentlyTabComponent = (props: ISplitDifferentlyTabComponent) => {
	const authCtx = useContext(AuthContext);
	const [listOfFriends, setListOfFriends] = useState(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		props.selectedFriends, props.totalAmount));
	const [amountToSettle, setAmountToSettle] = useState('0');
	const [isAllChecked, setIsAllChecked] = useState(true);

	useEffect(() => {
		setListOfFriends(Utils.mergeUserAndFriends(authCtx.loggedInUser, props.selectedFriends, props.totalAmount));
	}, [props]);


	const onChangeHandler = (friend: IUser | IFriend) => {
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({
			..._friend,
			isChecked: friend.id === _friend.id ? !_friend.isChecked : _friend.isChecked,
			whenSplitDifferentlyAmount: _friend.isChecked ? '0' : _friend.whenSplitDifferentlyAmount
		}));
		setListOfFriends(newListOfFriends);
		// const filteredFriends = newListOfFriends.filter(friend => friend.isChecked);
	}

	const allCheckedHandler = () => {
		const _listOfFriends = [...listOfFriends];
		const newListOfFriends = _listOfFriends.map(_friend => ({..._friend, isChecked: !isAllChecked}));
		setListOfFriends(newListOfFriends);
		setIsAllChecked(!isAllChecked);
		const totalSummedAmount = _listOfFriends.map(friends => Number(friends.whenSplitDifferentlyAmount))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle((Number(props.totalAmount) - totalSummedAmount).toFixed(2).toString());
	}

	const splitDifferentlyAmountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, friend: IUser | IFriend) => {
		let value = event.target.value;
		if (value[0] == "0") {
			console.log("worked");
			value = value.substring(1, value.length);
		}
		const _listOfFriends = [...listOfFriends];
		const tempFriend = _listOfFriends.find(_friend => _friend.id === friend.id);
		if (tempFriend) {
			tempFriend.whenSplitDifferentlyAmount = value;
		}
		const totalSummedAmount = _listOfFriends.map(friends => Number(friends.whenSplitDifferentlyAmount))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle((Number(props.totalAmount) - totalSummedAmount).toFixed(2).toString());
		setListOfFriends(_listOfFriends);
	}

	const isAmountSettled = () => {
		return Number(amountToSettle) === 0;
	}

	const addExpenseToDb = () => {}


	return (
		<div className="split-differently-tab__component">
			<div className="content">
				<ul className="list-group">
					<li className="list-group-item d-flex justify-content-between">
						<div>
							<input checked={isAllChecked} onChange={allCheckedHandler} type="checkbox"/>&nbsp;<span>All</span>
						</div>
						<div>
							<span className={`${isAmountSettled() ? 'settled' : ''}`}>Amount to settle: <WrapInCurrencySignComponent value={amountToSettle}/></span>
						</div>
					</li>
					{listOfFriends.map(friend => <li key={friend.id} className="list-group-item">
						<div className="in-list d-flex flex-column justify-content-between">
							<div>
								<label><input type="checkbox" onChange={() => onChangeHandler(friend)}
									checked={friend.isChecked}/>&nbsp;{friend.name}</label>
							</div>
							<input className="form-control number-data"
							       onChange={(event) => splitDifferentlyAmountChangeHandler(event, friend)}
							       type="number" value={friend.whenSplitDifferentlyAmount}/>
						</div>
					</li>)}
				</ul>
				<div className="row">
					<div className="col-md-12 g-0">
						<button className="btn btn-success" disabled={!isAmountSettled()} onClick={addExpenseToDb}>Add Expense</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplitDifferentlyTabComponent;
