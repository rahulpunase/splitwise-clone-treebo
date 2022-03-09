import {IFriend} from "../../../db/db";
import {ADD_IN_PROGRESS_EXPENSE} from "./add-expense.action";

export interface IAddExpenseReducer {
	friends: Array<IFriend>;
	totalAmount: string;
	description: string;
	stateSelected: 'equally' | 'differently';
	status: 'In Progress',
	isCached: boolean,
}

const defaultState: IAddExpenseReducer = {
	friends: [],
	totalAmount: '',
	description: '',
	stateSelected: 'equally',
	status: 'In Progress',
	isCached: false
}

export const addExpenseReducer = (state = defaultState, action: any) => {
	console.log(action);
	switch (action.type) {
		case ADD_IN_PROGRESS_EXPENSE: {
			const {friends, description, totalAmount} = action.payload;
			return {
				...state,
				friends: friends,
				description: description,
				totalAmount: totalAmount,
				isCached: true,
			};
		}
		default: {
			return state
		}
	}
}
