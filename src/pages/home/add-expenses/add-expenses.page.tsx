import React, {ChangeEvent, ChangeEventHandler, useContext, useState} from 'react';
import './add-expenses.page.scss';
import db from "../../../db/db";
import {AuthContext} from "../../../contexts/auth-context";

const AddExpensesPage = () => {
	const [friendSuggestion, setFriendSuggestion] = useState();
	const [friendName, setFriendName] = useState<string>('');
	const useAuthContext = useContext(AuthContext);

	const friendNameHandler = (event: ChangeEvent<HTMLInputElement>): void => {
		setFriendName(event.target.value);
	}

	const addFriendToDb =  async () => {
		if (useAuthContext.loggedInUser) {
			await db.createFriends(useAuthContext.loggedInUser.loggedInUserId, friendName);

		}
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
								<li className="list-group-item" onClick={addFriendToDb}>
									<b>Add new friend</b>
								</li>
							</ul>
						</div>}
						<div className="already-added-friends">
							<span className="badge bg-secondary">Secondary</span>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-3">
						<div>
							<label htmlFor="">Enter Total Amount: </label>
							<input type="text" className="form-control"/>
						</div>
					</div>
					<div className="col-md-9">
						<div>
							<label htmlFor="">Enter Description: </label>
							<input type="text" className="form-control"/>
						</div>
					</div>
				</div>
				<div className="row d-flex justify-content-center">
					<div className="col-md-6 d-flex justify-content-center align-items-center">
						Split&nbsp;<button className="btn btn-primary btn-sm">Equally</button>&nbsp; or split&nbsp;<button className="btn btn-primary btn-sm">Differently</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddExpensesPage;
