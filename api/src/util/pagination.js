/**
 * Paginate results based on the size rate, the current page,
 * and obtaining the data from a Mongoose model.
 * @param   {object}  model   Mongoose model
 * @param   {number}  size    the rate of results length per page
 * @param   {number}  page    the current page
 */
function pagination(model) {
  return async function({ size, page }) {
    try {
      size = parseInt(size)
      page = parseInt(page)

      if (page <= 0 || size <= 0) {
        return {
          sizePerPage: 0,
          page: 0,
          pages: 0,
          result: [],
          totalResults: 0
        }
      }

      // Count the total results
      const totalResults = await model.countDocuments()

      // # of pages based on the total results and the rate
      // of results per page
      const pages = Math.ceil(totalResults / size)

      // If the page is over the limit, it is set to the last page
      if (page >= pages) page = pages

      // Limit the returned results to the current page limit
      const result = await model
        .find()
        .skip(size * page - size)
        .limit(size)

      const docs = {
        sizePerPage: size,
        page,
        pages,
        result,
        totalResults
      }
      return docs
    } catch (error) {
      throw new Error('Error while paginating: ' + error)
    }
  }
}

export default pagination
