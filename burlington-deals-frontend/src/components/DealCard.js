// src/components/DealCard.js
import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Avatar, 
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DealCard = ({ deal }) => {
  const theme = useTheme();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Dead deal');
  const [reportMessage, setReportMessage] = useState('');
  
  // Wing pricing toggle
  const [showPerPound, setShowPerPound] = useState(false);
  const WINGS_PER_POUND = 10;
  
  // Helper function to format deal types with appropriate styling
  const renderDealPrice = () => {
    if (deal.percentage_discount) {
      return (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            backgroundColor: '#FF5533',
            color: '#FFF',
            fontWeight: 'bold',
            px: 2,
            py: 1,
            borderRadius: '4px'
          }}
        >
          {`${deal.percentage_discount}% Off`}
        </Box>
      );
    } else if (deal.flat_price) {
      return (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            backgroundColor: '#FF5533',
            color: '#FFF',
            fontWeight: 'bold',
            px: 2,
            py: 1,
            borderRadius: '4px'
          }}
        >
          {`$${deal.flat_price}`}
        </Box>
      );
    } else if (deal.deal_type === 'event') {
      return (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            backgroundColor: '#FF5533',
            color: '#FFF',
            fontWeight: 'bold',
            px: 2,
            py: 1,
            borderRadius: '4px'
          }}
        >
          Special Event
        </Box>
      );
    }
    return null;
  };

  // Get appropriate image based on category
  const getCategoryImage = (category) => {
    const categoryImages = {
      'Wings': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f',
      'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      'Breakfast': 'https://images.unsplash.com/photo-1533089860892-a9b9ac6cd1b3',
      'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
      'Mexican': 'https://images.unsplash.com/photo-1564767655658-4e6b365884e5',
      'Beer': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13',
      'Wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
      'Cocktails': 'https://images.unsplash.com/photo-1536935338788-846bb9981813',
    };
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836';
  };

  // Create initials for restaurant avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'R';
  };

  // Time formatting helper
  const formatTime = (timeString) => {
    if (!timeString) return null;
    try {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString; // Fallback to original string if parsing fails
    }
  };

  // Handle report submission
  const handleSubmitReport = async () => {
    try {
      await fetch('https://burlington-deals-api.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Deal Reporter',
          email: 'guest@burlingtondeals.ca',
          message: reportMessage,
          reason: reportReason,
          businessName: deal.restaurant_name || 'N/A',
          phone: 'N/A'
        }),
      });
      alert('Report submitted successfully.');
    } catch (err) {
      alert('Failed to submit report. Please try again later.');
    }
    setReportModalOpen(false);
  };

  return (
    <Card 
      sx={{ 
        position: 'relative', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        // Slightly more visible but still subtle border
        outline: '1px solid rgba(255, 85, 51, 0.45)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
          outline: '1px solid rgba(255, 85, 51, 0.55)',
        }
      }}
    >
      {/* Deal price tag */}
      {renderDealPrice()}
      
      {/* Deal image */}
      <CardMedia
        component="img"
        height="180"
        image={getCategoryImage(deal.category)}
        alt={deal.title || deal.category}
        sx={{ objectFit: 'cover' }}
      />

      {/* Restaurant info with avatar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        borderBottom: '1px solid rgba(0,0,0,0.08)' 
      }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40, 
            mr: 1.5, 
            bgcolor: theme.palette.primary.main,
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          {getInitials(deal.restaurant_name)}
        </Avatar>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" component="div">
            {deal.restaurant_name}
          </Typography>
          
          {deal.address && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOnIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {deal.address?.split(',')[0] || 'Burlington'}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Report text now moved to top right of restaurant section */}
        <Typography
          variant="caption"
          onClick={() => setReportModalOpen(true)}
          sx={{
            color: 'text.disabled',
            cursor: 'pointer',
            fontSize: '0.65rem',
            opacity: 0.6,
            '&:hover': {
              color: 'error.light',
              opacity: 1,
            }
          }}
        >
          report
        </Typography>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        {/* Deal title */}
        <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
          {deal.title || `${deal.category} Deal`}
        </Typography>
        
        {/* Deal description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {deal.description || 'Enjoy this special deal!'}
        </Typography>
        
        {/* Wing price toggle */}
        {deal.category === 'Wings' && deal.price_per_wing != null && (
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
            <Typography variant="caption" sx={{ mr: 1 }}>Per wing</Typography>
            <Switch
              size="small"
              checked={showPerPound}
              onChange={() => setShowPerPound(!showPerPound)}
            />
            <Typography variant="caption" sx={{ ml: 1 }}>Per pound</Typography>
            
            <Typography variant="body1" fontWeight="bold" color="primary.main" sx={{ ml: 2 }}>
              {showPerPound
                ? `$${(Number(deal.price_per_wing) * WINGS_PER_POUND).toFixed(2)}/lb`
                : `$${Number(deal.price_per_wing).toFixed(2)}/wing`}
            </Typography>
          </Box>
        )}
        
        {/* Categories */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={deal.category} 
            size="small"
            sx={{ 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              fontWeight: 500
            }} 
          />
          
          {deal.second_category && (
            <Chip 
              label={deal.second_category} 
              size="small"
              sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                fontWeight: 500
              }} 
            />
          )}
        </Box>
      </CardContent>
      
      {/* Day and time info */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
          color: 'text.secondary',
          p: 1.5,
          fontSize: '0.75rem',
          borderTop: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarTodayIcon sx={{ fontSize: 14, mr: 0.5 }} />
          <Typography variant="caption" fontWeight="medium">{deal.day_of_week}</Typography>
        </Box>
        
        {(deal.start_time && deal.end_time) ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption">
              {formatTime(deal.start_time)} - {formatTime(deal.end_time)}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
            <Typography variant="caption">All day</Typography>
          </Box>
        )}
      </Box>
      
      {/* Report Deal Modal */}
      <Dialog open={reportModalOpen} onClose={() => setReportModalOpen(false)}>
        <DialogTitle>Report Deal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Reporting <strong>{deal.restaurant_name}</strong> ({deal.day_of_week})
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="report-reason-label">Reason</InputLabel>
            <Select
              labelId="report-reason-label"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              label="Reason"
            >
              <MenuItem value="Dead deal">Deal no longer valid</MenuItem>
              <MenuItem value="Misleading">Misleading or Fraudulent</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Details"
            multiline
            rows={3}
            fullWidth
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
            placeholder="Please provide additional details..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitReport} color="primary" variant="contained">
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DealCard;