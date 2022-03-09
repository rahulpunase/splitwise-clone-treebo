import React, {createContext, useEffect, useState} from "react";
import db, {IUser} from "../db/db";
import ReactDOM from "react-dom";
import NotificationToastComponent from "../components/notification-toast/notification-toast.component";

export type Ttheme = 'light' | 'dark';
export enum ETheme {
	light = 'light',
	dark = 'dark'
}

const defaultValue = {
	loggedInUser: null,
	isLoading: true,
	isChecking: true,
	theme: ETheme.light,
	login: (user: any) => {
	},
	logout: () => {
	},
	showNotification: (message: string, delay?: number) => {
	},
	setTheme: (theme: Ttheme) => {
	}
};

export interface IAuthContext {
	loggedInUser: IUser | null,
	isLoading: boolean,
	isChecking: boolean,
	theme: Ttheme,
	login: (user: any) => void,
	logout: () => void
	showNotification: (message: string, delay?: number) => void
	setTheme: (theme: Ttheme) => void
}

export const AuthContext = createContext<IAuthContext>(defaultValue);

let timer: any;

export const AuthContextProvider = (props: any) => {
	const [loggedInUser, setLoggedInUser] = useState(null);
	const [isChecking, setIsChecking] = useState(true);
	const [theme, setTheme] = useState<Ttheme>('light');
	const [showNotification, setShowNotification] = useState('');
	const portalRoot = document.getElementById('portal');


	const loginHandler = (user: any) => {
		setLoggedInUser(user);
		localStorage.setItem("userIdAsToken", user.id);
	}

	const logoutHandler = () => {
		localStorage.removeItem("userIdAsToken");
		setLoggedInUser(null);
	}

	const showNotificationHandler = (message: string, delay?: number) => {
		setShowNotification(message);
		timer = setTimeout(function() {
			setShowNotification('');
			clearTimeout(timer);
		}, delay ? delay : 4000);
	}

	const setThemeHandler = (theme: Ttheme) => {
		setTheme(theme);
	}

	const contextValue = {
		loggedInUser: loggedInUser,
		isLoading: true,
		isChecking: isChecking,
		theme: theme,
		login: loginHandler,
		logout: logoutHandler,
		showNotification: showNotificationHandler,
		setTheme: setThemeHandler
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

	return (
		<AuthContext.Provider value={contextValue}>
			{!isChecking && props.children}
			{(portalRoot && showNotification) && ReactDOM.createPortal(<NotificationToastComponent message={showNotification}/>, portalRoot)}
		</AuthContext.Provider>
	)
}
