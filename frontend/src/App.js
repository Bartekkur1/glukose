import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';

class App extends Component {
  render() {
    return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/login" exact component={Login}/>
					<Route path="/register" exact component={Register}/>
				</Switch>
			</BrowserRouter>
		</div>
    );
  }
}

export default App;