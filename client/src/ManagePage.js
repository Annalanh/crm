import React from 'react';
import logo from './logo.svg';
import { Table, Space, Button, Select } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';

const { Option } = Select;
class ManagePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20', '40', '100'],
        showSizeChanger: true,
        total: '20'
      },
      loading: false,
      filters: {
        status: null
      }
    }
  }

  componentDidMount() {
    const { pagination, filters } = this.state;
    this.fetch({ pagination, filters });
  }

  fetch = (params = {}) => {
    this.setState({
      loading: true
    });
    axios.get(`http://localhost:8000/data?current=${params.pagination.current}&pageSize=${params.pagination.pageSize}&status=${params.filters.status}`).then(data => {
      this.setState({
        loading: false,
        data: data.data.results,
        pagination: {
          ...params.pagination,
          total: data.data.totalCount,
        },
        filters: {
          ...params.filters
        }
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
      filters: this.state.filters
    });
  };

  handleFilter = (value) => {
    let pagination = {
      ...this.state.pagination,
      current: 1
    }
    let filters = {
      ...this.state.filters,
      status: value
    }
    this.fetch({ pagination, filters })
  }

  handleClearFilter = () => {
    let pagination = {
      ...this.state.pagination,
      current: 1
    }
    let filters = {
      status: null
    }
    this.fetch({ pagination, filters })
  }

  render() {
    let { data, pagination, loading } = this.state;
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
        width: '20%',

      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => {
              axios.post('http://localhost:8000/sendMail', { email: record.email, name: record.name })
                .then(res => {
                  console.log(res)
                  if (res.data.status == 1) {
                    alert("Email sent!")
                  } else {
                    alert("Fail to send email!")
                  }
                })
            }}>Send mail</a>
            <a onClick={() => {
              localStorage.setItem('name', record.name)
              this.props.history.push("/edit")
            }}>Edit</a>
          </Space>
        ),
      },
    ];

    return (
      <>
        <Space style={{ marginBottom: 16, marginTop: 16 }}>
          <Select defaultValue="all" style={{ width: 120 }} onChange={this.handleFilter}>
            <Option value="all">Tất cả</Option>
            <Option value="L1">L1</Option>
            <Option value="L2">L2</Option>
            <Option value="L3">L3</Option>
            <Option value="L4">L4</Option>
          </Select>
          <Button onClick={this.handleClearFilter}>Clear filters</Button>
        </Space>
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
