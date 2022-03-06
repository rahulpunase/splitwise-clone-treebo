import React, {useContext, useEffect} from 'react';
import './auth.page.scss';
import {Switch, Route, useHistory} from 'react-router-dom';
import LoginComponent from "./login/login.component";
import RegisterComponent from "./register/register.component";
import db from "../../db/db";
import {AuthContext} from "../../contexts/auth-context";

export const AuthPage = () => {
	const history = useHistory();
	const authContextInfo = useContext(AuthContext);
	// useEffect(() => {
	// 	// check if user is already loggedIn
	// 	db.fetchLoggedInUser().then(users => {
	// 		if (users.length) {
	// 			history.push("/dashboard");
	// 		}
	// 	});
	// }, []);
	return (
		<div className="auth__page">
			<div className="container auth__page-container justify-content-center align-items-center">
				<div className="card col-md-6 auth__page-card">
					<Switch>
						<Route exact path={'/auth/login'} >
							<LoginComponent/>
						</Route>
						<Route exact path={'/auth/register'} >
							<RegisterComponent/>
						</Route>
					</Switch>
				</div>
			</div>
		</div>
	)
}
