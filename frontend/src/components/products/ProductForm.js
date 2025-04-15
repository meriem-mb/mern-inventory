import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Loader from '../layout/Loader';
import axios from '../../utils/axiosConfig';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    sku: '',
    quantity: 0,
    unitOfMeasure: '',
    size: '',
    unitPrice: 0,
    currency: 'MAD',
    costPrice: 0,
    minStockLevel: 0,
    location: '',
    isActive: true
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Size options
  const sizeOptions = [
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Double Extra Large (XXL)' },
    { value: 'XXXL', label: 'Triple Extra Large (XXXL)' }
  ];
  
  // Units of measure options
  const unitOptions = [
    { value: 'gr', label: 'Gr.' },
    { value: 'kg', label: 'Kg' },
    { value: 'piece', label: 'Piece' },
    { value: 'L', label: 'L' },
    { value: 'ml', label: 'ml' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'set', label: 'Set' },
    { value: 'pair', label: 'Pair' }
  ];
  
  // Currency options
  const currencyOptions = [
    { value: 'MAD', label: 'Moroccan Dirham (MAD)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' }
  ];
  
  // Fetch product if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setIsEditing(true);
        setLoading(true);
        
        try {
          const response = await axios.get(`/products/${id}`);
          const productData = response.data;
          
          setProduct({
            name: productData.name || '',
            description: productData.description || '',
            sku: productData.sku || '',
            quantity: productData.quantity || 0,
            unitOfMeasure: productData.unitOfMeasure || '',
            size: productData.size || '',
            unitPrice: productData.unitPrice || 0,
            currency: productData.currency || 'MAD',
            costPrice: productData.costPrice || 0,
            minStockLevel: productData.minStockLevel || 0,
            location: productData.location || '',
            isActive: productData.isActive === undefined ? true : productData.isActive
          });
          
          if (productData.imageUrl) {
            setImagePreview(productData.imageUrl);
          }
          
          setLoading(false);
        } catch (err) {
          setError('Error fetching product data');
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!product.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!product.sku.trim()) {
      errors.sku = 'SKU is required';
    }
    
    if (product.unitPrice < 0) {
      errors.unitPrice = 'Price cannot be negative';
    }
    
    if (product.costPrice < 0) {
      errors.costPrice = 'Cost price cannot be negative';
    }
    
    if (product.minStockLevel < 0) {
      errors.minStockLevel = 'Minimum stock level cannot be negative';
    }
    
    setValidationErrors(errors);
    
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add product data
      Object.keys(product).forEach(key => {
        formData.append(key, product[key]);
      });
      
      // Add image if selected
      if (image) {
        formData.append('image', image);
      }
      
      if (isEditing) {
        // Update existing product
        await axios.put(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new product
        await axios.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
      setLoading(false);
    }
  };
  
  if (loading && !product.name) {
    return <Loader message="Loading product data..." />;
  }
  
  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          mb: 3
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: '#1976d2'
            }}
          >
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Back to Products
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: '#2c3e50',
                  mb: 1
                }}
              >
                Basic Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                error={!!validationErrors.name}
                helperText={validationErrors.name || 'Enter the name of your product'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                error={!!validationErrors.sku}
                helperText={validationErrors.sku || 'Unique identifier for your product'}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
                multiline
                rows={3}
                helperText="Add a detailed description of your product (optional)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Stock Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: '#2c3e50',
                  mb: 1
                }}
              >
                Stock Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                helperText="Current stock quantity"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                <InputLabel id="unit-label">Unit</InputLabel>
                <Select
                  labelId="unit-label"
                  name="unitOfMeasure"
                  value={product.unitOfMeasure}
                  onChange={handleChange}
                  label="Unit"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {unitOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Measurement unit (optional)</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                <InputLabel id="size-label">Size</InputLabel>
                <Select
                  labelId="size-label"
                  name="size"
                  value={product.size}
                  onChange={handleChange}
                  label="Size"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {sizeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Product size (optional)</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Stock Level"
                name="minStockLevel"
                value={product.minStockLevel}
                onChange={handleChange}
                error={!!validationErrors.minStockLevel}
                helperText={validationErrors.minStockLevel || "Alert threshold for low stock"}
                InputProps={{
                  inputProps: { min: 0 }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Storage Location"
                name="location"
                value={product.location}
                onChange={handleChange}
                helperText="Where this product is stored (optional)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Pricing Information */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: '#2c3e50',
                  mb: 1
                }}
              >
                Pricing Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Selling Price"
                name="unitPrice"
                value={product.unitPrice}
                onChange={handleChange}
                error={!!validationErrors.unitPrice}
                helperText={validationErrors.unitPrice || "Product's selling price"}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">{product.currency}</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Cost Price"
                name="costPrice"
                value={product.costPrice}
                onChange={handleChange}
                error={!!validationErrors.costPrice}
                helperText={validationErrors.costPrice || "Product's purchase cost"}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 },
                  startAdornment: <InputAdornment position="start">{product.currency}</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl 
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  name="currency"
                  value={product.currency}
                  onChange={handleChange}
                  label="Currency"
                >
                  {currencyOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select currency</FormHelperText>
              </FormControl>
            </Grid>

            {/* Product Image */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: '#2c3e50',
                  mb: 1
                }}
              >
                Product Image
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ 
                  height: '56px',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <FormHelperText>Upload a product image (optional)</FormHelperText>
            </Grid>

            <Grid item xs={12} md={6}>
              {imagePreview && (
                <Box
                  sx={{
                    height: '150px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 1,
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  py: 1.5
                }}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ProductForm;