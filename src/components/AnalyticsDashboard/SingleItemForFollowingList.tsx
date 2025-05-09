import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { followAddon, unfollowAddon } from '../../services/analytics.services';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from '../../context/AuthContext';

interface Props {
  addonId: string;
  addonName: string;
} 

export const SingleItemForFollowingList = ({addonId, addonName}: Props) => {
    const [following, setFollowing] = useState(true);
    const { loggedInUser } = useContext(AuthContext);

    const handleUnfollow = async() => {

        try{
          loggedInUser && await unfollowAddon(addonId, loggedInUser.username);
        }catch(error){
            console.log(error);
        }finally{
            setFollowing(false)
        }        

    }

    const handleFollow = async() => {

        try{
          loggedInUser && await followAddon(addonId, loggedInUser.username);
        }catch(error){
            console.log(error);
        }finally{
            setFollowing(true)
        }

    }


    return (
        <Card key={addonId} sx={{mb:1}}>
          <CardContent>
            <Grid container>
            <Grid item md={2}>
            <Typography variant="h6">{addonName}</Typography>
            </Grid>
            <Grid item>
            {following && <Button
              variant="contained"
              onClick={handleUnfollow}
            >
              Unfollow
            </Button>}

            {!following && <Button
              variant="outlined"
              onClick={handleFollow}
            >
              <BookmarkIcon sx={{ mr: 1 }} /> Follow
            </Button>}
            </Grid>
                
            </Grid>
          </CardContent>
        </Card>
    )


}