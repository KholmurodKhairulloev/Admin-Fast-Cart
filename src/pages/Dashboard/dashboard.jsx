import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { styled } from "@mui/material/styles"

// Sample data
const chartData = [
  { month: "Jan", orders: 150 },
  { month: "Feb", orders: 200 },
  { month: "Mar", orders: 180 },
  { month: "Apr", orders: 250 },
  { month: "May", orders: 854 },
  { month: "Jun", orders: 680 },
  { month: "Jul", orders: 550 },
  { month: "Aug", orders: 450 },
  { month: "Sep", orders: 380 },
  { month: "Oct", orders: 350 },
  { month: "Nov", orders: 450 },
  { month: "Dec", orders: 400 },
]

const recentTransactions = [
  { name: "Jaganath S.", date: "24.05.2023", amount: 124.97, status: "Paid" },
  { name: "Anand G.", date: "23.05.2023", amount: 55.42, status: "Pending" },
  { name: "Kartik S.", date: "23.05.2023", amount: 88.9, status: "Paid" },
  { name: "Balesh S.", date: "22.05.2023", amount: 144.84, status: "Pending" },
  { name: "Anup S.", date: "22.05.2023", amount: 70.52, status: "Paid" },
  { name: "Jimmy P.", date: "22.05.2023", amount: 70.52, status: "Paid" },
]

const topProducts = [
  { name: "Men Grey Hoodie", price: 49.9, units: 204 },
  { name: "Women Striped T-Shirt", price: 34.9, units: 155 },
  { name: "White White T-Shirt", price: 40.9, units: 120 },
  { name: "Men White T-shirt", price: 49.9, units: 204 },
  { name: "Women Red T-Shirt", price: 34.9, units: 155 },
]

const topSellingProducts = [
  { name: "Healthcare Etiology", category: "Accessories", sales: "13,153 in sales" },
  { name: "Healthcare Etiology", category: "Accessories", sales: "13,153 in sales" },
  { name: "Healthcare Etiology", category: "Accessories", sales: "13,153 in sales" },
  { name: "Healthcare Etiology", category: "Accessories", sales: "13,153 in sales" },
  { name: "Healthcare Etiology", category: "Accessories", sales: "13,153 in sales" },
]

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}))

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Metrics Cards */}
        <Grid item xs={12} sm={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sales Revenue
              </Typography>
              <Typography variant="h4" component="div">
                $152k
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Sales
              </Typography>
              <Typography variant="h4" component="div">
                $99.7k
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={4}>
          <StyledCard>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Profit
              </Typography>
              <Typography variant="h4" component="div">
                $32.1k
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Sales Revenue
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#2196f3" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400, overflow: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Top selling products</Typography>
              <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                See All
              </Typography>
            </Box>
            <List>
              {topSellingProducts.map((product, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar variant="rounded">{product.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={product.name} secondary={product.category} />
                  <Typography variant="body2" color="textSecondary">
                    {product.sales}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={transaction.status === "Paid" ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Top Products by Units */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Products by Units Sold
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Units</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.units}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

