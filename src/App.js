import Thanks from "./components/Thanks";
import Checkout from "./components/Checkout";
import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import AdminProducts from "./components/AdminProducts";
import AddProduct from "./components/AddProduct";
import AdminDashboard from "./components/AdminDashboard";

export const config = {
  // endpoint: `https://qkart-backend-8sar.onrender.com/api/v1`,
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: Create an Admin dashboard to interactively view and manipulate the backend data. 
      This will be helpful to: 
1. Find out orders by users (helpful for Customer Support)
2. Add and edit product details (helpful for Inventory management)*/}
      <Switch>
        <Route exact path="/" component={Products} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />

        <Route path="/admin" component={AdminProducts} />
        <Route path="/addProduct" component={AddProduct} />
        <Route path="/dashboard" component={AdminDashboard} />
      </Switch>
    </div>
  );
}

export default App;
