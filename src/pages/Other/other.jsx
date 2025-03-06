"use client";
import { Box, TextField, IconButton, Card, Typography, Tabs, Tab, Button, Pagination, Stack, CircularProgress, } from "@mui/material";
import { Search, Edit, Phone, Computer, Watch, Headphones, Camera, SportsEsports, Add, TextFields, } from "@mui/icons-material";
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from "react";
import { addCategory, deleteCategory, editCategory, getCategories } from "../../apis/categoryApi";
import { URL } from "../../config/config";
import Modal from '@mui/material/Modal';
import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState } from "react";
import { 
   
   
   
   
  
  Chip,
  
  DialogContent,
  DialogActions,
  Tooltip,
  Backdrop,
  Fade,
} from "@mui/material";


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
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};



function Other() {

  const { data } = useSelector((store) => store.category)
  const dispatch = useDispatch()


  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);

  const [name, setName] = useState("")
  const [file, setFile] = useState("")

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function addCateg() {
    const formData = new FormData()
    formData.append("categoryName", name)
    for (let i = 0; i < file.length; i++) {
      formData.append("categoryImage", file[i])
    }

    dispatch(addCategory(formData))
    handleClose()
    setName("")
  }



  const [editName, setEditName] = useState("")
  const [editFile, setEditFile] = useState("")
  const [idx, setIdx] = useState(null)

  const [open2, setOpen2] = React.useState(false);
  const handleClose2 = () => setOpen2(false);
  const editCateg = (el) => {
    setOpen2(true)
    setEditName(el.categoryName)
    setEditFile(el.categoryImage)
    setIdx(el.id)
  };

  function updateCategory() {
    const formData2 = new FormData()
    formData2.append("categoryName", editName)
    formData2.append("id",idx)
    for (let i = 0; i < editFile.length; i++) {
      formData2.append("categoryImage", editFile[i])
    }

    dispatch(editCategory(formData2))
    handleClose2()
  }

  useEffect(() => {
    dispatch(getCategories())
  }, [])

  return (

    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>

      {/* Top Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
            <Tab label="Categories" />
            <Tab label="Brands" />
            <Tab label="Banners" />
          </Tabs>
          <Button variant="contained"
            onClick={handleOpen}
            startIcon={<Add />} sx={{ bgcolor: "#1a73e8" }}>
            Add new
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
        }}
        sx={{ mb: 4 }}
      />

      {/* Categories Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 2,
          mb: 4,
          flexWrap:"wrap",
          display:"flex",justifyContent:"space-around"
        }}
      >
        {data.map((category) => (
          <Card
            key={category.id}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              cursor: "pointer",
              "&:hover": {
                boxShadow: 3,
              },
              width:280
            }}
          >
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#1a73e8",
                backgroundColor: "white"
              }}
            >
              <Edit
                onClick={()=>{editCateg(category)}}
                fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 45,
                right: 8,
                color: "#1a73e8",
                backgroundColor: "white"
              }}
            >
              < DeleteIcon
                fontSize="small"
                onClick={() => dispatch(deleteCategory(category.id))}
              />
            </IconButton>
            <Box
              sx={{
                width: 48,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 5,
              }}
            >
              <img
                style={{ width: "280px", height: "190px" }}
                src={URL + "/images/" + category.categoryImage} alt="" />
            </Box>
            <Typography variant="body1"
              sx={{ fontSize: "20px",marginTop:"20px" }}
            >{category.categoryName}</Typography>
          </Card>
        ))}
      </Box>

      {/* Pagination */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Pagination count={24} page={page} onChange={(event, value) => setPage(value)} color="primary" />
        <Typography variant="body2" color="text.secondary">
          {data.length} Results
        </Typography>
      </Stack>


      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Category
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="outlined-basic" label="Category Name" variant="outlined" />
              <input type="file" multiple={true}
                onChange={(e) => setFile(e.target.files)}
              />
            </Typography>
            <Button variant="contained"
              onClick={() => addCateg()}
            >Save</Button>
          </Box>
        </Modal>
      </div>

      <div>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add New Category
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                id="outlined-basic" label="Category Name" variant="outlined" />
              <input type="file" multiple={true}
                onChange={(e) => setEditFile(e.target.files)}
              />
            </Typography>
            <Button variant="contained"
              onClick={() => updateCategory()}
            >Save</Button>
          </Box>
        </Modal>
      </div>

    </Box>
  );
}


