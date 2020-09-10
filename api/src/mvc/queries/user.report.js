import User from './../models/user'

// Get users documents based on query
export async function getUsers(query) {
  const result = await User.find(query)
    .sort({ updatedAt: -1 })
    .populate('institutions', 'name')
    .populate('position', 'name')
    .populate('thumbnail', 'path')
    .populate('detail.created_by', 'name lastName')
    .lean()

  return result
}

// Get user documents based on query
export async function getUser(query) {
  const result = await User.findOne(query)
    .populate('institutions', 'name')
    .populate('thumbnail', 'path')
    .populate('position', 'name')
    .populate('created_by updated_by', 'name lastName')
    .populate({
      path: 'permissions.permissions',
      populate: { path: 'module', select: '-detail' },
      select: '-user'
    })
    .populate({
      path: 'permissions.institution',
      select: '-detail'
    })
    .lean()

  return result
}
