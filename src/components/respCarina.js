let response = {
  analisis: {},
  datos: {},
  descripcion: '',
  cantidad: 3,
  ods: [
    {
      nombre: 'ods_9',
      metas: ['meta_9_1', 'meta_9_5'],
      porcentaje: 66.7,
      cantidad: 2
    },
    {
      nombre: 'ods_11',
      metas: ['meta_11_2'],
      porcentaje: 33.3,
      cantidad: 1
    }
  ],
  palabras: [
    {
      nombre: 'transporte',
      ods: [
        {
          nombre: 'ods_9',
          metas: ['meta_9_1', 'meta_9_5']
        },
        {
          nombre: 'ods_11',
          metas: ['meta_11_2']
        }
      ]
    }
  ]
}

console.log(response)
