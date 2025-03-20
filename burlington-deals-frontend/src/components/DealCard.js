import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function DealCard({ deal }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div">
          {deal.title}
        </Typography>
        <Typography color="text.secondary">
          {deal.restaurant_id} - {deal.day_of_week}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {deal.description}
        </Typography>
        <Typography variant="subtitle1">Price: {deal.price}</Typography>
        {deal.start_time && deal.end_time && (
          <Typography variant="caption">
            Time: {deal.start_time} - {deal.end_time}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

export default DealCard;