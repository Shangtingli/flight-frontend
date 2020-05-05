import React from 'react';
import {Button, Card} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faStar as darkStar} from "@fortawesome/free-solid-svg-icons"
import {faStar as lightStar} from "@fortawesome/free-regular-svg-icons"
import '../../../../styles/styles.scss';
import Avatar from '../BasicInfo/Avatar';
import {API, graphqlOperation} from 'aws-amplify';
import {deleteComment} from "../../../../graphql/mutations"
import {getStoreComments} from "../../../../graphql/customQueries"

class Comment extends React.Component{

    handleRemove = (e) => {
        e.preventDefault();
        const commentid=e.target.getAttribute('related');
        const comment = {}
        comment['id'] = commentid;
        API.graphql(graphqlOperation(deleteComment,{input:comment})).then((response) => {
            API.graphql(graphqlOperation(getStoreComments,{id:this.props.store.id})).then((response) => {
                this.props.setData(response.data.getStore.comments.items);
            })
        })
    }
    createDarkStars = (rate) => {
        const arr = new Array(rate);
        for(let i=0; i < rate; ++i){
            arr[i] = i + 1;
        }
        return arr.map((i) => {
            return <FontAwesomeIcon icon={darkStar} className="rating-star" val={i} onClick={this.handleOnChange} key={i}/>
        })
    }

    createLightStars = (rate) => {
        const arr = new Array(5-rate);
        for(let i=rate; i < 5; ++i){
            arr[i] = i + 1;
        }
        return arr.map((i) => {
            return <FontAwesomeIcon icon={lightStar} className="rating-star" val={i} onClick={this.handleOnChange} key={i}/>
        })
    }



    getRemoveButton(userEmail,trallerEmail,commentId){
        if (userEmail === trallerEmail){
            return (
                <Button
                onClick={this.handleRemove}
                related={commentId}
                style={{float:'right'}}>
                    Remove
                </Button>
            )
        }
        else{
            return <br/>
        }
    }
    render(){
        const commentData = this.props.data;

        const travellerName = commentData.traveller.firstName + " " + commentData.traveller.lastName;
        const userEmail = this.props.traveller.email;
        const rate = commentData.rate;
        const content = commentData.content;
        const commentId = commentData.id;
        return(
            <div id={`comment-${commentId}`} >
                <Card title={travellerName} size="small" className="comment-card">
                    <div style={styles.commentContainer}>
                        <div style={{float:"right"}}>
                            {this.createDarkStars(rate)}
                            {this.createLightStars(rate)}
                        </div>
                        <br/>
                        <p> {content} </p>
                        {this.getRemoveButton(commentData.traveller.email,userEmail, commentId)}
                    </div>
                    <Avatar avatarKey={commentData.traveller.avatarKey} width={"100px"} height={"100px"}/>
                </Card>
            </div>
        )
    }

}

export default Comment


const styles = {
    commentContainer:{
        float:"right",
        boxShadow: "0 1px 15px 5px rgba(228,115,67,0.6)",
        width: "250px",
        height: "100px"
    }
}