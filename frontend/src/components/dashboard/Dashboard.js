import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  SwapHoriz as TransactionIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import InventoryContext from '../../context/InventoryContext';
import Loader from '../layout/Loader';
import Summary from './Summary';
import LowStockAlert from './LowStockAlert';
import axios from '../../utils/axiosConfig';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProducts: 0,
      totalCategories: 0,
      totalTransactions: 0,
      lowStockCount: 0
    },
    lowStockProducts: [],
    recentTransactions: [],
    transactionsSummary: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { fetchProducts, fetchLowStockProducts, getTransactionsSummary } = useContext(InventoryContext);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadDashboardData = async () => {
      try {
        const [
          productsResponse,
          categoriesResponse,
          lowStockResponse,
          transactionsResponse,
          summaryResponse
        ] = await Promise.all([
          fetchProducts(),
          axios.get('/categories'),
          fetchLowStockProducts(),
          axios.get('/transactions'),
          getTransactionsSummary({
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          })
        ]);

        if (isMounted) {
          setDashboardData({
            stats: {
              totalProducts: productsResponse?.count || 0,
              totalCategories: categoriesResponse?.data?.length || 0,
              totalTransactions: transactionsResponse?.data?.length || 0,
              lowStockCount: lowStockResponse?.length || 0
            },
            lowStockProducts: lowStockResponse || [],
            recentTransactions: transactionsResponse?.data?.slice(0, 5) || [],
            transactionsSummary: summaryResponse || {}
          });
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading dashboard data:', err);
          setError('Failed to load dashboard data. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array since we only want to load once

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader message="Loading dashboard..." />
      </Box>
    );
  }

  const { stats, lowStockProducts, transactionsSummary } = dashboardData;

  return (
    <Box>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/transactions/new"
        >
          New Transaction
        </Button>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e3f2fd'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <InventoryIcon color="primary" />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalProducts}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/products"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff8e1'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Low Stock Items
              </Typography>
              <WarningIcon sx={{ color: '#ff9800' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.lowStockCount}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/products?filter=lowStock"
                color="warning"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Transactions
              </Typography>
              <TransactionIcon sx={{ color: '#4caf50' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalTransactions}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/transactions"
                color="success"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#ede7f6'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="textSecondary" gutterBottom>
                Categories
              </Typography>
              <CategoryIcon sx={{ color: '#673ab7' }} />
            </Box>
            <Typography variant="h4" component="div">
              {stats.totalCategories}
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button
                size="small"
                component={Link}
                to="/categories"
                color="secondary"
              >
                View all
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Summary (Last 30 Days)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Summary data={transactionsSummary} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <LowStockAlert products={lowStockProducts} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;