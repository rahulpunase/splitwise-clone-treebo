import React, {useContext} from "react";
import "./App.scss";
import {Redirect, Route, Switch} from "react-router-dom";
import {AuthPage} from "./pages/auth/auth.page";
import HomePage from "./pages/home/home.page";
import {AuthContext} from "./contexts/auth-context";

function App() {
	const authCtx = useContext(AuthContext);
	return (
		<div className={`App_component ${authCtx.theme}`}>
			<div className="container-fluid">
				<Switch>
					<Route path={"/"} exact>
						<Redirect to={"/auth/login"}/>
					</Route>
					<Route path={"/auth"}>
						{authCtx.loggedInUser && <Redirect to={"/dashboard"}/> }
						{!authCtx.loggedInUser && <AuthPage/>}
					</Route>
					<Route path={"/dashboard"}>
						<ProtectedRoutes Component={HomePage}/>
					</Route>
					<Route path={"/add-expenses"}>
						<ProtectedRoutes Component={HomePage}/>
					</Route>
					<Route path={"/settings"}>
						<ProtectedRoutes Component={HomePage}/>
					</Route>
					<Route path={"*"}>
						Not Found
					</Route>
				</Switch>
			</div>
		</div>
	);
}

const ProtectedRoutes = (props: any) => {
	const authCtx = useContext(AuthContext);
	return (
		<React.Fragment>
			{authCtx.loggedInUser && <props.Component/>}
			{!authCtx.loggedInUser && <Redirect to={"/auth/login"}/>}
		</React.Fragment>
	)
}

export default App;
