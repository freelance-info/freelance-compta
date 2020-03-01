import React from 'react';
import { string } from 'prop-types';

Message.propTypes = {
    type: string.isRequired,
    message: string.isRequired
};

export default function Message({ type, message}) {
    return (
        <div className={'ui message ' + type} style={{ display: 'flex', margin: '0' }}>
            <i className={(type === 'positive' ? 'check circle outline' : 'times circle outline') + ' icon'}></i>
            <div className="content">
                <div className="header">{message}</div>
            </div>
        </div>
    );
}