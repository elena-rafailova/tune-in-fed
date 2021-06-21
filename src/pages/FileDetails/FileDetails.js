import React from 'react';
import { useParams } from 'react-router';

const FileDetails = () => {
    let { id } = useParams();
    console.log('file id:', id);
    return (
        <React.Fragment>
            <div>FileDetails</div>
        </React.Fragment>
    );
};

export default FileDetails;
