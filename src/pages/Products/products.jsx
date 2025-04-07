"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Collapse,
  Card,
  CardContent,
  Tooltip,
  Badge,
  Divider,
  LinearProgress,
  Menu,
  Switch,
  FormControlLabel
} from "@mui/material";
import {
  Add,
  Search,
  Edit,
  Delete,
  FilterList,
  ViewModule,
  ViewList,
  MoreVert,
  Refresh,
  Sort,
  ArrowDropDown,
  ArrowUpward, 
  ArrowDownward,
  Visibility
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addProductImg, deleteProduct, deleteProductImg, getProductById, getProducts } from "../../apis/producsApi";
import { URL } from "../../config/config";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selected, setSelected] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Modal states
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [idx, setIdx] = useState(null);
  const [imgFile, setImgFile] = useState("");

  const data = useSelector((store) => store.product.data) || [];
  console.log(data,"all");
  
  const brandId = useSelector((store) => store.product.brandId);
  const imgs = useSelector((store) => store.product.getById);
  const dispatch = useDispatch();

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(data.map((product) => product.id) || []);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
    );
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    dispatch(getProducts()).finally(() => {
      setTimeout(() => setIsLoading(false), 800);
    });
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "table" ? "grid" : "table");
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleDeleteSelected = () => {
    // Create a copy to avoid mutation during iteration
    const itemsToDelete = [...selected];
    itemsToDelete.forEach(id => {
      dispatch(deleteProduct(id));
    });
    setSelected([]);
  };

  // Modal handlers
  const handleOpen = (productId) => {
    setIdx(productId);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setImgFile(""); // Reset image state
  };

  const handleOpen2 = (productId) => {
    dispatch(getProductById(productId));
    setOpen2(true);
  };
  
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleDeleteImage = (imageId) => {
    dispatch(deleteProductImg(imageId)).then(() => {
      // Refresh product details
      if (idx) {
        dispatch(getProductById(idx));
      }
    });
    handleClose2();
  };

  function addImage() {
    if (!imgFile || !idx) return;
    
    const imgFormData = new FormData();
    imgFormData.append("ProductId", idx);
    
    for (let i = 0; i < imgFile.length; i++) {
      imgFormData.append("Files", imgFile[i]);
    }
    
    dispatch(addProductImg(imgFormData)).then(() => {
      // Refresh product list
      dispatch(getProducts());
    });
    
    handleClose();
  }

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return data.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategories.length === 0 || selectedCategories.includes(product.categoryName)) &&
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
  }, [data, searchTerm, selectedCategories, priceRange]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return [];
    
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "Price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortBy === "Newest") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }
      return 0;
    });
  }, [filteredProducts, sortBy, sortDirection]);

  // Get unique categories from data
  const categories = React.useMemo(() => {
    return [...new Set(data.filter(product => product?.categoryName).map(product => product.categoryName))];
  }, [data]);

  // Initial data loading
  useEffect(() => {
    setIsLoading(true);
    
    dispatch(getProducts())
      .then(() => {
        setTimeout(() => setIsLoading(false), 800);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, [dispatch]);

  return (
    <>
      {/* Add Image Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Image To Product
          </Typography>
          <input 
            type="file" 
            multiple 
            onChange={(e) => setImgFile(e.target.files)} 
          />
          <Button 
            variant="contained"
            onClick={addImage}
            disabled={!imgFile || imgFile.length === 0}
          >
            Save Image
          </Button>
        </Box>
      </Modal>

      {/* Delete Image Modal */}
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{ display: "flex", flexDirection: "column", gap: "30px" }}
          sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Image From Product
          </Typography>
          <Box>
            {imgs?.images && imgs.images.length > 0 ? (
              imgs.images.map((e) => (
                <div key={e.id} style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: "10px"}}>
                  <img 
                    style={{width:"80px"}}
                    src={URL+"/images/"+e.images} 
                    alt="Product" 
                  />
                  <IconButton onClick={() => handleDeleteImage(e.id)} color="error">
                    <Delete />
                  </IconButton>
                </div>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No images available
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          p: 3,
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)'
        }}
      >
        {/* Header */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Products
            </Typography>
            <Chip
              label={`${data?.length || 0} items`}
              size="small"
              sx={{ ml: 2, borderRadius: 1, bgcolor: 'rgba(0,0,0,0.04)' }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title={viewMode === "table" ? "Grid View" : "Table View"}>
              <IconButton onClick={toggleViewMode} sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}>
                {viewMode === "table" ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>

            {selected.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Delete />}
                onClick={handleDeleteSelected}
                sx={{ mr: 1 }}
              >
                Delete Selected ({selected.length})
              </Button>
            )}

            <Link to="/addProduct" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)',
                  boxShadow: '0 4px 12px rgba(58,123,213,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2c65b1 0%, #00b8e0 100%)',
                    boxShadow: '0 6px 16px rgba(58,123,213,0.4)',
                  }
                }}
              >
                Add Product
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Loading indicator */}
        {isLoading && (
          <LinearProgress
            sx={{
              mb: 3,
              borderRadius: 1,
              height: 6,
              '.MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%)'
              }
            }}
          />
        )}

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
            }}
            sx={{
              flexGrow: 1,
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 0 0 4px rgba(58,123,213,0.1)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 4px rgba(58,123,213,0.2)'
                }
              }
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={toggleFilters}
            sx={{
              borderRadius: 2,
              borderColor: showFilters ? '#3a7bd5' : 'rgba(0,0,0,0.23)',
              color: showFilters ? '#3a7bd5' : 'inherit'
            }}
          >
            Filters
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              startAdornment={<Sort sx={{ mr: 1 }} />}
              sx={{
                minWidth: 140,
                borderRadius: 2,
                '.MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
              <MenuItem value="Price">Price</MenuItem>
            </Select>

            <Tooltip title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}>
              <IconButton onClick={toggleSort} size="small">
                {sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Advanced Filters */}
        <Collapse in={showFilters}>
          <Card variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Advanced Filters</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="caption">Categories</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {categories.map(category => (
                    <Chip
                      key={category}
                      label={category}
                      size="small"
                      clickable
                      color={selectedCategories.includes(category) ? "primary" : "default"}
                      onClick={() => {
                        setSelectedCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(cat => cat !== category)
                            : [...prev, category]
                        );
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Add more filters as needed */}
            </Box>
          </Card>
        </Collapse>

        {/* Empty State */}
        {(!data || data.length === 0) && !isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(58,123,213,0.1)',
                mb: 2
              }}
            >
              <FilterList sx={{ fontSize: 32, color: '#3a7bd5' }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>No Products Found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Link to="/addProduct" style={{ textDecoration: 'none' }}>
              <Button variant="contained" startIcon={<Add />}>
                Add Your First Product
              </Button>
            </Link>
          </Box>
        )}

        {/* Table View */}
        {viewMode === "table" && sortedProducts.length > 0 && (
          <TableContainer sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'rgba(58,123,213,0.04)'
            }
          }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < sortedProducts.length}
                      checked={sortedProducts.length > 0 && selected.length === sortedProducts.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Inventory</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((el) => (
                  <TableRow
                    key={el.id}
                    hover
                    selected={selected.includes(el.id)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(58,123,213,0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(58,123,213,0.12)'
                        }
                      }
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(el.id)}
                        onChange={() => handleSelect(el.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          variant="rounded"
                          src={`${URL}/images/${el.image}`}
                          alt={el.productName}
                          sx={{ width: 50, height: 50, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                          onClick={() => handleOpen2(el.id)}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{el.productName}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: {el.id}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {el.quantity > 10 ? (
                        <Chip
                          size="small"
                          label={`${el.quantity} in stock`}
                          color="success"
                          sx={{ borderRadius: 1 }}
                        />
                      ) : el.quantity > 0 ? (
                        <Chip
                          size="small"
                          label={`${el.quantity} in stock`}
                          color="warning"
                          sx={{ borderRadius: 1 }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          label="Out of Stock"
                          color="error"
                          sx={{ borderRadius: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={el.categoryName}
                        sx={{
                          borderRadius: 1,
                          bgcolor: 'rgba(0,0,0,0.04)',
                          color: 'text.primary'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${el.price?.toFixed(2) || '0.00'}
                        </Typography>
                        {el.hasDiscount && el.discountPrice && (
                          <Typography variant="caption" color="error" sx={{ textDecoration: "line-through" }}>
                            ${el.discountPrice.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Add Images">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#3a7bd5' }}
                            onClick={() => handleOpen(el.id)}
                          >
                            <AddPhotoAlternateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <Link to={`/editProduct/${el.id}`} style={{ color: 'inherit' }}>
                            <IconButton size="small" sx={{ color: '#3a7bd5' }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => dispatch(deleteProduct(el.id))}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Grid View */}
        {viewMode === "grid" && sortedProducts.length > 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
            {sortedProducts.map((product) => (
              <Card
                key={product.id}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {/* Selection checkbox */}
                <Checkbox
                  checked={selected.includes(product.id)}
                  onChange={() => handleSelect(product.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%'
                  }}
                />

                {/* Product image */}
                <Box
                  sx={{
                    height: 180,
                    position: 'relative',
                    borderRadius: '8px 8px 0 0',
                    overflow: 'hidden',
                    bgcolor: 'rgba(0,0,0,0.04)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleOpen2(product.id)}
                >
                  <Avatar
                    variant="square"
                    src={`${URL}/images/${product.image}`}
                    alt={product.productName}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Stock badge */}
                  {product.quantity <= 0 && (
                    <Chip
                      label="Out of Stock"
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        borderRadius: 1
                      }}
                    />
                  )}

                  {/* Discount badge */}
                  {product.hasDiscount && (
                    <Chip
                      label="Sale"
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        borderRadius: 1
                      }}
                    />
                  )}
                </Box>

                <CardContent>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                    {product.productName}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 2 }}>
                    <Chip
                      label={product.categoryName}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        bgcolor: 'rgba(0,0,0,0.04)',
                        color: 'text.primary',
                        height: 24
                      }}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#3a7bd5' }}>
                        ${product.price?.toFixed(2) || '0.00'}
                      </Typography>
                      {product.hasDiscount && product.discountPrice && (
                        <Typography variant="caption" color="error" sx={{ textDecoration: "line-through" }}>
                          ${product.discountPrice.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Add Images">
                      <IconButton
                        size="small"
                        sx={{
                          flex: 1,
                          color: '#3a7bd5',
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: 1
                        }}
                        onClick={() => handleOpen(product.id)}
                      >
                        <AddPhotoAlternateIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Link to={`/editProduct/${product.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          color: '#3a7bd5',
                          borderColor: 'rgba(0,0,0,0.12)'
                        }}
                      >
                        <Edit fontSize="small" />
                      </Button>
                    </Link>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        sx={{
                          flex: 1,
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: 1
                        }}
                        onClick={() => dispatch(deleteProduct(product.id))}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </>
  );
}