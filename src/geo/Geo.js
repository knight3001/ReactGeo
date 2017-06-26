import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

const ApiUrl = "http://localhost:5000/job/";

class UserForm extends Component {
    constructor(props) {
        super(props);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange() {
        var file = this.refs.csv.files[0];
        if (!file)
            return;

        let result = [];
        let row;
        let index = 0;
        let _that = this;
        let reader = new FileReader();
        reader.onload = function (event) {
            let line = reader.result.split('\n');
            for (let i = 0; i < line.length; i++) {
                row = {};
                index = line[i].indexOf(",", 1);
                row["name"] = line[i].slice(0, index);
                row["address"] = line[i].slice(index + 1, line[i].length).replace(/["]/g, "");
                result.push(row);
            }
            let json = JSON.parse(JSON.stringify(result));
            axios({
                method: 'post',
                url: ApiUrl,
                data: json
            })
                .then(response => {
                    if (response.status === 200) {
                        _that.props.onUserChange(
                            response.data["jobid"]
                        );
                        console.log(response.data);
                    }
                    //console.log(response);
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

class JobTable extends Component {

    render() {
        let buf = [];
        const jobList = this.props.jobList;
        for (let i = 0; i < jobList.length; i++) {
            buf.push(<Job jobid={jobList[i]} key={i} />);
        }
        return (
            <ol className="list-group">
                {buf}
            </ol>
        )
    }
}

class Job extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "pending",
            addresses: []
        };
    }

    componentDidMount() {
        const jobid = this.props.jobid;
        axios.get(ApiUrl + jobid, {
            params: {}
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        code: response.data["code"]
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const jobid = this.props.jobid;
        const code = this.state.code;
        return (
            <li className="list-group-item listItem">
                <span className="badge-left">{jobid}</span>
                {code}
            </li>
        )
    }
}

class Geo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobList: [12, 16, 17, 18]
        };
        this.handleJobChange = this.handleJobChange.bind(this);
    }

    handleJobChange(jobid) {
        this.setState({
            jobList: this.state.jobList.concat([{
                jobid
            }])
        });
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading"><h3 className="panel-title">Geo Location Request</h3></div>
                <div className="panel-body">
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-8 col-md-offset-2">
                            <UserForm
                                onUserChange={this.handleJobChange}
                            />
                            <JobTable
                                jobList={this.state.jobList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Geo;