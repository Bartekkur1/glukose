import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import PasswordRecovery from './components/passwordRecovery';

class App extends Component {
  render() {
    return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/login" exact component={Login}/>
					<Route path="/register" exact component={Register}/>
					<Route path="/password_recovery" exact component={PasswordRecovery}/>
				</Switch>
			</BrowserRouter>
		</div>
    );
  }
}

export default App;