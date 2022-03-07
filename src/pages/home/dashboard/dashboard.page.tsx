import React, {createContext, useContext} from 'react';
import './dashboard.page.scss';
import {AuthContext} from "../../../contexts/auth-context";

const DashboardPage = () => {
	const authCtx = useContext(AuthContext);
	return (
		<div className="dashboard__page">
			<h2>Welcome to you dashboard {authCtx.loggedInUser?.name}</h2>
		</div>
	);
};

export default DashboardPage;
