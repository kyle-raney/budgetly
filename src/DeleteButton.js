import React from 'react';
import './DeleteButton.css';

const DeleteButton = props => {
	return (
		<div className='deleteButtonWrapper'>
			<button className='deleteButton' onClick={(e) => {props.onClickDelete(props.cellInfo.original._id);}}>
				Delete
			</button>
		</div>
	)
};

export default DeleteButton;