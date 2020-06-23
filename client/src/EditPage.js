import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import './EditPage.css';
import axios from 'axios'; 

class EditPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            status: ''
        }
    }
    
    componentDidMount(){
        axios.get(`http://localhost:8000/getLead/${localStorage.getItem('name')}`)
            .then(data => {
                let leadInfo = data.data[0]
                this.setState({
                    name: leadInfo.name,
                    email: leadInfo.email,
                    status: leadInfo.status
                })
            })
    }
    render() {
        const layout = {
            labelCol: {
              span: 8,
            },
            wrapperCol: {
              span: 16,
            },
        };

        const tailLayout = {
            wrapperCol: {
              offset: 8,
              span: 16,
            },
        };

        const onFinish = values => {
            console.log('Success:', values);
            let { name, email, status } = values
            axios.post('http://localhost:8000/update', { name, email, status, currentName: localStorage.getItem('name') })
			.then(res => {
                if(res) {
                    alert('updated')
                    localStorage.removeItem('name')
                }
			})
        };
        
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        let { name, email, status } = this.state

        console.log(this.state)

        return (
            <>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        name,
                        email,
                        status
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: 'Please input status!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </>
        )
    }
}


export default EditPage;
