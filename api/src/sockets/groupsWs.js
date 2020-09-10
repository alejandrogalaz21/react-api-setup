import { io } from './../server'
import Group from './../mvc/models/group'
// import PartnerClub from './../mvc/models/partnerClub'

const populate = [
  {
    path: 'partners',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @param {*} socket
 * @description function tu use in the main ws.
 */
export async function subscribeToGroups(socket) {
  socket.on('SUBSCRIBE_GROUPS', async () => {
    // const data = await PartnerClub.aggregate([
    //   {
    //     $group: { _id: '$group', count: { $sum: 1 } }
    //   },
    //   {
    //     $project: {
    //       count: 1,
    //       _id: 1
    //     }
    //   }
    // ])
    // const result = data.map(async g => {
    //   const group = await Group.findById(g._id).select('name color -_id')
    //   const add = { ...g, ...group._doc }
    //   return add
    // })
    // const r = await Promise.all(result)
    // const payload = r.reduce(groupsDoughnutChart, groupObject)
    // socket.emit('GROUPS', payload)
  })
}

const groupObject = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }
  ]
}

export function groupsDoughnutChart(p, c) {
  return {
    labels: [...p.labels, c.name],
    datasets: [
      {
        data: [...p.datasets[0].data, c.count],
        backgroundColor: [...p.datasets[0].backgroundColor, c.color],
        hoverBackgroundColor: [...p.datasets[0].hoverBackgroundColor, c.color]
      }
    ]
  }
}
