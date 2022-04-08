import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from '@/views/Home'
import * as TodoModule from '../store/TodoModuleMock'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

const router = new VueRouter()

describe('Home view', () => {
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        TodoModule,
      }
    })
  })

  it('mount', () => {
    const wrapper = shallowMount(Home, {
      store,
      router,
      localVue,
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})