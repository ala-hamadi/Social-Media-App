import React, { Component } from 'react'
import styles from './StaticProfile.module.css'
import dayjs from 'dayjs'
import {Link} from 'react-router-dom'

//MUI imports
import MuiLink from '@material-ui/core/Link'
import LocationIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'


class StaticProfile extends Component {
    render() {
        const{profile:{handle,createdAt,imageUrl,bio,website,location}}=this.props
        return (
            <Paper className={styles.paper}>
            <div className={styles.profile}>
                <div className={styles.imageWrapper}>
                    <img src={imageUrl} alt="Profile" className={styles.profileImage} />
                </div>
                <hr />
                <div className={styles.profileDetails}>
                    <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5" className={styles.userHandler}>
                        @{handle}
                    </MuiLink>
                    <hr />
                    {bio && <Typography variant="body2">{bio}</Typography>}
                    <hr />
                    {location && (
                        <React.Fragment>
                            <LocationIcon color="primary"/> 
                            <span>{location}</span>
                            <hr />
                        </React.Fragment>
                    )}
                    {website && (
                        <React.Fragment>
                            <LinkIcon color="primary"/> 
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {" "}{website}
                            </a>
                            <hr />
                        </React.Fragment>
                    )}
                    <CalendarTodayIcon color="primary" />
                    {" "}<span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
            </div>
        </Paper>
        )
    }
}

export default StaticProfile
