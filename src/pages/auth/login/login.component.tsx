import React, {useContext, useState} from 'react';
import '../login-register.component.scss';
import {NavLink, useHistory} from 'react-router-dom';
import db from "../../../db/db";
import {AuthContext} from "../../../contexts/auth-context";
import {useForm} from "react-hook-form";


export interface ILoginForm {
	username: string;
	password: string;
}


const LoginComponent = () => {
	const history = useHistory();
	const authCtx = useContext(AuthContext);
	const authContext = useContext(AuthContext);
	const {register, handleSubmit, formState: {errors}} = useForm<ILoginForm>();


	const loginUser = async (data: ILoginForm) => {
		const users = await db.fetchUserByUserName(data.username);
		if (!users.length) {
			authCtx.showNotification(`User not found`);
		} else if (users[0].password !== data.password) {
			authCtx.showNotification(`password is incorrect`);
		} else {
			authContext.login(users[0]);
			authCtx.showNotification(`Logged in successfully`);
			history.push("/dashboard");
		}
	}


	return (
		<div className='login__component card-body'>
			<h5 className="card-title">Login</h5>
			<div className="card-content">
				<form onSubmit={handleSubmit(loginUser)}>
					<div className="form-group">
						<label>Username</label>
						<input {...register("username", {
							required: true,
							maxLength: 20,
						})}
						       className={`form-control ${errors && errors.username ? 'is-invalid' : ''}`}
						       placeholder="Username"/>
						{errors.username && <div className="invalid-feedback">
							Username is required
						</div>}
					</div>
					<div className="form-group">
						<label>Password</label>
						<input {...register("password", {
							required: true,
							maxLength: 20,
						})}
						       type="password"
						       className={`form-control ${errors && errors.password ? 'is-invalid' : ''}`}
						       placeholder="Password"/>
						{errors.password && <div className="invalid-feedback">
							Password is required
						</div>}
					</div>
					<div className="actions row g-0">
						<div className="col-md-6">
							<button type="submit" className="btn btn-primary">Login</button>
						</div>
						<div className="col-md-6">
							<NavLink to={'/auth/register'}>Want to register?</NavLink>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginComponent;
