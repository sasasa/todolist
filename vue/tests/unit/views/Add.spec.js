import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Add from '@/views/Add'
import * as TodoModule from '../store/TodoModuleMock'
import * as LoginModule from '../store/LoginModuleMock'
import FormTodo from '@/components/FormTodo'


const localVue = createLocalVue()
// localVue.use(VueRouter)
localVue.use(Vuex)

const router = new VueRouter()

describe('Add view', () => {
  let store
  let $router
  let $store
  let todo

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        TodoModule,
        LoginModule,
      }
    })
    $router = {
      push: jest.fn()
    }
    todo = {
      id: 1,
      content: 'content test',
      due_on: '2019-10-5',
      finished: false,
    }
  })

  it('mount', () => {
    const wrapper = shallowMount(Add, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })

  describe('methods', () => {
    it('onSubmit', () => {
      const wrapper = shallowMount(Add, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })
      const user = LoginModule.getters[LoginModule.GETTER_TYPES.USER](LoginModule.state)

      wrapper.vm.onSubmit({ todo })
      expect.assertions(2)
      expect(TodoModule.actions[TodoModule.ACTION_TYPES.ADD_TODO_ASYNC].mock.calls).toHaveLength(1)
      expect(TodoModule.actions[TodoModule.ACTION_TYPES.ADD_TODO_ASYNC].mock.calls[0][1]).toEqual({ todo, user })
    })
  })

  describe('template', () => {
    it('@submit="onSubmit', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(Add, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })
      wrapper.setMethods({
        onSubmit: mock
      })
      const formTodo = wrapper.find(FormTodo)
      formTodo.vm.$emit('submit')
      expect(mock).toHaveBeenCalled()
    })

    it('snapshot', () => {
      const wrapper = shallowMount(Add, {
        store,
        router,
        localVue,
        mocks: {
          $router,
          $store,
        }
      })
      expect(wrapper.vm.$el).toMatchSnapshot()
    })
  })
})