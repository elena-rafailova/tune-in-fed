import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import FilesList from '../../components/File/FilesList';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Filters from '../../components/Filters/Filters';
import { useHttpClient } from '../../hooks/http-hook';
import './CategoryPage.scss';

const CategoryPage = () => {
    let { categoryName } = useParams();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedFiles, setLoadedFiles] = useState();
    const [filesCopy, setFilesCopy] = useState();

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

    useEffect(() => {
        if (loadedFiles) {
            setFilesCopy(JSON.parse(JSON.stringify(loadedFiles)));
        }
    }, [loadedFiles]);

    return (
        <div className="category-page">
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && filesCopy && (
                <div>
                    <h1 className="ta-center">{categoryName}</h1>
                    <Filters
                        filesOriginal={loadedFiles}
                        filesCopy={filesCopy}
                        setFilesCopy={setFilesCopy}
                    />
                    <FilesList items={filesCopy} />
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
