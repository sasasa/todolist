import { shallowMount } from '@vue/test-utils'
import { TodoFinishBox } from '@/components'

describe('TodoFinishBox component', () => {
  describe('Initialize', () => {
    let props
    beforeEach(() => {
      props = {
        todo: {
          id: 1,
          content: 'test content',
          due_on: '2019-10-07',
          finished: false,
        }
      }
    })

    it('mount', () => {
      const wrapper = shallowMount(TodoFinishBox, {
        propsData: props,
      })
      expect(wrapper.isVueInstance()).toBe(true)
    })

    it('basic props', () => {
      const wrapper = shallowMount(TodoFinishBox, {
        propsData: props,
      })
      const input = wrapper.find('input')
      const inputAttributes = input.attributes()
      
      expect.assertions(2)
      expect(inputAttributes.type).toBe('checkbox')
      expect(input.element.checked).toBe(props.todo.finished)
    })

    it('click イベントハンドラーが設定されているか', () => {
      const wrapper = shallowMount(TodoFinishBox, {
        propsData: props,
      })
      const input = wrapper.find('input')
      input.trigger('click')

      expect.assertions(2)
      expect(wrapper.emitted('finish')).toHaveLength(1)
      expect(wrapper.emitted('finish')[0][0]).toEqual({
        todo: {
          id: 1,
          content: 'test content',
          due_on: '2019-10-07',
          finished: true,
        }
      })

    })
  })
})