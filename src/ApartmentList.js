//ApartmentList.js
import React, { Component } from 'react';
import ApartmentRow from './ApartmentRow';
import ApartmentForm from './ApartmentForm';
import style from './style';
import './ApartmentTable.css';

class ApartmentList extends Component {
	render() {
		let apartmentNodes = this.props.data.map(apartment => {
			return (
				<ApartmentRow
					key={ apartment.aptNum }
					aptNum={ apartment.aptNum }
					sqFt={ apartment.sqFt }
					rent={ apartment.rent }
				/>
			)
		})
		return (
			<table style={ style.apartmentList }>
				<thead>
					<tr>
						<th>Apt #</th>
						<th>Sq Ft</th>
						<th>Rent</th>
					</tr>
				</thead>
				<tbody>
					{ apartmentNodes }
					<ApartmentForm />
				</tbody>
			</table>
		)
	}
}

export default ApartmentList;