import React from 'react';
import moment from 'moment';
import './GraphTooltip.css';

const GraphTooltip = props => {
    const { active } = props;

    if (active) {
      const { payload, label } = props;
      return (
        <div className="custom-tooltip">
          <p className="label">{`${moment(label).format('MM/DD/YYYY')} : $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }

    return null;
};

export default GraphTooltip;