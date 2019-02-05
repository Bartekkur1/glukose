import React, { Component } from 'react';
import Axios from 'axios';
import Sidebar from 'react-sidebar';
import { server } from '../../package.json';
import { Route, Redirect } from 'react-router-dom';
import SidebarButton from './sidebarButton';
import Sugar from './sugar';

const mql = window.matchMedia(`(min-width: 800px)`);

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false,
            redirect: null
        };
    
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }
    
    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }
    
    componentWillUnmount() {
        if(this.state.mql)
            this.state.mql.removeListener(this.mediaQueryChanged);
    }
    
    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }
    
    mediaQueryChanged() {
        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
    }

    logout() {
        localStorage.clear();
        this.setState({redirect: <Redirect to="/login"/>});
    }

    async apiTest() {
        let res = await Axios.get(server + "/api/sugar");
        console.log(res);
    }

    render() {
        if(this.state.redirect)
            return this.state.redirect;
        var sidebar = (
            <div className="sidebar-content container">
                <div className="row">
                    <div className="col-12 p-0">
                        <img className="mx-auto mt-2 sidebar-logo" width="220px" height="60px" 
                        src={process.env.PUBLIC_URL + '/images/logo2.svg'} alt="logo"/>
                        <button className="btn mb-2 mx-auto p-0 logout w-100"
                        onClick={() => this.logout()}>
                        <i className="pr-2 fa fas fa-power-off"></i>Wyloguj
                        </button>
                        <hr/>
                        <SidebarButton name="Cukry" icon="pr-2 fa fa-area-chart"/>
                        <SidebarButton name="Insulina" icon="pr-2 fa fas fa-syringe"/>
                        <SidebarButton name="Posiłki" icon="pr-2 fas fa-utensils"/>
                    </div>
                </div>
            </div>
        )
        return (
            <Sidebar
                sidebar={sidebar}
                children={
                    <div>
                        <button style={this.state.sidebarDocked ? {display: "none"} : {display: "inline-block"}} 
                        className="btn glukose-green sidebar-button p-0" type="submit" 
                        onClick={() => this.setState({sidebarOpen: true})}>
                        <i className="fa fa-2x fas fa-arrow-right"></i>
                        </button>
                            <Route path="/sugar" exact component={Sugar} />
                    </div>
                }
                sidebarClassName={
                    "glukose-green"
                }
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}
            >
            </Sidebar>
            );
    }
}

export default Index;