import { shallowMount } from '@vue/test-utils'
import { Todo } from '@/components'

describe('Todo component', () => {
  describe('Initialize', () => {
    let props
    beforeEach(() => {
      props = {
        todo: {
          id: 1,
          content: 'test content',
          due_on: '2019-10-07',
          finished: false,
        }
      }
    })

    it('mount', () => {
      const wrapper = shallowMount(Todo, {
        propsData: props,
      })
      expect(wrapper.isVueInstance()).toBe(true)
    })

    it('basic props', () => {
      const wrapper = shallowMount(Todo, {
        propsData: props,
      })
      const todo = wrapper.find('.todo')
      
      expect(todo.text()).toMatch(String(props.todo.id))
      expect(todo.text()).toMatch(props.todo.content)
      expect(todo.text()).toMatch(props.todo.due_on)
    })

    it('click のイベントハンドラーが設定されているか', () => {
      const wrapper = shallowMount(Todo, {
        propsData: props,
      })
      wrapper.find('.todo').trigger('click')
      
      expect.assertions(2)
      expect(wrapper.emitted('navigate')).toHaveLength(1)
      expect(wrapper.emitted('navigate')[0][0]).toEqual(props)
    })

    describe('Date.nowを固定してテスト', () => {
      // 日付を固定 2019/8/1 12:00:00
      const RealDate = Date
      beforeAll(() => {
        function mockDate(isoDate) {
          global.Date = class extends RealDate {
            constructor(...theArgs) {
              if (theArgs.length) {
                return new RealDate(...theArgs);
              }
              return new RealDate(isoDate);
            }
          
            static now() {
              return new RealDate(isoDate).getTime();
            }

            static parse(args) {
              return RealDate.parse(args)
            }
          }
        }
        mockDate('2019/8/1 12:00:00')
      })
      afterAll(() => {
        global.Date = RealDate
      });

      it('期限過ぎていたら赤くなる', () => {
        const wrapper = shallowMount(Todo, {
          propsData: {
            todo: {
              id: 1,
              content: 'test content',
              due_on: '2019-07-31',
              finished: false,
            }
          },
        })
        expect(wrapper.contains('.expired')).toBe(true)
      })
      it('当日は赤くなる', () => {
        const wrapper = shallowMount(Todo, {
          propsData: {
            todo: {
              id: 1,
              content: 'test content',
              due_on: '2019-08-01',
              finished: false,
            }
          },
        })
        expect(wrapper.contains('.expired')).toBe(true)
      })
      it('期限以内なら赤くならない', () => {
        const wrapper = shallowMount(Todo, {
          propsData: {
            todo: {
              id: 1,
              content: 'test content',
              due_on: '2019-08-02',
              finished: false,
            }
          },
        })
        expect(wrapper.contains('.expired')).toBe(false)
      })
    })

    it('終了済なら打消し線がでる', () => {
      const wrapper = shallowMount(Todo, {
        propsData: {
          todo: {
            id: 1,
            content: 'test content',
            due_on: '2019-12-10',
            finished: true,
          }
        },
      })
      expect(wrapper.contains('.done')).toBe(true)
    })

    it('未終了なら打消し線がでない', () => {
      const wrapper = shallowMount(Todo, {
        propsData: {
          todo: {
            id: 1,
            content: 'test content',
            due_on: '2019-12-10',
            finished: false,
          }
        },
      })
      expect(wrapper.contains('.done')).toBe(false)
    })

  })
})