import React from 'react';
import logo from './logo.svg';
import { Table, Space, Button } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';

class ManagePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 2,
        pageSizeOptions: ['2', '4'],
        showSizeChanger: true,
        total:'20'
      },
      loading: false,
      filteredInfo: null
    }
  }

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  fetch = (params = {}) => {
    this.setState({ 
      loading: true 
    });
    axios.get(`http://localhost:8000/data/${params.pagination.current}/${params.pagination.pageSize}`).then(data => {
      this.setState({
        loading: false,
        data: data.data.results,
        pagination: {
          ...params.pagination,
          total: data.data.totalCount,
        },
      });
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ 
      filteredInfo: filters
    });
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  render() {
    let { data, pagination, loading } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    let columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '20%',
        key: 'name',
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        filters: [
          { text: 'L1', value: 'L1' },
          { text: 'L2', value: 'L2' },
          { text: 'L3', value: 'L3' },
          { text: 'L4', value: 'L4' },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => {console.log(record.status.includes(value))},
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick= {() => {
              axios.post('http://localhost:8000/sendMail', { email: record.email, name: record.name  })
              .then(res => {
                console.log(res)
                if(res.data.status == 1) {
                  alert("Email sent!")
                }else{
                  alert("Fail to send email!")
                }
              })
            }}>Send mail</a>
            <a onClick= {() => {
              localStorage.setItem('name', record.name)
              this.props.history.push("/edit") 
            }}>Edit</a>
          </Space>
        ),
      },
    ];

    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
        />
      </>
    );
  }

}

export default ManagePage;
