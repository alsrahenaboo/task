import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LocalShipping,
  Warning,
  CheckCircle,
  ArrowForward
} from '@mui/icons-material';

function App() {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkips();
  }, []);

  const fetchSkips = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
      
      if (!response.ok) {
        throw new Error('Failed to fetch skips data');
      }
      
      const data = await response.json();
      setSkips(data);
    } catch (err) {
      console.error('Error fetching skips:', err);
      setError('Failed to load skips data. Please try again later.');
      // Fallback to mock data if API fails
      
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSelect = (skip) => {
    setSelectedSkip(skip);
  };

  const SkipCard = ({ skip }) => {
    const isSelected = selectedSkip?.id === skip.id;

    return (
      <Grid item xs={12} sm={6} md={4} key={skip.id}>
        <Card
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: isSelected 
              ? 'linear-gradient(145deg, #1976d2, #42a5f5)'
              : 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
            border: isSelected ? '2px solid #2196f3' : '1px solid #333',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 12px 20px rgba(33, 150, 243, 0.3)',
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
              alt={skip.name}
              sx={{
                filter: 'brightness(0.8)',
                transition: 'filter 0.3s ease',
              }}
            />
            <Chip
              label={`${skip.size} Yards`}
              color="primary"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}
            />
            {!skip.allowed_on_road && (
              <Chip
                icon={<Warning />}
                label="Not Allowed On The Road"
                color="warning"
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 12,
                  left: 12,
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                color: '#fff',
              }}
            >
              {skip.name}
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {skip.hire_period_days} day hire period
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#2196f3',
                mb: 3,
              }}
            >
              £{skip.price_before_vat}
            </Typography>

            <Button
              variant={isSelected ? "contained" : "outlined"}
              fullWidth
              size="large"
              endIcon={isSelected ? <CheckCircle /> : <ArrowForward />}
              onClick={() => handleSkipSelect(skip)}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                background: isSelected 
                  ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
                  : 'transparent',
                '&:hover': {
                  background: isSelected 
                    ? 'linear-gradient(45deg, #388e3c, #4caf50)'
                    : 'rgba(33, 150, 243, 0.1)',
                },
              }}
            >
              {isSelected ? 'Selected' : 'Select This Skip'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      color: '#fff'
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        py: 2,
        mb: 4,
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalShipping sx={{ mr: 2, fontSize: '2rem' }} />
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              We Want Waste - Skip Hire
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Title Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Skip Size
          </Typography>
          <Typography
            variant="h6"
            sx={{ 
              mb: 4, 
              maxWidth: 600, 
              mx: 'auto',
              color: '#b0b0b0'
            }}
          >
            Select the skip size that best suits your needs
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="warning" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <CircularProgress size={60} sx={{ color: '#2196f3' }} />
          </Box>
        ) : (
          <>
            {/* Skip Cards */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              {skips.map((skip) => (
                <SkipCard key={skip.id} skip={skip} />
              ))}
            </Grid>

            {/* Selected Skip Display */}
            {selectedSkip && (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
                  border: '2px solid #2196f3',
                  textAlign: 'center',
                  mb: 4,
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                }}
              >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#fff' }}>
                  Selected: {selectedSkip.name}
                </Typography>
                
                <Typography variant="h2" sx={{ 
                  color: '#2196f3', 
                  fontWeight: 'bold',
                  mb: 2
                }}>
                  £{selectedSkip.price_before_vat}
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, color: '#b0b0b0' }}>
                  {selectedSkip.hire_period_days} day hire period
                </Typography>

                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                    },
                  }}
                >
                  Continue
                </Button>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;