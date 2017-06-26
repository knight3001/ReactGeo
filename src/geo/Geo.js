import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

const ApiUrl = "http://localhost:5000/job/";

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange() {
        var file = this.refs.csv.files[0];
        if (!file)
            return;

        let result = [];
        let row;
        let reader = new FileReader();
        reader.onload = function (event) {
            let csv = reader.result.split('\n');
            for (let i = 0; i < csv.length; i++) {
                row = {};
                row["name"] = csv[i].split(",")[0];
                row["address"] = csv[i].split(",")[1];
                result.push(row);
            }
            let json = JSON.parse(JSON.stringify(result));

            axios.get(ApiUrl + "2", {
                    params: {
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        console.log(response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
        // when the file is read it triggers the onload event above.
        reader.readAsText(file, 'UTF-8');
    }

    render() {
        return (
            <form className="form-horizontal">
                <fieldset>
                    <div className="form-group">
                        <label className="control-label btn btn-primary">
                            Browse File
                            <input type="file" className="hidden" accept=".csv,.txt" ref="csv" onChange={this.handleFileChange} />
                        </label>
                    </div>
                </fieldset>
            </form>
        );
    }
}

class Geo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobList: [],
            addressAll: {}
        };

    }

    render() {
        const addressAll = this.state.addressAll;
        return (
            <div className="panel panel-default">
                <div className="panel-heading"><h3 className="panel-title">Geo Location Request</h3></div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-8 col-md-offset-2">
                            <UserForm
                                addressAll={addressAll}
                            />

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Geo;