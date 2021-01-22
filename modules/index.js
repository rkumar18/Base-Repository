

const userModule = require('./user');
const superAdminModule = require('./superAdmin');

app.use('/user', userModule.userRouter);
app.use('/superAdmin', superAdminModule.superAdminRouter);
