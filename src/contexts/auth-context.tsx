import React, {createContext, useEffect, useState} from "react";
import db, {IUser} from "../db/db";

const defaultValue = {
	loggedInUser: null,
	isLoading: true,
	isChecking: true,
	login: (user: any) => {
	},
	logout: () => {
	}
};

export interface IAuthContext {
	loggedInUser: IUser | null,
	isLoading: boolean,
	isChecking: boolean,
	login: (user: any) => void,
	logout: () => void
}

export const AuthContext = createContext<IAuthContext>(defaultValue);


export const AuthContextProvider = (props: any) => {
	const [loggedInUser, setLoggedInUser] = useState(null);
	const [isChecking, setIsChecking] = useState(true);

	const loginHandler = (user: any) => {
		setLoggedInUser(user);
		localStorage.setItem("userIdAsToken", user.id);
	}

	const logoutHandler = () => {
		localStorage.removeItem("userIdAsToken");
		setLoggedInUser(null);
	}

	const contextValue = {
		loggedInUser: loggedInUser,
		isLoading: true,
		isChecking: isChecking,
		login: loginHandler,
		logout: logoutHandler
	};

	useEffect(() => {
		const id = localStorage.getItem("userIdAsToken");
		if (id) {
			db.fetchUserByUserId(id)
				.then(users => {
					if (users.length) {
						loginHandler(users[0]);
					}
					setIsChecking(false);
				});
		} else {
			setIsChecking(false);
		}
	}, []);

	// const id = localStorage.getItem("userIdAsToken");
	// if (id) {
	// 	loginHandler(id);
	// }

	return (
		<AuthContext.Provider value={contextValue}>
			{!isChecking && props.children}
		</AuthContext.Provider>
	)
}
