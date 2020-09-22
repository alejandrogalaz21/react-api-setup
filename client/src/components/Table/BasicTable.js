import React from 'react'
import OverlayTable from './TableOverlay'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory from 'react-bootstrap-table2-filter'
import overlayFactory from 'react-bootstrap-table2-overlay'

const overlaySpinner = overlayFactory({
  spinner: true,
  background: 'rgba(192,192,192,0.3)'
})

export default function BasicTable(props) {
  const {
    data = [], // Table's data
    columns = [] // Columns structure
  } = props

  return (
    <BootstrapTable
      bordered
      hover
      {...props}
      data={data}
      columns={columns}
      {...props.baseProps}
      rowEvents={props.rowEvents}
      noDataIndication={() => <OverlayTable loading={props.loading} />}
      pagination={props.pagination}
      expandRow={props.expand && props.expandableRow}
      wrapperClasses='table-responsive'
      overlay={overlaySpinner}
      filter={filterFactory()}
      loading={props.loading}
    />
  )
}
