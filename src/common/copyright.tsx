import { Typography } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
        DEV GEM &nbsp;
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default Copyright;
