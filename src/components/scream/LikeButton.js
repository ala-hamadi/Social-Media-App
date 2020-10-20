import React, { Component } from 'react'
import {Link} from 'react-router-dom'
//MUI imports
import LikedIcon from '@material-ui/icons/Favorite'
import UnLikedIcon from '@material-ui/icons/FavoriteBorder'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

//redux imports
import {connect} from 'react-redux';
import {likeScream,unLikeScream} from '../../redux/actions/dataActions'

class LikeButton extends Component {
    likedScream=()=>{
        if(this.props.user.likes &&
            this.props.user.likes.find(like=>like.screamId===this.props.screamId))
            return true;
        else 
            return false;
    }

    likeScream=()=>{
        this.props.likeScream(this.props.screamId)
    }

    unLikeScream=()=>{
        this.props.unLikeScream(this.props.screamId)
    }
    render() {
        const {authenticated}=this.props.user;
        const likeButton=!authenticated ?
            (<Tooltip title="Like" placement="top">
                <Link to='/login'>
                    <IconButton  className="button">
                        <UnLikedIcon color="primary" />
                    </IconButton>
                </Link>
            </Tooltip>)
            :(
                this.likedScream() ? (
                    <Tooltip title="Unlike" placement="top">
                        <IconButton className="button" onClick={this.unLikeScream}>
                                <LikedIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                ):(
                    <Tooltip title="Like" placement="top">
                        <IconButton className="button" onClick={this.likeScream}>
                                <UnLikedIcon color="primary" />
                        </IconButton>
                    </Tooltip>
                )
            )
        return likeButton;
    }
}
const mapStateToProps=state=>({
    user:state.user
})

const mapActionsToProps={
    likeScream,
    unLikeScream
}

export default connect(mapStateToProps,mapActionsToProps)(LikeButton)
