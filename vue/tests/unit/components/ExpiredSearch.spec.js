import { shallowMount, mount, createLocalVue } from '@vue/test-utils'

import ExpiredSearch from '@/components/ExpiredSearch'
import flushPromises from 'flush-promises'

describe('ExpiredSearch component', () => {
  let props
  beforeEach(() => {
    props = {
      value: '2019-10-21',
    }
  })

  it('mount', () => {
    const wrapper = shallowMount(ExpiredSearch, {
      propsData: props,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })


  describe('イベント', () => {
    it('input イベントハンドラーが設定されているか', () => {
      const wrapper = shallowMount(ExpiredSearch, {
        propsData: props,
      })
      wrapper.vm.expiredStr = '2019-10-22'
      expect.assertions(2)
      expect(wrapper.emitted('input')).toHaveLength(1)
      expect(wrapper.emitted('input')[0][0]).toEqual('2019-10-22')
    })

    it('input 同一の値に変更した時はイベントハンドラーが動かない', () => {
      const wrapper = shallowMount(ExpiredSearch, {
        propsData: props,
      })
      wrapper.vm.expiredStr = '2019-10-21'
      expect(wrapper.emitted('input')).toBeUndefined()
    })
  })
})


