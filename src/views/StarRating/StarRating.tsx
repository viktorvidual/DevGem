import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarIcon key={i} style={{ color: 'gold', fontSize: '1rem' }} />);
    } else {
      stars.push(<StarBorderIcon key={i} style={{ color: 'gray', fontSize: '1rem' }} />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
