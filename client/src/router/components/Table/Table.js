import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import filterFactory from 'react-bootstrap-table2-filter'
import paginationFactory from 'react-bootstrap-table2-paginator'
import overlayFactory from 'react-bootstrap-table2-overlay'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'

import { expandRow } from './helpers'
import OverlayTable from './OverlayTable'
// import ExportExcel from './ExportExcel'
// import { isEmpty } from './../../util/crud'

const { SearchBar } = Search
const overlaySpinner = overlayFactory({
  spinner: true,
  background: 'rgba(192,192,192,0.3)'
})

class Table extends Component {
  render() {
    return (
      <ToolkitProvider
        keyField='_id'
        search={{ searchFormatted: true }}
        data={this.props.data}
        columns={this.props.structure}
        bootstrap4>
        {props => (
          <div className='w-100'>
            {/* {this.props.enableExport &&
              !isEmpty(this.props.columnsToExport) &&
              !isEmpty(this.props.data) && <ExportExcel {...this.props} />} */}
            {this.props.searchBar && (
              <SearchBar
                {...props.searchProps}
                placeholder='Barra de búsqueda'
                className='w-100'
              />
            )}
            <BootstrapTable
              {...props.baseProps}
              rowEvents={this.props.rowEvents}
              noDataIndication={() => <OverlayTable loading={this.props.loading} />}
              pagination={paginationFactory()}
              expandRow={this.props.expand && this.props.expandableRow}
              wrapperClasses='table-responsive'
              overlay={overlaySpinner}
              filter={filterFactory()}
              loading={this.props.loading}
              bordered
              hover
            />
          </div>
        )}
      </ToolkitProvider>
    )
  }
}

Table.defaultProps = {
  data: [],
  structure: [],
  expand: true,
  loading: false,
  searchBar: true,
  enableExport: true,
  expandableRow: expandRow,
  columnsToExport: []
}

export default Table
