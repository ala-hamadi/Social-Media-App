import React, { Component } from 'react'
import {Link } from 'react-router-dom'
import styles from './ScreamDialog.module.css'
import dayjs from 'dayjs'
import CommentForm from './CommentForm'
import LikeButton from './LikeButton'
import Comments from './Comments'


//MUI imports
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip  from '@material-ui/core/Tooltip';
import IconButton  from '@material-ui/core/IconButton';
import UnfoldMoreIcon  from '@material-ui/icons/UnfoldMore';
import CloseIcon  from '@material-ui/icons/Close';
import ChatIcon  from '@material-ui/icons/Chat';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

//redux imports
import {connect} from 'react-redux'
import {getScream,clearError} from '../../redux/actions/dataActions'

class ScreamDialog extends Component {
    state={
        open:false,
        oldPath:'',
        newPath:''
    }
    componentDidMount(){
        if(this.props.openDialog)
            this.handleOpen()
    }
    handleOpen=()=>{
        //ki nenzelo aal dialog ibadlna el lien men fou9
        let oldPath=window.location.pathname;
        const newPath=`/users/${this.props.userHandler}/scream/${this.props.screamId}`
        if(newPath===oldPath) // ki nenzlo ala dialog iwal lien /users/username/scream/gkfdgjdlfgkdfj ki naawdo nenzelo yemchi l nafs l blasa donc iwali fard lien
            oldPath=`/users/${this.props.userHandler}`
        window.history.pushState(null,null,newPath)
        this.setState({
            open:true,
            oldPath:oldPath,
            newPath:newPath
        })
        this.props.getScream(this.props.screamId)
    }
    handleClose=()=>{
        window.history.pushState(null,null,this.state.oldPath)
        this.setState({
            open:false,
        })
        this.props.clearError();
    }
    render() {
        const {scream:{screamId,body,createdAt,likeCount,commentCount,userImage,userHandler,comments},UI:{loading}}=this.props
        const dialogMarkup = loading ? (
            <div className={styles.spinnerDiv}>
                <CircularProgress size={200} thickness={2}/>
            </div>
            
        ):(
            <Grid container spaceing={16}>
                <Grid item sm={5}>
                    <img src={userImage} alt="Profile" className={styles.profileImage} />
                </Grid>
                <Grid item sm={7}>
                    <Typography component={Link} color="primary" variant="h5" to={`/users/${userHandler}`} className={styles.userHandler}>
                        @{userHandler}
                    </Typography>
                    <hr className={styles.invisibleHr} />
                    <Typography  color="textSecondary" variant="body2">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={styles.invisibleHr}/>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId}/>
                    <span>{likeCount} Likes</span>
                    <Tooltip title="Comments" placement="top">
                        <IconButton  className="button">
                            <ChatIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <span>{commentCount} Comments</span>
                </Grid>
                <hr className={styles.visibleHr} />
                <CommentForm screamId={screamId} />
                <Comments comments={comments} />
            </Grid>
        )
        return (
            <React.Fragment>
                <Tooltip title="Expend Scream" placement="top">
                    <IconButton  className={styles.expandButton} onClick={this.handleOpen}>
                        <UnfoldMoreIcon color="primary" />
                    </IconButton>
                </Tooltip>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <Tooltip title="Close" placement="bottom">
                        <IconButton onClick={this.handleClose} className={styles.closeButton}> 
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                    <DialogContent className={styles.dialogContent}>
                        {dialogMarkup}
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}
const mapStateToProps=state=>({
    scream:state.data.scream,
    UI:state.UI
})
const mapActionsToProps={
    getScream,
    clearError
}

export default connect(mapStateToProps,mapActionsToProps)(ScreamDialog)
