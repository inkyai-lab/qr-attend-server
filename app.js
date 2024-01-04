/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path:'.env' });
global.__basedir = __dirname;
const postmanToOpenApi = require('postman-to-openapi');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
// require('./config/db');
const listEndpoints = require('express-list-endpoints');
const passport = require('passport');

let logger = require('morgan');
const { clientPassportStrategy } = require('./config/clientPassportStrategy');
const { adminPassportStrategy } = require('./config/adminPassportStrategy');
const app = express();
const httpServer = require('http').createServer(app);

const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

//template engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(require('./utils/response/responseHandler'));

//all routes 
const routes =  require('./routes');

app.use(require('./middleware/activityLog').addActivityLog);

clientPassportStrategy(passport);
adminPassportStrategy(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

//swagger Documentation
postmanToOpenApi('postman/postman-collection.json', path.join('postman/swagger.yml'), { defaultTag: 'General' }).then(data => {
  let result = YAML.load('postman/swagger.yml');
  result.servers[0].url = '/';
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(result));
}).catch(e=>{
  console.log('Swagger Generation stopped due to some error');
});

app.get('/', (req, res) => {
  res.render('index');
});

const connectDB = async () => {
  try {
    const uri = process.env.NODE_ENV === 'test' ? process.env.DB_TEST_URL : process.env.DB_URL;
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Connect to the database before listening
connectDB().then(() => {
  // Listen to req.
  if (process.env.NODE_ENV !== 'test' ) {
    //jobs configuration
    // require('./jobs');
  
    // const seeder = require('./seeders');
    // const allRegisterRoutes = listEndpoints(app);
    // seeder(allRegisterRoutes).then(()=>{console.log('Seeding done.');});
    // require('./services/socket/socket')(httpServer);
    httpServer.listen(process.env.PORT,()=>{
      console.log(`your application is running on ${process.env.PORT}`);
    });
  } else {
    module.exports = app;
  }
  
});

// if (process.env.NODE_ENV !== 'test' ) {

//   // const seeder = require('./seeders');
//   // const allRegisterRoutes = listEndpoints(app);
//   // seeder(allRegisterRoutes).then(()=>{console.log('Seeding done.');});
//   app.listen(process.env.PORT,()=>{
//     console.log(`your application is running on ${process.env.PORT}`);
//   });
// } else {
//   module.exports = app;
// }
