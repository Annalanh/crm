import React from 'react';
import logo from './logo.svg';
import { Table, Space, Button } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: '20%'
  },
];


class ManagePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 2,
        pageSizeOptions: ['2', '4', '6'],
      },
      loading: false,
    }
  }

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    axios.get(`http://localhost:8000/data/${params.pagination.current}/${params.pagination.pageSize}`).then(data => {
      console.log(data)
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
    this.fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  render() {
    let { data, pagination, loading } = this.state;
    return (
      <>
        <Table
          columns={columns}
          // rowKey={record => record.login.uuid}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={this.handleTableChange}
          onRow={(r) => ({
            onClick: () => {
              localStorage.setItem('name', r.name)
              this.props.history.push("/edit")
            },
          })}
        />
      </>
    );
  }

}

export default ManagePage;
