const bodyParser = require('body-parser');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT ||4000;
const productRoter= require('./routers/productRoute');
const authRoter = require('./routers/authRoute.js');
const blogRouter = require('./routers/blogRoute');
const categoryRouter = require('./routers/categoryProductRoute');
// const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require('./routers/brandRoute');
const colorRouter = require('./routers/colorRoute');
const cartRoute = require('./routers/cartRoute');
const orderRoute = require('./routers/orderRoute');
const couponRoute = require('./routers/couponRoute')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');


app.use(cookieParser());
dbConnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




app.use('/api/user',authRoter);
app.use('/api/product',productRoter)
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRouter);
app.use("api/cart",cartRoute);
app.use("api/order",orderRoute);
app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running  at PORT ${PORT}`);
});
