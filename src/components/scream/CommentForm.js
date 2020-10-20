import React, { Component } from 'react'
import styles from './CommentForm.module.css'

//MUI imports
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

//redux imports
import  {connect } from 'react-redux'
import {sendComment} from '../../redux/actions/dataActions'
class CommentForm extends Component {
    state={
        body:'',
        errors:{}
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors:nextProps.UI.errors
            })
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body:''
            })
        }
    }
    handleChange=e=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit=e=>{
        e.preventDefault();
        this.props.sendComment(this.props.screamId,{body:this.state.body});
    }

    render() {
        const {authenticated}=this.props;
        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} style={{textAlign:'center'}}>
                <form onSubmit={this.handleSubmit}>
                    <TextField 
                        name="body" 
                        type="text" 
                        label="Comment on scream" 
                        error={this.state.errors.comment ? true : false} 
                        helperText={this.state.errors.comment} 
                        value={this.state.body} 
                        onChange={this.handleChange} 
                        fullWidth 
                        className={styles.textField} />
                    <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            className="button"

                    >
                        Send
                    </Button>
                </form>
                <hr className={styles.visibleHr} />
            </Grid>
        ): null
        return commentFormMarkup
    }
}
const mapStateToProps=state=>({
    UI:state.UI,
    authenticated:state.user.authenticated
})
const mapActionsToProps={
    sendComment
}
export default connect(mapStateToProps,mapActionsToProps)(CommentForm)
