import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalShipping as SupplierIcon,
  SwapHoriz as TransactionIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard'
  },
  {
    text: 'Products',
    icon: <InventoryIcon />,
    path: '/products'
  },
  {
    text: 'Categories',
    icon: <CategoryIcon />,
    path: '/categories'
  },
  {
    text: 'Suppliers',
    icon: <SupplierIcon />,
    path: '/suppliers'
  },
  {
    text: 'Transactions',
    icon: <TransactionIcon />,
    path: '/transactions'
  },
  {
    text: 'Reports',
    icon: <ReportIcon />,
    path: '/reports'
  }
];

const Sidebar = ({ drawerWidth }) => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0'
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#1976d2' }}>
          Inventory Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#bbdefb',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    color: location.pathname === item.path ? '#1976d2' : 'inherit',
                    fontWeight: location.pathname === item.path ? 500 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;