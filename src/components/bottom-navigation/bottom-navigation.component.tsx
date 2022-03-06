import React from 'react';
import './bottom-navigation.component.scss';
import {NavLink} from 'react-router-dom';

const BottomNavigationComponent = () => {
	return (
		<div className="bottom-navigation__component">
			<div className="nav-controller">
				<div className="nav-item">
					<NavLink to={"/dashboard"}>Dashboard</NavLink>
				</div>
				<div className="nav-item">
					<NavLink to={"/add-expenses"}>Add Expenses</NavLink>
				</div>
				<div className="nav-item">
					<NavLink to={"/settings"}>Settings</NavLink>
				</div>
			</div>
		</div>
	);
};

export default BottomNavigationComponent;
