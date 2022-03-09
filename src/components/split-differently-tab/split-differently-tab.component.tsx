import React, {useContext, useEffect, useState} from 'react';
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
	const authCtx = useContext(AuthContext);
	const {totalAmount, selectedFriends} = props;

	const [listOfFriends, setListOfFriends] = useState(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		selectedFriends, totalAmount));
	const [amountToSettle, setAmountToSettle] = useState('0');
	const [isAllChecked, setIsAllChecked] = useState(true);

	useEffect(() => {
		setListOfFriends(Utils.mergeUserAndFriends(authCtx.loggedInUser, props.selectedFriends, props.totalAmount));
		setAmountToSettle('0');
	}, [props]);


	const onChangeHandler = (friend: IUser | IFriend) => {
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({
			..._friend,
			isChecked: friend.id === _friend.id ? !_friend.isChecked : _friend.isChecked,
			amountTheyGave: friend.id === _friend.id ? _friend.isChecked ? '0' : _friend.amountTheyGave : _friend.amountTheyGave
		}));
		const totalSummedAmount = newListOfFriends.map(friends => Number(friends.amountTheyGave))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
		setListOfFriends(newListOfFriends);
	}

	const allCheckedHandler = () => {
		const _listOfFriends = [...listOfFriends];
		const newListOfFriends = _listOfFriends.map(_friend => ({..._friend, isChecked: !isAllChecked}));
		setListOfFriends(newListOfFriends);
		setIsAllChecked(!isAllChecked);
		const totalSummedAmount = _listOfFriends.map(friends => Number(friends.amountTheyGave))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
	}

	const splitDifferentlyAmountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, friend: IUser | IFriend) => {
		let value = event.target.value;
		if (value[0] == "0") {
			value = value.substring(1, value.length);
		}
		const _listOfFriends = [...listOfFriends];
		const tempFriend = _listOfFriends.find(_friend => _friend.id === friend.id);
		if (tempFriend) {
			tempFriend.amountTheyGave = value;
		}
		const totalSummedAmount = _listOfFriends.map(friends => Number(friends.amountTheyGave))
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle(Utils.getAmountToSettle(totalAmount, totalSummedAmount));
		setListOfFriends(_listOfFriends);
	}

	const isAmountSettled = () => {
		return Number(amountToSettle) === 0;
	}

	const addExpenseToDb = () => {
		props.addExpenseToDb(listOfFriends);
	}


	return (
		<div className="split-differently-tab__component">
			<div className="content">
				<ul className="list-group">
					<li className="list-group-item d-flex justify-content-between">
						<div>
							<input checked={isAllChecked} className="form-check-input me-1" onChange={allCheckedHandler} type="checkbox"/>&nbsp;
							<span>All</span>
						</div>
						<div>
							<span
								className={`${isAmountSettled() ? 'settled' : ''}`}>Amount to settle: <WrapInCurrencySignComponent
								value={amountToSettle}/></span>
						</div>
					</li>
					{listOfFriends.map(friend => <li key={friend.id} className="list-group-item">
						<div className="in-list d-flex flex-column justify-content-between">
							<div>
								<label><input type="checkbox" className="form-check-input me-1" onChange={() => onChangeHandler(friend)}
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
						<button className="btn btn-success" disabled={!isAmountSettled()} onClick={addExpenseToDb}>Add Expense</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SplitDifferentlyTabComponent;
