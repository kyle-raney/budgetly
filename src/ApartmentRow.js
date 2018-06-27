//ApartmentRow.js
import React from 'react';
import PropTypes from 'prop-types';

const ApartmentRow = props => (
	<tr>
		<td>{props.aptNum}</td>
		<td>{props.sqFt}</td>
		<td>{props.rent}</td>
	</tr>
);

ApartmentRow.propTypes = {
	aptNum: PropTypes.number.isRequired,
	sqFt: PropTypes.number,
	rent: PropTypes.number,
};

export default ApartmentRow;