import React, { Component } from 'react';

class SidebarGroup extends Component {
    render() {
        return (
            <div className="glukose-main p-0 sidebar-title">
                <p className="mb-0 pl-3">
                    {this.props.name}
                </p>
            </div>
        )
    }
}

export default SidebarGroup;