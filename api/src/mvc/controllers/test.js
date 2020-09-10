import * as test from './../dal/test'

/**
 * @params     req, res, next
 * @desc
 */
export const index = async (req, res, next) => {
  try {
    const result = await test.getAllTest()
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params     req, res, next
 * @desc
 */
export const show = async (req, res, next) => {
  try {
    const result = await test.showTest(req)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params     req, res, next
 * @desc
 */
export const create = async (req, res, next) => {
  try {
    const result = await test.createTest(req)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
