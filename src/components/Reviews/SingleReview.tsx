import { Card, Button, Typography, Grid, CardHeader, CardContent, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import Rating from '@mui/material/Rating';
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { EditReview } from "./EditReview";
import { deleteReview, getRepliesByReviewUidHandle } from "../../services/review.services";
import { CreateReviewReply } from "./CreateReviewReply";
import { deleteReviewReply } from "../../services/review.services";
import { ReviewReply } from "../../services/review.services";
import { AuthContext, AuthContextType } from "../../context/AuthContext";

interface SingleReviewProps {
  author: string;
  authorEmail: string;
  rating: number;
  content: string;
  date: Date | number;
  reviewId: string;
  addonId: string;
  hasReply: boolean;
}

export default function SingleReview({
    author,
    authorEmail,
    rating,
    content,
    date,
    reviewId,
    addonId,
    hasReply,

}: SingleReviewProps){

const { loggedInUser } = useContext<AuthContextType>(AuthContext);

const [showModal, setShowModal] = useState(false);
const [showReplyModal, setShowReplyModal] = useState(false);

const [replies, setReplies] = useState<ReviewReply[]>([]);
const [showReplies, setShowReplies] = useState(false)

const handleDisplayReplies = async () => {

    const response = await getRepliesByReviewUidHandle(reviewId);
    
    setReplies(response);
    
    if(response.length === 0){
      setShowReplies(false);
      return;
    }
    setShowReplies(true);
    
}

return(
    <>
    <Card key={reviewId} sx={{m:3, width:'100%', border: "1px solid #DFDFE0", '&:hover': {
      border: '1px solid #1977d2' }}}> 
                <CardHeader title={
                    <>
                    <Grid container>

                    <Grid item md={2} sx={{mr:1}} >

                        <Button size='medium'>
                            {author}
                        </Button>
                    </Grid>
                    
                    <Grid item sx={{mr:1}}> <Rating readOnly value={rating}/> </Grid>

                    <Grid item > 
                    <Typography>
                        {new Date(date).toLocaleDateString()}
                    </Typography>
                    </Grid>
                    
                    <Grid item md={7}>
                      { loggedInUser && loggedInUser.username === author &&

                            <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%" >
                          <Button 
                          variant='outlined'
                          sx={{mr:1}}
                          onClick={()=>{
                              deleteReview(reviewId, addonId);
                          }}
                          > Delete Review </Button>
                          <Button 
                          variant='contained'
                          onClick={()=>{
                              setShowModal(!showModal)
                          }}
                          > Edit Review </Button>
                          </Box>
                      }
                    
                    </Grid>
                    </Grid>

                    {showModal && (
                    <EditReview
                    reviewId={reviewId}
                    content={content}
                    ratingValue={rating}
                    // refreshComments={currentReview}
                    setShowEditModal={setShowModal}
                    showEditModal={showModal}
                    />
                     )}
                    <hr/>
                    </>
                }
                /> 
                
                <CardContent>
                    <Typography align='left' sx={{p:2}}>
                        {content}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">

                      {loggedInUser &&
                        <Button variant='text'
                        onClick={()=>setShowReplyModal(true)}>
                        REPLY
                        </Button>                               
                      }
                                              
                        {hasReply && showReplies ===false &&
                            <Button variant='text'
                            onClick={handleDisplayReplies}>
                            SHOW REPLIES
                            </Button>
                        }

                        {showReplies === true &&
                            <Button variant='text'
                            onClick={()=> setShowReplies(false)}>
                            HIDE REPLIES
                            </Button>
                        }
                        
                    </Box>
                </CardContent>
            </Card>
            
            {showReplies && 
            (
                <List>
      {replies.map((reply: ReviewReply) => (
        <Card sx={{mb:1}} key={reply.replyId}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar>{reply.author.charAt(0).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <div>
                <span style={{ fontWeight: 'bold' }}>{reply.author}</span>
              </div>
              <div>{reply.content}</div>
              <div style={{ fontSize: '0.8rem', color: 'textSecondary' }}>
                {new Date(reply.createdOn).toLocaleString()}
              </div>
            </div>
            {loggedInUser && loggedInUser.username === reply.author &&
            <div>
              <Button onClick={async () =>{ 
                await deleteReviewReply(reply.replyId, reply.reviewId)
                handleDisplayReplies()
                }}>
                Delete Reply
              </Button>
            </div>}
          </div>
        </ListItem>
        </Card>
      ))}
    </List>
            )}
            
                {
                ( showReplyModal &&
                    <>
                   <CreateReviewReply

                   authorEmail={authorEmail}
                   reviewId={reviewId}
                   setShowReplyModal={setShowReplyModal}
                   showReplyModal={showReplyModal}
                   addonId={addonId}
                   displayReplies={handleDisplayReplies}
                   />
                   </>
                )}
            </>
)

}