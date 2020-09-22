import React from 'react'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
// import BasicCard from './../Card/BasicCard'

export function LightTable({ data, columns, label, className, button, ...props }) {
  return (
    <div className={className}>
      {/* <BasicCard header={label} button={button}></BasicCard> */}
      <BootstrapTable
        keyField='_id'
        hover
        condensed
        bootstrap4
        data={data}
        classes='mb-2'
        columns={columns}
        wrapperClasses='table-responsive'
        pagination={paginationFactory({ sizePerPage: 5 })}
        noDataIndication={<NoData />}
        {...props}
      />
      {/* </BasicCard> */}
    </div>
  )
}

LightTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  url: PropTypes.string,
  button: PropTypes.node
}

const NoData = () => <h5 className='text-center'>Sin datos disponibles</h5>
