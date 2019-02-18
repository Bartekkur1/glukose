import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SidebarGroup extends Component {
    render() {
        return (
            <Link className="mb-0 sidebar-button" to={this.props.link}>
                 <div className="glukose-main p-3 pl-4 pt-2 pb-2 sidebar-button">
                    <i className={this.props.icon}></i>
                    {this.props.name}
                </div>
            </Link>
        )
    }
}

export default SidebarGroup;