import React, {useContext, useEffect, useState} from 'react';
import {IFriend, IUser} from "../../db/db";
import {AuthContext} from "../../contexts/auth-context";
import Utils from "../../utils/utils";
import "./split-differently-tab.component.scss";

export interface ISplitDifferentlyTabComponent {
	selectedFriends: IFriend[];
	totalAmount: string;
}

const SplitDifferentlyTabComponent = (props: ISplitDifferentlyTabComponent) => {
	const authCtx = useContext(AuthContext);
	const [listOfFriends, setListOfFriends] = useState(Utils.mergeUserAndFriends(authCtx.loggedInUser,
		props.selectedFriends, props.totalAmount));
	const [amountToSettle, setAmountToSettle] = useState(0);
	const [isAllChecked, setIsAllChecked] = useState(true);

	useEffect(() => {
		setListOfFriends(Utils.mergeUserAndFriends(authCtx.loggedInUser, props.selectedFriends, props.totalAmount));
	}, [props]);


	const onChangeHandler = (friend: IUser | IFriend) => {
		const _listOfFriends = [...listOfFriends];
		let newListOfFriends = _listOfFriends.map(_friend => ({
			..._friend,
			isChecked: friend.id === _friend.id ? !_friend.isChecked : _friend.isChecked,
			whenSplitDifferentlyAmount: _friend.isChecked ? 0 : _friend.whenSplitDifferentlyAmount
		}));
		setListOfFriends(newListOfFriends);
		const filteredFriends = newListOfFriends.filter(friend => friend.isChecked);

		// const _listOfFriends = [...listOfFriends];
		// const tempFriend = _listOfFriends.find(_friend => _friend.id === friend.id);
		// if (tempFriend) {
		// 	tempFriend.isChecked = !tempFriend.isChecked;
		// 	if (!tempFriend.isChecked) {
		// 		tempFriend.whenSplitDifferentlyAmount = 0;
		// 	} else {
		// 		const amount = _listOfFriends.filter(_friend => _friend.isChecked).map(friends => friends.whenSplitDifferentlyAmount)
		// 	.reduce((savedValue, newValue) => savedValue + newValue, 0);
		// 		tempFriend.whenSplitDifferentlyAmount = Number(props.totalAmount) - amount;
		// 	}
		// }
		// const checkedFriend = _listOfFriends.filter(_friend => _friend.isChecked);
		// const reMapped = _listOfFriends.map(_friend => ({
		// 	..._friend,
		// 	whenSplitEquallyAmount: Number((Number(props.totalAmount) / checkedFriend.length).toFixed(2)),
		// }));
		// setListOfFriends(reMapped);
		// setIsAllChecked(checkedFriend.length === _listOfFriends.length);
		// const totalSummedAmount = _listOfFriends.map(friends => friends.whenSplitDifferentlyAmount)
		// 	.reduce((savedValue, newValue) => savedValue + newValue, 0);
		// setAmountToSettle(Number(props.totalAmount) - totalSummedAmount);
	}

	const allCheckedHandler = () => {
		const _listOfFriends = [...listOfFriends];
		const newListOfFriends = _listOfFriends.map(_friend => ({..._friend, isChecked: !isAllChecked}));
		setListOfFriends(newListOfFriends);
		setIsAllChecked(!isAllChecked);
		const totalSummedAmount = _listOfFriends.map(friends => friends.whenSplitDifferentlyAmount)
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle(Number(props.totalAmount) - totalSummedAmount);
	}

	const splitDifferentlyAmountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>, friend: IUser | IFriend) => {
		let value = Number(event.target.value);
		if (value < 0) {
			return;
		}
		if (value > 0) {
			value = Number(value);
		}
		const _listOfFriends = [...listOfFriends];
		const tempFriend = _listOfFriends.find(_friend => _friend.id === friend.id);
		if (tempFriend) {
			tempFriend.whenSplitDifferentlyAmount = value;
		}
		const totalSummedAmount = _listOfFriends.map(friends => friends.whenSplitDifferentlyAmount)
			.reduce((savedValue, newValue) => savedValue + newValue, 0);
		setAmountToSettle(Number(props.totalAmount) - totalSummedAmount);
		setListOfFriends(_listOfFriends);
	}


	return (
		<div className="split-differently-tab__component">
			<div className="content on-different">
				<ul className="list-group">
					<li className="list-group-item"><label>
						<input checked={isAllChecked} onChange={allCheckedHandler} type="checkbox"/>&nbsp;
						<span>All</span>&nbsp; {amountToSettle}</label>
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
			</div>
		</div>
	);
};

export default SplitDifferentlyTabComponent;
