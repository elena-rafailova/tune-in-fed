import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Search from './pages/Search/Search';
import Help from './pages/Help/Help';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import FileDetails from './pages/FileDetails/FileDetails';
import ProfilePayment from './pages/Profile/ProfilePayment';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ProfileLists from './pages/Profile/ProfileLists';
import MainNavigation from './components/Navigation/MainNavigation';
import Footer from './components/Footer/Footer';
import { AuthContext } from './context/auth-context';
import { CategoriesContext } from './context/categories-context';
import { useAuth } from './hooks/auth-hook';
import { useHttpClient } from './hooks/http-hook';

const App = () => {
    const { token, login, logout, userId, user } = useAuth();
    const httpClient = useHttpClient();
    const [categories, setCategories] = useState();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const responseData = await httpClient.sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/library/getCategories'
                );

                setCategories(
                    responseData.categories.map((cat) => {
                        return {
                            title: cat.title,
                            path: '/library/' + cat.title,
                            cName: 'dropdown-link',
                        };
                    })
                );
            } catch (err) {}
        };

        fetchCategories();
    }, []);

    let routes;

    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/search" exact>
                    <Search />
                </Route>
                <Route path="/library/:categoryName" exact>
                    <CategoryPage />
                </Route>
                <Route path="/help" exact>
                    <Help />
                </Route>
                <Route path="/profile/payment" exact>
                    <ProfilePayment />
                </Route>
                <Route path="/profile/settings" exact>
                    <ProfileSettings />
                </Route>
                <Route path="/profile/lists" exact>
                    <ProfileLists />
                </Route>
                <Route path="/file/:id" exact>
                    <FileDetails />
                </Route>
                <Redirect to="/" />
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/search" exact>
                    <Search />
                </Route>
                <Route path="/library/:categoryName" exact>
                    <CategoryPage />
                </Route>
                <Route path="/help" exact>
                    <Help />
                </Route>
                <Route path="/auth">
                    <Auth />
                </Route>
                <Route path="/file/:id" exact>
                    <FileDetails />
                </Route>
                <Redirect to="/auth" />
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                login: login,
                logout: logout,
                user: user,
            }}
        >
            <Router>
                <CategoriesContext.Provider
                    value={{ categories: categories || [] }}
                >
                    <MainNavigation />
                    <main>{routes}</main>
                    <Footer />
                </CategoriesContext.Provider>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
