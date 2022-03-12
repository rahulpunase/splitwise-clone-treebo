import React from "react";
import "./home.page.scss";
import {Switch, Route, NavLink} from "react-router-dom";
import BottomNavigationComponent from "../../components/bottom-navigation/bottom-navigation.component";
import DashboardPage from "./dashboard/dashboard.page";
import SettingsPage from "./settings/settings.page";
import AddExpensesPage from "./add-expenses/add-expenses.page";


const HomePage = () => {
	return (
		<React.Fragment>
			<div className="home__page">
				<div className="container g-0">
					<div className="tab-starter">
						<div className="tab-content scroll-style">
							<Switch>
								<Route path={"/dashboard"}>
									<DashboardPage/>
								</Route>
								<Route path={"/add-expenses"}>
									<AddExpensesPage/>
								</Route>
								<Route path={"/settings"}>
									<SettingsPage/>
								</Route>
							</Switch>
						</div>
						<div className="tab-navigation">
							<BottomNavigationComponent/>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default HomePage;
