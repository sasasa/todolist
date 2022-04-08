import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Todos from '@/views/Todos'
import * as TodoModule from '../store/TodoModuleMock'
import Todo from '@/components/Todo'
import TodoFinishBox from '@/components/TodoFinishBox'
import TodoDeleteLink from '@/components/TodoDeleteLink'

const localVue = createLocalVue()
// localVue.use(VueRouter)
localVue.use(Vuex)

const router = new VueRouter()

describe('Todos view', () => {
  let store
  let $router
  let $store
  let todo

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        TodoModule,
      }
    })
    $router = {
      push: jest.fn()
    }
    todo = {
      id: 1,
      content: 'test content',
    }
  })

  it('mount', () => {
    const wrapper = shallowMount(Todos, {
      store,
      router,
      localVue,
    })
    expect.assertions(2)
    expect(wrapper.isVueInstance()).toBe(true)
    // このテストは一番最初の it でないと通らないのでテストの順番を変えてはいけない
    expect(TodoModule.actions[TodoModule.ACTION_TYPES.GET_TODOS_ASYNC].mock.calls).toHaveLength(1)
  })
  describe('computed', () => {
    it('notFinishedTodos', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.notFinishedTodos).toEqual([
        {
          "id": 4,
          "content": "Vue.jsの勉強をする!!",
          "finished": false,
          "due_on": "2019-10-03"
        },
        {
          "id": 2,
          "content": "3キロ走る",
          "finished": false,
          "due_on": "2019-10-04"
        },
        {
          "id": 1,
          "content": "ちょっと筋トレする",
          "finished": false,
          "due_on": "2019-10-06"
        },
      ])
    })
    it('finishedTodos', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.finishedTodos).toEqual([
        {
          "content": "運動不足を解消する",
          "due_on": "2019-10-14",
          "finished": true,
          "id": 5
        },
        {
          "id": 3,
          "content": "牛乳を買う",
          "finished": true,
          "due_on": "2019-10-08"
        },
      ])
    })
    it('timeSortedTodos', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.timeSortedTodos).toEqual([
        {
          "id": 4,
          "content": "Vue.jsの勉強をする!!",
          "finished": false,
          "due_on": "2019-10-03"
        },
        {
          "id": 2,
          "content": "3キロ走る",
          "finished": false,
          "due_on": "2019-10-04"
        },
        {
          "id": 1,
          "content": "ちょっと筋トレする",
          "finished": false,
          "due_on": "2019-10-06"
        },
        {
          "id": 3,
          "content": "牛乳を買う",
          "finished": true,
          "due_on": "2019-10-08"
        },
        {
          "content": "運動不足を解消する",
          "due_on": "2019-10-14",
          "finished": true,
          "id": 5
        },
      ])
    })

    it('sortedTodos', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
      })
      expect(wrapper.vm.sortedTodos).toEqual([
        {
          "content": "運動不足を解消する",
          "due_on": "2019-10-14",
          "finished": true,
          "id": 5
        },
        {
          "id": 4,
          "content": "Vue.jsの勉強をする!!",
          "finished": false,
          "due_on": "2019-10-03"
        },
        {
          "id": 3,
          "content": "牛乳を買う",
          "finished": true,
          "due_on": "2019-10-08"
        },
        {
          "id": 2,
          "content": "3キロ走る",
          "finished": false,
          "due_on": "2019-10-04"
        },
        {
          "id": 1,
          "content": "ちょっと筋トレする",
          "finished": false,
          "due_on": "2019-10-06"
        },
      ])
    })

  })
  describe('methods', () => {
    describe('searchedTodos', () => {
      describe('fm.activeTab === "A" のとき', () => {
        it('fm.finished === "all" のとき', () => {
          const wrapper = shallowMount(Todos, {
            store,
            router,
            localVue,
          })
          wrapper.vm.fm.activeTab = 'A'
          wrapper.vm.fm.finished = 'all'
          expect(wrapper.vm.searchedTodos()).toEqual(wrapper.vm.sortedTodos)
        })
        it('fm.finished === "not_finished" のとき', () => {
          const wrapper = shallowMount(Todos, {
            store,
            router,
            localVue,
          })
          wrapper.vm.fm.activeTab = 'A'
          wrapper.vm.fm.finished = 'not_finished'
          expect(wrapper.vm.searchedTodos()).toEqual(wrapper.vm.notFinishedTodos)
        })
        it('fm.finished === "finished" のとき', () => {
          const wrapper = shallowMount(Todos, {
            store,
            router,
            localVue,
          })
          wrapper.vm.fm.activeTab = 'A'
          wrapper.vm.fm.finished = 'finished'
          expect(wrapper.vm.searchedTodos()).toEqual(wrapper.vm.finishedTodos)
        })
      })
      it('fm.activeTab === "B" のとき', () => {
        const mock = jest.fn()
        const wrapper = shallowMount(Todos, {
          store,
          router,
          localVue,
        })
        wrapper.setMethods({
          getTodosByTime: mock
        })
        wrapper.vm.fm.activeTab = 'B'
        wrapper.vm.searchedTodos()
        expect(mock).toHaveBeenCalled()
      })
    })

    describe('getTodosByTime(timeStr)', () => {
      it('timeStr="2019-10-07" のとき', () => {
        const wrapper = shallowMount(Todos, {
          store,
          router,
          localVue,
        })
        expect(wrapper.vm.getTodosByTime('2019-10-07')).toEqual([
          {
            "id": 3,
            "content": "牛乳を買う",
            "finished": true,
            "due_on": "2019-10-08"
          },
          {
            "content": "運動不足を解消する",
            "due_on": "2019-10-14",
            "finished": true,
            "id": 5
          },
        ])
      })
      it('timeStr="" のとき', () => {
        const wrapper = shallowMount(Todos, {
          store,
          router,
          localVue,
        })
        expect(wrapper.vm.getTodosByTime('')).toEqual([
          {
            "id": 4,
            "content": "Vue.jsの勉強をする!!",
            "finished": false,
            "due_on": "2019-10-03"
          },
          {
            "id": 2,
            "content": "3キロ走る",
            "finished": false,
            "due_on": "2019-10-04"
          },
          {
            "id": 1,
            "content": "ちょっと筋トレする",
            "finished": false,
            "due_on": "2019-10-06"
          },
          {
            "id": 3,
            "content": "牛乳を買う",
            "finished": true,
            "due_on": "2019-10-08"
          },
          {
            "content": "運動不足を解消する",
            "due_on": "2019-10-14",
            "finished": true,
            "id": 5
          },
        ])
      })
    })

    it('onNavigate', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })

      wrapper.vm.onNavigate({ todo })
      expect.assertions(2)
      expect($router.push.mock.calls).toHaveLength(1)
      expect($router.push).toHaveBeenCalledWith(`/edit/${todo.id}`)
    })

    it('onFinish', () => {
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })

      wrapper.vm.onFinish({ todo })
      expect(TodoModule.actions[TodoModule.ACTION_TYPES.UPDATE_TODO_ASYNC].mock.calls).toHaveLength(1)
      expect(TodoModule.actions[TodoModule.ACTION_TYPES.UPDATE_TODO_ASYNC].mock.calls[0][1]).toEqual({ todo })
    })

    describe('onDelete', () => {
      describe('confirm false の時', () => {
        beforeEach(() => {
          window.confirm = jest.fn(() => false)
        })
        it('メソッドが呼び出されない', () => {
          const wrapper = shallowMount(Todos, {
            store,
            router,
            localVue,
            mocks: {
              $router,
            }
          })
          wrapper.vm.onDelete({ todo })
          expect(window.confirm).toBeCalled()
          expect(TodoModule.actions[TodoModule.ACTION_TYPES.REMOVE_TODO_ASYNC]).not.toBeCalled()
        })
      })
      describe('confirm true の時', () => {
        beforeEach(() => {
          window.confirm = jest.fn(() => true)
        })
        it('メソッドが呼び出される', () => {
          const wrapper = shallowMount(Todos, {
            store,
            router,
            localVue,
            mocks: {
              $router,
            }
          })
          wrapper.vm.onDelete({ todo })
          expect(window.confirm).toBeCalled()
          expect(TodoModule.actions[TodoModule.ACTION_TYPES.REMOVE_TODO_ASYNC].mock.calls).toHaveLength(1)
          expect(TodoModule.actions[TodoModule.ACTION_TYPES.REMOVE_TODO_ASYNC].mock.calls[0][1]).toEqual({ todo })
        })
      })
    })

  })

  describe('template', () => {
    it('@finish=onFinish', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })
      wrapper.setMethods({
        onFinish: mock
      })
      const todoFinishBox = wrapper.find(TodoFinishBox)
      todoFinishBox.vm.$emit('finish')
      expect(mock).toHaveBeenCalled()
    })

    it('@navigate=onNavigate', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })
      wrapper.setMethods({
        onNavigate: mock
      })
      const t = wrapper.find(Todo)
      t.vm.$emit('navigate')
      expect(mock).toHaveBeenCalled()
    })

    it('@delete=onDelete', () => {
      const mock = jest.fn()
      const wrapper = shallowMount(Todos, {
        store,
        router,
        localVue,
        mocks: {
          $router,
        }
      })
      wrapper.setMethods({
        onDelete: mock
      })
      const todoDeleteLink = wrapper.find(TodoDeleteLink)
      todoDeleteLink.vm.$emit('delete')
      expect(mock).toHaveBeenCalled()
    })


    it('snapshot', () => {
      const wrapper = shallowMount(Todos, {
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