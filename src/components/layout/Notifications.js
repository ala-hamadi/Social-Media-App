import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { withRouter } from "react-router";

//MUI imports
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import NotificationsIcon from '@material-ui/icons/Notifications'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ChatIcon from '@material-ui/icons/Chat'

//redux imports
import {connect} from 'react-redux'
import {markNotificationsRead} from '../../redux/actions/userActions'
class Notifications extends Component {
    state={
        anchorEl:null
    }
    b
    handleOpen=e=>{
        this.setState({anchorEl:e.target})
        
    }
    handleClose=()=>{
        this.setState({
            anchorEl:null
        })
    }
    onMenuOpen=()=>{
        let unreadNotificationsIds=this.props.notifications
            .filter(notification=>!notification.read)
            .map(notification=>notification.notificationId)
        this.props.markNotificationsRead(unreadNotificationsIds)
    }
    onClickNot=(x,y)=>{
        if(window.location.pathname.search('/users')>=0)
            window.location.pathname=`/users/${x}/scream/${y}`
    }
    render() {
        dayjs.extend(relativeTime);
        let notifications=this.props.notifications
        notifications.sort((a,b) => (a.createdAt < b.createdAt) ? 1 : ((b.createdAt < a.createdAt) ? -1 : 0)); //sort the notification orderby createdAt 'desc'
        notifications=notifications.slice(0,11) //limite the number of notifications
            let notificationIcon;
            if(notifications && notifications.length>0){
                notifications.filter(notification=>notification.read===false).length > 0
                ? (
                notificationIcon = (
                <Badge badgeContent={notifications.filter(notification=>notification.read===false).length} color="secondary">
                    <NotificationsIcon />
                </Badge>)
                ):(
                    notificationIcon=<NotificationsIcon />
                )
            }
            else{
                notificationIcon=<NotificationsIcon />
            }
        let notificationsMarkup= notifications && notifications.length >0 ? (
            notifications.map(notification=>{
                const verb=notification.type==='like' ? 'Liked' : 'Commented on'
                const time=dayjs(notification.createdAt).fromNow();
                const iconColor=notification.read ? 'primary' : 'secondary';
                const icon = notification.type === 'like' ? (
                    <FavoriteIcon color={iconColor} style={{marginRight:10}}/> 
                )
                :( 
                    <ChatIcon color={iconColor} style={{marginRight:10}} />
                )
                return (
                    <MenuItem key={notification.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography component={Link}
                            color={"textPrimary"}
                            variant="body1"
                            onClick={()=>this.onClickNot(notification.recipient,notification.screamId)}
                        >
                            {notification.sender} {verb} your scream {time}
                        </Typography>
                    </MenuItem>
                )
            })
        ):(
            <MenuItem onClick={this.handleClose}>
                You have no notifications yet
            </MenuItem>
        )
        
        return (
            <React.Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton aria-owns={this.state.anchorEl ? "simple-menu": undefined} aria-haspopup="true" onClick={this.handleOpen}>
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
                <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onClose={this.handleClose} onEntered={this.onMenuOpen}>
                    {notificationsMarkup}
                </Menu>
            </React.Fragment>
        )
    }
}
const mapStateToProps=state=>({
    notifications:state.user.notifications
})
const mapActionsToProps={
    markNotificationsRead
}
export default withRouter(connect(mapStateToProps,mapActionsToProps)(Notifications))
