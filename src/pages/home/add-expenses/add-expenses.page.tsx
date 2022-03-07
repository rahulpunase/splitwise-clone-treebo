import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import './add-expenses.page.scss';
import db, {IFriend, IUser} from "../../../db/db";
import {AuthContext} from "../../../contexts/auth-context";
import SplitTabComponent from "../../../components/split-tab/split-tab.component";
import {useDispatch, useSelector} from "react-redux";
import {_addInProgressExpenses} from "../../../store/reducers/add-expense.action";
import {IStore} from "../../../store/store";

const AddExpensesPage = () => {
	const dispatch = useDispatch();
	const addExpenseReducer = useSelector((store: IStore) => store.addExpenseReducer);
	const authCtx = useContext(AuthContext);
	const [allFriends, setAllFriends] = useState<IFriend[]>([]);
	const [friendListToRender, setFriendListToRender] = useState<Array<IFriend>>([]);
	const [friendName, setFriendName] = useState<string>('');

	const [selectedFriends, setSelectedFriends] = useState<Array<IFriend>>(
		addExpenseReducer.isCached ? addExpenseReducer.friends: []
	);
	const [description, setDescription] = useState<string>(
		addExpenseReducer.isCached ? addExpenseReducer.description: ''
	);
	const [totalAmount, setTotalAmount] = useState<string>(
		addExpenseReducer.isCached ? addExpenseReducer.totalAmount: ''
	);

	useEffect(() => {
		if (!authCtx.loggedInUser) return;
		db.fetchFriendsFromUserId(authCtx.loggedInUser.id).then((friends) => {
			setAllFriends(friends);
		});
	}, []);

	useEffect(() => {
		return () => {
			dispatch(_addInProgressExpenses(selectedFriends, description, Number(totalAmount)));
		}
	}, [selectedFriends, description, totalAmount]);


	const friendNameHandler = (event: ChangeEvent<HTMLInputElement>): void => {
		const {value} = event.target;
		setFriendListToRender(allFriends.filter(friend => friend.name.toLowerCase().includes(value.toLowerCase())));
		setFriendName(value);
	}

	const addFriendToDb = async () => {
		if (authCtx.loggedInUser) {
			const friendAddedId = await db.createFriends(authCtx.loggedInUser.id, friendName);
			const fetchedFriend = await db.fetchFriendFromId(friendAddedId);
			db.fetchFriendsFromUserId(authCtx.loggedInUser.id).then((friends) => {
				setAllFriends(friends);
			});
			if (fetchedFriend.length) {
				addToSelected(fetchedFriend[0]);
			}
		}
	}

	const addToSelected = (friend: any) => {
		const _selectedFriends = [...selectedFriends];
		const findIndex = _selectedFriends.findIndex(_friend => _friend.id === friend.id);
		if (findIndex > -1) {
			setFriendName('');
			return;
		}
		_selectedFriends.push(friend);
		setSelectedFriends(_selectedFriends);
		setFriendName('');
	}

	const removeSelectedFriend = (friend: any) => {
		const _selectedFriends = [...selectedFriends];
		const findIndex = _selectedFriends.findIndex(_friend => _friend.id === friend.id);
		_selectedFriends.splice(findIndex, 1);
		setSelectedFriends(_selectedFriends);
	}

	return (
		<div className="add-expenses__page">
			<h2>Add Expenses</h2>
			<div className="input-container">
				<div className="row">
					<div className="col-md-3 d-flex align-items-center">With you and: </div>
					<div className="col-md-9 input-and-suggestion-holder">
						<input type="text" className="friend-input form-control"
						       onChange={(event) => friendNameHandler(event)}
						       value={friendName}
						       placeholder="Enter names of your friend"/>
						{!!friendName && <div className="suggestions">
							<ul className="list-group">
								{friendListToRender.map(friend => <li key={friend.id} className="list-group-item"
									onClick={() => addToSelected(friend)}>
									{friend.name}
								</li>)}
								<li className="list-group-item" onClick={addFriendToDb}>
									<b>Add new friend</b>
								</li>
							</ul>
						</div>}
						<div className="already-added-friends">
							{selectedFriends.map(friend => <span key={friend.id}
								className="badge bg-secondary">{friend.name} <i
								className="fa fa-times" onClick={() => removeSelectedFriend(friend)}/></span>)}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3">
						<div>
							<label htmlFor="">Enter Total Amount: </label>
							<input type="number" onChange={(event) => setTotalAmount(event.target.value)}
								value={totalAmount} className="form-control"/>
						</div>
					</div>
					<div className="col-md-9">
						<div>
							<label htmlFor="">Enter Description: </label>
							<input type="text" value={description} onChange={(event) => setDescription(event.target.value)} className="form-control"/>
						</div>
					</div>
				</div>
				<h6 className="split-heading">Split bill as you wish</h6>
				<SplitTabComponent selectedFriends={selectedFriends} totalAmount={totalAmount} />
			</div>
		</div>
	);
};

export default AddExpensesPage;
