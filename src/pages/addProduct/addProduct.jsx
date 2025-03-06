"use client"

import { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  InputAdornment,
  Stack,
  Breadcrumbs,
  Modal,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Badge,
  Snackbar,
  Alert,
  Skeleton
} from "@mui/material"
import {
  ArrowBack,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Delete,
  Add,
  CloudUpload,
  PhotoCamera,
  Inventory,
  ColorLens,
  LocalOffer,
  Description,
  Category,
  ImageSearch,
  MoreHoriz,
  CheckCircle,
  Save
} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { getCategories, getSubCategories } from "../../apis/categoryApi"
import { addColor, addProduct, getBrands, getColors } from "../../apis/producsApi"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

const ColorBox = ({ color, selected, onClick }) => (
  <Tooltip title={color.colorName}>
    <Box
      onClick={onClick}
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: color.colorName,
        cursor: "pointer",
        border: selected ? '3px solid #000' : '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'scale(1.1)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
    />
  </Tooltip>
);

export default function ProductForm() {
  // Form states
  const [activeStep, setActiveStep] = useState(0);
  const [formComplete, setFormComplete] = useState({
    basicInfo: false,
    categorization: false,
    pricing: false,
    options: false,
    media: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Product data states
  const [newTag, setNewTag] = useState("")
  const [hasOptions, setHasOptions] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [desc, setDesc] = useState("")
  const [categories, setCategories] = useState("")
  const [discount, setDiscount] = useState("")
  const [brands, setBrands] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [size, setSize] = useState("")
  const [weight, setWeight] = useState("")
  const [color, setColor] = useState(null)
  const [newColor, setNewColor] = useState("")
  const [file, setFile] = useState([])
  const [subCategory, setSubCategory] = useState("")
  const [filesData, setFilesData] = useState([]);
  const [open, setOpen] = useState(false);

  // Redux and router hooks
  const data = useSelector((store) => store.category.data)
  const subData = useSelector((store) => store.category.subData)
  const brandData = useSelector((store) => store.brands.data)
  const colorData = useSelector((store) => store.colors.data)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const steps = [
    'Basic Information',
    'Categorization',
    'Pricing',
    'Options',
    'Media'
  ];

  useEffect(() => {
    dispatch(getCategories())
    dispatch(getBrands())
    dispatch(getColors())
    dispatch(getSubCategories())
    
    // Simulate loading
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }, [dispatch])

  // Check if form sections are complete
  useEffect(() => {
    setFormComplete({
      basicInfo: name.length > 0 && code.length > 0 && desc.length > 0,
      categorization: categories && subCategory && brands,
      pricing: price && quantity,
      options: !hasOptions || (hasOptions && size && weight),
      media: filesData.length > 0 && color !== null
    });
  }, [name, code, desc, categories, subCategory, brands, price, quantity, hasOptions, size, weight, filesData, color]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  function addNewProduct() {
    // Show loading state
    setLoading(true);
    
    let formData = new FormData()
    formData.append('ProductName', name)
    formData.append('Description', desc)
    formData.append('Quantity', quantity)
    formData.append('Weight', weight)
    formData.append('Size', size)
    formData.append('Code', code)
    formData.append('Price', price)
    formData.append('HasDiscount', hasOptions)
    formData.append('DiscountPrice', discount)
    formData.append('ColorId', color)
    formData.append('SubCategoryId', subCategory)
    formData.append('BrandId', brands)
    for (let i = 0; i < file.length; i++) {
      formData.append('Images', file[i])
    }

    // Simulate API delay
    setTimeout(() => {
      dispatch(addProduct(formData));
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Product successfully created!",
        severity: "success"
      });
      setTimeout(() => nav('/products'), 1500);
    }, 1500);
  }

  const changeFile = async (event) => {
    const files = Array.from(event);
    setFile(event)

    const filePromises = files.map((file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve({ fileName: file.name, base64: reader.result });
        };
        reader.onerror = (error) => reject(error);
      })
    );

    const filesDataArray = await Promise.all(filePromises);
    setFilesData(filesDataArray);
  };

  function deleteSelectedImg(base64) {
    const newFilesData = filesData.filter((el) => el.base64 !== base64);
    setFilesData(newFilesData);
  }

  function generateUniqueCode() {
    const prefix = name.slice(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setCode(`${prefix}-${timestamp}-${random}`);
    setSnackbar({
      open: true,
      message: "Unique product code generated!",
      severity: "info"
    });
  }

  // Content for each step
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Information
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />
              Product Information
            </Typography>
            <Box sx={{ mb: 4 }}>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth 
                label="Product name" 
                variant="outlined" 
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {name && <CheckCircle color="success" />}
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  fullWidth 
                  label="Product code" 
                  variant="outlined" 
                />
                <Button 
                  variant="outlined" 
                  onClick={generateUniqueCode}
                  disabled={!name}
                >
                  Generate Code
                </Button>
              </Box>
              <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                    <FormatBold />
                  </IconButton>
                  <IconButton size="small">
                    <FormatItalic />
                  </IconButton>
                  <IconButton size="small">
                    <FormatUnderlined />
                  </IconButton>
                  <IconButton size="small">
                    <FormatListBulleted />
                  </IconButton>
                  <IconButton size="small">
                    <FormatListNumbered />
                  </IconButton>
                </Stack>
              </Paper>
              <TextField
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                fullWidth 
                multiline 
                rows={4} 
                placeholder="Detailed product description" 
                helperText={`${desc.length} characters`}
              />
            </Box>
          </Box>
        );
      
      case 1: // Categorization
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Category sx={{ mr: 1 }} />
              Categories and Brands
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 4, flexDirection: 'column' }}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Category</Typography>
                <select 
                  style={{ 
                    width: "100%", 
                    height: "50px", 
                    borderRadius: "4px", 
                    padding: "8px",
                    border: "1px solid #ddd"
                  }} 
                  value={categories} 
                  onChange={(e) => setCategories(e.target.value)} 
                >
                  <option value="">Select Category</option>
                  {data?.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.categoryName}
                    </option>
                  ))}
                </select>
              </Paper>
              
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Sub-Category</Typography>
                <select 
                  style={{ 
                    width: "100%", 
                    height: "50px", 
                    borderRadius: "4px", 
                    padding: "8px",
                    border: "1px solid #ddd"
                  }} 
                  value={subCategory} 
                  onChange={(e) => setSubCategory(e.target.value)} 
                >
                  <option value="">Select Sub-Category</option>
                  {subData?.map((el) => (
                    <option value={el.id} key={el.id}>
                      {el.subCategoryName}
                    </option>
                  ))}
                </select>
              </Paper>
              
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Brand</Typography>
                <select
                  style={{ 
                    width: "100%", 
                    height: "50px", 
                    borderRadius: "4px", 
                    padding: "8px",
                    border: "1px solid #ddd"
                  }}
                  value={brands}
                  onChange={(e) => setBrands(e.target.value)}
                >
                  <option value="">Select Brand</option>
                  {brandData?.map((el) => (
                    <option value={el.id} key={el.id}>
                      {el.brandName}
                    </option>
                  ))}
                </select>
              </Paper>
            </Box>
          </Box>
        );
      
      case 2: // Pricing
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <LocalOffer sx={{ mr: 1 }} />
              Pricing and Inventory
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  label="Product price"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  sx={{ flex: '1 1 30%' }}
                />
                <TextField
                  label="Discount Price"
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  sx={{ flex: '1 1 30%' }}
                />
                <TextField
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  label="Quantity" 
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">
                      <Tooltip title="Available stock">
                        <Inventory />
                      </Tooltip>
                    </InputAdornment>,
                  }}
                  sx={{ flex: '1 1 30%' }}
                />
              </Box>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel 
                control={<Switch />} 
                label="Add tax for this product" 
              />
              {discount && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Savings Summary</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">Original Price:</Typography>
                    <Typography variant="body2">${price}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Discount Price:</Typography>
                    <Typography variant="body2">${discount}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Customer Saves:</Typography>
                    <Typography variant="body2" color="error">${(price - discount).toFixed(2)} ({((price - discount) / price * 100).toFixed(0)}%)</Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>
        );
      
      case 3: // Options
        return (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <MoreHoriz sx={{ mr: 1 }} />
                Product Options
              </Typography>
              <FormControlLabel 
                control={<Switch checked={hasOptions} onChange={(e) => setHasOptions(e.target.checked)} />} 
                label="Enable Options" 
              />
            </Box>
            {hasOptions ? (
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Size
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <TextField
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      fullWidth
                      label="Product Size"
                      placeholder="e.g. S, M, L or dimensions"
                    />
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Weight
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      fullWidth
                      label="Product Weight"
                      placeholder="e.g. 1.5 kg"
                    />
                  </Box>
                  <Button startIcon={<Add />} variant="outlined" sx={{ mt: 2 }}>
                    Add Custom Option
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Typography color="text.secondary">
                  Options are disabled. Toggle the switch to add size, weight, and other product variations.
                </Typography>
              </Paper>
            )}
          </Box>
        );
      
      case 4: // Media
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ColorLens sx={{ mr: 1 }} />
              Product Colors
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                {colorData?.map((el) => (
                  <ColorBox 
                    key={el.id}
                    color={el}
                    selected={color === el.id}
                    onClick={() => setColor(el.id)}
                  />
                ))}
              </Box>
              <Button 
                onClick={handleOpen} 
                variant="outlined" 
                startIcon={<Add />}
                size="small"
              >
                Create New Color
              </Button>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ImageSearch sx={{ mr: 1 }} />
              Product Images
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                borderStyle: "dashed",
                cursor: "pointer",
                mb: 3,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0,0,0,0.01)'
                }
              }}
            >
              <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Drag and drop files here or click to browse
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Files
                <input 
                  type="file" 
                  multiple={true}
                  onChange={(e) => changeFile(e.target.files)}
                  hidden
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                PNG, JPG, JPEG or BMP (max. 5MB each)
              </Typography>
            </Paper>
            
            {/* Image Preview List */}
            {filesData.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {filesData.length} Image{filesData.length !== 1 ? 's' : ''} Selected
                </Typography>
                <Stack spacing={1}>
                  {filesData.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'rgba(0,0,0,0.01)'
                        }
                      }}
                    >
                      <Box component="img" src={item.base64} sx={{ width: 60, height: 60, objectFit: "cover", borderRadius: 1 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.fileName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.fileName.split('.').pop().toUpperCase()}
                        </Typography>
                      </Box>
                      <Tooltip title="Remove image">
                        <IconButton onClick={() => deleteSelectedImg(item.base64)} size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Color Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Color
          </Typography>
          <TextField
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            label="Color Name"
            fullWidth
            autoFocus
          />
          <Box sx={{ height: 40, bgcolor: newColor || '#e0e0e0', borderRadius: 1, mb: 2 }} />
          <Button 
            variant="contained"
            fullWidth
            onClick={() => { 
              dispatch(addColor(newColor));
              handleClose();
              setSnackbar({
                open: true,
                message: `New color "${newColor}" added successfully!`,
                severity: "success"
              });
            }}
            disabled={!newColor}
          >
            Save Color
          </Button>
        </Box>
      </Modal>

      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs>
          <Link
            to="/products"
            style={{ display: "flex", alignItems: "center", color: "inherit", textDecoration: "none" }}
          >
            <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
            Products
          </Link>
          <Typography color="text.primary">Add New Product</Typography>
        </Breadcrumbs>
        <Box>
          <Button 
            sx={{ mr: 2 }}
            onClick={() => nav('/products')}
          >
            Cancel
          </Button>
          <Button
            onClick={addNewProduct}
            variant="contained" 
            color="primary"
            disabled={loading || !(formComplete.basicInfo && formComplete.categorization && formComplete.pricing && formComplete.options && formComplete.media)}
            startIcon={loading ? null : <Save />}
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </Box>
      </Box>

      {/* Progress stepper */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label} completed={
              (index === 0 && formComplete.basicInfo) ||
              (index === 1 && formComplete.categorization) ||
              (index === 2 && formComplete.pricing) ||
              (index === 3 && formComplete.options) ||
              (index === 4 && formComplete.media)
            }>
              <StepLabel 
                StepIconProps={{ 
                  sx: { cursor: 'pointer' } 
                }}
                onClick={() => handleStepChange(index)}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form content */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Main Form Area */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            {loading ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="text" sx={{ fontSize: '2rem', width: '40%', mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={120} />
              </Box>
            ) : (
              renderStepContent(activeStep)
            )}
          </Paper>

          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => handleStepChange(activeStep - 1)}
              variant="outlined"
            >
              Previous
            </Button>
            <Button
              disabled={activeStep === steps.length - 1}
              onClick={() => handleStepChange(activeStep + 1)}
              variant="outlined"
            >
              Next
            </Button>
          </Box>
        </Box>

        {/* Summary sidebar */}
        <Box sx={{ width: 280 }}>
          <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Product Summary
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Completion Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Basic Info</Typography>
                <Chip 
                  size="small" 
                  color={formComplete.basicInfo ? "success" : "default"} 
                  label={formComplete.basicInfo ? "Complete" : "Incomplete"} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Categories</Typography>
                <Chip 
                  size="small" 
                  color={formComplete.categorization ? "success" : "default"} 
                  label={formComplete.categorization ? "Complete" : "Incomplete"} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Pricing</Typography>
                <Chip 
                  size="small" 
                  color={formComplete.pricing ? "success" : "default"} 
                  label={formComplete.pricing ? "Complete" : "Incomplete"} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Options</Typography>
                <Chip 
                  size="small" 
                  color={formComplete.options ? "success" : "default"} 
                  label={formComplete.options ? "Complete" : "Incomplete"} 
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2">Media</Typography>
                <Chip 
                  size="small" 
                  color={formComplete.media ? "success" : "default"} 
                  label={formComplete.media ? "Complete" : "Incomplete"} 
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {name && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Product Name
                </Typography>
                <Typography variant="body2">{name}</Typography>
              </Box>
            )}

            {price && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="body2">${price}</Typography>
                {discount && (
                  <Typography variant="body2" color="error">
                    Sale: ${discount}
                  </Typography>
                )}
              </Box>
            )}

            {filesData.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Images
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {filesData.slice(0, 4).map((item, index) => (
                    <Box 
                      key={index} 
                      component="img" 
                      src={item.base64} 
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }} 
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}