import { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import { addReview } from '../../services/review.services';
import { AuthContext } from '../../context/AuthContext';
import { fireEvent } from '../../services/analytics.services';
import ErrorHelper from '../../views/ErrorHelper/ErrorHelper';

export const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  interface CreateReviewProps {
    addonId: string;
    userId: string;
    addonName: string;
    setNewReview: (newReview: boolean) => void;
    newReview: boolean;
  }
  
export default function CreateReview ({addonId, userId, addonName, setNewReview, newReview}: CreateReviewProps){
  
  const { loggedInUser } = useContext(AuthContext);

  const [ open, setOpen ] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [error, setError] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleSubmit(){

    if(!ratingValue){
      setError('Please select rating to submit your review.')
      return
    }

    if(!reviewContent){
      setError('Please add text to your review')
      return
    }

    await fireEvent('rating', addonId, addonName, ratingValue);

    try {
        loggedInUser && await addReview(
          reviewContent,
          loggedInUser.username,
          addonId,
          userId,
          loggedInUser.email,
          ratingValue
        );

        alert("Thank you for submitting your review");
        setNewReview(!newReview)
        handleClose();
      } catch (error) {
        setError(error as string)
        
  }
}

    return(

        <Container>
          { loggedInUser ? 
            <Button onClick={handleOpen} size='large' variant='outlined' sx={{mr:2}}>
            < RateReviewIcon sx={{mr:1}}/> Write a Review
            </Button>
          :
          <Typography variant='h5'>Please log in to write a review</Typography>
          }
            

            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Write a review for {addonName}
                </Typography>
                <Rating
                value={ratingValue}
                onChange={(event, newValue: number) => {
                  event.preventDefault()
                  setRatingValue(newValue);
                }}>
                </Rating>

                < Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Grid item md={12}>
                            <TextField
                            required
                            fullWidth
                            id="review"
                            label="Write your review"
                            name="lastName"
                            autoComplete="review"
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

                        {error && 
                          <ErrorHelper error={error}/>
                        }
                    </Box>
                </Box>
            </Modal>
           
        </Container>
    )

}