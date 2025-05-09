import { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, CardActions, CardContent, CardHeader } from '@mui/material';
import ImageCarousel from '../Carousel/Carousel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { incrementDownloadCount } from '../../services/addon.services';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import CreateReview from '../CreateReview/CreateReview';
import Reviews from '../Reviews/Reviews';
import RatingWithValue from '../Reviews/RatingWithValue';
import Versions from '../Versions/Versions';
import GitHubUpdates from '../Versions/GitHubUpdates';
import { Addon, AddonsContext } from '../../context/AddonsContext.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@mui/joy';
import { CHECKOUT_PATH } from '../../common/common.ts';
import { checkIfAddonsIsFollowed, fireEvent, followAddon, unfollowAddon } from '../../services/analytics.services.ts';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { AuthContext } from '../../context/AuthContext.ts';
import { AuthContextType } from '../../context/AuthContext.ts';
import CustomSnackbarError from '../../views/CustomSnackbarError/CustomSnackbarError.tsx';

export default function DetailedAddonView() {

    const { allAddons } = useContext(AddonsContext);
    const { loggedInUser, user } = useContext<AuthContextType>(AuthContext);

    const params = useParams();
    const addonId = params.id;

    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState('1');
    const [addon, setAddon] = useState<Addon>(allAddons.find(el => el.addonId === addonId) || {} as Addon);
    const [newReview, setNewReview] = useState(false)
    const [downloadsChange, setDownloadsChange] = useState(true);
    const [following, setFollowing] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        setAddon(allAddons.find(el => el.addonId === addonId) || {} as Addon);
    }, [allAddons, addonId])

    useEffect(() => {

        try {
            (async () => {
                const addonIsFollowed = loggedInUser && await checkIfAddonsIsFollowed(loggedInUser.username, addon.addonId)

                if (addonIsFollowed) {
                    setFollowing(true);
                }

                await fireEvent('pageVisits', addon.addonId, addon.name)
            })()


        } catch (error) {
            setError(`${error.message}`);
        } finally {
            setLoading(false);
        }

    }, []);

    const handleBuyClick = () => {
        if (user?.emailVerified) {
            navigate(`${CHECKOUT_PATH + addon.addonId}`);
        } else {
            setError("You need to be a logged-in user with verified email to make purchases on DEV/GEM.")
        }
    }

    const handleDownload = async () => {

        await fireEvent('downloads', addon.addonId, addon.name)

        if (!addon.isFree) {
            setTabValue("5");
            return;
        }

        try {
            incrementDownloadCount(addon.addonId)
            setDownloadsChange(!downloadsChange)
        }
        catch (error) {
            setError(error as string)
        }

    }

    const handleFollow = async () => {

        try {
            loggedInUser && await followAddon(addon.addonId, loggedInUser.username)
            setFollowing(true);
        } catch (error) {
            setError(error as string)

        }

    }

    const handleUnfollow = async () => {

        try {
            loggedInUser && await unfollowAddon(addon.addonId, loggedInUser.username)
            setFollowing(false);
        } catch (error) {
            setError(error as string)
        }

    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        event.preventDefault;
        setTabValue(newValue);
    };

    return (
        <>
            {error && <CustomSnackbarError error={error} />}
            <Container sx={{ mt: 2, color: 'black', textAlign: "left" }}>

                <Grid container sx={{ marginLeft: "1em" }}>
                    <Box className="image-logo" display="flex" alignItems="center" marginRight="1.5em">
                        <Grid item md={1}>
                            <img src={addon.logo} style={{ maxHeight: '3em', minWidth: "3em" }} />
                        </Grid>
                    </Box>

                    <Grid item md={5}>
                        {
                            (Object.keys(addon.tags)).map((tag) => (
                                <Button key={tag} variant='text'>{tag}</Button>
                            ))
                        }
                        <Typography className='addonName' variant='h5' fontWeight="bold">
                            {addon.name}
                        </Typography>

                        <Grid>

                            <RatingWithValue addonId={addon.addonId} />

                        </Grid>

                        <Button> {addon.company} </Button>
                    </Grid>

                    <Grid item md={4.5}>
                        <Grid container sx={{ mt: 5 }}>
                            <Grid item md={12}>
                                <Box display="flex" justifyContent="flex-end" alignItems="center" height="100%" >

                                    {loggedInUser && !following &&

                                        <Button onClick={handleFollow} variant="outlined" size="large" sx={{ mr: 1 }}>
                                            <BookmarkIcon sx={{ mr: 1 }} /> Follow
                                        </Button>
                                     }

                                    {following && loggedInUser &&
                                        
                                        <Button onClick={handleUnfollow} variant="outlined" size="large" sx={{ mr: 1 }}>
                                            UnFollow
                                        </Button>

                                    }


                                    <Button onClick={handleDownload} href={addon.isFree ? addon.downloadLink : "#"} variant="contained" size="large">
                                        <DownloadForOfflineIcon sx={{ mr: 1 }} />Download
                                    </Button>

                                </Box>
                            </Grid>

                            <Grid item md={12} sx={{ mt: 2 }}>

                                <Box display="flex" justifyContent="flex-end" alignItems="left" height="100%">
                                    <div>
                                        <Typography variant='h5' style={{ fontWeight: "100", color: "#1b74e4" }}> {addon.downloads || 0} downloads </Typography>

                                    </div>
                                </Box>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

                <TabContext value={tabValue}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="tabs for content options">
                            <Tab label="Overview" value="1" />
                            <Tab label="Versions" value="2" />
                            <Tab label="Reviews" value="3" />
                            <Tab label="GitHub Source" value="4" />
                            {!addon.isFree && <Tab label="Pricing" value="5" />}
                        </TabList>
                    </Box>

                    <TabPanel value="1">

                        {allAddons && addon.images && <ImageCarousel images={addon.images}></ImageCarousel>}

                        <Box sx={{ mt: 4, color: '#333333' }}>
                            <hr />
                            <div dangerouslySetInnerHTML={{ __html: addon.description }} />
                        </Box>
                    </TabPanel>

                    <TabPanel value='2'>

                        <Versions addonId={addon.addonId}></Versions>

                    </TabPanel>

                    <TabPanel value='3'>
                        <Grid container>
                            <Grid item md={6}>

                                <Typography align='center' variant='h4'>
                                    Ratings & Reviews
                                </Typography>
                                
                            </Grid>
                            <Grid item md={6}>
                                <CreateReview addonId={addon.addonId} userId={addon.ownerUid} addonName={addon.name} setNewReview={setNewReview} newReview={newReview} />
                            </Grid>



                            <Grid container>
                                <Grid item sm={12}>
                                    <Reviews addonId={addon.addonId} currentReview={newReview}></Reviews>
                                </Grid>
                            </Grid>

                        </Grid>

                    </TabPanel>

                    <TabPanel value='4'>
                        <Grid container>
                            <Grid item md={12}>

                                <GitHubUpdates gitRepo={addon.originLink} />

                            </Grid>

                        </Grid>
                    </TabPanel>

                    {!addon.isFree &&
                        (<TabPanel value='5'>
                            <Grid container>
                                <Grid item md={12}>

                                    <Card sx={{ width: "50%", border: "1px solid #DFDFE0" }}>
                                        <CardHeader
                                            title="Yearly subscription"
                                            titleTypographyProps={{ align: 'center' }}
                                            subheaderTypographyProps={{
                                                align: 'center',
                                            }}
                                            sx={{
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode === 'light'
                                                        ? theme.palette.grey[200]
                                                        : theme.palette.grey[700],
                                            }}
                                        />
                                        <CardContent>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'baseline',
                                                    mb: 2,
                                                }}
                                            >
                                                <Typography component="h2" variant="h3" color="text.primary">
                                                    ${addon.price}
                                                </Typography>
                                                <Typography variant="h6" color="text.secondary">
                                                    /year
                                                </Typography>
                                            </Box>

                                            <Typography
                                                variant="subtitle1"
                                                align="center"
                                                color="#777"
                                                padding="1em"
                                            >
                                                Get access to {addon.name} and all its premium features. When you buy on DEV GEM you save 20% with yearly subscription.
                                            </Typography>

                                        </CardContent>
                                        <CardActions>

                                            <Button
                                                fullWidth
                                                variant='contained'
                                                onClick={handleBuyClick}
                                            >
                                                Buy
                                            </Button>

                                        </CardActions>
                                    </Card>

                                </Grid>

                            </Grid>
                        </TabPanel>)}

                </TabContext>
            </Container>
        </>
    )
}
