import React, { Component } from 'react';
import Axios from 'axios';
import Sidebar from 'react-sidebar';
import { server } from '../../package.json';

const mql = window.matchMedia(`(min-width: 800px)`);

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false
        };
    
        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }
    
    componentWillMount() {
        mql.addListener(this.mediaQueryChanged);
    }
    
    componentWillUnmount() {
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
        this.props.history.push('/login');
    }

    async apiTest() {
        let res = await Axios.get(server + "/api/sugar");
        console.log(res);
    }

    render() {
        return (
            <Sidebar
                sidebar={
                    <h1>keks maximus</h1>
                }
                children={
                    <button style={this.state.sidebarDocked ? {display: "none"} : {display: "inline-block"}} className="btn" type="submit" value={this.state} onClick={() => this.setState({sidebarOpen: true})}>>></button>
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