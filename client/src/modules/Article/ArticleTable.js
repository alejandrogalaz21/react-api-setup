import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import DataTable from './../../components/Table/Table'
import { articleReadManyRequest, articleEdit } from './article.redux'
import moment from 'moment'

export const ArticleTable = ({ articles, ...props }) => {
  function handleRowEvents() {
    return {
      onClick: (e, r) => props.articleEdit(r.id)
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
        data={ articles }
        structure={columns}
        tableName='articles'
      />
    </div>
  )
}

const mapStateToProps = state => ({
  articles: state.articles.many
})

const mapDispatchToProps = { readMany: articleReadManyRequest, articleEdit }

export default connect(mapStateToProps, mapDispatchToProps)(ArticleTable)