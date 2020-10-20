import React, { useState, useCallback } from 'react'
import styles from './Profile.module.css'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import EditDetails from './EditDetails'
import ProfileSkeleton from '../../util/ProfileSkeleton'
import getCroppedImg from './cropImage'

//MUI imports
import Button from '@material-ui/core/Button'
import MuiLink from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import LocationIcon from '@material-ui/icons/LocationOn'
import LinkIcon from '@material-ui/icons/Link'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardReturn from '@material-ui/icons/KeyboardReturn'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'

//redux imports
import {connect} from 'react-redux'
import {logoutUser,uploadImage} from '../../redux/actions/userActions'

const Profile =(props) => {
    const cropSize={width:200,height:200}
    const {user:{authenticated,credentials:{handle,createdAt,imageUrl,bio,website,location},loading}}=props
    const [img,setImg]=useState(null)
    const [open,setOpen]=useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    

    const handleEditPicutre=()=>{
        const fileInput=document.getElementById('imageInput');
        fileInput.click();
    }
    const handleLogout=()=>{
        props.logoutUser();
    }
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])

    const handleImageChange=(e)=>{
        setImg(URL.createObjectURL(e.target.files[0]))
        handleOpen()
    }
    const handleOpen = () => {
        setOpen(true)
    }
    
    const handleClose = () => {
        setOpen(false)  
    }

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(img, croppedAreaPixels)
            setCroppedImage(croppedImage)

                function b64toBlob(dataURI) {
                    var byteString = atob(dataURI.split(',')[1]);
                    var ab = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(ab);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ab], { type: 'image/jpeg' });
                }

            let blob = b64toBlob(croppedImage);
            const formData=new FormData();
            formData.append('image',blob,blob.name);
            props.uploadImage(formData)
            handleClose()
        } catch (err) {
          console.error(err)
        }
    },[croppedAreaPixels])

        
        let profileMarkup= ! loading ? (authenticated ? (
            <Paper className={styles.paper}>
                <div className={styles.profile}>
                    <div className={styles.imageWrapper}>
                        <img src={imageUrl} alt="Profile" className={styles.profileImage} />
                        <input type="file" id="imageInput" onChange={handleImageChange} hidden />
                        {/* using react-east-crop */}
                        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                            <DialogContent >
                                <div className={styles.cropContainer}>
                                    <Cropper
                                    image={img}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={5 / 5}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape='round'
                                    cropSize={cropSize}
                                    />
                                </div>
                            </DialogContent> 
                            <DialogActions>
                                <div className={styles.controls} >
                                    <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    className={styles.slider}
                                    onChange={(e, zoom) => setZoom(zoom)}
                                    />
                                </div>
                                <Button
                                    style={{marginRight:'8px'}}
                                    onClick={showCroppedImage}
                                    variant="contained"
                                    color="primary"
                                >
                                    Set new image
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {/* end react-east-crop */}

                        <Tooltip title="Edit profile picutre" placement="top">
                            <IconButton onClick={handleEditPicutre} className="button">
                                <EditIcon color="primary" />
                            </IconButton>
                        </Tooltip>
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
                    <Tooltip title="Logout" placement="top">
                        <IconButton onClick={handleLogout}> 
                            <KeyboardReturn color="primary" />
                        </IconButton>
                    </Tooltip>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={styles.paper}>
                <Typography variant="body2" align="center">
                    No profile found, please login 
                </Typography>
                <div className={styles.buttons}>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                        Login
                    </Button>
                    <Button variant="contained" color="secondary" component={Link} to="/signup">
                        Signup
                    </Button>
                </div>
            </Paper>
        ) ) :(<ProfileSkeleton />)
        
        return profileMarkup

    
}

const mapStateToProps=(state)=>({
    user:state.user
})
const mapActionsToProps={
    logoutUser,
    uploadImage
}
export default connect(mapStateToProps,mapActionsToProps)(Profile)
