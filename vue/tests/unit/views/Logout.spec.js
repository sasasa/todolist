import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '../router'
import Vuex from 'vuex'
import Logout from '@/views/Logout'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'




describe('Logout view', () => {
  let localVue
  let store
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
    // LoginModule.actions[LoginModule.ACTION_TYPES.LOGOUT_ASYNC] = jest.fn()
  })
  
  describe('methods', () => {
    it('submitted', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(Logout, {
        store,
        router,
        localVue,
      })
      // 明示的に呼ばずとも mounted から呼ばれる
      // 順番を帰るとテストが失敗するためテストケースを動かさない
      expect(LoginModule.actions[LoginModule.ACTION_TYPES.LOGOUT_ASYNC].mock.calls).toHaveLength(1)
    })
  })

  it('mount', () => {
    localVue.use(VueRouter)
    const wrapper = shallowMount(Logout, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  describe('computed -> watch', () => {
    it('isAuthed false', async() => {
      Logout.computed.isAuthed = () => LoginModule.getters[LoginModule.GETTER_TYPES.LOGIN](LoginModule.state)
      const wrapper = shallowMount(Logout, {
        store,
        // router,
        localVue,
        mocks: {
          $router,
        },
        stubs: ['router-link', 'router-view']
      })
      LoginModule.mutations[LoginModule.MUTATION_TYPES.LOGIN](LoginModule.state, { login: true })
      expect(wrapper.vm.isAuthed).toBe(true)
      LoginModule.mutations[LoginModule.MUTATION_TYPES.LOGIN](LoginModule.state, { login: false })
      expect(wrapper.vm.isAuthed).toBe(false)
      
      // ここでwatchの処理が動いたかどうかをテストする
      await flushPromises()

      expect($router.push.mock.calls).toHaveLength(1)
      expect($router.push.mock.calls[0][0]).toEqual({ path: '/login' })
      
    })

  })

  describe('template', () => {
    it('@submit.prevent="submitted"', async() => {
      localVue.use(VueRouter)
      const mock = jest.fn()
      const wrapper = shallowMount(Logout, {
        store,
        router,
        localVue,
      })
      wrapper.setMethods({
        submitted: mock
      })

      wrapper.find('form').trigger('submit.prevent')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      localVue.use(VueRouter)
      const wrapper = shallowMount(Logout, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})