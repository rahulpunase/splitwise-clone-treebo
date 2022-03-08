import React, {useState} from 'react';
import './split-tab.component.scss';
import SplitEquallyComponent from "../split-equally/split-equally.component";
import {IFriend} from "../../db/db";
import SplitDifferentlyTabComponent from "../split-differently-tab/split-differently-tab.component";

export interface ISplitTabComponent {
	totalAmount: string;
	selectedFriends: IFriend[];
	addExpenseToDb: (friends: any) => void
}

const SplitTabComponent = (props: ISplitTabComponent) => {
	const [activeState, setActiveState] = useState('equally');

	const isEquallyActive = () => {
		return activeState === 'equally';
	}

	const isDifferentlyActive = () => {
		return activeState === 'differently';
	}

	return (
		<div className="split-differently-tab__component">
			<ul className="nav nav-tabs">
				<li className="nav-item">
					<button onClick={() => setActiveState('equally')}
					        className={`nav-link ${isEquallyActive() ? 'active' : ''}`}>Equally</button>
				</li>
				<li className="nav-item">
					<button onClick={() => setActiveState('differently')}
					        className={`nav-link ${isDifferentlyActive() ? 'active' : ''}`}>By Amount</button>
				</li>
			</ul>
			<div className="tab-data">
				{isEquallyActive() && <SplitEquallyComponent {...props} />}
				{isDifferentlyActive() && <SplitDifferentlyTabComponent {...props}  />}
			</div>
		</div>
	);
};

export default SplitTabComponent;
