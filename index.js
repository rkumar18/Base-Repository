

const adminModule = require('./routes/admin');
const retailerModule = require('./routes/retailer');
const uploadModule = require('./routes/uploads');

app.use('/admin', adminModule.adminRouter);
app.use('/retailer', retailerModule.retailerRouter);
app.use('/upload', uploadModule.uploadRouter);
