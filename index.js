

const restaurantModule = require('./routes/restaurant');
const retailerModule = require('./routes/retailer');
const uploadModule = require('./routes/uploads');

app.use('/restaurant', restaurantModule.restaurantRouter);
app.use('/retailer', retailerModule.retailerRouter);
app.use('/upload', uploadModule.uploadRouter);
