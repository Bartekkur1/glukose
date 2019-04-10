import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import PasswordRecovery from './components/passwordRecovery';
import SecuredRoutes from './components/securedRoute';
import Sidebar from './components/sidebar';

class App extends Component {
  render() {
    return (
			<BrowserRouter>
				<Switch>
					<Route path="/login" exact component={Login}/>
					<Route path="/register" exact component={Register}/>
					<Route path="/password_recovery" exact component={PasswordRecovery}/>
					<SecuredRoutes>
						<Route path="/" component={Sidebar}/>
					</SecuredRoutes>
					<Redirect to="/"/>
				</Switch>
			</BrowserRouter>
    );
  }
}

export default App;