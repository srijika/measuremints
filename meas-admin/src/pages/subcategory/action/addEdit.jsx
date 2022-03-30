import React, { useState, useEffect, useRef, Fragment } from 'react';
import { Empty, Modal, Card, Typography, Alert, Form, Input, Checkbox, Button, Switch, Upload, Dropdown, Menu, Select, notification, Transfer, DatePicker } from 'antd';
import { connect } from 'dva';
import axios from 'axios';


const { Text } = Typography;
const { TextArea } = Input;
const timestemp = (new Date()).getTime();
const { RangePicker } = DatePicker;
const formItemLayout = { labelCol: { xs: { span: 24, }, sm: { span: 24, }, } };

const baseUrl = process.env.REACT_APP_ApiUrl;

const SubCatAddEdit = props => {
	const [form] = Form.useForm();
	const { dispatch } = props;
	let catlist = []
	// const [catlist, setCatlist] = useState([])
	const [count, setCount] = useState(0)
	const [dcount, setDCount] = useState(0)
	const [btnDis, setBtnDis] = useState(false)

	const [attribute, setAttribute] = useState([]);  
	const [dataAttribute, setDataAttribute] = useState([]);

	let { categoryData } = props;
		if(categoryData.data !== undefined && categoryData.data.result !== undefined){
			catlist = categoryData.data.result
		console.log(categoryData.data.result)

		}



	useEffect(() => {


	
		let unmounted = false;
	
		// setCatlist(categoryData.data.result);
		
		// if (category.list) {
		// 	setCatlist(category.list ? category.list.data : []);
		// }
		// else dispatch({ type: 'category/categoryList' });

		return () => { unmounted = true; }
	}, [dispatch])




	useEffect(() => {
		let unmounted = false;
		let data = props.detail;
		if (props.detail) {
			form.setFieldsValue({
				['description']: data.description, ['parent_category']: data.parent_category._id, ['subcat']: data.subcategory, ['name']: data.name,
			});
		



		}
		else {
			 form.resetFields();
			 setDataAttribute([])
			}
		
		return () => { unmounted = true; }
	}, [props.visible])

	const onFinish = val => {


		setBtnDis(true);
		if (props.detail) {
			val._id = props.detail._id
			dispatch({ type: 'subcategory/subCategoryEdit', payload: val, });
		}
		else {
			console.log('add')
			dispatch({ type: 'subcategory/subCategoryAdd', payload: val, });
		}

		setDataAttribute([]);
		
	}

	useEffect(() => {
		let unmounted = false;
		let add = props.subcategory.add
		if (!unmounted && add.count > count && add.status) {
			setBtnDis(false);
			setCount(add.count);
			props.returnData('success');
		} else if (!unmounted && add.count > count && !add.status) {
			setBtnDis(false);
			setCount(add.count);
		}

		// Edit
		let edit = props.subcategory.edit
		if (!unmounted && edit.count > dcount && edit.status) {
			setBtnDis(false);
			setDCount(edit.count);
			console.log('edit', edit)
			props.returnData('success');
		} else if (!unmounted && edit.count > dcount && !edit.status) {
			setBtnDis(false);
			setDCount(edit.count);
		}
		return () => {
			unmounted = true;
		}
	}, [props.subcategory])

	const cancelFun = () => {
		if (!props.detail)
			form.resetFields();
		props.closeModel()
	}


	const onSelect = (selectedList, selectedItem) => {
		console.log(selectedList);
		setDataAttribute(selectedList);
	}

	const onRemove = (selectedList, removedItem) => {
		setDataAttribute(selectedList);
	}
	//onOk={()=>form.submit()} onCancel={()=>setPicModel(false)}
	return (
		<Modal visible={props.visible} title={props.detail ? 'Edit Sub-Category' : 'Add Sub-Category'} onCancel={cancelFun} footer={<Fragment>
			<Button onClick={cancelFun}>Cancel</Button>
			<Button type="primary" disabled={btnDis} className="btn-w25 btn-primary-light" onClick={() => form.submit()}>{props.detail ? 'Edit Sub-Category' : 'Add Sub-Category'}</Button>
		</Fragment>} >
			<Form {...formItemLayout} form={form} name="loc_info" layout="vertical" onFinish={onFinish} className="innerFields">
	
				<Form.Item name="name" label="Name" rules={[{ required: true, message: 'This field is required!',  },
						{ min: 3, message: 'Name must be minimum 3 characters.' },
						{ max: 25, message: 'Name must be less than 25 characters.' },
			]} >
					<Input placeholder="Name" type="text" />
				</Form.Item>
				<Form.Item name="parent_category"  label="Parent Category" rules={[{ required: true, message: 'This field is required!' }]}>
					<Select placeholder="Parent Category">
						{catlist.map((item, index) => <Select.Option value={item._id} key={index}>{item.category_name}</Select.Option>)}
					</Select>
				</Form.Item>
		
				<Form.Item name="description" label="Description" rules={[{ required: false, message: 'This field is required!' },{ max: 100, message: 'Description must not be greater than 100 characters.' }]} className="mb-0">
					<TextArea placeholder="Description" type="text" />
				</Form.Item>


			
			</Form>

		</Modal>
	)
};

export default connect(({ category, subcategory, global, loading }) => ({
	category: category,
	subcategory: subcategory,
	global: global
}))(SubCatAddEdit);