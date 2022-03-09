import React, {useState} from "react";
import "./switch.component.scss";

interface SwitchComponent {
	onSwitchChange: (bool: boolean) => void,
	isChecked: boolean,
	label: string
}

const SwitchComponent = (props: SwitchComponent) => {
	const [isChecked, setIsChecked] = useState(false);
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.onSwitchChange(event.target.checked);
		setIsChecked(!isChecked);
	}
	return (
		<div className="switch__component">
			<span className="dark-mode-text">Dark Mode</span>
			<label className="switch">
				<input type="checkbox" onChange={(event) => onChangeHandler(event)} checked={props.isChecked}/>
				<span className="slider round"/>
			</label>
		</div>
	);
};

export default SwitchComponent;
