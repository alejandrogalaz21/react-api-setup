/* eslint-disable no-multi-str */
import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

export function HtmlEditor({ input, ...props }) {
  const handleEditorChange = e => {
    const content = e.target.getContent()
    input.onChange(content)
  }

  return (
    <Editor
      {...props}
      apiKey='4vnw7ophd36eg8zgchvljsm6qy3hvksolf32dz9o9pmebmsv'
      initialValue={input.value}
      init={{
        height: 650,
        menubar: true,
        plugins: [
          'advlist autolink lists link image',
          'charmap print preview anchor help',
          'searchreplace visualblocks code',
          'insertdatetime media table paste wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright image media | \
            bullist numlist outdent indent | help',
        video_template_callback: function (data) {
          return (
            '<video width="' +
            data.width +
            '" height="' +
            data.height +
            '"' +
            (data.poster ? ' poster="' + data.poster + '"' : '') +
            ' controls="controls">\n' +
            '<source src="' +
            data.source1 +
            '"' +
            (data.source1mime ? ' type="' + data.source1mime + '"' : '') +
            ' />\n' +
            (data.source2
              ? '<source src="' +
                data.source2 +
                '"' +
                (data.source2mime ? ' type="' + data.source2mime + '"' : '') +
                ' />\n'
              : '') +
            '</video>'
          )
        },
        image_title: true,
        automatic_uploads: true,

        file_picker_types: 'image',
        /* and here's our custom image picker*/
        file_picker_callback: function (cb, value, meta) {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')

          input.onchange = function () {
            const file = this.files[0]

            const reader = new FileReader()
            reader.onload = function () {
              const id = 'blobid' + new Date().getTime()
              const blobCache = window.tinymce.activeEditor.editorUpload.blobCache
              const base64 = reader.result.split(',')[1]
              const blobInfo = blobCache.create(id, file, base64)
              blobCache.add(blobInfo)

              cb(blobInfo.blobUri(), { title: file.name })
            }
            reader.readAsDataURL(file)
          }
          input.click()
        }
      }}
      onChange={handleEditorChange}
    />
  )
}
