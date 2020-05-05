import {Form, Button, Select, Input} from 'antd';
import React from 'react';
import 'antd/dist/antd.css';
import {Storage} from 'aws-amplify';
import Logo from '../../assets/logo.svg';
import {HOURS_CONSIDERED,MONTHS} from "../Constants"
import '../../styles/styles.scss';
import LoadingCard from "../Loadings/LoadingCard"
const { Option } = Select;

function toString(time){
    const month = MONTHS[time.getMonth()];
    const date = time.getDate();
    const hour = time.getHours();
    return month + " " + date + " " + hour + ":00";
}

class TravelPlanForm extends React.Component {

    state = {
        airportData: null
    }

    componentDidMount(){
        Storage.get(`s3/airports.json`).then((url)=> {
           fetch(url).then((response) => {
               return response.json();
           }).then((response) => {
               this.setState({airportData:response.airports});

           })
        });
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            this.props.nextStep(values);
        });
    };

    render() {
        const times = new Array(HOURS_CONSIDERED);
        for(let i =0; i < HOURS_CONSIDERED; ++i)
        {
            var start =new Date();
            start.setHours(start.getHours() + i + 1);
            times[i] = toString(start);
        }
        const { getFieldDecorator } = this.props.form;
        if (this.state.airportData === null){
            return <LoadingCard/>
        }
            else{
                return (
                    <div className='form-dashboard-container'>
                        <img src={Logo} className="logo-image"/>
                        <div className='form-container'>
                            <h2>Please tell us your travel plan today: </h2>
                            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
                                <Form.Item label="Flight Destination">
                                    {getFieldDecorator('flightDest', {
                                        rules: [{ required: true, message: 'Please input your flight destination!' }],
                                    })(<Select
                                        placeholder="Enter your flight Dest"
                                        onChange={this.handleSelectChange}
                                    >
                                        {this.state.airportData.map((data)=>{
                                            return <Option value={data} key={data}>{data}</Option>
                                        })}
                                    </Select>)}
                                </Form.Item>
                                <Form.Item label="Flight Time">
                                    {getFieldDecorator('flightTime', {
                                        rules: [{ required: true, message: 'Please input your flight time!' }],
                                    })(<Select
                                            placeholder="Enter your flight Time"
                                            onChange={this.handleSelectChange}
                                        >
                                            {times.map((time) => {
                                                return <Option value={time} key={time}>{time}</Option>;
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>

                                <Form.Item label="Latitude">
                                    {getFieldDecorator('lat', {
                                        rules: [{ required: false }],
                                    })(
                                        <Input placeholder="Left blank to use your default location"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="Longitude">
                                    {getFieldDecorator('long', {
                                        rules: [{ required: false}],
                                    })(
                                        <Input placeholder="Left blank to use your default location"/>
                                    )}
                                </Form.Item>
                                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                )
            }

    }
}

const WrappedTravelPlan= Form.create({ name: 'coordinated' })(TravelPlanForm);

export default WrappedTravelPlan;