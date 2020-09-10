import * as input from './../dal/input'

/**
 * @params     req, res
 * @desc       retrieve all partner records based on ID or name
 */
export const getAutocompletePartner = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAutocompletePartner(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       retrieve all book records based on its title
 */
export const getAutocompleteBook = async (req, res) => {
  try {
    const result = await input.getAutocompleteBook(req.query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       retrieve all events records based on its title
 */
export const getAllValidEvent = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllValidEvent(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active area records
 */
export const getAllAreas = async (req, res) => {
  try {
    const result = await input.getAllAreas()
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active category records
 */
export const getAllCategory = async (req, res) => {
  try {
    const query = { ...req.query, ...req.params }
    const result = await input.getAllCategory(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active school records
 */
export const getAllSchool = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllSchool(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active group records
 */
export const getAllGroup = async (req, res) => {
  try {
    const result = await input.getAllGroup()
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active institution records
 */
export const getAllInstitution = async (req, res) => {
  try {
    const result = await input.getAllInstitution(req.user._id, req.query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active user records
 */
export const getAllUser = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllUser(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active user collaborator records
 */
export const getAllUserCollaborator = async (req, res) => {
  try {
    const query = req.filterQuery
    const collaborators = await input.getAllUserCollaborator(query)
    const result = collaborators.filter(user => user.position !== null)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export const getAllPartner = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllPartner(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active program records
 */
export const getAllProgram = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllProgram(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active bookLocation records
 */
export const getAllBookLocation = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllBookLocation(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active position records
 */
export const getAllPosition = async (req, res) => {
  try {
    const query = { ...req.query, ...req.params }
    const result = await input.getAllPosition(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active cycle records
 */
export const getAllCycle = async (req, res) => {
  try {
    const query = { ...req.query, ...req.params }
    const result = await input.getAllCycle(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active assignmentTutor records
 */
export const getAllAssignmentTutor = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllAssignmentTutor(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active assignmentTutor records
 */
export const getAssignmentTutor = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAssignmentTutor(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active schedule records
 */
export const getAllSchedule = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllSchedule(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter the position whose evaluation is not submitted
 */
export const getAllNotEvaluatedPosition = async (req, res) => {
  try {
    const query = req.filterQuery
    const data = await input.getAllNotEvaluatedPosition(query)
    const result = data.filter(position => position.users.length > 0)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active dropout records
 */
export const getAllDropout = async (req, res) => {
  try {
    const result = await input.getAllDropout()
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active modules records
 */
export const getAllModules = async (req, res) => {
  try {
    const query = { ...req.query, ...req.params }
    const result = await input.getAllModules(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}

/**
 * @params     req, res
 * @desc       Filter active classroom records
 */
export const getAllClassroom = async (req, res) => {
  try {
    const query = req.filterQuery
    const result = await input.getAllClassroom(query)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json(error)
  }
}
