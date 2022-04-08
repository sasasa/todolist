import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import { FormTodo } from '@/components'
import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import { required, min } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'
import flushPromises from 'flush-promises'

extend('required', {
  ...required,
})
extend('min', {
  ...min,
})
localize('ja', ja)

const localVue = createLocalVue()
// localVue.component('ValidationProvider', ValidationProvider)
// localVue.component('ValidationObserver', ValidationObserver)

describe('FormTodo component', () => {
  describe('Initialize', () => {
    let props
    beforeEach(() => {
      props = {
        submitWord: 'test submit',
        fm: {
          id: 1,
          content: 'test content',
          due_on: '2019-10-07',
          finished: false,
        }
      }
    })

    it('mount', () => {
      const wrapper = shallowMount(FormTodo, {
        propsData: props,
        localVue,
      })
      expect(wrapper.isVueInstance()).toBe(true)
    })

    it('basic props', async () => {
      const wrapper = shallowMount(FormTodo, {
        propsData: props,
        localVue,
        sync: false,
      })
      await flushPromises()
 
      const inputContent = wrapper.find('input[name="content"]')
      // vee-validate 配下の要素は取得できない。
    })
    
  })
})