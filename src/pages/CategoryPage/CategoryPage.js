import React from 'react';
import { useParams } from 'react-router';

const CategoryPage = () => {
    let { categoryName } = useParams();
    console.log(categoryName);
    return (
        <React.Fragment>
            <div>CategoryPage</div>
        </React.Fragment>
    );
};

export default CategoryPage;
