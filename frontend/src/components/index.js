import React, { Component } from 'react';
import Axios from 'axios';
import Sidebar from 'react-sidebar';
import { server } from '../../package.json';
import { Route, Redirect } from 'react-router-dom';
import DailyStatistics from './dailyStatistics';
import NewRecord from './newRecord';
import SidebarButton from './sidebarButton';
import SidebarTitle from './sidebarTitle';
import UserInfo from './userinfo.js';
import Account from './account.js';
import Statistics from './statistics.js';
import Export from './export.js';
import Home from './home';

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
        Axios.post(server + "/api/auth/logout");
        this.setState({redirect: <Redirect to="/login"/>});
    }

    async componentDidUpdate(prevProps) {
        try {
            await Axios.post(server + "/api/auth/check");
        }
        catch(e)
        {
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
                        <button className="btn mb-3 mx-auto p-0 logout w-100"
                        onClick={() => this.logout()}>
                        <i className="pr-2 fa fas fa-power-off"></i>Wyloguj</button>
                        <hr className="hr-light"/>
                        <SidebarButton name="Strona główna" link="/" icon="fa fas fa-home"/>
                        <hr className="hr-title" />
                        <SidebarTitle name="Statystyka" />
                        <SidebarButton name="Dzienna" link="/dailystats" icon="fa fas fa-bar-chart"/>
                        <SidebarButton name="Ogólna" link="/stats" icon="fa fas fa-bar-chart"/>
                        <hr className="hr-title" />
                        <SidebarTitle name="Rekordy" />
                        <SidebarButton name="Dodaj rekod" link="/add_record" icon="fa fas fa-plus"/>
                        <hr className="hr-title" />
                        <SidebarTitle name="Ustawienia" />
                        <SidebarButton name="Konto" link="/account" icon="fa fas fa-cog"/>
                        <SidebarButton name="Użytkownik" link="/userinfo" icon="fa fas fa-user"/>
                        <hr className="hr-title" />
                        <SidebarTitle name="Dane" />
                        <SidebarButton name="Eksport" link="/export" icon="fa fas fa-download"/>
                        {/* <SidebarButton name="Import" link="/import" icon="fa fas fa-upload"/> */}
                    </div>
                    <div className="col-12 mt-auto footer">
                        <hr/>
                        <p>Glukose 1.1a</p>
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
                        className="btn glukose-main sidebar-slide p-0" type="submit" 
                        onClick={() => this.setState({sidebarOpen: true})}>
                        <i className="fa fa-2x fas fa-arrow-right"></i>
                        </button>
                            <Route path="/" exact component={Home} />
                            <Route path="/dailystats" exact component={DailyStatistics} />
                            <Route path="/userinfo" exact component={UserInfo} />
                            <Route path="/add_record" exact component={NewRecord} />
                            <Route path="/account" exact component={Account}/>
                            <Route path="/stats" exact component={Statistics}/>
                            <Route path="/export" exact component={Export}/>
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