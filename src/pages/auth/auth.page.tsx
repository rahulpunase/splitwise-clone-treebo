import React from 'react';
import './auth.page.scss';
import {Switch, Route} from 'react-router-dom';
import LoginComponent from "./login/login.component";
import RegisterComponent from "./register/register.component";

export const AuthPage = () => {
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
