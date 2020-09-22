import React, { Component } from 'react'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Button } from 'reactstrap'
import { getSafe, generateMatrix } from '../../util/helpers'

// IDEA: Add deep property with safe object navigation
export default class ExportExcel extends Component {
  //* Entry poin to save the xlsx
  exportToXLSX = () => {
    let { tableName = '', columnsToExport, data } = this.props
    // let sheetName = tableName.substring(0, 30).replace(/[^\w\s]/gi, '')
    let sheetName = 'Reporte'

    // Create a new workbook
    let wb = XLSX.utils.book_new()
    // Add metadata
    wb.Props = {
      Title: tableName,
      Subject: 'Reporte',
      Author: 'Sistema CNYNL',
      CreatedDate: new Date()
    }

    // Get the formatted data
    let ws_data = this.formatDataWB(data, columnsToExport)
    // Add the main sheet
    wb.SheetNames.push(sheetName)
    // Insert the data on the main sheet
    let ws = XLSX.utils.aoa_to_sheet(ws_data)
    wb.Sheets[sheetName] = ws
    // Write the entire workbook
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
    // Save it locally
    this.saveExcel(wbout)
  }

  //* Encode the characters and convert them to a buffer
  s2ab = s => {
    let buf = new ArrayBuffer(s.length)
    let view = new Uint8Array(buf)
    // Encode to octet-stream type
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  //* Use File Saver to locally save the workbook
  saveExcel = wbout => {
    const content = [this.s2ab(wbout)]
    const settings = { type: 'application/octet-stream' }
    const fileName = `${this.props.tableName || 'Registros'}.xlsx`

    return saveAs(new Blob(content, settings), fileName)
  }

  //* Format the array into a matrix 2x2 (rows x columns)
  formatDataWB = (data, columns) => {
    // Intialize headers and content arrays
    const headers = columns.map(column => column.title)
    const content = generateMatrix(data.length, columns.length)

    // Iteratively fill the workbook, column by column
    columns.forEach((column, i1) => {
      data.forEach((row, i2) => {
        const { value } = column
        // Apply the formatter function or acces the plain property
        const cell = typeof value === 'function' ? getSafe(() => value(row)) : row[value]
        //? Insert the value of the cell in the current position of the matrix
        content[i2][i1] = cell
      })
    })

    const result = [headers, ...content]
    return result
  }

  render() {
    return (
      <Button
        className='float-right'
        style={{ marginRight: '.8%' }}
        color='success'
        onClick={this.exportToXLSX}
        disabled={this.props.loading}>
        <i className='icon-file-excel-o mr-2' style={{ verticalAlign: 'text-bottom' }} />
        Exportar a Excel
      </Button>
    )
  }
}
