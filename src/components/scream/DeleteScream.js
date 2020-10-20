import React, { Component } from 'react'
import styles from './DeleteScream.module.css'

//MUI imports
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

//redux imports
import {connect} from 'react-redux'
import {deleteScream} from '../../redux/actions/dataActions'

class DeleteScream extends Component {

    state={
        open:false
    }
    handleOpen=()=>{
        this.setState({
            open:true
        })
    }
    handleClose=()=>{
        this.setState({
            open:false
        })
    }
    deleteScream=()=>{
        this.props.deleteScream(this.props.screamId)
        this.setState({
            open:false
        })
    }
    render() {
        return (
            <React.Fragment>
                <Tooltip title="Delete Scream" placement="top">
                    <IconButton className={styles.deleteButton} onClick={this.handleOpen}>
                            <DeleteOutlineIcon color="secondary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>
                        Are you sure you want to delete this scream?
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cacel
                        </Button>
                        <Button onClick={this.deleteScream} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        )
    }
}

const mapActionsToProps={
    deleteScream
}
export default connect(null,mapActionsToProps)(DeleteScream)
