import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarGroup extends Component {
    render() {
        return (
            <div className="glukose-main p-3 pt-2 pb-2 sidebar-button">
                <i className={this.props.icon}></i>
                <Link className="mb-0 sidebar-button" to={this.props.link}>{this.props.name}</Link>
            </div>
        )
    }
}

export default SidebarGroup;