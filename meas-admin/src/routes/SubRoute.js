import React, { Component, Suspense, lazy } from 'react';
import {Route } from 'react-router-dom';
import { Redirect } from 'dva/router';

//DASHBOARD
import Dashboard from '../pages/dashboard/dashboard';


//USER MANAGMENT
import UsersList from '../pages/users/list';
import AddEditUser from '../pages/users/action/addEdit';

//ACCOUNT
import Account from '../pages/account/index';

//SETTINGS
import SiteSetting from '../pages/site-setting/list';
import Setting from '../pages/setting/setting';

//CATEGORY 
import CategoryList from '../pages/category/list';

//SUB CATEGORY 
import SubCategoryList from '../pages/subcategory/list';

//PAGES 
import PagesList from '../pages/pages/list';
import AddEditPages from '../pages/pages/action/addEdit';






function hasAdmin(){
		let role = localStorage.getItem('role');
		if(role === "ADMIN"){
			return true;
		}
		else{ return false }
	}
	
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasAdmin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)
    }
  />
);

class SubRoute extends Component {	




	render() {
		return (
			<div> 
				{/* Dashboard */}
			  <Route exact name="Dashboad" breadcrumbName="Dashboad" path={'/'} component = {Dashboard}/>  

			  {/*START User List */}
              <PrivateRoute exact path='/user-regular' component={UsersList} />
			  <PrivateRoute exact path='/users/edit/:id' component={AddEditUser} />
			  {/*START User List */}

			
              {/* ACCOUNT ROUTES */} 
			  <Route exact path={"/account"} component={Account}/>
              {/* END ROUTES */} 

			  {/*START CATEGORY ROUTES */} 
			  <PrivateRoute exact path={`/category`} component={CategoryList} />
              {/*END PAGE ROUTES */} 

			  {/*START SUB-CATEGORY ROUTES */} 
			  <PrivateRoute path='/subcategory' component={SubCategoryList} />
              {/*END PAGE ROUTES */} 


			
              {/*START PAGE ROUTES */} 
			  <Route exact path={"/pages"} component={PagesList}/>
			  <Route exact path={"/pages/add"} component={AddEditPages}/>
			  <PrivateRoute exact path='/pages/edit/:id' component={AddEditPages} />
              {/*END PAGE ROUTES */} 


              {/* SETTING ROUTES */}
			  <Route exact path={`/settings`} component={SiteSetting}/>
			  <Route exact path={`/setting`} component={Setting}/>
              {/* END SETTING ROUTES */}

			</div>



		);
   }
} 

export default SubRoute;