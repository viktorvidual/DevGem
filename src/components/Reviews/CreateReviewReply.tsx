import { useContext, useState } from 'react';
import { Modal, Button, Grid, TextField, Alert, Typography } from '@mui/material';
import { addReviewReply } from '../../services/review.services';
import { Box } from '@mui/system';
import { modalStyle } from '../CreateReview/CreateReview'; 
import { AuthContext } from '../../context/AuthContext';
import { sendEmail } from '../../services/email.services';

interface CreateReviewReplyProps {
  reviewId: string;
  authorEmail: string;
  addonId: string;
  setShowReplyModal: (showReplyModal: boolean) => void;
  showReplyModal: boolean;
  displayReplies: () => void;
}

export const CreateReviewReply = ({
  reviewId,
  authorEmail,
  addonId,
  setShowReplyModal,
  showReplyModal,
  displayReplies,
}: CreateReviewReplyProps) => {

  const { loggedInUser } = useContext(AuthContext);

  const [error, setError] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  const handleClose = () => {
    setShowReplyModal(!showReplyModal);
  };


  const handleSubmit = async () => {

    if(!reviewContent){
      alert('Please include text to your reply')
      return;
    }
    
    try {
      loggedInUser && await addReviewReply(reviewContent, loggedInUser.username, reviewId, addonId);
      handleClose();
      alert('Thank you for submitting your reply.')
      // loggedInUser && await sendEmail('You have received a reply to your review.', loggedInUser.email, loggedInUser.username);
    } catch (error) {
      setError(String(error))
    }finally{
      displayReplies()
    }
    
  };

  return (
   <Modal
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={showReplyModal}
            key={reviewId}
            >
                <Box sx={modalStyle}>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Reply to a review
                </Typography>

                < Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid item md={12}>
                            <TextField
                            required
                            fullWidth
                            id="reply"
                            label="Reply to a review"
                            name="reply"
                            autoComplete="reply"
                            value={reviewContent}
                            onChange={(e) => setReviewContent (e.target.value)}
                            multiline
                            rows={6}
                            />
                        </Grid>

                        <Grid container sx={{mt:3}}>
                        <Grid item md={2}>
                            <Button onClick={handleSubmit} variant='contained'> Submit </Button>
                        </Grid>
                        <Grid item md={2}>
                            <Button onClick={handleClose} variant='outlined'> Cancel </Button>
                        </Grid>
                        </Grid>
                        {error && (
                          <Box sx={{mt:1}}>
                             <Alert severity="error">
                            {error}
                          </Alert>
                          </Box>
                        )}
                    </Box>
                </Box>
            </Modal>
  );
};


