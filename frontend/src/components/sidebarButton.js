import React, { Component } from 'react';

class SidebarButton extends Component {
    render() {
        return (
            <button className="btn w-100 sidebar-link mt-2">
            <i className={this.props.icon}></i>          
            {this.props.name}</button>
        )
    }
}

export default SidebarButton;