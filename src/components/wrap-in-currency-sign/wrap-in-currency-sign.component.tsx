import React from 'react';

export interface IWrapInCurrencySignComponent {
	value: string | number;
}

const WrapInCurrencySignComponent = (props: IWrapInCurrencySignComponent) => {

	return (
		<span>
			<i className="fa fa-indian-rupee-sign"/> {props.value}
		</span>
	);
};

export default WrapInCurrencySignComponent;
