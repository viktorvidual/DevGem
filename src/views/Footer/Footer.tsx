import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Copyright from '../../common/copyright';
import { Link } from '@mui/joy';

export default function StickyFooter() {
  return (

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: "absolute",
          width: "100%",
          left: 0, 
          right: 0, 
          margin: "4em 0 0 0",
        }}
      >
        <CssBaseline />
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            padding: "2em",
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="md">
            <Typography variant="body1">
            This application was made as an educational project. All content is not intended for real-world use and any transactions are in test mode. Please refrain from using the content in any other way.
            <br />
            <Link href="https://gitlab.com/f-ep-group/addonis">GitHub repo link</Link>
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>

  );
}