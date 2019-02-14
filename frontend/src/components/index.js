import React, { Component } from 'react';
import Axios from 'axios';
import Sidebar from 'react-sidebar';
import { server } from '../../package.json';
import { Route, Redirect } from 'react-router-dom';
import DailyStatistics from './dailyStatistics';
import NewRecord from './newRecord';
import SidebarGroup from './sidebarGroup';
import { Link } from 'react-router-dom';
import UserInfo from './userinfo.js';
import Account from './account.js';
import Statistics from './statistics.js';

const mql = window.matchMedia(`(min-width: 800px)`);

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false,
            redirect: null,
            path: null
        };
    
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }
    
    componentDidMount() {
        this.setState({path: this.props.location.pathname})
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

    async componentDidUpdate(prevProps) {
        try {
            await Axios.post(server + "/api/auth/check");
        }
        catch(e)
        {
            console.log(e);
            localStorage.clear();
            this.setState({redirect: <Redirect to={{
                pathname: "/login"}}/>})
        }
        if (this.props.location.pathname !== prevProps.location.pathname 
            && this.state.sidebarOpen && !this.state.sidebarDocked) {
            this.setState({sidebarOpen: false})
        }
    }

    render() {
        if(this.state.redirect)
            return this.state.redirect;
        var sidebar = (
            <div className="sidebar-content container">
                <div className="row h-100">
                    <div className="col-12 p-0">
                        <img className="mx-auto mt-2 sidebar-logo" width="220px" height="60px" 
                        src={process.env.PUBLIC_URL + '/images/logo2.svg'} alt="logo"/>
                        <button className="btn mb-2 mx-auto p-0 logout w-100"
                        onClick={() => this.logout()}>
                        <i className="pr-2 fa fas fa-power-off"></i>Wyloguj</button><hr/>
                        <SidebarGroup name="Statystyka" links={["/dailystats", "/stats"]} 
                        names={["Dzienna", "Ogólna"]} icon="p-0 fa fa-bar-chart"/>
                        <SidebarGroup name="Ustawienia" links={["/account", "/userinfo"]} 
                        names={["Konto", "Moje informacje"]} icon="p-0 fa fas fa-cog"/>
                        <Link className="sidebar-link2 glukose-main" to="/add_record">
                        <i className="mr-2 fa fas fa-plus"></i>Dodaj rekord</Link>
                    </div>
                    <div className="col-12 mt-auto footer">
                        <hr/>
                        <p>Glukose 1.0</p>
                    </div>
                </div>
            </div>
        )
        return (
            <Sidebar
                sidebar={sidebar}
                children={
                    <div className="h-100">
                        <button style={this.state.sidebarDocked ? {display: "none"} : {display: "inline-block"}} 
                        className="btn glukose-main sidebar-button p-0" type="submit" 
                        onClick={() => this.setState({sidebarOpen: true})}>
                        <i className="fa fa-2x fas fa-arrow-right"></i>
                        </button>
                            <Route path="/dailystats" exact component={DailyStatistics} />
                            <Route path="/userinfo" exact component={UserInfo} />
                            <Route path="/add_record" exact component={NewRecord} />
                            <Route path="/account" exact component={Account}/>
                            <Route path="/stats" exact component={Statistics}/>
                    </div>
                }
                sidebarClassName={
                    "glukose-main"
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