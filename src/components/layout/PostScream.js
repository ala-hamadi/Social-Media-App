import React, { Component } from 'react'
import styles from './PostScream.module.css'

//MUI imports
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip  from '@material-ui/core/Tooltip';
import IconButton  from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

//redux imports
import {connect} from 'react-redux'
import {postScream,clearError} from '../../redux/actions/dataActions'

class PostScream extends Component {
    state={
        open:false,
        body:'',
        errors:{}
    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
    }
    handleClose=()=>{
        this.props.clearError();
        this.setState({
            open:false,
            errors:{}
        })
    }
    handleChange=e=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handleSubmit=e=>{
        e.preventDefault();
        this.props.postScream({body:this.state.body})
    }
    
    componentWillReceiveProps=(nextProps)=>{
        if(nextProps.UI.errors){
            this.setState({
                errors:nextProps.UI.errors
            })
        }
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body:'',
                open:false,
                errors:{}
            })
            
        }
    }
    
    render() {
        const {UI:{loading}}=this.props;
        return (
            <React.Fragment>
                <Tooltip title="Post a Scream" placement="bottom">
                    <IconButton onClick={this.handleOpen}> 
                        <AddIcon />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close" placement="bottom">
                        <IconButton onClick={this.handleClose} className={styles.closeButton}> 
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <DialogTitle>Post a scream</DialogTitle>
                    <DialogContent>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                                name="body" 
                                type="text" 
                                label="Scream" 
                                multiline 
                                row="3" 
                                placeholder="Scream at your whozzy" 
                                error={this.state.errors ? true:false} 
                                helperText={this.state.errors.body}
                                className={styles.textField}
                                onChange={this.handleChange}
                                fullWidth
                            />
                           <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                className={styles.submitButton}
                                disabled={loading}>
                                    Submit
                                    {loading && <CircularProgress size={30} className={styles.progressSpinner} />}
                            </Button>       
                            
                        </form>
                    </DialogContent>
                </Dialog>
                
            </React.Fragment>
        )
    }
}

const mapStateToProps=state=>({
    UI:state.UI
})
const mapActionsToProps={
    postScream,
    clearError
}

export default connect(mapStateToProps,mapActionsToProps)(PostScream)
