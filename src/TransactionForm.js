//TransactionForm.js
import React from 'react';
import PropTypes from 'prop-types';
import './TransactionForm.css';

const renderModal = (visible, props) => {
	if(visible) {
		return (
			<div className='modal-form'>
				<div className='inner-modal-form'>
					<div className='inner-modal-header'>
						<div className='modal-heading'>New Transaction</div><div className='x-button' onClick={props.hideTransactionModal}>&#10006;</div>
					</div>
					<form className='form-contents' id='transactionForm' onSubmit={ props.submitTransaction }>
						<h4>Date</h4>	
						<input 	
							form='transactionForm' 
							type='date' 
							name='date' 
							value={props.date} 
							onChange={props.handleChangeTransactionField} 
						/>
						<h4>Amount</h4>
						<input 
							className='amount-input'
							form='transactionForm' 
							type='number' 
							name='amount' 
							placeholder='Amount' 
							step='0.01' 
							value={props.amount} 
							onChange={props.handleChangeTransactionField} 
						/>
						<h4>Category</h4>	
						<input 
							form='transactionForm' 
							type='string' 
							name='category' 
							placeholder='Category' 
							value={props.category} 
							onChange= { props.handleChangeTransactionField } 
						/>
						
						<h4>Description</h4>	
						<input 
							form='transactionForm'  
							type='string' 
							name='description' 
							placeholder='Description' 
							value={props.description} 
							onChange={props.handleChangeTransactionField}  
						/>
					</form>
					<div className='inner-modal-footer'>
						<div className='modal-form-submit'>
							<a className='cancel-button' onClick={props.hideTransactionModal}>Cancel</a>
							<button form='transactionForm' type="submit">Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
	else 
		return null;
}

const TransactionForm = props => (
	<div className='form-wrapper'>
		<button className='open-modal-button' onClick={props.openTransactionModal}>
			+ New Transaction
		</button>
		{renderModal(props.modalIsOpen, props)}
	</div>
);

TransactionForm.propTypes = {
	submitTransaction: PropTypes.func.isRequired,
	handleChangeTransactionField: PropTypes.func.isRequired,
	amount: PropTypes.string,
	description: PropTypes.string,
	category: PropTypes.string,
};

TransactionForm.defaultProps = {
	amount: '',
	description: '',
	category: '',
};

export default TransactionForm;