import React, {useContext} from "react";
import "./settings.page.scss";
import {AuthContext, ETheme} from "../../../contexts/auth-context";
import SwitchComponent from "../../../components/switch/switch.component";

const SettingsPage = () => {
	const authCtx = useContext(AuthContext);

	const onThemeSwitchChange = (bool: boolean) => {
		if (bool) {
			authCtx.setTheme(ETheme.dark);
		} else {
			authCtx.setTheme(ETheme.light);
		}
	}

	return (
		<div className="settings__page">
			<h2>Settings</h2>
			<ul className="list-group list-group-flush">
				<li className="list-group-item">
					<label className="action">
						<div>Theme</div>
						<div>
							<SwitchComponent label={"Dark Mode"} isChecked={authCtx.theme === "dark"}
							                 onSwitchChange={onThemeSwitchChange}/>
						</div>
					</label>
				</li>
				<li className="list-group-item">
					<label className="action">
						<div>
							<button className="btn btn-danger" onClick={authCtx.logout}>Logout</button>
						</div>
					</label>
				</li>
			</ul>
		</div>
	);
};

export default SettingsPage;
