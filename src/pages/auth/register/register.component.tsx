import React, {useContext, useEffect, useState} from 'react';
import {NavLink, useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import db from "../../../db/db";
import {AuthContext} from "../../../contexts/auth-context";

export interface IRegisterForm {
	name: string;
	username: string;
	password: string;
	confirmPassword: string;
}


const RegisterComponent = () => {
	const {register, handleSubmit, watch, getValues, formState: {errors}} = useForm<IRegisterForm>();
	const [confirmPasswordError, setConfirmPasswordError] = useState(false);
	const history = useHistory();
	const authCtx = useContext(AuthContext);

	const addUserHandler = (data: IRegisterForm) => {
		if (!confirmPasswordError) {
			db.createUser({
				name: data.name,
				username: data.username,
				password: data.password
			}).then(() => {
				history.push("/auth/login");
				authCtx.showNotification(`Account created ${data.name}. Please Login`);
			});
		}
	}

	useEffect(() => {
		const subscription = watch((value, {name, type}) => {
			setConfirmPasswordError(value.confirmPassword !== value.password)
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	return (
		<div className="register__component card-body">
			<h5 className="card-title">Register</h5>
			<div className="card-content">
				<form onSubmit={handleSubmit(addUserHandler)}>
					<div className="form-group">
						<label>Name</label>
						<input {...register("name", {
							required: true,
							maxLength: 20,
						})}
						       className={`form-control ${errors && errors.name ? 'is-invalid' : ''}`}
						       placeholder="Full name"/>
						{errors.name && <div className="invalid-feedback">
							Name is required
						</div>}
					</div>
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
					<div className="form-group">
						<label>Confirm Password</label>
						<input {...register("confirmPassword", {
							required: true,
							maxLength: 20,
						})}
						       type="password"
						       className={`form-control ${(errors && errors.confirmPassword) || confirmPasswordError ? 'is-invalid' : ''}`}
						       placeholder="Full name"/>
						{errors.confirmPassword && <div className="invalid-feedback">
							Confirm password is required
						</div>}
						{confirmPasswordError && <div className="invalid-feedback">
							Password doesn't match
						</div>}
					</div>
					<div className="actions row g-0">
						<div className="col-md-6">
							<button type="submit" className="btn btn-primary">Create Account</button>
						</div>
						<div className="col-md-6">
							<NavLink to={'/auth/login'}>Already have an account? Login</NavLink>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default RegisterComponent;

