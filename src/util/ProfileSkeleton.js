import React, { Component } from 'react'
import noImg from '../assets/images/noImg.png'
import styles from './ProfileSkeleton.module.css'
//MUI imports
import LocationIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Paper from '@material-ui/core/Paper'

class ProfileSkeleton extends Component {
    render() {
        return (
            <Paper className={styles.paper}>
                <div className={styles.profile}>
                    <div className={styles.imageWrapper}>
                        <img src={noImg} alt="Profile" className={styles.profileImage}/>
                    </div>
                    <hr />
                    <div className={styles.profileDetails}>
                        <div className={styles.handle} />
                        <hr />
                        <div className={styles.fullLine} />
                        <div className={styles.halfLine} />
                        <hr />
                        <LocationIcon color="primary" /> <span>Location</span>
                        <hr />
                        <LinkIcon color="primary" /> <span>https://websit.com</span>
                        <hr />
                        <CalendarTodayIcon color="primary"/> <span>Joined date</span>
                    </div>
                </div>
            </Paper>
        )
    }
}

export default ProfileSkeleton
