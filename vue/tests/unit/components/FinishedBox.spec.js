import { shallowMount, mount, createLocalVue } from '@vue/test-utils'

import FinishedBox from '@/components/FinishedBox'

describe('FinishedBox component', () => {
  let props
  beforeEach(() => {
    props = {
      value: 'finished',
      notFinishedTodosCount: 8,
      todosCount: 10,
    }
  })

  it('mount', () => {
    const wrapper = shallowMount(FinishedBox, {
      propsData: props,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('notFinishedTodosCount', () => {
    const wrapper = shallowMount(FinishedBox, {
      propsData: props,
    })
    expect(wrapper.find('.not-finished-todos-count').text()).toBe(String(props.notFinishedTodosCount))
  })

  it('todosCount', () => {
    const wrapper = shallowMount(FinishedBox, {
      propsData: props,
    })
    expect(wrapper.find('.todos-count').text()).toBe(String(props.todosCount))
  })

  describe('イベント', () => {
    it('input イベントハンドラーが設定されているか finished => all', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: props,
      })
      wrapper.vm.finished = 'all'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('all')
    })

    it('input イベントハンドラーが設定されているか finished => not_finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: props,
      })
      wrapper.vm.finished = 'not_finished'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('not_finished')
    })

    it('input イベントハンドラーが設定されているか all => finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'all',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'finished'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('finished')
    })

    it('input イベントハンドラーが設定されているか all => not_finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'all',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'not_finished'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('not_finished')
    })

    it('input イベントハンドラーが設定されているか not_finished => all', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'not_finished',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'all'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('all')
    })

    it('input イベントハンドラーが設定されているか not_finished => finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'not_finished',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'finished'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('finished')
    })

    it('input 同一の値に変更した時はイベントハンドラーが動かない finished => finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'finished',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'finished'
      expect(wrapper.emitted('input')).toBeUndefined()
    })

    it('input 同一の値に変更した時はイベントハンドラーが動かない not_finished => not_finished', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'not_finished',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'not_finished'
      expect(wrapper.emitted('input')).toBeUndefined()
    })

    it('input 同一の値に変更した時はイベントハンドラーが動かない all => all', () => {
      const wrapper = shallowMount(FinishedBox, {
        propsData: {
          value: 'all',
          notFinishedTodosCount: 8,
          todosCount: 10,
        },
      })
      wrapper.vm.finished = 'all'
      expect(wrapper.emitted('input')).toBeUndefined()
    })
  })
})


