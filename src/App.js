//App.js
import React, { Component } from 'react';
import ReactTable from "react-table";
import Pusher from 'pusher-js';
import 'whatwg-fetch';
import TransactionForm from './TransactionForm';
import EditableCell from './EditableCell';
import DeleteButton from './DeleteButton';
import GraphTooltip from './GraphTooltip';
import {ResponsiveContainer, XAxis, YAxis, LineChart, Line, Tooltip} from 'recharts';
import moment from 'moment';
import './index.css';
import 'react-table/react-table.css';

class App extends Component { 
	constructor(props) {
		super(props);
		this.state = { 
			data: [], 
			graphData: [],
			graphOptions: { byMonth: false, byYear: false, title: '' },
			dirtyCell: false, 
			modalIsOpen: false,
			error: null, 
			amount: '', 
			description: '', 
			category: '',
			dateString: '',
			cellToggle: { index: -1, id: '', value: '' }
		};
		this.columns = [];
	}

	componentDidMount() {
		this.pusher = new Pusher('470626e46ac68914cee2', {
			cluster: 'us2',
			encrypted: true,
		});
		this.channel = this.pusher.subscribe('transactions');

		this.channel.bind('inserted', this.loadTransactionsFromServer);
		this.channel.bind('deleted', this.loadTransactionsFromServer);
	}

	componentWillUnmount() {
		if (this.pollInterval) clearInterval(this.pollInterval);
		this.pollInterval = null;
	}

	loadTransactionsFromServer = () => {
		try {
			fetch('/api/transactions')
				.then(data => data.json())
				.then((res) => {
					if (!res.success) this.setState({ error: res.error });
					else this.processServerData(res.data);
				})
		}
		catch (e) {
			this.setState({ error: e })
		}
	}

	groupBy = (list, keyGetter) => {
	    const map = new Map();
	    list.forEach((item) => {
	        const key = keyGetter(item);
	        const collection = map.get(key);
	        if (!collection) {
	            map.set(key, [item]);
	        } else {
	            collection.push(item);
	        }
	    });
	    return map;
	}

	loadGraphData = (data) => {
		var graphDataMap = this.groupBy(data, transaction => {
			var date = new Date(transaction.dateString+'T12:00:00');
			if(this.state.graphOptions.byMonth) {
				return date.getMonth();
			}
			else if(this.state.graphOptions.byYear) {
				return date.getYear();
			}
			else {
				return date.getTime();
			}
		});
		var graphData = [];
		graphDataMap.forEach((value, key, map) => {
			var amountTotal = 0;
			var transactions = [];
			value.forEach((transaction) => {
				amountTotal += transaction.amount;
				transactions.push(transaction);
			});
			graphData.push({date: key, amount: amountTotal, transactions: transactions});
		});
		graphData.sort((a,b)=>{return (a.date > b.date) ? 1: (b.date > a.date) ? -1: 0;});
		this.setState({ graphData: graphData });
	}

	processServerData = (data) => {
		this.loadGraphData(data);
		this.setState({ data: data });
	}

	onChangeTransactionField = (e) => {
		const newState = { ...this.state };
		var val = e.target.value;
		if(e.target.name === 'dateString') {
			newState['dateString'] = val;
			val = this.dateStringToUnix(val);
		}
		newState[e.target.name] = val;
		this.setState(newState);
	}

