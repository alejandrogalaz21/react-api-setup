import Group from './../models/group'

// Get Groups documents based on query
export async function getGroup(query, select) {
	const result = await Group.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.select(select)
		.lean()
	return result
}

// Get Group documents based on query
export async function getGroupDetail(query) {
	const result = await Group.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()
	return result
}

// Get the count of partners in each club filtering by institution
// The return data is formatted based on the chart.js 2 API
export async function getGroupChart(institution) {
  const data = await Group.find()
    .populate({ path: 'partners', match: { institution: institution._id } })
    .lean()

  const groups = data.sort((a, b) => b.partners.length - a.partners.length)

  const result = {
    institution,
    data: {
      labels: groups.map(group => group.name),
      datasets: [
        {
          label: 'Socios',
          backgroundColor: groups.map(group => group.color),
          borderWidth: 1,
          fillColor: groups.map(group => group.color),
          data: groups.map(group => group.partners.length)
        }
      ]
    }
  }

  return result
}
