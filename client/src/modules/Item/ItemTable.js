import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import DataTable from './../../components/Table/Table'
import { itemReadManyRequest, itemEdit } from './item.redux'
import moment from 'moment'

export const ItemTable = ({ items, ...props }) => {
  function handleRowEvents() {
    return {
      onClick: (e, r) => props.itemEdit(r.id)
    }
  }

  function formatDate(date) {
    return moment(date).format('D/MM/YYYY, h:mm:ss a')
  }

  function isActive(cell) {
    return cell ? 'ok' : 'x'
  }

  useEffect(() => {
    props.readMany()
  }, [])

  const columns = [
    { dataField: 'name', text: 'Nombre', sort: true },
    {
      dataField: 'createdAt',
      text: 'Creado',
      sort: true,
      formatter: formatDate
    },
    {
      dataField: 'updatedAt',
      text: 'Actualizado',
      sort: true,
      formatter: formatDate
    },
    {
      dataField: 'isActive',
      text: 'Status',
      sort: true,
      formatter: isActive
    }
  ]

  const columnsToExport = []

  return (
    <div className='row'>
      <DataTable
        rowEvents={handleRowEvents}
        data={ items }
        structure={columns}
        tableName='items'
      />
    </div>
  )
}

const mapStateToProps = state => ({
  items: state.items.many
})

const mapDispatchToProps = { readMany: itemReadManyRequest, itemEdit }

export default connect(mapStateToProps, mapDispatchToProps)(ItemTable)