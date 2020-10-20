import React, { Component } from 'react'
import NoImg from '../assets/images/noImg.png'
import styles from './ScreamSkeleton.module.css'

//MUI imports
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'

class ScreamSkeleton extends Component {
    render() {
        const content=Array.from({length: 5}).map((item,index)=>{
            return (
                <Card className={styles.card} key={index}>
                    <CardMedia className={styles.cover} image={NoImg}/>
                    <CardContent className={styles.cardContent}>
                        <div className={styles.handle} />
                        <div className={styles.date} />
                        <div className={styles.fullLine} />
                        <div className={styles.fullLine} />
                        <div className={styles.halfLine} />
                    </CardContent>
                </Card>
            )
        })
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        )
    }
}

export default ScreamSkeleton