	submitTransaction = (e) => {
		e.preventDefault();
		var { amount, description, category, date, dateString } = this.state;
		if(dateString === "") {
			dateString = date;
		}		
		if (!amount) return;
		fetch('/api/transactions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount, description, category, date, dateString }),
		}).then(res => res.json()).then((res) => {
			if (!res.success) this.setState({ error: res.error.message || res.error });
			else {
				this.setState({ amount: '', description: '', category: '', date: '', dateString: '', error: null, modalIsOpen: false});
			};
		});
	}

	submitUpdatedTransaction = (index, name, updatedValue) => {
		const data = [...this.state.data];
		data[index][name] = updatedValue;
		var { _id, amount, description, category, date, dateString } = data[index];
		if(dateString === "") {
			dateString = date;
		}
		fetch(`/api/transactions/${_id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount, description, category, date, dateString }),
		}).then(res => res.json()).then((res) => {
			if (!res.success) this.setState({ error: res.error.message || res.error });
			else this.setState({ data: res.data });
		});
	}

	submitDeletedTransaction = (id) => {
		fetch(`/api/transactions/${id}`, {
			method: 'DELETE'
		}).then(res => res.json()).then((res) => {
			if(!res.success) this.setState({ error: res.error.message || res.error });
		});
	}

	onClickEditableCell = (e, index, id, value) => {
		e.preventDefault();
		this.setState({ cellToggle: { index: index, id: id, value: value } });
	}

	onBlurEditableCell = (e, index, id, value) => {
		e.preventDefault();
		if(this.state.dirtyCell) {
			this.submitUpdatedTransaction(index, id, value);
		}
		this.setState({dirtyCell: false, cellToggle: { index: -1, id: '', value: ''}});
	}

	onChangeEditableCell = (e, index, id, value) => {
		e.preventDefault();
		const data = [...this.state.data];
		data[index][id] = value;
		this.setState({data: data, dirtyCell: true, cellToggle: { index: index, id: id}});
	}

	dateStringToUnix = (dateString) => {
		var dateVal = parseInt((new Date(dateString+'T12:00:00').getTime() / 1000).toFixed(0));
		return dateVal;
	}

	onChangeDateCell = (e, index, id, value) => {
		e.preventDefault();
		const data = [...this.state.data];
		data[index][id] = this.dateStringToUnix(e.target.value);
		data[index]['dateString'] = e.target.value;
		this.setState({data: data, dirtyCell: true, cellToggle: {index: index, id: id}});
	}


	onKeyDownEditableCell = (e, index, id) => {
		if( e.which === 9 ) {
			this.editableCellHandleTabPress(e, index, id);
		}
		else if( e.which === 13 ) {
			this.editableCellHandleEnterPress(e, index, id);
		}
	}

	editableCellHandleTabPress = (e, index, id) => {
		e.preventDefault();
		this.onBlurEditableCell(e, index, id, e.target.value);
		var found = false,
			next = false;
		this.columns.some((column) => {
			if(next) {
				this.setState({cellToggle: {index: index, id: column.accessor}});
				found = true;
				return true;
			}
			if(column.accessor === id) {
				next = true;
			}
		});
		if(!found) {
			this.setState({cellToggle: {index: index+1, id: this.columns[0].accessor}});
		}
	}

	editableCellHandleEnterPress = (e, index, id) => {
		e.preventDefault();
		if(this.state.dirtyCell) {
			this.submitUpdatedTransaction(index, id, e.target.value);
		}
		this.setState({dirtyCell: false, cellToggle: { index: -1, id: '', value: ''}});
	}

	renderEditableCell = (cellInfo, dataType, isMoney=false) => {
		const data = [...this.state.data];
		var val = data[cellInfo.index][cellInfo.column.id];
		var onChange = this.onChangeEditableCell;
		if(dataType === 'date') {
			val = data[cellInfo.index]['dateString'];
			onChange = this.onChangeDateCell;
		}

		var props = {
			value:val,
			type:dataType,
			onClick:this.onClickEditableCell,
			onChange:onChange,
			onBlur:this.onBlurEditableCell,
			cellInfo:cellInfo,
			cellToggle:this.state.cellToggle,
			onKeyDown:this.onKeyDownEditableCell,
			isMoney: isMoney
		};
		return (
			<EditableCell {...props} />
		);
	};

	renderDeleteButton = (cellInfo) => {
		return (
			<DeleteButton cellInfo={cellInfo} onClickDelete={this.submitDeletedTransaction}/>
		);
	};

	injectThProps = (state, rowInfo, column) => {
		if (column.Header === 'Delete') {
			return {
				style: { visibility: 'hidden' } // override style for 'myHeaderTitle'.
			}
		}
		return {}; // no styles.
	};

	openTransactionModal = (e) => {
		this.setState({modalIsOpen: true});
	}

	hideTransactionModal = (e) => {
		this.setState({modalIsOpen: false});
	}

	setGraphOptions = (options) => {
		this.setState({graphOptions: options});
		this.loadGraphData(this.state.data);
	}

	formatGraphTicks = (time) => {
		if(this.state.graphOptions.byMonth) {
			return moment(time).format('MM');
		}
		else if(this.state.graphOptions.byYear) {
			return moment(time).format('YYYY');
		}
		else {
			return moment(time).format('MM/DD');
		}
	}

	render() {
		this.columns = [{
			Header: 'Date',
			accessor: 'dateString',
			Cell: (cellInfo) => this.renderEditableCell(cellInfo, 'date')
		}, {
			Header: 'Amount',
			accessor: 'amount',
			Cell: (cellInfo) => this.renderEditableCell(cellInfo, 'number', true)
		}, {
			Header: 'Category',
			accessor: 'category',
			Cell: (cellInfo) => this.renderEditableCell(cellInfo, 'string')
		}, {
			Header: 'Description',
			accessor: 'description',
			Cell: (cellInfo) => this.renderEditableCell(cellInfo, 'string')
		}, {
			Header: 'Delete',
			accessor: 'delete',
			Cell: this.renderDeleteButton
		}]

		return (
			<div className="page">
				<div className="page-body-left">
					<div className="page-body-inner">
						{this.state.error && <p>{this.state.error}</p>}
						<TransactionForm 
							amount={this.state.amount}
							description={this.state.description}
							category={this.state.category}
							dateString={this.state.dateString}
							handleChangeTransactionField={this.onChangeTransactionField}
							submitTransaction={this.submitTransaction}
							modalIsOpen={this.state.modalIsOpen}
							openTransactionModal={this.openTransactionModal}
							hideTransactionModal={this.hideTransactionModal}
						/>
						<ReactTable 
							minRows={1}
							data={this.state.data}
							columns={this.columns}
							defaultSorted={[{
								id:'dateString',
								desc: true,
							}]}
							defaultPageSize={10}
							getTheadThProps={this.injectThProps}
							onFetchData={this.loadTransactionsFromServer}
						/>
					</div>
				</div>
				<div className='page-body-right'>
					<div className='page-body-inner'>
						<ResponsiveContainer width="100%" height={400}>
							<div className='graphTitle'>{this.state.graphOptions.title}</div>
							<LineChart data={this.state.graphData}>
								<Line
							        line={{ stroke: '#eee' }}
							        lineJointType='monotoneX'
							        lineType='linear'
							        dataKey='amount'
							    />
							  	<XAxis 
									tickFormatter={this.formatGraphTicks}
									dataKey="date" 
									type="number"
									domain={['auto', 'auto']} />
							  	<YAxis />
							  	<Tooltip content={<GraphTooltip />} />
							</LineChart>
						</ResponsiveContainer>
						<button onClick={(e) => this.setGraphOptions({byMonth: true})}>Month</button>
					</div>
				</div>
			</div>
		)
	}
}

export default App;