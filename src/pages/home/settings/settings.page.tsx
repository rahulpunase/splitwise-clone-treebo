import React, {useContext, useState} from 'react';
import './settings.page.scss';
import DropDownComponent, {IOption} from "../../../components/drop-down/drop-down.component";
import {AuthContext} from "../../../contexts/auth-context";

const SettingsPage = () => {
	const authCtx = useContext(AuthContext);
	const array: Array<IOption> = [
		{ id: 'light', label: 'Light' },
		{ id: 'dark', label: 'Dark' },
	];
	const [themeSelected, setThemeSelected] = useState<IOption>(array[0]);
	const onDropDownSelect = (selectedValue: IOption) => {
		setThemeSelected(selectedValue);
	}
	return (
		<div className="settings__page">
			<h2>Settings</h2>
			<ul className="list-group">
				<li className="list-group-item">
					<label className="action">
						<div>Theme</div>
						<div>
							<DropDownComponent
								options={array}
								class="btn-primary"
								onSelect={onDropDownSelect}
								selected={themeSelected}
							/>
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
