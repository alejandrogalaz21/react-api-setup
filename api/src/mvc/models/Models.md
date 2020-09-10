## Data Access Layer/Models
In the code above, rather than set up a full database connection, I just pseudo-coded it but adding it is easy enough. When you have your logic isolated like this, it’s easy to keep it limited to just data access code.

If it’s not obvious, “Data Access Layer” means the layer that contains your logic for accessing persistent data. This can be something like a database, a Redis server, Elasticsearch, etc. So whenever you need to access such data, put that logic here.

“Models” is the same concept but used as part of an ORM.

Even though both are different they contain the same type of logic, which is why I recommend putting either kind in a db folder so that its general enough. Whether you’re using models from an ORM or you’re using a query builder or raw SQL, you can put the logic there without changing the name of directory.

### Example
```
const blogpostDb = (user, content) => {
  /*
   * put code to call database here
   * this can be either an ORM model or code to call the database through a driver or querybuilder
   * i.e.-
    INSERT INTO blogposts (user_name, blogpost_body)
    VALUES (user, content);
  */
  return 1 //just a dummy return as we aren't calling db right now
}
 
module.exports = {
  blogpostDb
}
```
