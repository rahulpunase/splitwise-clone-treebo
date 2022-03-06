import React, {useRef, useState} from 'react';
import {NavLink, useHistory} from "react-router-dom";
import db from "../../../db/db";

const RegisterComponent = () => {
	const userNameRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);
	const confirmPasswordRef = useRef<any>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const history = useHistory();

	const addUserHandler = () => {
		if (validateForm()) { return; }
		db.createUser(userNameRef.current.value, passwordRef.current.value)
			.then(() => history.push("/auth/login"));
	}

	const validateForm = () => {
		const userName = userNameRef.current.value;
		const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;
		let message = '';
		if (!userName || !password || !confirmPassword) {
			message = 'Please complete the form';
		} else if (confirmPassword !== password) {
			message = 'Password doesn\'t match';
		}
		setErrorMessage(message);
		return !!message;
	}

	return (
		<div className="register__component card-body">
			<h5 className="card-title">Register</h5>
			<div className="card-content">
				<form>
					<div className="form-group">
						<label htmlFor="username">Username</label>
						<input ref={userNameRef}
						       className="form-control" type="text" name="username"
						       id="username" placeholder="Username"/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input ref={passwordRef}
						       className="form-control" type="password" name="password"
						       id="password" placeholder="Password"/>
					</div>
					<div className="form-group">
						<label htmlFor="confirm-password">Confirm Password</label>
						<input ref={confirmPasswordRef}
						       className="form-control" type="password"
						       name="confirmPassword" id="confirm-password" placeholder="Confirm Password"/>
					</div>
					<div className="actions row g-0">
						<div className="col-md-6">
							<button type="button" className="btn btn-primary" onClick={addUserHandler}>Create Account</button>
						</div>
						<div className="col-md-6">
							<NavLink to={'/auth/login'}>Already have an account? Login</NavLink>
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

export default RegisterComponent;
