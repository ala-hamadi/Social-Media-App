import React, { Component } from 'react'
import './LoginSignup.css'
import {Link} from 'react-router-dom'
import WheezyImage from '../assets/images/Wheezy.png'

//MUI imports
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';

//Redux imports
import {connect} from 'react-redux';
import {signupUser} from '../redux/actions/userActions'

class Signup extends Component {

    state={
        email:'',
        password:'',
        confirmePassword:'',
        handle:'',
        errors:{}
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors)
            this.setState({errors:nextProps.UI.errors});
    }

    handleSubmuit=e=>{
        e.preventDefault();
        this.setState({
            loading:true
        });
        const newUserData={
            email:this.state.email,
            password:this.state.password,
            confirmePassword:this.state.confirmePassword,
            handle:this.state.handle
        }
        this.props.signupUser(newUserData,this.props.history)
    }

    handleChange=e=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    render() {
        const {UI:{loading}}=this.props
        const {errors}=this.state;
        return (
            <Grid container className="form">
                <Grid item sm></Grid>
                <Grid item sm>
                    <img src={WheezyImage} alt="WheezyImage" className="image"/>
                    <Typography variant="h3" className="pageTitle">
                        Signup
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
                        <TextField 
                            id="confirmePassword" 
                            name="confirmePassword" 
                            type="password" 
                            label="Confirm Password" 
                            className="textField" 
                            helperText={errors.confirmePassword}
                            error={errors.confirmePassword ? true : false}
                            value={this.state.confirmePassword} 
                            onChange={this.handleChange} 
                            fullWidth /> 
                        <TextField 
                            id="handle" 
                            name="handle" 
                            type="text" 
                            label="Handle" 
                            className="textField" 
                            helperText={errors.handle}
                            error={errors.handle ? true : false}
                            value={this.state.handle} 
                            onChange={this.handleChange} 
                            fullWidth />     
                        {errors.general &&
                        (<Typography variant="body2" className="customError">
                            {errors.general}
                            {console.log(errors.general)}
                        </Typography>)
                        }
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color={Object.keys(errors).length === 0 ? "primary" : "secondary"} 
                            className="button"
                            disabled={loading}>
                            Signup
                            {loading && 
                            (<CircularProgress  size={30} className="progress" />)}
                        </Button>
                        <br />
                        <small>Already have an account ? Login <Link to="/login">here</Link> </small>
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
    signupUser
}


export default connect(mapStateToProps,mapDispatchToProps)(Signup)
