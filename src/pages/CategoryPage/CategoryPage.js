import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import FilesList from '../../components/File/FilesList';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import './CategoryPage.scss';

const CategoryPage = () => {
    let { categoryName } = useParams();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedFiles, setLoadedFiles] = useState();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL +
                        '/library/category/' +
                        categoryName.toLowerCase()
                );

                setLoadedFiles(responseData.files);
            } catch (err) {}
        };
        fetchFiles();
    }, [sendRequest, categoryName]);

    return (
        <div className="category-page">
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedFiles && (
                <div>
                    <h1 className="ta-center">{categoryName}</h1>
                    <FilesList items={loadedFiles} />
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
