import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '../router'
import Vuex from 'vuex'
import ResetPassword from '@/views/ResetPassword'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'




describe('ResetPassword view', () => {
  let localVue
  let store
  let user
  let $router
  let $route

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
    const wrapper = shallowMount(ResetPassword, {
      store,
      router,
      localVue,
      propsData: {
        token: 'kkkkkkkkkkkkkkkkkkkkkkk'
      },
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  describe('computed -> watch', () => {
    it('errors', async() => {
      ResetPassword.computed.errors = () => LoginModule.getters[LoginModule.GETTER_TYPES.RESET_PASSWORD_ERRORS](LoginModule.state)
      const errors = {password: ["は8文字以上です。"], password_confirmation: ["がパスワードと異なります。"]}
      const wrapper = shallowMount(ResetPassword, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
        },
        stubs: ['router-link', 'router-view'],
        propsData: {
          token: 'kkkkkkkkkkkkkkkkkkkkkkk'
        },
      })
      expect(wrapper.vm.errors).toEqual({})
      expect(wrapper.vm.error_password).toBe('')
      expect(wrapper.vm.error_password_confirmation).toBe('')

      LoginModule.mutations[LoginModule.MUTATION_TYPES.RESET_PASSWORD_ERRORS](LoginModule.state, { errors })
      expect(wrapper.vm.errors).toEqual(errors)
      // ここでwatchの処理が動いたかどうかをテストする
      await flushPromises()
      expect(wrapper.vm.error_password).toBe('パスワード' + 'は8文字以上です。')
      expect(wrapper.vm.error_password_confirmation).toBe('パスワード(確認)' + 'がパスワードと異なります。')
    })

    it('success true', async() => {
      ResetPassword.computed.success = () => LoginModule.getters[LoginModule.GETTER_TYPES.RESET_PASSWORD_SUCCESS](LoginModule.state)
      const wrapper = shallowMount(ResetPassword, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
        },
        stubs: ['router-link', 'router-view'],
        propsData: {
          token: 'kkkkkkkkkkkkkkkkkkkkkkk'
        },
      })
      expect(wrapper.vm.success).toBe(false)

      LoginModule.mutations[LoginModule.MUTATION_TYPES.RESET_PASSWORD_SUCCESS](LoginModule.state, { success: true })
      expect(wrapper.vm.success).toBe(true)
      // ここでwatchの処理が動いたかどうかをテストする

      await flushPromises()

      expect($router.push.mock.calls).toHaveLength(1)
      expect($router.push.mock.calls[0][0]).toEqual('/login')
      
    })
  })

  describe('methods', () => {
    it('submitted', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(ResetPassword, {
        store,
        router,
        localVue,
        propsData: {
          token: 'kkkkkkkkkkkkkkkkkkkkkkk'
        },
      })
      const input_password = wrapper.find('input[name="password"]')
      input_password.setValue(user.password)
      const input_password_confirmation = wrapper.find('input[name="password_confirmation"]')
      input_password_confirmation.setValue(user.password)

      wrapper.vm.submitted()
      expect.assertions(2)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.RESET_PASSWORD_ASYNC].mock.calls).toHaveLength(1)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.RESET_PASSWORD_ASYNC].mock.calls[0][1]).toEqual({ user: {
        password: user.password,
        password_confirmation: user.password,
        reset_password_token: wrapper.props().token,
      } })
    })
  })

  describe('template', () => {
    it('@submit.prevent="submitted"', () => {
      localVue.use(VueRouter)
      const mock = jest.fn()
      const wrapper = shallowMount(ResetPassword, {
        store,
        router,
        localVue,
        propsData: {
          token: 'kkkkkkkkkkkkkkkkkkkkkkk'
        },
      })
      wrapper.setMethods({
        submitted: mock
      })
      const input_password = wrapper.find('input[name="password"]')
      input_password.setValue(user.password)
      const input_password_confirmation = wrapper.find('input[name="password_confirmation"]')
      input_password_confirmation.setValue(user.password)
      wrapper.find('form').trigger('submit.prevent')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(ResetPassword, {
        store,
        router,
        localVue,
        propsData: {
          token: 'kkkkkkkkkkkkkkkkkkkkkkk'
        },
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})