import React, {createContext, useContext, useEffect} from 'react';
import './dashboard.page.scss';
import {AuthContext} from "../../../contexts/auth-context";
import db from "../../../db/db";

const DashboardPage = () => {
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		if (authCtx.loggedInUser) {
			db.fetchExpensesFromCreatedByUser(authCtx.loggedInUser.id).then(value => console.log(value))
		}
	}, []);

	return (
		<div className="dashboard__page">
			<h2>Welcome to you dashboard {authCtx.loggedInUser?.name}</h2>
		</div>
	);
};

export default DashboardPage;
