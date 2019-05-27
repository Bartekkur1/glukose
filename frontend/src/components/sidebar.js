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
import Account from './accountPanel';
import Statistics from './statistics.js';
import Export from './export.js';
import Home from './home';
import DataEdit from './dataedit';
import Meal from './meal';
import Sugar from './sugar';
import Dose from './dose';

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
        Axios.post(server + "auth/logout");
        this.setState({redirect: <Redirect to="/login"/>});
    }

    async componentDidUpdate(prevProps) {
        try {
            await Axios.post(server + "auth/check");
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
                        <hr className="hr-light"/>
                        <SidebarButton name="Strona główna" link="/" icon="fa fas fa-home"/>
                        <hr className="hr-title" />
                        <SidebarTitle name="Statystyka" />
                        <SidebarButton name="Dzienna" link="/dailystats" icon="fa fas fa-bar-chart" />
                        <SidebarButton name="Ogólna" link="/stats" icon="fa fas fa-bar-chart"  />
                        <hr className="hr-title" />
                        <SidebarTitle name="Rekordy" />
                        <SidebarButton name="Dodaj rekord" link="/add_record" icon="fa fas fa-plus" />
                        <SidebarButton name="Edycja danych" link="/dataedit" icon="fa fas fa-wrench" />
                        <hr className="hr-title" />
                        <SidebarTitle name="Ustawienia" />
                        <SidebarButton name="Konto" link="/account" icon="fa fas fa-cog" />
                        <SidebarButton name="Użytkownik" link="/userinfo" icon="fa fas fa-user" />
                    </div>
                    <div className="col-12 mt-auto footer">
                        <button className="btn mx-auto p-0 logout w-100"
                            onClick={() => this.logout()}>
                        <i className="pr-2 fa fas fa-power-off"></i>Wyloguj</button>
                        <hr/>
                        <p>Glukose 1.2b</p>
                    </div>
                </div>
            </div>
        )
        return (
            <Sidebar
                sidebar={sidebar}
                children={
                    <div className="h-100">
                        {/* <button style={this.state.sidebarDocked ? {display: "none"} : {}} 
                            className="btn sidebar-slide p-0 ml-2 mt-2" type="submit" 
                            onClick={() => this.setState({sidebarOpen: true})}>
                        <i className="fa fa-2x fas fa-bars"></i>
                        </button> */}
                            <Route path="/" exact component={Home} />
                            <Route path="/dailystats" exact component={DailyStatistics} />
                            <Route path="/userinfo" exact component={UserInfo} />
                            <Route path="/add_record" exact component={NewRecord} />
                            <Route path="/account" exact component={Account} />
                            <Route path="/stats" exact component={Statistics} />
                            <Route path="/export" exact component={Export} />
                            <Route path="/dataedit" exact component={DataEdit} />
                            <Route path="/meal/:id" component={Meal} />
                            <Route path="/sugar/:id" component={Sugar} />
                            <Route path="/dose/:id" component={Dose} />
                    </div>
                }
                sidebarClassName={"glukose-main"}
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={this.onSetSidebarOpen}
                touch={true}
            >
            </Sidebar>
            );
    }
}

export default Index;