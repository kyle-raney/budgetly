//ApartmentForm.js
import React, { Component } from 'react';
import style from './style';

class ApartmentForm extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			aptNum: '',
			sqFt: 0,
			rent: 0
		};
		this.handleAptNumChange = this.handleAptNumChange.bind(this);
		this.handleSqFtChange = this.handleSqFtChange.bind(this);
		this.handleRentChange = this.handleRentChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleAptNumChange(e) {
		this.setState({ aptNum: e.target.value });
	}

	handleSqFtChange(e) {
		this.setState({ sqFt: e.target.value });
	}

	handleRentChange(e) {
		this.setState({ rent: e.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		console.log(`$(this.state.aptNum), $(this.state.sqFt), $(this.state.rent)`);
	}

	render() {
		return (
			<tr>
				<td>
					<form id='aptForm' onSubmit={ this.handleSubmit }>
					<input type='number' style={ style.apartmentFormAptNum } value='0' onChange= { this.handleAptNumChange } />
					</form>
				</td>
				<td><input form='aptForm' type='number' style={ style.apartmentFormSqFt } value='0' onChange= { this.handleSqFtChange } /></td>
				<td><input form='aptForm' type='number' style={ style.apartmentFormRent } value='0' step='0.01' onChange= { this.handleRentChange } /></td>
				<td><input form='aptForm' type='submit' style={ style.apartmentFormPost } value='Add' /></td>
			</tr>
		)
	}
}

export default ApartmentForm;