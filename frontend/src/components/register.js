import React, { Component } from 'react';
import axios from 'axios';
import ErrorHandler from '../ErrorHandler';
import {server} from '../../package.json';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <h1>Register here</h1>
        );
    }
}