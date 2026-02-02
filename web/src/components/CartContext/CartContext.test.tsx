import { render } from '@redwoodjs/testing/web'

import CartContext from './CartContext'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CartContext', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CartContext />)
    }).not.toThrow()
  })
})
