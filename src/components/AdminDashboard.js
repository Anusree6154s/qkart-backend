import AdminHeader from "./AdminHeader";
import Footer from "./Footer";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import axios from "axios";
import { config } from "../App";

//sidebar
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

//table
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Toolbar from "@mui/material/Toolbar";

//sidebar
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function Row(props) {
  const { row, display, index } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      {display === "orders" ? (
        <TableRow>
          <TableCell sx={{ borderBottom: "unset" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" sx={{ borderBottom: "unset" }}>
            {row["Sr.No"]}
          </TableCell>
          <TableCell component="th" scope="row" sx={{ borderBottom: "unset" }}>
            {row["Order ID"]}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            {row["No.of Products"]}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            ${row["Total Amount"]}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            {row["Order Date"]}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            {row["Shipping Address"]}
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell sx={{ borderBottom: "unset" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" sx={{ borderBottom: "unset" }}>
            {index}
          </TableCell>
          <TableCell component="th" scope="row" sx={{ borderBottom: "unset" }}>
            {row.username}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            {row.orders.length}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            {row.addresses.length}
          </TableCell>
          <TableCell align="right" sx={{ borderBottom: "unset" }}>
            ${row.balance}
          </TableCell>
        </TableRow>
      )}
      {display === "orders" ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit align="right">
              <Box sx={{ width: "94%" }} align="left">
                <Table size="small" aria-label="purchases ">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Sr.No
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Product Name
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Product Category
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Total Price
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Rating (stars)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.Products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {product["Sr.No"]}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {product.name}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {product.category}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          ${product.cost}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {product.rating}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={open} timeout="auto" unmountOnExit align="right">
              <Box sx={{ width: "88%" }} align="left">
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Sr.No
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "#616161",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Addresses
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.addresses.map((address, index) => (
                      <TableRow key={index}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "unset",
                            color: "grey",
                            fontSize: "12px",
                          }}
                        >
                          {address.address}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

export default function AdminDashboard() {
  //sidebar
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [display, setDisplay] = React.useState("orders");

  //table

  React.useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      let res = await axios.get(`${config.endpoint}/user`);
      // console.log(res.data);
      setUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchProducts() {
    try {
      let res = await axios.get(`${config.endpoint}/products`);
      // console.log(res.data);
      setProducts(res.data);
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    function findProducts(order) {
      let productArray = [];
      let index = 1;
      order.forEach((product) => {
        let data = products.find((item) => item._id === product.productId);
        productArray.push({
          "Sr.No": index++,
          name: data.name,
          category: data.category,
          cost: data.cost,
          rating: data.rating,
        });
      });
      return productArray;
    }

    function fetchOrders() {
      let ordersData = [];
      let index = 1;
      users.forEach((user) =>
        user.orders.forEach((order) => {
          ordersData.push({
            "Sr.No": index,
            "Order ID": order._id,
            "No.of Products": order.order.length,
            "Order Date": order.date,
            "Total Amount": order.amount,
            "Shipping Address": order.address.address,
            Products: findProducts(order.order),
          });
          index++;
        })
      );
      setOrders(ordersData);
    }
    if (users.length && products.length) fetchOrders();
  }, [users, products]);

  let rows = display === "orders" ? orders : users;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AdminHeader hiddenButtons="true" dashboard={true} />
      <Box sx={{ display: "flex", backgroundColor: "#e9f5e1" }}>
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            style: {
              top: "9%",
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => setDisplay("orders")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Inventory2OutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Orders" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => setDisplay("users")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Toolbar
              sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
                color="#3C3C3C"
              >
                {display === "orders" ? "Orders" : "Users"}
              </Typography>
            </Toolbar>
            <Paper sx={{ width: "95%", mb: 2 }}>
              {display === "orders" ? (
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell sx={{ fontWeight: "bold" }}>Sr.No</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Order ID
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          No.of Products
                        </TableCell>

                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Order Amount
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Order Date
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Shipping Address
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <Row
                          key={index}
                          row={row}
                          display={display}
                          index={index + 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell sx={{ fontWeight: "bold" }}>Sr.No</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          No.of Orders
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          No.of Addresses
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Balance
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <Row
                          key={index}
                          row={row}
                          display={display}
                          index={index + 1}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
