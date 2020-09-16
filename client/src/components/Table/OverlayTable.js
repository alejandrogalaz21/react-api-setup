import React from 'react'

export default function OverlayTable(props) {
  return (
    <div>{props.loading ? <h6>Cargando datos...</h6> : <h6>Sin datos disponibles</h6>}</div>
  )
}
