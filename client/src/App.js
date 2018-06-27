//App.js
import React, { Component } from 'react';
import ApartmentList from './ApartmentList';
import DATA from './data';
import style from './style';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { data: [] };
	}
	render() {
		return (
			<div style={ style.page }>
				<ApartmentList data={ DATA }/>
			</div>
		)
	}
}

export default App;