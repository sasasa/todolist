
import App from '@/App.vue'
import flushPromises from 'flush-promises'

import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import * as TodoModule from './store/TodoModuleMock'
import * as LoginModule from './store/LoginModuleMock'
import FormTodoStub from './components/FormTodoStub.vue'
// import TodosStub from './components/TodosStub.vue'

import router from './router'
import { ValidationProvider, ValidationObserver, localize, extend } from 'vee-validate';
import { required, min } from 'vee-validate/dist/rules'
import ja from 'vee-validate/dist/locale/ja.json'
extend('required', {
  ...required,
})
extend('min', {
  ...min,
})
localize('ja', ja)


const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
// localVue.component('validation-provider', ValidationProvider)
// localVue.component('validation-observer', ValidationObserver)

describe('App.vue', () => {

  describe('ログアウト時', () => {
    let store
    beforeEach(() => {
      LoginModule.state.login = false
      router.authed = jest.fn(() => false)
      store = new Vuex.Store({
        modules: {
          TodoModule,
          LoginModule,
        }
      })
    })
    it('Home ホームが表示される', () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      expect(wrapper.text()).toMatch("Home")
    })

    it('Signup リンクをクリックすると Signup ページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => false)
      })
      expect(wrapper.find('a[href="/signup"]').isVisible()).toBe(true)
      wrapper.find('a[href="/signup"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("サインアップ")
    })

    it('Login リンクをクリックすると Login ページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => false)
      })
      expect(wrapper.find('a[href="/login"]').isVisible()).toBe(true)
      wrapper.find('a[href="/login"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("ログイン")
    })

    it('Logout リンクが表示されない', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => false)
      })
      expect(wrapper.find('a[href="/logout"]').isVisible()).toBe(false)
    })

    it('Home リンクをクリックすると Home ホームページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => false)
      })
      expect(wrapper.find('a[href="/"]').isVisible()).toBe(true)
      wrapper.find('a[href="/"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("Home")
    })
  
    it('Todos リンクが表示されない', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => false)
      })
      expect(wrapper.find('a[href="/todos"]').isVisible()).toBe(false)
    })
  })

  describe('ログイン時', () => {
    let store
    beforeEach(() => {
      LoginModule.state.login = true
      router.authed = jest.fn(() => true)
      store = new Vuex.Store({
        modules: {
          TodoModule,
          LoginModule,
        }
      })
    })
    it('Home ホームが表示される', () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      expect(wrapper.text()).toMatch("Home")
    })
  
    it('Home リンクをクリックすると Home ホームページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/"]').isVisible()).toBe(true)
      wrapper.find('a[href="/"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("Home")
    })

    it('Signup リンクが表示されない', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/signup"]').isVisible()).toBe(false)
    })

    it('Login リンクが表示されない', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/login"]').isVisible()).toBe(false)
    })

    it('Logout リンクが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/logout"]').isVisible()).toBe(true)
    })

    it('Todos リンクをクリックすると Todos リストページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/todos"]').isVisible()).toBe(true)
      wrapper.find('a[href="/todos"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("Todos")
    })
    //vee-validateのせいで Add を表示できないのでひとまずスタブを表示する
    it('リンクをクリックすると Add 追加ページが表示される', async () => {
      const wrapper = mount(App, {
        sync: false,
        stubs: {
          FormTodo: FormTodoStub
        },
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      wrapper.find('a[href="/add"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("Add")
    })

    it('アクセスすると Edit 編集ページが表示される', async () => {
      const wrapper = mount(App, {
        localVue,
        router,
        store,
      })
      wrapper.setMethods({
        isAuthed: jest.fn(() => true)
      })
      expect(wrapper.find('a[href="/todos"]').isVisible()).toBe(true)
      wrapper.find('a[href="/todos"]').trigger('click')
      await flushPromises()
      expect(wrapper.text()).toMatch("Todos")

      // wrapper.vm.$router.push('/edit/1')

      wrapper.find('.todo').trigger('click')
      await flushPromises()

      expect(wrapper.text()).toMatch("Edit")
    })
  })
})
