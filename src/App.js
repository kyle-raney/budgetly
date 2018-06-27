//App.js
import React, { Component } from 'react';
import 'whatwg-fetch';
import ApartmentList from './ApartmentList';
import ApartmentForm from './ApartmentForm';

class App extends Component {
	constructor() {
		super();
		this.state = { data: [], error: null, aptNum: '', sqFt: '', rent: '' };
		this.pollInterval = null;
	}

	componentDidMount() {
		this.loadApartmentsFromServer();
		if(!this.pollInterval) {
			this.pollInterval = setInterval(this.loadApartmentsFromServer, 2000);
		}
	}

	componentWillUnmount() {
		if (this.pollInterval) clearInterval(this.pollInterval);
		this.pollInterval = null;
	}

	loadApartmentsFromServer = () => {
		fetch('/api/apartments')
			.then(data => data.json())
			.then((res) => {
				if (!res.success) this.setState({ error: res.error });
				else this.setState({ data: res.data });
			})
	}

	onChangeAptField = (e) => {
		const newState = { ...this.state };
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	}

	submitApartment = (e) => {
		e.preventDefault();
		const { aptNum, sqFt, rent } = this.state;
		alert('Submitting');
		if (!aptNum) return;
		fetch('/api/apartments', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ aptNum, sqFt, rent }),
		}).then(res => res.json()).then((res) => {
			if (!res.success) this.setState({ error: res.error.message || res.error });
			else this.setState({ aptNum: '', sqFt: '', rent: '', error: null});
		});
	}

	render() {
		return (
			<div className="page">
				<ApartmentList data={ this.state.data }/>
				<table>
					<tbody>
						<ApartmentForm 
							aptNum={this.state.aptNum}
							sqFt={this.state.sqFt}
							rent={this.state.rent}
							handleChangeAptField={this.onChangeAptField}
							submitApartment={this.submitApartment}
						/>
					</tbody>
				</table>
				{this.state.error && <p>{this.state.error}</p>}
			</div>
		)
	}
}

export default App;