import React, { Component } from 'react'
import axios from 'axios'
import Scream from '../components/scream/Scream'
import StaticProfile from '../components/profile/StaticProfile'
import ScreamSkeleton from '../util/ScreamSkeleton'
import ProfileSkeleton from '../util/ProfileSkeleton'

//MUI imports
import Grid from '@material-ui/core/Grid'
//redux imports
import {connect} from 'react-redux'
import {getUserData} from '../redux/actions/dataActions'

class user extends Component {
    state={
        profile:null,
        screamIdParam:null
    }

    componentDidMount(){
        const handle=this.props.match.params.handle;
        const screamId=this.props.match.params.screamId;
        if(screamId)
            this.setState({screamIdParam:screamId})
        
        this.props.getUserData(handle);
        axios.get(`/user/${handle}`)
            .then(res=>{
                this.setState({
                    profile:res.data.user
                })
            })
            .catch(err=>{console.log(err)})
    }
    render() {
        const {screams,loading}=this.props.data;
        const screamsMarkup=loading ?(
        <ScreamSkeleton />
        ):(
            screams===null ?(
                <p>no screams from this users</p>
            ):(
                !this.state.screamIdParam ?(
                    screams.map(scream=>{
                        return <Scream key={scream.screamId} scream={scream} />
                    })
                ):(
                    screams.map(scream=>{
                        if(scream.screamId !== this.state.screamIdParam)
                            return <Scream key={scream.screamId} scream={scream} />
                        else
                            return <Scream key={scream.screamId} scream={scream} openDialog={true} />
                    })
                )
            )
        )
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}  
                </Grid>
                <Grid item sm={4} xs={12}>
                    {this.state.profile===null ? (
                        <ProfileSkeleton />
                    ):
                    <StaticProfile profile={this.state.profile}/>
                    }
                </Grid>
            </Grid>
        )
    }
}
const mapStateToProps=state=>({
    data:state.data
})
const mapActionsToProps={
    getUserData
}
export default connect(mapStateToProps,mapActionsToProps)(user)
