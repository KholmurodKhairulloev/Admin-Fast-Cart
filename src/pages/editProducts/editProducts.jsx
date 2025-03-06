"use client"

import { useState } from "react"
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Stack,
  Breadcrumbs,
  Modal,
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
} from "@mui/icons-material"
import { Link, useNavigate, useParams } from "react-router-dom"
// import Link from "next/link"

import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from "react"
import { getCategories, getSubCategories } from "../../apis/categoryApi"
import { addColor, addProduct, getBrands, getColors, getProductById, updateProduct } from "../../apis/producsApi"
import uuid from 'react-uuid';


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

export default function ProductForm() {
  const getById = useSelector((store) => store.product.getById)
  const { id } = useParams()
  console.log(getById);
  const brandData = useSelector((store) => store.brands.data)
  const productData = useSelector((store) => store.product.data)
  const subData = useSelector((store) => store.category.subData)
  const colorData = useSelector((store) => store.colors.data)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const [newTag, setNewTag] = useState("")

  const [hasOptions, setHasOptions] = useState(getById?.hasDiscount)
  const [name, setName] = useState(getById?.productName)
  const [code, setCode] = useState(uuid())
  const [desc, setDesc] = useState(getById?.description)
  const [categories, setCategories] = useState(getById?.categoryName)
  const [discount, setDiscount] = useState(getById?.discountPrice)

  const [brands, setBrands] = useState(brandData?.find((el) => {
    if (el.brandName === getById?.brand) {
      return el.id
    }
  })?.id)
  const [price, setPrice] = useState(getById?.price)
  const [quantity, setQuantity] = useState(getById?.quantity)
  const [size, setSize] = useState(getById?.size)
  const [weight, setWeight] = useState(getById?.weight)
  const [color, setColor] = useState(colorData?.find((el) => {
    if (el.colorName === getById?.color) {
      return el.id
    }
  })?.id)
  const [newColor, setNewColor] = useState("")
  const [file, setFile] = useState(getById?.images)
  const [subCategory, setSubCategory] = useState(getById?.subCategoryId)



  console.log(brands);



  // const brandId = brandData.find((el) => {
  //   if(el.brandName===getById?.brand){
  //     return el.id
  //   }
  // })
  // setBrands(brandId?.id)
  // console.log(brandId?.id);






  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function editProduct() {
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
    formData.append('id', id)
    console.log(1);
    for (let i = 0; i < file.length; i++) {
      formData.append('Images', file[i])
    }

    console.log(formData);

    dispatch(updateProduct(formData))
    nav('/products')
  }



  useEffect(() => {
    dispatch(getCategories())
    dispatch(getBrands())
    dispatch(getColors())
    dispatch(getSubCategories())
    dispatch(getProductById(id))
  }, [id])

  useEffect(() => {
    if (getById) {
      setName(getById.productName);
      setDesc(getById.description);
      setCategories(getById.categoryName);
      setDiscount(getById.discountPrice);
      setBrands(brandData?.find((el) => {
        if (el.brandName === getById?.brand) {
          return el.id
        }
      })?.id)
      setPrice(getById?.price)
      setQuantity(getById?.quantity)
      setSize(getById?.size)
      setWeight(getById?.weight)
      setColor(colorData?.find((el) => {
        
        if (el.colorName === getById?.color) {
          return el.id
        }
      })?.id)
      setFile(getById?.images)
      setSubCategory(getById?.subCategoryId)
      setCode(uuid())
    }
  }, [getById]);


  const [filesData, setFilesData] = useState([]);

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
    filesData.filter((el) => el.base64 != base64)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <div>
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
            <Typography id="modal-modal-description" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextField
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                label="Color Name" />
            </Typography>
            <Button variant="contained"
              onClick={() => { dispatch(addColor(newColor)), handleClose() }}
            >Save</Button>
          </Box>
        </Modal>
      </div>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Breadcrumbs>
          <Link
            href="/products"
            style={{ display: "flex", alignItems: "center", color: "inherit", textDecoration: "none" }}
          >
            <ArrowBack sx={{ mr: 1, fontSize: 20 }} />
            Products
          </Link>
          <Typography color="text.primary">Update Product</Typography>
        </Breadcrumbs>
        <Box>
          <Button sx={{ mr: 2 }}>Cancel</Button>
          <Button
            onClick={() => editProduct()}
            variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left Column */}
        <Box sx={{ flex: 2 }}>
          {/* Information Section */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Information
          </Typography>
          <Box sx={{ mb: 4 }}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth label="Product name" variant="outlined" sx={{ mb: 2 }} />
            <TextField
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth label="Code" variant="outlined" sx={{ mb: 2 }} />
            {/* Rich Text Editor Toolbar */}
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
              fullWidth multiline rows={4} placeholder="Description" />
          </Box>

          {/* Categories and Brands */}
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <select style={{ width: "50%", height: "50px" }} fullWidth value={categories} onChange={(e) => setCategories(e.target.value)} >
              {productData?.map((el) => {
                return (
                  <option key={el.id} >
                    {el.categoryName}
                  </option>
                )
              })}
            </select>
            <select style={{ width: "50%", height: "50px" }} fullWidth value={subCategory} onChange={(e) => setSubCategory(e.target.value)} >
              {subData?.map((el) => {
                return (
                  <option
                    value={el.id}
                    key={el.id} >
                    {el.subCategoryName}
                  </option>
                )
              })}
            </select>
            <select
              style={{ width: "50%" }}
              fullWidth value={brands}
              onChange={(e) => setBrands(e.target.value)}
              variant="outlined">
              {
                brandData?.map((el) => {
                  return (
                    <option
                      value={el.id}
                      key={el.id} >
                      {el.brandName}
                    </option>
                  )
                })
              }
            </select>
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6" sx={{ mb: 2 }}>
              Price
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                label="Product price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
              />
              <TextField
                label="Discount Price"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end"></InputAdornment>,
                }}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <TextField
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                label="Quantity" type="number" />
            </Box>
            <FormControlLabel control={<Switch />} label="Add tax for this product" />
          </Box>

          {/* Options Section */}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Different Options</Typography>
              <Switch checked={hasOptions} onChange={(e) => setHasOptions(e.target.checked)} />
            </Box>
            {hasOptions && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Size
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    label="Product Size" />
                </Box>
                <Typography
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  variant="subtitle2" sx={{ mb: 1 }}>
                  Weight
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField label="Product Weight" />
                </Box>
                <Button startIcon={<Add />} sx={{ mt: 2 }}>
                  Add more
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          {/* Color Picker */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Colour:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 4 }}>
            {colorData?.map((el) => (
              <Box
                onClick={() => setColor(el.id)}
                key={el.id}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: el.colorName,
                  cursor: "pointer",
                }}
              />
            ))}
            <Button onClick={handleOpen} size="small">Create new</Button>
          </Box>


          {/* Images Upload */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Images
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              borderStyle: "dashed",
              cursor: "pointer",
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <input type="file" multiple={true}
                onChange={(e) => changeFile(e.target.files)}
              />
            </Typography>
            {/* <Typography variant="caption" color="text.secondary">
              PNG, JPG, JPEG or BMP (max. 400x400px)
            </Typography> */}
          </Paper>
          {/* Image Preview List */}
          <Stack spacing={1}>
            {filesData?.map((item) => (
              <Box
                key={item}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Box component="img" src={item.base64} sx={{ width: 40, height: 40, objectFit: "cover" }} />
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {item.fileName}
                </Typography>
                <IconButton size="small">
                  <Delete onClick={() => deleteSelectedImg(item.base64)} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
