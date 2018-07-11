//TransactionList.js
import React from 'react';
import TransactionRow from './TransactionRow';
import PropTypes from 'prop-types';

const TransactionList = (props) => {
	const transactionNodes = props.data.map(transaction => (
		<TransactionRow
			key={ transaction._id }
			amount={ transaction.amount }
			description={ transaction.description }
			category={ transaction.category }
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
				{ transactionNodes }
			</tbody>
		</table>
	);
};

TransactionList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.shape({
		amount: PropTypes.number,
		description: PropTypes.number,
		category: PropTypes.number,
	})),
};

TransactionList.defaultProps = {
	data: [],
};

export default TransactionList;