import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false
        }
    }

    render() {
        return (
            <div className="glukose-main sidebar-group">
                <div className="sidebar-title" onClick={() => this.setState({open: !this.state.open})}>
                    <p className="m-0"><i className={"mr-3" + this.props.icon}></i>{this.props.name}</p>
                </div>
                <div className="sidebar-content glukose-off">
                    {this.state.open ? this.props.links.map((link, i) => {     
                        return <Link key={i} className="sidebar-link" to={link}>{this.props.names[i]}</Link>
                    }) : null}
                </div>
            </div>
        )
    }
}

export default SidebarGroup;