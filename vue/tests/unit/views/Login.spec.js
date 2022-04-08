import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '../router'
import Vuex from 'vuex'
import Login from '@/views/Login'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'




describe('Login view', () => {
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
    const wrapper = shallowMount(Login, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  describe('computed -> watch', () => {
    it('errors', async() => {
      Login.computed.errors = () => LoginModule.getters[LoginModule.GETTER_TYPES.ERRORS](LoginModule.state)
      const wrapper = shallowMount(Login, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
          $route,
        },
        stubs: ['router-link', 'router-view']
      })
      expect(wrapper.vm.errors).toEqual([])
      expect(wrapper.vm.error_message).toBe('')

      LoginModule.mutations[LoginModule.MUTATION_TYPES.ERRORS](LoginModule.state, { errors: ['メールアドレスまたはパスワードが間違っています'] })
      expect(wrapper.vm.errors).toEqual(['メールアドレスまたはパスワードが間違っています'])
      // ここでwatchの処理が動いたかどうかをテストする
      await flushPromises()
      expect(wrapper.vm.error_message).toBe('メールアドレスまたはパスワードが間違っています')
    })

    it('isAuthed true', async() => {
      Login.computed.isAuthed = () => LoginModule.getters[LoginModule.GETTER_TYPES.LOGIN](LoginModule.state)
      const wrapper = shallowMount(Login, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
          $route,
        },
        stubs: ['router-link', 'router-view']
      })
      expect(wrapper.vm.isAuthed).toBe(false)

      LoginModule.mutations[LoginModule.MUTATION_TYPES.LOGIN](LoginModule.state, { login: true })
      expect(wrapper.vm.isAuthed).toBe(true)
      // ここでwatchの処理が動いたかどうかをテストする

      await flushPromises()

      expect($router.push.mock.calls).toHaveLength(1)
      expect($router.push.mock.calls[0][0]).toEqual({ path: '/add' })
      
    })
  })

  describe('methods', () => {
    it('submitted', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(Login, {
        store,
        router,
        localVue,
      })
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)
      const input_pass = wrapper.find('input[name="password"]')
      input_pass.setValue(user.password)

      wrapper.vm.submitted({ user })
      expect.assertions(2)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.LOGIN_ASYNC].mock.calls).toHaveLength(1)
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.LOGIN_ASYNC].mock.calls[0][1]).toEqual({ user: {
        email: user.email,
        password: user.password,
      } })
    })
  })

  describe('template', () => {
    it('@submit.prevent="submitted"', () => {
      localVue.use(VueRouter)
      const mock = jest.fn()
      const wrapper = shallowMount(Login, {
        store,
        router,
        localVue,
      })
      wrapper.setMethods({
        submitted: mock
      })
      const input_email = wrapper.find('input[name="email"]')
      input_email.setValue(user.email)
      const input_pass = wrapper.find('input[name="password"]')
      input_pass.setValue(user.password)
      wrapper.find('form').trigger('submit.prevent')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(Login, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})