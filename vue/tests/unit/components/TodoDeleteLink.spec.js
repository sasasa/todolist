import { shallowMount } from '@vue/test-utils'
import { TodoDeleteLink } from '@/components'

describe('TodoDeleteLink component', () => {
  describe('Initialize', () => {
    let props
    beforeEach(() => {
      props = {
        todo: {
          id: 1,
          content: 'test content',
          due_on: '2019-10-07',
          finished: true,
        }
      }
    })

    it('mount', () => {
      const wrapper = shallowMount(TodoDeleteLink, {
        propsData: props,
      })
      expect(wrapper.isVueInstance()).toBe(true)
    })
  
    it('basic props { finished: false } ならば表示されない', () => {
      const wrapper = shallowMount(TodoDeleteLink, {
        propsData: {
          todo: {
            id: 1,
            content: 'test content',
            due_on: '2019-10-07',
            finished: false,
          }
        },
      })
      
      expect(wrapper.isVisible()).toBe(false)
    })

    it('basic props { finished: true } ならば表示される', () => {
      const wrapper = shallowMount(TodoDeleteLink, {
        propsData: props,
      })
      
      expect(wrapper.isVisible()).toBe(true)
    })

    it('click イベントハンドラーが設定されているか', () => {
      const wrapper = shallowMount(TodoDeleteLink, {
        propsData: props,
      })
      const cmd = wrapper.find('.cmd')
      cmd.trigger('click')

      expect.assertions(2)
      expect(wrapper.emitted('delete')).toHaveLength(1)
      expect(wrapper.emitted('delete')[0][0]).toEqual(props)
    })
  })
})