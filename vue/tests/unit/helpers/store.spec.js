import * as store from '@/helpers/store'

describe('Store helpers', () => {
  describe('buildModuleTypes', () => {
    it('/で区切った文字列ができる', () => {
      const moduleName = 'modleName'
      const types = {
        SET_NAME: 'SET_NAME',
        SET_EMAIL: 'SET_EMAIL',
      }
      const moduleTypes = store.buildModuleTypes({
        moduleName,
        types,
      })

      expect.assertions(2)
      expect(moduleTypes.SET_NAME).toEqual('modleName/SET_NAME')
      expect(moduleTypes.SET_EMAIL).toEqual('modleName/SET_EMAIL')
    })
  })
})