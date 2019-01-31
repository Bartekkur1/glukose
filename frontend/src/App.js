import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/login';


class App extends Component {
  render() {
    return (
		<div>
			<BrowserRouter>
				<Switch>
					<Route path="/login" exact component={Login}/>
				</Switch>
			</BrowserRouter>
		</div>
    );
  }
}

export default App;