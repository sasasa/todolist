import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '../router'
import Vuex from 'vuex'
import SendEmail from '@/views/SendEmail'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'




describe('SendEmail view', () => {
  let localVue
  let store
  let user
  let $router

  beforeEach(() => {
    localVue = createLocalVue()
    // localVue.use(VueRouter)
    localVue.use(Vuex)
    store = new Vuex.Store({
      modules: {
        TodoModule,
        LoginModule,
      }
    })
    $router = {
      push: jest.fn(),
    }
    user = LoginModule.getters[LoginModule.GETTER_TYPES.USER](LoginModule.state)
  })

  it('mount', () => {
    localVue.use(VueRouter)
    const wrapper = shallowMount(SendEmail, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  describe('computed -> watch', () => {
    it('success true', async() => {
      SendEmail.computed.success = () => LoginModule.getters[LoginModule.GETTER_TYPES.SEND_EMAIL_SUCCESS](LoginModule.state)
      const wrapper = shallowMount(SendEmail, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
        },
        stubs: ['router-link', 'router-view'],
      })
      expect(wrapper.vm.success).toBe(false)
      expect(wrapper.vm.open).toBe(false)

      LoginModule.mutations[LoginModule.MUTATION_TYPES.SEND_EMAIL_SUCCESS](LoginModule.state, { success: true })
      expect(wrapper.vm.success).toBe(true)
      // ここでwatchの処理が動いたかどうかをテストする

      await flushPromises()
      expect(wrapper.vm.user.email).toBe('')
      expect(wrapper.vm.open).toBe(true)
    })
  })

  describe('methods', () => {
    it('submitted', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(SendEmail, {
        store,
        router,
        localVue,
      })
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)

      wrapper.vm.submitted()
      expect.assertions(2)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.SEND_EMAIL_ASYNC].mock.calls).toHaveLength(1)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.SEND_EMAIL_ASYNC].mock.calls[0][1]).toEqual({ user: {
        email: user.email,
      } })
    })
  })

  describe('template', () => {
    it('@submit.prevent="submitted"', () => {
      localVue.use(VueRouter)
      const mock = jest.fn()
      const wrapper = shallowMount(SendEmail, {
        store,
        router,
        localVue,
      })
      wrapper.setMethods({
        submitted: mock
      })
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)

      wrapper.find('form').trigger('submit.prevent')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(SendEmail, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})