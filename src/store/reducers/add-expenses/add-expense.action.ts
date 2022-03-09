import {IFriend} from "../../../db/db";

export const ADD_IN_PROGRESS_EXPENSE = 'ADD_IN_PROGRESS_EXPENSE';

export const _addInProgressExpenses = (friends: Array<IFriend>, description: string, totalAmount: number) => ({
	type: ADD_IN_PROGRESS_EXPENSE,
	payload: {
		friends,
		description,
		totalAmount
	}
})
