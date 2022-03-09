import React from 'react';
import './bottom-navigation.component.scss';
import {NavLink} from 'react-router-dom';

const BottomNavigationComponent = () => {
	return (
		<div className="bottom-navigation__component">
			<div className="nav-controller">
				<div className="nav-item">
					<NavLink to={"/dashboard"}>
						<i className="fa fa-bars"/><span className="d-none d-sm-block">Dashboard</span>
					</NavLink>
				</div>
				<div className="nav-item">
					<NavLink to={"/add-expenses"}>
						<i className="fa fa-money-bill"/><span className="d-none d-sm-block">Add Expenses</span>
					</NavLink>
				</div>
				<div className="nav-item">
					<NavLink to={"/settings"}>
						<i className="fa fa-cog"/><span className="d-none d-sm-block">Settings</span>
					</NavLink>
				</div>
			</div>
		</div>
	);
};

export default BottomNavigationComponent;
