import React, { Component } from 'react';

class ContentFrame extends Component {
    render() {
        return (
            <div className={this.props.col + " cFrame"}>
                <div className="row">
                    <div className="col-12 p-0 text-center cFrame-title glukose-main">
                        <span>{this.props.title}</span>
                    </div>
                </div>
                <div className="row h-100 pb-5">
                    <div className="col-12 p-0 cFrame-content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default ContentFrame;