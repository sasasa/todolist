import { shallowMount, mount, createLocalVue } from '@vue/test-utils'

import TabBox from '@/components/TabBox'
import FinishedBox from '@/components/FinishedBox'
import ExpiredSearch from '@/components/ExpiredSearch'
import flushPromises from 'flush-promises'

describe('TabBox component', () => {
  let props
  beforeEach(() => {
    props = {
      fm: {
        expiredStr: '2019-10-21',
        finished: 'all',
        activeTab: 'A',
      },
      notFinishedTodosCount: 8,
      todosCount: 10,
    }
  })

  it('mount', () => {
    const wrapper = shallowMount(TabBox, {
      propsData: props,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('basic props A', () => {
    const wrapper = mount(TabBox, {
      propsData: props,
    })
    const allInput = wrapper.find('#all')
    expect(allInput.element.checked).toBeTruthy()
    expect(wrapper.vm.fm.finished).toBe(props.fm.finished)

    expect(wrapper.vm.fm.activeTab).toBe(props.fm.activeTab)
    const notFinishedTodosCount = wrapper.find('.not-finished-todos-count')
    expect(notFinishedTodosCount.text()).toMatch(String(props.notFinishedTodosCount))
    expect(wrapper.vm.notFinishedTodosCount).toBe(props.notFinishedTodosCount)
    const todosCount = wrapper.find('.todos-count')
    expect(todosCount.text()).toMatch(String(props.todosCount))
    expect(wrapper.vm.todosCount).toBe(props.todosCount)
  })

  it('basic props B', () => {
    props = {
      fm: {
        expiredStr: '2019-10-21',
        finished: 'all',
        activeTab: 'B',
      },
      notFinishedTodosCount: 8,
      todosCount: 10,
    }
    const wrapper = mount(TabBox, {
      propsData: props,
    })
    const dateInput = wrapper.find('#date')
    expect(dateInput.element.value).toMatch(props.fm.expiredStr)
    expect(wrapper.vm.fm.expiredStr).toBe(props.fm.expiredStr)
  })

  describe('methods', () => {
    describe('tabChange(currentTab)', () => {
      // テストコードでタブが切り替わらないのでAタブのみを検証
      it('currentTab="A" のとき', async () => {
        const wrapper = shallowMount(TabBox, {
          propsData: props,
        })
        wrapper.vm.tabChange('B')
        await flushPromises()
        wrapper.vm.tabChange('A')
        await flushPromises()
        const finishedBox = wrapper.find(FinishedBox)

        expect.assertions(2)
        expect(wrapper.vm.fm.activeTab).toBe('A')
        expect(finishedBox.isVisible()).toBeTruthy()
      })
      // テストコードでタブが切り替わらないのでBタブのみを検証
      it('currentTab="B" のとき', async () => {
        const wrapper = shallowMount(TabBox, {
          propsData: {
            fm: {
              expiredStr: '2019-10-21',
              finished: 'all',
              activeTab: 'B',
            },
            notFinishedTodosCount: 8,
            todosCount: 10,
          },
        })
        wrapper.vm.tabChange('A')
        await flushPromises()
        wrapper.vm.tabChange('B')
        await flushPromises()
        const expiredSearch = wrapper.find(ExpiredSearch)

        expect.assertions(2)
        expect(wrapper.vm.fm.activeTab).toBe('B')
        expect(expiredSearch.isVisible()).toBeTruthy()
      })
    })
  })

  describe('template', () => {
    it('.a @click=tabChange("A")', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(TabBox, {
        propsData: props,
      })
      wrapper.setMethods({
        tabChange: mock
      })
      const aTab = wrapper.find('.a')
      aTab.trigger('click')
      expect(mock).toHaveBeenCalled()
      expect(mock.mock.calls[0][0]).toBe('A')
    })
    it('.b @click=tabChange("B")', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(TabBox, {
        propsData: props,
      })
      wrapper.setMethods({
        tabChange: mock
      })
      const bTab = wrapper.find('.b')
      bTab.trigger('click')
      expect(mock).toHaveBeenCalled()
      expect(mock.mock.calls[0][0]).toBe('B')
    })
  })
})


