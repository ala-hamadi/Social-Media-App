import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import styles from './Scream.module.css'
import DeleteScrem from './DeleteScream'
import ScreamDialog from './ScreamDialog'
import LikeButton from './LikeButton'

//MUI imports
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import ChatIcon from '@material-ui/icons/Chat'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

//redux imports
import {connect} from 'react-redux'

class Scream extends Component {

    render() {
        dayjs.extend(relativeTime)
        const {
            scream:{body,createdAt,userImage,userHandler,screamId,likeCount,commentCount}
        } = this.props

        
        
        const deleteButton= this.props.user.authenticated && this.props.user.credentials.handle===userHandler ? (
            <DeleteScrem screamId={screamId} />
        ) : null
            
        return (
            <Card className={styles.card}>
                <CardMedia image={userImage} title="Profile Image" className={styles.image}/>
                <CardContent className={styles.content}>
                    <Typography variant="h5" component={Link} to={`/users/${userHandler}`} color={"primary"} className={styles.userHandler}>
                        {userHandler}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton screamId={screamId} />
                    <span>{likeCount} Likes</span>
                    <Tooltip title="Comments" placement="top">
                        <IconButton  className="button">
                            <ChatIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                    <span>{commentCount} Comments</span>
                    <ScreamDialog screamId={screamId} userHandler={userHandler} openDialog={this.props.openDialog}/>
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps=state=>({
    user:state.user
})


export default connect(mapStateToProps)(Scream)
