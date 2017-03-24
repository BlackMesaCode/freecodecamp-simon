import React from "react";
import classNames from "classnames";



export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    chooseColor(color) {
        if (this.props.inputEnabled) {
            return this.props.chooseColor.bind(this, color);
        }
    }

    render() {
        return (
            <div>
                <div className={classNames('color', 'red', {'red-is-selected': this.props.selectedColor === 'red'}, {'red-hover': this.props.inputEnabled})} onClick={this.chooseColor("red")}></div>
                <div className={classNames('color', 'green', {'green-is-selected': this.props.selectedColor === 'green'}, {'green-hover': this.props.inputEnabled})} onClick={this.chooseColor("green")}></div>
                <div className={classNames('color', 'blue', {'blue-is-selected': this.props.selectedColor === 'blue'}, {'blue-hover': this.props.inputEnabled})} onClick={this.chooseColor("blue")}></div>
                <div className={classNames('color', 'yellow', {'yellow-is-selected': this.props.selectedColor === 'yellow'}, {'yellow-hover': this.props.inputEnabled})} onClick={this.chooseColor("yellow")}></div>
            </div>
        );
    }
}