
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { AnalyticsData } from '../../services/analytics.services';

interface AddonListProps { 
  addons: AnalyticsData
}

const AddonList = ({ addons }: AddonListProps) => {
  return (
    <TableContainer component={Paper} sx={{mt:3}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Addon Name</TableCell>
            <TableCell>Download Rate</TableCell>
            <TableCell>Total Downloads</TableCell>
            <TableCell>Total Views</TableCell>
            <TableCell>Times Rated</TableCell>
            <TableCell>Average Daily Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addons.map((addon, index) => (
            <TableRow key={index}>
              <TableCell>{addon.addonName}</TableCell>
              <TableCell>{addon.downloadRate} %</TableCell>
              <TableCell>{addon.totalDownloads}</TableCell>
              <TableCell>{addon.totalViews}</TableCell>
              <TableCell>
                {addon.totalRatings}
              </TableCell>
              <TableCell>{addon.avgDailyRating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AddonList;
