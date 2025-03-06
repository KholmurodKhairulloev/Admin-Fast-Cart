"use client"

import { useState } from "react"
import { Box, Typography, TextField, Button, IconButton, InputAdornment, Link as MuiLink } from "@mui/material"
import { Visibility, VisibilityOff, ShoppingCart } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import {useDispatch} from 'react-redux'
import { loginAdmin } from "../../apis/authApi"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
const [userName,setUserName]=useState("")
const [password,setPassword]=useState("")
const nav=useNavigate()
const dispatch=useDispatch()


// let login =useSelector((store)=>store.login.)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Left Side - Gradient Background */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          padding: 6,
          background: "linear-gradient(135deg, #1a2942 0%, #121b2f 100%)",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome to admin panel
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCart sx={{ fontSize: 32 }} />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: "2rem",
              color: "white",
            }}
          >
            fastcart
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 6,
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
          <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
            Log in
          </Typography>

          <div onClick={handleSubmit}>
            <TextField
              fullWidth
              label="User Name"
              variant="outlined"
              margin="normal"
              value={userName}
              onChange={(e)=>setUserName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ textAlign: "right", mb: 2 }}>
              <MuiLink href="#" underline="hover" sx={{ color: "primary.main" }}>
                Forgot password?
              </MuiLink>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                py: 1.5,
              }}
              onClick={()=>{dispatch(loginAdmin({
                userName:userName,
                password:password
              })),nav("/")}}
            >
              Log in
            </Button>
          </div>
        </Box>
      </Box>
    </Box>
  )
}
