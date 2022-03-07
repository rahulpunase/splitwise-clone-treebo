import {combineReducers, createStore} from "redux";
import {addExpenseReducer, IAddExpenseReducer} from "./reducers/add-expense.reducer";

export interface IStore {
	addExpenseReducer: IAddExpenseReducer
}

const combinedReducers = combineReducers({
	addExpenseReducer: addExpenseReducer
});


export const store = createStore<IStore, any, any, any>(combinedReducers);
