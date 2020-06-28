let statics = {
  payTable: {
    allSame: {
      cherry: {
        top: 2000,
        center: 1000,
        bottom: 4000
      },
      seven: {
        top:  150,
        center: 150,
        bottom: 150
      },
      bar2: {
        top: 20,
        center: 20,
        bottom: 20
      },
      bar: {
        top: 10,
        center: 10,
        bottom: 10
      },
      bar3: {
        top: 50,
        center: 50,
        bottom: 50
      }
    },
    combination: {
      bar: {
        prize: 5,
        combineWith: null
      },
      cherry: {
        prize: 75,
        combineWith: 'seven'
      },
      seven: {
        prize: 75,
        combineWith: 'cherry'
      }
    }
  }
}