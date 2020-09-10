## Controllers
They call the services, which contain more “pure” business logic. But by themselves,controllers don’t really contain any logic other than handling the request and calling services. The services do most of the work, while the controllers orchestrate the service calls and decide what to do with the data returned.

### Example

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