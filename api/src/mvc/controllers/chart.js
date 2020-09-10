import Fee from './../models/fee'
import User from './../models/user'
import Access from './../models/access'
import Institution from './../models/institution'
import { populate as accessPopulate } from './access'
import { populate as feePopulate } from './fee'
import { getGroupChart } from './../queries/group.report'
import { getPartnerBirthdays } from './../queries/partner.report'

//  Get count of partners by group
export const getPartnersByGroups = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const group = await getGroupChart(institution)
      result.push(group)
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// NOT USED: Get fees grouped and sum up total by concept
export const getFeeByConcept = async (req, res) => {
  try {
    const query = { ...req.query, ...req.params }
    const result = getFeeByConcept(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

//  Get last fee's records
export const getLastFees = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const fees = await Fee.find({ institution })
        .populate(feePopulate)
        .select('-detail')
        .sort({ updatedAt: -1 })
        .limit(10)
      result.push({ data: fees, institution })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

//  Get last access' records
export const getLastAccesses = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const accesses = await Access.find({ institution })
        .populate(accessPopulate)
        .select('partner date entry exit detail')
        .sort({ date: -1 })
        .limit(10)
      result.push({ data: accesses, institution })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Return partners whose birthday are in a specific month
export const getPartnersBirthdays = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)
    const month = new Date().getMonth() + 1

    for (const institution of institutions) {
      const birthdays = await getPartnerBirthdays(month, institution)
      result.push({ data: birthdays, institution })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Function to get all institutions the user has access
export async function getInstitutionsByUser(user) {
  const query = { active: true }
  const doc = await User.findById(user._id)

  if (doc.role !== 0) query._id = { $in: doc.institutions }
  const institutions = await Institution.find(query)

  return institutions
}
