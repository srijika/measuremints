import React from 'react';
import { Link } from 'react-router-dom';
import Apploader from './../../components/loader/loader'
import axios from 'axios';
import { connect } from 'dva';
import { Empty, Card, Typography, Alert, Input, Button, Table, Radio, Divider, Switch, Row, Col, Avatar, Pagination, Tabs, Modal, Badge, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddEdit from './action/addEdit'
import { getTitleImage } from '../../utils/functions';
import Moment from 'react-moment';

const { Search } = Input;
const { Text } = Typography;
const baseUrl = process.env.REACT_APP_ApiUrl;

class SubCategoryList extends React.Component {  
	constructor(props) {
		super(props);
		this.state = { limit: 25, current: 1, sortBy: 'asc', addModel: false, inactive: false, searchText: '', loader: false, detail: '', count: 0, Addcount: 0, listData: [], category: [] }
		setTimeout(() => document.title = 'Sub-CategoryList', 100,);
	}

	componentDidMount()
	 {
		this.ListFun();
	}

	ListFun = async(categoryIdDropdown) => {
		let search = 'page=' + (this.state.current - 1) + "&limit=" + this.state.limit + "&inactive=" + this.state.inactive + "&searchText=" + this.state.searchText + "&sortBy=" + this.state.sortBy;
		localStorage.setItem('serviceSearch', JSON.stringify(this.state))

		let searchval = { page: 0, limit: this.state.limit, inactive: this.state.inactive, 
			searchText: this.state.searchText, sortBy: this.state.sortBy,
			 category_id: categoryIdDropdown }
		this.props.dispatch({ type: 'subcategory/subCategoryList', payload: searchval, });
		const res = await axios.post(`${baseUrl}/list/category`);
		this.setState({ category: res })

		
		

	}

	ShowSizeChange = (current, size) => this.setState({ limit: size }, () => this.ListFun());
	switchFun = (val) => this.setState({ inactive: val }, () => this.ListFun());
	ChangeOrder = (val) => this.setState({ sortBy: this.state.sortBy === 'asc' ? 'desc' : 'asc' }, () => this.ListFun());
	paginationFun = (val) => this.setState({ current: val.current }, () => this.ListFun());

	searchVal = (val) => {
		this.state.searchText = val
		
		const resultAutos = this.props.subcategory.list.data.filter((auto) => auto.name.toLowerCase().includes(val.toLowerCase()) || auto.slug.toLowerCase().includes(val.toLowerCase()))
		
		this.setState({ listData: resultAutos })

	}

	createCat = (val) => {
		console.log(val)
		if (val) { this.ListFun() }
		this.setState({ detail: '', addModel: false })
	}

	deleteCat = id => {
		this.props.dispatch({ type: 'subcategory/subCategoryDel', payload: { _id: id }, });
	}

	getSnapshotBeforeUpdate(prevProps, prevState) {
		if (this.props.subcategory.del && this.props.subcategory.del.count > this.state.count && this.props.subcategory.del.status) {
			this.setState({ count: this.props.subcategory.del.count })
			return true
		}
		if (this.props.subcategory.add && this.props.subcategory.add.count > this.state.Addcount && this.props.subcategory.add.status) {
			this.setState({ Addcount: this.props.subcategory.add.count, addModel: false })
			return true
		}
		return null;
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (snapshot) {
			this.ListFun()
		}
	}

	render() {
	
		const { inactive, limit, searchText, addModel, detail } = this.state;
		const { subcategory, category } = this.props;

		// console.log('category is adath');
		// console.log(category.list);
	
		if(this.state.searchText == ''){
			this.state.listData = subcategory.list ? subcategory.list.data : [];
		}
		const total = 0;//list ? list.total : 0;
		const totalActive = 0 //list ?  list.totalActive : 0;
		//console.log(this.props.listLoc)
		const columns = [
			{
				title:
					<strong className="primary-text cursor" onClick={this.ChangeOrder}>Sub Category Name <i className={' fal fa-sm ' + (this.state.sortBy === 'asc' ? "fa-long-arrow-up" : "fa-long-arrow-down")} ></i></strong>,
				dataIndex: 'name',
				//width:250,
				render: (val, data) => <div className={data.isActive ? "" : 'danger-text'}>{getTitleImage(val)}</div>
			},
		
			{ title: <strong>Parent Category <br />
			</strong>, dataIndex: ['parent_category','category_name'], },
			   {
				title: <strong>Created Date</strong>,
				dataIndex: 'created_at',  
				render:(val,data) => {
				  return (data.created_at? <Moment format="MM- DD-YYYY" >{data.created_at}</Moment>:'-')
				}
			  },
			{
				title: <strong>Action</strong>, width: 200, align: 'center',
				render: (val, data) => <div onClick={e => e.stopPropagation()}>
					<Button style={{marginBottom : '4px'}}  title="View and Edit Sub Category" type="primary" onClick={() =>this.setState({ addModel: true, detail: data })}><EditOutlined /></Button>&nbsp;
					<Popconfirm title="Are you sure delete this sub category?" onConfirm={e => { this.deleteCat(data._id); e.stopPropagation() }} okText="Yes" cancelText="No" >
						<Button type="danger" ><DeleteOutlined /></Button>
					</Popconfirm>
				</div>
			},
		];
		return (
			<div>
				<Apploader show={this.props.loading.global} />
				<Row className="TopActionBar" gutter={[16, 0]} justify="space-between" align="middle">
					<Col>
						<Search placeholder="Search..." onChange={(e) =>  {
						this.searchVal(e.target.value)
						}
						} value={searchText}
						 	loading={this.props.submitting} />
					
					</Col>
					<Col>
					
						<Button type="primary" onClick={() => this.setState({ addModel: true })}>Add</Button> 
					</Col>
				</Row>

				<div className="innerContainer">
					<Card style={{ marginTop: "0" }} bodyStyle={{ padding: '0 15px 15px' }}>
						<Table columns={columns} dataSource={this.state.listData}
							onChange={this.paginationFun}
							//pagination={{ position: ['bottomLeft'] }}
							rowKey={record => record._id}
							onRow={(record, rowIndex) => {
								return {
									onClick: event => this.setState({ addModel: false, detail: record })
								};
							}}

							pagination={{
								position: ['bottomLeft'],
								// size:'small',
								// defaultCurrent:1,
								// total:total, pageSize: limit,
								showTotal: (total, range) => <Text type="secondary">{`Showing ${range[0]}-${range[1]} of ${total}`}</Text>, showSizeChanger: true,
								responsive: true,
								onShowSizeChange: (current, size) => this.ShowSizeChange(current, size),
								pageSizeOptions: ['25', '50', '100', '250', '500'],
							}}
						/>
					</Card>
				</div>

				{/*Create New*/}
				<AddEdit categoryData={this.state.category} visible={addModel} returnData={this.createCat} closeModel={() => this.setState({ addModel: false, detail: '' })} detail={detail} />
			</div>
		);
	}
};

export default connect(({ subcategory, loading, category }) => ({
	subcategory, loading, category
}))(SubCategoryList);