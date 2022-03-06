import React, {useState} from 'react';
import './drop-down.component.scss';

export interface IOption {
	label: string,
	id: string
}

export interface IDropDownComponent {
	options: Array<IOption>;
	class: string;
	onSelect: (option: IOption) => void;
	selected: IOption
}

const DropDownComponent = (props: IDropDownComponent) => {
	const [isOpened, setIsOpened] = useState<boolean>(false);
	return (
		<div className="dropdown">
			<button type="button" className={`btn dropdown-toggle ${props.class}`} data-toggle="dropdown"
			        aria-haspopup="true"
			        aria-expanded="false"
			        onClick={() => setIsOpened(!isOpened)}
			>
			{props.selected.label}
			</button>
			<div className={`dropdown-menu ${isOpened && 'show'}`}>
				{props.options.map(option => <div key={option.id} className="dropdown-item"
				                                  onClick={() => props.onSelect(option)}>{option.label}</div>)}
			</div>
		</div>
	);
};

export default DropDownComponent;
