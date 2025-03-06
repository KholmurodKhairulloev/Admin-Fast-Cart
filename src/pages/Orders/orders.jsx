"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";
import { Add, Search, Edit } from "@mui/icons-material";

const orders = [
  {
    id: "#125128",
    date: "May 5, 4:20 PM",
    customer: "Tom Anderson",
    paymentStatus: "Paid",
    orderStatus: "Ready",
    total: 49.9,
  },
  {
    id: "#12523C",
    date: "May 5, 4:15 PM",
    customer: "Jayden Walker",
    paymentStatus: "Paid",
    orderStatus: "Ready",
    total: 34.36,
  },
  {
    id: "#51232A",
    date: "May 5, 4:15 PM",
    customer: "Inez Kim",
    paymentStatus: "Paid",
    orderStatus: "Ready",
    total: 5.51,
  },
  {
    id: "#23534D",
    date: "May 5, 4:12 PM",
    customer: "Francisco Henry",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    total: 29.74,
  },
];

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(orders.map((order) => order.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((item) => item !== id);
    }

    setSelected(newSelected);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready":
        return "warning";
      case "Shipped":
        return "default";
      case "Received":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Orders</Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ textTransform: "none" }}>
          Add order
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: "text.secondary", mr: 1 }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        <Select size="small" value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="Newest">Newest</MenuItem>
          <MenuItem value="Oldest">Oldest</MenuItem>
          <MenuItem value="Total">Total</MenuItem>
        </Select>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < orders.length}
                  checked={orders.length > 0 && selected.length === orders.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <TableRow key={order.id} hover selected={selected.includes(order.id)}>
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.includes(order.id)} onChange={() => handleSelect(order.id)} />
                </TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Chip
                    label={order.paymentStatus}
                    size="small"
                    color={order.paymentStatus === "Paid" ? "success" : "default"}
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.orderStatus}
                    size="small"
                    color={getStatusColor(order.orderStatus)}
                    sx={{ minWidth: 80 }}
                  />
                </TableCell>
                <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                <TableCell padding="checkbox">
                  <IconButton size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Stack direction="row" spacing={1}>
          {[1, 2, 3, 4, 5, 6].map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page + 1 ? "contained" : "text"}
              size="small"
              onClick={() => setPage(pageNum - 1)}
              sx={{ minWidth: "auto" }}
            >
              {pageNum}
            </Button>
          ))}
          <Typography variant="body2">...</Typography>
          <Button variant="text" size="small" onClick={() => setPage(23)} sx={{ minWidth: "auto" }}>
            24
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          274 Results
        </Typography>
      </Box>
    </Paper>
  );
}
