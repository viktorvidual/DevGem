import { useContext, useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid, Typography, Card, Container } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { AuthContext } from "../../context/AuthContext";



export default function GitHubUpdates({gitRepo}){

    const [lastCommit, setLastCommit] = useState({})
    const [tags, setTags] = useState([])
    const [issues, setIssues] = useState([])
    const [pullRequest, setPullRequests] = useState([])


    gitRepo = gitRepo.split('/');
    gitRepo.reverse();

    const userName = gitRepo[1];
    const repoName = gitRepo[0];

    const fetchSource = `https://api.github.com/repos/${userName}/${repoName}/`

    useEffect(()=>{
        try{

            const fetching = async () =>{

                const commitResponse = await fetch(`${fetchSource}commits`);
                const commitsSource = await commitResponse.json()
                setLastCommit(commitsSource[0])

                const tagsReponse = await fetch(`${fetchSource}tags`);
                const tagsSource = await tagsReponse.json();
                setTags(tagsSource);

                const issuesResponse = await(fetch(`${fetchSource}issues`))
                const issuesSource = await issuesResponse.json();
                setIssues (issuesSource)

                const pullResponse = await(fetch(`${fetchSource}pulls`))
                const pullSource = await pullResponse.json();
                setPullRequests(pullSource)
            }

            fetching()

        }catch(error){
            console.log(error);
        }
    },[])

    return(

        
    <>
            { Object.keys(lastCommit).length > 0 && 

            <Grid container>
                <Grid item sm={12}>
                    <Card sx={{mt:2, p:5, border: "1px solid #DFDFE0"}}>
                        <Grid>
                        <Typography variant="h5">Latest Commit</Typography>
                        <br/>
                        <Typography>{`${lastCommit.commit.author.date} | ${lastCommit.commit.author.name} | ${lastCommit.commit.message}`} </Typography>
                        <br/>
                        </Grid>
                        <Grid item sm={12}>
                        <Button
                        variant='text'
                        href={lastCommit.html_url}
                        target="_blank" // Open link in a new tab
                        rel="noopener noreferrer" // Security best practice
                        >
                            Click here for more info at the GitHub repository
                        </Button>
                    </Grid>
                    </Card>

                    
                </Grid>
            </Grid>
            }

            <Grid container sx={{mt:3}}>

            <Grid item md={6}>
                <Typography variant='h5'>Tags</Typography>
            <TableContainer component={Paper} sx={{mt:2}}>
                <Table  aria-label="simple table" style={{boxShadow: "none", border: "1px solid #DFDFE0"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tags</TableCell>
                            <TableCell>Version Source</TableCell>
                            <TableCell>CommitInfo</TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                    {tags.length > 0 ? tags.map((tag) => (
                        <TableRow 
                        key={tag.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {tag.name}
                            </TableCell>
                            <TableCell align="left">
                                <Button
                                    href={tag.zipball_url}
                                    variant='text'
                                    target="_blank" // Open link in a new tab
                                    rel="noopener noreferrer" // Security best practice
                                >
                                    Download
                                </Button>
                            </TableCell>

                            <TableCell align="left">
                                <Button
                                    href={tag.commit.url}
                                    variant='text'
                                    target="_blank" // Open link in a new tab
                                    rel="noopener noreferrer" // Security best practice
                                >
                                    Link
                                </Button>
                            </TableCell>

                        </TableRow>
                    )): 
                    <TableRow><TableCell><Typography>No tags</Typography></TableCell></TableRow>
                   }
                </TableBody>
            </Table>
        </TableContainer>
            </Grid>
            <Grid item md={6}>
                    <Container>
                        <Card style={{boxShadow: "none", border: "1px solid #DFDFE0"}}>
                            <CardHeader title='Open Pull Requests'></CardHeader>
                            <CardContent>
                                <Typography variant="h4">{issues.length}</Typography>
                            </CardContent>
                        </Card>
                        <br/>
                        <Card style={{boxShadow: "none", border: "1px solid #DFDFE0"}}>
                            <CardHeader title='Open Issues'></CardHeader>
                            <CardContent>
                                <Typography variant="h4">{pullRequest.length}</Typography>
                            </CardContent>
                        </Card>
                    </Container>
            </Grid>
        </Grid>
        </>
    )
}