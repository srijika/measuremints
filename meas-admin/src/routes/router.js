
import React , { useEffect ,  useState} from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import BasicLayout from '../pages/auth/BasicLayout';
import AppLogin from '../pages/auth/login'; 
import AppRegister from '../pages/auth/register';
import AppVarify from '../pages/auth/varify';


function hasLogin(props){
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    const objUser = JSON.parse(user);

		if(token && objUser){
			return true;
		}
		else{ return false }
	}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasLogin() ? (<Component {...props} />) : (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
    }
  />
);


function RouterConfig({ history }) {
  return (
    <Router history={history} basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path='/login' component={AppLogin} />
        <Route exact path='/verify' component={AppVarify} />		
        <Route exact path='/register' component={AppRegister} />
        <PrivateRoute path='/' component={BasicLayout} />
      </Switch>
    </Router>
  );
}




export default RouterConfig;

 