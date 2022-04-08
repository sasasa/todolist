import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '../router'
import Vuex from 'vuex'
import Signup from '@/views/Signup'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'




describe('Signup view', () => {
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
    $route = {
      query: {
        backuri: '/add'
      }
    }
    user = LoginModule.getters[LoginModule.GETTER_TYPES.USER](LoginModule.state)
  })

  it('mount', () => {
    localVue.use(VueRouter)
    const wrapper = shallowMount(Signup, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  describe('computed -> watch', () => {
    it('errors', async() => {
      const errors = { name: ["を入力してください"], email: ["はメールの形式ではありません"], password: ["は8文字以上です"] }
      Signup.computed.errors = () => LoginModule.getters[LoginModule.GETTER_TYPES.SIGNUP_ERRORS](LoginModule.state)
      const wrapper = shallowMount(Signup, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
          $route,
        },
        stubs: ['router-link', 'router-view']
      })
      expect(wrapper.vm.errors).toEqual({})
      expect(wrapper.vm.error_name).toBe('')
      expect(wrapper.vm.error_email).toBe('')
      expect(wrapper.vm.error_password).toBe('')

      LoginModule.mutations[LoginModule.MUTATION_TYPES.SIGNUP_ERRORS](LoginModule.state, { errors })

      expect(wrapper.vm.errors).toEqual(errors)
      // ここでwatchの処理が動いたかどうかをテストする
      await flushPromises()
      
      expect(wrapper.vm.error_name).toBe('名前' + 'を入力してください')
      expect(wrapper.vm.error_email).toBe('メール' + 'はメールの形式ではありません')
      expect(wrapper.vm.error_password).toBe('パスワード' + 'は8文字以上です')
    })

    it('success true', async() => {
      Signup.computed.success = () => LoginModule.getters[LoginModule.GETTER_TYPES.SIGNUP_SUCCESS](LoginModule.state)
      const wrapper = shallowMount(Signup, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
          $route,
        },
        stubs: ['router-link', 'router-view']
      })
      expect(wrapper.vm.success).toBe(false)

      LoginModule.mutations[LoginModule.MUTATION_TYPES.SIGNUP_SUCCESS](LoginModule.state, { success: true })
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
      const wrapper = shallowMount(Signup, {
        store,
        router,
        localVue,
      })
      const input_name = wrapper.find('input[name="name"]')
      input_name.setValue(user.name)
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)
      const input_pass = wrapper.find('input[name="password"]')
      input_pass.setValue(user.password)

      wrapper.vm.submitted()
      expect.assertions(2)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.SIGNUP_ASYNC].mock.calls).toHaveLength(1)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.SIGNUP_ASYNC].mock.calls[0][1]).toEqual({ user: {
        name: user.name,
        email: user.email,
        password: user.password,
      } })
    })
  })

  describe('template', () => {
    it('@submit.prevent="submitted"', () => {
      localVue.use(VueRouter)
      const mock = jest.fn()
      const wrapper = shallowMount(Signup, {
        store,
        router,
        localVue,
      })
      wrapper.setMethods({
        submitted: mock
      })
      const input_name = wrapper.find('input[name="name"]')
      input_name.setValue(user.name)
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)
      const input_pass = wrapper.find('input[name="password"]')
      input_pass.setValue(user.password)

      wrapper.find('form').trigger('submit.prevent')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(Signup, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})