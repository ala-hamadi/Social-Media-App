import React, { Component } from 'react'
import styles from './Navbar.module.css'
import {Link} from 'react-router-dom'
import Notifications from './Notifications'
import PostScream from './PostScream'

//MUI imports
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'

//redux imports
import {connect} from 'react-redux'



class Navbar extends Component {
    render() {
        const {autehnticated}=this.props
        return (
            <AppBar position="fixed" className={styles.appBar}>
                <Toolbar className={styles.navContainer}>
                   {autehnticated ?(
                       <React.Fragment>
                        <PostScream />
                        <Link to="/">
                            <Tooltip title="Home" placement="bottom">
                                <IconButton onClick={this.handleLogout}> 
                                    <HomeIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                        <Notifications />
                       </React.Fragment>
                   ):
                   (
                       <React.Fragment>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/">
                                HomePage
                            </Button>
                            <Button color="inherit" component={Link} to="/signup">
                                Signup
                            </Button>
                        </React.Fragment>
                   )
                   }
                </Toolbar>
            </AppBar>
        )
    }
}
const mapStateToProps=state=>({
    autehnticated:state.user.authenticated
})

export default connect(mapStateToProps)(Navbar)
