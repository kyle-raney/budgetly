import React from 'react';
import Moment from 'react-moment';
import './EditableCell.css';

const EditableCell = props => {
	var value = props.value;
	var inputModifiers = {};
	if(props.isMoney) {
		value = parseFloat(value).toFixed(2);
		inputModifiers = {
			step:'.01'
		}
	}

	if(props.cellToggle.index === props.cellInfo.index &&
		props.cellToggle.id === props.cellInfo.column.id) {
		return (
			<div className='editableCellWrapper'>
				{ props.isMoney ? <a>$ </a> : null }
				<input
					className='editableCellInput' 
					type={props.type} 
					value={props.value}
					onBlur={(e) => props.onBlur(e, props.cellInfo.index, props.cellInfo.column.id, e.target.value)}
					onChange={(e) => props.onChange(e, props.cellInfo.index, props.cellInfo.column.id, e.target.value)}
					onFocus={(e) => e.target.select()}
					onKeyDown={(e) => props.onKeyDown(e, props.cellInfo.index, props.cellInfo.column.id)}
					autoFocus
					{...inputModifiers}
				/>
			</div>
		);
	}
	else {
		return (
			<div className='editableCellWrapper'
					onClick={(e) => props.onClick(e, props.cellInfo.index, props.cellInfo.column.id, props.value)}>
				{ props.isMoney ? <span>$ </span> : null }
				{ props.type === 'date' ? <Moment format="MM/DD/YYYY">{value}</Moment> : <span>{value}</span> }
			</div>
		);
	}
};

export default EditableCell;