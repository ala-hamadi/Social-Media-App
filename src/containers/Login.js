import React, { Component } from 'react'
import './LoginSignup.css'
import WheezyImage from '../assets/images/Wheezy.png'
import {Link} from 'react-router-dom'

//MUI imports
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux imports
import {connect} from 'react-redux';
import {loginUser} from '../redux/actions/userActions'

class Login extends Component {

    state={
        email:'',
        password:'',
        errors:{}
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors)
            this.setState({errors:nextProps.UI.errors});
    }

    handleSubmuit=e=>{
        e.preventDefault();
        const userData={
            email:this.state.email,
            password:this.state.password
        }
        this.props.loginUser(userData,this.props.history)
    }

    handleChange=e=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    render() {
        const {errors}=this.state;
        const {UI:{loading}}=this.props;
        return (
            <Grid container className="form">
                <Grid item sm></Grid>
                <Grid item sm>
                    <img src={WheezyImage} alt="WheezyImage" className="image"/>
                    <Typography variant="h3" className="pageTitle">
                        Login
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmuit}>
                        <TextField 
                            id="email" 
                            name="email" 
                            type="email" 
                            label="Email" 
                            className="textField" 
                            helperText={errors.email}
                            error={errors.email ? true : false}
                            value={this.state.email}
                            onChange={this.handleChange} 
                            fullWidth />
                        <TextField 
                            id="password" 
                            name="password" 
                            type="password" 
                            label="Password" 
                            className="textField" 
                            helperText={errors.password}
                            error={errors.password ? true : false}
                            value={this.state.password} 
                            onChange={this.handleChange} 
                            fullWidth />
                        {errors.general &&
                        (<Typography variant="body2" className="customError">
                            {errors.general}
                        </Typography>)
                        }
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color={Object.keys(errors).length === 0 ? "primary" : "secondary"}  
                            className="button"
                            disabled={loading}
                        >
                            Login
                            {loading && 
                            (<CircularProgress  size={30} className="progress" />)}
                        </Button>
                        <br />
                        <small>Don't have an account ? Signup <Link to="/signup">here</Link> </small>
                    </form>
                </Grid>
                <Grid item sm></Grid>
            </Grid>
        )
    }
}
const mapStateToProps=state=>({
    UI:state.UI
})
const mapDispatchToProps ={
    loginUser
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)
