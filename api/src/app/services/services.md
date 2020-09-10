## Services
contain the majority of your business logic: – logic that encapsulates your business requirements, calls your data access layer or models, calls API’s external to the Node application. And in general, contains most of your algorithmic code.

```

const { blogService } = require('../services')
 
const { createBlogpost } = blogService
 
/*
 * call other imported services, or same service but different functions here if you need to
*/
const postBlogpost = async (req, res, next) => {
  const {user, content} = req.body
  try {
    await createBlogpost(user, content)
    // other service call (or same service, different function can go here)
    // i.e. - await generateBlogpostPreview()
    res.sendStatus(201)
    next()
  } catch(e) {
    console.log(e.message)
    res.sendStatus(500) && next(error)
  }
}
 
module.exports = {
  postBlogpost
}
```
You can certainly call external API’s from within your controllers as well, but think about if that API is returning something that should be part of a “unit”. Services should ultimately return a cohesive resource, and so if what that external API call returns is needed to augment your business logic, keep the logic there.

For example, if part of creating the blogpost was also posting the link to Twitter (an external API call), you would put it in the service above.

## Use only the built-in Error object

The permissive nature of JavaScript along with its variety of code-flow options (e.g. EventEmitter, Callbacks, Promises, etc) pushes to great variance in how developers raise errors – some use strings, other define their own custom types. Using Node.js built-in Error object helps to keep uniformity within your code and with 3rd party libraries, it also preserves significant information like the StackTrace. When raising the exception, it’s usually a good practice to fill it with additional contextual properties like the error name and the associated HTTP error code. To achieve this uniformity and practices, consider extending the Error object with additional properties, see code example below.

```
// throwing an Error from typical function, whether sync or async
if(!productToAdd)
    throw new Error("How can I add new product when no value provided?");

// 'throwing' an Error from EventEmitter
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));

// 'throwing' an Error from a Promise
const addProduct = async (productToAdd) => {
  try {
    const existingProduct = await DAL.getProduct(productToAdd.id);
    if (existingProduct !== null) {
      throw new Error("Product already exists!");
    }
  } catch (err) {
    // ...
  }
}
```

## Code example – doing it even better

```
// centralized error object that derives from Node’s Error
function AppError(name, httpCode, description, isOperational) {
    Error.call(this);
    Error.captureStackTrace(this);
    this.name = name;
    //...other properties assigned here
};

AppError.prototype.__proto__ = Error.prototype;

module.exports.AppError = AppError;

// client throwing an exception
if(user == null)
    throw new AppError(commonErrors.resourceNotFound, commonHTTPErrors.notFound, "further explanation", true)
  ```