import React, { useState } from 'react';
import { func } from 'prop-types';

FileButtons.propTypes = {
    onOpen: func.isRequired,
    onSave: func.isRequired, 
    onSaveAs: func.isRequired
};

export default function FileButtons({ onOpen, onSave, onSaveAs }) {

    return (
        <div>
            <button className="ui icon button green"
                onClick={ onOpen }
                title="Ouvrir">
                <i aria-hidden="true" className="folder open icon"></i>
            </button>
            <button className="ui icon button green"
                onClick={ onSaveAs }
                title="Enregistrer sous">
                <i aria-hidden="true" className="copy icon"></i>
            </button>
            <button className="ui icon button green"
                onClick={ onSave }
                title="Enregistrer">
                <i aria-hidden="true" className="save icon"></i>
            </button>
        </div>
    );
}
