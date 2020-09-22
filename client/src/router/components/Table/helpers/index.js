import React, { Fragment } from 'react'
import { isEmpty } from './../../../util/crud'
import { mdy } from './../../../util/dates'

export const generateActiveIcon = value => {
  const icon = value ? 'icon-check-square' : 'icon-times'
  const color = value ? '#43d087' : '#ef6462'
  return (
    <i
      className={`${icon} d-flex justify-content-center`}
      style={{ fontSize: '1.35rem', color }}
    />
  )
}

export const CSVButton = props => {
  const handleClick = () => {
    props.onExport()
  }
  return (
    <Fragment>
      <button className='btn btn-success' style={{ float: 'right' }} onClick={handleClick}>
        <i className='fas fa-save' /> Exportar en CSV
      </button>
    </Fragment>
  )
}

// Subrow for react-bootstrap-table2
export const expandRow = {
  // Subtable that show the cause, description, date and the user's name
  // of a modification in a certain record
  renderer: row =>
    !isEmpty(row.detail) && (
      <table style={{ width: '100%', backgroundColor: 'whitesmoke' }}>
        <thead>
          <tr>
            <th>Causa</th>
            <th>Justificación</th>
            <th>Fecha</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {row.detail
            .filter(r => !isEmpty(r))
            .reverse()
            .map((change, index) => (
              <tr>
                <td data-label={`Causa #${index + 1}`}>{change.cause}</td>
                <td data-label='Justificación'>{change.description}</td>
                <td data-label='Fecha'>{mdy(change.createdAt)}</td>
                <td data-label='Usuario'>
                  {!isEmpty(change.createdBy)
                    ? `${change.createdBy.name} ${change.createdBy.lastName}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    ),
  onlyOneExpanding: true,
  showExpandColumn: true,
  expandByColumnOnly: true,
  expandHeaderColumnRenderer: () => null,
  expandColumnRenderer: ({ expanded }) =>
    expanded ? (
      <i className='icon-chevron-up' style={{ color: '#bac2c8' }} />
    ) : (
      <i className='icon-chevron-down' style={{ color: '#bac2c8' }} />
    )
}
