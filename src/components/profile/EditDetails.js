import React, { Component } from 'react'
import styles from './EditDetails.module.css'


//MUI imports
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

//redux imports
import {connect} from 'react-redux'
import {editUserDetails} from '../../redux/actions/userActions'
class EditDetails extends Component {
    
    state={
        bio:'',
        website:'',
        location:'',
        open:false
    };

    handleOpen=()=>{
        this.setState({
            bio:this.props.user.credentials.bio ? this.props.user.credentials.bio :'',
            website:this.props.user.credentials.website ? this.props.user.credentials.website :'',
            location:this.props.user.credentials.location ? this.props.user.credentials.location :'',
            open:true
        })
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
    }
    handleSubmit=()=>{
        const userDetails={
            bio:this.state.bio,
            website:this.state.website,
            location:this.state.location,
        }
        this.props.editUserDetails(userDetails);
        this.handleClose();
    }
    handleChange=e=>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    componentDidMount(){
        this.setState({
            bio:this.props.user.credentials.bio ? this.props.user.credentials.bio :'',
            website:this.props.user.credentials.website ? this.props.user.credentials.website :'',
            location:this.props.user.credentials.location ? this.props.user.credentials.location :''
        })
    }

    render() {

        return (
            <React.Fragment>
                <Tooltip title="Edit details" placement="top">
                    <IconButton onClick={this.handleOpen} className={styles.button}>
                        <EditIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField name="bio" type="text" label="Bio" multiline rows="3" placeholder="A short bio about yourself" className={styles.textField} value={this.state.bio} onChange={this.handleChange} fullWidth />
                            <TextField name="website" type="text" label="Website"  placeholder="Your personal/professional website" className={styles.textField} value={this.state.website} onChange={this.handleChange} fullWidth />
                            <TextField name="location" type="text" label="Location"  placeholder="Where you live" className={styles.textField} value={this.state.location} onChange={this.handleChange} fullWidth />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}


const mapStateToProps=(state)=>({
    user:state.user
})
const mapActionsToProps={
    editUserDetails
}

export default connect(mapStateToProps,mapActionsToProps)(EditDetails);
