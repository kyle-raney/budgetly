//App.js
import React, { Component } from 'react';
import 'whatwg-fetch';
import ApartmentList from './ApartmentList';
import DATA from './data';
import style from './style';

class App extends Component {
	constructor() {
		super();
		this.state = { data: [], error: null };
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

	render() {
		return (
			<div style={ style.page }>
				<ApartmentList data={ DATA }/>
				{this.state.error && <p>{this.state.error}</p>}
			</div>
		)
	}
}

export default App;