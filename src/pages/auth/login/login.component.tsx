import React, {useContext, useEffect, useRef, useState} from 'react';
import '../login-register.component.scss';
import {NavLink, useHistory} from 'react-router-dom';
import db from "../../../db/db";
import {AuthContext} from "../../../contexts/auth-context";


const LoginComponent = () => {
	const userNameRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const history = useHistory();
	const authContext = useContext(AuthContext);

	const loginUser = async (event: any): Promise<void> => {
		event.preventDefault();
		const users = await db.fetchUserByUserName(userNameRef.current.value);
		if (!users.length) {
			setErrorMessage('No user found.');
		} else if (users[0].password !== passwordRef.current.value) {
			setErrorMessage('Password doesn\'t match');
		} else {
			authContext.login(users[0]);
			history.push("/dashboard");
		}
	}


	return (
		<div className='login__component card-body'>
			<h5 className="card-title">Login</h5>
			<div className="card-content">
				<form onSubmit={loginUser}>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input autoComplete="off" ref={userNameRef} className="form-control" type="text" name="username" id="username"
						       placeholder="Username"/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input autoComplete="off" ref={passwordRef} className="form-control" type="password" name="password" id="password"
						       placeholder="Password"/>
					</div>
					<div className="actions row g-0">
						<div className="col-md-6">
							<button type="submit" className="btn btn-primary">Login</button>
						</div>
						<div className="col-md-6">
							<NavLink to={'/auth/register'}>Want to register?</NavLink>
						</div>
					</div>
					<div className="row">
						{!!errorMessage && <div className="alert alert-danger" role="alert">
							{errorMessage}
						</div>}
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginComponent;
