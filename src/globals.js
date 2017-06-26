import React, { Component } from 'react';

export class SymbolCheckbox extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const id = "symbols-" + this.props.index;
        const symbol = this.props.symbol;
        const checked = this.props.checked;
        return (
            <div style={{float:"left", marginRight:"10px", marginBottom:"10px"}}>
                <input type="checkbox" id={id} className="fancy-checkbox" onChange={() => this.props.onChange()} />
                <div className="btn-group">
                    <label htmlFor={id} className="btn btn-primary">
                        <span className="glyphicon glyphicon-ok" />
                        <span> </span>
                    </label>
                    <label htmlFor={id} className="btn btn-default active">
                        {symbol}
                    </label>
                </div>
            </div>
        )
    }
}