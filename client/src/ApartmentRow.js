//ApartmentRow.js
import React, { Component } from 'react';
import style from './style';

class ApartmentRow extends Component {
	render() {
		return (
			<tr style={ style.apartmentRow }>
				<td style={ style.apartmentRowAptNum }>{this.props.aptNum}</td>
				<td style={ style.apartmentRowSqFt }>{this.props.sqFt}</td>
				<td style={ style.apartmentRowRent }>{this.props.rent}</td>
			</tr>
		)
	}
}

export default ApartmentRow;