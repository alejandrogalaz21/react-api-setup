import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import DataTable from './../Table/Table'
import { productReadManyRequest, productEdit } from './product.redux'
import moment from 'moment'

export const ProductTable = ({ products, ...props }) => {
  useEffect(() => {
    props.readMany()
  }, [])
  const columns = [
    { dataField: 'name', text: 'Nombre', sort: true },
    {
      dataField: 'createdAt',
      text: 'Creado',
      sort: true,
      formatter: (cell, row) => moment(cell).format('D/MM/YYYY, h:mm:ss a')
    },
    {
      dataField: 'updatedAt',
      text: 'Actualizado',
      sort: true,
      formatter: (cell, row) => moment(cell).format('D/MM/YYYY, h:mm:ss a')
    }
  ]

  const columnsToExport = []

  return (
    <div className='row'>
      <DataTable
        rowEvents={{
          onClick: (e, r) => props.productEdit(r.id)
        }}
        data={products}
        structure={columns}
        tableName='Products'
      />
    </div>
  )
}

const mapStateToProps = state => ({
  products: state.products.many
})

const mapDispatchToProps = { readMany: productReadManyRequest, productEdit }

export default connect(mapStateToProps, mapDispatchToProps)(ProductTable)
