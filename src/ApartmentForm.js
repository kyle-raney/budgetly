//ApartmentForm.js
import React from 'react';
import PropTypes from 'prop-types';

const ApartmentForm = props => (
	<tr>
		<td>
			<form id='aptForm' onSubmit={ props.submitApartment }>
			<input type='number' name='aptNum' value={props.aptNum} onChange= { props.handleChangeAptField } />
			</form>
		</td>
		<td><input form='aptForm' type='number' name='sqFt' value={props.sqFt} onChange= { props.handleChangeAptField } /></td>
		<td><input form='aptForm' type='number' name='rent' value={props.rent} step='0.01' onChange= { props.handleChangeAptField } /></td>
		<td><button form='aptForm' type="submit">Add</button></td>
	</tr>
);

ApartmentForm.propTypes = {
	submitApartment: PropTypes.func.isRequired,
	handleChangeAptField: PropTypes.func.isRequired,
	aptNum: PropTypes.string,
	sqFt: PropTypes.string,
	rent: PropTypes.string,
};

ApartmentForm.defaultProps = {
	aptNum: '',
	sqFt: '',
	rent: '',
};

export default ApartmentForm;