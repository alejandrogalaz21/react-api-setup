import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import DataTable from './../../components/Table/Table'
import { productReadManyRequest, productEdit } from './product.redux'
import moment from 'moment'

export const ProductTable = ({ products, ...props }) => {
  function handleRowEvents() {
    return {
      onClick: (e, r) => props.productEdit(r.id)
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
        rowEvents={handleRowEvents()}
        data={ products }
        structure={columns}
        tableName='products'
      />
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.many
})

const mapDispatchToProps = { readMany: productReadManyRequest, productEdit }

export default connect(mapStateToProps, mapDispatchToProps)(ProductTable)