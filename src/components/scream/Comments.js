import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import styles from './Comments.module.css'
import dayjs from 'dayjs'

//MUI imports
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

class comments extends Component {
    render() {
        const {comments}=this.props
        return (
            <Grid container>
                {comments.map((comment,index)=>{
                    const {body,createdAt,userImage,userHandler}=comment;
                    return(
                        <React.Fragment key={createdAt}>
                            <hr className={styles.visibleHr}/>
                            <Grid item sm={12}>
                                <Grid container>
                                    <Grid item  sm={2}>
                                        <img src={userImage} alt="comment" className={styles.commentImage} />
                                    </Grid>
                                    <Grid item sm={9}>
                                        <div className={styles.commentData}>
                                            <Typography variant="h5" component={Link} onClick={() =>{window.location.href=`/users/${userHandler}`}} color="primary" className={styles.userHander}>
                                                {userHandler}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={styles.invisibleHr} />
                                            <Typography variant="body2">{body}</Typography>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    )
                })}
            </Grid>
        )
    }
}

export default comments
