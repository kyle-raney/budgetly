//ApartmentList.js
import React from 'react';
import ApartmentRow from './ApartmentRow';
import PropTypes from 'prop-types';
import './index.css';

const ApartmentList = (props) => {
	const apartmentNodes = props.data.map(apartment => (
		<ApartmentRow
			key={ apartment.aptNum }
			aptNum={ apartment.aptNum }
			sqFt={ apartment.sqFt }
			rent={ apartment.rent }
		/>
	));
	return (
		<table>
			<thead>
				<tr>
					<th>Apt #</th>
					<th>Sq Ft</th>
					<th>Rent</th>
				</tr>
			</thead>
			<tbody>
				{ apartmentNodes }
			</tbody>
		</table>
	);
};

ApartmentList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({
		aptNum: PropTypes.number,
		sqFt: PropTypes.number,
		rent: PropTypes.number,
	})),
};

ApartmentList.defaultProps = {
	data: [],
};

export default ApartmentList;