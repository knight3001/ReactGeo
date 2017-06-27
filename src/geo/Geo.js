import React, { Component } from 'react';

import axios from 'axios';
import moment from 'moment';

const ApiUrl = "http://localhost:5000/";

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
                url: ApiUrl + "job/",
                data: json
            })
                .then(response => {
                    if (response.status === 202) {
                        _that.props.onUserChange(
                            response.data["jobid"]
                        );
                        //console.log(response.data);
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

class JobTable extends Component {

    render() {
        let buf = [];
        const jobList = this.props.jobList;
        for (let i = 0; i < jobList.length; i++) {
            buf.push(<Job jobid={jobList[i]} key={i} />);
        }
        return (
            <div className="list-group">
                {buf}
            </div>
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

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const jobid = this.props.jobid;
        this.checkJobStatus(jobid);
    }

    /*componentDidUpdate(prevProps, prevState) {
        if(prevState.code !== this.state.code && this.state.code === "complete"){
            const jobid = this.props.jobid;
            this.getJobData(jobid);
        }
    }*/
    
    handleClick() {
        const jobid = this.props.jobid;
        this.setState({
            code: "waiting"
        })
        this.getJobData(jobid);
    }

    checkJobStatus(jobid) {
        axios.get(ApiUrl + "queue/" + jobid, {
            params: {}
        })
            .then(response => {
                if (response.status === 200) {
                    this.getJobData(jobid);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    getJobData(jobid) {
        axios.get(ApiUrl + "job/" + jobid, {
            params: {}
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        code: response.data["code"],
                        addresses: response.data["results"]
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
        const addresses = this.state.addresses;
        if (code === "pending") {
            return (
                <div className="list-group-item listItem">
                    <span className="badge-left">{jobid}</span>
                    <span className="badge-status" style={{ color: "red" }}>{code}</span>
                    <button type="button" className="btn btn-info" onClick={this.handleClick}>Update</button>
                </div>
            )
        }
        else if (code === "waiting") {
            return (
                <div className="list-group-item listItem">
                    <span className="badge-left">{jobid}</span>
                    <span className="badge-status" style={{ color: "yellow" }}>{code}</span>
                    <span className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                    </span>
                    <span className="clear"></span>
                </div>
            )
        }
        else {
            let buf = [];
            for (let i = 0; i < addresses.length; i++) {
                buf.push(<tr key={i}><td>{addresses[i]["name"]}</td><td>{addresses[i]["address"]}</td>
                    <td>{addresses[i]["latitude"]}</td><td>{addresses[i]["longitude"]}</td></tr>)
            }
            return (
                <div className="list-group-item listItem">
                    <span className="badge-left">{jobid}</span>
                    <span className="badge-status flashRow" style={{ color: "green" }}>{code}</span>
                    <table className="list-table table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Latitude</th>
                                <th>longitude</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buf}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
}

class Geo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobList: []
        };
        this.handleJobChange = this.handleJobChange.bind(this);
    }

    handleJobChange(jobid) {
        this.setState({
            jobList: this.state.jobList.concat(jobid)
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