export function CategoriesManagement() {
  // Redux
  const { data, loading, error } = useSelector((store) => store.category);
  const dispatch = useDispatch();

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [notification, setNotification] = useState({ open: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  
  // Form States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    files: null,
    previewUrl: null
  });
  const [editData, setEditData] = useState({
    id: null,
    name: "",
    files: null,
    currentImage: "",
    previewUrl: null
  });

  // Pagination and filtering
  const ITEMS_PER_PAGE = 8;
  const filteredCategories = data.filter(category => 
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );
  const pageCount = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  // Initial data load
  useEffect(() => {
    dispatch(getCategories());
  }, []);

  // Handle file selection with preview
  const handleFileChange = (event, isEdit = false) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const previewUrl = URL.createObjectURL(files[0]);
      if (isEdit) {
        setEditData({ ...editData, files, previewUrl });
      } else {
        setFormData({ ...formData, files, previewUrl });
      }
    }
  };

  // Add new category
  const handleAddCategory = () => {
    if (!formData.name || !formData.files) {
      setNotification({
        open: true,
        message: "Please provide both name and image",
        type: "error"
      });
      return;
    }

    const newFormData = new FormData();
    newFormData.append("categoryName", formData.name);
    for (let i = 0; i < formData.files.length; i++) {
      newFormData.append("categoryImage", formData.files[i]);
    }

    dispatch(addCategory(newFormData))
      .then(() => {
        setNotification({
          open: true,
          message: "Category added successfully",
          type: "success"
        });
        setAddModalOpen(false);
        setFormData({ name: "", files: null, previewUrl: null });
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to add category",
          type: "error"
        });
      });
  };

  // Prepare for editing
  const handleEditOpen = (category) => {
    setEditData({
      id: category.id,
      name: category.categoryName,
      files: null,
      currentImage: category.categoryImage,
      previewUrl: null
    });
    setEditModalOpen(true);
  };

  // Update category
  const handleUpdateCategory = () => {
    if (!editData.name) {
      setNotification({
        open: true,
        message: "Category name cannot be empty",
        type: "error"
      });
      return;
    }

    const updateFormData = new FormData();
    updateFormData.append("categoryName", editData.name);
    updateFormData.append("id", editData.id);
    
    if (editData.files) {
      for (let i = 0; i < editData.files.length; i++) {
        updateFormData.append("categoryImage", editData.files[i]);
      }
    }

    dispatch(editCategory(updateFormData))
      .then(() => {
        setNotification({
          open: true,
          message: "Category updated successfully",
          type: "success"
        });
        setEditModalOpen(false);
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to update category",
          type: "error"
        });
      });
  };

  // Delete category with confirmation
  const handleDeleteClick = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteAction = () => {
    dispatch(deleteCategory(confirmDelete.id))
      .then(() => {
        setNotification({
          open: true,
          message: "Category deleted successfully",
          type: "success"
        });
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to delete category",
          type: "error"
        });
      });
    setConfirmDelete({ open: false, id: null });
  };

  // Rendering
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header with Tabs and Add Button */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 3, 
          pb: 2, 
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: { xs: 2, sm: 0 } }}>
          Product Management
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Tabs 
            value={currentTab} 
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{ 
              '& .MuiTabs-indicator': {
                backgroundColor: '#1e88e5',
              },
              '& .Mui-selected': {
                color: '#1e88e5',
              }
            }}
          >
            <Tab label="Categories" />
            <Tab label="Brands" />
            <Tab label="Banners" />
          </Tabs>
          
          <Button 
            variant="contained" 
            onClick={() => setAddModalOpen(true)} 
            startIcon={<Add />} 
            sx={{ 
              bgcolor: "#1e88e5", 
              '&:hover': { bgcolor: "#1565c0" },
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 2
            }}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {/* Search and Filters Bar */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" }, 
          justifyContent: "space-between", 
          alignItems: "center",
          gap: 2,
          mb: 4 
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
          }}
          sx={{ 
            width: { xs: "100%", md: "50%" },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
        
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip 
            icon={<FilterList />} 
            label="Filter" 
            variant="outlined" 
            clickable 
            sx={{ borderRadius: "8px" }}
          />
          <Chip 
            icon={<SortByAlpha />} 
            label="Sort" 
            variant="outlined" 
            clickable 
            sx={{ borderRadius: "8px" }}
          />
          <Box sx={{ display: "flex", bgcolor: "background.paper", borderRadius: 1, border: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <IconButton 
              size="small" 
              color={viewMode === "grid" ? "primary" : "default"}
              onClick={() => setViewMode("grid")}
            >
              <GridView fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              color={viewMode === "list" ? "primary" : "default"}
              onClick={() => setViewMode("list")}
            >
              <ViewList fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load categories. Please try again later.
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCategories.length === 0 && (
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            p: 5,
            textAlign: "center",
            border: "1px dashed rgba(0, 0, 0, 0.12)",
            borderRadius: 2
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No categories found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery ? `No results matching "${searchQuery}"` : "Start by adding your first category"}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />}
            onClick={() => setAddModalOpen(true)}
          >
            Add New Category
          </Button>
        </Box>
      )}

      {/* Categories Grid View */}
      {viewMode === "grid" && !loading && filteredCategories.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)"
            },
            gap: 3,
            mb: 4
          }}
        >
          {paginatedCategories.map((category) => (
            <Card
              key={category.id}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box 
                sx={{ 
                  position: "relative",
                  height: 180,
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                  bgcolor: "rgba(0,0,0,0.04)"
                }}
              >
                <img
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                  }}
                  src={URL + "/images/" + category.categoryImage} 
                  alt={category.categoryName}
                />
                <Box 
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: 1,
                    background: "rgba(255,255,255,0.8)",
                    borderBottomLeftRadius: 8
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen(category)}
                      sx={{ color: "#1e88e5", mb: 0.5 }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(category.id)}
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {category.categoryName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.floor(Math.random() * 200) + 1} products
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Categories List View */}
      {viewMode === "list" && !loading && filteredCategories.length > 0 && (
        <Box sx={{ mb: 4 }}>
          {paginatedCategories.map((category) => (
            <Card
              key={category.id}
              sx={{
                mb: 2,
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              <Box 
                sx={{ 
                  width: 120, 
                  height: 80, 
                  flexShrink: 0,
                  bgcolor: "rgba(0,0,0,0.04)"
                }}
              >
                <img
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                  }}
                  src={URL + "/images/" + category.categoryImage} 
                  alt={category.categoryName} 
                />
              </Box>
              <Box sx={{ 
                display: "flex", 
                flexGrow: 1, 
                alignItems: "center", 
                justifyContent: "space-between",
                p: 2
              }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {category.categoryName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.floor(Math.random() * 200) + 1} products
                  </Typography>
                </Box>
                <Box sx={{ display: "flex" }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEditOpen(category)}
                      sx={{ mr: 1, color: "#1e88e5" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(category.id)}
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      {!loading && filteredCategories.length > 0 && (
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={2} 
          alignItems={{ xs: "flex-start", sm: "center" }} 
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={(event, value) => setPage(value)} 
            color="primary"
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1
              }
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min(paginatedCategories.length, ITEMS_PER_PAGE)} of {filteredCategories.length} categories
          </Typography>
        </Stack>
      )}

      {/* Add Category Modal */}
      <Dialog
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
            />
            
            <Box sx={{ textAlign: "center" }}>
              {formData.previewUrl ? (
                <Box sx={{ position: "relative", width: "100%", height: 200, mb: 2 }}>
                  <img 
                    src={formData.previewUrl} 
                    alt="Preview" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain",
                      borderRadius: 8
                    }} 
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setFormData({ ...formData, files: null, previewUrl: null })}
                    sx={{ 
                      position: "absolute", 
                      top: 8, 
                      right: 8,
                      minWidth: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      p: 0
                    }}
                  >
                    ✕
                  </Button>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ 
                    p: 2,
                    border: "2px dashed rgba(0, 0, 0, 0.12)",
                    borderRadius: 2,
                    width: "100%",
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 1
                  }}
                >
                  <Typography variant="body1">Upload Category Image</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag & drop or click to select
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                  />
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={!formData.name || !formData.files}
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />
            
            <Box sx={{ textAlign: "center" }}>
              {editData.previewUrl ? (
                <Box sx={{ position: "relative", width: "100%", height: 200, mb: 2 }}>
                  <img 
                    src={editData.previewUrl} 
                    alt="Preview" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain",
                      borderRadius: 8
                    }} 
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setEditData({ ...editData, files: null, previewUrl: null })}
                    sx={{ 
                      position: "absolute", 
                      top: 8, 
                      right: 8,
                      minWidth: 0,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      p: 0
                    }}
                  >
                    ✕
                  </Button>
                </Box>
              ) : editData.currentImage ? (
                <Box sx={{ position: "relative", width: "100%", height: 200, mb: 2 }}>
                  <img 
                    src={URL + "/images/" + editData.currentImage} 
                    alt="Current" 
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "contain",
                      borderRadius: 8
                    }} 
                  />
                  <Button
                    component="label"
                    variant="contained"
                    sx={{ 
                      position: "absolute", 
                      bottom: 8, 
                      right: 8
                    }}
                  >
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                    />
                  </Button>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ 
                    p: 2,
                    border: "2px dashed rgba(0, 0, 0, 0.12)",
                    borderRadius: 2,
                    width: "100%",
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 1
                  }}
                >
                  <Typography variant="body1">Upload Category Image</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drag & drop or click to select
                  </Typography>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setEditModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateCategory} 
            variant="contained"
            disabled={!editData.name}
          >
            Update Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this category? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAction} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Other;
