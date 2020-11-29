import React from 'react';
import { string } from 'prop-types';

const Message = ({ type, message }) => (
  <div className={`ui message ${type}`} style={{ display: 'flex', margin: '0' }}>
    <i className={`${type === 'positive' ? 'check' : 'times'} circle outline icon`} />
    <div className="content">
      <div className="header">{message}</div>
    </div>
  </div>
);

Message.propTypes = {
  type: string.isRequired,
  message: string.isRequired,
};

export default Message;
